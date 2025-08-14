import React from 'react'
import './Results.css'

const Results: React.FC = () => {
  return (
    <div className="results-container">
      <div className="results-card">
        <div className="results-header">
          <h1 className="results-title">Results</h1>
          <div className="results-subtitle">
            <span className="results-count">Showing 1-10 of 25 results</span>
            <div className="results-filters">
              <button className="filter-button active">All</button>
              <button className="filter-button">Recent</button>
              <button className="filter-button">Popular</button>
            </div>
          </div>
        </div>
        
        <div className="results-content">
          <div className="result-item">
            <div className="result-icon">
              <div className="icon-circle">
                <span className="icon-text">A</span>
              </div>
            </div>
            <div className="result-details">
              <h3 className="result-title">Analytics Dashboard</h3>
              <p className="result-description">
                Comprehensive analytics dashboard with real-time data visualization and reporting capabilities.
              </p>
              <div className="result-meta">
                <span className="result-category">Analytics</span>
                <span className="result-date">Updated 2 days ago</span>
              </div>
            </div>
            <div className="result-actions">
              <button className="action-button primary">View</button>
              <button className="action-button secondary">Share</button>
            </div>
          </div>
          
          <div className="result-item">
            <div className="result-icon">
              <div className="icon-circle">
                <span className="icon-text">R</span>
              </div>
            </div>
            <div className="result-details">
              <h3 className="result-title">Revenue Report</h3>
              <p className="result-description">
                Detailed revenue analysis with quarterly comparisons and growth metrics.
              </p>
              <div className="result-meta">
                <span className="result-category">Reports</span>
                <span className="result-date">Updated 1 week ago</span>
              </div>
            </div>
            <div className="result-actions">
              <button className="action-button primary">View</button>
              <button className="action-button secondary">Share</button>
            </div>
          </div>
          
          <div className="result-item">
            <div className="result-icon">
              <div className="icon-circle">
                <span className="icon-text">U</span>
              </div>
            </div>
            <div className="result-details">
              <h3 className="result-title">User Management</h3>
              <p className="result-description">
                Complete user management system with role-based access control and permissions.
              </p>
              <div className="result-meta">
                <span className="result-category">Management</span>
                <span className="result-date">Updated 3 days ago</span>
              </div>
            </div>
            <div className="result-actions">
              <button className="action-button primary">View</button>
              <button className="action-button secondary">Share</button>
            </div>
          </div>
        </div>
        
        <div className="results-footer">
          <div className="pagination">
            <button className="pagination-button">Previous</button>
            <div className="page-numbers">
              <button className="page-button active">1</button>
              <button className="page-button">2</button>
              <button className="page-button">3</button>
            </div>
            <button className="pagination-button">Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Results 