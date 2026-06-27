import React, { useState, useEffect } from 'react';
import './Desktop.css';

const API_BASE = 'http://localhost:8000';

interface TerminologyMatch {
  id: number;
  traditional_term_name: string;
  namaste_system_code: string;
  icd11_tm2_code: string;
  conventional_english_title: string;
  system_version: string;
}

interface SystemStatus {
  version: string;
  status: string;
  lastSync: string;
}

export default function Desktop(): React.ReactElement {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<TerminologyMatch[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [searchMessage, setSearchMessage] = useState('');

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');
  const [syncError, setSyncError] = useState('');

  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    version: '—',
    status: 'Checking...',
    lastSync: '—',
  });

  // Fetch system health on mount
  useEffect(() => {
    fetch(`${API_BASE}/`)
      .then((res) => res.json())
      .then((data) => {
        setSystemStatus({
          version: data.version || '1.0.0',
          status: data.status === 'healthy' ? 'Healthy' : 'Unhealthy',
          lastSync: new Date().toISOString().split('T')[0],
        });
      })
      .catch(() => {
        setSystemStatus({
          version: '—',
          status: 'Offline',
          lastSync: '—',
        });
      });
  }, []);

  // Search handler
  const handleSearch = async () => {
    const term = searchTerm.trim();
    if (!term) {
      setSearchError('Please enter a disease term to search.');
      return;
    }

    setIsSearching(true);
    setSearchError('');
    setSearchMessage('');
    setResults([]);

    try {
      const res = await fetch(`${API_BASE}/api/v1/search?term=${encodeURIComponent(term)}`);
      const data = await res.json();

      if (!res.ok) {
        setSearchError(data.detail || `Server returned ${res.status}`);
        return;
      }

      setResults(data.matches || []);
      setSearchMessage(data.message || `Found ${data.count} result(s).`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setSearchError(`Connection failed: ${message}. Is the backend running on port 8000?`);
    } finally {
      setIsSearching(false);
    }
  };

  // Sync handler
  const handleSync = async () => {
    setIsSyncing(true);
    setSyncError('');
    setSyncMessage('');

    try {
      const res = await fetch(`${API_BASE}/api/v1/sync/auto-update`, { method: 'POST' });
      const data = await res.json();

      if (!res.ok) {
        setSyncError(data.detail || `Sync failed with status ${res.status}`);
        return;
      }

      setSyncMessage(data.message || 'Sync completed successfully.');
      if (data.updated_at) {
        setSystemStatus((prev) => ({
          ...prev,
          lastSync: data.updated_at.split('T')[0],
        }));
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setSyncError(`Sync connection failed: ${message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  // Enter key handler
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

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
              <input
                type="text"
                id="search-input"
                placeholder="Enter traditional disease term"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isSearching}
              />
              <svg
                width="31"
                height="26"
                viewBox="0 0 31 26"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="search-icon"
                onClick={handleSearch}
                style={{ cursor: 'pointer' }}
              >
                <path
                  d="M22.1667 19.3525L30.5 25.5M24.6667 12.3852C24.6667 18.9493 19.2568 24.2705 12.5833 24.2705C5.90989 24.2705 0.5 18.9493 0.5 12.3852C0.5 5.82121 5.90989 0.5 12.5833 0.5C19.2568 0.5 24.6667 5.82121 24.6667 12.3852Z"
                  stroke="black"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <button className="btn btn-primary" onClick={handleSearch} disabled={isSearching}>
              <span className="btn-text">{isSearching ? 'Searching...' : 'Execute Mapping Query'}</span>
            </button>

            {/* Status Messages */}
            {searchError && <p className="status-msg error-msg">{searchError}</p>}
            {searchMessage && !searchError && <p className="status-msg success-msg">{searchMessage}</p>}

            <h3 className="result-label">Query Result Table:</h3>

            <div className="table-container" style={results.length > 1 ? { height: 'auto', maxHeight: '300px', overflowY: 'auto' } : undefined}>
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

              {results.length === 0 ? (
                <div className="table-body">
                  <div className="table-column col-1">
                    <div className="table-cell">
                      <p className="table-text empty-text">—</p>
                    </div>
                  </div>
                  <div className="table-column col-2">
                    <div className="table-cell">
                      <p className="table-text empty-text">—</p>
                    </div>
                  </div>
                  <div className="table-column col-3">
                    <div className="table-cell">
                      <p className="table-text empty-text">—</p>
                    </div>
                  </div>
                  <div className="table-column col-4">
                    <div className="table-cell">
                      <p className="table-text empty-text">—</p>
                    </div>
                  </div>
                </div>
              ) : (
                results.map((match) => (
                  <div className="table-body" key={match.id}>
                    <div className="table-column col-1">
                      <div className="table-cell">
                        <p className="table-text">{match.traditional_term_name}</p>
                      </div>
                    </div>
                    <div className="table-column col-2">
                      <div className="table-cell">
                        <p className="table-text" id="namaste-code">{match.namaste_system_code}</p>
                      </div>
                    </div>
                    <div className="table-column col-3">
                      <div className="table-cell">
                        <p className="table-text" id="tm2-code">{match.icd11_tm2_code}</p>
                      </div>
                    </div>
                    <div className="table-column col-4">
                      <div className="table-cell">
                        <p className="table-text">{match.conventional_english_title}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
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
              {syncError && <p className="status-msg error-msg">{syncError}</p>}
              {syncMessage && !syncError && <p className="status-msg success-msg">{syncMessage}</p>}
              <button className="btn btn-secondary" onClick={handleSync} disabled={isSyncing}>
                <span className="btn-text">{isSyncing ? 'Syncing...' : 'Trigger Live WHO Sync'}</span>
              </button>
            </div>

            {/* System Status Metrics Section */}
            <div className="card system-status-card">
              <h2 className="card-title status-title">System Status Metrics</h2>
              <p className="card-description status-description">
                Active Version: {systemStatus.version}<br />
                Database Status: {systemStatus.status}<br />
                Last Sync Cycle: {systemStatus.lastSync}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
