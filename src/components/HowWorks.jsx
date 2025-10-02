import React from "react";
import "./components.css";

export default function HowItWorks() {
  const steps = [
    {
      title: "For Volunteers",
      desc: "Create your profile, showcase your skills, and discover meaningful volunteer opportunities that match your expertise and interests.",
      icon: "👤",
      color: "#2563eb", // blue
    },
    {
      title: "For NGOs",
      desc: "Post your projects, specify the skills you need, and connect with qualified volunteers who are passionate about your cause.",
      icon: "🤲",
      color: "#10b981", // green
    },
    {
      title: "Make Impact",
      desc: "Together, create positive change in communities while building valuable professional relationships and gaining new experiences.",
      icon: "🌍",
      color: "#f59e0b", // yellow
    },
  ];

  return (
    <section className="sb-hiw">
      <div className="container">
        <h2 className="sb-section-title">How SkillBridge Works</h2>
        <div className="sb-hiw-grid">
          {steps.map((step, i) => (
            <div key={i} className="sb-hiw-card">
              <div
                className="sb-hiw-icon"
                style={{ backgroundColor: step.color + "20", color: step.color }}
              >
                {step.icon}
              </div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
