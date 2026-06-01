import React from "react";
import "../components/css/ManagerDashboard.css"; 
import {
  Search, Bell, Plus, Filter, Grid, List, MoreVertical,
  Paperclip, ArrowUpRight, Folder, Clock, AlertCircle,
  CheckCircle, Calendar, LayoutDashboard, Users, FileText,
  CreditCard, LogOut, Briefcase, BarChart2, Megaphone, Wrench, Key
} from "lucide-react";

function App() {
  const projects = [
    {
      title: "Q3 Marketing Campaign",
      dept: "Marketing",
      status: "On Track",
      statusClass: "status-ontrack",
      progress: 75,
      date: "Oct 24, 2024",
      avatars: ["blue", "purple", "pink"],
    },
    {
      title: "Mobile App Redesign",
      dept: "Design",
      status: "At Risk",
      statusClass: "status-atrisk",
      progress: 45,
      risk: "3 Risks",
      date: "Nov 12, 2024",
      avatars: ["purple", "pink"],
    },
    {
      title: "Internal API Migration",
      dept: "Development",
      status: "Completed",
      statusClass: "status-completed",
      progress: 90,
      date: "Sep 30, 2024",
      avatars: ["purple"],
    },
    {
      title: "Website Refresh",
      dept: "Design",
      status: "Delayed",
      statusClass: "status-delayed",
      progress: 30,
      risk: "1 Risks",
      date: "Dec 05, 2024",
      avatars: ["purple", "blue", "pink"],
    },
    {
      title: "Customer Portal V2",
      dept: "Development",
      status: "On Track",
      statusClass: "status-ontrack",
      progress: 15,
      date: "Jan 10, 2025",
      avatars: ["blue", "purple"],
    },
  ];

  return (
    <div className="container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <div className="logo-icon">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 22H22L12 2Z" /></svg>
          </div>
          PRISM
        </div>

        <nav className="nav-menu">
          <div className="nav-item"><LayoutDashboard size={20} /> Dashboard</div>
          <div className="nav-item"><Users size={20} /> Onboarding</div>
          <div className="nav-item"><FileText size={20} /> Documentation</div>
          <div className="nav-item"><CreditCard size={20} /> Payroll</div>
          <div className="nav-item"><LogOut size={20} /> Leave & Exit</div>
          <div className="nav-item"><Briefcase size={20} /> Employee Experience</div>
          <div className="nav-item"><BarChart2 size={20} /> Performance</div>
          <div className="nav-item"><Megaphone size={20} /> Announcements</div>
          <div className="nav-item"><Wrench size={20} /> HR notes</div>
          <div className="nav-item active"><Key size={20} /> Support Tickets</div>
          <div className="nav-item"><CreditCard size={20} /> Reports</div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Header */}
        <header className="top-header">
          <h1>Projects</h1>
          <div className="header-actions">
            <div className="search-bar">
              <Search size={18} className="search-icon" />
              <input type="text" placeholder="Search projects..." />
            </div>
            <div className="icon-btn"><Bell size={20} /></div>
            <button className="btn-primary"><Plus size={18} /> New Project</button>
            <div className="profile">
              <div className="profile-info">
                <h4>Om Vashishtha</h4>
                <p>Manager</p>
              </div>
              <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100" alt="Profile" />
            </div>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-info">
              <span className="stat-label">Total Projects</span>
              <span className="stat-value">12</span>
            </div>
            <div className="stat-icon purple"><Folder size={24} /></div>
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <span className="stat-label">In Progress</span>
              <span className="stat-value">8</span>
            </div>
            <div className="stat-icon blue"><Clock size={24} /></div>
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <span className="stat-label">At Risk</span>
              <span className="stat-value">3</span>
            </div>
            <div className="stat-icon red"><AlertCircle size={24} /></div>
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <span className="stat-label">Completed</span>
              <span className="stat-value">24</span>
            </div>
            <div className="stat-icon green"><CheckCircle size={24} /></div>
          </div>
        </div>

        {/* Filters */}
        <div className="filter-section">
          <div className="tabs">
            <button className="tab active">All Projects</button>
            <button className="tab">Active</button>
            <button className="tab">At Risk</button>
          </div>
          <div className="view-actions">
            <button className="view-btn"><Filter size={16} /> Filter</button>
            <button className="view-btn icon-only"><Grid size={16} /></button>
            <button className="view-btn icon-only"><List size={16} /></button>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="projects-grid">
          {projects.map((p, idx) => (
            <div className="project-card" key={idx}>
              <div className="card-top">
                <span className={`status-badge ${p.statusClass}`}>{p.status}</span>
                <MoreVertical size={16} className="more-icon" />
              </div>
              
              <div className="card-title">
                <h3>{p.title}</h3>
                <p>{p.dept}</p>
              </div>

              <div className="progress-section">
                <div className="progress-labels">
                  <span>Progress</span>
                  <span>{p.progress}%</span>
                </div>
                <div className="progress-track">
                  <div 
                    className={`progress-fill ${p.statusClass}`} 
                    style={{ width: `${p.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="card-footer">
                <div className="avatars">
                  {p.avatars.map((c, i) => <div key={i} className={`avatar ${c}`}></div>)}
                  <div className="avatar more">+2</div>
                </div>
                
                <div className="meta-info">
                  <div className="date"><Calendar size={14} /> {p.date}</div>
                  {p.risk && <div className="risk-tag"><AlertCircle size={14} /> {p.risk}</div>}
                </div>

                <div className="card-actions">
                  <Paperclip size={16} />
                  <ArrowUpRight size={16} />
                </div>
              </div>
            </div>
          ))}

          {/* New Project Placeholder */}
          <div className="project-card new-project">
            <div className="add-icon-circle">
              <Plus size={24} />
            </div>
            <h3>Create New Project</h3>
            <p>Start a new initiative</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;