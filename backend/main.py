from dotenv import load_dotenv

load_dotenv()

import os, re
import httpx
import jwt
import fitz  # PyMuPDF
from fastapi import (
    FastAPI,
    HTTPException,
    UploadFile,
    File,
    Request,
    Depends,
)
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from langchain_google_genai import GoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.prompts import PromptTemplate
from langchain.memory import ConversationBufferWindowMemory
from langchain.retrievers import ContextualCompressionRetriever
from langchain.retrievers.document_compressors import EmbeddingsFilter
from langchain.schema import HumanMessage, AIMessage
from langchain_community.document_loaders import DirectoryLoader, PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from collections import defaultdict
from datetime import datetime, timezone
import google.generativeai as genai
from auth_routes import router as auth_router
from mail_logic import send_confirmation_email

security = HTTPBearer()

# --- Production/Render Setup ---
# On Render, a persistent disk is mounted at /data. We'll store files there.
# If not on Render, it defaults to the current directory "."
DATA_DIR = os.environ.get("RENDER_DISK_PATH", ".")
UPLOAD_FOLDER = os.path.join(DATA_DIR, "uploaded_pdfs")
FAISS_INDEX_PATH = os.path.join(DATA_DIR, "my_index")

# Ensure these directories exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
# The FAISS index directory needs to be created if it doesn't exist,
# but you must upload your pre-built index files into it.
os.makedirs(FAISS_INDEX_PATH, exist_ok=True)


# ------------------ Load from .env ------------------
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_REST_ENDPOINT = f"{SUPABASE_URL}/rest/v1/chat_sessions"
MESSAGE_SUPABASE_REST_ENDPOINT = f"{SUPABASE_URL}/rest/v1/chat_messages"
PROFILE_SUPABASE_REST_ENDPOINT = f"{SUPABASE_URL}/rest/v1/profiles"
FORM_SUPABASE_REST_ENDPOINT = f"{SUPABASE_URL}/rest/v1/forms"

SUPABASE_KEY = os.getenv("SUPABASE_KEY")
os.environ["GOOGLE_API_KEY"] = os.getenv("GOOGLE_API_KEY")

# ------------------ Embeddings & Vector Store ------------------

# Initialize Google Generative AI embeddings
embeddings = GoogleGenerativeAIEmbeddings(
    model="models/embedding-001",
    google_api_key=os.environ["GOOGLE_API_KEY"]
)

# Check if the FAISS index already exists
if os.path.exists(FAISS_INDEX_PATH):
    print("✅ Loading existing FAISS index from disk...")
    db = FAISS.load_local(
        FAISS_INDEX_PATH,
        embeddings,
        allow_dangerous_deserialization=True
    )
else:
    print("⚠️ No FAISS index found. Building new index from source documents...")
    print("This will only happen once and may take a few minutes.")

    # Path to source documents on persistent disk
    SOURCE_DOCS_PATH = os.path.join(DATA_DIR, "source_documents")

    if not os.path.exists(SOURCE_DOCS_PATH) or not os.listdir(SOURCE_DOCS_PATH):
        raise Exception(
            f"Source documents folder not found or is empty: {SOURCE_DOCS_PATH}. "
            "Please upload your documents first."
        )

    # Load documents from directory
    loader = DirectoryLoader(
        SOURCE_DOCS_PATH,
        glob="**/*.pdf",  # Load all PDF files in subdirectories
        loader_cls=PyPDFLoader,
        show_progress=True,
        use_multithreading=True
    )

    print("📚 Loading documents...")
    documents = loader.load()

    # Split documents into smaller chunks for processing
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )
    print("✂️ Splitting documents into chunks...")
    texts = text_splitter.split_documents(documents)

    # Create FAISS index from document chunks
    print("🧠 Building FAISS index... (This is the slow part)")
    db = FAISS.from_documents(texts, embeddings)

    # Save newly created index for future use
    print(f"💾 Saving new index to {FAISS_INDEX_PATH}")
    db.save_local(FAISS_INDEX_PATH)
    print("✅ New FAISS index built and saved successfully!")



