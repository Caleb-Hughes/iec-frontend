import React from 'react';
import heroImg from './../assets/Imgs/heroPlaceHolder.png'; // Adjust the path as necessary

function Hero() {
  return (
    <section className="relative w-full min-h-screen bg-no-repeat pt-20 md:bg-cover bg-center md:bg-fixed mt-0"
      style={{backgroundImage: `url(${heroImg})`}}> 

      {/* Overlay for better text visibility */}
      <div className="absolute inset-0 bg-black opacity-50"></div>
      {/* Responsive content container */}
      <div className="relative z-10 max-w-6xl mx-auto flex flex-col items-center justify-center text-white text-center px-4 h-full" style={{minHeight: 'calc(100vh - 5rem)'}}>
        <h1 className="text-3xl md:text-6xl font-semibold mb-4">Elevate your beauty experience with IEC</h1>
        <p className="text-2xl md:text-4xl font-light mb-6">Your journey to beauty starts here</p>
      </div>
    </section>
  )
}

export default Hero