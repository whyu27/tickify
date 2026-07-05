import Navbar from '../../components/landing/Navbar';
import Hero from '../../components/landing/Hero';
import Statistics from '../../components/landing/Statistics';
import EventSection from '../../components/landing/EventSection';
import WhyChoose from '../../components/landing/WhyChoose';
import SubscriptionSection from '../../components/landing/SubscriptionSection';
import FAQSection from '../../components/landing/FAQSection';
import Footer from '../../components/landing/Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Navbar />
      <Hero />
      <Statistics />
      <EventSection />
      <WhyChoose />
      <SubscriptionSection />
      <FAQSection />
      <Footer />
    </div>
  );
};

export default LandingPage;
