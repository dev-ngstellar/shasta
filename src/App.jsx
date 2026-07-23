import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Shield,
  Star,
  CheckCircle,
  ChevronRight,
  Menu,
  X,
  ArrowRight,
  Award,
  Cpu,
  Users,
  Wrench,
  Sparkles,
  Zap,
  Percent,
  Calendar,
  ChevronLeft
} from 'lucide-react';

// Custom Intersection Observer Counter Component
function Counter({ from, to, duration = 1.5, suffix = '' }) {
  const [count, setCount] = useState(from);
  const elementRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            let start = from;
            const end = parseInt(to, 10);
            if (start === end) return;

            let totalMiliseconds = duration * 1000;
            let incrementTime = Math.abs(Math.floor(totalMiliseconds / end));

            // Adjust increment to make sure it runs smoothly
            let step = Math.ceil(end / 40);

            let timer = setInterval(() => {
              start += step;
              if (start >= end) {
                clearInterval(timer);
                setCount(end);
              } else {
                setCount(start);
              }
            }, incrementTime * step || 30);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [from, to, duration]);

  return <span ref={elementRef}>{count.toLocaleString()}{suffix}</span>;
}

// Before & After Interactive Slider Component
const BeforeAfterSlider = ({ beforeImage, afterImage }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const [loadedCount, setLoadedCount] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const containerRef = useRef(null);

  const handleMove = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(position);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    if (e.touches.length === 0) return;
    handleMove(e.touches[0].clientX);
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchend', handleMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);

  const recalculateSlider = () => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.getBoundingClientRect().width);
    }
  };

  useEffect(() => {
    window.addEventListener('resize', recalculateSlider);
    recalculateSlider();
    return () => {
      window.removeEventListener('resize', recalculateSlider);
    };
  }, []);

  useEffect(() => {
    setImagesLoaded(false);
    setLoadedCount(0);
  }, [beforeImage, afterImage]);

  const handleImageLoad = () => {
    setLoadedCount((prev) => {
      const nextCount = prev + 1;
      if (nextCount >= 2) {
        setImagesLoaded(true);
        requestAnimationFrame(() => {
          recalculateSlider();
        });
      }
      return nextCount;
    });
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[400px] md:h-[450px] overflow-hidden rounded-2xl border border-white/10 select-none cursor-ew-resize glow-gold transition-opacity duration-300 ${imagesLoaded ? 'opacity-100' : 'opacity-0'}`}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onMouseDown={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onTouchStart={() => setIsDragging(true)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsDragging(false);
      }}
    >
      {/* After Image */}
      <img
        src={afterImage}
        alt="After detailing"
        onLoad={handleImageLoad}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{
          transform: isHovered ? 'scale(1.03)' : 'scale(1)',
          transition: 'transform 0.2s ease-out'
        }}
      />

      {/* Before Image */}
      <div
        className="absolute inset-0 h-full overflow-hidden pointer-events-none"
        style={{ width: `${sliderPosition}%` }}
      >
        <img
          src={beforeImage}
          alt="Before detailing"
          onLoad={handleImageLoad}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{ 
            width: containerWidth || (containerRef.current ? containerRef.current.offsetWidth : '100%'), 
            maxWidth: 'none',
            transform: isHovered ? 'scale(1.03)' : 'scale(1)',
            transition: 'transform 0.2s ease-out'
          }}
        />
      </div>

      {/* Static Positioned Badges */}
      <div 
        className="absolute left-3 bottom-3 sm:left-4 sm:bottom-4 bg-brand-navy text-white text-[9px] sm:text-xs font-bold w-[120px] sm:w-[170px] py-1 sm:py-1.5 rounded-full shadow-lg border border-white/10 uppercase z-10 tracking-widest bg-opacity-90 backdrop-blur-sm text-center whitespace-nowrap"
        style={{ WebkitBackdropFilter: 'blur(4px)' }}
      >
        BEFORE TREATMENT
      </div>
      <div 
        className="absolute right-3 bottom-3 sm:right-4 sm:bottom-4 bg-brand-gold text-brand-black text-[9px] sm:text-xs font-bold w-[120px] sm:w-[170px] py-1 sm:py-1.5 rounded-full shadow-lg uppercase z-10 tracking-widest border border-brand-gold/30 backdrop-blur-sm bg-opacity-90 text-center whitespace-nowrap"
        style={{ WebkitBackdropFilter: 'blur(4px)' }}
      >
        AFTER TREATMENT
      </div>

      {/* Slider Divider Line */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-brand-gold cursor-ew-resize z-20"
        style={{ left: `${sliderPosition}%` }}
      >
        {/* Glow behind indicator */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-brand-gold/20 blur-md pointer-events-none"></div>
        {/* Handle Button */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-brand-black border-2 border-brand-gold flex items-center justify-center shadow-[0_0_20px_rgba(212,162,76,0.5)] transition-transform duration-200 active:scale-95">
          <svg className="w-4 h-4 sm:w-5 h-5 text-brand-gold animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l-4 3 4 3m8-6l4 3-4 3" />
          </svg>
        </div>
      </div>

      {/* Help Overlay on first load */}
      <div 
        className="absolute top-3 sm:top-4 left-1/2 -translate-x-1/2 bg-black/60 border border-white/10 backdrop-blur-md text-[8px] sm:text-xs text-white/80 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full pointer-events-none uppercase tracking-widest flex items-center gap-1.5 whitespace-nowrap"
        style={{ WebkitBackdropFilter: 'blur(12px)' }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-ping"></span>
        <span className="block sm:hidden">Drag to compare</span>
        <span className="hidden sm:block">Drag slider to compare paint correction</span>
      </div>
    </div>
  );
};

// Runtime transparent background generator for brand logo
function TransparentImage({ src, alt, className }) {
  const [processedSrc, setProcessedSrc] = useState('');

  useEffect(() => {
    if (!src) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        // Make background white transparent
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i+1];
          const b = data[i+2];
          if (r > 240 && g > 240 && b > 240) {
            data[i+3] = 0; // Alpha
          }
        }
        ctx.putImageData(imageData, 0, 0);
        setProcessedSrc(canvas.toDataURL());
      }
    };
  }, [src]);

  return processedSrc ? (
    <img src={processedSrc} alt={alt} className={className} />
  ) : (
    <img src={src} alt={alt} className={`${className} opacity-0`} />
  );
}

export default function App() {
  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('');

  // Gallery Tab selection
  const [galleryTab, setGalleryTab] = useState('ceramic');

  // Contact Form States
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    vehicleModel: '',
    service: '',
    message: ''
  });

  // Testimonials state
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Auto Scroll Testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Window scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setNavScrolled(true);
      } else {
        setNavScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Form submit to Email
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const { name, phone, vehicleModel, service, message } = formData;

    if (!name || !phone || !vehicleModel || !service) {
      alert("Please fill in all the required fields.");
      return;
    }

    const emailSubject = `Enquiry from ${name} - Shasta Auto Tech`;
    const emailBody = `Hello Shasta Auto Tech,

I would like to make an enquiry regarding your professional car care services:

- Name: ${name}
- Phone Number: ${phone}
- Vehicle Model: ${vehicleModel}
- Required Service: ${service}
- Message/Requirements: ${message || 'N/A'}

Best regards,
${name}`;

    const mailtoUrl = `mailto:Shastaautotech@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    window.location.href = mailtoUrl;
  };

  // Smooth scroll helper
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // height of fixed navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setMobileMenuOpen(false);
    }
  };

  // Auto pre-fill service in form when clicking 'Book Service'
  const handleBookService = (serviceName) => {
    setFormData(prev => ({ ...prev, service: serviceName }));
    scrollToSection('contact');
  };

  // Services data
  const services = [
    {
      id: 'foam-wash',
      title: 'Foam Wash',
      desc: 'Complete exterior foam cleaning for a spotless finish.',
      image: 'https://images.unsplash.com/photo-1552930294-6b595f4c2974?q=80&w=600&auto=format&fit=crop',
      longDesc: 'Our premium foam wash uses WÜRTH active snow foam formula to gently lift and encapsulate dirt, grit, and road grime away from the vehicle paintwork, preventing wash swirl marks.'
    },
    {
      id: 'interior-detailing',
      title: 'Interior Detailing',
      desc: 'Deep cleaning and restoration of vehicle interiors.',
      image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=600&auto=format&fit=crop',
      longDesc: 'Complete revitalization of the interior cabin: dashboard restoration, leather conditioning, deep carpet shampooing, vacuuming, and fabric guard to bring back that new car smell and feel.'
    },
    {
      id: 'steam-cleaning',
      title: 'Steam Cleaning',
      desc: 'Chemical-free sanitization and deep cleaning.',
      image: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?q=80&w=600&auto=format&fit=crop',
      longDesc: 'Using superheated pressurized steam to deep clean AC vents, upholstery, engines, and hard-to-reach crevices, neutralizing 99.9% of bacteria and allergens without harsh chemical residues.'
    },
    {
      id: 'exterior-detailing',
      title: 'Exterior Detailing',
      desc: 'Professional exterior enhancement and protection.',
      image: 'https://images.unsplash.com/photo-1507136566006-cfc505b114fc?q=80&w=600&auto=format&fit=crop',
      longDesc: 'Multi-stage paint decontamination using clay bar, iron removers, followed by sealant applications to protect all plastic trim, chrome accents, and glass surfaces.'
    },
    {
      id: 'rubbing-polishing',
      title: 'Rubbing & Polishing',
      desc: 'Paint correction and gloss enhancement.',
      image: '/services/polish.png',
      longDesc: 'Our multi-step paint correction processes remove fine scratches, buffer swirls, oxidation, and water spots, restoring the original deep color, mirror-like gloss, and clarity of the paint.'
    },
    {
      id: 'ceramic-coating',
      title: 'Ceramic Coating',
      desc: 'Long-lasting paint protection and shine.',
      image: '/services/ceramic.png',
      longDesc: 'Applying WÜRTH specialized ultra-hydrophobic ceramic liquid glass. Forms a permanent nanostructure bond that blocks UV rays, prevents chemical staining, and yields a deep gloss lasting up to 5 years.'
    },
    {
      id: 'graphene-coating',
      title: 'Graphene Coating',
      desc: 'Advanced protection with superior durability.',
      image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=600&auto=format&fit=crop',
      longDesc: 'Experience the cutting-edge of automotive care. Graphene coating utilizes advanced carbon atom structures for double the hardness of normal ceramic coatings, offering extreme thermal dissipation and water spots reduction.'
    },
    {
      id: 'restoration',
      title: 'Modification & Restoration',
      desc: 'Vehicle restoration and customization services.',
      image: '/services/modification.png',
      longDesc: 'Comprehensive custom services including headlight yellowing restoration, plastic trims rejuvenation, engine bay dressing, custom wheel styling, and complete classic car body restorations.'
    }
  ];

  // Why choose us items
  const reasons = [
    {
      icon: <Award className="w-6 h-6 text-brand-red" />,
      title: "WÜRTH Certified Products",
      desc: "We use only premium, genuine WÜRTH automotive cleaners, polishes, and nanotechnology coatings for top-tier results."
    },
    {
      icon: <Users className="w-6 h-6 text-brand-gold" />,
      title: "Skilled & Experienced Technicians",
      desc: "Our detailing professionals undergo rigorous certified training in paint correction, wet sanding, and coating applications."
    },
    {
      icon: <Shield className="w-6 h-6 text-brand-blue" />,
      title: "Premium Quality Materials",
      desc: "From high-gsm microfibers to specialized compound abrasives, every material that touches your car is selected for safety and shine."
    },
    {
      icon: <Wrench className="w-6 h-6 text-white" />,
      title: "Advanced Equipment",
      desc: "Equipped with specialized dual-action polishers, steam extractors, infrared curing lights, and paint depth gauges."
    },
    {
      icon: <Zap className="w-6 h-6 text-brand-gold" />,
      title: "Affordable Pricing",
      desc: "Get luxury showroom finishes with clear, transparent pricing packages tailored specifically to your vehicle class."
    },
    {
      icon: <Clock className="w-6 h-6 text-brand-red" />,
      title: "Timely Delivery",
      desc: "Our optimized workflows and multi-tech teams ensure your ceramic coating or detailing is completed on schedule."
    },
    {
      icon: <Sparkles className="w-6 h-6 text-brand-blue" />,
      title: "Customer First Approach",
      desc: "We inspect your car together, recommend only what you need, and provide digital progress updates of your treatment."
    },
    {
      icon: <CheckCircle className="w-6 h-6 text-white" />,
      title: "Long Lasting Protection",
      desc: "All our ceramic and graphene coatings come with warranty certificates and scheduled periodic inspection checkups."
    }
  ];

  // Before & after image pairs
  const beforeAfterData = {
    foam: {
      before: "/gallery/foam_before.jpeg",
      after: "/gallery/foam_after.jpeg",
      title: "Foam Wash & Decontamination",
      desc: "Watch how a heavy coat of active snow foam emulsifies road dirt and thick mud, safely rinsing it away without causing micro-scratches."
    },
    interior: {
      before: "/gallery/interior_before.png",
      after: "/gallery/interior_after.png",
      title: "Interior Restoration",
      desc: "Removal of years of deep leather stains, dust accumulation, grease, and cabin odors. Restored to a fresh, clean, factory finish."
    },
    ceramic: {
      before: "/gallery/ceramic_before.jpeg",
      after: "/gallery/ceramic_after.jpeg",
      title: "WÜRTH Ceramic Protection",
      desc: "Converts dull, oxidized paint into a glass-like mirror. Increases surface hydrophobicity, causing water and pollutants to slide right off."
    },
    polishing: {
      before: "/gallery/polishing_before.jpeg",
      after: "/gallery/polishing_after.jpeg",
      title: "Swirl Marks Paint Correction",
      desc: "Multi-stage machine compounding corrects paint defects, swirl marks, light key scratches, and paint fading, adding rich depth."
    },
    restoration: {
      before: "/gallery/restoration_before.png",
      after: "/gallery/restoration_after.png",
      title: "Headlight & Trim Restoration",
      desc: "Restores hazy, yellowed headlight lenses to crystal clarity and brings faded grey exterior plastics back to rich factory black."
    }
  };

  const beforeAfterCategories = [
    {
      id: 'foam',
      badge: 'Foam Wash',
      title: "Foam Wash & Decontamination",
      desc: "Watch how a heavy coat of active snow foam emulsifies road dirt and thick mud, safely rinsing it away without causing micro-scratches.",
      before: "/gallery/foam_before.jpeg",
      after: "/gallery/foam_after.jpeg",
      benefits: [
        "Safely rinses away abrasive road grime",
        "Prevents swirl marks and micro-scratching",
        "Restores clean paint and clearcoat gloss"
      ]
    },
    {
      id: 'interior',
      badge: 'Interior Cleaning',
      title: "Interior Restoration",
      desc: "Removal of years of deep leather stains, dust accumulation, grease, and cabin odors. Restored to a fresh, clean, factory finish.",
      before: "/gallery/interior_before.png",
      after: "/gallery/interior_after.png",
      benefits: [
        "Deep extracts seat stains and dust",
        "Disinfects cabin with active steam sanitizing",
        "Restores leather and vinyl to factory finish"
      ]
    },
    {
      id: 'ceramic',
      badge: 'Ceramic Coating',
      title: "WÜRTH Ceramic Protection",
      desc: "Converts dull, oxidized paint into a glass-like mirror. Increases surface hydrophobicity, causing water and pollutants to slide right off.",
      before: "/gallery/ceramic_before.jpeg",
      after: "/gallery/ceramic_after.jpeg",
      benefits: [
        "Adds 9H glass shield paint protection",
        "Creates mirror-like gloss and shine",
        "Provides deep water-repellent hydrophobicity"
      ]
    },
    {
      id: 'polishing',
      badge: 'Paint Polishing',
      title: "Swirl Marks Paint Correction",
      desc: "Multi-stage machine compounding corrects paint defects, swirl marks, light key scratches, and paint fading, adding rich depth.",
      before: "/gallery/polishing_before.jpeg",
      after: "/gallery/polishing_after.jpeg",
      benefits: [
        "Removes micro-swirls and oxidation",
        "Restores rich paint depth and reflection",
        "Levels paint surface clearcoat imperfections"
      ]
    },
    {
      id: 'restoration',
      badge: 'Restoration',
      title: "Headlight & Trim Restoration",
      desc: "Restores hazy, yellowed headlight lenses to crystal clarity and brings faded grey exterior plastics back to rich factory black.",
      before: "/gallery/restoration_before.png",
      after: "/gallery/restoration_after.png",
      benefits: [
        "Restores headlight lenses to clear safety",
        "Rejuvenates grey trims back to rich black",
        "Protects plastic from UV cracking & fading"
      ]
    }
  ];

  // Testimonials
 const testimonials = [
  {
    stars: 5,
    text: "Excellent service by Shasta Auto Tech. The team did a fantastic job with the wash and polishing. My car looks super clean and shiny like new. Staff were friendly, professional, and completed the work on time.",
    name: "Ram K",
    role: "Salem",
    car: "Car Wash & Polish"
  },
  {
    stars: 5,
    text: "Got my Hycross thoroughly cleaned, including a steam wash inside the bonnet area. The service was excellent from start to finish. The entire process was explained clearly with complete transparency.",
    name: "MD Sajeet",
    role: "Salem",
    car: "Toyota Hycross"
  },
  {
    stars: 5,
    text: "I did ceramic coating and complete detailing work at Shasta. I was amazed by the quality. It felt like taking delivery of a brand-new car again. Daily updates and professional workmanship throughout.",
    name: "S. Mohan Raj",
    role: "Salem",
    car: "Ceramic Coating"
  },
  {
    stars: 5,
    text: "Got my car's headlights polished here. They were faded and yellow before, but now they look brand new. Super clear, shiny, and restored perfectly. Great service and excellent results.",
    name: "Saran DT",
    role: "Local Guide",
    car: "Headlight Restoration"
  },
  {
    stars: 5,
    text: "I recently had my car ceramic coated at Shasta Auto Tech. My car looks better than it did when it was brand new. Highly recommend them for ceramic coating and car accessories fitting.",
    name: "Venkatesh S",
    role: "Salem",
    car: "Ceramic Coating"
  },
  {
    stars: 5,
    text: "Powerful washing followed by foam wash and complete cleaning. Detailed attention was given to the interior, exterior, and underbody. The overall quality of work was truly impressive.",
    name: "Balaji Hariharan",
    role: "Salem",
    car: "Complete Detailing"
  }
];

  return (
    <div className="relative min-h-screen bg-brand-black text-white font-sans selection:bg-brand-gold selection:text-brand-black overflow-x-hidden">

      {/* 1. NAVBAR */}
      <nav className={`fixed top-0 left-0 w-full z-[9999] transition-all duration-200 ${navScrolled ? 'glass-nav h-[72px]' : 'top-nav h-[80px]'}`}>
        <div className="w-full flex items-center h-full justify-between">

          {/* Logo Branding */}
          <div className="relative flex items-center justify-start cursor-pointer shrink-0 h-full pl-3 pr-14 lg:pl-5 lg:pr-20 w-[50%] lg:w-[20%]" onClick={() => scrollToSection('home')}>
            {/* Slanted White Background */}
            <div 
              className="absolute top-0 bottom-0 bg-white z-0 transition-all duration-200 slanted-logo-bg" 
            />
            <img 
              src="/shasta-title_2.png" 
              alt="Shasta Auto Tech" 
              className="relative z-10 h-[85%] lg:h-[90%] w-full lg:w-[120%] object-contain transition-all duration-300 hover:scale-[1.02]"
            />
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center justify-center gap-8 lg:w-[48%] h-full">
            {['home', 'about', 'services', 'why-choose-us', 'gallery', 'contact'].map((section) => (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                className="text-xs font-semibold tracking-widest text-gray-300 hover:text-brand-gold uppercase transition-colors relative group py-1 shrink-0"
              >
                {section.replace(/-/g, ' ')}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-gold transition-all duration-300 group-hover:w-full"></span>
              </button>
            ))}
          </div>

          {/* Right Side CTA Button & Mobile Menu Toggle */}
          <div className="flex items-center justify-end gap-4 pr-4 sm:pr-6 lg:pr-8 lg:w-[22%] shrink-0">
            <div className="hidden sm:flex items-center">
              <a
                href="https://wa.me/918300044406"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2 rounded-full bg-brand-gold hover:bg-white text-brand-black hover:text-brand-black font-bold text-xs tracking-wider uppercase transition-all duration-300 flex items-center gap-2 border border-brand-gold shadow-[0_0_15px_rgba(212,162,76,0.2)] hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] active:scale-95"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.333 4.993L2 22l5.233-1.371a9.944 9.944 0 0 0 4.773 1.218h.004c5.505 0 9.99-4.478 9.99-9.985C22.007 6.476 17.519 2 12.012 2zm5.727 14.18c-.237.667-1.377 1.272-1.9 1.325-.5.05-1.155.074-1.848-.15-2.883-.935-4.898-3.793-5.04-3.987-.144-.194-1.176-1.564-1.176-2.984 0-1.42.742-2.115 1.006-2.395.263-.28.577-.35.77-.35h.55c.176 0 .411.008.6.452.195.46.666 1.626.724 1.745.058.12.097.258.018.416-.08.158-.12.258-.238.396-.118.14-.249.31-.355.417-.119.12-.244.25-.105.49.139.239.619 1.018 1.327 1.65.91.81 1.674 1.06 1.91 1.18.236.12.373.1.512-.06.139-.16.6-1.02.76-1.37.158-.35.316-.29.535-.21.219.08 1.39.654 1.63.774.24.12.4.18.458.28.058.1.058.58-.18 1.25z" />
                </svg>
                WhatsApp Enquiry
              </a>
            </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-white focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-brand-gold" /> : <Menu className="w-6 h-6" />}
          </button>

          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 bg-brand-black/95 backdrop-blur-lg z-[9998] lg:hidden py-6 px-4"
            style={{ 
              top: navScrolled ? '72px' : '80px',
              WebkitBackdropFilter: 'blur(16px)'
            }}
          >
            <div className="flex flex-col gap-4">
              {['home', 'about', 'services', 'why-choose-us', 'gallery', 'contact'].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className="text-left text-base font-semibold tracking-wider text-gray-200 hover:text-brand-gold uppercase py-2 border-b border-white/5"
                >
                  {section.replace(/-/g, ' ')}
                </button>
              ))}

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <a
                  href="https://wa.me/918300044406"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center px-5 py-3 rounded-full bg-brand-gold text-brand-black font-semibold text-sm tracking-wider uppercase transition-colors flex items-center justify-center gap-2"
                >
                  WhatsApp Enquiry
                </a>
                <a
                  href="tel:+918300044406"
                  className="w-full text-center px-5 py-3 rounded-full border border-white/20 text-white font-semibold text-sm tracking-wider uppercase transition-colors flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4 text-brand-red" />
                  Call Now
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* 2. HERO SECTION */}
      <section id="home" className="relative min-h-[100dvh] flex items-center justify-center pt-24 pb-16 overflow-hidden">

        {/* Parallax Background Video/Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1607860108855-64acf2078ed9?q=80&w=1600&auto=format&fit=crop"
            alt="Luxury detailing workshop"
            className="w-full h-full object-cover object-center scale-105 filter brightness-[0.25]"
          />
          {/* Subtle moving overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-brand-black via-brand-black/90 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-brand-black/50"></div>
          {/* Dynamic grid light overlay */}
          <div className="absolute inset-0 opacity-[0.03] bg-carbon-pattern bg-[length:24px_24px]"></div>
        </div>

        {/* Content Container */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 w-full">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Left Column Content */}
            <div className="lg:col-span-7 text-left space-y-6">

              {/* Partner Badge */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 bg-brand-red/10 border border-brand-red/30 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest text-brand-red shadow-[0_0_15px_rgba(225,29,72,0.15)]"
              >
                <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse"></span>
                WÜRTH Authorized Partner
              </motion.div>

              {/* Tagline */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.05 }}
                className="text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-brand-gold"
              >
                The Car Care Solution Expert
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-[1.1] font-sans"
              >
                Premium Car Care &<br />
                <span className="text-gold-metallic">Detailing Solutions</span>
              </motion.h1>

              {/* Subheading */}
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-sm sm:text-base md:text-lg text-gray-300 font-light max-w-xl leading-relaxed"
              >
                Protect, Restore and Enhance Your Vehicle with Professional Detailing, Ceramic Coating, Graphene Protection and Premium Car Care Services.
              </motion.p>

              {/* Hero CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex flex-wrap gap-4 pt-2"
              >
                <button
                  onClick={() => scrollToSection('contact')}
                  className="px-8 py-3.5 rounded-full bg-brand-red hover:bg-white text-white hover:text-brand-black font-bold text-xs uppercase tracking-wider transition-all duration-300 border border-brand-red hover:border-white shadow-[0_0_20px_rgba(225,29,72,0.4)] active:scale-95 flex items-center gap-2"
                >
                  Book Service
                  <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href="https://wa.me/918300044406"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-3.5 rounded-full border border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-black font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-[0_0_15px_rgba(212,162,76,0.1)] active:scale-95 flex items-center gap-2"
                >
                  WhatsApp Enquiry
                </a>
              </motion.div>

            </div>

            {/* Right Column Content - Floating Car Image */}
            <div className="lg:col-span-5 relative flex justify-center items-center py-8">

              {/* Backlit Glow behind the car */}
              <div className="absolute w-[250px] sm:w-[350px] h-[250px] sm:h-[350px] rounded-full bg-brand-gold/10 blur-[80px] z-0"></div>

              {/* Animated Light Streaks */}
              <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[30%] left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent animate-[pulse_3s_infinite]"></div>
                <div className="absolute top-[60%] left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-brand-red/30 to-transparent animate-[pulse_4s_infinite]"></div>
              </div>

              {/* Red Sports Car Image with floating motion */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className="relative z-10 w-full max-w-[450px]"
              >
                <motion.img
                  src="https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1000&auto=format&fit=crop"
                  alt="Red luxury detailed sports car"
                  className="w-full h-auto object-contain drop-shadow-[0_20px_50px_rgba(225,29,72,0.3)] filter brightness-110"
                  animate={{
                    y: [0, -12, 0],
                    rotate: [0, 1, 0]
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />

                {/* Micro floating highlight tag */}
                <div 
                  className="absolute -top-4 -right-2 bg-brand-navy/95 border border-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-xl shadow-2xl flex items-center gap-2 transform hover:scale-105 transition-transform duration-300"
                  style={{ WebkitBackdropFilter: 'blur(12px)' }}
                >
                  <Sparkles className="w-4 h-4 text-brand-gold" />
                  <span className="text-[10px] uppercase font-bold tracking-widest text-white">9H Glass Coat</span>
                </div>
              </motion.div>

            </div>

          </div>

          {/* STATISTICS CARDS (at bottom of Hero) */}
          <div className="mt-16 sm:mt-24 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { label: "Happy Customers", count: "500", suffix: "+" },
              { label: "Vehicles Detailed", count: "1000", suffix: "+" },
              { label: "Years Experience", count: "5", suffix: "+" },
              { label: "Customer Satisfaction", count: "100", suffix: "%" }
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + idx * 0.1 }}
                className="glass-panel p-5 rounded-2xl border border-white/5 hover:border-brand-gold/30 hover:scale-[1.03] transition-all duration-300 text-center relative group"
              >
                {/* Gold Highlight Line */}
                <div className="absolute top-0 inset-x-12 h-[1px] bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <h3 className="text-3xl sm:text-4xl font-black text-brand-gold tracking-tight leading-none mb-2">
                  <Counter from={0} to={stat.count} suffix={stat.suffix} />
                </h3>
                <p className="text-xs uppercase tracking-widest text-gray-400 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>

        </div>

      </section>


      {/* 3. ABOUT SECTION */}
      <section id="about" className="relative py-24 bg-brand-navy/30 overflow-hidden">

        {/* Abstract background graphics */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-brand-gold/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute left-0 bottom-0 w-96 h-96 bg-brand-red/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left side detailing workshop image */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="relative group"
            >
              {/* Outer Glowing Border */}
              <div className="absolute -inset-2 bg-gradient-to-r from-brand-red to-brand-gold rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>

              <div className="relative rounded-2xl overflow-hidden border border-white/10 glow-gold">
                <img
                  src="https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=800&auto=format&fit=crop"
                  alt="Detailing workshop paint polishing"
                  className="w-full h-[350px] sm:h-[450px] object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Floating brand icon stamp */}
                <div className="absolute bottom-6 left-6 right-6 glass-panel p-4 rounded-xl border border-white/10 flex items-center gap-4 bg-black/60 backdrop-blur-md">
                  <div className="w-12 h-12 rounded-lg bg-brand-red flex items-center justify-center font-bold text-white shrink-0">
                    W
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">Authorized Partner</h4>
                    <p className="text-xs text-gray-400">Exclusive WÜRTH Premium Products & Compounds</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right side narrative and feature cards */}
            <div className="space-y-8">

              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 text-brand-gold text-xs font-bold uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-gold"></span>
                  EXCELLENCE RESTORED
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  About <span className="text-gold-metallic">Shasta Auto Tech</span>
                </h2>
                <p className="text-gray-300 leading-relaxed font-light">
                  Shasta Auto Tech is Salem's trusted destination for premium automotive detailing and car care solutions. As a WÜRTH partnered service center, we deliver professional-grade treatments designed to preserve, protect, and enhance every vehicle.
                </p>
                <p className="text-gray-300 leading-relaxed font-light">
                  Our expert technicians use advanced techniques, premium products, and industry-leading technologies to ensure exceptional results for every customer. From standard foam washes to high-end multi-layer Graphene coatings, we treat every car like a masterpiece.
                </p>
              </div>

              {/* 4 Feature Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    icon: <Award className="w-5 h-5 text-brand-gold" />,
                    title: "Premium Products",
                    desc: "WÜRTH German engineered compounds"
                  },
                  {
                    icon: <Users className="w-5 h-5 text-brand-red" />,
                    title: "Expert Technicians",
                    desc: "Professionally trained detailing specialists"
                  },
                  {
                    icon: <Cpu className="w-5 h-5 text-brand-blue" />,
                    title: "Advanced Technology",
                    desc: "Digital paint measurement & steam extractors"
                  },
                  {
                    icon: <CheckCircle className="w-5 h-5 text-white" />,
                    title: "Guaranteed Quality",
                    desc: "Transparent packages & certificate backing"
                  }
                ].map((feature, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="glass-panel p-4 rounded-xl border border-white/5 flex gap-3.5 hover:border-brand-gold/20 transition-all duration-300"
                  >
                    <div className="p-2.5 rounded-lg bg-white/5 shrink-0 flex items-center justify-center h-10 w-10">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{feature.title}</h4>
                      <p className="text-xs text-gray-400 mt-0.5">{feature.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* 4. SERVICES SECTION */}
      <section id="services" className="relative py-24 bg-brand-black overflow-hidden">

        {/* Dynamic decorative backdrop text */}
        <div className="absolute right-10 top-24 text-[120px] font-black text-white/[0.01] tracking-widest select-none font-sans uppercase hidden lg:block">
          SERVICES
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <div className="inline-flex items-center gap-2 text-brand-red text-xs font-bold uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-red"></span>
              PROFESSIONAL TREATMENTS
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              Our Luxury <span className="text-gold-metallic">Detailing Services</span>
            </h2>
            <p className="text-gray-400 text-sm sm:text-base font-light">
              Transform your vehicle with our range of professional car care services, utilizing premium German engineered products.
            </p>
          </div>

          {/* Grid Layout of Services */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, idx) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.05 }}
                className="group relative bg-brand-navy/20 rounded-2xl overflow-hidden border border-white/5 hover:border-brand-gold/40 transition-all duration-500 hover:-translate-y-2 glow-hover-gold flex flex-col h-full"
              >

                {/* Image Section */}
                <div className="h-48 overflow-hidden relative">
                  {/* Subtle Dark Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/20 to-transparent z-10"></div>
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Service Accent Badge */}
                  <div className="absolute top-4 left-4 z-20 bg-brand-black/70 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest text-brand-gold">
                    Premium Treatment
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white tracking-wide group-hover:text-brand-gold transition-colors duration-300">
                      {service.title}
                    </h3>
                    <p className="text-gray-400 text-xs sm:text-sm font-light leading-relaxed">
                      {service.desc}
                    </p>
                    <p className="text-gray-500 text-[11px] font-light leading-relaxed hidden group-hover:block transition-all duration-300">
                      {service.longDesc}
                    </p>
                  </div>

                  <div className="pt-4 flex items-center justify-between border-t border-white/5">
                    <button
                      onClick={() => handleBookService(service.title)}
                      className="text-xs uppercase font-bold tracking-widest text-brand-gold hover:text-white transition-colors flex items-center gap-1.5"
                    >
                      Book Now
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[10px] uppercase tracking-widest font-semibold text-brand-red bg-brand-red/10 border border-brand-red/20 px-2 py-0.5 rounded">
                      WÜRTH
                    </span>
                  </div>

                </div>

              </motion.div>
            ))}
          </div>

        </div>

      </section>


      {/* 5. WHY CHOOSE US SECTION */}
      <section id="why-choose-us" className="relative py-24 bg-brand-navy/15 overflow-hidden">

        {/* Background grids */}
        <div className="absolute inset-0 opacity-[0.02] bg-carbon-pattern bg-[length:20px_20px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <div className="inline-flex items-center gap-2 text-brand-gold text-xs font-bold uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-gold"></span>
              THE SHASTA DIFFERENCE
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              Why Auto Enthusiasts <span className="text-gold-metallic">Choose Us</span>
            </h2>
            <p className="text-gray-400 text-sm font-light">
              We set the gold standard in vehicle restoration, detailing, and paint protection using elite products.
            </p>
          </div>

          {/* Grid of Reasons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {reasons.map((reason, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-brand-gold/30 hover:scale-[1.02] transition-all duration-300 group flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Icon with circular glowing border */}
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-brand-gold/50 group-hover:bg-brand-gold/10 transition-all duration-500">
                    {reason.icon}
                  </div>
                  <h3 className="text-base font-bold text-white tracking-wide group-hover:text-brand-gold transition-colors duration-300">
                    {reason.title}
                  </h3>
                  <p className="text-gray-400 text-xs leading-relaxed font-light">
                    {reason.desc}
                  </p>
                </div>

                <div className="mt-6 flex justify-end">
                  <CheckCircle className="w-4 h-4 text-brand-gold opacity-30 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.div>
            ))}
          </div>

        </div>

      </section>


      {/* 6. PROCESS TIMELINE SECTION */}
      <section id="process" className="relative py-24 bg-brand-black overflow-hidden">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
            <div className="inline-flex items-center gap-2 text-brand-red text-xs font-bold uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-red"></span>
              OUR METHODOLOGY
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              Our Professional <span className="text-gold-metallic">Detailing Process</span>
            </h2>
            <p className="text-gray-400 text-sm font-light">
              From inspection to final delivery, we follow a rigorous 5-step precision path to perfection.
            </p>
          </div>

          {/* Timeline Layout */}
          {/* Horizontal Desktop Timeline, Vertical Mobile Timeline */}
          <div className="relative">

            {/* Horizontal Line connector (Desktop) */}
            <div className="hidden lg:block absolute top-[44px] left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-brand-red via-brand-gold to-brand-blue/60 z-0"></div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-6 relative z-10">
              {[
                {
                  step: "01",
                  title: "Vehicle Inspection",
                  desc: "We perform a thorough paint depth analysis, check for swirl marks, and identify contamination levels.",
                  color: "border-brand-red text-brand-red"
                },
                {
                  step: "02",
                  title: "Service Recommendation",
                  desc: "Based on the inspection, we suggest standard or premium corrective detailing and protective coatings.",
                  color: "border-brand-gold text-brand-gold"
                },
                {
                  step: "03",
                  title: "Professional Treatment",
                  desc: "Our skilled technicians execute multi-stage polishing, ceramic coatings, and interior sanitization.",
                  color: "border-white text-white"
                },
                {
                  step: "04",
                  title: "Quality Check",
                  desc: "Rigorous quality inspection under high-intensity detailer LED arrays to ensure flawlessness.",
                  color: "border-brand-blue text-brand-blue"
                },
                {
                  step: "05",
                  title: "Delivery",
                  desc: "A stunning reveal in our service lounge. Your vehicle is returned with a showroom mirror shine.",
                  color: "border-green-500 text-green-500"
                }
              ].map((stepItem, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.15 }}
                  className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-4 group"
                >

                  {/* Timeline Node */}
                  <div className="relative">
                    {/* Ring Outer Effect */}
                    <div className="absolute -inset-2 rounded-full bg-brand-gold/10 opacity-0 group-hover:opacity-100 blur-sm transition duration-300"></div>
                    <div className={`relative w-22 h-22 rounded-full bg-brand-black border-2 ${stepItem.color} flex items-center justify-center font-bold text-xl tracking-tight shadow-[0_0_20px_rgba(0,0,0,0.8)] z-10 h-20 w-20`}>
                      {stepItem.step}
                    </div>
                  </div>

                  {/* Text Details */}
                  <div className="space-y-2 px-4 lg:px-0">
                    <h3 className="text-lg font-bold text-white group-hover:text-brand-gold transition-colors duration-300">
                      {stepItem.title}
                    </h3>
                    <p className="text-gray-400 text-xs sm:text-sm font-light leading-relaxed">
                      {stepItem.desc}
                    </p>
                  </div>

                </motion.div>
              ))}
            </div>

          </div>

        </div>

      </section>


      {/* 7. BEFORE & AFTER GALLERY SECTION */}
      <section id="gallery" className="relative py-24 bg-brand-navy/15 overflow-hidden">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <div className="inline-flex items-center gap-2 text-brand-gold text-xs font-bold uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-gold"></span>
              WITNESS THE TRANSFORMATION
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              Before & After <span className="text-gold-metallic">Gallery</span>
            </h2>
            <p className="text-gray-400 text-sm font-light">
              Interactive split sliders showing the breathtaking results of our paint correction and restoration.
            </p>
          </div>

          {/* Tabbed Category Navigation (Desktop Only) */}
          <div className="hidden md:flex flex-wrap justify-center gap-3 mb-12">
            {[
              { id: 'foam', label: 'Foam Wash' },
              { id: 'interior', label: 'Interior Cleaning' },
              { id: 'ceramic', label: 'Ceramic Coating' },
              { id: 'polishing', label: 'Paint Polishing' },
              { id: 'restoration', label: 'Restoration' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setGalleryTab(tab.id)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-all duration-300 active:scale-95 ${galleryTab === tab.id
                    ? 'bg-brand-gold text-brand-black border-brand-gold shadow-[0_0_15px_rgba(212,162,76,0.3)]'
                    : 'bg-transparent text-gray-400 border-white/10 hover:text-white hover:border-white/30'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Interactive Slider Display (Desktop Only) */}
          <div className="hidden md:grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

            {/* Left side text explanation */}
            <div className="lg:col-span-4 space-y-6 text-left">
              <div className="inline-flex items-center gap-1 bg-brand-red/10 border border-brand-red/35 px-3 py-1 rounded text-[10px] uppercase font-bold text-brand-red tracking-widest">
                Real Correction Result
              </div>
              <h3 className="text-2xl font-black text-white leading-tight">
                {beforeAfterData[galleryTab].title}
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed font-light">
                {beforeAfterData[galleryTab].desc}
              </p>
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <CheckCircle className="w-4 h-4 text-brand-gold" />
                  <span>Restores factory gloss & depth</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <CheckCircle className="w-4 h-4 text-brand-gold" />
                  <span>Eliminates swirl marks & oxidation</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <CheckCircle className="w-4 h-4 text-brand-gold" />
                  <span>Protected with premium German sealant</span>
                </div>
              </div>
              <div className="pt-4">
                <button
                  onClick={() => handleBookService(beforeAfterData[galleryTab].title)}
                  className="px-6 py-3 rounded-full bg-white hover:bg-brand-gold text-brand-black font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center gap-2"
                >
                  Request Similar Service
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right side slider component */}
            <div className="lg:col-span-8 w-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={galleryTab}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                >
                  <BeforeAfterSlider
                    beforeImage={beforeAfterData[galleryTab].before}
                    afterImage={beforeAfterData[galleryTab].after}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

          </div>

          {/* Vertical Stacked Layout (Mobile Only) */}
          <div className="flex flex-col gap-14 md:hidden">
            {beforeAfterCategories.map((category) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5 }}
                className="space-y-5 text-left border-b border-white/5 pb-12 last:border-b-0 last:pb-0"
              >
                {/* Category Badge */}
                <div className="inline-flex items-center gap-1.5 bg-brand-red/10 border border-brand-red/35 px-3 py-1 rounded text-[10px] uppercase font-bold text-brand-red tracking-widest">
                  {category.badge}
                </div>

                {/* Category Title & Description */}
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-white leading-tight">
                    {category.title}
                  </h3>
                  <p className="text-gray-300 text-xs leading-relaxed font-light">
                    {category.desc}
                  </p>
                </div>

                {/* Before / After Slider */}
                <div className="w-full">
                  <BeforeAfterSlider
                    beforeImage={category.before}
                    afterImage={category.after}
                  />
                </div>

                {/* Key Benefits */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-[10px] uppercase tracking-widest font-bold text-brand-gold">Key Benefits</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {category.benefits.map((benefit, bIdx) => (
                      <div key={bIdx} className="flex items-start gap-2.5 text-xs text-gray-400">
                        <CheckCircle className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <div className="pt-2">
                  <button
                    onClick={() => handleBookService(category.title)}
                    className="w-full py-3.5 rounded-xl bg-white hover:bg-brand-gold text-brand-black font-bold text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 active:scale-95"
                  >
                    Request Similar Service
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

              </motion.div>
            ))}
          </div>

        </div>

      </section>


      {/* 8. TESTIMONIALS SECTION */}
      <section className="relative py-24 bg-brand-black overflow-hidden border-t border-b border-white/5">

        {/* Glowing backdrop elements */}
        <div className="absolute left-[15%] top-1/2 -translate-y-1/2 w-80 h-80 bg-brand-red/5 rounded-full blur-[90px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <div className="inline-flex items-center gap-2 text-brand-red text-xs font-bold uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-red"></span>
              REVIEWS FROM SATISFIED CLIENTS
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              What Car Owners <span className="text-gold-metallic">Are Saying</span>
            </h2>
          </div>

          {/* Testimonial Carousel */}
          <div className="max-w-4xl mx-auto relative px-4">

            <div className="relative h-[250px] sm:h-[220px] md:h-[180px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                {testimonials.map((test, index) => {
                  if (index !== currentTestimonial) return null;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.4 }}
                      className="absolute w-full text-center space-y-5"
                    >
                      {/* Rating Stars */}
                      <div className="flex justify-center gap-1.5">
                        {[...Array(test.stars)].map((_, sIdx) => (
                          <Star key={sIdx} className="w-5 h-5 fill-brand-gold text-brand-gold" />
                        ))}
                      </div>

                      {/* Quote Text */}
                      <blockquote className="text-base sm:text-lg md:text-xl font-light italic text-gray-200 leading-relaxed max-w-3xl mx-auto">
                        "{test.text}"
                      </blockquote>

                      {/* Author Details */}
                      <div>
                        <cite className="not-italic text-sm sm:text-base font-bold text-brand-gold tracking-wide">
                          {test.name}
                        </cite>
                        <span className="text-xs text-gray-500 block sm:inline sm:ml-2">
                          ({test.car} &bull; {test.role})
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Carousel Navigation Dot Indicators */}
            <div className="flex justify-center gap-2.5 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${currentTestimonial === index
                      ? 'bg-brand-gold w-6 shadow-[0_0_8px_rgba(212,162,76,0.8)]'
                      : 'bg-white/20 hover:bg-white/40'
                    }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

          </div>

        </div>

      </section>


      {/* 9. CALL TO ACTION (CTA) SECTION */}
      <section className="relative py-24 bg-brand-navy overflow-hidden">

        {/* Parallax background */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1542282088-fe8426682b8f?q=80&w=1200&auto=format&fit=crop"
            alt="Sports car detailed paint reflections"
            className="w-full h-full object-cover filter brightness-[0.2]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-navy/90 to-brand-black/70"></div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">

          <div className="inline-flex items-center gap-2 bg-brand-gold/15 border border-brand-gold/30 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest text-brand-gold shadow-[0_0_15px_rgba(212,162,76,0.15)]">
            EXCLUSIVE WÜRTH CERTIFICATE TREATMENT
          </div>

          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-none">
            Give Your Car The <br className="sm:hidden" />
            <span className="text-gold-metallic">Care It Deserves</span>
          </h2>

          <p className="text-gray-300 text-sm sm:text-base font-light max-w-2xl mx-auto leading-relaxed">
            Protect your automotive investment. Book a professional detailing, ceramic coating, or graphene treatment with Salem's WÜRTH partner today.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
            <a
              href="tel:+918300044406"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white hover:bg-brand-gold text-brand-black font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
            >
              <Phone className="w-4 h-4 text-brand-red fill-current" />
              Call Now
            </a>
            <a
              href="https://wa.me/918300044406"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-brand-gold hover:bg-white text-brand-black font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 shadow-[0_0_20px_rgba(212,162,76,0.4)]"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.333 4.993L2 22l5.233-1.371a9.944 9.944 0 0 0 4.773 1.218h.004c5.505 0 9.99-4.478 9.99-9.985C22.007 6.476 17.519 2 12.012 2zm5.727 14.18c-.237.667-1.377 1.272-1.9 1.325-.5.05-1.155.074-1.848-.15-2.883-.935-4.898-3.793-5.04-3.987-.144-.194-1.176-1.564-1.176-2.984 0-1.42.742-2.115 1.006-2.395.263-.28.577-.35.77-.35h.55c.176 0 .411.008.6.452.195.46.666 1.626.724 1.745.058.12.097.258.018.416-.08.158-.12.258-.238.396-.118.14-.249.31-.355.417-.119.12-.244.25-.105.49.139.239.619 1.018 1.327 1.65.91.81 1.674 1.06 1.91 1.18.236.12.373.1.512-.06.139-.16.6-1.02.76-1.37.158-.35.316-.29.535-.21.219.08 1.39.654 1.63.774.24.12.4.18.458.28.058.1.058.58-.18 1.25z" />
              </svg>
              WhatsApp Enquiry
            </a>
          </div>

        </div>

      </section>


      {/* 10. CONTACT SECTION */}
      <section id="contact" className="relative py-24 bg-brand-black overflow-hidden">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

            {/* Left Column: Contact Information */}
            <div className="lg:col-span-5 space-y-8 text-left">

              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 text-brand-gold text-xs font-bold uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-gold"></span>
                  GET IN TOUCH
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  Contact Information
                </h2>
                <p className="text-gray-400 text-xs sm:text-sm font-light">
                  Visit our studio in Salem or reach out for packages, pricing, and scheduling.
                </p>
              </div>

              {/* Contact Cards */}
              <div className="space-y-5">

                {/* Address */}
                <div className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-brand-gold/20 transition-all duration-300">
                  <div className="w-10 h-10 rounded-lg bg-brand-navy flex items-center justify-center shrink-0 border border-white/10">
                    <MapPin className="w-5 h-5 text-brand-gold" />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase font-bold tracking-wider text-gray-400">Our Studio Address</h4>
                    <p className="text-sm text-gray-200 mt-1 font-light leading-relaxed">
                      SF No. 259, Rasi Nagar, Jagirammalayam,<br />
                      Steel Plant Main Road, Salem - 636302
                    </p>
                    <a
                      href="https://maps.app.goo.gl/8Z86n6mShjipkyhT8"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-brand-blue hover:text-white transition-colors mt-2 uppercase font-bold tracking-wider"
                    >
                      Find us on Google Maps
                      <ChevronRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Phones */}
                <div className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-brand-gold/20 transition-all duration-300">
                  <div className="w-10 h-10 rounded-lg bg-brand-navy flex items-center justify-center shrink-0 border border-white/10">
                    <Phone className="w-5 h-5 text-brand-red" />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase font-bold tracking-wider text-gray-400">Phone Numbers</h4>
                    <div className="mt-1 flex flex-col gap-1">
                      <a href="tel:+918300044406" className="text-sm text-gray-200 hover:text-brand-gold transition-colors font-medium">
                        +91 83000 44406
                      </a>
                      <a href="tel:+917904038418" className="text-sm text-gray-200 hover:text-brand-gold transition-colors font-medium">
                        +91 79040 38418
                      </a>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-brand-gold/20 transition-all duration-300">
                  <div className="w-10 h-10 rounded-lg bg-brand-navy flex items-center justify-center shrink-0 border border-white/10">
                    <Mail className="w-5 h-5 text-brand-blue" />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase font-bold tracking-wider text-gray-400">Email Address</h4>
                    <a href="mailto:Shastaautotech@gmail.com" className="text-sm text-gray-200 hover:text-brand-gold transition-colors block mt-1 font-light">
                      Shastaautotech@gmail.com
                    </a>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-brand-gold/20 transition-all duration-300">
                  <div className="w-10 h-10 rounded-lg bg-brand-navy flex items-center justify-center shrink-0 border border-white/10">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase font-bold tracking-wider text-gray-400">Business Hours</h4>
                    <p className="text-sm text-gray-200 mt-1 font-light">
                      Monday - Saturday: <span className="font-semibold text-brand-gold">9:00 AM - 7:00 PM</span><br />
                      Sunday: <span className="text-brand-red font-medium">Closed</span>
                    </p>
                  </div>
                </div>

              </div>

            </div>

            {/* Right Column: Enquiry Form */}
            <div className="lg:col-span-7">

              <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-white/5 glow-gold relative overflow-hidden">

                {/* Gold Highlight Line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-red via-brand-gold to-brand-blue"></div>

                <h3 className="text-2xl font-bold text-white tracking-tight mb-2">
                  Request a Free Callback
                </h3>
                <p className="text-xs text-gray-400 mb-8 font-light leading-relaxed">
                  Fill in your vehicle details and required service. Submitting this form will construct your message and open WhatsApp to directly text our specialist.
                </p>

                <form onSubmit={handleFormSubmit} className="space-y-5">

                  {/* Name field */}
                  <div>
                    <label htmlFor="name" className="block text-xs uppercase tracking-wider font-bold text-gray-400 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your name"
                      className="w-full bg-white/5 border border-white/10 focus:border-brand-gold rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-all duration-300"
                    />
                  </div>

                  {/* Phone and Vehicle Model Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="phone" className="block text-xs uppercase tracking-wider font-bold text-gray-400 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="Enter your phone number"
                        className="w-full bg-white/5 border border-white/10 focus:border-brand-gold rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label htmlFor="vehicleModel" className="block text-xs uppercase tracking-wider font-bold text-gray-400 mb-2">
                        Vehicle Model *
                      </label>
                      <input
                        type="text"
                        id="vehicleModel"
                        required
                        value={formData.vehicleModel}
                        onChange={(e) => setFormData(prev => ({ ...prev, vehicleModel: e.target.value }))}
                        placeholder="e.g. BMW 3 Series, Creta, Swift"
                        className="w-full bg-white/5 border border-white/10 focus:border-brand-gold rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-all duration-300"
                      />
                    </div>
                  </div>

                  {/* Required Service Dropdown */}
                  <div>
                    <label htmlFor="service" className="block text-xs uppercase tracking-wider font-bold text-gray-400 mb-2">
                      Required Service *
                    </label>
                    <select
                      id="service"
                      required
                      value={formData.service}
                      onChange={(e) => setFormData(prev => ({ ...prev, service: e.target.value }))}
                      className="w-full bg-brand-black border border-white/10 focus:border-brand-gold rounded-xl px-4 py-3 text-sm text-white outline-none transition-all duration-300 appearance-none cursor-pointer"
                    >
                      <option value="" disabled className="text-gray-500">Select a service</option>
                      <option value="Foam Wash">Foam Wash</option>
                      <option value="Interior Detailing">Interior Detailing</option>
                      <option value="Steam Cleaning">Steam Cleaning</option>
                      <option value="Exterior Detailing">Exterior Detailing</option>
                      <option value="Rubbing & Polishing">Rubbing & Polishing</option>
                      <option value="Ceramic Coating">Ceramic Coating</option>
                      <option value="Graphene Coating">Graphene Coating</option>
                      <option value="Modification & Restoration">Modification & Restoration</option>
                      <option value="Other / Enquiry">Other / General Enquiry</option>
                    </select>
                  </div>

                  {/* Message field */}
                  <div>
                    <label htmlFor="message" className="block text-xs uppercase tracking-wider font-bold text-gray-400 mb-2">
                      Your Message / Requirements
                    </label>
                    <textarea
                      id="message"
                      rows="4"
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Describe any specific requirements or details about your car's paint condition..."
                      className="w-full bg-white/5 border border-white/10 focus:border-brand-gold rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-all duration-300 resize-none"
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-4 rounded-xl bg-brand-gold hover:bg-white text-brand-black font-bold text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 shadow-[0_0_20px_rgba(212,162,76,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.4)]"
                    >
                      <Mail className="w-5 h-5" />
                      Send Email Enquiry
                    </button>
                  </div>

                </form>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* 11. FOOTER */}
      <footer className="relative bg-[#070707] pt-20 pb-10 border-t border-white/5">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-white/5">

            {/* Col 1: Brand details */}
            <div className="lg:col-span-5 space-y-6 text-left">
              <div className="flex flex-col gap-3 items-start cursor-pointer" onClick={() => scrollToSection('home')}>
                <img 
                  src="/shasta-title_1.png" 
                  alt="Shasta Auto Tech" 
                  className="h-18 sm:h-20 w-auto object-contain transition-all duration-300 filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)] hover:scale-[1.02]"
                />
              </div>
              <p className="text-gray-400 text-xs sm:text-sm font-light max-w-sm leading-relaxed">
                Salem's premier destination for professional automotive detailing, paint correction, ceramic coatings, and restoration services. Authorized WÜRTH Partner.
              </p>

              {/* Partner emblem */}
              <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl">
                <div className="w-8 h-8 rounded bg-brand-red flex items-center justify-center font-black text-white text-sm">
                  W
                </div>
                <div className="text-left">
                  <h5 className="text-[10px] font-bold text-white uppercase tracking-wider leading-none">WÜRTH PARTNER</h5>
                  <span className="text-[9px] text-gray-400">Authorized Service Center</span>
                </div>
              </div>
            </div>

            {/* Col 2: Quick Links */}
            <div className="lg:col-span-2 text-left space-y-4">
              <h4 className="text-xs uppercase tracking-wider font-bold text-white">Quick Links</h4>
              <ul className="space-y-2.5">
                {['home', 'about', 'services', 'why-choose-us', 'gallery', 'contact'].map((section) => (
                  <li key={section}>
                    <button
                      onClick={() => scrollToSection(section)}
                      className="text-xs text-gray-400 hover:text-brand-gold transition-colors uppercase tracking-wider"
                    >
                      {section.replace(/-/g, ' ')}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3: Services Links */}
            <div className="lg:col-span-2 text-left space-y-4">
              <h4 className="text-xs uppercase tracking-wider font-bold text-white">Our Services</h4>
              <ul className="space-y-2.5">
                {services.map((serv) => (
                  <li key={serv.id}>
                    <button
                      onClick={() => handleBookService(serv.title)}
                      className="text-xs text-gray-400 hover:text-brand-gold transition-colors text-left"
                    >
                      {serv.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 4: Contact details */}
            <div className="lg:col-span-3 text-left space-y-4">
              <h4 className="text-xs uppercase tracking-wider font-bold text-white">Contact Info</h4>
              <ul className="space-y-3">
                <li className="flex gap-2.5 text-xs text-gray-400 font-light leading-relaxed">
                  <MapPin className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                  <span>
                    SF No. 259, Rasi Nagar,<br />
                    Jagirammalayam, Salem - 636302
                  </span>
                </li>
                <li className="flex gap-2.5 text-xs text-gray-400 font-light">
                  <Phone className="w-4 h-4 text-brand-red shrink-0" />
                  <a href="tel:+918300044406" className="hover:text-brand-gold transition-colors">
                    +91 83000 44406
                  </a>
                </li>
                <li className="flex gap-2.5 text-xs text-gray-400 font-light">
                  <Mail className="w-4 h-4 text-brand-blue shrink-0" />
                  <a href="mailto:Shastaautotech@gmail.com" className="hover:text-brand-gold transition-colors">
                    Shastaautotech@gmail.com
                  </a>
                </li>
              </ul>
            </div>

          </div>

          {/* Bottom section */}
          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">

            <p className="text-[11px] text-gray-500 font-light">
              &copy; 2026 Shasta Auto Tech. All Rights Reserved. Specializing in professional car detailing, ceramic & graphene coatings in Salem.
            </p>

            {/* Social Icons / Tags */}
            <div className="flex gap-4">
              <span className="text-[10px] uppercase font-bold tracking-widest text-brand-red bg-brand-red/10 border border-brand-red/20 px-3 py-1 rounded">
                WÜRTH Partner
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-brand-gold bg-brand-gold/10 border border-brand-gold/20 px-3 py-1 rounded">
                Salem, TN
              </span>
            </div>

          </div>

        </div>

      </footer>

    </div>
  );
}
