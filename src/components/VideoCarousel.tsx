'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import { FaVolumeUp, FaVolumeMute, FaChevronLeft, FaChevronRight, FaPlay } from 'react-icons/fa';

type VideoItem = {
  id: number;
  title: string;
  src: string;
};

const VideoCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { amount: 0.5 });
  const animationRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  const startXRotationRef = useRef(0);
  const syncRef = useRef<() => void>(() => {});

  const videos: VideoItem[] = [
    { id: 1, title: 'Финансовый комплаенс', src: '/videos/video1.mp4' },
    { id: 2, title: 'Юридические консультации', src: '/videos/video2.mp4' },
    { id: 3, title: 'Бизнес-аналитика', src: '/videos/video3.mp4' },
    { id: 4, title: 'Документация', src: '/videos/video4.mp4' },
    { id: 5, title: 'Экспертиза', src: '/videos/video5.mp4' },
    { id: 6, title: 'Международные стандарты', src: '/videos/video6.mp4' },
  ];

  // Синхронизация вращения с текущим индексом
  const syncRotationWithIndex = useCallback(() => {
    const videosCount = videos.length;
    const anglePerVideo = 360 / videosCount;
    const normalizedRotation = ((rotation % 360) + 360) % 360;
    const closestIndex = Math.round(normalizedRotation / anglePerVideo) % videosCount;
    setCurrentIndex(closestIndex);
    setRotation(closestIndex * anglePerVideo);
    setVelocity(0);
  }, [rotation, videos.length]);

  // Обновление ref для синхронизации
  useEffect(() => {
    syncRef.current = syncRotationWithIndex;
  }, [syncRotationWithIndex]);

  // Отслеживаем размер окна для адаптивности
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;

  // Функция для установки ref видео
  const setVideoRef = useCallback((el: HTMLVideoElement | null, index: number) => {
    videoRefs.current[index] = el;
  }, []);

  // Воспроизведение активного видео
  useEffect(() => {
    const playActiveVideo = async () => {
      const video = videoRefs.current[currentIndex];
      if (!video) return;

      try {
        if (isInView && isPlaying) {
          await video.play();
        } else {
          video.pause();
        }
      } catch (err) {
        console.error("Ошибка воспроизведения видео:", err);
        video.muted = true;
        setIsMuted(true);
        await video.play();
      }
    };

    // Остановить все остальные видео
    videoRefs.current.forEach((video, index) => {
      if (video && index !== currentIndex) {
        video.pause();
        video.currentTime = 0;
      }
    });

    playActiveVideo();
    
    // Обработчик видимости страницы
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        setIsPlaying(false);
      } else if (isInView) {
        setIsPlaying(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [currentIndex, isInView, isPlaying]);

  // Автозапуск при появлении в области видимости
  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        setIsPlaying(true);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setIsPlaying(false);
    }
  }, [isInView]);

  // Анимация инерционного вращения
  useEffect(() => {
    if (Math.abs(velocity) > 0.01) {
      const animate = (timestamp: number) => {
        if (!lastTimestampRef.current) lastTimestampRef.current = timestamp;
        const delta = timestamp - lastTimestampRef.current;
        lastTimestampRef.current = timestamp;
        
        const rotationDelta = velocity * delta / 16;
        setRotation(prev => prev + rotationDelta);
        setVelocity(prev => prev * 0.95);
        
        if (Math.abs(velocity * 0.95) > 0.01) {
          animationRef.current = requestAnimationFrame(animate);
        }
      };
      
      animationRef.current = requestAnimationFrame(animate);
    } else if (velocity !== 0) {
      syncRef.current();
      setVelocity(0);
    }
    
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [velocity]);

  // Функция для расчета позиции видео (адаптирована для мобильных)
  const getVideoStyle = useCallback((index: number) => {
    const videosCount = videos.length;
    const anglePerVideo = 360 / videosCount;
    const videoAngle = anglePerVideo * index - rotation;
    
    // Адаптивный радиус для мобильных
    const radius = isMobile ? 200 : 350;
    const x = Math.sin(videoAngle * Math.PI / 180) * radius;
    const z = Math.cos(videoAngle * Math.PI / 180) * radius;
    
    const distanceFromCenter = Math.abs(videoAngle % 360);
    const minDistance = Math.min(distanceFromCenter, 360 - distanceFromCenter);
    const scale = 0.8 + 0.2 * (1 - minDistance / 180);
    const opacity = 0.5 + 0.5 * (1 - minDistance / 180);
    
    return {
      transform: `translate3d(${x}px, 0, ${z}px)`,
      scale,
      opacity,
      zIndex: Math.round(scale * 10)
    };
  }, [rotation, videos.length, isMobile]);

  // Обработчики для вращения карусели
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (!isMobile) {
      setVelocity(prev => prev + e.deltaY * 0.01);
    }
  }, [isMobile]);

  const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    isDraggingRef.current = true;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    startXRotationRef.current = clientX;
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    setVelocity(0);
  }, []);

  const handleDragMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDraggingRef.current) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const deltaX = clientX - startXRotationRef.current;
    
    setRotation(prev => prev + deltaX * 0.5);
    startXRotationRef.current = clientX;
  }, []);

  const handleDragEnd = useCallback(() => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setVelocity(prev => prev * 0.5);
  }, []);

  // Переключение на следующее/предыдущее видео
  const goToNext = useCallback(() => {
    const anglePerVideo = 360 / videos.length;
    setRotation(prev => prev + anglePerVideo);
    setCurrentIndex(prev => (prev + 1) % videos.length);
  }, [videos.length]);

  const goToPrev = useCallback(() => {
    const anglePerVideo = 360 / videos.length;
    setRotation(prev => prev - anglePerVideo);
    setCurrentIndex(prev => (prev - 1 + videos.length) % videos.length);
  }, [videos.length]);

  const goToVideo = useCallback((index: number) => {
    const anglePerVideo = 360 / videos.length;
    setCurrentIndex(index);
    setRotation(index * anglePerVideo);
    setIsPlaying(true);
  }, [videos.length]);

  return (
    <section className="py-10 md:py-20 bg-dark-card" ref={sectionRef}>
      <div className="responsive-container">
        <motion.h2 
          className="text-2xl md:text-4xl font-bold text-center mb-8 md:mb-16 text-gold-primary"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Наши экспертные решения
        </motion.h2>
        
        <div className="relative w-full h-[300px] md:h-[500px] flex items-center justify-center overflow-hidden">
          {/* Кнопки навигации - скрыты на мобильных */}
          <button 
            className="absolute left-4 z-20 p-3 md:p-4 bg-gold-primary rounded-full text-dark-bg hover:bg-gold-secondary transition-all shadow-lg hidden md:block"
            onClick={goToPrev}
            aria-label="Предыдущее видео"
          >
            <FaChevronLeft size={20} />
          </button>
          
          <div 
            ref={carouselRef}
            className="relative w-full h-full flex items-center justify-center perspective-1000"
            onWheel={handleWheel}
            onMouseDown={handleDragStart}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={handleDragStart}
            onTouchMove={handleDragMove}
            onTouchEnd={handleDragEnd}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              {videos.map((video, index) => {
                const style = getVideoStyle(index);
                
                return (
                  <motion.div
                    key={video.id}
                    className={`absolute cursor-pointer rounded-xl overflow-hidden shadow-2xl ${
                      isMobile ? 'w-[180px] h-[250px]' : 'w-[280px] h-[400px]'
                    }`}
                    style={style}
                    animate={style}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    onClick={() => goToVideo(index)}
                  >
                    <video
                      ref={(el) => setVideoRef(el, index)}
                      src={video.src}
                      className="w-full h-full object-cover"
                      muted={isMuted || index !== currentIndex}
                      playsInline
                    />
                    
                    <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 bg-gradient-to-t from-black/90 to-transparent">
                      <h3 className="text-base md:text-lg font-bold text-white truncate">
                        {video.title}
                      </h3>
                      
                      {index === currentIndex && (
                        <div className="flex items-center mt-1 md:mt-2">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsMuted(!isMuted);
                            }}
                            className="p-1 md:p-2 bg-gold-primary rounded-full text-dark-bg hover:bg-gold-secondary transition-colors"
                            aria-label={isMuted ? 'Включить звук' : 'Выключить звук'}
                          >
                            {isMuted ? <FaVolumeMute size={14} /> : <FaVolumeUp size={14} />}
                          </button>
                          <span className="ml-2 text-white text-xs md:text-sm">
                            {isPlaying ? 'Воспроизводится' : 'Пауза'}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {!isPlaying && index === currentIndex && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsPlaying(true);
                          }}
                          className="p-3 md:p-4 bg-gold-primary rounded-full text-dark-bg hover:bg-gold-secondary transition-colors"
                          aria-label="Воспроизвести"
                        >
                          <FaPlay size={20} />
                        </button>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
          
          {/* Кнопки навигации - скрыты на мобильных */}
          <button 
            className="absolute right-4 z-20 p-3 md:p-4 bg-gold-primary rounded-full text-dark-bg hover:bg-gold-secondary transition-all shadow-lg hidden md:block"
            onClick={goToNext}
            aria-label="Следующее видео"
          >
            <FaChevronRight size={20} />
          </button>
        </div>
        
        <div className="flex flex-col items-center mt-8 md:mt-12">
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {videos.map((_, index) => (
              <button
                key={index}
                onClick={() => goToVideo(index)}
                className={`px-2 py-1 md:px-3 md:py-1 rounded-full transition-all ${
                  index === currentIndex 
                    ? 'bg-gold-primary text-dark-bg scale-110' 
                    : 'bg-gray-700 text-white'
                }`}
                aria-label={`Перейти к видео ${index + 1}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          
          <div className="flex flex-wrap justify-center gap-3">
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="btn btn-primary px-4 py-2 bg-gold-primary rounded-full text-dark-bg hover:bg-gold-secondary transition-colors text-sm md:text-base"
              aria-label={isPlaying ? 'Пауза' : 'Воспроизвести'}
            >
              {isPlaying ? 'Пауза' : 'Воспроизвести'}
            </button>
            
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className="btn btn-primary px-4 py-2 bg-gold-primary rounded-full text-dark-bg hover:bg-gold-secondary transition-colors text-sm md:text-base"
              aria-label={isMuted ? 'Включить звук' : 'Выключить звук'}
            >
              {isMuted ? 'Включить звук' : 'Выключить звук'}
            </button>
          </div>
          
          {/* Блок статуса - виден только на мобильных */}
          <div className="block md:hidden mt-4 text-gold-secondary text-sm">
            {isInView 
              ? 'Видео активно' 
              : 'Прокрутите вверх для просмотра видео'}
          </div>
          
          {/* Блок статуса - виден только на десктопе */}
          <div className="hidden md:block mt-4 text-gold-secondary text-sm">
            {isInView 
              ? 'Видео активно - используйте колесико мыши для вращения' 
              : 'Прокрутите вниз для просмотра видео'}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoCarousel;