'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaQuoteLeft, FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const reviews = [
  {
    id: 1,
    name: "Ахмед Аль-Рашид",
    position: "CEO, Аль-Барака Финанс",
    content: "Профессиональная команда экспертов по шариату. Проверили все наши контракты за рекордно короткие сроки. Особенно впечатлило внимание к деталям и глубина анализа.",
    rating: 5,
    date: "15 мая 2024"
  },
  {
    id: 2,
    name: "Марьям Ибрагимова",
    position: "Директор, Исламский Банк",
    content: "Сотрудничаем с ADAB Consulting уже более года. Ни разу не было нареканий. Всегда оперативные консультации и четкие рекомендации по соответствию договоров исламским принципам.",
    rating: 5,
    date: "3 апреля 2024"
  },
  {
    id: 3,
    name: "Омар Хассан",
    position: "Управляющий партнер, Халяль Инвест",
    content: "Отличный сервис! Особенно ценю возможность онлайн-консультаций без необходимости посещения офиса. Экономит массу времени при сохранении качества услуг.",
    rating: 4,
    date: "21 марта 2024"
  },
  {
    id: 4,
    name: "Аиша Мухаммед",
    position: "Юрист, Финансовая Корпорация",
    content: "Команда ADAB помогла нам перестроить договорную базу под требования шариата. Теперь наши клиенты уверены в полном соответствии наших услуг исламским финансовым принципам.",
    rating: 5,
    date: "12 февраля 2024"
  },
  {
    id: 5,
    name: "Юсуф Камаль",
    position: "Предприниматель",
    content: "Искал консультантов для проверки инвестиционного договора. ADAB Consulting оказались настоящими профессионалами. Объяснили все нюансы простым языком и помогли избежать серьезных ошибок.",
    rating: 5,
    date: "29 января 2024"
  }
];

const ReviewsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const nextReview = () => {
    setDirection('right');
    setCurrentIndex(prev => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setDirection('left');
    setCurrentIndex(prev => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  useEffect(() => {
    if (!isAutoPlaying || isMobile) return;
    
    const interval = setInterval(() => {
      nextReview();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isAutoPlaying, isMobile]);

  const variants = {
    enter: (direction: string) => ({
      x: direction === 'right' ? (isMobile ? 300 : 1000) : (isMobile ? -300 : -1000),
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: string) => ({
      x: direction === 'right' ? (isMobile ? -300 : -1000) : (isMobile ? 300 : 1000),
      opacity: 0
    })
  };

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <FaStar 
        key={i} 
        className={i < rating ? "text-gold-primary" : "text-gray-600"} 
        size={isMobile ? 14 : 18}
      />
    ));
  };

  return (
    <section className="py-12 sm:py-20 relative bg-dark-card" id="reviews">
      <div className="absolute inset-0 opacity-10">
        <div className="pattern-dots pattern-gold pattern-opacity-100 pattern-size-4 w-full h-full" />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-gold-primary">
            Отзывы клиентов
          </h2>
          <p className="text-gold-secondary max-w-2xl mx-auto text-sm sm:text-base">
            Что говорят наши клиенты о качестве наших услуг и профессионализме команды
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          <div className="relative h-[300px] sm:h-[350px] md:h-[400px]">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ 
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                className="absolute inset-0 bg-dark-bg rounded-xl sm:rounded-2xl md:rounded-3xl border border-gold-primary/20 p-4 sm:p-6 md:p-8 shadow-lg"
                onHoverStart={() => !isMobile && setIsAutoPlaying(false)}
                onHoverEnd={() => !isMobile && setIsAutoPlaying(true)}
              >
                <div className="flex flex-col h-full">
                  <div className="mb-3 sm:mb-6 flex justify-between items-start">
                    <FaQuoteLeft className="text-3xl sm:text-4xl md:text-5xl text-gold-primary/30" />
                    <div className="flex gap-1">{renderStars(reviews[currentIndex].rating)}</div>
                  </div>
                  
                  {/* Исправлено: удалены лишние кавычки вокруг контента */}
                  <p className="text-sm sm:text-base md:text-lg flex-grow text-gray-300 mb-4 sm:mb-6">
                    {reviews[currentIndex].content}
                  </p>
                  
                  <div>
                    <div className="flex items-center gap-2 sm:gap-4 mb-1 sm:mb-2">
                      <div className="bg-gold-primary/10 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-gold-primary font-bold text-sm sm:text-base md:text-lg">
                        {reviews[currentIndex].name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-base sm:text-lg md:text-xl font-bold text-gold-secondary">
                          {reviews[currentIndex].name}
                        </h4>
                        <p className="text-gray-400 text-xs sm:text-sm">
                          {reviews[currentIndex].position}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-500 text-right text-xs sm:text-sm">
                      {reviews[currentIndex].date}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          
          <div className="flex justify-between items-center mt-6 sm:mt-8">
            <div className="flex items-center">
              {!isMobile && (
                <button 
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  className="mr-3 sm:mr-4 p-1 sm:p-2 rounded-full bg-dark-bg border border-gold-primary/30 text-gold-primary hover:bg-gold-primary/10 transition-colors"
                  aria-label={isAutoPlaying ? "Пауза автопрокрутки" : "Запуск автопрокрутки"}
                >
                  {isAutoPlaying ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              )}
              <span className="text-xs sm:text-sm text-gray-400">
                {currentIndex + 1} / {reviews.length}
              </span>
            </div>
            
            <div className="flex gap-2 sm:gap-4">
              <button 
                onClick={prevReview}
                className="p-2 sm:p-3 md:p-4 bg-gold-primary rounded-full text-dark-bg hover:bg-gold-secondary transition-colors"
                aria-label="Предыдущий отзыв"
              >
                <FaChevronLeft size={isMobile ? 12 : 16} />
              </button>
              <button 
                onClick={nextReview}
                className="p-2 sm:p-3 md:p-4 bg-gold-primary rounded-full text-dark-bg hover:bg-gold-secondary transition-colors"
                aria-label="Следующий отзыв"
              >
                <FaChevronRight size={isMobile ? 12 : 16} />
              </button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4 md:gap-6 mt-12 sm:mt-16">
          {[
            { value: "98%", label: "Удовлетворённость" },
            { value: "24ч", label: "Среднее время ответа" },
            { value: "150+", label: "Проверенных договоров" },
            { value: "50+", label: "Довольных клиентов" },
            { value: "100%", label: "Конфиденциальность" }
          ].map((item, index) => (
            <motion.div
              key={index}
              className="bg-dark-bg p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl border border-gold-primary/10 text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gold-primary mb-1 sm:mb-2">
                {item.value}
              </div>
              <div className="text-gold-secondary text-xs sm:text-sm">
                {item.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;