import React, { useState } from 'react';
import Navbar2 from '../../Components/Navbar2';
import Key from "../../Images/key.png";
import File from "../../Images/file-code.svg";
import Message from "../../Images/message.png";
import HelpImage from "../../Images/HelpImage.png";
import Modal from "../../Components/Modal";

const Help = () => {
   const [isOpenFU, setIsOpenFU] = useState(false);
   const [isOpenSD, setIsOpenSD] = useState(false);
  //  const [isOpenGS, setIsOpenGS] = useState(false);
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar2 />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-light text-gray-900 mb-6">
            How can we help you?
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Get the support you need with our comprehensive help center. 
            Find answers, troubleshoot issues, or get in touch with our team.
          </p>
        </div>

        {/* Quick Help Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100">
            <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-xl mb-6 mx-auto">
              <img src={File} className="w-8 h-8" alt="File upload" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">File Upload</h3>
            <p className="text-gray-600 text-center mb-4">Having trouble uploading your documents? We'll help you get started.</p>
            <button  onClick={() => setIsOpenFU(true)} className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Get Help
            </button>
          </div>
          <Modal
            isOpen={isOpenFU}
            onClose={() => setIsOpenFU(false)}
            title="Need Help with File Upload?">
            <p>
              Please ensure your file is under <strong>5MB</strong> and in{" "}
              <strong>sol or txt format</strong>.  
              If the issue persists, reach out to our support team.
            </p>
          </Modal>
          

          {/* <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100">
            <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-xl mb-6 mx-auto">
              <img src={Key} className="w-8 h-8" alt="Login" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">Login Issues</h3>
            <p className="text-gray-600 text-center mb-4">Can't access your account? Let us help you get back in.</p>
            <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors">
              Get Help
            </button>
          </div> */}

          <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100">
            <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-xl mb-6 mx-auto">
              <img src={HelpImage} className="w-8 h-8" alt="Documentation" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">Score Documentation</h3>
            <p className="text-gray-600 text-center mb-4">Need help understanding your plagiarism scores and reports?</p>
            <button onClick={() => setIsOpenSD(true)} className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors">
              Get Help
            </button>
          </div>
          <Modal
            isOpen={isOpenSD}
            onClose={() => setIsOpenSD(false)}
            title="Score Calculation">
            <p className="text-gray-700 leading-relaxed">
              Currently, the vulnerability score is based on{" "}
              <strong>two key checks</strong>:  
            </p>
            <ul className="list-disc pl-5 mt-2 text-gray-700">
              <li><strong>Arithmetic Overflow</strong> — detecting unsafe math operations.</li>
              <li><strong>Suicidal Contracts</strong> — identifying contracts that can self-destruct unintentionally.</li>
            </ul>
            <p className="mt-3 text-gray-700">
              The score is calculated out of these categories for now.  
              More vulnerability checks will be added soon to make the scoring system more comprehensive.
            </p>
          </Modal>

          <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100">
            <div className="flex items-center justify-center w-16 h-16 bg-orange-100 rounded-xl mb-6 mx-auto">
              <img src={Message} className="w-8 h-8" alt="General queries" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">General Support</h3>
            <p className="text-gray-600 text-center mb-4">Have questions about our service? We're here to help.</p>
            <button onClick={() => window.open(`${process.env.REACT_APP_HOME_URL}/contact`, "_self")} className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors">
              Get Help
            </button>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-semibold text-gray-900 mb-6">Still Need Help?</h2>
            <p className="text-lg text-gray-600 mb-8">
              Can't find what you're looking for? Our support team is ready to assist you.
            </p>
            
            <div className="bg-blue-50 rounded-xl p-8 mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.017 9.017 0 01-6.6-3.6L3 21l3.6-2.4C8.4 19.35 10.2 20 12 20c4.97 0 9-3.582 9-8s-4.03-8-9-8-9 3.582-9 8c0 1.677.5 3.24 1.35 4.5"></path>
                  </svg>
                </div>
              </div>
              <p className="text-blue-800 font-medium mb-4">Hello!</p>
              <p className="text-blue-700">
                What can I help you with today? Let me know if you have any issues with one of the options above, 
                or feel free to describe your specific problem.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {/* <button className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Start Live Chat
              </button> */}
              <button 
              onClick={() => {
                  const subject = encodeURIComponent('Support Request');
                  const body = encodeURIComponent('Hi Cerify team,\n\nI need help with...\n\nBest regards');
                  window.location.href = `mailto:support@cerify.ai?subject=${subject}&body=${body}`;
                }}
               className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                Send Email
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;