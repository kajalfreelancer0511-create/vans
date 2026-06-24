import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, AnimatePresence } from 'framer-motion';

// --- DATA DEFINITIONS ---

const PERSONALITY_TRAITS = [
  { name: "Creative", icon: "🎨", desc: "Always thinking of colorful new ideas!", color: "bg-pastelPink text-themePink border-themePink" },
  { name: "Friendly", icon: "🤝", desc: "Loves to say hello and play with everyone!", color: "bg-pastelBlue text-themeBlue border-themeBlue" },
  { name: "Talkative", icon: "💬", desc: "Has a billion happy stories to share!", color: "bg-pastelPurple text-themePurple border-themePurple" },
  { name: "Curious Learner", icon: "🔍", desc: "Asks 'why' and loves exploring new things!", color: "bg-pastelYellow text-amber-700 border-themeYellow" },
  { name: "Family Favorite", icon: "💖", desc: "The sweet heart who makes everyone smile!", color: "bg-pink-50 text-pink-600 border-pink-300" },
  { name: "Confident", icon: "✨", desc: "Ready to stand tall and speak up bravely!", color: "bg-pastelGreen text-themeGreen border-themeGreen" },
  { name: "Fun Loving", icon: "🎉", desc: "Every single day is a brand new game!", color: "bg-orange-50 text-orange-600 border-orange-300" }
];

const FAVORITE_FOODS = [
  { name: "Rajma Chawal", img: "🍛", desc: "A yummy classic! Creamy kidney beans served with hot steaming rice. Simply delicious!", color: "from-amber-200 to-red-100" },
  { name: "Idli", img: "🍽️", desc: "Soft, fluffy, and steaming hot rice cakes, served with delicious coconut chutney!", color: "from-blue-100 to-purple-100" },
  { name: "Dosa", img: "🥞", desc: "Super crispy, golden crêpe filled with tasty potato masala. Yum!", color: "from-yellow-100 to-orange-100" }
];

const CREATIVE_WORLD = [
  { title: "Colorful Birthday Card", category: "Drawings", src: "public/images/media__1782208755758.jpg", desc: "A colorful card hand-painted with bright balloons, gifts, and a delicious chocolate cake." },
  { title: "Sweet Ice Cream Cone", category: "3D Pen Projects", src: "public/images/media__1782208447726.jpg", desc: "A 3D model created using layers of colorful pen filaments showing a strawberry, banana, and orange flavored cone." },
  { title: "Toy Castle & Friends", category: "School Projects", src: "public/images/media__1782208447683.jpg", desc: "Exploring creative setups with panda toys and a classic toy soldier nutcracker." },
  { title: "Fun Couch Chats", category: "Fun Times", src: "public/images/media__1782208755769.jpg", desc: "Creating silly poses and laughing together with my brother." },
  { title: "School Holiday Smiles", category: "School Days", src: "public/images/media__1782208756003.jpg", desc: "Dressed up and ready for school celebrations and competitions." }
];

const THREE_D_PEN_CREATIONS = [
  { title: "Three-Flavored Ice Cream Cone", src: "public/images/media__1782208447726.jpg", desc: "Created using layers of red, yellow, and orange filaments. Features a textured design that makes the ice cream look real!", difficulty: "⭐⭐⭐⭐⭐", tools: "3D Pen, PLA Filament" },
  { title: "Doodle Scribble Art", src: "public/images/media__1782208755758.jpg", desc: "An artistic design blending traditional color drawing with 3D pen borders.", difficulty: "⭐⭐⭐⭐", tools: "Sketch Pens, 3D Outlines" }
];

const MEMORIES_GALLERY = [
  { src: "public/images/media__1782208447642.jpg", category: "Family Moments", caption: "Sweet smiles with Mom and Brother on the couch" },
  { src: "public/images/media__1782208447683.jpg", category: "Fun Times", caption: "Playing with giant panda and nutcracker models" },
  { src: "public/images/media__1782208447726.jpg", category: "3D Pen Projects", caption: "My handmade wobbly 3D pen ice cream cone" },
  { src: "public/images/media__1782208755758.jpg", category: "Art Creations", caption: "Birthday card drawing with candles and balloons" },
  { src: "public/images/media__1782208755769.jpg", category: "Birthday Celebrations", caption: "Cozy family stories on the bed" },
  { src: "public/images/media__1782208755851.jpg", category: "Family Moments", caption: "Smiling together in matching blue outfits" },
  { src: "public/images/media__1782208756003.jpg", category: "Skating Adventures", caption: "Funny expressions and high energy celebrations" }
];

const FUN_FACTS = [
  "I love eating yummy Rajma Chawal on lazy Sundays! 🍛",
  "I enjoy soft fluffy Idli and crispy Dosa with coconut chutney! 🥞",
  "I can construct real 3D objects in the air using my magical 3D pen! ✍️🎨",
  "I love gliding fast on my wheels during skating adventures! 🛼",
  "I can make friends in less than 5 minutes by talking and sharing stories! 💬🤝",
  "Spending quality time with my family makes me the happiest girl ever! 💖",
  "I love sketching, coloring, and crafting birthday cards for my loved ones! 🎨✂️"
];

// --- APP COMPONENT ---

