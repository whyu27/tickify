import ParticipantNavbar from '../../components/participant/ParticipantNavbar';
import Hero from '../../components/landing/Hero';
import Statistics from '../../components/landing/Statistics';
import ParticipantEventSection from '../../components/participant/ParticipantEventSection';
import FAQSection from '../../components/landing/FAQSection';
import Footer from '../../components/landing/Footer';

const ParticipantHome = () => {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <ParticipantNavbar />
      <Hero
        title="Discover Blockchain Events"
        subtitle="Browse verified blockchain-powered events, purchase NFT tickets securely, and manage all your tickets in one place."
        exploreTo="/participant/home#events"
        learnMoreTo="/participant/home#faq"
      />
      <Statistics />
      <ParticipantEventSection />
      <FAQSection />
      <Footer />
    </div>
  );
};

export default ParticipantHome;