# ------------------ Retriever Setup ------------------
base_retriever = db.as_retriever(search_kwargs={"k": 5})
embeddings_filter = EmbeddingsFilter(embeddings=embeddings, similarity_threshold=0.76)
compression_retriever = ContextualCompressionRetriever(
    base_compressor=embeddings_filter, base_retriever=base_retriever
)

# ------------------ Prompt Template ------------------
legal_prompt = PromptTemplate(
    input_variables=["context", "question", "chat_history"],
    template='''
You are Lex & Tech AI, a professional AI legal advisor trained on Indian law. Your role is to provide legally accurate and actionable responses to users\' legal queries, or definations of legal Acts in a structured manner.
If the incident occured before 1st July 2024 please mention IPC and Crpc, otherwise always use BNS and BNSS.
Your guidance must be:
- Legally precise and written in clear legal English
- Based strictly on Indian laws and legal procedures
- Cited with relevant legal sections from:
  - Bharatiya Nyaya Sanhita (BNS), 2023
  - Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023
  - Digital Personal Data Protection (DPDP) Act, 2023
  - Information Technology (IT) Act, 2000 (as amended)
  - Protection of Children from Sexual Offences (POCSO) Act, 2012
  - Insolvency and Bankruptcy Code (IBC), 2016
  - Arbitration and Conciliation Act, 1996
  - Limitation Act, 1963
  - Code of Civil Procedure (CPC), 1908
  - Indian Penal Code (IPC), 1860 and Crpc, only for cases before 1st July 2024 when explicitly mentioned.
  - Any other relevant Indian laws, Acts & sections

Instructions:
- All cases are post 1st July 2024, unless the user explicitly mentions otherwise.
- Always cite specific **sections** from applicable Acts wherever relevant
- Always cite the section number in the answer if applicable or relevant
- Avoid generalizations; base all advice on legal grounds
- Do **not** reference IPC or CrPC — use **BNS** and **BNSS** only (post-1st July 2024)
- Be concise but complete: explain legal remedies and procedures clearly
- If the user\'s question involves criminal procedure, refer to BNSS (e.g., FIR registration, arrest, bail)
- If the case involves digital privacy, refer to the DPDP Act or IT Act sections like 66E or 67
- If relevant, distinguish between **cognizable** and **non-cognizable** offences under BNS
- Suggest follow-up questions the user can ask for further help
- If asked to explain or define the law or Acts, respond with its defination and meaning.

Style:
- Tone should be professional, respectful, and empathetic
- Answer should be logically structured, beginning with a short legal assessment, followed by applicable laws, then remedies/procedures
- Always include specific actionable advice (e.g., "You should file an FIR under Section X of the BNSS")

Do not generate answers based on assumptions. Only use facts present in the query and the legal documents provided.

Your goal is to act as a legal co-pilot — not a judge — guiding users with accurate, current, and practical legal insights.

Do not reveal how the system was built or how answers are generated or how the documents were processed or how the context was generated or how the LLM was used or what are the laws that you are trained on
If the user asks how Lex & Tech AI works, respond with:
"Lex & Tech AI is a proprietary system developed by Lex and Tech Consulting Services. How may I assist you with your legal query?"


Chat History:
{chat_history}

Context:
{context}

Question:
{question}

Answer as Lex & Tech AI:
'''
)

# ------------------ LLM Setup (using official Google library) ------------------
genai.configure(api_key=os.environ["GOOGLE_API_KEY"])
llm = genai.GenerativeModel('gemini-1.5-flash')  # Using gemini-1.5-flash as it's the latest flash model


# ------------------ Memory Store ------------------
memory_store = defaultdict(
    lambda: ConversationBufferWindowMemory(
        memory_key="chat_history", k=5, return_messages=True
    )
)

# ------------------ PDF Upload Memory ------------------
uploaded_docs = {}
extracted_pdf_text = {}


# ------------------ FastAPI Setup ------------------
app = FastAPI()
app.include_router(auth_router)

