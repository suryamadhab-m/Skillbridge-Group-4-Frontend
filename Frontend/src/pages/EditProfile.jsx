import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import API from "../utils/api";
import "./Dashboard.css";

export default function EditProfile() {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    location: "",
    skills: [],
    bio: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const availableSkills = [
    "Design",
    "Marketing",
    "Writing",
    "Photography",
    "Video Editing",
    "Project Management",
    "Event Planning",
    "Social Media",
    "Data Analysis",
    "Fundraising",
    "Web Development",
    "Graphic Design",
    "Teaching",
    "Translation",
    "Accounting",
    "Legal",
    "Healthcare",
    "Research",
    "Public Speaking",
    "Grant Writing",
    "Community Outreach",
  ];

  // Fetch user profile data on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await API.get("/users/profile");
        
        if (response.data) {
          const userData = response.data;
          setFormData({
            fullName: userData.name || "",
            email: userData.email || "",
            location: userData.location || "",
            skills: userData.skills || [],
            bio: userData.bio || "",
          });
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    // Use data from AuthContext if available, otherwise fetch
    if (user) {
      setFormData({
        fullName: user.name || "",
        email: user.email || "",
        location: user.location || "",
        skills: user.skills || [],
        bio: user.bio || "",
      });
      setLoading(false);
    } else {
      fetchUserProfile();
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError("");
    setSuccess("");
  };

  const handleSkillToggle = (skill) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.fullName.trim()) {
      setError("Full name is required");
      return;
    }

    if (formData.skills.length === 0) {
      setError("Please select at least one skill");
      return;
    }

    setSaving(true);

    try {
      // Call backend API to update profile
      const response = await API.put("/users/profile", {
        name: formData.fullName,
        location: formData.location,
        skills: formData.skills,
        bio: formData.bio,
      });

      if (response.data.success || response.data) {
        // Update the user in AuthContext
        if (updateProfile) {
          await updateProfile({
            name: formData.fullName,
            location: formData.location,
            skills: formData.skills,
            bio: formData.bio,
          });
        }

        setSuccess("Profile updated successfully!");
        
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          navigate("/volunteer-dashboard");
        }, 2000);
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      const errorMsg =
        err.response?.data?.message || "Failed to update profile. Please try again.";
      setError(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <header className="dashboard-header">
          <div className="dashboard-header-content">
            <div className="dashboard-logo" onClick={() => navigate("/")}>
              <div className="dashboard-logo-mark">S</div>
              <span className="dashboard-logo-text">SkillBridge</span>
            </div>
          </div>
        </header>
        <main className="dashboard-main">
          <div className="dashboard-container">
            <div style={{ textAlign: "center", padding: "40px" }}>
              <p>Loading profile...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="dashboard-header-content">
          <div className="dashboard-logo" onClick={() => navigate("/")}>
            <div className="dashboard-logo-mark">S</div>
            <span className="dashboard-logo-text">SkillBridge</span>
          </div>
          <nav className="dashboard-nav">
            <a href="/volunteer-dashboard" className="nav-link">
              Dashboard
            </a>
            <a href="/browse-opportunities" className="nav-link">
              Browse Opportunities
            </a>
            <a href="/messages" className="nav-link">
              Messages
            </a>
          </nav>
          <div className="dashboard-user">
            <div className="user-avatar">
              {formData.fullName ? formData.fullName.charAt(0).toUpperCase() : "U"}
            </div>
            <span className="user-name">{formData.fullName || "User"}</span>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-container" style={{ maxWidth: "800px" }}>
          <h2 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "8px" }}>
            Edit Your Profile
          </h2>
          <p style={{ color: "#6b7280", marginBottom: "32px" }}>
            Update your personal information and skills
          </p>

          {error && (
            <div
              style={{
                backgroundColor: "#fee2e2",
                border: "1px solid #fca5a5",
                color: "#991b1b",
                padding: "12px 16px",
                borderRadius: "8px",
                marginBottom: "20px",
              }}
            >
              {error}
            </div>
          )}

          {success && (
            <div
              style={{
                backgroundColor: "#d1fae5",
                border: "1px solid #6ee7b7",
                color: "#065f46",
                padding: "12px 16px",
                borderRadius: "8px",
                marginBottom: "20px",
              }}
            >
              {success}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="edit-profile-form"
            style={{
              background: "white",
              padding: "32px",
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
            }}
          >
            <div className="form-group">
              <label htmlFor="fullName" style={{ fontSize: "14px", fontWeight: "600", marginBottom: "8px", display: "block", color: "#374151" }}>
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  fontSize: "15px",
                }}
                required
              />
            </div>

            <div className="form-group" style={{ marginTop: "20px" }}>
              <label htmlFor="email" style={{ fontSize: "14px", fontWeight: "600", marginBottom: "8px", display: "block", color: "#374151" }}>
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                readOnly
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  fontSize: "15px",
                  backgroundColor: "#f9fafb",
                  cursor: "not-allowed",
                }}
              />
              <small style={{ color: "#6b7280", fontSize: "13px", marginTop: "4px", display: "block" }}>
                Email cannot be changed
              </small>
            </div>

            <div className="form-group" style={{ marginTop: "20px" }}>
              <label htmlFor="location" style={{ fontSize: "14px", fontWeight: "600", marginBottom: "8px", display: "block", color: "#374151" }}>
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="City, Country"
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  fontSize: "15px",
                }}
              />
            </div>

            <div className="form-group" style={{ marginTop: "20px" }}>
              <label style={{ fontSize: "14px", fontWeight: "600", marginBottom: "12px", display: "block", color: "#374151" }}>
                Skills <span style={{ color: "#ef4444" }}>*</span>
              </label>
              
              {/* Selected Skills */}
              {formData.skills.length > 0 && (
                <div style={{ marginBottom: "16px" }}>
                  <div className="skills-container">
                    {formData.skills.map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        className="skill-tag selected"
                        onClick={() => handleSkillToggle(skill)}
                        style={{
                          padding: "6px 14px",
                          borderRadius: "20px",
                          border: "1.5px solid #3b82f6",
                          background: "#dbeafe",
                          color: "#1e40af",
                          fontSize: "14px",
                          fontWeight: "500",
                          cursor: "pointer",
                        }}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Available Skills */}
              <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "8px" }}>
                Available Skills:
              </p>
              <div className="skills-container">
                {availableSkills.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    className={`skill-tag ${
                      formData.skills.includes(skill) ? "selected" : ""
                    }`}
                    onClick={() => handleSkillToggle(skill)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "20px",
                      border: formData.skills.includes(skill)
                        ? "1.5px solid #3b82f6"
                        : "1.5px solid #d1d5db",
                      background: formData.skills.includes(skill)
                        ? "#dbeafe"
                        : "#f9fafb",
                      color: formData.skills.includes(skill)
                        ? "#1e40af"
                        : "#374151",
                      fontSize: "14px",
                      fontWeight: "500",
                      cursor: "pointer",
                    }}
                  >
                    + {skill}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group" style={{ marginTop: "20px" }}>
              <label htmlFor="bio" style={{ fontSize: "14px", fontWeight: "600", marginBottom: "8px", display: "block", color: "#374151" }}>
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                rows="4"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Tell us about yourself..."
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  fontSize: "15px",
                  resize: "vertical",
                  minHeight: "100px",
                }}
              />
            </div>

            <div className="form-actions" style={{ marginTop: "32px" }}>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
                style={{
                  padding: "12px 24px",
                  fontSize: "15px",
                  fontWeight: "600",
                  borderRadius: "8px",
                  border: "none",
                  background: "#2563eb",
                  color: "white",
                  cursor: saving ? "not-allowed" : "pointer",
                  opacity: saving ? 0.6 : 1,
                }}
              >
                {saving ? "Saving..." : "💾 Save Changes"}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/volunteer-dashboard")}
                style={{
                  padding: "12px 24px",
                  fontSize: "15px",
                  fontWeight: "600",
                  borderRadius: "8px",
                  border: "none",
                  background: "#e5e7eb",
                  color: "#111827",
                  cursor: "pointer",
                }}
              >
                ✖ Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}