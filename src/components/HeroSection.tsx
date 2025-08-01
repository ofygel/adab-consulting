'use client';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const HeroSection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const playVideo = async () => {
      if (videoRef.current) {
        try {
          if (isMobile) {
            videoRef.current.muted = true;
            setMuted(true);
          }
          await videoRef.current.play();
        } catch {
          videoRef.current.muted = true;
          setMuted(true);
          setTimeout(() => {
            if (videoRef.current) {
              videoRef.current.play();
            }
          }, 500);
        }
      }
    };
    playVideo();
  }, [isMobile]);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <video 
          ref={videoRef}
          autoPlay
          loop
          muted={muted}
          playsInline
          className="w-full h-full object-cover"
          poster="/hero-poster.jpg"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
          <source src="/hero-video.webm" type="video/webm" />
          Ваш браузер не поддерживает видео.
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-dark-bg/0 via-dark-bg/70 to-dark-bg" />
      </div>
      
      {!isMobile && (
        <motion.button
          className="absolute top-4 right-4 z-30 bg-black/30 p-2 rounded-full hover:bg-black/50 transition-all"
          onClick={() => setMuted(!muted)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label={muted ? "Включить звук" : "Выключить звук"}
        >
          {muted ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
            </svg>
          )}
        </motion.button>
      )}

      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1 
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-white leading-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            ШАРИАТ-КОМПЛАЕНС <br className="hidden sm:block" />
            <span className="text-gold-primary block sm:inline mt-2 sm:mt-0">ДЛЯ ВАШИХ ДОГОВОРОВ</span>
          </motion.h1>
          
          <motion.p 
            className="text-base sm:text-lg md:text-xl mb-6 sm:mb-10 max-w-2xl sm:max-w-3xl mx-auto text-gold-secondary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Онлайн-проверка и консультации без визита в офис
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <motion.button
              className="gold-gradient px-6 py-3 sm:px-8 sm:py-4 rounded-full font-bold text-dark-bg text-sm sm:text-base hover:shadow-lg hover:shadow-gold-primary/30 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Узнать больше о сервисе"
            >
              Узнать больше
            </motion.button>
            <motion.button
              className="border-2 border-gold-primary px-6 py-3 sm:px-8 sm:py-4 rounded-full font-bold text-gold-primary text-sm sm:text-base hover:bg-gold-primary/10 transition-colors"
              whileHover={{ 
                scale: 1.05,
                backgroundColor: 'rgba(212, 175, 55, 0.1)'
              }}
              whileTap={{ scale: 0.95 }}
              aria-label="Загрузить договор для проверки"
            >
              Загрузить договор
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
      
      {!isMobile && (
        <motion.div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20"
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <div className="w-8 h-14 rounded-full border-2 border-gold-primary flex justify-center p-1">
            <motion.div 
              className="w-2 h-2 bg-gold-primary rounded-full"
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />
          </div>
        </motion.div>
      )}
    </section>
  );
};

export default HeroSection;