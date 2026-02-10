
import HeroSection from "@/components/hero";
import FooterSection from "@/components/footer";
import ServicesSection from "@/components/services";
import GallerySection from "@/components/gallery";
import ContactSection from "@/components/contact";
import RubberSection from "@/components/rubber";

export default function Home() {
  return (
    <>
      <HeroSection />
      <section id="servicios" className="scroll-mt-16">
      <ServicesSection />
      </section>
      <RubberSection />
      <section id="galeria" className="scroll-mt-16">
      <GallerySection />
      </section>
      <section id="contacto" className="scroll-mt-16">
      <ContactSection />
      </section>
      <FooterSection />
    </>
  );
}
