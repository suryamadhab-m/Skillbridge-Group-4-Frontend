import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import "./Dashboard.css";

export default function NGODashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Get opportunities stats from localStorage
  const getOpportunitiesStats = () => {
    const opportunities = JSON.parse(localStorage.getItem('opportunities') || '[]');
    return {
      total: opportunities.length,
      active: opportunities.filter(o => o.isActive).length,
      applications: opportunities.reduce((sum, o) => sum + (o.applications || 0), 0),
      pending: 16 // This would come from applications data in real implementation
    };
  };

  const [stats, setStats] = useState(getOpportunitiesStats());

  // Update stats when component mounts or when returning from other pages
  useEffect(() => {
    const updateStats = () => {
      setStats(getOpportunitiesStats());
    };
    
    // Update on mount
    updateStats();
    
    // Update when window gains focus (user returns to tab/page)
    window.addEventListener('focus', updateStats);
    
    // Listen for storage changes (when opportunities are added/updated)
    window.addEventListener('storage', updateStats);
    
    return () => {
      window.removeEventListener('focus', updateStats);
      window.removeEventListener('storage', updateStats);
    };
  }, []);

  const [activities, setActivities] = useState([
    {
      id: 1,
      type: "application",
      title: "John Doe applied to Community Garden Project",
      volunteer: "John Doe",
      time: "2 hours ago",
      isRead: false,
      status: "New",
    },
    {
      id: 2,
      type: "message",
      title: "New message from Sarah Johnson",
      volunteer: "Sarah Johnson",
      time: "4 hours ago",
      isRead: false,
      status: "Message",
    },
    {
      id: 3,
      type: "accepted",
      title: "You accepted Sarah Johnson for Food Distribution Drive",
      volunteer: "Sarah Johnson",
      time: "1 day ago",
      isRead: false,
      status: "Accepted",
    },
    {
      id: 4,
      type: "posted",
      title: "You posted Youth Mentorship Program",
      project: "Youth Mentorship Program",
      time: "2 days ago",
      isRead: false,
      status: "Posted",
    },
    {
      id: 5,
      type: "application",
      title: "Emily Chen applied to Beach Cleanup Initiative",
      volunteer: "Emily Chen",
      time: "2 days ago",
      isRead: false,
      status: "New",
    },
    {
      id: 6,
      type: "status",
      title: "Community Garden Project status changed to Closed",
      project: "Community Garden Project",
      time: "3 days ago",
      isRead: false,
      status: "Closed",
    },
    {
      id: 7,
      type: "rejected",
      title: "You rejected Mike Chen's application",
      volunteer: "Mike Chen",
      project: "Tech Training Workshop",
      time: "3 days ago",
      isRead: false,
      status: "Rejected",
    },
  ]);

  const dropdownRef = useRef(null);

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

  const handleMarkAllRead = () => {
    setActivities(activities.map((activity) => ({ ...activity, isRead: true })));
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "application":
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        );
      case "message":
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        );
      case "accepted":
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        );
      case "posted":
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
        );
      case "status":
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        );
      case "rejected":
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getStatusClass = (type) => {
    switch (type) {
      case "application":
        return "status-pending";
      case "message":
        return "status-message";
      case "accepted":
        return "status-accepted";
      case "posted":
        return "status-viewed";
      case "status":
        return "status-rejected";
      case "rejected":
        return "status-rejected";
      default:
        return "";
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
            <a href="/ngo-dashboard" className="nav-link active">
              Dashboard
            </a>
            <a href="/ngo-opportunities" className="nav-link">
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
          {/* Welcome Section */}
          <div className="dashboard-welcome">
            <h1>Welcome back, {user?.organizationName || "Green Earth Foundation"}!</h1>
            <p>Manage your opportunities and connect with volunteers</p>
          </div>

          {/* Stats Cards - Using dynamic stats from localStorage */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon applications">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <div className="stat-content">
                <p className="stat-label">Active Opportunities</p>
                <h2 className="stat-value">{stats.active}</h2>
              </div>
              <div className="stat-trend">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                  <polyline points="17 6 23 6 23 12" />
                </svg>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: "#eff6ff", color: "#2563eb" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div className="stat-content">
                <p className="stat-label">Total Applications</p>
                <h2 className="stat-value">{stats.applications}</h2>
              </div>
              <div className="stat-trend">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                  <polyline points="17 6 23 6 23 12" />
                </svg>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon accepted">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <div className="stat-content">
                <p className="stat-label">Accepted Volunteers</p>
                <h2 className="stat-value">18</h2>
              </div>
              <div className="stat-trend">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                  <polyline points="17 6 23 6 23 12" />
                </svg>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon pending">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div className="stat-content">
                <p className="stat-label">Pending Applications</p>
                <h2 className="stat-value">{stats.pending}</h2>
              </div>
              <div className="stat-trend">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                  <polyline points="17 6 23 6 23 12" />
                </svg>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <h2>Quick Actions</h2>
            <div className="action-buttons">
              <button className="action-btn primary" onClick={() => navigate("/create-opportunity")}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="16" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
                Create New Opportunity
              </button>
              <button className="action-btn secondary" onClick={() => navigate("/messages")}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                Messages
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="recent-activity">
            <div className="activity-header">
              <h2>Recent Activity</h2>
              <button className="mark-read-btn" onClick={handleMarkAllRead}>
                Mark all as read
              </button>
            </div>

            <div className="activity-list">
              {activities.map((activity) => (
                <div key={activity.id} className={`activity-item ${activity.isRead ? 'read' : ''}`}>
                  {!activity.isRead && <div className="unread-indicator" />}
                  
                  <div className={`activity-icon-wrapper ${getStatusClass(activity.type)}`}>
                    {getActivityIcon(activity.type)}
                  </div>

                  <div className="activity-content">
                    <div className="activity-main">
                      <p className="activity-text">
                        {activity.title}
                      </p>
                      <span className={`activity-status ${getStatusClass(activity.type)}`}>
                        {activity.status}
                      </span>
                    </div>
                    <div className="activity-meta">
                      {activity.volunteer && (
                        <>
                          <span className="activity-org">{activity.volunteer}</span>
                          <span className="activity-separator">•</span>
                        </>
                      )}
                      {activity.project && (
                        <>
                          <span className="activity-org">{activity.project}</span>
                          <span className="activity-separator">•</span>
                        </>
                      )}
                      <span className="activity-time">{activity.time}</span>
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