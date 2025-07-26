import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

const Navbar = () => {
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  return (
    <nav className="flex gap-2 justify-between w-full items-center">
      <h1 className="text-xl md:text-3xl font-semibold">
        Welcome , {localStorage.getItem("username")} 👋
      </h1>

      <label
        htmlFor="check"
        className="bg-gray-100 border relative w-10 h-10 rounded-lg flex justify-center items-center"
      >
        <input
          type="checkbox"
          id="check"
          checked={darkMode}
          onChange={() => setDarkMode(!darkMode)}
          className="sr-only peer"
        />
        <span className="w-[calc(100%-5px)] h-[calc(100%-5px)] flex items-center justify-center bg-yellow-500 rounded-lg peer-checked:bg-blue-500  transition-all duration-300">
          <i className={`${darkMode?"ri-moon-line":"ri-sun-line"} text-2xl text-center p-1 rounded-full text-white`}></i>
        </span>
      </label>
    </nav>
  );
};

export default Navbar;
