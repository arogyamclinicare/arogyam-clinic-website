import { HeroSection } from './HeroSection';
import { AboutUs } from './AboutUs';
import { TreatmentsSection } from './TreatmentsSection';
import { FAQs } from './FAQs';
import { ClinicHours } from './ClinicHours';

export function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section id="home">
        <HeroSection />
      </section>

      {/* About Us Section */}
      <section id="about-us">
        <AboutUs />
      </section>

      {/* Clinic Hours Section */}
      <ClinicHours />

      {/* Treatments Section */}
      <section id="treatments">
        <TreatmentsSection />
      </section>

      {/* FAQs Section */}
      <section id="faqs">
        <FAQs />
      </section>
    </div>
  );
}