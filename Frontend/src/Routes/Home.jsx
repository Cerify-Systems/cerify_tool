import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import Add from "../Images/add-image.png"
import Upload from "../Images/upload.png"
import Paste from "../Images/link-2.svg";
import SidePanel from '../Components/SidePanel';
import About from './Pages/About';
import FFaq from './Pages/FFaq';
import Help from './Pages/Help';

const contentMap = {
  'About': About,
  'FFaq': FFaq ,
  'Help': Help,
};

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

function Home() {
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState('');
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [sidePanelContent, setSidePanelContent] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      // Validate file type
      if (!selectedFile.name.endsWith('.sol') && !selectedFile.name.endsWith('.txt')) {
        alert('Please select a .sol or .txt file');
        return;
      }
      // Validate file size (5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUrlChange = (event) => {
    setUrl(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file && !url) {
      alert('Please upload a file or paste a URL.');
      return;
    }

    setIsUploading(true);

    try {
      if (file) {
        localStorage.setItem('uploadFileInfo', JSON.stringify({
          name: file.name,
          size: file.size,
          type: file.type
        }));
      }

      let response;
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        
        response = await fetch(`${API_BASE_URL}/upload`, {
          method: 'POST',
          body: formData,
        });
      } else if (url) {
        response = await fetch(`${API_BASE_URL}/analyze-url`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url }),
        });
      }

      if (response.ok) {
        const data = await response.json();
        
        // Store the analysis result in localStorage for the Score component
        localStorage.setItem('analysisResult', JSON.stringify(data.result));
        
        // Navigate to upload page (which shows progress)
        navigate('/Upload');
      } else {
        let errorMessage = 'Upload failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || `Server error: ${response.status}`;
        } catch (e) {
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        alert(errorMessage);
        console.error('Upload failed:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Upload error:', error);
      if (error.message.includes('Failed to fetch')) {
        alert('Cannot connect to server. Please make sure the backend is running.');
      } else {
        alert('An error occurred during upload. Please try again.');
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleLinkClick = (content) => {
    setSidePanelContent(contentMap[content]);
    setIsSidePanelOpen(true);
  };

  const closeSidePanel = () => {
    setIsSidePanelOpen(false);
  };

  return (
    <div className=" min-h-screen font-sans bg-white relative ">
      <header>
        <Navbar onLinkClick={handleLinkClick}/>
      </header>
      <main className='grid place-content-center mt-20 '>
        <h1 className='text-2xl m-auto mb-2'>Upload your contract</h1>
        <p className='text-xs md:text-xs tracking-wider text-gray-500 w-[350px] text-center'>Make sure that you have the right contract uploaded</p>

        <form onSubmit={handleSubmit}>
          <div className="mt-8 md:mt-16 mb-4 ">
            <label htmlFor="file-upload-add-file" className="file-upload-label-home cursor-pointer ">
              <div className="border-dashed border-2 border-gray-300 bg-gray-100 p-3 flex flex-col items-center rounded-lg text-black">
                <img src={Add} alt="add-image" className=" w-12 mb-1" />
                <span className=' text-[#3c89d1] underline font-normal text-sm mb-1 ' >
                  {file ? file.name : 'Upload your contract'}
                </span>
                <span className='text-sm text-gray-600 tracking-wider '>or drag and drop <br></br></span>
                <span className='text-[0.7rem] font-bold text-gray-500'>SOL or TXT up to 5MB</span>
              </div>
            </label>
            <input
              id="file-upload-add-file"
              type="file"
              accept=".sol, .txt"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </div>
          <button 
            type="submit" 
            className="bg-[#0a4fd7] mt-20 flex justify-center text-white w-full text-lg p-3 border-none rounded-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isUploading}
          >
            {isUploading ? 'Uploading...' : 'Upload'}
            <img src={Upload} alt="upload-icon" className="w-7" />
          </button>
        </form>
      </main>
      <SidePanel isOpen={isSidePanelOpen} onClose={closeSidePanel} content={sidePanelContent} onLinkClick={handleLinkClick}/>
    </div>
  );
}

export default Home;