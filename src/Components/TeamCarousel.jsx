import React, {useState, useEffect, useRef} from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import {PrevButton, NextButton, usePrevNextButtons} from './CarouselArrows'
import {motion} from 'framer-motion'

const TeamCarousel = ({slides, options}) => {
    const [emblaRef, emblaApi] = useEmblaCarousel(options)
    const {prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick} = usePrevNextButtons(emblaApi)
    const [selectedIndex, setSelectedIndex] = useState(0)
    const viewportRef = useRef (null)

    useEffect(() => {
        if (!emblaApi) return;

        const onSelect = () => {
            setSelectedIndex(emblaApi.selectedScrollSnap());
        };

        emblaApi.on('select', onSelect);
        onSelect();
    }, [emblaApi]); 

    useEffect(() => {
        if (!emblaApi || !viewportRef.current) return;
        let lastScrollTime = 0;
        const SCROLL_COOLDOWN_MS = 500;
        
        const handleWheel = (event) => {
            if (window.innerWidth < 640) return;
            
            if (!emblaApi) return;

            const now = Date.now();
            if (now - lastScrollTime < SCROLL_COOLDOWN_MS) return;

            lastScrollTime = now;
        
            event.preventDefault();
        

            if (event.deltaY > 0) {
                emblaApi.scrollNext();
            } else if (event.deltaY < 0) {
                emblaApi.scrollPrev();
            }
        };

        const container = viewportRef.current;
        container.addEventListener("wheel", handleWheel, { passive: false });

        return () => {
            container.removeEventListener("wheel", handleWheel);
        };
    }, [emblaApi]);
    useEffect(() => {
        if (!emblaApi) return;
            console.log('Snaps:', emblaApi.scrollSnapList());
    }, [emblaApi]);

  return (
    <section className=" relative max-w-4xl mx-auto py-8 group">
        <div className=" text-white text-sm text-center mb-4 block md:hidden">
            <h3>---Swipe to Scroll----</h3>
        </div>
        <div
            className="overflow-hidden"
            ref={(el) => {
                emblaRef(el);
                viewportRef.current = el;
            }}
        >
            <div className="flex gap-0 ml-[-1rem] touch-pan-y touch-pinch-zoom">
                {slides.map((member, index) => {
                    const isSelected = index === selectedIndex;
                    
                    return (
                    <div
                        key={index}
                        className="transform flex-shrink-0 w-[300px] h-full bg-black text-white"
                    >
                        <div className="bg-black text-center py-4">
                            <div className="relative w-[300px] h-[350px]">
                                <img src={member.img} alt={member.name} className="w-[300px] h-[350px] object-cover" />
                                {!isSelected && (
                                    <div className="absolute inset-0 bg-black opacity-40 transition duration-500" />
                                )}
                            </div>
                            <motion.div
                                initial={{opacity: 0, y: 10}}
                                animate={{opacity: isSelected ? 1 : 0, y: isSelected ? 0 : 10}}
                                transition={{duration: 0.4}}
                            >
                                <h3 className="text-lg font-semibold">{member.name}</h3>
                                <p className="text-sm">{member.role}</p>
                            </motion.div>
                        </div>
                    </div>
                    )
                })}
            </div>
        </div>
        
        {/*Navigation Buttons*/}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 z-10 hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300 md:block">
            <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
        </div>

        <div className="absolute top-1/2 -translate-y-1/2 right-0 z-10 hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300 md:block">
            <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>
    </section>
  )
}

export default TeamCarousel