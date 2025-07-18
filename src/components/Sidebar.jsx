import React from "react";
import { Link, NavLink } from "react-router-dom";

const Sidebar = ({sidemenu ,logOut}) => {
 
  return (
    <aside className="px-2 text-white py-1 w-full h-screen relative bg-zinc-950">
      <div className="flex items-center gap-2 px-2 py-3">
        <img
          className="w-10 object-cover"
          src="https://res.cloudinary.com/dbpleky0i/image/upload/v1751972868/logoexpense_e5emuj.png"
          alt=""
        />
        <h1 className="text-xl font-semibold cursor-pointer select-none">
          SpendTrack
        </h1>
      </div>

      {/* ================== main memu =========================== */}
      <div className="w-full space-y-3 px-2 py-3">
        {sidemenu.map((item,i)=>(<NavLink onClick={item.onclick} className='text-white/55 ' key={i} to={item.navigate}><div className="flex nav transition-all duration-300 gap-2 py-2 items-center">
          <i  className={`${item.icon} text-xl`}></i>
          <h1 className="transition-transform duration-150">{item.name}</h1>
        </div></NavLink>))}
        <button onClick={()=>logOut()} className="flex nav transition-all text-white/45 duration-300 gap-2 py-1.5 hover:px-4 rounded my-4 hover:bg-white hover:text-black items-center">
          <i  className={`ri-shut-down-line text-xl`}></i>
          <h1 className="transition-transform duration-150">Logout</h1>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
