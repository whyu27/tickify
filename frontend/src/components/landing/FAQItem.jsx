import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-white/8 rounded-2xl overflow-hidden hover:border-white/15 transition-all duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-4 md:px-6 md:py-5 flex items-center justify-between text-left bg-[#161616] hover:bg-[#1a1a1a] transition-colors duration-200"
      >
        <span className="text-base font-semibold text-white pr-4">
          {question}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-[#A0A0A0] flex-shrink-0 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
          strokeWidth={1.5}
          size={20}
        />
      </button>
      
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <div className="px-4 py-4 md:px-6 md:py-5 bg-[#161616] border-t border-white/6">
          <p className="text-base text-[#A0A0A0] leading-relaxed">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FAQItem;
