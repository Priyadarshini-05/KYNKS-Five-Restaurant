import React from "react";
import { Utensils, Award, Clock, Users } from "lucide-react";

const About = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 translate-y-1/2 -translate-x-1/3"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Image Side */}
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-[2rem] opacity-30 group-hover:opacity-50 blur-lg transition duration-1000 group-hover:duration-200"></div>
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl bg-white border border-gray-100 p-2">
              <img 
                src="/about-restaurant.jpg" 
                alt="Restaurant interior" 
                className="w-full h-[500px] object-cover rounded-[1.5rem] transform transition duration-700 hover:scale-105"
              />
              
              {/* Floating Badge */}
              <div className="absolute top-8 -right-6 lg:-right-8 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 hidden md:flex items-center space-x-4 animate-bounce-slow">
                <div className="bg-yellow-100 p-3 rounded-xl text-yellow-600">
                  <Award size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Award Winning</p>
                  <p className="text-xs text-gray-500">Best Dining 2024</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content Side */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h4 className="text-yellow-500 font-extrabold uppercase tracking-widest text-sm flex items-center gap-2">
                <span className="w-8 h-0.5 bg-yellow-500"></span>
                About Our Heritage
              </h4>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Where Culinary Art Meets <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-400">Passion</span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
                For over a decade, we have been crafting unforgettable dining experiences. Our philosophy is simple: source the finest local ingredients and transform them into masterpieces that delight the senses.
              </p>
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center shrink-0">
                  <Utensils className="text-orange-500" size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-1">Master Chefs</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">Our internationally trained chefs bring world-class expertise to every dish.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                  <Clock className="text-blue-500" size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-1">Fresh Daily</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">Premium ingredients sourced fresh daily from local artisan farmers.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center shrink-0">
                  <Users className="text-green-500" size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-1">Warm Ambiance</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">Designed for comfort, our space is perfect for family and friends.</p>
                </div>
              </div>

            </div>

            <div className="pt-6">
              <button onClick={() => window.location.href='/menu'} className="bg-gray-900 text-white px-8 py-4 rounded-full font-bold hover:bg-yellow-500 hover:text-white transition-all duration-300 shadow-xl shadow-gray-200 hover:shadow-yellow-200 transform hover:-translate-y-1">
                Discover Our Menu
              </button>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
