import React from 'react';
import logo from './../assets/Imgs/logo.png'; // Adjust the path as necessary

function Header() {
  return (
    <header className ="w-full border-b bg-white shadow-sm fixed top-0 z-50">
        {/*Header content container*/}
        <div className="max-w-6xl mx-auto flex items-center md:justify-between px-10 py-3">
            {/*Logo*/}
            <img src={logo} alt="Logo" className=" h-14 w-auto pl-8" />

            {/*Navigation links (Hidden on mobile) */}
            <nav className="hidden md:flex items-center space-x-6 text-md font-light">
                <a href="#about" className="hover:text-pink-500">About us</a>
                <a href="#team" className="hover:text-pink-500">Meet the Team</a>
                <a href ="#gallery" className="hover:text-pink-500">Gallery</a>
                <a href="#contact" className="hover:text-pink-500">Contact</a>
                <a 
                    href="#book"
                    className="ml-4 border border-pink-500 text-pink-500 px-4 py-2 rounded hover:bg-pink-500 hover:text-white transition"
                >
                    BOOK AN APPOINTMENT
                </a>
            </nav> 
        </div>
    </header>
  );
}

export default Header