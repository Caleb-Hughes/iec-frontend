import React from 'react'
import endingFairy from './../assets/Imgs/endingFairy.png'
import {FaInstagram, FaFacebook} from 'react-icons/fa'

function MainEnder() {
  return (
    <section className="relative w-full min-h-[75vh] md:min-h-[90vh] bg-no-repeat bg-cover bg-center"
        style={{backgroundImage: `url(${endingFairy})`}}>
        
        {/* Overlay for better text visibility */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 w-full">
          <div className="bg-fuchsia-600/60 backdrop-blur-[1px] w-full">
            <div className="max-6xl mx-auto grid grid-cols-2 gap-8 px-9 mdd:gap-8 mdd:px-6 md:py-12 text-white">
              {/* Left Column */}
              <div className="flex items-center justify-center">
                <h2 className="text-4xl md:text-7xl font-bold leading-tight formatted-text text-center">
                  LET'S <br/> CONNECT
                </h2>
              </div>
              {/* Right Column */}
              <div className="flex flex-col justify-center items-center ">
                <h2 className="text-2xl md:text-4xl font-light formatted-text text-center">
                  Phone
                </h2>
                <p className="text-1xl md:text-2xl mb-6">
                  804-625-9747
                </p>
                <h2 className="text-2xl md:text-4xl font-light formatted-text text-center">
                  Email
                </h2>
                <p className="text-1xl md:text-2xl">
                  Dionneiec@gmail.com
                </p>
                <h2 className="text-2xl md:text-4xl font-light formatted-text text-center mt-6">
                  Address
                </h2>
                <p className="text-1xl md:text-2xl text-center">
                  00 East Broad St <br/>Richmond, VA <br/> 23220
                </p>
                <h2 className="text-2xl md:text-4xl font-light formatted-text text-center mt-6">
                  Socials
                </h2>
                <div className="flex space-x-4 mt-2">
                  <a href="https://www.instagram.com/iecrichmond" target="_blank" rel="noopener noreferrer" className="text-2xl md:text-2xl hover:text-gray-700 transition">
                    <FaInstagram />
                  </a>
                  <a href="https://www.facebook.com/iecbeauty" target="_blank" rel="noopener noreferrer" className="text-2xl md:text-2xl hover:text-gray-700 transition">
                    <FaFacebook />
                  </a>
              </div>
          </div>
        </div>
      </div>
    </div>
    </section>
  )
}

export default MainEnder 