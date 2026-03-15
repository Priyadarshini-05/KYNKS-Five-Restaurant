import React from 'react';
import { ExternalLink, Boxes, Map, UserCheck, Utensils, Trees, Smile } from 'lucide-react';

const ExperienceCard = ({ title, quote, image, link, Icon }) => {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 flex flex-col h-full transform hover:-translate-y-2">
      <div className="relative h-64 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
          <p className="text-white text-sm italic font-medium">"{quote}"</p>
        </div>
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-xl shadow-lg transform translate-y-[-100%] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <Icon className="w-5 h-5 text-orange-500" />
        </div>
      </div>
      
      <div className="p-8 flex flex-col flex-grow">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-orange-50 rounded-lg group-hover:bg-orange-100 transition-colors">
            <Icon className="w-6 h-6 text-orange-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 leading-tight">{title}</h3>
        </div>
        
        <p className="text-gray-600 mb-8 flex-grow leading-relaxed">
          {quote}
        </p>
        
        <a 
          href={link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white px-6 py-3.5 rounded-xl font-semibold hover:bg-orange-600 transition-all duration-300 active:scale-95 group-hover:shadow-lg group-hover:shadow-orange-200"
        >
          <span>Open 3D Model</span>
          <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
        </a>
      </div>
    </div>
  );
};

const Experience3D = () => {
  const experiences = [
    {
      title: "Birthday Celebration Area",
      quote: "Celebrate your special moments with delicious food and joyful ambiance.",
      image: "https://images.unsplash.com/photo-1530103043960-ef38714abb15?auto=format&fit=crop&q=80&w=800",
      link: "https://studio.tripo3d.ai/3d-model/f4f4cb85-c309-41f9-be94-c90f2c6a9fad?invite_code=TAJV36",
      Icon: UserCheck
    },
    {
      title: "Restaurant Full View",
      quote: "A complete view of where taste meets beautiful atmosphere.",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800",
      link: "https://studio.tripo3d.ai/3d-model/098b4a2f-af5d-4795-83d2-b428317e360d?invite_code=TAJV36",
      Icon: Boxes
    },
    {
      title: "Restaurant Overview",
      quote: "Experience the perfect blend of comfort, design, and delicious cuisine.",
      image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=800",
      link: "https://studio.tripo3d.ai/3d-model/9b0a8a86-c5fc-4ebe-b455-e0e6642b1dd0?invite_code=TAJV36",
      Icon: Map
    },
    {
      title: "Private Dining Hut",
      quote: "Enjoy cozy private dining spaces crafted for memorable meals.",
      image: "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?auto=format&fit=crop&q=80&w=800",
      link: "https://studio.tripo3d.ai/3d-model/4d8f7a3f-0c2d-4cfa-af3b-f925ca8d60f8?invite_code=TAJV36",
      Icon: Utensils
    },
    {
      title: "Garden Walk Path",
      quote: "A peaceful pathway that leads you through the beauty of the restaurant.",
      image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800",
      link: "https://studio.tripo3d.ai/3d-model/fdb8e6c6-35b4-4ccc-8be6-38aca897b610?invite_code=TAJV36",
      Icon: Trees
    },
    {
      title: "Kids Play Area",
      quote: "A joyful play space where kids can have fun while families dine happily.",
      image: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&q=80&w=800",
      link: "https://studio.tripo3d.ai/3d-model/7989cb3d-710e-4595-a269-62ec474fe7cb?invite_code=TAJV36",
      Icon: Smile
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <span className="text-orange-600 font-bold tracking-widest uppercase text-sm mb-4 block">Immersive Experience</span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Explore in <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-400">3D</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-600 leading-relaxed font-light">
            Take a virtual tour of our restaurant and find your perfect spot before you even arrive. Experience the ambiance from every angle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {experiences.map((exp, index) => (
            <div 
              key={index} 
              className="transition-all duration-700"
            >
              <ExperienceCard {...exp} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Experience3D;