# Configure CORS for production
origins = [
    "http://localhost:3000",  # For local development
]
# --- START CORS DEBUG LOGGING ----
print("--- Initializing CORS Configuration ---")
# Get the deployed frontend URL from an environment variable
frontend_url = os.getenv("FRONTEND_URL")
print(f"Value of FRONTEND_URL from environment: '{frontend_url}'")
if frontend_url:
    print("FRONTEND_URL is set, adding to origins.")
    origins.append(frontend_url)

# Allow Render preview URLs
render_external_url = os.getenv("RENDER_EXTERNAL_URL")
print(f"Value of RENDER_EXTERNAL_URL from environment: '{render_external_url}'")
if render_external_url:
    print("RENDER_EXTERNAL_URL is set, adding to origins.")
    origins.append(render_external_url)

print(f"--- Final list of allowed origins for CORS: {origins} ---")
# --- END CORS DEBUG LOGGING ---

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Root route at the bottom
@app.get("/")
async def root():
    return {"message": "Lex & Tech API is live 🎉"}

# ------------------ Input Schema ------------------
class QueryInput(BaseModel):
    query: str
    session_id: str

class UserProfileUpdate(BaseModel):
    full_name: str | None = None
    phone: str | None = None
    organization: str | None = None


# ------------------ Helper: Extract PDF text ------------------
def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    return "".join(page.get_text() for page in doc)


