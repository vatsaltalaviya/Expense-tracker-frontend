import React from 'react'

const Navbar = () => {
  return (
    <nav className='flex gap-2 justify-between w-full items-center'>
      <h1 className='text-xl md:text-3xl font-semibold'>Welcome , {localStorage.getItem('username')} 👋</h1>
    </nav>
  )
}

export default Navbar
