
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navigation from "@/components/layout/Navigation";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

// Array of placeholder images
const carouselImages = [
  "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=1200&h=600",
  "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&w=1200&h=600",
  "https://images.unsplash.com/photo-1483058712412-4245e9b90334?auto=format&fit=crop&w=1200&h=600",
  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&h=600",
  "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=crop&w=1200&h=600"
];

const Index = () => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Auto-rotate carousel images every 7 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
    }, 7000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-6 pt-32 pb-16">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          {/* Carousel */}
          <div className="mb-12 relative">
            <Carousel className="w-full" selectedIndex={currentImageIndex} setSelectedIndex={setCurrentImageIndex}>
              <CarouselContent>
                {carouselImages.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="relative h-[400px] w-full overflow-hidden rounded-xl">
                      <img 
                        src={image} 
                        alt={`Prom image ${index + 1}`}
                        className="w-full h-full object-cover transition-all duration-500"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute left-4" />
              <CarouselNext className="absolute right-4" />
            </Carousel>
            
            {/* Carousel indicators */}
            <div className="flex justify-center mt-4 space-x-2">
              {carouselImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    currentImageIndex === index ? "bg-primary w-4" : "bg-gray-300"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
          
          {/* Title with cursive font */}
          <h1 className="font-dancing-script text-5xl md:text-7xl font-bold text-gray-900 mb-8">
            Prom
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            An elegant, unforgettable evening designed with magic in mind.
          </p>
          
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <Button 
              size="lg" 
              onClick={() => navigate("/forms")}
              className="bg-[#1A1F2C] hover:bg-[#32394d] text-white"
            >
              View Forms
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate("/tickets")}
              className="border-[#7E69AB] text-[#7E69AB] hover:bg-[#7E69AB] hover:text-white"
            >
              Tickets
            </Button>
          </div>
          
          <div className="mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
            {featureItems.map((item, index) => (
              <div 
                key={index} 
                className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 text-left"
              >
                <h3 className="text-lg font-semibold mb-2 text-gray-900">
                  {item.title}
                </h3>
                <p className="text-gray-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const featureItems = [
  {
    title: "Stunning Venue",
    description: "Join us at our magnificent venue for an unforgettable night of celebration and dancing.",
  },
  {
    title: "Gourmet Dining",
    description: "Enjoy a delicious dinner with various options to accommodate all dietary preferences.",
  },
  {
    title: "Professional Photography",
    description: "Capture memories with friends that will last a lifetime with our professional photographers.",
  },
];

export default Index;
