import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { Eye, EyeOff } from "lucide-react";
import { AuthProvider } from "../context/AuthProvider";
import "./form.css";

export default function Register() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { register } = useAuth();
  const role = searchParams.get("role") || "volunteer";

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
    contactPersonName: "",
    location: "",
    websiteUrl: "",
    organizationName: "",
    organizationDescription: "",
    skills: [],
    customSkill: "",
    bio: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const availableSkills = [
    "Web Development",
    "Graphic Design",
    "Marketing",
    "Data Analysis",
    "Project Management",
    "Writing",
    "Photography",
    "Social Media",
    "Fundraising",
    "Teaching",
    "Translation",
    "Accounting",
    "Legal",
    "Healthcare",
    "Event Planning",
    "Research",
    "Video Editing",
    "Public Speaking",
    "Grant Writing",
    "Community Outreach",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(""); // Clear error when user types
  };

  const handleSkillToggle = (skill) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const handleAddCustomSkill = () => {
    if (
      formData.customSkill.trim() &&
      !formData.skills.includes(formData.customSkill.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, prev.customSkill.trim()],
        customSkill: "",
      }));
    }
  };

  // Update the handleSubmit function in Register.jsx to ensure proper data flow

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  // Validation
  if (role === "volunteer" && formData.skills.length === 0) {
    setError("Please select at least one skill");
    return;
  }

  if (role === "ngo" && !formData.organizationName) {
    setError("Organization name is required");
    return;
  }

  setLoading(true);

  // Prepare data for API based on backend schema
  const registrationData = {
    name:
      role === "volunteer" ? formData.fullName : formData.contactPersonName,
    email: formData.email,
    password: formData.password,
    role: role,
    location: formData.location,
    bio: formData.bio,
  };

  // Add volunteer-specific fields
  if (role === "volunteer") {
    registrationData.skills = formData.skills;
  }

  // Add NGO-specific fields
  if (role === "ngo") {
    registrationData.organizationName = formData.organizationName;
    registrationData.organizationDescription =
      formData.organizationDescription;
    registrationData.websiteUrl = formData.websiteUrl;
  }

  // Call register function from AuthContext
  const result = await register(registrationData);
  setLoading(false);

  if (result.success) {
    console.log("Registration successful:", result.user);
    if (role === "volunteer") {
      navigate("/volunteer-dashboard");
    } else {
      navigate("/ngo-dashboard");
    }
  } else {
    const errorMsg = result.message
      ? result.message
      : "Registration failed. Please try again.";
    setError(errorMsg);
  }
};

  const handleBackToHome = () => {
    navigate("/");
  };

  if (role === "volunteer") {
    return (
      <div className="register-page">
        <button className="back-btn" onClick={handleBackToHome}>
          <span className="back-arrow">←</span> Back to Home
        </button>

        <div className="register-container">
          <div className="register-icon volunteer-icon">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>

          <h1 className="register-title">Create an Account as Volunteer</h1>
          <p className="register-subtitle">
            Join our community of skilled volunteers making a difference.
          </p>

          {error && (
            <div
              style={{
                backgroundColor: "#fee",
                border: "1px solid #fcc",
                color: "#c33",
                padding: "12px",
                borderRadius: "8px",
                marginBottom: "20px",
                textAlign: "center",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="username">
                  Username <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  Email <span className="required">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password">
                  Password <span className="required">*</span>
                </label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="Create a secure password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    minLength="6"
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="fullName">
                  Full Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  placeholder="Your full name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="location">Location (Optional)</label>
              <input
                type="text"
                id="location"
                name="location"
                placeholder="City, Country"
                value={formData.location}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>
                Skills <span className="required">*</span>
              </label>
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
                    {skill}
                  </button>
                ))}
                {formData.skills
                  .filter((s) => !availableSkills.includes(s))
                  .map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      className="skill-tag selected"
                      onClick={() => handleSkillToggle(skill)}
                    >
                      {skill}
                    </button>
                  ))}
              </div>
              <div className="custom-skill-input">
                <input
                  type="text"
                  placeholder="Add a custom skill"
                  value={formData.customSkill}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      customSkill: e.target.value,
                    }))
                  }
                  onKeyPress={(e) =>
                    e.key === "Enter" &&
                    (e.preventDefault(), handleAddCustomSkill())
                  }
                />
                <button
                  type="button"
                  className="add-skill-btn"
                  onClick={handleAddCustomSkill}
                >
                  +
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="bio">Bio (Optional)</label>
              <textarea
                id="bio"
                name="bio"
                rows="4"
                placeholder="Tell us about yourself, your experience, and what motivates you to volunteer..."
                value={formData.bio}
                onChange={handleInputChange}
              />
            </div>

            <button
              type="submit"
              className="submit-btn volunteer-btn"
              disabled={loading}
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>

            <p className="login-link">
              Already have an account? <a href="/login?role=volunteer">Login</a>
            </p>
          </form>
        </div>
      </div>
    );
  }

  // NGO Registration Form
  else {
    return (
      <div className="register-page">
        <button className="back-btn" onClick={handleBackToHome}>
          <span className="back-arrow">←</span> Back to Home
        </button>

        <div className="register-container">
          <div className="register-icon ngo-icon">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <line x1="9" y1="9" x2="15" y2="9" />
              <line x1="9" y1="15" x2="15" y2="15" />
            </svg>
          </div>

          <h1 className="register-title">Create an Account for NGO</h1>
          <p className="register-subtitle">
            Join our platform to connect with skilled volunteers for your
            organization.
          </p>

          {error && (
            <div
              style={{
                backgroundColor: "#fee",
                border: "1px solid #fcc",
                color: "#c33",
                padding: "12px",
                borderRadius: "8px",
                marginBottom: "20px",
                textAlign: "center",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="username">
                  Username <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  Email <span className="required">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="organization@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password">
                  Password <span className="required">*</span>
                </label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="Create a secure password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    minLength="6"
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="contactPersonName">
                  Contact Person Full Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="contactPersonName"
                  name="contactPersonName"
                  placeholder="Contact person's full name"
                  value={formData.contactPersonName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="location">Location (Optional)</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  placeholder="City, Country"
                  value={formData.location}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="websiteUrl">Website URL (Optional)</label>
                <input
                  type="url"
                  id="websiteUrl"
                  name="websiteUrl"
                  placeholder="https://www.yourorganization.org"
                  value={formData.websiteUrl}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="organizationName">
                Organization Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="organizationName"
                name="organizationName"
                placeholder="Your organization's name"
                value={formData.organizationName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="organizationDescription">
                Organization Description <span className="required">*</span>
              </label>
              <textarea
                id="organizationDescription"
                name="organizationDescription"
                rows="4"
                placeholder="Describe your organization's mission, goals, and the type of work you do..."
                value={formData.organizationDescription}
                onChange={handleInputChange}
                required
              />
            </div>

            <button
              type="submit"
              className="submit-btn ngo-btn"
              disabled={loading}
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>

            <p className="login-link">
              Already have an account? <a href="/login?role=ngo">Login</a>
            </p>
          </form>
        </div>
      </div>
    );
  }
}