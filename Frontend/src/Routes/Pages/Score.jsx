import React, {useState, useEffect} from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Navbar from '../../Components/Navbar';
import './Score.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileDownload, faCode, faBug, faCheckCircle, faShieldAlt } from '@fortawesome/free-solid-svg-icons';
import SidePanel from '../../Components/SidePanel';
import About from '../Pages/About';
import FFaq from '../Pages/FFaq';
import Help from '../Pages/Help';
import { useNavigate } from 'react-router-dom';
import ReportImage from '../../Components/ReportImage';
import '../../Components/ReportImage.css';
import { useRef } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from './firebase';
import jsPDF from 'jspdf';

const contentMap = {
  'About': About,
  'FFaq': FFaq ,
  'Help': Help,
};

const auth = getAuth(app);

function Score() {
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [sidePanelContent, setSidePanelContent] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();

  const reportRef = useRef();

  useEffect(() => {
    const storedResult = localStorage.getItem('analysisResult');
    if (!storedResult) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const handlePopState = () => {
      navigate('/', { replace: true });
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [navigate]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);
  
// Use vulnerabilities as the primary source of truth for total issues
  const totalIssues = analysisResult?.vulnerabilities || analysisResult?.issues || 0;
  const lines = analysisResult?.lines || 0;

  // Calculate 10-point scale based on total issues
  const calculateScore = () => {
    if (totalIssues === 0) return 10;
    if (totalIssues === 1) return 8;
    if (totalIssues === 2) return 7;
    if (totalIssues === 3) return 6;
    if (totalIssues === 4) return 5;
    if (totalIssues === 5) return 4;
    if (totalIssues === 6) return 3;
    if (totalIssues === 7) return 2;
    if (totalIssues >= 8) return 1;
    return Math.max(1, 10 - totalIssues);
  };

   const handleDownloadReport = () => {
    if (!analysisResult) return;
    const issuesList = analysisResult.issuesList || [];
    const report = `
Cerify Security Analysis Report
==============================
Contract: ${analysisResult.contractName || 'Unknown'}
Score: ${calculateScore()}/10
Issues Found: ${totalIssues}
Lines of Code: ${analysisResult.lines}
Status: ${analysisResult.status}
Analysis completed on: ${new Date().toLocaleString()}

${issuesList.length > 0 ? 'Issues:' : 'No issues detected 🎉'}
${issuesList.map((issue, idx) => `
${idx + 1}. [${issue.severity}] ${issue.title}
   Description: ${issue.description}
`).join('')}
    `;

    // Create a new PDF doc
    const doc = new jsPDF();
    // Split long text into lines
    const lines = doc.splitTextToSize(report, 180); // 180 is width, adjust if needed

    // Add the lines to the PDF
    doc.text(lines, 10, 10);
    // Save the PDF
    doc.save('contract-analysis-report.pdf');
  };

  const handleLoginRedirect = () => {
    setShowLoginModal(false);
    navigate('/Login');
  };

  const handleSignupRedirect = () => {
    setShowLoginModal(false);
    navigate('/Signup');
  };

  const closeLoginModal = () => {
    setShowLoginModal(false);
  };

  useEffect(() => {
    const storedResult = localStorage.getItem('analysisResult');
    if (storedResult) {
      try {
        const result = JSON.parse(storedResult);
        setAnalysisResult(result);
      } catch {
        setAnalysisResult({ score: 7.5, total: 10, vulnerabilities: 3, issues: 3, lines: 120, status: 'completed' });
      }
    }
  }, [navigate]);

  if (!analysisResult) {
    return (
      <div className="score-page">
        <Navbar onLinkClick={(c) => setSidePanelContent(contentMap[c])} />
        <div className='heading-score'>
          <h1>Loading...</h1>
        </div>
      </div>
    );
  }

  const getScoreColor = (issueCount) => {
    if (issueCount === 0) return '#10b981';
    if (issueCount <= 2) return '#fbbf24';
    if (issueCount <= 5) return '#f97316';
    return '#ef4444';
  };

  const getScoreStatus = (issueCount) => {
    if (issueCount === 0) return 'Excellent';
    if (issueCount <= 2) return 'Good';
    if (issueCount <= 5) return 'Moderate';
    return 'Poor';
  };

  const scoreColor = getScoreColor(totalIssues);
  const scoreStatus = getScoreStatus(totalIssues);

  const progressValue = Math.max(0, ((totalIssues) / 10) * 100);

  const CustomText = () => (
    <div className="custom-text-new">
      <div className="score-display">
        <span className="score-number">{totalIssues}</span>
      </div>
      <div className="score-label">Issues Found</div>
      <div className="status-label" style={{ color: scoreColor }}>{scoreStatus}</div>
    </div>
  );

  return (
    <div className="score-page">
      <Navbar onLinkClick={(c) => setSidePanelContent(contentMap[c])} />
      
      <div className='heading-score'>
        <h1>Security Analysis Results</h1>
        <p>Analysis completed successfully • {new Date().toLocaleDateString()}</p>
      </div>

      {/* Two Column Layout */}
      <div className="score-main-container">
        {/* Left Column - Score Meter and Stats */}
        <div className="score-left-column">
          <div className="score-meter-section">
            <div className="meter-container">
              <CircularProgressbar
                value={progressValue}
                circleRatio={0.65}
                strokeWidth={8}
                styles={buildStyles({
                  rotation: 0.675,
                  pathColor: scoreColor,
                  trailColor: '#dbdbdbff',
                  strokeLinecap: 'round'
                })}
              />
              <CustomText />
            </div>
          </div>
          <div className="enhanced-stats-grid">
            <div className="enhanced-stat-card issues">
              <div className="stat-icon-container">
                <FontAwesomeIcon icon={faBug} className="stat-icon" />
              </div>
              <div className="stat-content">
                <div className="stat-number">{totalIssues}</div>
                <div className="stat-label">Total Issues</div>
                <div className="stat-description">Security vulnerabilities found</div>
              </div>
            </div>

            <div className="enhanced-stat-card lines-of-code">
              <div className="stat-icon-container">
                <FontAwesomeIcon icon={faCode} className="stat-icon" />
              </div>
              <div className="stat-content">
                <div className="stat-number">{lines}</div>
                <div className="stat-label">Lines of Code</div>
                <div className="stat-description">Total code analyzed</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Report Preview */}
        <div className="score-right-column">
          <div className="report-preview-section">
            <div className="report-container">
              <ReportImage
                analysisResult={analysisResult}
                issues={analysisResult.issuesList || []}
                ref={reportRef}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Download Section - Centered Below */}
      <div className="download-section">
        <div className="download-container">
          <h3 className="download-title">Export Your Report</h3>
          <p className="download-description">Download your comprehensive security analysis report</p>
          <button className="download-button-enhanced" onClick={handleDownloadReport}>
            <FontAwesomeIcon icon={faFileDownload} />
            Download Report as PDF
          </button>
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="login-modal-overlay">
          <div className="login-modal">
            <div className="login-modal-header">
              <h2>Login Required</h2>
              <button className="close-modal" onClick={closeLoginModal}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <div className="login-modal-content">
              <div className="login-modal-icon">
                <FontAwesomeIcon icon={faFileDownload} className="text-blue-600" />
              </div>
              <p>To download your analysis report, please sign in to your account or create a new one.</p>
              <div className="login-modal-buttons">
                <button className="login-btn" onClick={handleLoginRedirect}>
                  Sign In
                </button>
                <button className="signup-btn" onClick={handleSignupRedirect}>
                  Create Account
                </button>
              </div>
              <p className="login-modal-note">
                Your analysis results will be saved after you sign in.
              </p>
            </div>
          </div>
        </div>
      )}

      <SidePanel isOpen={isSidePanelOpen} onClose={() => setIsSidePanelOpen(false)} content={sidePanelContent}/>
    </div>
  );
}

export default Score;