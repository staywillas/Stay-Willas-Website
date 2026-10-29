export type LeadAttribution = {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  landingPath?: string;
};

const attributionKey = "staywillas_angle_house_attribution";
const measuredLeadKey = "staywillas_angle_house_measured_lead";
const adsSendTo = "AW-18249597691/27FDCI2psKUdEPuFi_5D";
const canopyCrestAdsSendTo = "AW-18249597691/j5euCKeW3a0dEPuFi_5D";

type Gtag = (...args: unknown[]) => void;
type AnalyticsWindow = Window & { dataLayer?: IArguments[]; gtag?: Gtag };

function googleTag(...args: unknown[]) {
  if (typeof window === "undefined") return;
  const browser = window as AnalyticsWindow;
  browser.dataLayer ??= [];
  if (!browser.gtag) {
    browser.gtag = function () {
      browser.dataLayer?.push(arguments);
    };
  }
  browser.gtag(...args);
}

export function getAngleHouseAttribution(): LeadAttribution {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const latest: LeadAttribution = {
    utmSource: params.get("utm_source") || undefined,
    utmMedium: params.get("utm_medium") || undefined,
    utmCampaign: params.get("utm_campaign") || undefined,
    utmTerm: params.get("utm_term") || undefined,
    gclid: params.get("gclid") || undefined,
    gbraid: params.get("gbraid") || undefined,
    wbraid: params.get("wbraid") || undefined,
    landingPath: window.location.pathname,
  };

  try {
    const previous = JSON.parse(window.sessionStorage.getItem(attributionKey) || "{}") as LeadAttribution;
    const hasNewCampaign = Object.entries(latest).some(([key, value]) => key !== "landingPath" && value);
    const attribution = hasNewCampaign || !previous.landingPath ? latest : previous;
    window.sessionStorage.setItem(attributionKey, JSON.stringify(attribution));
    return attribution;
  } catch {
    return latest;
  }
}

export function trackAngleHouseEngagement(action: "call_click" | "whatsapp_click" | "contact_details_submitted") {
  googleTag("event", `angle_house_${action}`, { property: "the-angle-house" });
}

export function trackAngleHouseBookingEnquiry(leadId: string, checkIn: Date, checkOut: Date) {
  if (typeof window === "undefined") return;
  const stayKey = `${checkIn.toISOString().slice(0, 10)}_${checkOut.toISOString().slice(0, 10)}`;
  try {
    if (window.sessionStorage.getItem(`${measuredLeadKey}_${stayKey}`)) return;
    window.sessionStorage.setItem(`${measuredLeadKey}_${stayKey}`, leadId);
  } catch {
    // Tracking should never block a booking request.
  }

  googleTag("event", "generate_lead", {
    property: "the-angle-house",
    lead_type: "dated_booking_enquiry",
    transaction_id: leadId,
  });

  googleTag("event", "conversion", { send_to: adsSendTo, transaction_id: leadId });
}

export function trackCanopyCrestBookingEnquiry() {
  if (typeof window === "undefined") return;

  googleTag("event", "generate_lead", {
    property: "canopy-crest",
    lead_type: "dated_booking_enquiry",
  });

  googleTag("event", "conversion", { send_to: canopyCrestAdsSendTo });
}
