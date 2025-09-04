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

export const PrevButton = (props) => {
    const {children, className ='', ...restProps} = props

    return (
        <button 
        type ="button"
        className={`absolute left-68 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-pink-500 rounded-full p-2 shadow transition ${className}`}
        {...restProps}
        >
            <FaChevronLeft className="w-5 h-5 text-black" />
            {children}
        </button>
    )
}

export const NextButton = (props) => {
    const {children, className = '', ...restProps} = props
    
    return (
        <button
            type="button"
            className={`absolute right-72 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-pink-500 rounded-full  p-2 shadow transition ${className}`}
            {...restProps}
        >
            <FaChevronRight className="w-5 h-5 text-black" />
            {children}
        </button>
    )
}