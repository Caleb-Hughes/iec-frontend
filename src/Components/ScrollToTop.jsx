import {useLayoutEffect} from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
    const { pathname } = useLocation();

    useLayoutEffect(() => {
        //Standard window scroll (just in case)
        window.scrollTo(0, 0);

        //Target the actual scroll containers defined in your CSS
        const scrollContainers = [
            document.documentElement,
            document.body,
            document.getElementById('root'),
            document.querySelector('main') 
        ];

        scrollContainers.forEach(container => {
            if (container) {
                container.scrollTo({
                    top: 0,
                    left: 0,
                    behavior: 'instant'
                });
            }
        });
    }, [pathname]);

    return null;
}