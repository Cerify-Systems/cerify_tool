import React from 'react';
import { Link } from 'react-router-dom';
import Cerify from "../Images/Cerify.png"; 

const Navbar = () => {
    return (
      <div className='nav flex flex-col md:flex-row justify-between items-center font-sans p-4'>
        <div className='flex md:w-auto w-full justify-between'>
          <a href="https://cerify.ai">
            <img src={Cerify} alt="Cerify Logo" className="h-12 mr-auto" />
          </a>
        </div>

        {/* Desktop Navigation */}
        <ul className='hidden md:flex list-none gap-8'>
          <div className='flex gap-1.5 bg-blue-100 p-1 rounded-lg'>
            {/* <li className='text-blue-600 transition duration-300 ease-in-out hover:bg-blue-800 hover:text-white rounded-lg py-2.5 px-3'>
              <Link to="/About">&nbsp;&nbsp; About &nbsp;&nbsp;</Link>
            </li>
            <li className='text-blue-600 transition duration-300 ease-in-out hover:bg-blue-800 hover:text-white rounded-lg py-2.5 px-3'>
              <Link to="/FFaq">&nbsp;&nbsp; FAQ &nbsp;&nbsp;</Link>
            </li> */}
            <li className='text-blue-600 transition duration-300 ease-in-out hover:bg-blue-800 hover:text-white rounded-lg py-2.5 px-3'>
              <Link to="/Help">&nbsp;&nbsp; Help &nbsp;&nbsp;</Link>
            </li>
          </div>
          {/* <div className='flex gap-1.5 bg-blue-100 p-1 rounded-lg'>
            <li className='text-blue-600 transition duration-300 ease-in-out hover:bg-blue-800 hover:text-white rounded-lg py-2.5 px-3'>
              <Link to="/Signup" className="signup">&nbsp; Sign up &nbsp;</Link>
            </li>
            <li className='text-blue-600 transition duration-300 ease-in-out hover:bg-blue-800 hover:text-white rounded-lg py-2.5 px-3'>
              <Link to="/Login" className="login">&nbsp; Login &nbsp;</Link>
            </li>
          </div> */}
        </ul>
      </div>
    )
  }
  
  export default Navbar