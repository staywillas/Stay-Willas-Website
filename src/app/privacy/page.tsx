import React from "react";
import { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy & Guest Data Protection | Stay Willas",
  description: "Read the Stay Willas privacy policy & guest data protection standards. Learn how we handle your personal information and transaction security.",
  keywords: ["privacy policy", "guest data protection", "stay willas privacy"],
  alternates: {
    canonical: "https://www.staywillas.com/privacy",
  },
  openGraph: {
    title: "Privacy Policy & Guest Data Protection | Stay Willas",
    description: "Read the Stay Willas privacy policy & guest data protection standards. Learn how we handle your personal information and transaction security.",
    url: "https://www.staywillas.com/privacy",
    images: [{ url: "https://www.staywillas.com/images/hero-villa.png" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy & Guest Data Protection | Stay Willas",
    description: "Read the Stay Willas privacy policy & guest data protection standards. Learn how we handle your personal information and transaction security.",
    images: ["https://www.staywillas.com/images/hero-villa.png"],
  },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-bg-primary text-text-primary flex flex-col justify-between selection:bg-accent-primary selection:text-white">
      <div>
        <Navbar />

        <section className="pt-36 pb-24 px-6 md:px-12 lg:px-24 max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-[#DAA520]/10 flex items-center justify-center text-[#DAA520]">
              <Shield size={24} />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest font-mono">Last Updated: July 09, 2026</span>
              <h1 className="text-3xl md:text-5xl font-heading text-[#1B3564] font-bold leading-tight mt-1">
                Privacy Policy & Guest Data Protection
              </h1>
            </div>
          </div>

          {/* Policy Body */}
          <div className="prose max-w-none text-left font-sans text-slate-800 space-y-8 font-light text-sm sm:text-base leading-relaxed">
            <p>
              At <strong>Stay Willas</strong>, accessible from <a href="https://www.staywillas.com" className="underline font-bold text-accent-primary">www.staywillas.com</a>, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Stay Willas and how we use it.
            </p>
            <p>
              If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.
            </p>

            <h2 className="text-xl md:text-2xl font-heading text-[#1B3564] font-bold pt-4 border-b border-[#DAA520]/20 pb-2">
              1. Information We Collect
            </h2>
            <p>
              The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.
            </p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li><strong>Account Registration:</strong> When you register for an Account via our identity providers (Clerk), we may ask for your contact information, including items such as name, email address, and telephone number.</li>
              <li><strong>Booking Details:</strong> When you book a villa, we collect details such as dates of stay, number of guests, identity documents (required by local laws), and special stay requests.</li>
              <li><strong>Inquiry Forms:</strong> If you contact us directly via our inquiry form, we may receive additional information about you such as your name, email address, phone number, the contents of the message and/or attachments you may send us.</li>
            </ul>

            <h2 className="text-xl md:text-2xl font-heading text-[#1B3564] font-bold pt-4 border-b border-[#DAA520]/20 pb-2">
              2. How We Use Your Information
            </h2>
            <p>
              We use the information we collect in various ways, including to:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li>Provide, operate, and maintain our website and booking features.</li>
              <li>Improve, personalize, and expand our website customer experience.</li>
              <li>Understand and analyze how you use our website.</li>
              <li>Process your transactions and manage reservation schedules.</li>
              <li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing purposes.</li>
              <li>Send you emails or SMS updates about bookings.</li>
              <li>Find and prevent fraud.</li>
            </ul>

            <h2 className="text-xl md:text-2xl font-heading text-[#1B3564] font-bold pt-4 border-b border-[#DAA520]/20 pb-2">
              3. Consent and Data Security
            </h2>
            <p>
              By using our website, you hereby consent to our Privacy Policy and agree to its terms. We protect your personal data using standard secure protocols, databases, and encryption. We do not sell or rent guest information to third-party brokers.
            </p>


          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
