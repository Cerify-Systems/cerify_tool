import React, {useState, useEffect} from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Navbar from '../../Components/Navbar';
import { Flex, Card } from "rebass";
import './Score.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileDownload, faCode, faBug, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { faCircleCheck, faCircleXmark } from '@fortawesome/free-regular-svg-icons';
import SidePanel from '../../Components/SidePanel';
import About from '../Pages/About';
import FFaq from '../Pages/FFaq';
import Help from '../Pages/Help';
import { useNavigate } from 'react-router-dom';
import ReportImage from '../../Components/ReportImage';
import '../../Components/ReportImage.css';
import { useRef } from 'react';

const contentMap = {
  'About': About,
  'FFaq': FFaq ,
  'Help': Help,
};

function Score() {
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [sidePanelContent, setSidePanelContent] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const navigate = useNavigate();

  const reportRef = useRef();

  const handleDownloadReport = () => {
    if (!analysisResult) return;
    const issuesList = analysisResult.issuesList || [];
    const report = `
Cerify Security Analysis Report
==============================
Contract: ${analysisResult.contractName || 'Unknown'}
Score: ${analysisResult.score}/${analysisResult.total}
Vulnerabilities Found: ${analysisResult.vulnerabilities}
Total Issues: ${analysisResult.issues}
Lines of Code: ${analysisResult.lines}
Status: ${analysisResult.status}
Analysis completed on: ${new Date().toLocaleString()}

${issuesList.length > 0 ? 'Issues:' : 'No issues detected 🎉'}
${issuesList.map((issue, idx) => `
${idx + 1}. [${issue.severity}] ${issue.title}
   Description: ${issue.description}
`).join('')}
    `;
    const blob = new Blob([report], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contract-analysis-report.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const storedResult = localStorage.getItem('analysisResult');
    if (storedResult) {
      try {
        const result = JSON.parse(storedResult);
        setAnalysisResult(result);
      } catch {
        setAnalysisResult({ score: 7.5, total: 10, vulnerabilities: 1, issues: 0, lines: 0, status: 'completed' });
      }
    }
  }, [navigate]);

//   const handleDownloadReport = () => {
//     if (!analysisResult) return;
//     const report = `
// Solidity Contract Analysis Report
// ================================
// Score: ${analysisResult.score}/${analysisResult.total}
// Vulnerabilities Found: ${analysisResult.vulnerabilities}
// Total Issues: ${analysisResult.issues}
// Lines of Code: ${analysisResult.lines}
// Status: ${analysisResult.status}
// Analysis completed on: ${new Date().toLocaleString()}
//     `;
//     const blob = new Blob([report], { type: 'text/plain' });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'contract-analysis-report.txt';
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     window.URL.revokeObjectURL(url);
//   };

  const scoreValue = analysisResult?.score || 7.5;
  const totalValue = analysisResult?.total || 10;
  const vulnerabilities = analysisResult?.vulnerabilities || 2;
  const issues = analysisResult?.issues || 5;
  const Value = (scoreValue / totalValue) * 100;

  const CustomText = () => (
    <div className="custom-text">
      <span style={{ fontSize: '4rem', fontFamily: 'Verdana' }}>{scoreValue}</span>
      <span style={{ fontSize: '1.5rem', fontFamily: 'monospace' }}>/ {totalValue}</span>
    </div>
  );

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

  return (
    <div className="score-page">
      <Navbar onLinkClick={(c) => setSidePanelContent(contentMap[c])} />
      <div className='heading-score'>
        <h1>Your score</h1>
        <p>Analysis completed successfully</p>
      </div>
      <div className="score-box">
        <Card style={{ width: 300, height: 250 }}>
          <Card>
            <div className="progressbar-container">
              <CircularProgressbar
                value={Value}
                circleRatio={0.6}
                strokeWidth={11}
                styles={buildStyles({
                  rotation: 0.7,
                  pathColor: Value >= 70 ? '#0a4fd7' : Value >= 40 ? '#ffa500' : '#ff0000'
                })}
              />
              <CustomText />
            </div>
          </Card>
        </Card>
        <hr className='horizontalline'/>
        <div className="score-details">
          <div className="score-pass">
            <span className='tick'><FontAwesomeIcon icon={faCircleCheck} /></span>
            <span>{totalValue - vulnerabilities} / {totalValue} checks passed</span>
          </div>
          <div className="score-fail">
            <span className='cross'><FontAwesomeIcon icon={faCircleXmark} /></span>
            <span>{issues} issues found</span>
          </div>
        </div>
        <div className="stat-cards-row">
          <div className="stat-card stat-code"><FontAwesomeIcon icon={faCode} /><div>{analysisResult.lines}</div></div>
          <div className="stat-card stat-vuln"><FontAwesomeIcon icon={faBug} /><div>{vulnerabilities}</div></div>
          <div className={`stat-card ${analysisResult.status === 'completed' ? 'stat-status-good' : 'stat-status-bad'}`}>
            <FontAwesomeIcon icon={faCheckCircle} /><div>{analysisResult.status}</div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '2rem' }}>
          <ReportImage
            analysisResult={analysisResult}
            issues={analysisResult.issuesList || []}
            ref={reportRef}
          />
          <button className="download-button" onClick={handleDownloadReport}>
            Download report as text <FontAwesomeIcon icon={faFileDownload} />
          </button>
        </div>
      </div>
      <SidePanel isOpen={isSidePanelOpen} onClose={() => setIsSidePanelOpen(false)} content={sidePanelContent}/>
    </div>
  );
}

export default Score;
