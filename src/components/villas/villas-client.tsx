import Link from "next/link";
import VillasBrowser, { type VillasBrowserProps } from "./villas-browser";

export default function VillasClient(props: VillasBrowserProps) {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pb-24 text-charcoal">
      <VillasBrowser {...props} />

      {/* Villa Booking Guide / SEO Content Section */}
      <section className="mt-24 pt-16 border-t border-border-subtle select-none text-charcoal">
        <div className="max-w-4xl mx-auto space-y-12">
          
          <div className="space-y-3">
            <h2 className="text-2xl md:text-3xl font-heading text-[#1B3564] font-bold">
              The Ultimate Guide to Finding Villas for Rent in Lonavala
            </h2>
            <p className="text-sm text-charcoal/70 leading-relaxed font-light">
              Planning a weekend getaway from the city has never been easier. When searching for <strong className="font-semibold text-[#1B3564]">villas for rent in Lonavala</strong>, holidaymakers look for properties that combine seclusion, modern comfort, and premium hospitality. Instead of staying at commercial hotels with crowded common areas, booking private holiday residences gives your group exclusive access to swimming pools, manicured lawns, and customized dining. Stay Willas provides a verified portfolio of handpicked estates designed to deliver a slow luxury experience.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl md:text-2xl font-heading text-[#1B3564] font-bold">
              Why Booking Luxury Villas Near Mumbai is the Perfect Weekend Escape
            </h2>
            <p className="text-sm text-charcoal/70 leading-relaxed font-light">
              For travelers residing in the Mumbai metropolitan area, finding accessible getaway destinations is essential. Reserving <strong className="font-semibold text-[#1B3564]">luxury villas near Mumbai</strong> allows you to bypass airport delays and long train journeys. Situated within a smooth 2-hour drive via the Mumbai-Pune Expressway, these estates let you transition quickly from city traffic into tranquil green valleys.
            </p>
            <p className="text-sm text-charcoal/70 leading-relaxed font-light">
              Whether you are planning a family reunion, a couple&apos;s retreat, or a group staycation, staying at our <strong className="font-semibold text-[#1B3564]">luxury villas near Mumbai</strong> offers a choice of private pool villas and Jacuzzi cottages; check the facilities of your selected property.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl md:text-2xl font-heading text-[#1B3564] font-bold">
              Compare 3 BHK and 4 BHK Stays by Location
            </h2>
            <p className="text-sm text-charcoal/70 leading-relaxed font-light">
              The Angle House in Kamshet, Lonavala is a 3 BHK private pool villa for up to 12 guests. Canopy Crest in Khopoli is a 4 BHK private pool villa with a maximum capacity of 16. Choose by the actual guest limit and sleeping arrangements.
            </p>
            <p className="text-sm text-charcoal/70 leading-relaxed font-light">
              Check bed allocation, bathrooms, meals and event permissions before confirming a group booking.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl md:text-2xl font-heading text-[#1B3564] font-bold">
              Top Amenities at Our Villas for Rent in Lonavala
            </h3>
            <p className="text-sm text-charcoal/70 leading-relaxed font-light">
              Compare the amenities on each listing in our <strong className="font-semibold text-[#1B3564]">villas for rent in Lonavala</strong> collection before booking:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <li className="p-4 bg-white rounded-2xl border border-border-subtle shadow-sm">
                <strong className="text-[#1B3564] block mb-1">Pools or Jacuzzis:</strong> The Angle House has a private pool; Willow Peak cottages have private Jacuzzis.
              </li>
              <li className="p-4 bg-white rounded-2xl border border-border-subtle shadow-sm">
                <strong className="text-[#1B3564] block mb-1">In-House Chef Service:</strong> Freshly prepared gourmet meals, Maharashtrian specialties, barbecues, and Jain cookware.
              </li>
              <li className="p-4 bg-white rounded-2xl border border-border-subtle shadow-sm">
                <strong className="text-[#1B3564] block mb-1">Pet-Friendly Lawns:</strong> Fully fenced manicured gardens for safe outdoor games with pets.
              </li>
              <li className="p-4 bg-white rounded-2xl border border-border-subtle shadow-sm">
                <strong className="text-[#1B3564] block mb-1">Stay Support:</strong> Confirm caretaker availability, pool rules and assistance for your dates.
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl md:text-2xl font-heading text-[#1B3564] font-bold">
              Frequently Asked Questions About Villas for Rent in Lonavala
            </h2>
            <div className="space-y-3">
              <div className="p-5 bg-white rounded-2xl border border-border-subtle shadow-sm space-y-1">
                <h3 className="font-bold text-xs sm:text-sm text-[#1B3564]">Q: What are the best villas for rent in Lonavala with private pools?</h3>
                <p className="text-xs text-charcoal/70 font-light leading-relaxed">
                  A: The Angle House is widely recognized as one of the best villas for rent in Lonavala. It features a private waterfall swimming pool, master suite jacuzzi, 3 BHK accommodation for up to 12 guests in Kamshet, and in-house chef dining.
                </p>
              </div>
              <div className="p-5 bg-white rounded-2xl border border-border-subtle shadow-sm space-y-1">
                <h3 className="font-bold text-xs sm:text-sm text-[#1B3564]">Q: Are your luxury villas near Mumbai pet-friendly?</h3>
                <p className="text-xs text-charcoal/70 font-light leading-relaxed">
                  A: Yes, our luxury villas near Mumbai feature secure, fully fenced lawns so your pets can run and play freely while you relax.
                </p>
              </div>
              <div className="p-5 bg-white rounded-2xl border border-border-subtle shadow-sm space-y-1">
                <h3 className="font-bold text-xs sm:text-sm text-[#1B3564]">Q: How do I reserve a 4 BHK villa in Lonavala for a group getaway?</h3>
                <p className="text-xs text-charcoal/70 font-light leading-relaxed">
                  A: You can book directly online through Stay Willas or connect with our concierge team on WhatsApp for instant date availability and custom meal package quotes.
                </p>
              </div>
            </div>
          </div>

          {/* Villa Homeowner Partner Callout */}
          <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-r from-[#1B3564] via-[#152A50] to-[#0D1B33] text-white border border-[#DAA520]/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#DAA520]/10 rounded-full blur-[90px] pointer-events-none" />
            <div className="relative z-10 space-y-2">
              <span className="text-[#DAA520] text-[10px] font-bold uppercase tracking-[0.25em] block">
                For Luxury Homeowners
              </span>
              <h3 className="text-2xl sm:text-3xl font-heading font-bold text-white">
                Own a Luxury Villa or Estate in Maharashtra?
              </h3>
              <p className="text-white/75 text-xs sm:text-sm font-light max-w-xl leading-relaxed">
                Partner with Stay Willas for hassle-free villa property management, verified HNI guests, dynamic revenue optimization, and zero operational headaches.
              </p>
            </div>
            <Link
              href="/partner"
              className="relative z-10 bg-[#DAA520] hover:bg-[#C4941A] text-[#1B3564] rounded-full px-8 py-4 text-xs font-black tracking-widest uppercase transition-all duration-300 shadow-lg hover:scale-105 active:scale-95 whitespace-nowrap shrink-0"
            >
              PARTNER WITH US &rarr;
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
}
