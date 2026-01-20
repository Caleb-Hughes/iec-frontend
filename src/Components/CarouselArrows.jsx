import React, {useCallback, useEffect, useState} from 'react'
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6"

//hook to handle prev/next logic
export const usePrevNextButtons = (emblaApi) => {
    const [prevBtnDisabled, setPrevBtnDisabled] = useState(true)
    const [nextBtnDisabled, setNextBtnDisabled] = useState(true)

    const onPrevButtonClick = useCallback (() => {
        if (!emblaApi) return
        emblaApi.scrollPrev()
    }, [emblaApi])

    const onNextButtonClick = useCallback (() => {
        if (!emblaApi) return
        emblaApi.scrollNext()
    }, [emblaApi])

    const onSelect = useCallback((emblaApi) => {
        setPrevBtnDisabled(!emblaApi.canScrollPrev())
        setNextBtnDisabled(!emblaApi.canScrollNext())
    }, [])

    useEffect(() => {
        if (!emblaApi) return
        onSelect(emblaApi)
        emblaApi.on('reInit', onSelect).on('select', onSelect)
    }, [emblaApi, onSelect])

    return {
        prevBtnDisabled,
        nextBtnDisabled,
        onPrevButtonClick,
        onNextButtonClick
    }
}

//arrow button components
export const PrevButton = ({ className = "", ...rest }) => (
    <button 
        type="button"
        className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all ${className}`}
        {...rest}
    >
        <FaChevronLeft className="w-5 h-5 text-black" />
    </button>
)

export const NextButton = ({ className = "", ...rest }) => (
    <button
        type="button"
        className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all ${className}`}
        {...rest}
    >
        <FaChevronRight className="w-5 h-5 text-black" />
    </button>
)
