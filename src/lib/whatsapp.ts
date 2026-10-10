/** Keep prefilled messages readable across WhatsApp clients and font support. */
export function cleanWhatsAppMessage(message: string): string {
  return message
    .replace(/[\p{Extended_Pictographic}\p{Emoji_Modifier}\p{Regional_Indicator}\uFE0F\u200D\u20E3\uFFFD]/gu, "")
    .replace(/[\t ]{2,}/g, " ")
    .replace(/^[\t ]+|[\t ]+$/gm, "")
    .trim();
}

export function encodeWhatsAppMessage(message: string): string {
  return encodeURIComponent(cleanWhatsAppMessage(message));
}

export const PARTNER_WHATSAPP_NUMBER = "919619042310";

export const PARTNER_BLANK_TEMPLATE = `Hello Stay Willas Partnership Team,

I am interested in partnering my property with Stay Willas. Please find my villa details below:

Property Configuration :
1. Villa Name - 
2. Villa Owner name - 
3. Bedroom - 
4. Bathroom - 
5. is 3 phase meter available for electricity backup?? - 
6. Inverter - yes
how many batteries? - 
7. Generator - 
how many kva? - 
8. Water tank capacity Underground (how many litre) - 
over head water tank (how many litre) - 
9. Government waterline - 
10. ACs in bedroom - 
11. ACs in living room - 
12. is caretaker available ? - 
13. Separate room for caretaker available ? - 
14. Google location - 
15. Plot size - sq ft
16. is there a equipped kitchen for chef service? - 
17. Rental expectations - 

Kindly fill this details to understand the property configuration details. Looking forward to discussing a partnership with Stay Willas!`;

export interface PartnerPropertyConfig {
  villaName: string;
  ownerName: string;
  phone?: string;
  email?: string;
  bedrooms: string;
  bathrooms: string;
  threePhaseMeter: string;
  inverter: string;
  inverterBatteries: string;
  generator: string;
  generatorKva: string;
  undergroundTankLitres: string;
  overheadTankLitres: string;
  governmentWaterline: string;
  acsInBedroom: string;
  acsInLivingRoom: string;
  caretakerAvailable: string;
  separateCaretakerRoom: string;
  googleLocation: string;
  plotSizeSqFt: string;
  equippedKitchen: string;
  rentalExpectations: string;
}

export function formatPartnerConfigurationMessage(config: PartnerPropertyConfig): string {
  const plotValue = config.plotSizeSqFt.trim()
    ? config.plotSizeSqFt.toLowerCase().includes("sq")
      ? config.plotSizeSqFt.trim()
      : `${config.plotSizeSqFt.trim()} sq ft`
    : "sq ft";

  return `Hello Stay Willas Partnership Team,

I would like to partner my villa with Stay Willas. Below are the property configuration details for your evaluation:

Property Configuration :
1. Villa Name - ${config.villaName.trim() || "-"}
2. Villa Owner name - ${config.ownerName.trim() || "-"}${config.phone ? ` (${config.phone.trim()})` : ""}
3. Bedroom - ${config.bedrooms.trim() || "-"}
4. Bathroom - ${config.bathrooms.trim() || "-"}
5. is 3 phase meter available for electricity backup?? - ${config.threePhaseMeter}
6. Inverter - ${config.inverter}
how many batteries? - ${config.inverter.toLowerCase() === "yes" ? (config.inverterBatteries.trim() || "-") : "N/A"}
7. Generator - ${config.generator}
how many kva? - ${config.generator.toLowerCase() === "yes" ? (config.generatorKva.trim() || "-") : "N/A"}
8. Water tank capacity Underground (how many litre) - ${config.undergroundTankLitres.trim() || "-"}
over head water tank (how many litre) - ${config.overheadTankLitres.trim() || "-"}
9. Government waterline - ${config.governmentWaterline}
10. ACs in bedroom - ${config.acsInBedroom.trim() || "-"}
11. ACs in living room - ${config.acsInLivingRoom.trim() || "-"}
12. is caretaker available ? - ${config.caretakerAvailable}
13. Separate room for caretaker available ? - ${config.separateCaretakerRoom}
14. Google location - ${config.googleLocation.trim() || "-"}
15. Plot size - ${plotValue}
16. is there a equipped kitchen for chef service? - ${config.equippedKitchen}
17. Rental expectations - ${config.rentalExpectations.trim() || "-"}

Kindly review these property configuration details and let me know the next steps. Thank you!`;
}

export function getPartnerBlankWhatsAppUrl(): string {
  return `https://wa.me/${PARTNER_WHATSAPP_NUMBER}?text=${encodeWhatsAppMessage(PARTNER_BLANK_TEMPLATE)}`;
}

