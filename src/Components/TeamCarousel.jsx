import React, { useState, useEffect, useRef } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { PrevButton, NextButton, usePrevNextButtons } from './CarouselArrows';
import { motion } from 'framer-motion';

const TeamCarousel = ({ slides, options }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } = usePrevNextButtons(emblaApi);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const viewportRef = useRef(null);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on('select', onSelect);
    onSelect();

    return () => {
      if (emblaApi && emblaApi.off) emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi || !viewportRef.current) return;
    let lastScrollTime = 0;
    const SCROLL_COOLDOWN_MS = 500;

    const handleWheel = (event) => {
      if (window.innerWidth < 640) return;
      if (!isHovering) return;
      

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
    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    // Debug: list scroll snaps
    // console.log('Snaps:', emblaApi.scrollSnapList());
  }, [emblaApi]);

  return (
    <section className="relative w-full group">
      <div className="text-white text-sm text-center mb-4 block md:hidden">
        <h3>---Swipe to Scroll----</h3>
      </div>

      <div
        className="overflow-hidden overscroll-contain"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div
          className="flex select-none touch-pan-x -ml-6 sm:-ml-6 lg:-ml-8"
          ref={(el) => {
            emblaRef(el);
            viewportRef.current = el;
          }}
        >
          <div className="flex gap-6 sm:px-6 lg:px-8">
            {slides.map((member) => (
              <div
                key={member.name}
                className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_calc(50%-12px)] lg:flex-[0_0_calc(33.333%-16px)]"
              >
                <div className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-[500px] cursor-grab">
                  <div className="absolute inset-0">
                    <img
                      src={member.img}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  </div>

                  <div className="relative h-full flex flex-col justify-end p-8">
                    <h3 className="text-3xl font-bold text-white mb-2">{member.name}</h3>
                    <p className="text-pink-400 font-semibold mb-2">{member.role}</p>
                    {member.specialty && <p className="text-white mb-4">{member.specialty}</p>}
                    <button
                      className="mt-4 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-white bg-gradient-to-r from-pink-600 to-purple-600 hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer"
                    >
                      Book with {member.name}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="absolute top-1/2 -translate-y-1/2 left-0 z-10 hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300 md:block">
        <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
      </div>

      <div className="absolute top-1/2 -translate-y-1/2 right-0 z-10 hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300 md:block">
        <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
      </div>
    </section>
  );
};

export default TeamCarousel;