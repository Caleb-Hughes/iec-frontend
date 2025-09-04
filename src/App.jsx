import Header from './Components/Header'
import Hero from './Components/Hero'
import AboutUs from './Components/AboutUs'; // Assuming you have an AboutUs component
import Team from './Components/Team';
import Gallery from './Components/Gallery'
import MainEnder from './Components/MainEnder';
function App() {


  return (
     <>
     <div className="bg-black border-0">
        <Header />
        <Hero />
       <AboutUs />
       <Team />
       <Gallery/>
       <MainEnder/>
      </div>
    </>
      
  )
}

export default App
