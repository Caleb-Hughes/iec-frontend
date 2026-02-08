import React, {useRef} from "react"
import {motion, useInView} from "framer-motion"
import { MapPin, Phone, Mail, Clock } from "lucide-react"
import salonLocations from "../data/salonLocations"

function ContactSection() {
    // Track when section is in view
    const ref = useRef(null)
    const inView = useInView(ref, {once: true, amount: 0.3})
    const primarySalon = salonLocations?.[0];
    return (
        <section
            id="contact"
            ref={ref}
            className="py-24 bg-gradient-to-b from-white to-gray-50"
        >
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            {/* Section Header */}
                            <motion.div
                                initial={{opacity: 0, y: 30}} // Start slightly below and transparent
                                animate={{opacity: 1, y: 0}} // Animate to visible and in place when in view
                                transition={{duration: 0.8}} // Animation duration
                                className="text-center mb-16"
                            >
                                <div className="inline-block px-4 py-2 bg-purple-100 rounded-full text-purple-600 font-semibold text-sm mb-6">
                                    Get in Touch
                                </div>
                                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                                    Visit Us
                                </h2>
            
                                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                    We're here to help you look and fell your best. Visit either 
                                    locaation or contact us using the information below
                                </p>
                            </motion.div>
            
                            <div className="grid lg:grid-cols-2 gap-12">
                                {/* Contact Info */}
                                <motion.div
                                    initial={{opacity: 0, x: -50}} // Start hidden and shifted left
                                    animate={{opacity: 1, x: 0}} // Animate to visible and in place when in view
                                    transition={{duration: 0.8, delay: 0.2 }} // Animation duration
                                    className="space-y-8"
                                >
                                    <h3 className="text-2xl font-bold text-gray-900">
                                        Contact Information
                                    </h3>
                                    <div className="space-y-6">
                                        {/* Address */}
                                        <div className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                                            <div className="w-14 h-14 bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <MapPin className="text-pink-600" size={28}/>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-2 text-lg">
                                                    Address
                                                </h4>
                                                {/* Primary Salon Address */}
                                                <p className="text-gray-600">
                                                    {primarySalon ? (
                                                        <>
                                                            {primarySalon.addressLines[0]}<br/>
                                                            {primarySalon.addressLines[1]}<br/>
                                                        </>
                                                    ) : (
                                                        <span className="text-gray-400">No address available</span>
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        {/* Phone */}
                                        <div className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                                            <div className="w-14 h-14 bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <Phone className="text-pink-600" size={28}/>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-2 text-lg">
                                                    Phone
                                                </h4>
                                                <p className="text-gray-600 text-lg">(804) 643-1779</p>
                                            </div>
                                        </div>
                                        {/* Email */}
                                        <div className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                                            <div className="w-14 h-14 bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <Mail className="text-pink-600" size={28}/>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-2 text-lg">
                                                    Email
                                                </h4>
                                                <p className="text-gray-600 text-lg">iecrichmond@gmail.com</p>
                                            </div>
                                        </div>
                                        {/* Hours */}
                                        <div className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                                            <div className="w-14 h-14 bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <Clock className="text-pink-600" size={28}/>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-2 text-lg">
                                                    Business Hours
                                                </h4>
                                                <p className="text-gray-600 text-lg">
                                                    Mon-Fri: 9am - 7pm<br/>
                                                    Sat: 9am - 5pm<br/>
                                                    Sun: Closed
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
            
                                {/* Stacked maps on right column */}
                                <motion.div
                                    initial={{opacity: 0, x: 50}} // Start hidden and shifted right
                                    animate={{opacity: 1, x: 0}} // Animate to visible and in place when in view
                                    transition={{duration: 0.8, delay: 0.4 }} // Animation duration
                                    className="space-y-8 mt-10 lg:mt-0"
                                >
                                    {salonLocations.map((loc, idx) => (
                                        <motion.div
                                            key={loc.id}
                                            initial={{opacity: 0, y: 20}} // Start slightly below and transparent
                                            animate={{opacity: 1, y: 0}} // Animate to visible and in place when in view
                                            transition={{duration: 0.6, delay: 0.5 + idx * 0.15}} // Stagger each map
                                            className="rounded-2xl overflow-hidden shadow-2xl bg-white"
                                        >
                                            <iframe
                                                title={`${loc.name} map`}
                                                src={loc.embeddedSrc}
                                                loading="lazy" // Lazy loading for performance
                                                referrerPolicy="no-referrer-when-downgrade" // Referrer policy
                                                className="w-full h-[260px] border-0"
                                                allowFullScreen
                                            />
            
                                            <div className="p-6 bg-gradient-to-br from-pink-600 to-purple-600 text-white">
                                                <div className="flex items-start gap-3">
                                                    <MapPin className="opacity-90 mt-1" />
                                                    <div>
                                                        <h3 className="text-xl font-bold">{loc.name}</h3>
                                                        <p className="text-pink-100 mt-1">
                                                            {loc.addressLines[0]}<br/>
                                                            {loc.addressLines[1]}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
            
                                </motion.div>
                            </div>
                        </div>
                    </section>
                );
            }
export default ContactSection