import React from 'react'
import {motion} from 'framer-motion'
import { FaPlay, FaClone, FaImage} from 'react-icons/fa'
import posts from '../data/instagramPosts'

function GalleryGrid() {
  return (
    <div className=" py-2">
        <div className="grid grid-cols-3 gap-1 sm:gap-2 md:gap-4 max-w-7xl mx-auto">
            {posts.map((post, index) => {
                const isVideo = post.type === 'video';
                const isCarousel = post.type === 'carousel';

                return (
                <motion.a
                    key={post.id}
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0.95 }} // Start slightly smaller and transparent
                    // Remove isInView if not defined, or define it above
                    animate={{ opacity: 1, scale: 1 }} // Animate to visible and full size
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.05 }} // Staggered animation
                    className="group relative aspect-square cursor-pointer overflow-hidden bg-gray-100"
                >
                    {/*thumbnail image */}
                    <img
                        src={post.thumbnail}
                        alt={post.alt ?? "instagram preview"}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {/*instagram carousel icon */}
                    {isCarousel && (
                        <div className="absolute top-2 right-2 z-10 rounded-full bg-black/60 p-2 text-white">
                            <FaClone className="text-lg"/>
                        </div>
                    )}
                    {/*Hover overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <div className="flex items-center gap-3 text-white">
                            {isVideo ? <FaPlay /> :  <FaImage /> }
                            <span className="font-semibold text-sm tracking-wide">
                                {isVideo ? "VIDEO" : "PHOTO"}
                            </span>
                        </div>
                        {/*Carousel indicator */}
                        {isCarousel && (
                            <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
                                <FaClone />
                                <span className="font-semibold text-sm tracking-wide">
                                    Carousel
                                </span>
                            </div>
                        )}
                    </div>
                </motion.a>
                );
            })}
        </div>
    </div>
  )
}

export default GalleryGrid