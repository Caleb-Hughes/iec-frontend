import {Heart, Instagram, Facebook} from "lucide-react";
import {Navigate, useNavigate } from "react-router-dom";
import logo from './../assets/Imgs/logo.png';
export function Footer() {
    const currentYear = new Date().getFullYear(); // Get the current year
    const navigate = useNavigate();
    return (
        <footer className = "bg-gray-900 text-white py-12">
            <div className = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                    {/* About Section */}
                    <div className="col-span-2"> 
                       <div className="flex items-center mb-4">
                            <div className="w-12 h-12 flex items-center justify-center">
                                <img src={logo} alt="Logo" className="w-full h-full object-cover rounded-full" />
                            </div>
                            <span className="ml-3 font-semibold text-lg">Image Enhancement Center</span>
                        </div>
                        <p className="text-gray-400 mb-4 max-w-md">
                            Your journey to beauty starts here. A Black-owned salon dedicated to excellence, empowerment, and community.
                        </p>
                        <div className="flex gap-4">
                            <a 
                                href="https://www.instagram.com/iecrichmond/?hl=en"
                                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors"
                            >
                                <Instagram size={20} />
                            </a>
                            <a
                                href="https://www.facebook.com/imageenhancementcenter/"
                                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors"
                            >
                                <Facebook size={20} />
                            </a>
                        </div>
                    </div>
                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold text-white mb-4">Quick Links</h3>
                        <ul className ="space-y-2">
                            <li>
                                <button
                                    onClick={() => navigate('/about')}
                                    className="text-gray-400 hover:text-pink-400 transition-colors cursor-pointer"
                                    >
                                    About Us
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => navigate('/team')}
                                    className="text-gray-400 hover:text-pink-400 transition-colors cursor-pointer"
                                    >
                                    Our Team
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => {
                                        const element = document.getElementById('contact');
                                        if (element) {
                                            element.scrollIntoView({ behavior: 'smooth' });
                                        }}
                                    }
                                        className="text-gray-400 hover:text-pink-400 transition-colors cursor-pointer"
                                        >
                                        Contact Us
                                        </button>
                                </li>
                            </ul>
                        </div>
                        {/*Contact Inforamtion */}
                        <div>
                            <h3 className="font-semibold text-white mb-4">Contact</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li>00 E Broad St</li>
                                <li>Richmond, VA 23219</li>
                                <li>(804) 643-1779</li>
                                <li>iecrichond@gmail.com</li>
                            </ul>
                        </div>
                    </div>
                    {/*Bottom Bar*/}
                    <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row  justify-between items-center gap-4">
                        <p className="text-gray-400 text-sm">
                            © {currentYear} Image Enhancement Center. All rights reserved.                        
                        </p>
                        <p className="tetxt-gray-400 text-sm flex items-center gap-2">
                        Made With <Heart size={16} className="text-pink-600"/> by Caleb Hughes
                        </p>
                    </div>
                </div>
        </footer>
    );
}

export default Footer

