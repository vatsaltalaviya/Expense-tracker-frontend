import React from "react";
import { Link, NavLink } from "react-router-dom";

const Sidebar = ({sidemenu ,logOut}) => {
 
  return (
    <aside className="px-2 text-black py-1 h-screen relative w-full bg-[#F9F9F9] dark:bg-zinc-950">
      <div className="flex items-center gap-2 px-2 py-3">
        <img
          className="w-10 rounded-2xl object-cover"
          src="https://res.cloudinary.com/dbpleky0i/image/upload/v1753946565/20250721_1542_Currency_Symbol_Enhancement_remix_01k0p7eydeetf9679gn396gqp3_plbcg6.png"
          alt=""
        />
        <h1 className="text-xl font-semibold cursor-pointer select-none dark:text-white">
          RupeeRoot
        </h1>
      </div>

      {/* ================== main memu =========================== */}
      <div className="w-full px-2 py-3">
        {sidemenu.map((item,i)=>(<NavLink onClick={item.onclick} className='text-primary ' key={i} to={item.navigate}><div className="flex nav transition-all rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-500 duration-300 gap-2 py-2 my-1 items-center">
          <i  className={`${item.icon} text-xl`}></i>
          <h1 className="transition-transform duration-150">{item.name}</h1>
        </div></NavLink>))}
        <button onClick={()=>logOut()} className="flex nav transition-all text-primary duration-300 gap-2 py-1.5 hover:px-4 rounded my-4 hover:bg-white dark:hover:bg-zinc-500 hover:text-black items-center">
          <i  className={`ri-shut-down-line text-xl`}></i>
          <h1 className="transition-transform duration-150">Logout</h1>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
