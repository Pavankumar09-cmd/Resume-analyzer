import { useState, useEffect } from "react";

export default function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  // Force the artifact iframe/container to be truly full-width
  useEffect(() => {
    // Target body and all parent containers
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.width = "100%";
    document.body.style.overflowX = "hidden";
    document.body.style.background = "#080808";

    // Walk up and remove any max-width constraints imposed by the iframe container
    let el = document.body.parentElement;
    while (el) {
      el.style.margin = "0";
      el.style.padding = "0";
      el.style.width = "100%";
      el.style.maxWidth = "none";
      el.style.background = "#080808";
      el = el.parentElement;
    }

    // Also target any wrapper divs injected by the artifact renderer
    const allDivs = document.querySelectorAll("body > div, html > body > div");
    allDivs.forEach((d) => {
      d.style.width = "100%";
      d.style.maxWidth = "none";
      d.style.margin = "0";
      d.style.padding = "0";
    });
  }, []);

  const handleUpload = async () => {
    if (!file) { alert("Please select a PDF"); return; }
    const formData = new FormData();
    formData.append("resume", file);
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/resume/upload`, { method: "POST", body: formData });
      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (error) {
      console.log(error);
      alert("Error analyzing resume");
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && dropped.type === "application/pdf") setFile(dropped);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        html, body {
          width: 100% !important;
          max-width: none !important;
          margin: 0 !important;
          padding: 0 !important;
          background: #080808 !important;
          overflow-x: hidden;
        }

        /* Force artifact renderer wrappers to be full width */
        body > div,
        body > div > div,
        #root,
        [data-reactroot] {
          width: 100% !important;
          max-width: none !important;
          margin: 0 !important;
          padding: 0 !important;
        }

        .page-wrap {
          width: 100vw;
          min-height: 100vh;
          background: #080808;
          color: #fff;
          font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
          overflow-x: hidden;
          position: relative;
        }

        /* Stars */
        .star-bg {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          background-image:
            radial-gradient(1px 1px at 8% 15%, rgba(255,255,255,0.5) 0%, transparent 100%),
            radial-gradient(1px 1px at 22% 55%, rgba(255,255,255,0.35) 0%, transparent 100%),
            radial-gradient(1px 1px at 38% 8%, rgba(255,255,255,0.4) 0%, transparent 100%),
            radial-gradient(1px 1px at 52% 78%, rgba(255,255,255,0.3) 0%, transparent 100%),
            radial-gradient(1.5px 1.5px at 67% 32%, rgba(255,255,255,0.5) 0%, transparent 100%),
            radial-gradient(1px 1px at 83% 52%, rgba(255,255,255,0.35) 0%, transparent 100%),
            radial-gradient(1px 1px at 12% 88%, rgba(255,255,255,0.3) 0%, transparent 100%),
            radial-gradient(1.5px 1.5px at 91% 12%, rgba(255,255,255,0.45) 0%, transparent 100%),
            radial-gradient(1px 1px at 4% 42%, rgba(255,255,255,0.3) 0%, transparent 100%),
            radial-gradient(1px 1px at 58% 48%, rgba(255,255,255,0.2) 0%, transparent 100%),
            radial-gradient(1px 1px at 31% 31%, rgba(255,255,255,0.35) 0%, transparent 100%),
            radial-gradient(1px 1px at 74% 74%, rgba(255,255,255,0.3) 0%, transparent 100%),
            radial-gradient(2px 2px at 46% 20%, rgba(255,255,255,0.5) 0%, transparent 100%),
            radial-gradient(1.5px 1.5px at 93% 65%, rgba(255,255,255,0.4) 0%, transparent 100%),
            radial-gradient(1px 1px at 18% 72%, rgba(255,255,255,0.3) 0%, transparent 100%),
            radial-gradient(1px 1px at 63% 4%, rgba(255,255,255,0.45) 0%, transparent 100%),
            radial-gradient(1px 1px at 2% 2%, rgba(255,255,255,0.25) 0%, transparent 100%),
            radial-gradient(1px 1px at 79% 93%, rgba(255,255,255,0.3) 0%, transparent 100%),
            radial-gradient(1px 1px at 44% 66%, rgba(255,255,255,0.2) 0%, transparent 100%),
            radial-gradient(1px 1px at 96% 38%, rgba(255,255,255,0.35) 0%, transparent 100%);
        }

        /* ── NAVBAR ── */
        .navbar {
          position: sticky;
          top: 0;
          z-index: 200;
          width: 100%;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          background: rgba(8,8,8,0.9);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
        }

        .navbar-inner {
          width: 100%;
          padding: 0 48px;
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .logo-area {
          display: flex;
          align-items: center;
          gap: 13px;
          flex-shrink: 0;
        }

        .logo-icon {
          width: 44px;
          height: 44px;
          border-radius: 11px;
          background: #FCC800;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 28px rgba(252,200,0,0.45);
          flex-shrink: 0;
        }

        .logo-text {
          font-size: 22px;
          font-weight: 800;
          letter-spacing: -0.5px;
          color: #fff;
          white-space: nowrap;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 38px;
          list-style: none;
        }

        .nav-links a {
          text-decoration: none;
          color: rgba(255,255,255,0.65);
          font-size: 14.5px;
          font-weight: 500;
          transition: color 0.2s;
          white-space: nowrap;
        }

        .nav-links a:hover { color: #fff; }

        .nav-badge {
          background: #FCC800;
          color: #000;
          font-size: 10px;
          font-weight: 800;
          padding: 2px 7px;
          border-radius: 5px;
          letter-spacing: 0.04em;
          margin-left: 7px;
          vertical-align: middle;
        }

        .nav-cta {
          background: #FCC800;
          color: #000;
          border: none;
          padding: 11px 26px;
          border-radius: 50px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
          box-shadow: 0 0 30px rgba(252,200,0,0.25);
          white-space: nowrap;
          flex-shrink: 0;
        }

        .nav-cta:hover { background: #FFD740; transform: translateY(-1px); }

        /* ── GREEN DIVIDER LINE ── */
        .green-line {
          width: 100%;
          height: 1px;
          background: linear-gradient(90deg,
            transparent 0%,
            rgba(160,230,80,0.0) 5%,
            rgba(160,230,80,0.7) 15%,
            rgba(160,230,80,0.9) 50%,
            rgba(160,230,80,0.7) 85%,
            rgba(160,230,80,0.0) 95%,
            transparent 100%
          );
          position: relative;
          z-index: 10;
        }

        /* ── HERO ── */
        .hero {
          position: relative;
          z-index: 1;
          width: 100%;
          text-align: center;
          padding: 50px 70px 80px;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 9px 20px;
          border-radius: 50px;
          border: 1px solid rgba(255,255,255,0.13);
          background: rgba(255,255,255,0.04);
          font-size: 11.5px;
          font-weight: 600;
          letter-spacing: 0.1em;
          color: rgba(255,255,255,0.55);
          text-transform: uppercase;
          margin-bottom: 44px;
          cursor: pointer;
          transition: border-color 0.2s;
        }

        .hero-badge:hover { border-color: rgba(255,255,255,0.22); }

        .badge-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #FCC800;
          animation: pulse 2s ease-in-out infinite;
          flex-shrink: 0;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.45; transform: scale(0.8); }
        }

        .hero-title {
          font-size: clamp(56px, 7.5vw, 108px);
          font-weight: 900;
          line-height: 1.0;
          letter-spacing: -0.035em;
          color: #fff;
          margin-bottom: 75px;
          margin-top:10px;
        }

        .hero-title .accent { color: #FCC800; }

        .hero-sub {
          font-size: clamp(15px, 1.4vw, 18px);
          color: rgba(255,255,255,0.4);
          max-width: 560px;
          margin: 0 auto 48px;
          line-height: 1.75;
        }

        .hero-btns {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .btn-yellow {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #FCC800;
          color: #000;
          border: none;
          padding: 15px 32px;
          border-radius: 50px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 0 40px rgba(252,200,0,0.35);
          letter-spacing: -0.01em;
        }

        .btn-yellow:hover { background: #FFD740; transform: translateY(-2px); box-shadow: 0 0 60px rgba(252,200,0,0.45); }

        .btn-dark {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(255,255,255,0.08);
          color: #fff;
          border: 1px solid rgba(255,255,255,0.13);
          padding: 15px 32px;
          border-radius: 50px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
          letter-spacing: -0.01em;
        }

        .btn-dark:hover { background: rgba(255,255,255,0.13); transform: translateY(-2px); }

        .btn-icon-circle {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: rgba(0,0,0,0.22);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .btn-dark .btn-icon-circle { background: rgba(255,255,255,0.1); }

        .no-credit {
          margin-top: 22px;
          font-size: 11px;
          color: rgba(255,255,255,0.28);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        /* ── UPLOAD ── */
        .upload-section {
          position: relative;
          z-index: 1;
          width: 100%;
          padding: 60px 48px 80px;
        }

        .upload-wrap {
          max-width: 860px;
          margin: 0 auto;
        }

        .upload-box {
          border: 1.5px dashed rgba(252,200,0,0.22);
          border-radius: 28px;
          padding: 64px 48px;
          text-align: center;
          background: rgba(252,200,0,0.025);
          transition: border-color 0.25s, background 0.25s;
          cursor: default;
        }

        .upload-box.drag-over {
          border-color: rgba(252,200,0,0.65);
          background: rgba(252,200,0,0.06);
        }

        .upload-icon-wrap {
          width: 76px;
          height: 76px;
          border-radius: 20px;
          background: #FCC800;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 26px;
          box-shadow: 0 0 55px rgba(252,200,0,0.35);
        }

        .upload-title {
          font-size: clamp(30px, 4vw, 46px);
          font-weight: 900;
          letter-spacing: -0.025em;
          margin-bottom: 14px;
        }

        .upload-sub {
          font-size: 15px;
          color: rgba(255,255,255,0.38);
          max-width: 460px;
          margin: 0 auto 36px;
          line-height: 1.65;
        }

        .file-row {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 18px;
        }

        .file-label {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 12px 26px;
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 50px;
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.65);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
          user-select: none;
        }

        .file-label:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.22); }

        .file-chosen {
          font-size: 13px;
          color: rgba(252,200,0,0.85);
        }

        .analyze-btn {
          background: #FCC800;
          color: #000;
          border: none;
          padding: 15px 40px;
          border-radius: 50px;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
          box-shadow: 0 0 50px rgba(252,200,0,0.25);
        }

        .analyze-btn:hover { background: #FFD740; transform: translateY(-2px); }
        .analyze-btn:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }

        /* ── LOADING ── */
        .loading-section {
          position: relative;
          z-index: 1;
          width: 100%;
          padding: 0 48px 80px;
        }

        .loading-box {
          max-width: 860px;
          margin: 0 auto;
          border: 1px solid rgba(252,200,0,0.14);
          background: rgba(252,200,0,0.03);
          border-radius: 28px;
          padding: 64px 40px;
          text-align: center;
        }

        .loading-text {
          font-size: clamp(22px, 2.5vw, 30px);
          font-weight: 900;
          color: #FCC800;
          animation: blink 1.4s ease-in-out infinite;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }

        .loading-sub { color: rgba(255,255,255,0.32); font-size: 15px; margin-top: 14px; }

        /* ── RESULTS ── */
        .results-section {
          position: relative;
          z-index: 1;
          width: 100%;
          padding: 0 48px 100px;
        }

        .results-inner { width: 100%; max-width: 1400px; margin: 0 auto; }

        .top-grid {
          display: grid;
          grid-template-columns: 340px 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }

        .score-card {
          border: 1px solid rgba(252,200,0,0.18);
          background: linear-gradient(155deg, rgba(252,200,0,0.08) 0%, transparent 100%);
          border-radius: 28px;
          padding: 38px;
        }

        .label-sm {
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #FCC800;
          margin-bottom: 14px;
        }

        .score-num {
          font-size: 130px;
          font-weight: 900;
          line-height: 1;
          letter-spacing: -0.04em;
        }

        .score-desc { color: rgba(255,255,255,0.38); font-size: 14px; margin-top: 18px; line-height: 1.6; }

        .insights-card {
          border: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.02);
          border-radius: 28px;
          padding: 38px;
        }

        .insights-heading {
          font-size: clamp(22px, 2.8vw, 38px);
          font-weight: 900;
          letter-spacing: -0.025em;
          line-height: 1.18;
          max-width: 500px;
        }

        .mini-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin-top: 28px;
        }

        .mini-card {
          border: 1px solid rgba(255,255,255,0.07);
          background: rgba(0,0,0,0.4);
          border-radius: 18px;
          padding: 20px 24px;
          transition: border-color 0.2s;
        }

        .mini-card:hover { border-color: rgba(252,200,0,0.2); }

        .mini-label { font-size: 10.5px; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(255,255,255,0.32); margin-bottom: 10px; }
        .mini-val { font-size: 52px; font-weight: 900; letter-spacing: -0.03em; color: #FCC800; line-height: 1; }

        .analysis-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .analysis-card {
          border: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.02);
          border-radius: 28px;
          padding: 32px;
        }

        .analysis-title { font-size: 26px; font-weight: 900; letter-spacing: -0.02em; margin-bottom: 18px; }

        .analysis-items { display: flex; flex-direction: column; gap: 11px; }

        .analysis-item {
          border: 1px solid rgba(255,255,255,0.06);
          background: rgba(0,0,0,0.28);
          border-radius: 14px;
          padding: 15px 18px;
          font-size: 14px;
          color: rgba(255,255,255,0.6);
          line-height: 1.6;
          transition: border-color 0.2s;
        }

        .analysis-item:hover { border-color: rgba(252,200,0,0.18); }

        /* ── RESPONSIVE ── */
        @media (max-width: 1100px) {
          .top-grid { grid-template-columns: 1fr; }
          .analysis-grid { grid-template-columns: 1fr; }
        }

        @media (max-width: 860px) {
          .navbar-inner { padding: 0 24px; }
          .nav-links { display: none; }
          .hero { padding: 60px 24px 60px; }
          .upload-section, .results-section, .loading-section { padding-left: 24px; padding-right: 24px; }
          .hero-btns { flex-direction: column; align-items: center; }
          .mini-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="page-wrap">
        <div className="star-bg" />

        {/* NAVBAR */}
        <nav className="navbar">
          <div className="navbar-inner">
            <div className="logo-area">
              <div className="logo-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#000">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              </div>
              <span className="logo-text">ResumeIQ</span>
            </div>


            <button className="nav-cta">AI Resume Scanner</button>
          </div>
        </nav>

        {/* GREEN LINE */}
        <div className="green-line" />

        {/* HERO */}
        <section className="hero">
          <div className="hero-badge">
            <span className="badge-dot" />
            Just in the span of 1-Min
            <span style={{ color: "rgba(255,255,255,0.35)", marginLeft: 4 }}>›</span>
          </div>
          <h1 className="hero-title">
            The No. 1 AI-Powered<br />
            <span className="accent">Resume Scanner</span>
          </h1>


          <div className="hero-btns">
            <button className="btn-yellow" onClick={() => document.getElementById('upload-sec').scrollIntoView({ behavior: 'smooth' })}>
              <div className="btn-icon-circle">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>
                </svg>
              </div>
              Analyze My Resume
            </button>
            <button className="btn-dark">
              <div className="btn-icon-circle">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8" fill="#fff" stroke="none"/>
                </svg>
              </div>
              See How It Works
            </button>
          </div>

        
        </section>

        {/* GREEN LINE bottom of hero */}
        <div className="green-line" />

        {/* UPLOAD */}
        <section className="upload-section" id="upload-sec">
          <div className="upload-wrap">
            <div
              className={`upload-box${dragOver ? " drag-over" : ""}`}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              <div className="upload-icon-wrap">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 16.5V3m0 0l-3.75 3.75M12 3l3.75 3.75M3 15v3.75A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V15"/>
                </svg>
              </div>
              <h2 className="upload-title">Upload Your Resume</h2>
              <p className="upload-sub">
                Get ATS compatibility analysis, missing skill detection,
                recruiter insights, and AI-generated recommendations.
              </p>
              <div className="file-row">
                <label className="file-label" htmlFor="file-inp">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                  </svg>
                  {file ? file.name : "Choose PDF file"}
                </label>
                <input id="file-inp" type="file" accept=".pdf" onChange={e => setFile(e.target.files[0])} style={{ display: "none" }} />
                {file && <span className="file-chosen">✓ {file.name}</span>}
                <button className="analyze-btn" onClick={handleUpload} disabled={loading}>
                  {loading ? "Analyzing..." : "Analyze Resume"}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* LOADING */}
        {loading && (
          <section className="loading-section">
            <div className="loading-box">
              <div className="loading-text">AI is analyzing your resume...</div>
              <p className="loading-sub">Parsing ATS score, skills, recruiter insights, and optimization opportunities.</p>
            </div>
          </section>
        )}

        {/* RESULTS */}
        {analysis && (
          <section className="results-section">
            <div className="results-inner">
              <div className="top-grid">
                <div className="score-card">
                  <p className="label-sm">ATS Score</p>
                  <div className="score-num">{analysis.score}</div>
                  <p className="score-desc">Your resume demonstrates strong ATS optimization and recruiter-friendly positioning.</p>
                </div>
                <div className="insights-card">
                  <p className="label-sm" style={{ color: "rgba(255,255,255,0.32)" }}>AI Insights</p>
                  <h2 className="insights-heading">Intelligent analysis generated from your resume profile.</h2>
                  <div className="mini-grid">
                    {[
                      { label: "Strengths", val: analysis.strengths?.length || 0 },
                      { label: "Weaknesses", val: analysis.weaknesses?.length || 0 },
                      { label: "Missing Skills", val: analysis.missingSkills?.length || 0 },
                      { label: "Suggestions", val: analysis.suggestions?.length || 0 },
                    ].map(({ label, val }) => (
                      <div className="mini-card" key={label}>
                        <p className="mini-label">{label}</p>
                        <h3 className="mini-val">{val}</h3>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="analysis-grid">
                {[
                  { title: "Strengths", items: analysis.strengths },
                  { title: "Weaknesses", items: analysis.weaknesses },
                  { title: "Missing Skills", items: analysis.missingSkills },
                  { title: "Suggestions", items: analysis.suggestions },
                ].map(({ title, items }) => (
                  <div className="analysis-card" key={title}>
                    <h2 className="analysis-title">{title}</h2>
                    <div className="analysis-items">
                      {items?.map((item, i) => <div className="analysis-item" key={i}>{item}</div>)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}