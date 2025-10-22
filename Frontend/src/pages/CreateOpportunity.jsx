import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import "./Dashboard.css";
import "./CreateOpportunity.css";

export default function CreateOpportunity() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const dropdownRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    skills: [],
    duration: "",
    location: ""
  });

  const [errors, setErrors] = useState({});

  const availableSkills = [
    "Teaching",
    "Coding",
    "Design",
    "Marketing",
    "Writing",
    "Photography",
    "Video Editing",
    "Project Management",
    "Event Planning",
    "Social Media",
    "Data Analysis",
    "Fundraising"
  ];

  const locations = [
    "Remote",
    "New York, NY",
    "Los Angeles, CA",
    "Chicago, IL",
    "Houston, TX",
    "Phoenix, AZ",
    "Philadelphia, PA",
    "San Antonio, TX",
    "San Diego, CA",
    "Dallas, TX",
    "San Jose, CA",
    "Austin, TX",
    "Jacksonville, FL",
    "Fort Worth, TX",
    "Columbus, OH",
    "San Francisco, CA",
    "Charlotte, NC",
    "Indianapolis, IN",
    "Seattle, WA",
    "Denver, CO",
    "Boston, MA",
    "Portland, OR",
    "Brooklyn, NY",
    "Multiple Locations"
  ];

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSkillToggle = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
    // Clear skills error when user selects a skill
    if (errors.skills) {
      setErrors(prev => ({
        ...prev,
        skills: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Opportunity title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Detailed description is required";
    } else if (formData.description.trim().length < 50) {
      newErrors.description = "Description should be at least 50 characters";
    }

    if (formData.skills.length === 0) {
      newErrors.skills = "Please select at least one required skill";
    }

    if (!formData.duration.trim()) {
      newErrors.duration = "Duration is required";
    }

    if (!formData.location) {
      newErrors.location = "Please select a location";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Create new opportunity object
    const newOpportunity = {
      id: Date.now(),
      title: formData.title,
      description: formData.description,
      location: formData.location,
      duration: formData.duration,
      applications: 0,
      isActive: true,
      tags: formData.skills
    };

    // Get existing opportunities from localStorage
    const existingOpportunities = JSON.parse(localStorage.getItem('opportunities') || '[]');
    
    // Add new opportunity
    const updatedOpportunities = [...existingOpportunities, newOpportunity];
    
    // Save to localStorage
    localStorage.setItem('opportunities', JSON.stringify(updatedOpportunities));

    // Show success toast
    setShowSuccessToast(true);

    // Hide toast after 3 seconds and redirect
    setTimeout(() => {
      setShowSuccessToast(false);
      navigate("/ngo-opportunities");
    }, 3000);
  };

  const handleCancel = () => {
    navigate("/ngo-opportunities");
  };

  return (
    <div className="dashboard-page">
      {/* Success Toast */}
      {showSuccessToast && (
        <div className="success-toast">
          <div className="toast-content">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <span>Opportunity created successfully!</span>
          </div>
        </div>
      )}

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
            <h1>Post New Opportunity</h1>
            <p>Create a volunteer opportunity for your organization</p>
          </div>

          {/* Create Opportunity Form */}
          <div className="create-opportunity-card">
            <form onSubmit={handleSubmit} className="create-opportunity-form">
              {/* Opportunity Title */}
              <div className="form-group">
                <label htmlFor="title">
                  Opportunity Title <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="e.g., Community Garden Project"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={errors.title ? "error" : ""}
                />
                {errors.title && <span className="error-message">{errors.title}</span>}
              </div>

              {/* Detailed Description */}
              <div className="form-group">
                <label htmlFor="description">
                  Detailed Description <span className="required">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="6"
                  placeholder="Describe the opportunity, responsibilities, and what volunteers will do..."
                  value={formData.description}
                  onChange={handleInputChange}
                  className={errors.description ? "error" : ""}
                />
                {errors.description && <span className="error-message">{errors.description}</span>}
              </div>

              {/* Required Skills */}
              <div className="form-group">
                <label>
                  Required Skills <span className="required">*</span>
                </label>
                <div className="skills-selector">
                  <p className="skills-hint">Select required skills:</p>
                  <div className="skills-grid">
                    {availableSkills.map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        className={`skill-chip ${formData.skills.includes(skill) ? 'selected' : ''}`}
                        onClick={() => handleSkillToggle(skill)}
                      >
                        <span className="skill-plus">+</span> {skill}
                      </button>
                    ))}
                  </div>
                  {errors.skills && <span className="error-message">{errors.skills}</span>}
                </div>
              </div>

              {/* Duration */}
              <div className="form-group">
                <label htmlFor="duration">
                  Duration <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="duration"
                  name="duration"
                  placeholder="e.g., 3 weeks, 10 hours/week"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className={errors.duration ? "error" : ""}
                />
                {errors.duration && <span className="error-message">{errors.duration}</span>}
              </div>

              {/* Location */}
              <div className="form-group">
                <label htmlFor="location">
                  Location <span className="required">*</span>
                </label>
                <select
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className={errors.location ? "error" : ""}
                >
                  <option value="">Select a location</option>
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
                {errors.location && <span className="error-message">{errors.location}</span>}
              </div>

              {/* Form Actions */}
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                    <polyline points="17 21 17 13 7 13 7 21" />
                    <polyline points="7 3 7 8 15 8" />
                  </svg>
                  Create Opportunity
                </button>
                <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}