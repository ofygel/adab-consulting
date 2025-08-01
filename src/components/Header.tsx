'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/store';
import { useState, useEffect, useRef } from 'react';
import { FiMenu, FiX, FiPhone } from 'react-icons/fi';

const Header = () => {
  const { activeSection, setActiveSection } = useStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  
  const navItems = [
    { id: 'services', label: 'Услуги' },
    { id: 'about', label: 'О нас' },
    { id: 'upload', label: 'Загрузка документов' },
    { id: 'reviews', label: 'Отзывы' },
    { id: 'contact', label: 'Контакты' },
  ];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Блокировка скролла при открытом меню на мобильных
    if (isMenuOpen && isMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen, isMobile]);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    setIsMenuOpen(false);
    
    const element = document.getElementById(id);
    if (element) {
      const yOffset = isMobile ? -70 : -80; // Разный offset для мобильных
      window.scrollTo({
        top: element.offsetTop + yOffset,
        behavior: 'smooth'
      });
    }
  };

  return (
    <motion.header 
      ref={headerRef}
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-dark-bg/95 backdrop-blur-md py-2 shadow-lg' 
          : 'bg-dark-bg/90 backdrop-blur-sm py-3'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', damping: 20 }}
    >
      <div className="container mx-auto px-4 sm:px-6 flex justify-between items-center">
        <motion.a 
          href="#"
          className="text-lg sm:text-xl font-bold text-gold-primary flex items-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('home');
          }}
        >
          ADAB CONSULTING
        </motion.a>
        
        {/* Десктопная навигация */}
        <nav className="hidden md:flex space-x-4 lg:space-x-6">
          {navItems.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`relative py-1 px-1 text-sm lg:text-base ${
                activeSection === item.id 
                  ? 'text-gold-primary' 
                  : 'text-white hover:text-gold-secondary'
              } transition-colors`}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              aria-label={`Перейти к разделу ${item.label}`}
            >
              {item.label}
              {activeSection === item.id && (
                <motion.div 
                  className="absolute bottom-0 left-0 w-full h-[2px] bg-gold-primary"
                  layoutId="navIndicator"
                />
              )}
            </motion.button>
          ))}
        </nav>
        
        <div className="flex items-center gap-3 sm:gap-4">
          <motion.a 
            href="tel:+79999999999"
            className="hidden xs:flex items-center gold-gradient px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-bold text-dark-bg text-xs sm:text-sm gap-2"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 0 15px rgba(212, 175, 55, 0.5)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            <FiPhone size={14} />
            Консультация
          </motion.a>
          
          <motion.button
            className="md:hidden text-gold-primary p-1"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label={isMenuOpen ? "Закрыть меню" : "Открыть меню"}
          >
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </motion.button>
        </div>
      </div>
      
      {/* Мобильное меню */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="md:hidden bg-dark-bg/95 backdrop-blur-lg fixed inset-0 top-[60px] overflow-y-auto"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="container mx-auto px-4 py-4 flex flex-col">
              {navItems.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`w-full text-left py-4 px-4 border-b border-gold-primary/10 ${
                    activeSection === item.id 
                      ? 'text-gold-primary font-semibold' 
                      : 'text-white'
                  } text-lg`}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {item.label}
                  {activeSection === item.id && (
                    <span className="ml-3 text-gold-primary">→</span>
                  )}
                </motion.button>
              ))}
              
              <motion.a
                href="tel:+79999999999"
                className="gold-gradient mt-6 py-4 px-6 rounded-xl font-bold text-dark-bg text-center flex items-center justify-center gap-3"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <FiPhone size={20} />
                Позвонить нам
              </motion.a>
              
              <motion.div 
                className="mt-8 text-center text-gold-secondary text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <p>Работаем 24/7</p>
                <a href="mailto:info@adabconsulting.com" className="underline mt-1 inline-block">
                  info@adabconsulting.com
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;