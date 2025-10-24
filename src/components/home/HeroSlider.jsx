import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ShoppingCart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const slides = [
    {
      id: 1,
      title: "Premium Construction Materials",
      subtitle: "Build Your Dreams with Quality",
      description: "Discover high-grade cement, steel, and building materials from trusted suppliers. Get up to 25% off on bulk orders.",
      image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&h=600&fit=crop",
      ctaText: "Shop Now",
      ctaLink: "/products",
      offer: "Up to 25% OFF",
      bgGradient: "from-blue-900 via-blue-800 to-indigo-900"
    },
    {
      id: 2,
      title: "Steel & Iron Collection",
      subtitle: "Strength That Lasts Generations",
      description: "Premium quality steel rebars, TMT bars, and structural steel. Certified products with guaranteed strength and durability.",
      image: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=800&h=600&fit=crop",
      ctaText: "Explore Steel",
      ctaLink: "/products?category=Steel & Iron",
      offer: "Free Delivery",
      bgGradient: "from-slate-800 via-gray-800 to-zinc-900"
    },
    {
      id: 3,
      title: "Tiles & Flooring Solutions",
      subtitle: "Transform Your Spaces",
      description: "Beautiful ceramic, marble, and vitrified tiles for every room. Create stunning interiors with our premium collection.",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
      ctaText: "View Collection",
      ctaLink: "/products?category=Tiles & Flooring",
      offer: "New Arrivals",
      bgGradient: "from-emerald-800 via-teal-800 to-cyan-900"
    },
    {
      id: 4,
      title: "Complete Building Solutions",
      subtitle: "Everything Under One Roof",
      description: "From foundation to finishing - get all your construction materials delivered to your doorstep. Expert consultation included.",
      image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&h=600&fit=crop",
      ctaText: "Get Quote",
      ctaLink: "/contact",
      offer: "Expert Consultation",
      bgGradient: "from-orange-600 to-red-700"
    }
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <div className="relative h-[500px] md:h-[600px] overflow-hidden rounded-2xl shadow-2xl">
      {/* Slides */}
      <div className="relative h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              index === currentSlide 
                ? 'opacity-100 transform translate-x-0' 
                : index < currentSlide 
                  ? 'opacity-0 transform -translate-x-full'
                  : 'opacity-0 transform translate-x-full'
            }`}
          >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-r ${slide.bgGradient} opacity-90`} />
            
            {/* Background Image */}
            <img
              src={slide.image}
              alt={slide.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            
            {/* Content Overlay */}
            <div className="absolute inset-0 bg-black/40" />
            
            {/* Content */}
            <div className="relative h-full flex items-center">
              <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  {/* Text Content */}
                  <div className="text-white space-y-6">
                    {/* Offer Badge */}
                    <div className="inline-block">
                      <span className="bg-yellow-400 text-black px-4 py-2 rounded-full text-sm font-bold animate-pulse">
                        {slide.offer}
                      </span>
                    </div>
                    
                    {/* Title */}
                    <h1 className="text-4xl md:text-6xl font-bold leading-tight animate-slideInLeft">
                      {slide.title}
                    </h1>
                    
                    {/* Subtitle */}
                    <h2 className="text-xl md:text-2xl font-medium text-yellow-200 animate-slideInLeft animation-delay-200">
                      {slide.subtitle}
                    </h2>
                    
                    {/* Description */}
                    <p className="text-lg text-gray-200 max-w-lg animate-slideInLeft animation-delay-400">
                      {slide.description}
                    </p>
                    
                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 animate-slideInLeft animation-delay-600">
                      <Link
                        to={slide.ctaLink}
                        className="inline-flex items-center gap-2 bg-yellow-400 text-black px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 shadow-lg"
                      >
                        <ShoppingCart className="w-5 h-5" />
                        {slide.ctaText}
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                      
                      <Link
                        to="/products"
                        className="inline-flex items-center gap-2 border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-105"
                      >
                        Browse All
                      </Link>
                    </div>
                    
                    {/* Features */}
                    <div className="flex flex-wrap gap-6 text-sm animate-slideInLeft animation-delay-800">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span>Free Delivery</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span>Quality Assured</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span>24/7 Support</span>
                      </div>
                    </div>
                  </div>
                  
      
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/30 transition-all duration-300 z-10"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/30 transition-all duration-300 z-10"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-yellow-400 scale-125' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
        <div 
          className="h-full bg-yellow-400 transition-all duration-300 ease-linear"
          style={{ 
            width: `${((currentSlide + 1) / slides.length) * 100}%` 
          }}
        />
      </div>
    </div>
  );
};

export default HeroSlider;
