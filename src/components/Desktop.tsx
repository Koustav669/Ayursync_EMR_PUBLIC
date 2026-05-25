import React from 'react';
import './Desktop.css';

export default function Desktop(): React.ReactElement {
  return (
    <div className="desktop-wrapper">
      <div className="desktop-container">
        {/* Header */}
        <div className="header">
          <div className="header-content">
            <img src="https://static.vecteezy.com/system/resources/thumbnails/019/813/207/small/modern-medical-and-health-care-center-ayurvedic-logo-design-illustration-free-vector.jpg" className="header-logo" alt="Ayurveda Logo" />
            <div className="header-titles">
              <p className="ayursync-title">AyurSync</p>
              <p className="emr-title">EMR</p>
            </div>
            <div className="header-divider"></div>
            <div className="ministry-section">
              <img src="https://ayush.gov.in/assets/img/emblem-dark-1.png" className="ministry-logo" alt="Indian Emblem" />
              <p className="ministry-text">Ministry of Ayush</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          {/* Clinical Search Node Section */}
          <div className="card clinical-search-card">
            <h2 className="card-title clinical-title">
              Clinical Search Node &#40;GET Interface&#41;
            </h2>

            <div className="search-input-container">
              <input type="text" id="search-input" placeholder="Enter traditional disease term"/>
              <svg
                width="31"
                height="26"
                viewBox="0 0 31 26"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="search-icon"
              >
                <path
                  d="M22.1667 19.3525L30.5 25.5M24.6667 12.3852C24.6667 18.9493 19.2568 24.2705 12.5833 24.2705C5.90989 24.2705 0.5 18.9493 0.5 12.3852C0.5 5.82121 5.90989 0.5 12.5833 0.5C19.2568 0.5 24.6667 5.82121 24.6667 12.3852Z"
                  stroke="black"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <button className="btn btn-primary">
              <span className="btn-text">Execute Mapping Query</span>
            </button>

            <h3 className="result-label">Query Result Table:</h3>

            <div className="table-container">
              <div className="table-header">
                <div className="table-column header-column col-1">
                  <div className="table-cell">
                    <p className="table-header-text">Traditional Name</p>
                  </div>
                </div>
                <div className="table-column header-column col-2">
                  <div className="table-cell">
                    <p className="table-header-text">NAMASTE Code</p>
                  </div>
                </div>
                <div className="table-column header-column col-3">
                  <div className="table-cell">
                    <p className="table-header-text">ICD-11 TM2 Code</p>
                  </div>
                </div>
                <div className="table-column header-column col-4">
                  <div className="table-cell">
                    <p className="table-header-text">Biomedical Title</p>
                  </div>
                </div>
              </div>

              <div className="table-body">
                <div className="table-column col-1">
                  <button className="table-cell">
                    <p className="table-text">Amavata</p>
                  </button>
                </div>
                <div className="table-column col-2">
                  <div className="table-cell">
                    <p className="table-text" id="namaste-code">AYU-RHEM-014</p>
                  </div>
                </div>
                <div className="table-column col-3">
                  <div className="table-cell" >
                    <p className="table-text" id="tm2-code">SF80</p>
                  </div>
                </div>
                <div className="table-column col-4">
                  <div className="table-cell">
                    <p className="table-text">Rheumatoid Arthritis</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="right-column">
            {/* Core Automation Sync Section */}
            <div className="card core-automation-card">
              <h2 className="card-title automation-title">
                Core Automation Sync &#40;POST&#41;
              </h2>
              <p className="card-description">
                Triggers active background dynamic linearization parsing directly
                against the WHO identity gateway server.
              </p>
              <button className="btn btn-secondary">
                <span className="btn-text">Trigger Live WHO Sync</span>
              </button>
            </div>

            {/* System Status Metrics Section */}
            <div className="card system-status-card">
              <h2 className="card-title status-title">System Status Metrics</h2>
              <p className="card-description status-description">
                Active Version: 2026-01<br />
                Database Status: Healthy<br />
                Last Sync Cycle: 2026-05-25
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
