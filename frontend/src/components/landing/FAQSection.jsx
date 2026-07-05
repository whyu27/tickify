import { faqData } from '../../data/faq';
import FAQItem from './FAQItem';

const FAQSection = () => {
  return (
    <section id="faq" className="py-20 bg-[#0A0A0A]">
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12 flex flex-col items-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-[#A0A0A0] max-w-2xl mx-auto">
            Everything you need to know about Tickify and blockchain ticketing.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto space-y-4">
          {faqData.map((faq) => (
            <FAQItem
              key={faq.id}
              question={faq.question}
              answer={faq.answer}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
