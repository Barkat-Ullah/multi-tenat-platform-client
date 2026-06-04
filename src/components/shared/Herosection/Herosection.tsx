'use client';
import { motion } from "framer-motion";


interface HeroSectionProps {
    title?: string;
    subtitle?: string;
    backgroundImage?: string;
    overlayOpacity?: number;
}

 const HeroSection = ({ title, subtitle, backgroundImage, overlayOpacity = 0.6 } : HeroSectionProps) => {
  return (
    <div className="relative h-[500px] w-full overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${backgroundImage || 'https://placehold.co/1920x500'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black" 
        style={{ opacity: overlayOpacity }}
      />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-4 sm:px-6 lg:px-8">
        <motion.h1 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-center leading-tight"
        >
          {title || "About Us"}
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-lg sm:text-xl max-w-2xl text-center leading-relaxed"
        >
          {subtitle || "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout."}
        </motion.p>
      </div>
    </div>
  );
};


export default HeroSection