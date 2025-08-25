import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';
import { HelpCircle, Lightbulb } from 'lucide-react';

export function FAQs() {
  const faqs = [
    {
      question: "What is Dr. Kajal's experience and qualification?",
      answer: "Dr. Kajal Kumari holds a BHMS (Bachelor in Homeopathic Medicine and Surgery) degree and is a qualified homeopathic practitioner. She has extensive experience in treating acute and chronic diseases including skin disorders, respiratory issues, women's health problems, and metabolic conditions. She specializes in dermatology, hair treatment, and holistic healing approaches."
    },
    {
      question: "How do I book an appointment with Dr. Kajal?",
      answer: "You can book an appointment by using our online consultation booking system, sending a WhatsApp message, or visiting our clinic in person. We offer both in-person consultations at our Manpur clinic and online consultations for your convenience. Phone support will be available soon. Our clinic is located at Teacher Colony, Sri Narayan Nagar, Manpur, Gaya - 823003."
    },
    {
      question: "What conditions does Dr. Kajal specialize in treating?",
      answer: "Dr. Kajal specializes in treating a wide range of conditions including: Skin & Hair Disorders (baldness, acne, eczema, psoriasis), Respiratory Issues (asthma, allergic rhinitis), Gastrointestinal Problems (gastritis, piles), Women's Health (PCOD, infertility, menstrual irregularities), Musculoskeletal Diseases (arthritis, joint pain), Neurological Disorders (migraine, anxiety, insomnia), and Metabolic Disorders (thyroid, diabetes, hypertension)."
    },
    {
      question: "Do you provide online consultations?",
      answer: "Yes, we offer comprehensive online consultations for patients who cannot visit our clinic in person. Online consultations include detailed case taking, prescription of homeopathic medicines, and follow-up care. The medicines can be shipped to your location. Online consultations are particularly beneficial for follow-up appointments and for patients living far from our Manpur clinic."
    },
    {
      question: "Is homeopathy safe for children and pregnant women?",
      answer: "Yes, homeopathy is completely safe for children, pregnant women, elderly patients, and even infants. Homeopathic medicines are prepared from natural substances and are highly diluted, making them gentle and free from side effects. Dr. Kajal has successfully treated many children and pregnant women with various conditions including allergies, digestive issues, and emotional problems."
    },
    {
      question: "How long does homeopathic treatment typically take?",
      answer: "The duration of treatment varies depending on the condition, its severity, and how long you've had it. Acute conditions may show improvement within days to weeks, while chronic conditions typically require 3-6 months of consistent treatment. Dr. Kajal provides realistic timelines during your consultation and monitors progress regularly to adjust treatment as needed."
    },
    {
      question: "Can I take homeopathic medicines with other medications?",
      answer: "Generally, homeopathic medicines can be taken alongside conventional medications as they work differently and don't interfere with other drugs. However, it's important to inform Dr. Kajal about all medications you're currently taking during your consultation. She will provide specific guidance based on your individual case and may recommend gradual reduction of conventional medicines as your condition improves."
    },
    {
      question: "Do homeopathic medicines have any side effects?",
      answer: "Homeopathic medicines, when prescribed by a qualified practitioner like Dr. Kajal, are safe and free from side effects. They are prepared from natural substances in highly diluted forms. Occasionally, there might be a temporary worsening of symptoms (called homeopathic aggravation) which is actually a positive sign indicating the medicine is working. Dr. Kajal monitors all patients closely to ensure safe and effective treatment."
    },
    {
      question: "What should I expect during my first visit?",
      answer: "During your first consultation, Dr. Kajal will take a detailed case history including your current symptoms, medical history, family history, lifestyle, emotional state, and food preferences. This comprehensive approach helps her understand your individual constitution and select the most appropriate homeopathic remedy. The initial consultation typically takes 45-60 minutes. You'll receive your personalized treatment plan and detailed instructions for taking the medicines."
    },
    {
      question: "What are your clinic timings and location details?",
      answer: "Our clinic is located at Teacher Colony, Sri Narayan Nagar, Manpur, Gaya - 823003 (nearby ICICI Bank Manpur). You can reach us via email at arogyambihar@gmail.com or use our online booking system. For specific clinic timings and to schedule an appointment, please use our contact form or visit us in person. Phone support will be available soon. We also offer flexible appointment slots to accommodate working professionals and students."
    }
  ];

  return (
    <section className="py-12 lg:py-24 bg-gradient-to-br from-neutral-50 to-blue-50/30 relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-4 lg:space-y-6 mb-10 lg:mb-12 animate-fade-in-up">
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-3 py-2 lg:px-4 lg:py-2 shadow-soft border border-neutral-200">
            <HelpCircle className="w-4 h-4 text-blue-600" />
            <span className="text-neutral-700 font-medium text-xs lg:text-sm">Common Questions</span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-display leading-tight text-neutral-900 px-2">
            Frequently Asked Questions
          </h2>
          
          <p className="text-sm lg:text-body-large text-neutral-600 max-w-2xl mx-auto leading-relaxed px-4">
            Get answers to common questions about Dr. Kajal's practice and homeopathic treatment.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto px-2">
          <Accordion type="single" collapsible className="space-y-3 lg:space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-white rounded-2xl lg:rounded-3xl border border-neutral-200 shadow-soft hover:shadow-md transition-all duration-300 overflow-hidden animate-fade-in-up"
              >
                <AccordionTrigger className="px-4 lg:px-8 py-4 lg:py-6 hover:no-underline text-left group min-h-[60px] lg:min-h-[72px]">
                  <div className="flex items-start space-x-3 lg:space-x-4 w-full">
                    <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg lg:rounded-xl flex items-center justify-center mt-1 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <Lightbulb className="w-3 h-3 lg:w-4 lg:h-4 text-blue-600" />
                    </div>
                    <span className="font-semibold text-neutral-900 leading-relaxed pr-4 text-sm lg:text-base">
                      {faq.question}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 lg:px-8 pb-4 lg:pb-6">
                  <div className="ml-9 lg:ml-12 text-neutral-700 leading-relaxed text-sm lg:text-base">
                    {faq.answer}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-16 animate-fade-in-up" style={{ animationDelay: '1s' }}>
          <div className="inline-block bg-gradient-to-r from-white to-blue-50 rounded-3xl p-8 shadow-lg border border-neutral-200">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl flex items-center justify-center mx-auto shadow-soft">
                <HelpCircle className="w-8 h-8 text-blue-600" />
              </div>
              
              <div>
                <h3 className="text-xl font-display font-semibold text-neutral-900 mb-2">
                  Still Have Questions?
                </h3>
                <p className="text-neutral-600 mb-6">
                  Contact Dr. Kajal directly for personalized answers about your health concerns.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-2xl shadow-soft hover:shadow-md transition-all duration-300 font-medium flex items-center justify-center space-x-2"
                  onClick={() => {
                    const phoneNumber = '+919430030564';
                    const message = 'Hello Dr. Kajal! I have some questions about homeopathic treatment. Can you help me?';
                    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
                    window.open(whatsappUrl, '_blank');
                  }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                  <span>Chat with Our Doctor</span>
                </button>
                <button 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl shadow-soft hover:shadow-md transition-all duration-300 font-medium"
                  onClick={() => window.open('/contact', '_self')}
                >
                  Visit Contact Page
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}