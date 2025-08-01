'use client';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUpload, FiX, FiFile, FiCheck } from 'react-icons/fi';

const DocumentUpload = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Проверка на мобильное устройство
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isMobile) setIsDragging(true); // Отключаем drag на мобильных
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (isMobile) return; // Отключаем drop на мобильных
    
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleNewFiles(droppedFiles);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      handleNewFiles(Array.from(selectedFiles));
    }
  };

  const handleNewFiles = (newFiles: File[]) => {
    // Проверка на максимальное количество файлов (5)
    if (files.length + newFiles.length > 5) {
      alert(`Максимальное количество файлов: 5. Вы можете загрузить ещё ${5 - files.length} файлов.`);
      return;
    }

    // Проверка на максимальный размер файла (10MB)
    const oversizedFiles = newFiles.filter(file => file.size > 10 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      alert(`Следующие файлы превышают лимит 10MB: ${oversizedFiles.map(f => f.name).join(', ')}`);
      return;
    }

    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) return;
    
    setIsUploading(true);
    
    // Симуляция загрузки
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsUploading(false);
    setIsSuccess(true);
    setFiles([]);
    
    // Сброс успешного состояния через 3 секунды
    setTimeout(() => setIsSuccess(false), 3000);
  };

  return (
    <section className="py-12 sm:py-20 bg-dark-bg">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.h2 
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-16 text-gold-primary"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Загрузка документов
        </motion.h2>

        <motion.div 
          className="max-w-4xl mx-auto bg-dark-card rounded-xl sm:rounded-3xl overflow-hidden border border-gold-primary/20 shadow-lg sm:shadow-xl"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="p-1 gold-gradient" />
          
          <div className="p-4 sm:p-6 md:p-8">
            <motion.div 
              className={`border-2 border-dashed rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-12 text-center cursor-pointer transition-all ${
                isDragging ? 'border-gold-primary bg-gold-primary/10' : 'border-gray-600'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              whileHover={!isMobile ? { scale: 1.02 } : {}}
            >
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                onChange={handleFileChange}
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              <FiUpload className="mx-auto text-3xl sm:text-4xl text-gold-primary mb-3 sm:mb-4" />
              <p className="text-lg sm:text-xl mb-2">{
                isMobile ? 'Нажмите для выбора файлов' : 'Перетащите ваши документы сюда'
              }</p>
              <p className="text-gray-400 mb-3 sm:mb-4">или</p>
              <motion.button
                type="button"
                className="gold-gradient px-4 py-2 sm:px-6 sm:py-3 rounded-full font-bold text-dark-bg text-sm sm:text-base"
                whileHover={!isMobile ? { scale: 1.05 } : {}}
                whileTap={{ scale: 0.95 }}
              >
                Выберите файлы
              </motion.button>
              <p className="text-gray-400 mt-3 sm:mt-4 text-xs sm:text-sm">Поддерживаемые форматы: PDF, DOC, DOCX, JPG, PNG (до 10MB)</p>
            </motion.div>

            {files.length > 0 && (
              <motion.div 
                className="mt-6 sm:mt-8"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gold-secondary">Выбранные файлы ({files.length}/5):</h3>
                <div className="space-y-2 sm:space-y-3 max-h-40 sm:max-h-60 overflow-y-auto pr-2">
                  {files.map((file, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center justify-between bg-dark-bg p-3 sm:p-4 rounded-lg sm:rounded-xl"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center overflow-hidden">
                        <FiFile className="text-gold-primary mr-2 sm:mr-3 text-lg sm:text-xl" />
                        <span className="truncate max-w-[180px] sm:max-w-xs">{file.name}</span>
                        <span className="text-gray-400 ml-2 text-xs sm:text-sm">({(file.size / 1024).toFixed(1)} KB)</span>
                      </div>
                      <button 
                        type="button"
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        onClick={() => handleRemoveFile(index)}
                        aria-label="Удалить файл"
                      >
                        <FiX size={18} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            <motion.button
              type="button"
              onClick={handleSubmit}
              disabled={files.length === 0 || isUploading}
              className={`w-full mt-6 sm:mt-8 py-3 sm:py-4 rounded-full font-bold text-dark-bg flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base ${
                isSuccess 
                  ? 'bg-green-500' 
                  : files.length > 0 
                    ? 'gold-gradient hover:shadow-lg hover:shadow-gold-primary/30' 
                    : 'bg-gray-600 cursor-not-allowed'
              } transition-all`}
              whileHover={files.length > 0 && !isMobile ? { scale: 1.02 } : {}}
              whileTap={files.length > 0 ? { scale: 0.98 } : {}}
            >
              {isUploading ? (
                <>
                  <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Загрузка...
                </>
              ) : isSuccess ? (
                <>
                  <FiCheck size={20} />
                  Успешно отправлено!
                </>
              ) : (
                'Отправить на проверку'
              )}
            </motion.button>
          </div>
        </motion.div>

        <motion.div 
          className="text-center mt-8 sm:mt-12 max-w-2xl mx-auto text-gray-400 text-sm sm:text-base"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <p className="mb-3 sm:mb-4">Все документы проверяются нашими экспертами по шариатскому праву</p>
          <p>Конфиденциальность гарантируется. Максимальный срок проверки - 24 часа</p>
        </motion.div>
      </div>
    </section>
  );
};

export default DocumentUpload;