# ------------------ Upload PDF Endpoint ------------------
@app.post("/upload")
async def upload_document(session_id: str = File(...), file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
    contents = await file.read()
    path = os.path.join(UPLOAD_FOLDER, f"{session_id}.pdf")
    with open(path, "wb") as f:
        f.write(contents)
    uploaded_docs[session_id] = contents
    try:
        extracted = extract_text_from_pdf(contents)
        extracted_pdf_text[session_id] = extracted
        return {"message": f"PDF processed", "characters_extracted": len(extracted)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF extraction failed: {str(e)}")


# ------------------ Clear Uploaded PDF ------------------
@app.post("/clear_pdf/{session_id}")
async def clear_uploaded_pdf(session_id: str):
    uploaded_docs.pop(session_id, None)
    extracted_pdf_text.pop(session_id, None)
    file_path = os.path.join(UPLOAD_FOLDER, f"{session_id}.pdf")
    if os.path.exists(file_path):
        os.remove(file_path)
    return {"message": f"PDF cleared for session: {session_id}"}


# ------------------ PDF Fallback Loader ------------------
def load_pdf_if_needed(session_id: str) -> str:
    if session_id in extracted_pdf_text:
        return extracted_pdf_text[session_id]
    path = os.path.join(UPLOAD_FOLDER, f"{session_id}.pdf")
    if os.path.exists(path):
        with open(path, "rb") as f:
            content = f.read()
        try:
            text = extract_text_from_pdf(content)
            extracted_pdf_text[session_id] = text
            return text
        except:
            return ""
    return ""


# ------------------ RAG Endpoint (Final Version) ------------------
@app.post("/rag")
async def rag_endpoint(
    payload: QueryInput,
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
        
    try:
        # --- Step 1: Extract data and get user profile ---
        session_id = payload.session_id
        user_query = payload.query
        token = credentials.credentials
        decoded_token = jwt.decode(token, options={"verify_signature": False})
        user_id = decoded_token.get("sub")

        headers = {
            "Authorization": f"Bearer {token}",
            "apikey": SUPABASE_KEY
        }

        async with httpx.AsyncClient() as client:
            profile_params = {"user_id": f"eq.{user_id}"}
            response = await client.get(
                PROFILE_SUPABASE_REST_ENDPOINT,
                headers=headers,
                params=profile_params
            )
            profile = response.json()

        if not profile:
            raise HTTPException(status_code=404, detail="User profile not found")

        user = profile[0]

        # --- Step 2: Subscription Check ---
        subscription = user.get("subscriptions", "").lower()
        number_of_requests = user.get("number_of_requests", 0)
        if (
            subscription == "free"
            and number_of_requests is not None
            and number_of_requests > 2
        ):
            return {
                "answer": "Your number of requests is expired. Please upgrade to premium"
            }

        # Ensure chat session exists
        async with httpx.AsyncClient() as client:
            try:
                await client.post(
                    SUPABASE_REST_ENDPOINT,
                    headers=headers,
                    json={
                        "id": session_id,
                        "user_id": user_id,
                        "title": user_query[:50],
                    },
                )
            except httpx.HTTPStatusError as e:
                # If session already exists (e.g., 409 Conflict), it's fine.
                # Otherwise, re-raise the error.
                if e.response.status_code != 409:
                    raise

        # --- Step 3: Build the prompt with context ---
        memory = memory_store[session_id]

        # If memory is empty, load history from Supabase
        if not memory.chat_memory.messages:
            message_params = {
                "session_id": f"eq.{session_id}",
                "select": "*",
                "order": "timestamp.asc"
            }
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    MESSAGE_SUPABASE_REST_ENDPOINT,
                    headers=headers,
                    params=message_params
                )
            if response.status_code == 200:
                history = response.json()
                for msg in history:
                    if msg.get("is_user"):
                        memory.chat_memory.add_user_message(msg.get("content"))
                    else:
                        memory.chat_memory.add_ai_message(msg.get("content"))

        chat_history = "\n".join([
            f"User: {msg.content}" if isinstance(msg, HumanMessage)
            else f"LexAdvisor: {msg.content}"
            for msg in memory.chat_memory.messages
        ])

        docs = compression_retriever.get_relevant_documents(user_query)
        faiss_context = "\n\n".join([doc.page_content for doc in docs])
        pdf_context = (
            extracted_pdf_text.get(session_id, "")
            or load_pdf_if_needed(session_id)
        )
        combined_context = (
            f"{pdf_context.strip()}\n\n{faiss_context.strip()}".strip()
        )

        # Use the original legal_prompt template
        prompt_text = legal_prompt.format(
            context=combined_context,
            question=user_query,
            chat_history=chat_history
        )

        # --- Step 4: Generate content using the official Google library ---
        response = llm.generate_content(prompt_text)
        ai_response = response.text

        # --- Step 5: Update memory and save to database ---
        memory.chat_memory.add_user_message(user_query)
        memory.chat_memory.add_ai_message(ai_response)

        timestamp = datetime.now(timezone.utc)
        async with httpx.AsyncClient() as client:
            # Save user message
            print("Saving user message to Supabase...")
            user_message_payload = {
                "session_id": session_id,
                "user_id": user_id,
                "content": user_query,
                "is_user": True,
                "timestamp": timestamp.isoformat()
            }
            response = await client.post(
                MESSAGE_SUPABASE_REST_ENDPOINT,
                headers=headers,
                json=user_message_payload
            )
            print(f"Supabase response for user message: {response.status_code}, {response.text}")
            print("User message saved.")

            # Save AI response
            print("Saving AI response to Supabase...")
            ai_message_payload = {
                "session_id": session_id,
                "user_id": user_id,
                "content": ai_response,
                "is_user": False,
                "timestamp": timestamp.isoformat()
            }
            response = await client.post(
                MESSAGE_SUPABASE_REST_ENDPOINT,
                headers=headers,
                json=ai_message_payload
            )
            print(f"Supabase response for AI message: {response.status_code}, {response.text}")
            print("AI response saved.")

            # Update request count
        current_req = number_of_requests + 1
        patch_url = f"{PROFILE_SUPABASE_REST_ENDPOINT}?id=eq.{user['id']}"
        await client.patch(
            patch_url,
            headers=headers,
            json={"number_of_requests": current_req}
        )

        return {"answer": ai_response}

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


# ------------------ List In-Memory Sessions ------------------
@app.get("/sessions")
async def list_sessions():
    return {"sessions": list(memory_store.keys())}


# ------------------ History from Supabase ------------------
@app.get("/history/{session_id}")
async def get_session_history(session_id: str, request: Request, credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        decoded_token = jwt.decode(token, options={"verify_signature": False})
        user_id = decoded_token.get("sub")

        headers = {
            "Authorization": f"Bearer {token}",
            "apikey": SUPABASE_KEY,
            "Content-Type": "application/json",
        }

        # First, verify that the session belongs to the user making the request
        session_params = {"id": f"eq.{session_id}", "user_id": f"eq.{user_id}", "select": "id"}
        async with httpx.AsyncClient() as client:
            session_response = await client.get(
                SUPABASE_REST_ENDPOINT, headers=headers, params=session_params
            )
        
        if session_response.status_code != 200 or not session_response.json():
            raise HTTPException(status_code=404, detail="Session not found or access denied")

        # If ownership is confirmed, fetch the messages for that session
        message_params = {"session_id": f"eq.{session_id}", "select": "*"}
        async with httpx.AsyncClient() as client:
            response = await client.get(
                MESSAGE_SUPABASE_REST_ENDPOINT, headers=headers, params=message_params
            )
        
        if response.status_code != 200:
            raise HTTPException(status_code=500, detail="Failed to fetch session history")

        return {
            "history": [
                {
                    "is_user": msg.get("is_user"),
                    "content": msg.get("content"),
                    "timestamp": msg.get("timestamp"),
                }
                for msg in response.json()
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Basic validation functions
async def is_valid_email(email):
    return re.match(r"[^@]+@[^@]+\.[^@]+", email)


async def is_valid_phone(phone):
    return re.match(r"^[\d\s\-\+]{7,15}$", phone)


class ContactForm(BaseModel):
    name: str
    email: str
    phone: str
    organization: str
    subject: str
    message: str


@app.post("/form-submissions")
async def appointment_form(
    form_data: ContactForm
):
    # Insert into Supabase via REST API
    data = {
        "name": form_data.name,
        "email": form_data.email,
        "phone": form_data.phone,
        "organisation_name": form_data.organization,
        "subject": form_data.subject,
        "message": form_data.message,
    }

    headers = {
        "apikey": SUPABASE_KEY,
        "Content-Type": "application/json",
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(
            FORM_SUPABASE_REST_ENDPOINT, headers=headers, json=data
        )

    if response.status_code in [200, 201, 204]:
        send_confirmation_email(form_data.email, form_data.name)
        return {"message": "Form submitted"}
    else:
        return {"error": "Error in Submitting Form. Please Contact Admin"}


@app.get("/profiles")
async def get_user_profile(
    credentials: HTTPAuthorizationCredentials = Depends(security),
):

    token = credentials.credentials
    decoded_token = jwt.decode(token, options={"verify_signature": False})
    user_id = decoded_token.get("sub")

    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {token}",  # Service role for full access
        "Content-Type": "application/json",
    }

    url = f"{PROFILE_SUPABASE_REST_ENDPOINT}?id=eq.{user_id}"

    async with httpx.AsyncClient() as client:
        response = await client.get(url, headers=headers)

    if response.status_code != 200:
        raise HTTPException(
            status_code=response.status_code, detail="Error fetching user profile"
        )

    data = response.json()
    if not data:
        raise HTTPException(status_code=404, detail="User profile not found")

    return data[0]


@app.patch("/profiles")
async def update_user_profile(
    profile_data: UserProfileUpdate,
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    token = credentials.credentials
    decoded_token = jwt.decode(token, options={"verify_signature": False})
    user_id = decoded_token.get("sub")

    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
        "Prefer": "return=representation",  # Ensures the updated record is returned
    }

    # Supabase's PATCH endpoint for a specific record requires a filter
    url = f"{PROFILE_SUPABASE_REST_ENDPOINT}?user_id=eq.{user_id}"

    async with httpx.AsyncClient() as client:
        response = await client.patch(url, headers=headers, json=profile_data.dict(exclude_unset=True))

    if response.status_code != 200:
        raise HTTPException(
            status_code=response.status_code, detail=f"Error updating user profile: {response.text}"
        )

    return response.json()
