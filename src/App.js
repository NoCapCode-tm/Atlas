import "./App.css";
import { HashRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "../src/Adminside/Components/Navbar";
import Login from "../src/Adminside/Components/Login";
import Admindashboard from "../src/Adminside/Components/Admindashboard";
import EmployeePage from "../src/Adminside/Components/EmployeePage";
import Projects from "../src/Adminside/Components/Projects";
import ProjectDetailspage from "../src/Adminside/Components/ProjectDetailspage";
import Taskpage from "../src/Adminside/Components/Taskpage";
import Rolepage from "../src/Adminside/Components/Rolepage";
import Ticketpage from "../src/Adminside/Components/Ticketpage";
import Announcementpage from "../src/Adminside/Components/Announcementpage";
import HRhubpage from "../src/Adminside/Components/HRhubpage";
import Performance from "../src/Adminside/Components/Performance";
import ProductivityReport from "../src/Adminside/Components/ProductivityReport";
import DailyReport from "../src/Adminside/Components/DailyReport";
import PerformanceHeatmap from "../src/Adminside/Components/Performanceheatmap";
import RedFlagsReport from "../src/Adminside/Components/RedFlagReports";
import ProjectSuccessReports from "../src/Adminside/Components/ProjectSuccessReports";
import SLAComplianceDashboard from "../src/Adminside/Components/SLApage";
import Reports from "../src/Adminside/Components/Reports";
import SelectPosition from "../src/Adminside/Components/Entrypage";
import EmployeeLogin from "../src/Employee Side/Components/EmployeeLogin";
import EmployeeDashboard from "./Employee Side/Components/EmployeeDashboard";
import EmployeeTaskpage from "./Employee Side/Components/EmployeeTaskpage";
import DailyReports from "./Employee Side/Components/EmployeeReports";
import Calendarpage from "./Employee Side/Components/Calendarpage";
import EmployeeAnnouncementpage from "./Employee Side/Components/EmployeeAnnouncementpage";
import EmployeeSupport from "./Employee Side/Components/EmployeeSupport";
import ProjectWorkspace from "./Employee Side/Components/ProjectWorkspace";
import EmployeesProjectpage from "./Employee Side/Components/EmployeesProjectpage"
import EmployeeDetails from "./Adminside/Components/EmployeeDetailspage";

/* ---------- LAYOUT (Navbar control yahin hoga) ---------- */
function Layout({ children }) {
  const location = useLocation();

  const hideNavbarRoutes = ["/","/login","/employeelogin"];
  const hideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
    </>
  );
}


function App() {
  return (
    <>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<SelectPosition/>} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Admindashboard />} />
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
          </Routes>
        </Layout>
      </Router>

      <ToastContainer position="top-center" autoClose={3000} />
    </>
  );
}

export default App;



 