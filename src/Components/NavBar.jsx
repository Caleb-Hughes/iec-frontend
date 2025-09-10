import React, {useState} from 'react';
import {Link, NavLink} from "react-router-dom";
import {HiOutlineBars3, HiOutlineXMark} from 'react-icons/hi2';
import logo from './../assets/Imgs/logo.png'; // Adjust the path as necessary
//function to close mobile menu on link click
export default function Header ()  {
    const [menuOpen, setMenuOpen] = useState(false);

    //close menu on link click
    const handleLinkClick = () => {
        setMenuOpen(false);
    };

    return (
    <header className ="w-full border-b bg-white shadow-sm fixed top-0 z-50">
        {/*Header content container*/}
        <div className="max-w-6xl mx-auto flex items-center justify-between px-10 py-3">
            {/*Logo*/}
            <Link to="/" onClick={close} className="flex items-center">
                <img src={logo} alt="Logo" className=" h-14 w-auto pl-8" />
            </Link>

            {/*Navigation links (Hidden on mobile) */}
            <nav className="hidden md:flex items-center space-x-6 text-md font-light">
                <NavLink to="/about" className="hover:text-pink-500">About us</NavLink>
                <NavLink to="/team" className="hover:text-pink-500">Meet the Team</NavLink>
                <NavLink to="/gallery" className="hover:text-pink-500">Gallery</NavLink>
                <NavLink to="/contact" className="hover:text-pink-500">Contact</NavLink>
                <a 
                    href="#book"
                    className="ml-4 border border-pink-500 text-pink-500 px-4 py-2 rounded hover:bg-pink-500 hover:text-white transition"
                >
                    BOOK AN APPOINTMENT
                </a>
            </nav> 
            {/*Mobile hamburger menu icon (Visible on mobile) */}
            <button 
                className="md:hidden inline-flex items-center justify-center p-2 rounded hover:bg-gray-100 focus:outline-none focus:ring" 
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
            >
                {menuOpen ? <HiOutlineXMark className="h-6 w-6"/> : <HiOutlineBars3 className="h-6 w-6"/>}
            </button>
        </div>

        {/*Mobile menu (Visible when menuOpen is true) */}
        <div className={`md:hidden absolute inset-x-0 top-full bg-pink-600 border-b shadow-sm transition-all duration-200 
            ${menuOpen ? "Opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"}`}
        >
            <nav className="flex flex-col px-4 pb-4 space-y-2 text-base">
                <NavLink to="/about" onClick={handleLinkClick} className="block text-white hover:bg-pink-500 px-3 py-2 rounded">About us</NavLink>
                <NavLink to="/team" onClick={handleLinkClick} className="block text-white hover:bg-pink-500 px-3 py-2 rounded">Meet the Team</NavLink>
                <NavLink to="/gallery" onClick={handleLinkClick} className="block text-white hover:bg-pink-500 px-3 py-2 rounded">Gallery</NavLink>
                <NavLink to="/contact" onClick={handleLinkClick} className="block text-white hover:bg-pink-500 px-3 py-2 rounded">Contact</NavLink>
                <a 
                    href="#book"
                    className="block text-center border border-white text-white px-4 py-2 rounded hover:bg-white hover:text-pink-600 transition"
                >
                    BOOK AN APPOINTMENT
                </a>
            </nav>
        </div>
    </header>
  );
}

