import "./App.css";
import { HashRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";

import Navbar from "./Adminside/Components/Navbar";
import Login from "./Adminside/Components/Login";
import Admindashboard from "./Adminside/Components/Admindashboard";
import EmployeePage from "./Adminside/Components/EmployeePage";
import Projects from "./Adminside/Components/Projects";
import ProjectDetailspage from "./Adminside/Components/ProjectDetailspage";
import Taskpage from "./Adminside/Components/Taskpage";
import Rolepage from "./Adminside/Components/Rolepage";
import Ticketpage from "./Adminside/Components/Ticketpage";
import Announcementpage from "./Adminside/Components/Announcementpage";
import HRhubpage from "./Adminside/Components/HRhubpage";
import Performance from "./Adminside/Components/Performance";
import ProductivityReport from "./Adminside/Components/ProductivityReport";
import DailyReport from "./Adminside/Components/DailyReport";
import PerformanceHeatmap from "./Adminside/Components/Performanceheatmap";
import RedFlagsReport from "./Adminside/Components/RedFlagReports";
import ProjectSuccessReports from "./Adminside/Components/ProjectSuccessReports";
import SLAComplianceDashboard from "./Adminside/Components/SLApage";
import Reports from "./Adminside/Components/Reports";
import SelectPosition from "./Adminside/Components/Entrypage";
import EmployeeLogin from "./Employee Side/Components/EmployeeLogin";
import EmployeeDashboard from "./Employee Side/Components/EmployeeDashboard";
import EmployeeTaskpage from "./Employee Side/Components/EmployeeTaskpage";
import DailyReports from "./Employee Side/Components/EmployeeReports";
import Calendarpage from "./Employee Side/Components/Calendarpage";
import EmployeeAnnouncementpage from "./Employee Side/Components/EmployeeAnnouncementpage";
import EmployeeSupport from "./Employee Side/Components/EmployeeSupport";
import ProjectWorkspace from "./Employee Side/Components/ProjectWorkspace";
import EmployeesProjectpage from "./Employee Side/Components/EmployeesProjectpage"
import EmployeeDetails from "./Adminside/Components/EmployeeDetailspage";
import EmployeeProfile from "./Employee Side/Components/EmployeeProfile";
import ManagerLogin from "./Managerside/components/ManagerLogin";
import HRLogin from "./hrside/Components/HRLogin";
import navbarStyles from "./Adminside/CSS/navbar.module.css";

/* ---------- LAYOUT (Navbar + sidebar offset) ---------- */
function Layout({ children, onAddEmployee, onAssignTask }) {
  const location = useLocation();

  // change before if you pull and push the code into github
    // const hideNavbarRoutes = ["/","/login","/employeelogin","/managerlogin","/hrlogin"];
  // const hideNavbar = hideNavbarRoutes.includes(location.pathname);

  
  const hideNavbarRoutes = ["/login","/employeelogin","/managerlogin","/hrlogin"];
  const hideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar onAddEmployee={onAddEmployee} onAssignTask={onAssignTask} />}
      <div className={!hideNavbar ? navbarStyles.mainContent : ""}>
        {children}
      </div>
    </>
  );
}

function App() {
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [showAssignTask, setShowAssignTask] = useState(false);

  return (
    <>
      <Router>
        <Layout onAddEmployee={() => setShowAddEmployee(true)} onAssignTask={() => setShowAssignTask(true)}>
          <Routes>
            <Route path="/" element={<Admindashboard 
                  showAddEmployee={showAddEmployee}
                  setShowAddEmployee={setShowAddEmployee}
                  showAssignTask={showAssignTask}
                  setShowAssignTask={setShowAssignTask}
                />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Admindashboard 
                  showAddEmployee={showAddEmployee}
                  setShowAddEmployee={setShowAddEmployee}
                  showAssignTask={showAssignTask}
                  setShowAssignTask={setShowAssignTask}
                />} />
            <Route path="/employees/:id" element={<EmployeeDetails />} />
            <Route path="/employees" element={<EmployeePage />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetailspage />} />
            <Route path="/tasks" element={<Taskpage />} />
            <Route path="/role" element={<Rolepage />} />
            <Route path="/support" element={<Ticketpage />} />
            <Route path="/announcement" element={<Announcementpage />} />
            <Route path="/hr" element={<HRhubpage />} />
            <Route path="/performance" element={<Performance />} />
            <Route path="/reports1" element={<ProductivityReport />} />
            <Route path="/daily-report-submission" element={<DailyReport />} />
            <Route path="/heatmap" element={<PerformanceHeatmap />} />
            <Route path="/redreport" element={<RedFlagsReport />} />
            <Route path="/project-success" element={<ProjectSuccessReports />} />
            <Route path="/task-analytics" element={<SLAComplianceDashboard />} />
            <Route path="/data-export" element={<Reports />} />

            {/* employees */}
            <Route path="/employeelogin" element={<EmployeeLogin/>} />
            <Route path="/employee/dashboard" element={<EmployeeDashboard/>} />
            <Route path="/employees/tasks" element={<EmployeeTaskpage/>} />
            <Route path="/employee/reports" element={<DailyReports/>} />
            <Route path="/employee/Calendar" element={<Calendarpage/>} />
            <Route path="/employee/announcement" element={<EmployeeAnnouncementpage/>} />
            <Route path="/employee/support" element={<EmployeeSupport/>} />
            <Route path="/employee/projects" element={<EmployeesProjectpage/>} />
            <Route path="/employee/projects/:id" element={<ProjectWorkspace/>} />
            <Route path="/employee/profile" element={<EmployeeProfile/>} />

            {/* manager */}
            <Route path="/managerlogin" element={<ManagerLogin/>} />

            {/* hr */}
            <Route path="/hrlogin" element={<HRLogin/>} />
          </Routes>
        </Layout>
      </Router>

      <ToastContainer position="top-center" autoClose={3000} />
    </>
  );
}

export default App;