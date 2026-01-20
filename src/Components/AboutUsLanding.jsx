import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import features from "../data/aboutUsCards";
import { Award, Heart, Sparkles, Users } from "lucide-react";
import salonPic from "../assets/Imgs/aboutUs2.png"; 


export default function AboutSection() {
  // attach ref to the section for viewport detection 
  const ref = useRef(null);

  // isInView becomes true when 30% of the section is visible (only once)
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section id="about" ref={ref} className="py-24 bg-gradient-to-b from-white to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* TEXT COLUMN */}
          <motion.div
            initial={{ opacity: 0, x: -50 }} // start hidden and shifted left
            animate={isInView ? { opacity: 1, x: 0 } : {}} // animate only when section is in view
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block px-4 py-2 bg-pink-100 rounded-full text-pink-600 font-semibold text-sm mb-6">
              About IEC
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Welcome to your one stop beauty shop
            </h2>

            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              At IEC, we foster a culture of entrepreneurship, empowerment, and personal growth in a supportive,
              relationship-focused environment.
            </p>

            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              If you're looking for a space where you can grow, learn, and truly shine, IEC is the place for you!
            </p>

            {/* Button uses whileHover/whileTap which respond to user interaction */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const element = document.getElementById("team");
                if (element) element.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-8 py-3 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors cursor-pointer"
            >
              Learn More About Us
            </motion.button>
          </motion.div>

          {/* IMAGE COLUMN */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img src={salonPic} alt="IEC Salon Interior" className="w-full h-[500px] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            {/* Floating card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl border border-gray-100"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-600 to-purple-600 rounded-full flex items-center justify-center">
                  <Heart className="text-white" size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">100+</p>
                  <p className="text-sm text-gray-600">Happy Clients</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* FEATURES GRID */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-20"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }} // stagger each card
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="text-pink-600" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}