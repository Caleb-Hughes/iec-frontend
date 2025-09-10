import {BrowserRouter, Routes, Route, Link, NavLink} from "react-router-dom";
import {useEffect} from "react"
import Header from './Components/NavBar'
import Hero from './Components/Hero'
import AboutUs from './Components/AboutUs'; // Assuming you have an AboutUs component
import Team from './Components/Team';
import Gallery from './Components/Gallery'
import MainEnder from './Components/MainEnder';

//function to scroll to top on route change
function ScrollToTop() {
    useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return null;
}
function HomePage() {
  return (
     <>
        <Hero />
        <AboutUs />
        <Team />
        <Gallery/>
        <MainEnder/>
    </>
      
  )
}
//Stub Route components 
function AboutPage() {return <AboutUs />;}
function TeamPage() {return <Team />;}
function GalleryPage() {return <Gallery />;}
function ContactPage() {return <MainEnder />;}

// Main App component with routing
export default function App() {
  return (
    //BrowerRouter to enable SPA routing in the app
    <BrowserRouter>
      <div className ="bg-black border-0 m-0 p-0">
        <Header />
        <ScrollToTop />
        <main className="pt-20 md:pt-24">
        <Routes>
          <Route path="/" element={<HomePage />} /> // Home route
          <Route path="/about" element={<AboutPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/contact" element={<ContactPage />} />
          //Catch-all route for undefined paths
          <Route path="*" element={<HomePage />} />
        </Routes>
        </main>
      </div>
      <div className="bg-black text-white text-sm text-center py-4">
        &copy; {new Date().getFullYear()} IEC Public Pages. All rights reserved.
      </div>
    </BrowserRouter>
    
  )
}
