import CallToAction from "@/components/call-to-action";
import FeaturesCards from "@/components/features-1";
import FeaturesButtons from "@/components/features-12";
import FooterSection from "@/components/footer";
import HeroSection from "@/components/hero-section";
import { WhatsAppFloat } from "@/components/landing/whatsapp-float";
import SeasonSection from "@/components/season-section";
import { getWhatsAppContacts } from "@/lib/utils/whatsapp_contacts";
import Image from "next/image";
import ContactSection from "@/components/contact-section";
import FAQSection from "@/components/faq-section";
import FloatingInfo from "@/components/landing/floating-info";
import { getPhoneContacts } from "@/lib/utils/phone_contacts";
import { PhoneFloat } from "@/components/landing/phone-float";
;


export default async function Home() {
  const whatsappcontacts = await getWhatsAppContacts();
  const phoneContacts = await getPhoneContacts();

  // Determinar qué botones están activos
  const isWhatsAppActive = whatsappcontacts.length > 0;
  const isPhoneActive = phoneContacts.length > 0;

  // Si WhatsApp está activo, teléfono va arriba ("top")
  // Si WhatsApp no está activo, teléfono va abajo ("bottom")
  const phonePosition = isWhatsAppActive ? "top" : "bottom";
  return (
    <>
      <HeroSection />
  
      {/* <SeasonSection /> */}
      <section id="services">
        <FeaturesCards />
      </section>

      <section id="areas">
        {/* <FeaturesButtons /> */}
      </section>
      
      <FAQSection />

      <section id="contact-section">
      <ContactSection/>
      </section>
      <FooterSection />
       {isWhatsAppActive && (
      <WhatsAppFloat
        contacts={whatsappcontacts}
        headerText="Iniciar conversación"
        subtitleText=""
        responseTimeText="El equipo suele responder en unos minutos."
      />
      )}
      {isPhoneActive && (
        <PhoneFloat
          contacts={phoneContacts}
          headerText="Llamar por Teléfono"
          subtitleText=""
          responseTimeText="Te atenderemos en horario de atención."
          position={phonePosition}
        />
       )}
    </>
  );
}
