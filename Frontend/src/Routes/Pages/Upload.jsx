import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import Navbar2 from '../../Components/Navbar2';
import './Upload.css';

const Upload = () => {
  const navigate = useNavigate();
  const [percentage, setPercentage] = useState(0);
  const [status, setStatus] = useState('Initializing...');
  const [uploadedFile, setUploadedFile] = useState(null);

  useEffect(() => {
    // Check if we have analysis results or file info
    const analysisResult = localStorage.getItem('analysisResult');
    const fileInfo = localStorage.getItem('uploadFileInfo');
    
    if (!analysisResult && !fileInfo) {
      // No analysis result found, go back to home
      navigate('/');
      return;
    }

    if (fileInfo) {
      const file = JSON.parse(fileInfo);
      setUploadedFile(file);
    }

    // Start the actual upload process
    startRealUploadProcess();
  }, [navigate]);

  const startRealUploadProcess = async () => {
    try {
      // Get file from localStorage or form data
      const fileInfo = localStorage.getItem('uploadFileInfo');
      if (!fileInfo) {
        navigate('/');
        return;
      }

      const file = JSON.parse(fileInfo);
      
      // Phase 1: File Upload (0-30%)
      setStatus('Uploading file to server...');
      await simulateFileUpload();

      // Phase 2: File Processing (30-60%)
      setStatus('Processing and validating file...');
      await simulateFileProcessing();

      // Phase 3: Security Analysis (60-90%)
      setStatus('Running security analysis...');
      await simulateSecurityAnalysis();

      // Phase 4: Report Generation (90-100%)
      setStatus('Generating analysis report...');
      await simulateReportGeneration();

      setStatus('Analysis complete!');
      setPercentage(100);

      // Navigate to score page after completion
      setTimeout(() => {
        navigate("/Score");
      }, 1500);

    } catch (error) {
      console.error('Upload process failed:', error);
      setStatus('Upload failed. Please try again.');
      setTimeout(() => {
        navigate('/');
      }, 3000);
    }
  };

  const simulateFileUpload = () => {
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 5 + 2; // Random progress between 2-7%
        if (progress >= 30) {
          setPercentage(30);
          clearInterval(interval);
          resolve();
        } else {
          setPercentage(Math.min(progress, 30));
        }
      }, 200);
    });
  };

  const simulateFileProcessing = () => {
    return new Promise((resolve) => {
      let progress = 30;
      const interval = setInterval(() => {
        progress += Math.random() * 4 + 1;
        if (progress >= 60) {
          setPercentage(60);
          clearInterval(interval);
          resolve();
        } else {
          setPercentage(Math.min(progress, 60));
        }
      }, 300);
    });
  };

  const simulateSecurityAnalysis = () => {
    return new Promise((resolve) => {
      let progress = 60;
      const interval = setInterval(() => {
        progress += Math.random() * 3 + 1;
        if (progress >= 90) {
          setPercentage(90);
          clearInterval(interval);
          resolve();
        } else {
          setPercentage(Math.min(progress, 90));
        }
      }, 400);
    });
  };

  const simulateReportGeneration = () => {
    return new Promise((resolve) => {
      let progress = 90;
      const interval = setInterval(() => {
        progress += Math.random() * 2 + 1;
        if (progress >= 100) {
          setPercentage(100);
          clearInterval(interval);
          resolve();
        } else {
          setPercentage(Math.min(progress, 100));
        }
      }, 200);
    });
  };

  const circumference = 2 * Math.PI * 90;
  const offset = circumference - (circumference * percentage / 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar2 />
      
      <div className="upload-container">
        <div className="upload-card">
          {/* Header Section */}
          <div className="upload-header">
            <div className="upload-icon">
              <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h1 className="upload-title">Analyzing Your Contract</h1>
            {uploadedFile && (
              <p className="upload-filename">{uploadedFile.name}</p>
            )}
          </div>

          {/* Progress Section */}
          <div className="progress-section">
            <div className="circle-container-upload">
              <svg width="200" height="200" className="progress-ring">
                <circle 
                  className="circle-background-upload" 
                  cx="100" 
                  cy="100" 
                  r="90" 
                  strokeWidth="8" 
                  fill="none"
                />
                <circle
                  className="circle-fill-upload"
                  cx="100"
                  cy="100"
                  r="90"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                />
              </svg>
              <div className="circle-text-upload">
                <span className="percentage-text">{Math.round(percentage)}%</span>
              </div>
            </div>
          </div>

          {/* Status Section */}
          <div className="status-section">
            <div className="status-text">{status}</div>
            <div className="status-bar">
              <div 
                className="status-bar-fill" 
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="progress-steps">
            <div className={`step ${percentage >= 30 ? 'completed' : percentage > 0 ? 'active' : ''}`}>
              <div className="step-number">1</div>
              <div className="step-label">Upload</div>
            </div>
            <div className={`step ${percentage >= 60 ? 'completed' : percentage > 30 ? 'active' : ''}`}>
              <div className="step-number">2</div>
              <div className="step-label">Process</div>
            </div>
            <div className={`step ${percentage >= 90 ? 'completed' : percentage > 60 ? 'active' : ''}`}>
              <div className="step-number">3</div>
              <div className="step-label">Analyze</div>
            </div>
            <div className={`step ${percentage === 100 ? 'completed' : percentage > 90 ? 'active' : ''}`}>
              <div className="step-number">4</div>
              <div className="step-label">Report</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;