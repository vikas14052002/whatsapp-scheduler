'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'How does the WhatsApp booking bot work?',
    answer: 'Your customers simply message "Hi" to your WhatsApp Business number. The bot automatically shows your services, available dates, and time slots — all inside the chat. They pick a slot, enter their name, and get an instant booking confirmation. No apps to download.',
  },
  {
    question: 'Do my customers need to install an app?',
    answer: 'No. Your customers use the WhatsApp they already have on their phones. That\'s the beauty of BookKar — zero friction for your customers. If they can message, they can book.',
  },
  {
    question: 'Can I collect deposits or advance payments?',
    answer: 'Yes. You can set a deposit amount for any service (e.g., ₹50 for a haircut). Customers pay via UPI before the appointment. This reduces no-shows by up to 80%. Razorpay integration is built-in.',
  },
  {
    question: 'What kind of businesses use BookKar?',
    answer: 'Salons, beauty parlours, clinics, dentists, tuition centres, yoga studios, consultants, spas, and any service business that takes appointments. If your customers book time slots, BookKar works for you.',
  },
  {
    question: 'How much does it cost?',
    answer: 'BookKar starts at just ₹399/month — less than half the price of competitors. The Starter plan includes up to 100 appointments/month, the WhatsApp bot, auto-reminders, and basic analytics. No hidden fees, no setup charges.',
  },
  {
    question: 'Will reminders be sent automatically?',
    answer: 'Yes. BookKar sends automated WhatsApp reminders 24 hours and 1 hour before each appointment. Your customers can confirm or cancel with a single reply. No more manual follow-ups.',
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 lg:py-32 bg-warm-paper">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-saffron-glow font-body mb-3 tracking-wide uppercase">FAQ</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-deep-ink tracking-tight">
            Questions? Answered.
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className={`bg-white rounded-2xl border transition-all duration-300 ${
                  isOpen ? 'border-deep-ink/10 shadow-lg shadow-deep-ink/5' : 'border-deep-ink/5'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-left group"
                >
                  <span className={`font-headline font-semibold text-base sm:text-lg transition-colors duration-200 ${
                    isOpen ? 'text-saffron-glow' : 'text-deep-ink group-hover:text-saffron-glow'
                  }`}>
                    {faq.question}
                  </span>
                  <ChevronDown
                    size={20}
                    className={`text-deep-ink/30 flex-shrink-0 ml-4 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-saffron-glow' : ''
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-out ${
                    isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className={`px-5 sm:px-6 pb-5 sm:pb-6 text-deep-ink/60 font-body leading-relaxed transition-opacity duration-300 ${
                    isOpen ? 'opacity-100' : 'opacity-0'
                  }`}>
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
