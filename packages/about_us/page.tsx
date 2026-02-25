"use client";

import { Card, CardContent } from "@repo/ui/card";
import { Badge } from "@repo/ui/badge";
import { Lightbulb, Target, Users, Zap, Heart, Rocket } from "lucide-react";
import { useEffect, useState } from "react";

import { HeroHeader } from "@repo/components/header";
import FooterSection from "@repo/components/footer";
import { WhatsAppFloat } from "@repo/components/landing/whatsapp-float";

import TeamSection from "@repo/components/team-section";
import AboutUsSection from "@repo/components/about-us-section";

interface WhatsAppContact {
  name: string;
  subtitle: string;
  phone: string;
}

export default function AboutUsPagePackage() {
  const [isVisible, setIsVisible] = useState(false);
  const [contacts, setContacts] = useState<WhatsAppContact[]>([]);
  
    useEffect(() => {
      const loadContacts = async () => {
        try {
          const whatsappModule = await import("@repo/lib/utils/whatsapp_contacts");
          const contactsData = await whatsappModule.getWhatsAppContacts();
          setContacts(contactsData);
        } catch (error) {
          console.error("Error loading contacts:", error);
        }
      };
  
      loadContacts();
    }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <HeroHeader />
      <AboutUsSection />
      <TeamSection />
      <FooterSection />
      <WhatsAppFloat
        contacts={contacts}
        headerText="Iniciar conversación"
        subtitleText=""
        responseTimeText="El equipo suele responder en unos minutos."
      />
    </>
  );
}
