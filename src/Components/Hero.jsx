import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import {motion} from 'framer-motion';
import {Sparkles, ArrowRight} from "lucide-react";
import heroImg from './../assets/Imgs/heroPlaceHolder.png'; 


function Hero() {
  const navigate = useNavigate();
  return (
    <section className="relative w-full min-h-screen bg-no-repeat pt-20 md:bg-cover bg-center md:bg-fixed mt-0"
      style={{backgroundImage: `url(${heroImg})`}}> 

      {/* Overlay for better text visibility */}
      <div className="absolute inset-0 bg-black opacity-50"/>
      {/* Content container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
      {/* animation wrapper */}
        <motion.div
          initial= {{ opacity: 0, y: 30}} //start hidden
          animate = {{ opacity: 1, y: 0}} //fade in and move up
          transition = {{ duration: 0.8}} //animation duration
          className="max-w-3xl"
        >
          {/* Badge, scale-in after main container */}
        <motion.div
          initial={{opacity:0 , scale: 0.9}} //smaller and invisible
          animate={{opacity:1, scale: 1}} //full size and visible
          transition={{ delay: 0.2, duration: 0.5}} //delay to start after main container
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white mb-6 border border-white/20"
        >
          <Sparkles size={16} className="text-pink-400"/>
          <span className="text-sm">Premium Black-Owned Beauty Studio</span>
        </motion.div>
         {/* Main Heading, staggered animation*/}
          <motion.h1
            initial={{ opacity: 0, y: 20}} //start hidden and slightly down
            animate={{ opacity: 1, y: 0}} //fade in and move up
            transition={{ delay: 0.3, duration: 0.8}} //delay to start after badge
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
          >
            Elevate your beauty experience with {" "}
            <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">IEC Studio</span>
          </motion.h1>
          {/* Subheading, continued stagger*/}
          <motion.p
            initial={{ opacity: 0, y: 20}} //start hidden and slightly down
            animate={{ opacity: 1, y: 0}} //fade in and move up
            transition={{ delay: 0.5, duration: 0.8}} //delay to start after heading
            className="text-xl md:text-2xl text-gray-200 mb-8"
          >
            Where elegance meets excellence in every style
          </motion.p>
          {/* Call-to-Action Button, final stagger*/}
          <motion.button
            initial={{ opacity: 0, y: 20}} //start hidden and slightly down
            animate={{ opacity: 1, y: 0}} //fade in and move up
            transition={{ delay: 0.7, duration: 0.8}} //delay to start after subheading
            onClick={() => navigate('/booking')}
            className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition cursor-pointer inline-flex items-center gap-2 group transform hover:scale-105 duration-300 ease-in-out"
          >
            Book Your Appointment Now
            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero