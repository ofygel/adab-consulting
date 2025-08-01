'use client';
import { motion } from 'framer-motion';
import { FiFileText, FiBriefcase, FiSearch } from 'react-icons/fi';
import { FaRegHandshake } from 'react-icons/fa';

const services = [
  {
    title: 'Проверка договоров',
    description: 'Полный анализ документов на соответствие принципам шариата с детальным отчётом и рекомендациями',
    icon: <FiFileText className="text-3xl" />,
    features: [
      'Анализ всех видов договоров',
      'Постатейное соответствие',
      'Рекомендации по исправлению'
    ]
  },
  {
    title: 'Шариатские консультации',
    description: 'Экспертное сопровождение вашего бизнеса по вопросам соответствия исламским финансам',
    icon: <FiBriefcase className="text-3xl" />,
    features: [
      'Онлайн и оффлайн консультации',
      'Поддержка 24/7',
      'Персональный менеджер'
    ]
  },
  {
    title: 'Комплексный аудит',
    description: 'Глубокая проверка бизнес-процессов и финансовых операций на халяль-совместимость',
    icon: <FiSearch className="text-3xl" />,
    features: [
      'Полный аудит процессов',
      'Отчёт с рекомендациями',
      'Сопровождение внедрения'
    ]
  },
  {
    title: 'Сертификация',
    description: 'Официальное подтверждение соответствия ваших услуг и продуктов требованиям шариата',
    icon: <FaRegHandshake className="text-3xl" />,
    features: [
      'Международно признанные сертификаты',
      'Работа с регуляторами',
      'Помощь в маркетинге'
    ]
  }
];

export default function ServicesSection() {
  return (
    <section className="py-12 sm:py-20 bg-dark-bg" id="services">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div 
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 text-gold-primary">
            Наши услуги
          </h2>
          <p className="text-gold-secondary max-w-2xl mx-auto text-sm sm:text-base">
            Комплексные решения для вашего бизнеса в соответствии с принципами исламских финансов
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="bg-dark-card p-5 sm:p-6 rounded-xl sm:rounded-2xl border border-gold-primary/10 hover:border-gold-primary/30 transition-all flex flex-col"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ 
                y: -5,
                boxShadow: "0 10px 25px -5px rgba(212, 175, 55, 0.1)"
              }}
            >
              <div className="gold-gradient p-3 rounded-full w-max mb-4 text-dark-bg">
                {service.icon}
              </div>
              
              <h3 className="text-lg sm:text-xl font-bold mb-2 text-gold-secondary">
                {service.title}
              </h3>
              
              <p className="text-gray-300 text-sm sm:text-base mb-4 flex-grow">
                {service.description}
              </p>
              
              <ul className="space-y-2 mt-4">
                {service.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-gold-primary mr-2">•</span>
                    <span className="text-gray-400 text-xs sm:text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <motion.button
                className="mt-6 w-full py-2 sm:py-3 text-xs sm:text-sm rounded-lg border border-gold-primary text-gold-primary hover:bg-gold-primary/10 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Подробнее
              </motion.button>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <motion.a
            href="#contact"
            className="gold-gradient px-6 py-3 sm:px-8 sm:py-4 rounded-full font-bold text-dark-bg inline-flex items-center gap-2 hover:shadow-lg hover:shadow-gold-primary/30 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Получить консультацию
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}