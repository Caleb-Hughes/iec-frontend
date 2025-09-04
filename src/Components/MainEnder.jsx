import React from 'react'
import endingFairy from './../assets/Imgs/endingFairy.png'

function MainEnder() {
  return (
    <section className="relative w-full min-h-[80vh] bg-no-repeat bg-cover bg-center mt-5"
        style={{backgroundImage: `url(${endingFairy})`}}>
        
        {/* Overlay for better text visibility */}
        <div className="absolute inset-0 bg-fuchsia-500 min-h-[50vh] opacity-50"></div>
        
    </section>
  )
}

export default MainEnder 