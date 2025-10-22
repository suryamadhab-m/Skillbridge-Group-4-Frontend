import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import "./Dashboard.css";
import "./Opportunities.css";

export default function NGOOpportunities() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Sample opportunities data with localStorage integration
  const getInitialOpportunities = () => {
    const saved = localStorage.getItem('opportunities');
    if (saved) {
      return JSON.parse(saved);
    }
    // Default opportunities if none saved
    return [
      {
        id: 1,
        title: "Community Garden Project",
        location: "Brooklyn, NY",
        duration: "3 months, 5 hours/week",
        applications: 8,
        isActive: true,
        tags: ["Gardening", "Teaching", "Project Management"]
      },
      {
        id: 2,
        title: "Beach Cleanup Initiative",
        location: "Los Angeles, CA",
        duration: "1 day/month",
        applications: 12,
        isActive: true,
        tags: ["Event Planning", "Leadership"]
      },
      {
        id: 3,
        title: "Environmental Education Workshop",
        location: "Remote",
        duration: "6 weeks, 3 hours/week",
        applications: 15,
        isActive: true,
        tags: ["Teaching", "Public Speaking", "Design"]
      },
      {
        id: 4,
        title: "Tree Planting Event",
        location: "Portland, OR",
        duration: "Weekend event",
        applications: 5,
        isActive: false,
        tags: ["Physical Labor", "Event Planning"]
      },
      {
        id: 5,
        title: "Social Media Campaign Manager",
        location: "Remote",
        duration: "2 months, 10 hours/week",
        applications: 9,
        isActive: true,
        tags: ["Social Media", "Marketing", "Design"]
      },
      {
        id: 6,
        title: "Wildlife Photography Project",
        location: "Multiple Locations",
        duration: "4 weeks, flexible",
        applications: 7,
        isActive: true,
        tags: ["Photography", "Video Editing"]
      }
    ];
  };

  const [opportunities, setOpportunities] = useState(getInitialOpportunities);

  // Save to localStorage whenever opportunities change
  useEffect(() => {
    localStorage.setItem('opportunities', JSON.stringify(opportunities));
  }, [opportunities]);

  // Calculate stats
  const totalOpportunities = opportunities.length;
  const activeOpportunities = opportunities.filter(o => o.isActive).length;
  const closedOpportunities = opportunities.filter(o => !o.isActive).length;
  const totalApplications = opportunities.reduce((sum, o) => sum + o.applications, 0);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleToggleStatus = (id) => {
    setOpportunities(prev =>
      prev.map(opp =>
        opp.id === id ? { ...opp, isActive: !opp.isActive } : opp
      )
    );
  };

  const handleEdit = (id) => {
    console.log("Edit opportunity:", id);
    // Navigate to edit page or open modal
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this opportunity?")) {
      setOpportunities(prev => prev.filter(opp => opp.id !== id));
    }
  };

  return (
    <div className="dashboard-page">
      {/* Header */}
      <header className="dashboard-header">
        <div className="dashboard-header-content">
          <div className="dashboard-logo" onClick={() => navigate("/")}>
            <div className="dashboard-logo-mark">S</div>
            <span className="dashboard-logo-text">SkillBridge</span>
          </div>

          <nav className="dashboard-nav">
            <a href="/ngo-dashboard" className="nav-link">
              Dashboard
            </a>
            <a href="/ngo-opportunities" className="nav-link active">
              My Opportunities
            </a>
            <a href="#applications" className="nav-link">
              Applications
            </a>
            <a href="#messages" className="nav-link">
              Messages
            </a>
          </nav>

          <div className="dashboard-user" ref={dropdownRef}>
            <button
              className="user-profile-btn"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <div className="user-avatar" style={{ background: "linear-gradient(135deg, #10b981 0%, #059669 100%)" }}>
                {user?.name?.charAt(0).toUpperCase() || "G"}
              </div>
              <span className="user-name">{user?.organizationName || "Green Earth Foundation"}</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                style={{
                  transform: showDropdown ? "rotate(180deg)" : "rotate(0)",
                  transition: "transform 0.2s ease",
                }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {showDropdown && (
              <div className="user-dropdown">
                <button
                  className="dropdown-item"
                  onClick={() => {
                    setShowDropdown(false);
                    navigate("/edit-ngo-profile");
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  Edit Profile
                </button>
                <button className="dropdown-item logout" onClick={handleLogout}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="dashboard-container">
          {/* Page Header */}
          <div className="dashboard-welcome">
            <h1>My Opportunities</h1>
            <p>Manage and edit your volunteer opportunities</p>
          </div>

          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon" style={{ background: "#eff6ff", color: "#2563eb" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <div className="stat-content">
                <p className="stat-label">Total Opportunities</p>
                <h2 className="stat-value">{totalOpportunities}</h2>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon accepted">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </div>
              <div className="stat-content">
                <p className="stat-label">Open Positions</p>
                <h2 className="stat-value">{activeOpportunities}</h2>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon applications">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="8.5" cy="7" r="4" />
                  <polyline points="17 11 19 13 23 9" />
                </svg>
              </div>
              <div className="stat-content">
                <p className="stat-label">Total Applications</p>
                <h2 className="stat-value">{totalApplications}</h2>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: "#fee2e2", color: "#ef4444" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              </div>
              <div className="stat-content">
                <p className="stat-label">Closed</p>
                <h2 className="stat-value">{closedOpportunities}</h2>
              </div>
            </div>
          </div>

          {/* Create New Opportunity Button */}
          <div className="quick-actions" style={{ marginBottom: "32px" }}>
            <div className="action-buttons">
              <button 
                className="action-btn primary" 
                onClick={() => navigate("/create-opportunity")}
                style={{ maxWidth: "fit-content" }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="16" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
                Create New Opportunity
              </button>
            </div>
          </div>

          {/* All Opportunities Section */}
          <div className="opportunities-section">
            <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#111827", marginBottom: "24px" }}>
              All Opportunities ({totalOpportunities})
            </h2>

            <div className="opportunities-grid">
              {opportunities.map((opp) => (
                <div key={opp.id} className="opportunity-card">
                  {/* Card Header */}
                  <div className="opportunity-header">
                    <div>
                      <h3 className="opportunity-title">{opp.title}</h3>
                      <div className="opportunity-meta">
                        <span className="meta-item">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                          {opp.location}
                        </span>
                        <span className="meta-separator">•</span>
                        <span className="meta-item">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                          {opp.duration}
                        </span>
                      </div>
                    </div>

                    <div className={`status-badge ${opp.isActive ? 'active' : 'closed'}`}>
                      {opp.isActive ? 'Active' : 'Closed'}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="opportunity-tags">
                    {opp.tags.map((tag, index) => (
                      <span key={index} className="tag">{tag}</span>
                    ))}
                  </div>

                  {/* Card Footer */}
                  <div className="opportunity-footer">
                    <div className="applications-count">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                      {opp.applications} applications
                    </div>

                    <div className="opportunity-actions">
                      <button 
                        className="icon-btn edit"
                        onClick={() => handleEdit(opp.id)}
                        title="Edit opportunity"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>

                      <button 
                        className="icon-btn delete"
                        onClick={() => handleDelete(opp.id)}
                        title="Delete opportunity"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>

                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={opp.isActive}
                          onChange={() => handleToggleStatus(opp.id)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}