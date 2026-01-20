import React, {useRef} from 'react'
import {motion, useInView} from 'framer-motion'
import {FaInstagram} from 'react-icons/fa6'
import GalleryGrid from './GalleryGrid'
import { Navigate, useNavigate } from 'react-router-dom'

function Gallery() {
  //track when section is in view
  const ref = useRef(null);
  const inView = useInView(ref, {once: true, amount: 0.2});
  const navigate = useNavigate();
  return (
    <section 
      id="gallery"
      ref={ref}
      className="relative w-full min-h-[80vh] md:min-h-screen bg-no-repeat bg-gradient-to-b from-white to-pink-50 bg-cover bg-center py-12"
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header w/ animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} // Start slightly below and transparent
          animate={inView ? { opacity: 1, y: 0 } : {}} // Animate to visible and in place when in view
          transition={{ duration: 0.8 }} // Animation duration
          className="text-center mb-16"
        >
          <div className="inline-block px-4 py-2 bg-purple-100 rounded-full text-purple-600 font-semibold text-sm mb-6">
            Our Work
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Gallery of Tranformation
          </h2>

          <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8">
            Explore our portfolio of tranformations, installs, and styles
          </p>

          {/* Instagram Icon and link*/}
          <a
            href="https://www.instagram.com/iecrichmond/" 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 font-semibold"
          >
            <FaInstagram/>
            Follow us @IECrichmond
          </a>

        </motion.div>

        {/* Gallery Grid Component w/ animation */}
        <motion.div
          initial={{ opacity:0, scale: 0.95 }} // Start slightly smaller and transparent
          animate={inView ? { opacity: 1, scale: 1 } : {}} // Animate to visible and full size when in view
          transition={{ duration: 0.8, delay: 0.2 }} // Animation duration and delay
        >
          <GalleryGrid isInView={inView}/>
        </motion.div>
      </div>

      {/*CTA Animaation*/}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="text-center mt-12"
      >
        <button
          onClick={() => {
            navigate('/booking');
          }}
          className="relative px-8 py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-200 cursor-pointer"
        >
          Book your Transformation
        </button>
      </motion.div>
    </section>
  )
}

export default Gallery