import React, { useState } from "react";
import loginimg from '../assets/login.png'
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { LoginUser } from "../slice/user.slice";
import { BeatLoader } from "react-spinners";


const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setemail] = useState("");
  const [pass, setpass] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {loading , error , user} = useSelector(state=>state.user)
  
  const handleSubmit =async(e)=>{
    e.preventDefault();
    const UserData = {
      email,
      password:pass
    }
    try {
     await dispatch(LoginUser(UserData)).then((e)=>navigate('/dashboard'));
      
    } catch (error) {
      console.error(error);
      
    }
  }


  return (
    <div className="flex justify-center items-center h-screen w-full text-black bg-gray-100">
      <div className="bg-white flex shadow-lg rounded-4xl p-2 xl:p-10  gap-3 w-fit">
        <div className="w-xs xl:w-sm lg:block  hidden shrink-0">
          <img
            className="w-full object-cover shadow-2xl rounded-3xl"
            src={loginimg ||"https://videos.openai.com/vg-assets/assets%2Ftask_01jzmt1ebme0etp92emn4ngxyg%2F1751971383_img_0.webp?st=2025-07-09T08%3A14%3A57Z&se=2025-07-15T09%3A14%3A57Z&sks=b&skt=2025-07-09T08%3A14%3A57Z&ske=2025-07-15T09%3A14%3A57Z&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skoid=3d249c53-07fa-4ba4-9b65-0bf8eb4ea46a&skv=2019-02-02&sv=2018-11-09&sr=b&sp=r&spr=https%2Chttp&sig=0Z14n9J7a0t4K8PHQoiZlf4%2BKLQHTqHzo%2FNkBvcltpY%3D&az=oaivgprodscus"}
            alt=""
          />
        </div>
        <form
          onSubmit={handleSubmit}
          className="xl:px-5 xl:w-xl shrink-0 py-1 mt-2"
        >
          <div className="flex flex-col items-center gap-2 mb-4">
            <img
              className="w-16 object-contain"
              src="https://res.cloudinary.com/dbpleky0i/image/upload/v1751972868/logoexpense_e5emuj.png"
              alt=""
            />
            <h1 className="font-semibold text-xl">Welcome Back</h1>
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
            {/* <span className="text-red-500 text-sm px-2">invalid email</span> */}
          </div>

          {/* Password Field */}
          <div className="w-full relative py-2">
            <input
              type={showPassword ? "text" : "password"}
              minLength={6}
              value={pass}
              onChange={(e) => setpass(e.target.value)}
              placeholder="Enter your password"
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
              className="w-full border text-white bg-primary transition-all duration-300 rounded-lg px-3 py-3 font-medium text-lg md:text-2xl"
            >
              {loading?<BeatLoader size={6} color="#ffffff" />: "Login"}
            </button>
          </div>

          {/* Register Link */}
          <div className="py-2">
            <p className="text-xs md:text-lg font-medium">
              Don't have any Account?{" "}
              <Link
                to="/signin"
                className="text-primary  font-medium underline"
              >
                Register
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
