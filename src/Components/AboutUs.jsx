import React from 'react';
import lefTImg from './../assets/Imgs/aboutUs1.png';
import rightImg from './../assets/Imgs/aboutUs2.png';

function AboutUs() {
  return (
    <div className="flex flex-col md:flex-row w-full overflow-hidden mt-0 pt-0">
      
      {/* Left Text Section */}
      <section
        className="relative md:w-1/2 w-full h-[95vh] flex flex-col items-center justify-start px-4 py-10"
        style={{
          backgroundImage: `url(${lefTImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black opacity-50" />
        
        {/* Text Content */}
        <div className="relative z-10 max-w-6xl mx-auto text-pink-100 text-center md:p-8">
          <h1 className="text-4xl md:text-6xl font-semibold mb-10">
            Welcome to your one stop beauty shop
          </h1>

          <p className="text-lg md:text-2xl font-light mb-6 text-pink-100">
            At IEC, we foster a culture of entrepreneurship, empowerment, and personal growth in a
            supportive, relationship-focused environment. We believe each team member is on a
            unique journey from caterpillar to butterfly — developing the skills and confidence to flourish in the beauty industry.
          </p>

          <p className="mb-4">If you're looking for a space where you can grow, learn, and truly shine, IEC is the place for you!</p>

          <p className="mb-6">We can't wait to welcome you into our community and support you in your journey of beauty.</p>

          <a
            href="aboutPage"
            className="mt-6 inline-block border border-pink-100 text-pink-100 px-4 py-2 rounded hover:bg-pink-500 hover:text-white transition md:w-[50%]"
          >
            Click to learn more about us
          </a>
        </div>
      </section>

      {/* Right Image */}
      <div
        className="relative md:w-1/2 w-full h-[95vh] bg-cover bg-center"
        style={{
          backgroundImage: `url(${rightImg})`,
        }}
      />
    </div>
  );
}

export default AboutUs;
