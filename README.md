# Lex & Tech AI

Lex & Tech AI is an AI-powered legal assistant designed to provide legally accurate and actionable responses to legal queries, specifically focusing on Indian law. It features a React-based frontend for user interaction and a FastAPI backend handling the core AI logic, document processing, and database interactions.

## Features

*   **AI-Powered Legal Assistance:** Get answers to legal questions based on Indian laws and legal procedures.
*   **Document Upload & Analysis:** Upload PDF documents for analysis and context-aware responses.
*   **Chat Session Management:** Create, manage, and delete chat sessions.
*   **User Profile Management:** View and update user profile information (name, phone, organization).
*   **Responsive Sidebar:** Collapsible sidebar for improved navigation and user experience.
*   **Authentication:** User login and registration.

## Technologies Used

### Frontend

*   **React:** JavaScript library for building user interfaces.
*   **Vite:** Fast build tool for modern web projects.
*   **Tailwind CSS:** Utility-first CSS framework for rapid UI development.
*   **React Router DOM:** Declarative routing for React.
*   **React Markdown & Remark GFM:** For rendering markdown content, including GitHub Flavored Markdown.
*   **Lucide React:** Icon library.

### Backend

*   **FastAPI:** Modern, fast (high-performance) web framework for building APIs with Python 3.7+.
*   **Python-dotenv:** For managing environment variables.
*   **PyMuPDF (fitz):** For PDF text extraction.
*   **LangChain:** Framework for developing applications powered by language models.
*   **Google Generative AI:** Integration with Google's AI models (e.g., Gemini).
*   **FAISS:** Library for efficient similarity search and clustering of dense vectors (used for vector store).
*   **Gunicorn:** Python WSGI HTTP Server for UNIX (for production deployment).
*   **httpx:** A fully featured HTTP client for Python.
*   **PyJWT:** For JSON Web Token (JWT) handling.

### Database

*   **Supabase:** Open-source Firebase alternative providing a PostgreSQL database, authentication, and more.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

*   **Python 3.9+**
*   **Node.js (LTS version recommended)** and **npm** (Node Package Manager)
*   **Git**

## Setup Instructions

Follow these steps to set up the project locally:

### 1. Clone the Repository

```bash
git clone <repository_url> # Replace with your actual repository URL if applicable
cd last_LEX_AI
```

### 2. Backend Setup

Navigate to the `backend` directory, create a virtual environment, install dependencies, and set up environment variables.

```bash
cd backend
python -m venv venv
venv\Scripts\activate # On Windows
# source venv/bin/activate # On macOS/Linux
pip install -r requirements.txt
```

Create a `.env` file in the `backend` directory with the following content. Obtain your keys from your Supabase project and Google Cloud.

```dotenv
SUPABASE_URL="YOUR_SUPABASE_URL"
SUPABASE_KEY="YOUR_SUPABASE_ANON_KEY"
GOOGLE_API_KEY="YOUR_GOOGLE_API_KEY"
RENDER_DISK_PATH="." # Use "." for local development, or specify a path for persistent storage
```

**Important Supabase Setup:**

*   Ensure your Supabase project has tables for `chat_sessions`, `chat_messages`, and `profiles` as expected by the backend code.
*   The `profiles` table **must have an `organization` column** (e.g., `text` or `varchar` type) for user profile updates to work correctly.

### 3. Frontend Setup

Navigate to the `project` directory, install dependencies, and set up environment variables.

```bash
cd ../project
npm install
```

Create a `.env` file in the `project` directory with the following content:

```dotenv
VITE_API_URL="http://localhost:8000" # Or your deployed backend URL
```

## Running the Application

### 1. Start the Backend Server

From the `backend` directory:

```bash
venv\Scripts\activate # On Windows (if not already active)
# source venv/bin/activate # On macOS/Linux (if not already active)
uvicorn main:app --reload --port 8000
```

### 2. Start the Frontend Development Server

From the `project` directory:

```bash
npm run dev
```

The frontend application will typically be available at `http://localhost:3000` (or another port if 3000 is in use).

## Usage

1.  **Register/Login:** Access the application in your browser and register a new account or log in with existing credentials.
2.  **Chat:** Start new chat sessions, ask legal questions, and upload PDF documents for context.
3.  **Profile:** Navigate to your user profile page to view and update your details.
4.  **Sidebar:** Use the toggle button to collapse and expand the sidebar for a streamlined experience.

## Contributing

(Optional: Add guidelines for contributions if this is an open-source project.)

## License

(Optional: Specify the project's license.)
"# Lex-Tech-AI" 
