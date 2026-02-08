import {BrowserRouter, Routes, Route, Link, NavLink} from "react-router-dom";
import {useEffect} from "react";
import {AuthProvider, useAuth} from './auth/AuthContext';
import{useNavigate, useLocation} from 'react-router-dom';
import apiClient from "./api";
import Header from './Components/NavBar'
import Hero from './Components/Hero'
import Footer from './Components/Footer'
import AboutUs from './pages/About'; 
import Team from './pages/Team';
import Gallery from './pages/Gallery'
import MainEnder from './pages/Contact';
import BookingPage from './pages/Booking'
import AppointmentManager from "./Components/AppointmentManager";

//function to scroll to top on route change
function ScrollToTop() {
  const {pathname} = useLocation();
    useEffect(() => {
      document.documentElement.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
// Home page component combining all sections
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

function OAuthSuccess() {
  const {setUser} = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
     (async () => {
      try {
        const r = await apiClient.get('/auth/profile', {withCredentials: true});
        setUser(r.data.user);
        navigate('/'); //go home after setting user
      } catch (err) {
        console.error('OAuth profile fetchfailed', err);
      }
    })();
  }, [navigate, setUser]);
  return <div>Signing you in with Google...</div>
}
export {OAuthSuccess};
// Main App component with routing
export default function App() {
  return (
    //BrowerRouter to enable SPA routing in the app
  <AuthProvider>
   <BrowserRouter>
      <ScrollToTop />
        <Header />
        <main className="pt-20 md:pt-24">
        <Routes>
          <Route path="/" element={<HomePage />} /> {/*Home route*/}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/oauth-success" element={<OAuthSuccess />} />
          <Route path="/appointments" element={<AppointmentManager/>} />

          {/*Catch-all route for undefined paths*/}
          <Route path="*" element={<HomePage />} />
        </Routes>
        </main>
        <Footer />

    </BrowserRouter>
  </AuthProvider> 
  )
}
