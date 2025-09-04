import React from 'react'
import { FaPlay, FaClone } from 'react-icons/fa'
import posts from '../data/instagramPosts'

function GalleryGrid() {
  return (
    <div className=" py-8 px-4">
        <div className="grid grid-cols-3 gap-4 max-w-7xl mx-auto"> 
            {posts.map((post) => (
                <a
                    key={post.id}
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative group aspect-square overflow-hidden"
                >
                    <img
                        src={post.thumbnail}
                        alt="Instagram prev"
                        className="absolute inest-0 w-full h-full object-cover transition-transform duration-300 group:hover:scale-105"
                    />
                    {post.type === 'video' && (
                        <div className="absolute inset-0 flex items-center justify-center opacity-90">
                            <FaPlay className="text-white text-3xl"/>
                        </div>
                    )}

                    {post.isCarousel && (
                        <div className ="absolute top-2 right-2 text-white opacity-90">
                            <FaClone className="text-white text-2xl"/>
                        </div>
                    )}
                </a>
            ))}
        </div>
    </div>
  )
}

export default GalleryGrid