function App() {
  const [activeGalleryTab, setActiveGalleryTab] = useState("All");
  const [lightboxImageIndex, setLightboxImageIndex] = useState(null);
  const [lightboxGallery, setLightboxGallery] = useState([]);
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [confettis, setConfettis] = useState([]);
  const [wishes, setWishes] = useState([
    { name: "Mom & Papa", message: "Keep smiling and shining bright, our sweet little star! We love you so much! ❤️", sticker: "🎂", date: "June 23, 2026" },
    { name: "Arjun Bhaiyya", message: "You are the best sister! Don't eat all my chocolates! 🍫✨", sticker: "⭐", date: "June 23, 2026" }
  ]);
  const [newWishName, setNewWishName] = useState("");
  const [newWishMessage, setNewWishMessage] = useState("");
  const [newWishSticker, setNewWishSticker] = useState("🎈");
  const [isWishesModalOpen, setIsWishesModalOpen] = useState(false);

  // Background floating objects state
  const [floaters, setFloaters] = useState([]);

  useEffect(() => {
    // Generate background floating items (stars, flowers, butterflies)
    const icons = ["⭐", "🦋", "🌸", "🎈", "✨", "🎨", "🖍️", "🌈", "🍦"];
    const generated = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      icon: icons[i % icons.length],
      left: Math.random() * 95,
      top: Math.random() * 85 + 5,
      size: Math.random() * 20 + 20, // 20px to 40px
      delay: Math.random() * 5,
      duration: Math.random() * 10 + 10, // 10s to 20s
      direction: Math.random() > 0.5 ? 'animate-float' : 'animate-float-reverse'
    }));
    setFloaters(generated);

    // Birthday countdown interval
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Load wishes from localStorage if they exist
    const savedWishes = localStorage.getItem('vanshika_wishes');
    if (savedWishes) {
      try {
        setWishes(JSON.parse(savedWishes));
      } catch (e) {
        console.error(e);
      }
    }

    return () => clearInterval(timer);
  }, []);

  // Countdown function
  function calculateTimeLeft() {
    const currentYear = new Date().getFullYear();
    let targetDate = new Date(`July 2, ${currentYear} 00:00:00`);
    const now = new Date();
    
    // If July 2nd has passed this year, countdown to next year
    if (now > targetDate) {
      targetDate = new Date(`July 2, ${currentYear + 1} 00:00:00`);
    }
    
    const diff = targetDate - now;
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / 1000 / 60) % 60),
      seconds: Math.floor((diff / 1000) % 60),
      isBirthdayToday: now.getMonth() === 6 && now.getDate() === 2
    };
  }

  // Trigger interactive confetti bursts
  const triggerConfetti = (e) => {
    const x = e ? e.clientX : window.innerWidth / 2;
    const y = e ? e.clientY : window.innerHeight / 2;
    const colors = ['#FF69B4', '#4FC3F7', '#BA68C8', '#FFD54F', '#81C784', '#FF9800'];
    
    const newParticles = Array.from({ length: 40 }).map((_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 15 + 5;
      const size = Math.random() * 10 + 6;
      return {
        id: Date.now() + i,
        x,
        y,
        color: colors[Math.floor(Math.random() * colors.length)],
        style: {
          left: `${x}px`,
          top: `${y}px`,
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: colors[Math.floor(Math.random() * colors.length)],
          borderRadius: Math.random() > 0.5 ? '50%' : '0px',
          transform: `translate(${(Math.cos(angle) * velocity * 10)}px, ${(Math.sin(angle) * velocity * 10)}px) rotate(${Math.random() * 360}deg)`,
          opacity: 0,
          transition: 'all 0.8s cubic-bezier(0.1, 0.8, 0.3, 1)'
        }
      };
    });

    setConfettis((prev) => [...prev, ...newParticles]);
    
    // Cleanup particles
    setTimeout(() => {
      setConfettis((prev) => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 1000);
  };

  // Add wish to wishes wall
  const handleAddWish = (e) => {
    e.preventDefault();
    if (!newWishName.trim() || !newWishMessage.trim()) return;
    
    const today = new Date();
    const dateString = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    
    const newWish = {
      name: newWishName.trim(),
      message: newWishMessage.trim(),
      sticker: newWishSticker,
      date: dateString
    };

    const updatedWishes = [newWish, ...wishes];
    setWishes(updatedWishes);
    localStorage.setItem('vanshika_wishes', JSON.stringify(updatedWishes));
    
    // Reset form and close modal
    setNewWishName("");
    setNewWishMessage("");
    setNewWishSticker("🎈");
    setIsWishesModalOpen(false);
    
    // Trigger confetti celebrating new post!
    triggerConfetti();
  };

  // Lightbox handlers
  const openLightbox = (index, list) => {
    setLightboxGallery(list);
    setLightboxImageIndex(index);
  };

  const navigateLightbox = (direction) => {
    if (lightboxImageIndex === null) return;
    let nextIndex = lightboxImageIndex + direction;
    if (nextIndex < 0) nextIndex = lightboxGallery.length - 1;
    if (nextIndex >= lightboxGallery.length) nextIndex = 0;
    setLightboxImageIndex(nextIndex);
  };

  // Filter memories gallery
  const filteredMemories = activeGalleryTab === "All"
    ? MEMORIES_GALLERY
    : MEMORIES_GALLERY.filter(item => item.category === activeGalleryTab);

  const galleryTabs = ["All", "Family Moments", "School Days", "Fun Times", "Birthday Celebrations", "Art Creations", "3D Pen Projects", "Skating Adventures"];

  return (
    <div className="relative min-h-screen pb-12 overflow-hidden selection:bg-themePink selection:text-white">
      
      {/* Dynamic Confetti Explosion Container */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {confettis.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-sm animate-ping"
            style={particle.style}
          />
        ))}
      </div>

      {/* Floating Sparkles and Doodles Layer */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none opacity-40">
        {floaters.map((floater) => (
          <div
            key={floater.id}
            className={`absolute ${floater.direction} font-bold select-none transition-transform`}
            style={{
              left: `${floater.left}%`,
              top: `${floater.top}%`,
              fontSize: `${floater.size}px`,
              animationDelay: `${floater.delay}s`,
              animationDuration: `${floater.duration}s`
            }}
          >
            {floater.icon}
          </div>
        ))}
      </div>

      {/* --- SITE HEADER & NAVIGATION --- */}
      <header className="relative z-10 max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3 cursor-pointer group" onClick={triggerConfetti}>
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-themePink via-themePurple to-themeBlue flex items-center justify-center text-white text-2xl font-bold shadow-md transform group-hover:rotate-12 transition-transform duration-300">
            VB
          </div>
          <span className="font-fredoka text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-themePink to-themePurple">
            Vanshika's Scrapbook
          </span>
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#about" className="font-fredoka text-gray-700 hover:text-themePink transition-colors text-lg">About Me</a>
          <a href="#creative" className="font-fredoka text-gray-700 hover:text-themePink transition-colors text-lg">My Creations</a>
          <a href="#skating" className="font-fredoka text-gray-700 hover:text-themePink transition-colors text-lg">Skating</a>
          <a href="#birthday" className="font-fredoka text-gray-700 hover:text-themePink transition-colors text-lg">Birthday Countdown</a>
          <a href="#gallery" className="font-fredoka text-gray-700 hover:text-themePink transition-colors text-lg">Gallery</a>
          <button 
            onClick={() => setIsWishesModalOpen(true)}
            className="btn-wobbly bg-themePink text-white font-fredoka font-semibold px-5 py-2 hover:bg-pink-600 transition-colors shadow-md text-base"
          >
            <i className="fa-solid fa-paper-plane mr-2"></i>Wish Me!
          </button>
        </nav>
      </header>

      {/* --- HERO SECTION --- */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-12 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Side: Text and Intro */}
        <div className="lg:col-span-7 text-center lg:text-left space-y-6">
          <div className="inline-flex items-center space-x-2 bg-pink-100 border-2 border-dashed border-themePink text-themePink px-4 py-1.5 rounded-full font-fredoka font-medium text-sm animate-pulse">
            <span>🎉 Study in Class 5 • 9 Years Old 🎉</span>
          </div>
          <h1 className="font-fredoka text-5xl md:text-7xl font-extrabold text-gray-800 leading-tight">
            Hi, I'm <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-themePink via-themePurple to-themeBlue">
              Vanshika Bansal
            </span>
          </h1>
          <p className="font-comfortaa text-xl md:text-2xl font-bold text-themePurple italic tracking-wide">
            "Dream Big • Create More • Smile Always"
          </p>
          <p className="font-outfit text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl">
            Hello! I am Vanshika Bansal. I am 9 years old and studying in Class 5 at <strong className="text-gray-800">St. John's Senior Secondary School, Firozabad</strong>. I love creating art, making amazing 3D pen models, talking with everyone around me, and spreading happiness wherever I go.
          </p>
          <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
            <a 
              href="#creative" 
              className="btn-wobbly bg-themePink text-white font-fredoka font-semibold px-8 py-4 text-lg shadow-lg hover:bg-pink-600 transition-all flex items-center space-x-2"
            >
              <span>🎨 Explore My Art</span>
            </a>
            <button 
              onClick={triggerConfetti} 
              className="btn-wobbly bg-themeBlue text-white font-fredoka font-semibold px-8 py-4 text-lg shadow-lg hover:bg-cyan-500 transition-all flex items-center space-x-2"
            >
              <span>✨ Throw Confetti!</span>
            </button>
          </div>
        </div>

        {/* Right Side: Large Polaroid Photo */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative">
            {/* Background elements */}
            <div className="absolute -top-6 -left-6 w-16 h-16 bg-themeYellow rounded-full animate-float opacity-75 flex items-center justify-center text-3xl shadow-sm">⭐</div>
            <div className="absolute -bottom-8 -right-6 w-16 h-16 bg-themeGreen rounded-full animate-float-reverse opacity-75 flex items-center justify-center text-3xl shadow-sm">🦋</div>
            
            <div className="polaroid-card max-w-[340px] transform -rotate-2 hover:rotate-0 transition-transform duration-500 border border-gray-200">
              <div className="overflow-hidden rounded-md aspect-[4/5] bg-gray-100">
                <img 
                  src="public/images/media__1782208447642.jpg" 
                  alt="Vanshika Bansal smiling" 
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500'; }}
                />
              </div>
              <div className="mt-4 text-center">
                <p className="handwritten text-4xl text-themePink font-bold">Vanshika Bansal</p>
                <p className="font-fredoka text-sm text-gray-500 mt-1">Class 5th Student 🎒</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- ABOUT ME SECTION --- */}
      <section id="about" className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        <div className="text-center space-y-3 mb-12">
          <span className="text-4xl">🌻</span>
          <h2 className="font-fredoka text-4xl md:text-5xl font-bold text-gray-800">All About Me</h2>
          <p className="font-comfortaa text-gray-500 max-w-xl mx-auto">Get to know the girl behind the colors! Here are some fun facts about my school life and personality.</p>
        </div>

        {/* Notebook-styled layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left Page: Personal Details */}
          <div className="notebook-paper p-8 pt-10 pl-24 border border-gray-200 min-h-[450px] flex flex-col justify-between">
            <div>
              <h3 className="font-fredoka text-3xl font-bold text-themePink border-b-2 border-dashed border-pink-200 pb-2 mb-6">
                My Profile Book 📖
              </h3>
              
              <ul className="space-y-6 font-comfortaa text-lg text-gray-700 font-medium">
                <li className="flex items-center space-x-3">
                  <span className="text-2xl">🏷️</span>
                  <span><strong>Full Name:</strong> Vanshika Bansal</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-2xl">📅</span>
                  <span><strong>Birth Year:</strong> 2016</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-2xl">🎂</span>
                  <span><strong>Birthday:</strong> 2 July (9 Years Old)</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-2xl">🏫</span>
                  <span><strong>School:</strong> St. John's Senior Sec. School</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-2xl">🎒</span>
                  <span><strong>Class:</strong> 5th Standard</span>
                </li>
              </ul>
            </div>
            
            <div className="mt-8 pt-4 border-t border-dashed border-gray-200 flex justify-between items-center text-sm text-gray-400">
              <span>Firozabad, Uttar Pradesh 📍</span>
              <span className="handwritten text-xl font-bold text-themePink">Vanshika's Diary</span>
            </div>
          </div>

          {/* Right Page: Personality Traits */}
          <div className="space-y-6">
            <h3 className="font-fredoka text-3xl font-bold text-gray-800 flex items-center space-x-2">
              <span>My Super Powers 🌟</span>
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {PERSONALITY_TRAITS.map((trait, index) => (
                <div 
                  key={index} 
                  className={`p-4 rounded-2xl border-2 border-dashed ${trait.color} hover:scale-102 hover:rotate-1 transition-all duration-300 shadow-sm`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{trait.icon}</span>
                    <div>
                      <h4 className="font-fredoka font-bold text-lg">{trait.name}</h4>
                      <p className="font-outfit text-xs opacity-90 mt-0.5">{trait.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* --- FAVORITE THINGS --- */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-16 bg-white rounded-3xl border-2 border-dashed border-gray-200 p-8 shadow-sm">
        <div className="text-center space-y-3 mb-12">
          <span className="text-4xl">🍦</span>
          <h2 className="font-fredoka text-4xl md:text-5xl font-bold text-gray-800">My Favorite Things</h2>
          <p className="font-comfortaa text-gray-500">Delicious treats and comfortable styles that keep me dancing through the day!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Foods Area */}
          <div className="lg:col-span-8 space-y-6">
            <h3 className="font-fredoka text-2xl font-bold text-gray-800 flex items-center space-x-2">
              <span>🍛 Favorite Meals</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {FAVORITE_FOODS.map((food, index) => (
                <div 
                  key={index} 
                  className={`bg-gradient-to-br ${food.color} rounded-2xl p-6 border-2 border-white shadow-sm flex flex-col justify-between items-center text-center transform hover:-translate-y-1.5 transition-transform duration-300`}
                >
                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-4xl shadow-sm mb-4">
                    {food.img}
                  </div>
                  <div>
                    <h4 className="font-fredoka font-bold text-xl text-gray-800">{food.name}</h4>
                    <p className="font-outfit text-sm text-gray-600 mt-2 leading-relaxed">{food.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dress Style Area */}
          <div className="lg:col-span-4 bg-pastelPink rounded-2xl p-6 border-2 border-dashed border-themePink flex flex-col justify-between">
            <div>
              <h3 className="font-fredoka text-2xl font-bold text-themePink flex items-center space-x-2">
                <span>👚 Fashion style</span>
              </h3>
              <p className="font-comfortaa text-sm text-gray-600 mt-2">
                I love outfits that are cool, colorful, and let me move around, skate, and explore!
              </p>
              
              <div className="flex justify-around items-center py-6 mt-4">
                <div className="text-center group">
                  <div className="w-16 h-16 rounded-full bg-white border border-pink-200 flex items-center justify-center text-4xl shadow-sm group-hover:scale-110 transition-transform">
                    👕
                  </div>
                  <span className="font-fredoka font-semibold text-gray-700 text-sm block mt-2">Shirts</span>
                </div>
                <div className="text-2xl text-themePink animate-bounce">+</div>
                <div className="text-center group">
                  <div className="w-16 h-16 rounded-full bg-white border border-pink-200 flex items-center justify-center text-4xl shadow-sm group-hover:scale-110 transition-transform">
                    👖
                  </div>
                  <span className="font-fredoka font-semibold text-gray-700 text-sm block mt-2">Jeans</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-3 border border-pink-200 text-center text-xs text-pink-700 font-medium">
              ✨ Comfy & Playful clothes are my daily go-to!
            </div>
          </div>
        </div>
      </section>

      {/* --- CREATIVE WORLD & 3D PEN GALLERY --- */}
      <section id="creative" className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        <div className="text-center space-y-3 mb-12">
          <span className="text-4xl">🎨</span>
          <h2 className="font-fredoka text-4xl md:text-5xl font-bold text-gray-800">My Creative World</h2>
          <p className="font-comfortaa text-gray-500">I love building, drawing, and bringing stories to life. Tap any artwork to see a detailed explanation!</p>
        </div>

        {/* Art Gallery Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CREATIVE_WORLD.map((item, index) => (
            <div 
              key={index} 
              className="bg-white border-2 border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 group cursor-pointer flex flex-col"
              onClick={() => openLightbox(index, CREATIVE_WORLD)}
            >
              <div className="aspect-[4/3] overflow-hidden bg-gray-50 relative">
                <img 
                  src={item.src} 
                  alt={item.title} 
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500'; }}
                />
                <span className="absolute top-4 left-4 bg-themePink text-white font-fredoka text-xs px-3 py-1 rounded-full shadow-sm">
                  {item.category}
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-fredoka text-xl font-bold text-gray-800 group-hover:text-themePink transition-colors">
                    {item.title}
                  </h3>
                  <p className="font-outfit text-sm text-gray-500 mt-2 line-clamp-2">
                    {item.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-dashed border-gray-100 flex items-center text-xs text-themeBlue font-semibold">
                  <span>View full design <i className="fa-solid fa-arrow-right ml-1"></i></span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 3D Pen Creations Highlights */}
        <div className="mt-20 bg-gradient-to-r from-pastelYellow to-pastelPink rounded-3xl p-8 lg:p-12 border-2 border-dashed border-themeYellow">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="lg:w-7/12 space-y-6">
              <span className="text-xs bg-amber-400 text-amber-950 font-bold px-3 py-1 rounded-full uppercase tracking-wider font-fredoka">
                Highlight Reel 🌟
              </span>
              <h3 className="font-fredoka text-3xl md:text-4xl font-extrabold text-gray-800">
                My Amazing 3D Pen Creations
              </h3>
              <p className="font-outfit text-gray-600 text-lg leading-relaxed">
                Using a 3D pen, I extrude layers of warm colored filaments which cool instantly into shapes. It allows me to build architectural models, colorful food mockups, and toys directly in three-dimensions! It's like sketching in the air!
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-amber-200">
                  <span className="text-xl">🛠️ Tools Used:</span>
                  <p className="font-comfortaa text-sm text-gray-500 mt-1 font-semibold">3D Pen with adjustable heat & multiple PLA colored filaments</p>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-amber-200">
                  <span className="text-xl">🏆 Top Model:</span>
                  <p className="font-comfortaa text-sm text-gray-500 mt-1 font-semibold">Three-Flavored wobbly Ice Cream Cone</p>
                </div>
              </div>
            </div>

            <div className="lg:w-5/12 flex justify-center">
              <div className="polaroid-card transform rotate-3 max-w-[280px] bg-white border border-amber-200">
                <div className="aspect-square overflow-hidden rounded bg-white">
                  <img 
                    src="public/images/media__1782208447726.jpg" 
                    alt="3D pen Ice cream cone model" 
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=500'; }}
                  />
                </div>
                <div className="text-center mt-3 font-fredoka font-bold text-amber-800">
                  My 3D Pen Ice Cream 🍦
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- TALENT CORNER: PUBLIC SPEAKING & SKATING --- */}
      <section id="skating" className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        <div className="text-center space-y-3 mb-12">
          <span className="text-4xl">🌟</span>
          <h2 className="font-fredoka text-4xl md:text-5xl font-bold text-gray-800">My Talent Corner</h2>
          <p className="font-comfortaa text-gray-500">From skating on wheels to telling stories, here are the hobbies I love the most!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          
          {/* Public Speaking & Communication Card */}
          <div className="bg-white rounded-3xl p-8 border-2 border-gray-100 shadow-sm flex flex-col justify-between">
            <div className="space-y-6">
              <div className="w-16 h-16 rounded-full bg-pastelPurple flex items-center justify-center text-4xl text-themePurple shadow-sm">
                📢
              </div>
              <h3 className="font-fredoka text-3xl font-bold text-gray-800">
                Public Speaking & Communication
              </h3>
              <p className="font-outfit text-gray-600 text-lg leading-relaxed">
                Vanshika loves talking, sharing stories, making friends, and bringing energy to every conversation. Whether it's presenting in class, telling jokes to friends, or hosting family gatherings, she is confident and happy to share her thoughts!
              </p>
            </div>
            
            <div className="mt-8 bg-pastelPurple rounded-2xl p-4 border border-purple-200">
              <p className="font-comfortaa text-sm text-themePurple font-semibold italic">
                "Connecting people together with words and smiles is my favorite playground!"
              </p>
            </div>
          </div>

          {/* Skating Card: "Rolling Towards New Adventures" */}
          <div className="bg-gradient-to-br from-pastelBlue to-pastelGreen rounded-3xl p-8 border-2 border-white shadow-md flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-4xl shadow-sm skating-anim">
                  🛼
                </div>
                <span className="text-xs bg-themeBlue text-white font-fredoka font-bold px-3 py-1 rounded-full uppercase">
                  Action Hobby 🛹
                </span>
              </div>
              
              <h3 className="font-fredoka text-3xl font-extrabold text-gray-800">
                Rolling Towards New Adventures
              </h3>
              
              <p className="font-outfit text-gray-600 text-lg leading-relaxed">
                Gliding fast, doing spins, and feeling the breeze! Skating keeps Vanshika fit, strong, and highly energetic. She loves practicing new tricks and race coordinates with her friends in the evenings.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-8">
              <div className="bg-white rounded-xl p-3 text-center border border-sky-100 shadow-sm">
                <span className="text-xl block">⚡</span>
                <span className="font-fredoka text-xs text-gray-500 font-bold">Speed</span>
              </div>
              <div className="bg-white rounded-xl p-3 text-center border border-sky-100 shadow-sm">
                <span className="text-xl block">⚖️</span>
                <span className="font-fredoka text-xs text-gray-500 font-bold">Balance</span>
              </div>
              <div className="bg-white rounded-xl p-3 text-center border border-sky-100 shadow-sm">
                <span className="text-xl block">🔥</span>
                <span className="font-fredoka text-xs text-gray-500 font-bold">Courage</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* --- SCHOOL LIFE SECTION --- */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-16 bg-white rounded-3xl border-2 border-dashed border-gray-200 p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          
          <div className="lg:w-5/12 text-center lg:text-left space-y-6">
            <span className="text-5xl">🎒</span>
            <h2 className="font-fredoka text-4xl md:text-5xl font-bold text-gray-800">My School Life</h2>
            <p className="font-outfit text-gray-600 text-lg leading-relaxed">
              I spend my weekday mornings learning mathematics, science, reading books, and participating in debates. St. John's Senior Secondary School helps us build strong foundations and enjoy extra-curricular activities.
            </p>
            
            <div className="bg-pastelPink rounded-2xl p-6 border-2 border-white shadow-sm inline-block text-left">
              <h4 className="font-fredoka text-lg font-bold text-themePink">🏫 School Details</h4>
              <p className="font-comfortaa text-sm text-gray-700 mt-1">
                <strong>St. John's Senior Secondary School</strong><br />
                Firozabad, Uttar Pradesh
              </p>
            </div>
          </div>

          <div className="lg:w-7/12 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            <div className="bg-pastelYellow rounded-2xl p-6 border-2 border-white shadow-sm hover:scale-102 transition-transform">
              <span className="text-3xl">🤝</span>
              <h4 className="font-fredoka font-bold text-lg text-amber-950 mt-3">School Friendships</h4>
              <p className="font-outfit text-sm text-amber-900 mt-2">Laughing during lunch breaks, sharing crayon boxes, and working on group science assignments.</p>
            </div>
            <div className="bg-pastelBlue rounded-2xl p-6 border-2 border-white shadow-sm hover:scale-102 transition-transform">
              <span className="text-3xl">🏅</span>
              <h4 className="font-fredoka font-bold text-lg text-sky-950 mt-3">Competitions</h4>
              <p className="font-outfit text-sm text-sky-900 mt-2">Participating in creative coloring events, spelling bees, and local school debates.</p>
            </div>
            <div className="bg-pastelPurple rounded-2xl p-6 border-2 border-white shadow-sm hover:scale-102 transition-transform">
              <span className="text-3xl">🎭</span>
              <h4 className="font-fredoka font-bold text-lg text-purple-950 mt-3">Classroom Activities</h4>
              <p className="font-outfit text-sm text-purple-900 mt-2">Dressing up for school annual days and organizing student assemblies.</p>
            </div>
            <div className="bg-pastelGreen rounded-2xl p-6 border-2 border-white shadow-sm hover:scale-102 transition-transform">
              <span className="text-3xl">🎨</span>
              <h4 className="font-fredoka font-bold text-lg text-emerald-950 mt-3">Creative Workshops</h4>
              <p className="font-outfit text-sm text-emerald-900 mt-2">Making models using colored sheets, clay, and experimenting with recycled plastics.</p>
            </div>
          </div>

        </div>
      </section>

      {/* --- FAMILY LOVE SECTION --- */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        <div className="text-center space-y-3 mb-12">
          <span className="text-4xl">❤️</span>
          <h2 className="font-fredoka text-4xl md:text-5xl font-bold text-gray-800">The Heart of Our Family</h2>
          <p className="font-comfortaa text-gray-500">Love, laughter, and support that keeps my dreams flying high!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Paragraph description */}
          <div className="lg:col-span-6 space-y-6">
            <p className="font-outfit text-gray-600 text-xl leading-relaxed">
              "Vanshika is one of the most lovable members of our family. Her smile lights up every gathering, her laughter brings happiness to everyone around her, and her caring nature makes her special to all who know her."
            </p>
            
            <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm space-y-4">
              <h4 className="font-fredoka font-bold text-lg text-gray-800 flex items-center space-x-2">
                <span>👨‍👩‍👧‍👦 Family Moments Checklist</span>
              </h4>
              <ul className="space-y-3 text-sm text-gray-600 font-comfortaa">
                <li className="flex items-center space-x-2">
                  <span className="text-themePink">✔</span>
                  <span>Weekend dinners and matching clothes setup</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-themePink">✔</span>
                  <span>Funny faces posing games on the couch</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-themePink">✔</span>
                  <span>Celebrating birthdays together with balloons & cakes</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Polaroid collage from uploaded photos */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div 
              className="polaroid-card transform -rotate-3 hover:rotate-0 transition-transform duration-300 border border-gray-100 cursor-pointer"
              onClick={() => openLightbox(5, MEMORIES_GALLERY)}
            >
              <div className="aspect-[4/3] overflow-hidden rounded bg-gray-100">
                <img 
                  src="public/images/media__1782208755851.jpg" 
                  alt="Family smile" 
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=500'; }}
                />
              </div>
              <p className="handwritten text-lg font-bold text-center mt-2 text-themePink">Matching Blue 👗</p>
            </div>
            
            <div 
              className="polaroid-card transform rotate-3 hover:rotate-0 transition-transform duration-300 border border-gray-100 cursor-pointer"
              onClick={() => openLightbox(6, MEMORIES_GALLERY)}
            >
              <div className="aspect-[4/3] overflow-hidden rounded bg-gray-100">
                <img 
                  src="public/images/media__1782208756003.jpg" 
                  alt="Happy faces" 
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=500'; }}
                />
              </div>
              <p className="handwritten text-lg font-bold text-center mt-2 text-themePink">Wacky Smiles 🤪</p>
            </div>

            <div 
              className="polaroid-card col-span-2 transform -rotate-1 hover:rotate-0 transition-transform duration-300 border border-gray-100 cursor-pointer"
              onClick={() => openLightbox(0, MEMORIES_GALLERY)}
            >
              <div className="aspect-[2/1] overflow-hidden rounded bg-gray-100">
                <img 
                  src="public/images/media__1782208447642.jpg" 
                  alt="Mom and Kids" 
                  className="w-full h-full object-cover object-center"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500'; }}
                />
              </div>
              <p className="handwritten text-lg font-bold text-center mt-2 text-themePink">Love You Mom! 💕</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- BIRTHDAY CELEBRATION SECTION --- */}
      <section id="birthday" className="relative z-10 max-w-6xl mx-auto px-6 py-16 bg-gradient-to-br from-pastelPink via-pastelPurple to-pastelBlue rounded-3xl p-8 lg:p-12 border-2 border-white shadow-lg text-center space-y-8">
        
        <div className="space-y-4">
          <span className="text-6xl animate-bounce inline-block">🎂</span>
          <h2 className="font-fredoka text-4xl md:text-5xl font-extrabold text-gray-800">
            Happy Birthday Vanshika!
          </h2>
          <p className="font-comfortaa text-lg text-gray-600 max-w-xl mx-auto">
            My special day is on <strong className="text-themePink">July 2nd</strong>! Let's count down the days, hours, and seconds together!
          </p>
        </div>

        {/* Countdown Timer */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl p-4 border border-pink-200 shadow-sm">
            <span className="block text-4xl md:text-5xl font-fredoka font-bold text-themePink">{timeLeft.days || 0}</span>
            <span className="font-comfortaa text-xs text-gray-400 font-bold uppercase tracking-wider">Days</span>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-pink-200 shadow-sm">
            <span className="block text-4xl md:text-5xl font-fredoka font-bold text-themeBlue">{timeLeft.hours || 0}</span>
            <span className="font-comfortaa text-xs text-gray-400 font-bold uppercase tracking-wider">Hours</span>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-pink-200 shadow-sm">
            <span className="block text-4xl md:text-5xl font-fredoka font-bold text-themePurple">{timeLeft.minutes || 0}</span>
            <span className="font-comfortaa text-xs text-gray-400 font-bold uppercase tracking-wider">Minutes</span>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-pink-200 shadow-sm">
            <span className="block text-4xl md:text-5xl font-fredoka font-bold text-themeGreen">{timeLeft.seconds || 0}</span>
            <span className="font-comfortaa text-xs text-gray-400 font-bold uppercase tracking-wider">Seconds</span>
          </div>
        </div>

        {/* Cake interaction */}
        <div className="relative inline-block group cursor-pointer" onClick={triggerConfetti}>
          <div className="absolute -inset-4 rounded-full bg-pink-300 opacity-20 blur-lg group-hover:opacity-40 transition-opacity"></div>
          <div className="relative text-7xl select-none transform group-hover:scale-110 transition-transform duration-300">
            🍰🎈🎉
          </div>
          <span className="block font-fredoka text-xs text-themePink font-bold mt-2 animate-pulse">
            Click to Blow Birthday Candles!
          </span>
        </div>

        {/* Wishes Wall Heading */}
        <div className="pt-8 border-t border-dashed border-pink-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto">
            <h3 className="font-fredoka text-2xl font-bold text-gray-800 flex items-center space-x-2">
              <span>💌 Virtual Wishes Wall</span>
            </h3>
            <button 
              onClick={() => setIsWishesModalOpen(true)}
              className="btn-wobbly bg-themePink text-white font-fredoka font-semibold px-6 py-3 shadow-md hover:bg-pink-600 transition-colors"
            >
              Add Your Wish +
            </button>
          </div>

          {/* Wish Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-8 text-left">
            {wishes.map((wish, index) => (
              <div 
                key={index} 
                className="bg-white p-5 rounded-2xl border border-pink-100 shadow-sm relative overflow-hidden flex flex-col justify-between hover:scale-102 transition-transform"
              >
                <div className="absolute -top-3 -right-3 text-4xl opacity-20 select-none">
                  {wish.sticker}
                </div>
                <div>
                  <span className="text-xl mr-1">{wish.sticker}</span>
                  <span className="font-fredoka font-bold text-gray-800">{wish.name}</span>
                  <p className="font-outfit text-sm text-gray-600 mt-2 leading-relaxed">
                    {wish.message}
                  </p>
                </div>
                <span className="font-comfortaa text-xxs text-gray-400 block mt-4 font-bold text-right">{wish.date}</span>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* --- PHOTO MEMORIES GALLERY --- */}
      <section id="gallery" className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        <div className="text-center space-y-3 mb-12">
          <span className="text-4xl">📸</span>
          <h2 className="font-fredoka text-4xl md:text-5xl font-bold text-gray-800">Photo Memories Gallery</h2>
          <p className="font-comfortaa text-gray-500">A digital scrapbook of all my favorite moments with friends and family!</p>
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {galleryTabs.map((tab, idx) => (
            <button
              key={idx}
              onClick={() => setActiveGalleryTab(tab)}
              className={`font-fredoka text-sm px-4 py-2 rounded-full transition-all border-2 ${
                activeGalleryTab === tab 
                  ? 'bg-themePink text-white border-themePink' 
                  : 'bg-white text-gray-600 border-gray-100 hover:border-gray-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Masonry-Style Gallery Grid */}
        <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6">
          {filteredMemories.map((photo, index) => (
            <div 
              key={index} 
              className="break-inside-avoid bg-white p-4 border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
              onClick={() => openLightbox(index, filteredMemories)}
            >
              <div className="overflow-hidden rounded-xl bg-gray-50">
                <img 
                  src={photo.src} 
                  alt={photo.caption} 
                  className="w-full object-cover group-hover:scale-103 transition-transform duration-300"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=500'; }}
                />
              </div>
              <div className="mt-3 flex items-center justify-between">
                <p className="font-fredoka text-sm text-gray-800 font-semibold">{photo.caption}</p>
                <span className="text-xxs bg-pink-100 text-themePink px-2 py-0.5 rounded-full font-bold">
                  {photo.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- FUN FACTS SECTION --- */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-12 text-center">
        <h3 className="font-fredoka text-3xl font-bold text-gray-800 mb-8 flex items-center justify-center space-x-2">
          <span>🧐 Fun Facts About Me</span>
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          {FUN_FACTS.map((fact, index) => (
            <div 
              key={index} 
              className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-start space-x-3 hover:-translate-y-0.5 transition-transform"
            >
              <span className="text-themePink font-bold text-lg">💡</span>
              <p className="font-comfortaa text-sm text-gray-600 font-semibold leading-relaxed">
                {fact}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* --- QUOTE SECTION --- */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-16 text-center">
        <div className="cutout-border p-8 md:p-12 bg-white relative">
          <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-5xl">✨</span>
          <p className="handwritten text-4xl md:text-5xl text-themePink font-bold leading-normal">
            "Every child is an artist. Creativity is my superpower."
          </p>
          <span className="block font-fredoka text-sm text-gray-400 mt-4 uppercase tracking-wider">— Vanshika's Motto</span>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="relative z-10 max-w-6xl mx-auto px-6 pt-12 mt-12 border-t border-dashed border-gray-200 text-center space-y-4">
        <p className="font-fredoka text-lg text-gray-700">
          Made with Love for Vanshika Bansal ❤️
        </p>
        <p className="font-comfortaa text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
          A digital memory book celebrating her creativity, kindness, imagination, and joyful spirit. All rights reserved &copy; 2026.
        </p>
      </footer>

      {/* --- WISHES MODAL --- */}
      <AnimatePresence>
        {isWishesModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsWishesModalOpen(false)}></div>
            <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full relative z-10 shadow-2xl border border-pink-100">
              <h3 className="font-fredoka text-2xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                <span>🎈 Send Birthday Wishes!</span>
              </h3>
              
              <form onSubmit={handleAddWish} className="space-y-4 text-left font-comfortaa">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Your Name</label>
                  <input 
                    type="text" 
                    required 
                    value={newWishName}
                    onChange={(e) => setNewWishName(e.target.value)}
                    placeholder="e.g. Aunt Ritu" 
                    className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-themePink text-sm font-semibold"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Your Message</label>
                  <textarea 
                    required
                    rows="3"
                    value={newWishMessage}
                    onChange={(e) => setNewWishMessage(e.target.value)}
                    placeholder="Write a sweet birthday note..." 
                    className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-themePink text-sm font-semibold"
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Select a Sticker</label>
                  <div className="flex justify-between p-2 bg-gray-50 rounded-xl border border-gray-100 text-2xl">
                    {["🎈", "🎂", "⭐", "🎁", "💖", "🍦"].map((sticker) => (
                      <button 
                        key={sticker}
                        type="button"
                        onClick={() => setNewWishSticker(sticker)}
                        className={`p-1.5 rounded-lg transition-transform ${newWishSticker === sticker ? 'bg-pink-100 scale-110 border border-themePink' : 'hover:scale-105'}`}
                      >
                        {sticker}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-3 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setIsWishesModalOpen(false)}
                    className="w-1/2 p-3 rounded-xl border border-gray-200 text-gray-500 font-bold hover:bg-gray-50 transition-colors text-sm"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="w-1/2 p-3 rounded-xl bg-themePink text-white font-bold hover:bg-pink-600 transition-colors shadow-md text-sm"
                  >
                    Post Wish ✨
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* --- LIGHTBOX MODAL --- */}
      <AnimatePresence>
        {lightboxImageIndex !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lightbox-overlay">
            {/* Close trigger on background */}
            <div className="fixed inset-0" onClick={() => setLightboxImageIndex(null)}></div>
            
            {/* Modal Box */}
            <div className="relative bg-white rounded-3xl p-4 md:p-6 max-w-3xl w-full z-10 shadow-2xl border border-gray-100 flex flex-col md:flex-row gap-6">
              
              {/* Left Side: Image display */}
              <div className="md:w-7/12 aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 relative">
                <img 
                  src={lightboxGallery[lightboxImageIndex].src} 
                  alt={lightboxGallery[lightboxImageIndex].title || lightboxGallery[lightboxImageIndex].caption} 
                  className="w-full h-full object-cover object-center"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500'; }}
                />
                
                {/* Navigation arrows overlay */}
                <button 
                  onClick={() => navigateLightbox(-1)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 flex items-center justify-center shadow-md hover:bg-white transition-colors"
                >
                  <i className="fa-solid fa-chevron-left text-gray-700"></i>
                </button>
                <button 
                  onClick={() => navigateLightbox(1)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 flex items-center justify-center shadow-md hover:bg-white transition-colors"
                >
                  <i className="fa-solid fa-chevron-right text-gray-700"></i>
                </button>
              </div>

              {/* Right Side: Copy/Desc details */}
              <div className="md:w-5/12 flex flex-col justify-between py-2 text-left">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xxs bg-pink-100 text-themePink px-2.5 py-1 rounded-full font-bold font-fredoka uppercase tracking-wider">
                      {lightboxGallery[lightboxImageIndex].category}
                    </span>
                    <button 
                      onClick={() => setLightboxImageIndex(null)}
                      className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors text-gray-500"
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  </div>
                  
                  <h3 className="font-fredoka text-2xl font-bold text-gray-800 mt-4">
                    {lightboxGallery[lightboxImageIndex].title || lightboxGallery[lightboxImageIndex].caption}
                  </h3>
                  
                  <p className="font-outfit text-sm text-gray-500 mt-3 leading-relaxed">
                    {lightboxGallery[lightboxImageIndex].desc || "A lovely photo from Vanshika's creative memories. Exploring arts, skating, school life, and wonderful time spent with family."}
                  </p>
                </div>
                
                <div className="mt-6 pt-4 border-t border-dashed border-gray-100 flex items-center justify-between text-xs text-gray-400 font-comfortaa">
                  <span>Photo {lightboxImageIndex + 1} of {lightboxGallery.length}</span>
                  <span className="font-bold text-themePink">Vanshika's Album 🌸</span>
                </div>
              </div>

            </div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

// Render app
const rootElement = document.getElementById('root');
const root = createRoot(rootElement);
root.render(<App />);
