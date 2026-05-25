import React from 'react';
import './Desktop.css';

export default function Desktop(): React.ReactElement {
  return (
    <div className="desktop-container">
      <svg
        width="1280"
        height="98"
        viewBox="0 0 1280 98"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="header-svg"
      >
        <g filter="url(#filter0_d_10_99)">
          <path d="M-3 0H1279.5V94H-3V0Z" fill="white" />
          <path d="M1279 0.5V93.5H-2.5V0.5H1279Z" stroke="#8E8D8D" />
        </g>
        <defs>
          <filter
            id="filter0_d_10_99"
            x="-7"
            y="-4"
            width="1290.5"
            height="102"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset />
            <feGaussianBlur stdDeviation="2" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_10_99"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_10_99"
              result="shape"
            />
          </filter>
        </defs>
      </svg>

      <img
        src="/Ayurveda1.png"
        className="logo-image"
        alt="ayurveda 1"
      />

      <p className="ayursync-title">AyurSync</p>
      <p className="emr-title">EMR</p>

      <svg
        width="1"
        height="53"
        viewBox="0 0 1 53"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="divider-line"
      >
        <path d="M0.5 0V53" stroke="#8E8D8D" />
      </svg>

      <img
        src="/Emblemdark11.png"
        className="ministry-emblem"
        alt="emblem-dark-1 1"
      />

      <p className="ministry-text">Ministry of Ayush</p>

      {/* Clinical Search Node Section */}
      <div className="card clinical-search-card">
        <p className="card-title clinical-title">
          Clinical Saerch Node &#40;GET Interface&#41;
        </p>

        <div className="search-input-container">
          <p className="search-placeholder">Enter traditional disease term</p>
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
          <p className="btn-text">Execute Mapping Query</p>
        </button>

        <p className="result-label">Query Result Table:</p>

        <div className="table-container">
          <div className="table-header">
            <div className="table-column header-column">
              <div className="table-cell">
                <p className="table-header-text">Traditional Name</p>
              </div>
            </div>
            <div className="table-column header-column">
              <div className="table-cell">
                <p className="table-header-text">NAMASTE Code</p>
              </div>
            </div>
            <div className="table-column header-column">
              <div className="table-cell">
                <p className="table-header-text">ICD-11 TM2 Code</p>
              </div>
            </div>
            <div className="table-column header-column">
              <div className="table-cell">
                <p className="table-header-text">Biomedical Title</p>
              </div>
            </div>
          </div>

          <div className="table-body">
            <div className="table-column">
              <button className="table-cell">
                <p className="table-text">Amavata</p>
              </button>
            </div>
            <div className="table-column">
              <div className="table-cell">
                <p className="table-text">AYU-RHEM-014</p>
              </div>
            </div>
            <div className="table-column">
              <div className="table-cell">
                <p className="table-text">SF80</p>
              </div>
            </div>
            <div className="table-column">
              <div className="table-cell">
                <p className="table-text">Rheumatoid Arthritis</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Core Automation Sync Section */}
      <div className="card core-automation-card">
        <p className="card-title automation-title">
          Core Automation Sync &#40;POST&#41;
        </p>
        <p className="card-description">
          Triggers active background dynamic linearization parsing directly
          against the WHO identity gateway server.
        </p>
        <button className="btn btn-secondary">
          <p className="btn-text">Trigger Live WHO Sync</p>
        </button>
      </div>

      {/* System Status Metrics Section */}
      <div className="card system-status-card">
        <p className="card-title status-title">System Status Metrices</p>
        <p className="card-description status-description">
          Active Version: 2026-01 Database Status: Healthy Last Sync Cycle:
          2026-05-25
        </p>
      </div>
    </div>
  );
}
