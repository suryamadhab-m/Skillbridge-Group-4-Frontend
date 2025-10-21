import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css"; // reuse same styling

export default function EditProfile() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "John Doe",
    email: "john.doe@email.com",
    location: "New York, NY",
    skills: ["Teaching", "Coding"],
    bio: "Passionate about education and technology.",
  });

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
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSkillToggle = (skill) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated profile:", formData);
    alert("Profile updated successfully!");
    navigate("/volunteer-dashboard");
  };

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="dashboard-header-content">
          <div className="dashboard-logo" onClick={() => navigate("/")}>
            <div className="dashboard-logo-mark">S</div>
            <span className="dashboard-logo-text">SkillBridge</span>
          </div>
          <nav className="dashboard-nav">
            <a href="/volunteer-dashboard" className="nav-link">Dashboard</a>
            <a href="/browse-opportunities" className="nav-link">Browse Opportunities</a>
            <a href="/messages" className="nav-link">Messages</a>
          </nav>
          <div className="dashboard-user">
            <div className="user-avatar">J</div>
            <span className="user-name">John Doe</span>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-container">
          <h2>Edit Your Profile</h2>
          <p>Update your personal information and skills</p>

          <form onSubmit={handleSubmit} className="edit-profile-form">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                readOnly
              />
            </div>

            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Skills</label>
              <div className="skills-container">
                {formData.skills.map((skill) => (
                  <span key={skill} className="skill-tag selected">
                    {skill}
                  </span>
                ))}
              </div>
              <p>Available Skills:</p>
              <div className="skills-container">
                {availableSkills.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    className={`skill-tag ${
                      formData.skills.includes(skill) ? "selected" : ""
                    }`}
                    onClick={() => handleSkillToggle(skill)}
                  >
                    + {skill}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Bio</label>
              <textarea
                name="bio"
                rows="4"
                value={formData.bio}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                💾 Save Changes
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/volunteer-dashboard")}
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
