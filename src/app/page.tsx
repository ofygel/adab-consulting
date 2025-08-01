import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import VideoCarousel from '@/components/VideoCarousel';
import ServicesSection from '@/components/ServicesSection';
import DocumentUpload from '@/components/DocumentUpload';
import ReviewsSection from '@/components/ReviewsSection';

export default function Home() {
  return (
    <main>
      <Header />
      <section id="home">
        <HeroSection />
      </section>
      <section id="services">
        <VideoCarousel />
        <ServicesSection />
      </section>
      <section id="upload">
        <DocumentUpload />
      </section>
      <section id="reviews">
        <ReviewsSection />
      </section>
      {/* Секция "about" и "send-contract" добавь ниже если нужны */}
      {/* <section id="about"><AboutSection /></section> */}
      {/* <section id="send-contract"><SendContractSection /></section> */}
    </main>
  );
}
