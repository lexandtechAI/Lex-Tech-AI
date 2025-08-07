import React from 'react';

interface DisclaimerPopupProps {
  onAgree: () => void;
}

const DisclaimerPopup: React.FC<DisclaimerPopupProps> = ({ onAgree }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Disclaimer</h2>
        <p className="text-gray-700 text-sm leading-relaxed mb-4">
          Current rules of the Bar Council of India impose restrictions on maintaining a web page and do not permit lawyers to provide information concerning their areas of practice. Lex & Tech is, therefore, constrained from providing any further information on this web page. The rules of the Bar Council of India prohibit law firms from soliciting work or advertising in any manner. By clicking on ‘I AGREE’, the user acknowledges that:
        </p>
        <ul className="list-disc list-inside text-gray-700 text-sm leading-relaxed mb-6 space-y-2">
          <li>The user wishes to gain more information about Lex & Tech, its practice areas and its attorneys, for his/her own information and use.</li>
          <li>The information is made available/provided to the user only on his/her specific request and any information obtained or material downloaded from this website is completely at the user’s volition and any transmission, receipt or use of this site is not intended to, and will not, create any lawyer-client relationship.</li>
          <li>None of the information contained on the website is in the nature of a legal opinion or otherwise amounts to any legal advice.</li>
          <li>Lex & Tech, is not liable for any consequence of any action taken by the user relying on material/information provided under this website.</li>
          <li>In cases where the user has any legal issues, he/she in all cases must seek independent legal advice.</li>
          <li>The contents of this website are the intellectual property of Lex & Tech.</li>
        </ul>
        <button
          onClick={onAgree}
          className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
        >
          I AGREE
        </button>
      </div>
    </div>
  );
};

export default DisclaimerPopup;
