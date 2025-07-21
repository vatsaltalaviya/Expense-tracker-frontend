import React from "react";
import { Link, NavLink } from "react-router-dom";

const Sidebar = ({sidemenu ,logOut}) => {
 
  return (
    <aside className="px-2 text-black py-1 h-screen relative w-full bg-[#F9F9F9]">
      <div className="flex items-center gap-2 px-2 py-3">
        <img
          className="w-10 rounded-2xl object-cover"
          src="https://videos.openai.com/vg-assets/assets%2Ftask_01k0p7exqgf56vgy73fw9nk4jp%2F1753092757_img_0.webp?st=2025-07-21T08%3A27%3A58Z&se=2025-07-27T09%3A27%3A58Z&sks=b&skt=2025-07-21T08%3A27%3A58Z&ske=2025-07-27T09%3A27%3A58Z&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skoid=aa5ddad1-c91a-4f0a-9aca-e20682cc8969&skv=2019-02-02&sv=2018-11-09&sr=b&sp=r&spr=https%2Chttp&sig=dZAyN%2FKIy0Xu8Eyb84y7yCaRpfk0W3gzY9Iza6ddPIY%3D&az=oaivgprodscus"
          alt=""
        />
        <h1 className="text-xl font-semibold cursor-pointer select-none">
          RupeeRoot
        </h1>
      </div>

      {/* ================== main memu =========================== */}
      <div className="w-full px-2 py-3">
        {sidemenu.map((item,i)=>(<NavLink onClick={item.onclick} className='text-primary ' key={i} to={item.navigate}><div className="flex nav transition-all rounded-lg hover:bg-zinc-200 duration-300 gap-2 py-2 my-1 items-center">
          <i  className={`${item.icon} text-xl`}></i>
          <h1 className="transition-transform duration-150">{item.name}</h1>
        </div></NavLink>))}
        <button onClick={()=>logOut()} className="flex nav transition-all text-primary duration-300 gap-2 py-1.5 hover:px-4 rounded my-4 hover:bg-white hover:text-black items-center">
          <i  className={`ri-shut-down-line text-xl`}></i>
          <h1 className="transition-transform duration-150">Logout</h1>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
