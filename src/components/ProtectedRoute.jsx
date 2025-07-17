import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../Utils/AxiosInstance"; // Make sure you're using your configured Axios instance

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const navigate = useNavigate();
  const token = sessionStorage.getItem("AccessToken");

  useEffect(() => {
    const checkAuth = async () => {
      if (!token) {
        navigate("/"); // No token at all
        return;
      }

      try {
        // Call the profile API to verify token and get user
        const res = await axiosInstance.get("/user/profile");

        if (res.status === 200 && res.data.user) {
          setAuthorized(true);
        } else {
          throw new Error("Not authorized");
        }
      } catch (err) {
        console.error("Auth check failed:", err.message);
        sessionStorage.removeItem("AccessToken");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return authorized ? children : null;
};

export default ProtectedRoute;
