import React from 'react'
import galleryBackground from './../assets/Imgs/gallery.png'
import GalleryGrid from './GalleryGrid'

function Gallery() {
  return (
    <section className="relative w-full min-h-[80vh] md:min-h-screen bg-no-repeat bg-cover bg-center mt-5 py-12"
        style={{backgroundImage: `url(${galleryBackground})`}}
    >
        <GalleryGrid/>
    </section>
  )
}

export default Gallery