import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import "./dashboard.css";

export default function VolunteerDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [activities, setActivities] = useState([
    {
      id: 1,
      type: "pending",
      title: "Community Garden Project",
      organization: "Green Earth Foundation",
      time: "2 hours ago",
      isRead: false,
      action: "Applied to",
    },
    {
      id: 2,
      type: "accepted",
      title: "Beach Cleanup Initiative",
      organization: "Ocean Defenders",
      time: "5 hours ago",
      isRead: false,
      action: "Application accepted for",
    },
    {
      id: 3,
      type: "message",
      title: "Food Bank Volunteer",
      organization: "City Food Bank",
      time: "1 day ago",
      isRead: false,
      action: "New message from",
    },
    {
      id: 4,
      type: "viewed",
      title: "Youth Coding Workshop",
      organization: "TechForGood",
      time: "2 days ago",
      isRead: false,
      action: "Application viewed by",
    },
    {
      id: 5,
      type: "rejected",
      title: "Library Reading Program",
      organization: "City Library",
      time: "3 days ago",
      isRead: false,
      action: "Application rejected for",
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
      case "pending":
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        );
      case "accepted":
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        );
      case "message":
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        );
      case "viewed":
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
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
      case "pending":
        return "status-pending";
      case "accepted":
        return "status-accepted";
      case "message":
        return "status-message";
      case "viewed":
        return "status-viewed";
      case "rejected":
        return "status-rejected";
      default:
        return "";
    }
  };

  const getStatusText = (type) => {
    switch (type) {
      case "pending":
        return "Pending";
      case "accepted":
        return "Accepted";
      case "message":
        return "Message";
      case "viewed":
        return "Viewed";
      case "rejected":
        return "Rejected";
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
            <a href="#dashboard" className="nav-link active">
              Dashboard
            </a>
            <a href="#opportunities" className="nav-link">
              Browse Opportunities
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
              <div className="user-avatar">
                {user?.name?.charAt(0).toUpperCase() || "J"}
              </div>
              <span className="user-name">{user?.name || "John Doe"}</span>
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
                    navigate("/edit-profile");
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
            <h1>Welcome back, {user?.name?.split(" ")[0] || "John"}!</h1>
            <p>Here's what's happening with your volunteering journey</p>
          </div>

          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon applications">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <line x1="9" y1="9" x2="15" y2="9" />
                  <line x1="9" y1="15" x2="15" y2="15" />
                </svg>
              </div>
              <div className="stat-content">
                <p className="stat-label">Applications</p>
                <h2 className="stat-value">12</h2>
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
                <p className="stat-label">Accepted</p>
                <h2 className="stat-value">5</h2>
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
                <p className="stat-label">Pending</p>
                <h2 className="stat-value">4</h2>
              </div>
              <div className="stat-trend">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                  <polyline points="17 6 23 6 23 12" />
                </svg>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon skills">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </div>
              <div className="stat-content">
                <p className="stat-label">Skills</p>
                <h2 className="stat-value">8</h2>
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
              <button className="action-btn primary" onClick={() => navigate("/browse-opportunities")}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                Browse Opportunities
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
                        {activity.action} <strong>{activity.title}</strong>
                      </p>
                      <span className={`activity-status ${getStatusClass(activity.type)}`}>
                        {getStatusText(activity.type)}
                      </span>
                    </div>
                    <div className="activity-meta">
                      <span className="activity-org">{activity.organization}</span>
                      <span className="activity-separator">•</span>
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