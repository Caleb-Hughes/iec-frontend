import React from 'react'
import galleryBackground from './../assets/Imgs/gallery.png'
import GalleryGrid from './GalleryGrid'

function Gallery() {
  return (
    <section className="relative w-full min-h-screen bg-no-repeat bg-cover bg-center mt-5"
        style={{backgroundImage: `url(${galleryBackground})`}}
    >
        <GalleryGrid/>
    </section>
  )
}

export default Gallery