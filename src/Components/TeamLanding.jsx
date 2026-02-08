import React, {useEffect, useMemo, useState}  from 'react';
import {maxGeneratorDuration, motion} from 'framer-motion';
import TeamCarousel from './TeamCarousel';
import teamMembers from '../data/teamMembers';

const OPTIONS = {loop: true};


function Team() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    setIsMobile(mq.matches);
    const onChange = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  
  const OPTIONS = useMemo(() => ({
    loop: !isMobile,
    align: "center",
    containScroll: "trimSnaps"
  }), [isMobile]
  );
  return (
    <section id="team" className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className ="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} // Start slightly below and transparent
          whileInView={{ opacity: 1, y: 0 }} // Animate to visible and in place
          viewport={{ once: true, amount: 0.3 }} // Only animate once when in view
          transition={{ duration: 0.8 }} // Animation duration
          className="text-center mb-16" 
        >
          <div className="inline-block px-4 py-2 bg-pink-100 rounded-full text-pink-600 font-semibold text-sm mb-6">
            Our Team
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Meet the Experts
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our talented team of professionals dedicated to bringing out your natural beauty.
          </p>
        </motion.div>
        {/* Team Carousel */}
        <motion.div
          initial={{opacity: 0, y:20}} 
          whileInView={{opacity:1, y:0}}
          transition={{duration: 0.8, delay: 0.3}}
        >
          <div className="w-full max-w-xl mx-auto sm:max-w-2xl lg:max-w-6xl">
            <TeamCarousel slides={teamMembers} options={OPTIONS} className="touch-pan-y"/>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Team