import React, { useState } from "react";
import { auth, provider, signInWithPopup } from "../slice/firebase";
import loginimg from "../assets/login.png";
import logo from "../assets/logo.jpg";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../slice/user.slice";
import { BeatLoader } from "react-spinners";
import { FaGoogle } from "react-icons/fa";
import axios from "axios";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [pass, setpass] = useState("");
  const dispatch = useDispatch();
  const { loading, error, user } = useSelector((state) => state.user);

  const signUpWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Send user info to backend to register
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/user/auth/google`,
        {
          name: user.displayName,
          email: user.email,
          photo: user.photoURL,
          uid: user.uid,
        },
        {
          withCredentials: true, // ✅ Send cookies (for JWT)
        }
      );

      const data = res.data;
      if (data.success) {
        sessionStorage.setItem("refreshToken", data.Refreshtoken);
        sessionStorage.setItem("AccessToken", data.Accesstoken);
        localStorage.setItem("username", data.user.username);
        localStorage.setItem("userid", data.user.id);
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Google signup error:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const UserData = {
      username: name,
      email,
      password: pass,
    };
    try {
      await dispatch(registerUser(UserData)).then((e) =>
        navigate("/dashboard")
      );
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="lg:flex justify-center items-center h-screen w-full text-black bg-white lg:bg-gray-100">
      <div className="bg-white flex justify-center lg:shadow-lg lg:rounded-4xl p-3 xl:p-10  gap-3 ">
        <div className="w-xs xl:w-sm h-full xl:block  hidden shrink-0">
          <img
            className="w-full object-cover shadow-2xl rounded-3xl"
            src={
              loginimg ||
              "https://videos.openai.com/vg-assets/assets%2Ftask_01jzmt1ebme0etp92emn4ngxyg%2F1751971383_img_0.webp?st=2025-07-09T08%3A14%3A57Z&se=2025-07-15T09%3A14%3A57Z&sks=b&skt=2025-07-09T08%3A14%3A57Z&ske=2025-07-15T09%3A14%3A57Z&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skoid=3d249c53-07fa-4ba4-9b65-0bf8eb4ea46a&skv=2019-02-02&sv=2018-11-09&sr=b&sp=r&spr=https%2Chttp&sig=0Z14n9J7a0t4K8PHQoiZlf4%2BKLQHTqHzo%2FNkBvcltpY%3D&az=oaivgprodscus"
            }
            alt=""
          />
        </div>

        <form
          onSubmit={handleSubmit}
          className="xl:px-5 w-full xl:w-xl shrink-0 py-1 mt-2"
        >
          <div className="flex flex-col items-center justify-center gap-2 mb-4">
            <img
              className="w-18 rounded-2xl object-contain"
              src="https://res.cloudinary.com/dbpleky0i/image/upload/v1753946565/20250721_1542_Currency_Symbol_Enhancement_remix_01k0p7eydeetf9679gn396gqp3_plbcg6.png"
              alt=""
            />
            <h1 className="font-semibold text-xl">Create New Account</h1>
          </div>
          <div className="w-full py-2">
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setname(e.target.value)}
              className="w-full appearance-none focus:outline-none focus:ring-2 focus:ring-black border border-gray-300 rounded-md p-2 lg:p-4 text-lg"
            />
          </div>
          {/* Email Field */}
          <div className="w-full py-2">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setemail(e.target.value)}
              className="w-full appearance-none focus:outline-none focus:ring-2 focus:ring-black border border-gray-300 rounded-md p-2 lg:p-4 text-lg"
            />
          </div>

          {/* Password Field */}
          <div className="w-full relative py-2">
            <input
              type={showPassword ? "text" : "password"}
              minLength={6}
              placeholder="Enter your password"
              value={pass}
              onChange={(e) => setpass(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 lg:p-4 text-lg"
            />
            <i
              onClick={() => setShowPassword((p) => !p)}
              className={`${
                showPassword ? "ri-eye-off-fill" : "ri-eye-fill"
              } text-xl absolute right-2 top-1/2 transform -translate-y-1/2`}
            />
          </div>

          {/* Forgot Password */}
          <div className="py-2">
            <Link to="#" className="text-primary text-sm font-medium underline">
              Forget Your Password?
            </Link>
          </div>

          {/* Submit Button */}
          <div className="py-2">
            <button
              type="submit"
              className="w-full  border text-white bg-primary transition-all duration-300 rounded-lg px-3 py-3 font-medium text-lg md:text-2xl"
            >
              {loading ? <BeatLoader size={6} color="#ffffff" /> : "Sign Up"}
            </button>
          </div>

          <div className="py-2 flex justify-center w-full">
            <button
              type="button"
              onClick={() => signUpWithGoogle()}
              className=" border text-white bg-zinc-400 hover:bg-zinc-600 flex transition-all items-center justify-center gap-x-2 duration-50 rounded-lg px-3 py-0.5 font-medium text-lg "
            >
              <FaGoogle className="text-lg " /> Sign up with Google
            </button>
          </div>

          {/* Register Link */}
          <div className="py-2">
            <p className="text-xs md:text-lg font-medium">
              Already have an Account?
              <Link to="/" className="text-primary  font-medium underline">
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
