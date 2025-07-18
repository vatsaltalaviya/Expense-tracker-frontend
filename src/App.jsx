import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import { NavLink, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Income from "./pages/Income";
import Expense from "./pages/Expense";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  const location = useLocation();
  const [showLogoutAlert, setshowLogoutAlert] = useState(false)
  const navigate = useNavigate();
  const isLoginPage =
    location.pathname === "/" || location.pathname === "/signin";
  const sidemenu = [
    {
      icon: "ri-dashboard-horizontal-fill",
      name: "Dashboard",
      navigate: "/dashboard",
    },
    {
      icon: "ri-wallet-2-line",
      name: "Income",
      navigate: "/income",
    },
    {
      icon: "ri-money-dollar-box-fill",
      name: "Expense",
      navigate: "/expense",
    },
    
  ];

  const logOut = () => {
    localStorage.removeItem("userid");
    sessionStorage.removeItem("AccessToken")
    sessionStorage.removeItem("refreshToken")
    setshowLogoutAlert(false)
    navigate('/')
  }

  return (
    <div className="flex relative flex-col md:flex-row h-screen bg-[#FAF9F6]">
      {/* Sidebar - hidden on login and hidden on small screens */}
      {!isLoginPage && (
        <aside className="hidden md:block fixed top-0 left-0 h-screen bg-gray-800 z-10">
          <Sidebar sidemenu={sidemenu} logOut={()=>setshowLogoutAlert(true)} />
        </aside>
      )}

      {/* ============== for mobile ========================= */}

      <div className="absolute px-1 bottom-5 left-0  flex md:hidden w-full z-50">
        <div className="bg-primary rounded-4xl px-2 w-full">
          <div className="w-full flex justify-evenly space-x-3 py-2 px-2">
            {sidemenu.map((item, i) => (
              <NavLink className="text-white/45 " key={i} to={item.navigate}>
                <div className="flex nav transition-all duration-300 items-center">
                  <i onClick={item.onclick} className={`${item.icon} text-3xl`}></i>
                </div>
              </NavLink>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`flex flex-col w-full h-screen overflow-hidden ${
          !isLoginPage ? "md:ml-64" : ""
        }`}
      >
        {/* Navbar */}
        {!isLoginPage && (
          <header className="px-4 md:px-8 py-4 md:py-6">
            <Navbar />
          </header>
        )}

        {/* Scrollable Main Area */}
        <main
          className={`flex-1 overflow-y-auto ${
            !isLoginPage ? "px-4 md:px-8 py-4 md:py-6" : ""
          }`}
        >
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signin" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/income"
              element={
                <ProtectedRoute>
                  <Income />
                </ProtectedRoute>
              }
            />
            <Route
              path="/expense"
              element={
                <ProtectedRoute>
                  <Expense />
                </ProtectedRoute>
              }
            />
          </Routes>

          {showLogoutAlert && <LogoutUser onYes={()=>logOut()} onCancel={()=>setshowLogoutAlert(false)} />}
        </main>
      </div>
    </div>
  );
};

export default App;
const LogoutUser = ({onYes,onCancel})=>{
  return <div className="w-full flex items-center justify-center h-screen bg-black/5 fixed top-0 left-0">
  <div className=" px-2 py-2 text-black bg-white rounded-lg w-82">
    <h1 className="text-lg font-semibold text-center">Are you sure you want to Logout?</h1>
    <div className="flex justify-center w-full gap-x-2">
      <button onClick={()=>onYes()} className="bg-emerald-500 w-full rounded px-2 py-1 text-lg font-medium text-white">Yes</button>
      <button onClick={()=>onCancel()} className="bg-red-500 w-full rounded px-2 py-1 text-lg font-medium text-white">Cancel</button>
    </div>
  </div>
  </div>
}
