import React, {useState} from 'react';
import {Link, NavLink} from "react-router-dom";
import {HiOutlineBars3, HiOutlineXMark} from 'react-icons/hi2';
import {User, LogOut, LogIn} from "lucide-react";
import {useAuth} from '../auth/AuthContext';
import LoginPop from '../auth/LoginPop';
import logo from './../assets/Imgs/logo.png';

//function to close mobile menu on link click
export default function Header ()  {
    const [menuOpen, setMenuOpen] = useState(false);
    const [loginOpen, setLoginOpen] = useState(false);
    

    const {user, logout} = useAuth();

    //close menu on link click
    const handleLinkClick = () => {
        setMenuOpen(false);
    };
    
    

    //Handle Sign Out
    const handleSignOut = () => {
        logout();
        setMenuOpen(false);
    }
    const firstName = (user?.name || "").trim().split(/\s+/)[0] || "Client"; //Fallback to "Client" if no name or split fails

    return (
    <>
    <header className ="w-full border-b bg-white shadow-sm fixed top-0 z-50">
        {/*Header content container*/}
        <div className="max-w-6xl mx-auto flex items-center justify-between px-10 py-3">
            {/*Logo*/}
            <Link to="/" onClick={handleLinkClick} className="flex items-center">
                <img src={logo} alt="Logo" className=" h-14 w-auto pl-8" />
            </Link>

            {/*Navigation links (Hidden on mobile) */}
            <nav className="hidden md:flex items-center space-x-6 text-md font-light">
                <NavLink to="/about" className="hover:text-pink-500">About us</NavLink>
                <NavLink to="/team" className="hover:text-pink-500">Meet the Team</NavLink>
                <NavLink to="/gallery" className="hover:text-pink-500">Gallery</NavLink>
                <NavLink to="/contact" className="hover:text-pink-500">Contact</NavLink>
                {user && (
                    <NavLink to="/appointments" onClick={handleLinkClick} className="hover:text-pink-500">
                        My Appointments
                    </NavLink>
                )}

                {/*Auth Section*/}
                {user ? (
                    <div className="flex items-center gap-4 border-l border-gray-300 pl-4 ml-2">
                        <span className="text-sm font-medium text-gray-600 flex items-center gap-1">
                            <User className="w-4 h-4 text-pink-500"/>
                            {/*Display Users Name or fallback*/}
                            {firstName || "Client"}
                        </span>
                        <button
                            onClick={logout}
                            className="text-gray-500 hover:text-pink-600 transition text-sm font-medium cursor-pointer"
                            title="Sign Out"
                        >
                            Sign Out 
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => setLoginOpen(true)}
                        className="hover:text-pink-500 transition font-medium flex items-center gap-1 ml-2 cursor-pointer"
                    >
                        <LogIn className="w-4 h-4"/>
                        Sign In
                    </button>
                )}
                <NavLink  
                    to="/booking"
                    className="ml-4 border border-pink-500 text-pink-500 px-4 py-2 rounded hover:bg-pink-500 hover:text-white transition"
                >
                    BOOK AN APPOINTMENT
                </NavLink>
            </nav> 
            {/*Mobile hamburger menu icon (Visible on mobile) */}
            <button 
                className="md:hidden inline-flex items-center justify-center p-2 rounded hover:bg-gray-100 focus:outline-none focus:ring cursor-pointer" 
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
            >
                {menuOpen ? <HiOutlineXMark className="h-6 w-6"/> : <HiOutlineBars3 className="h-6 w-6"/>}
            </button>
        </div>

        {/*Mobile menu (Visible when menuOpen is true) */}
        <div className={`md:hidden absolute inset-x-0 top-full bg-pink-600 border-b shadow-sm transition-all duration-200 
            ${menuOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"}`}
        >
            <nav className="flex flex-col px-4 pb-4 space-y-2 text-base">
                <NavLink to="/about" onClick={handleLinkClick} className="block text-white hover:bg-pink-500 px-3 py-2 rounded">About us</NavLink>
                <NavLink to="/team" onClick={handleLinkClick} className="block text-white hover:bg-pink-500 px-3 py-2 rounded">Meet the Team</NavLink>
                <NavLink to="/gallery" onClick={handleLinkClick} className="block text-white hover:bg-pink-500 px-3 py-2 rounded">Gallery</NavLink>
                <NavLink to="/contact" onClick={handleLinkClick} className="block text-white hover:bg-pink-500 px-3 py-2 rounded">Contact</NavLink>
                {user && (
                    <NavLink to="/appointments" onClick={handleLinkClick} className="block text-white hover:bg-pink-500 px-3 py-2 rounded">
                        My Appointments
                    </NavLink>
                )}
                
                <div className="border-t border-pink-400 pt-2 mt-2">
                    {user ? (
                        <>
                            <div className="px-3 py-2 text-pink-100 text-sm flex items-center gap-2">
                                <User className="w-4 h-4"/>
                                Hi, {firstName || "Client"}
                            </div>
                            <button
                                onClick={handleSignOut}
                                className="w-full text-left block text-white hover:bg-pink-500 px-3 py-2 rounded flex items-center gap-2 cursor-pointer"
                            >
                                <LogOut className="w-4 h-4"/> Sign Out
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => {
                                setMenuOpen(false);
                                setLoginOpen(true);
                            }}
                            className="w-full text-left block text-white hover:bg-pink-500 px-3 py-2 rounded flex items-center gap-2 cursor-pointer"
                        >
                            <LogIn className="w-4 h-4"/> Sign In
                        </button>
                    )}
                </div>
                <NavLink 
                    to ="/booking"
                    onClick={handleLinkClick}
                    className="block text-center border border-white text-white px-4 py-2 rounded hover:bg-white hover:text-pink-600 transition"
                >
                    BOOK AN APPOINTMENT
                </NavLink>
            </nav>
        </div>
    </header>

    <LoginPop
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSuccess={() => setLoginOpen(false)} 
    />
    </>
  );
}

