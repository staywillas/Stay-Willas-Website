const fs = require('fs');
const path = require('path');
const { jsPDF } = require('jspdf');

function generateCaseStudyPDF() {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 18;
  const contentWidth = pageWidth - margin * 2; // 174mm

  // Colors
  const navy = [15, 23, 42];      // #0f172a
  const gold = [217, 119, 6];     // #d97706
  const emerald = [16, 185, 129]; // #10b981
  const darkGray = [51, 65, 85];  // #334155
  const lightGray = [241, 245, 249]; // #f1f5f9
  const borderGray = [226, 232, 240]; // #e2e8f0

  let y = margin;

  function checkPageBreak(spaceNeeded) {
    if (y + spaceNeeded > pageHeight - 20) {
      addFooter();
      doc.addPage();
      y = margin;
      drawHeader();
    }
  }

  function drawHeader() {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text('STAY WILLAS RESEARCH & INTELLIGENCE REPORT', margin, y);
    doc.text('COMPETITOR BENCHMARK: EKOSTAY VS STAYVISTA', pageWidth - margin, y, { align: 'right' });
    y += 3;
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.4);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;
  }

  function addFooter() {
    const pageNum = doc.internal.getNumberOfPages();
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);
    doc.text('Confidential - For Stay Willas Strategic Growth Team', margin, pageHeight - 7);
    doc.text(`Page ${pageNum}`, pageWidth - margin, pageHeight - 7, { align: 'right' });
  }

  // ==========================================
  // PAGE 1: TITLE & EXECUTIVE SUMMARY
  // ==========================================
  drawHeader();

  // Badge
  doc.setFillColor(254, 243, 199);
  doc.roundedRect(margin, y, 68, 7, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(180, 83, 9);
  doc.text('EXECUTIVE CASE STUDY & BENCHMARK', margin + 3, y + 5);
  y += 12;

  // Main Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text('Villa Booking Experience & Flow Analysis', margin, y);
  y += 7;

  // Subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(gold[0], gold[1], gold[2]);
  doc.text('Deep Dive: EkoStay vs StayVista vs Stay Willas Luxury Villas', margin, y);
  y += 5;

  // Meta line
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Prepared for: Stay Willas Operations & Tech | Focus: Conversion Rate, Payment Friction & UX', margin, y);
  y += 8;

  // Divider
  doc.setDrawColor(gold[0], gold[1], gold[2]);
  doc.setLineWidth(1);
  doc.line(margin, y, margin + 40, y);
  y += 8;

  // Section: Executive Summary Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, y, contentWidth, 36, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text('1. EXECUTIVE SUMMARY & KEY TAKEAWAYS', margin + 5, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  const execSummary = 
    "In India's luxury villa rental ecosystem, booking flow architecture directly dictates conversion rate, average booking value, and guest retention. StayVista operates as an enterprise hospitality aggregator focusing on 100% upfront automated digital checkout, high customer qualification, and mandatory strict terms. In contrast, EkoStay deploys a hybrid model with partial 50% advance payments and heavy human-assisted WhatsApp sales intervention to lower upfront commitment barriers. Stay Willas has the unique opportunity to combine the instantaneous zero-friction speed of StayVista with the high-trust flexible deposit model of EkoStay.";
  
  const splitExec = doc.splitTextToSize(execSummary, contentWidth - 10);
  doc.text(splitExec, margin + 5, y + 14);
  y += 42;

  // Section 2: EkoStay Analysis
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text('2. EKOSTAY: ARCHITECTURE, FLOW & TACTICS', margin, y);
  y += 6;

  // Overview paragraph
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  const ekoOverview = 
    "EkoStay (founded 2018) manages 300+ holiday homes across 20+ destinations (Lonavala, Alibaug, Goa, Panchgani). Their digital funnel prioritizes lead acquisition and sales-assisted closing over pure self-serve checkout.";
  doc.text(doc.splitTextToSize(ekoOverview, contentWidth), margin, y);
  y += 10;

  // EkoStay Steps
  const ekoSteps = [
    {
      step: 'Step 1: Search & Filter',
      desc: 'Location selector, check-in/out date picker, and guest count. Displays instant price per night.'
    },
    {
      step: 'Step 2: Property Page & Lead Interception',
      desc: 'Users view amenities, pool photos, house rules. Prominent floating WhatsApp button ("Chat with Stay Expert") intercepts hesitancy.'
    },
    {
      step: 'Step 3: Booking Options Provided',
      desc: 'Two primary checkout paths: (A) "Book Now" via Airpay gateway, OR (B) "Inquire Now / Send Enquiry" which routes directly to CRM for agent callback.'
    },
    {
      step: 'Step 4: Flexible Split-Payment Model',
      desc: 'Guests can pay 50% advance token online to lock the dates, with the remaining 50% payable at check-in or 7 days prior. Drastically reduces booking drop-off.'
    },
    {
      step: 'Step 5: Meals & Security Deposit',
      desc: 'Meals are NOT bundled automatically. Semi-equipped kitchens; meals charged separately per head. Refundable security deposit (₹5,000 - ₹15,000) collected at check-in.'
    }
  ];

  ekoSteps.forEach((s) => {
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, contentWidth, 11, 2, 2, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(gold[0], gold[1], gold[2]);
    doc.text(s.step, margin + 4, y + 4.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.8);
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    doc.text(s.desc, margin + 4, y + 8.5);
    y += 13;
  });

  // Pros & Cons Grid for EkoStay
  y += 2;
  const colW = (contentWidth - 4) / 2;
  
  // Pros box
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(187, 247, 208);
  doc.roundedRect(margin, y, colW, 28, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(22, 101, 52);
  doc.text('EkoStay Strengths', margin + 4, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(21, 128, 61);
  const ekoPros = [
    '• 50% advance option yields higher initial impulse conversion.',
    '• WhatsApp concierge closes custom requirements & large groups.',
    '• Clear upfront breakdown of refundable security deposit.'
  ];
  ekoPros.forEach((p, idx) => doc.text(p, margin + 4, y + 10 + (idx * 5)));

  // Cons box
  doc.setFillColor(254, 242, 242);
  doc.setDrawColor(254, 202, 202);
  doc.roundedRect(margin + colW + 4, y, colW, 28, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(153, 27, 27);
  doc.text('EkoStay Friction Points', margin + colW + 8, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(185, 28, 28);
  const ekoCons = [
    '• Manual offline balance collection causes check-in friction.',
    '• High dependency on manual sales agents; delays at night.',
    '• Inconsistent instant confirmation on certain unmanaged villas.'
  ];
  ekoCons.forEach((c, idx) => doc.text(c, margin + colW + 8, y + 10 + (idx * 5)));

  // End of Page 1
  addFooter();
  doc.addPage();
  y = margin;

  // ==========================================
  // PAGE 2: STAYVISTA ANALYSIS & MATRIX
  // ==========================================
  drawHeader();

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text('3. STAYVISTA: ARCHITECTURE, FLOW & TACTICS', margin, y);
  y += 6;

  const vistaOverview = 
    "StayVista (formerly Vista Rooms, backed by DSG & Singularity) manages 500+ luxury estates. Positioned as high-end luxury hospitality, their booking flow is institutional, strictly gated, and optimized for maximum Average Order Value (AOV).";
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.text(doc.splitTextToSize(vistaOverview, contentWidth), margin, y);
  y += 10;

  const vistaSteps = [
    {
      step: 'Step 1: Hyper-Curated Discovery',
      desc: 'Filtering by occasions (Family getaway, Corporate, Celebrations), curated collections, and destination amenities.'
    },
    {
      step: 'Step 2: Transparent Experience Configuration',
      desc: 'Real-time dynamic pricing calculation, showing per-night rate, taxes (GST 18%), cleaning fee, and pre-selected meal options.'
    },
    {
      step: 'Step 3: 100% Upfront Digital Checkout',
      desc: 'Requires 100% full payment upfront via Razorpay / Juspay (Credit Cards, EMI, UPI, Net Banking). No partial payment at check-in allowed.'
    },
    {
      step: 'Step 4: Meal Bundling & Chef Service Upsell',
      desc: 'Guests must select either fixed Veg/Non-Veg meal packages per day or pay mandatory chef service fees. No self-cooking in premium properties.'
    },
    {
      step: 'Step 5: Automated Verification & Concierge Handover',
      desc: 'Immediately issues automated PDF voucher and WhatsApp bot triggers mandatory digital KYC ID upload and security deposit payment before arrival.'
    }
  ];

  vistaSteps.forEach((s) => {
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, contentWidth, 11, 2, 2, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(navy[0], navy[1], navy[2]);
    doc.text(s.step, margin + 4, y + 4.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.8);
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    doc.text(s.desc, margin + 4, y + 8.5);
    y += 13;
  });

  // Pros & Cons Grid for StayVista
  y += 2;
  // Pros box
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(187, 247, 208);
  doc.roundedRect(margin, y, colW, 28, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(22, 101, 52);
  doc.text('StayVista Strengths', margin + 4, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(21, 128, 61);
  const vistaPros = [
    '• 100% upfront payment guarantees 0% check-in cash collection issues.',
    '• High trust UI with verified reviews, 360-degree virtual tours.',
    '• Seamless digital KYC and automated WhatsApp onboarding.'
  ];
  vistaPros.forEach((p, idx) => doc.text(p, margin + 4, y + 10 + (idx * 5)));

  // Cons box
  doc.setFillColor(254, 242, 242);
  doc.setDrawColor(254, 202, 202);
  doc.roundedRect(margin + colW + 4, y, colW, 28, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(153, 27, 27);
  doc.text('StayVista Friction Points', margin + colW + 8, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(185, 28, 28);
  const vistaCons = [
    '• 100% upfront payment creates high resistance for tickets > ₹40,000.',
    '• Rigid cancellation policies turn away spontaneous travelers.',
    '• Mandatory meal charges inflate the perceived baseline price.'
  ];
  vistaCons.forEach((c, idx) => doc.text(c, margin + colW + 8, y + 10 + (idx * 5)));

  y += 33;

  // Section 4: Comparative Matrix Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text('4. DIRECT COMPARATIVE MATRIX', margin, y);
  y += 5;

  // Table header
  doc.setFillColor(navy[0], navy[1], navy[2]);
  doc.rect(margin, y, contentWidth, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text('FEATURE / DIMENSION', margin + 3, y + 4.8);
  doc.text('EKOSTAY', margin + 50, y + 4.8);
  doc.text('STAYVISTA', margin + 92, y + 4.8);
  doc.text('STAY WILLAS (OUR STRATEGY)', margin + 132, y + 4.8);
  y += 7;

  const tableRows = [
    {
      feat: 'Primary Booking Mode',
      eko: 'Hybrid (Instant + WhatsApp)',
      vista: 'Pure Instant Online Checkout',
      willas: 'Dual: 1-Click Instant + Direct Concierge'
    },
    {
      feat: 'Advance Payment Required',
      eko: '50% Advance online',
      vista: '100% Full Payment upfront',
      willas: 'Flexible: 25% Token or 100% Full Pay'
    },
    {
      feat: 'Balance Payment',
      eko: 'At check-in / 7 days before',
      vista: 'N/A (Collected upfront)',
      willas: 'At Check-in (UPI/Cash/Card)'
    },
    {
      feat: 'Payment Gateways',
      eko: 'Airpay, UPI, Bank Transfer',
      vista: 'Razorpay, Juspay, EMI, Cards',
      willas: 'Direct UPI, Federal Bank, Razorpay'
    },
    {
      feat: 'Direct Property Selector',
      eko: 'No (Search by City first)',
      vista: 'No (Location/Theme search)',
      willas: 'YES (Instant 1-click on Homepage)'
    },
    {
      feat: 'Meal Handling',
      eko: 'A la carte / Kitchen fee',
      vista: 'Fixed mandatory meal package',
      willas: 'Transparent packages or private kitchen'
    },
    {
      feat: 'Security Deposit',
      eko: '₹5k - ₹15k at check-in',
      vista: 'Pre-collected digitally',
      willas: 'Instant UPI Hold / On-arrival deposit'
    }
  ];

  tableRows.forEach((row, idx) => {
    const isEven = idx % 2 === 0;
    doc.setFillColor(isEven ? 248 : 255, isEven ? 250 : 255, isEven ? 252 : 255);
    doc.rect(margin, y, contentWidth, 7, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y + 7, margin + contentWidth, y + 7);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(navy[0], navy[1], navy[2]);
    doc.text(row.feat, margin + 3, y + 4.8);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    doc.text(row.eko, margin + 50, y + 4.8);
    doc.text(row.vista, margin + 92, y + 4.8);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(gold[0], gold[1], gold[2]);
    doc.text(row.willas, margin + 132, y + 4.8);

    y += 7;
  });

  // End of Page 2
  addFooter();
  doc.addPage();
  y = margin;

  // ==========================================
  // PAGE 3: RECOMMENDATIONS & IMPLEMENTATION
  // ==========================================
  drawHeader();

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text('5. ACTIONABLE STRATEGY & BLUEPRINT FOR STAY WILLAS', margin, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  const recIntro = 
    "Based on benchmark findings, Stay Willas should avoid both StayVista's high payment barrier (100% full upfront) and EkoStay's heavy manual friction (delayed WhatsApp responses). Below are the 4 optimized booking workflows designed specifically for Stay Willas properties (The Angle House, Canopy Crest, Casa De Reva, and Willow Peak: Breeze, Crest, Heaven).";
  doc.text(doc.splitTextToSize(recIntro, contentWidth), margin, y);
  y += 12;

  // The 4 Workflow Pillars
  const recommendations = [
    {
      title: 'Workflow Option 1: Instant Direct Property Booking (Live on Homepage)',
      tag: 'FASTEST (0 FRICTION)',
      tagBg: [220, 252, 231],
      tagText: [22, 101, 52],
      desc: 'Users choose property directly from Homepage Dropdown ("The Angle House", "Willow Peak Breeze", etc.), pick dates, and immediately open the booking confirmation modal without navigating through multi-step search pages. Eliminates 2 intermediate page loads.'
    },
    {
      title: 'Workflow Option 2: The "Split-Pay" Advantage (Beat StayVista)',
      tag: 'MAX CONVERSION',
      tagBg: [254, 243, 199],
      tagText: [180, 83, 9],
      desc: 'Allow guests to reserve luxury villas with a 25% or 50% advance token via instant UPI or card. The remaining balance is payable at check-in. This removes high-ticket hesitation for bookings above ₹25,000 while maintaining a confirmed calendar lock.'
    },
    {
      title: 'Workflow Option 3: VIP Concierge & WhatsApp Fast-Track (Beat EkoStay)',
      tag: 'HIGH AOV & EVENTS',
      tagBg: [224, 231, 255],
      tagText: [67, 56, 202],
      desc: 'For corporate offsites, weddings, and celebrations requiring customized catering or 20+ guests, one-click WhatsApp routing pre-fills property name, guest count, and dates into the chat for an immediate quote within 90 seconds.'
    },
    {
      title: 'Workflow Option 4: Zero-Fee Bank Transfer & Corporate Invoicing',
      tag: '0% PAYMENT GATEWAY FEE',
      tagBg: [241, 245, 249],
      tagText: [51, 65, 85],
      desc: 'Direct RTGS / NEFT / IMPS transfer directly to the verified Federal Bank account (Sushant Girish Chandra Tiwari, A/C: 99980100571517, IFSC: FDRL0001542). Saves the business 2% to 3% gateway MDR commission on high-value bookings.'
    }
  ];

  recommendations.forEach((r) => {
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, contentWidth, 23, 2, 2, 'FD');

    // Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(navy[0], navy[1], navy[2]);
    doc.text(r.title, margin + 4, y + 6);

    // Tag
    doc.setFillColor(r.tagBg[0], r.tagBg[1], r.tagBg[2]);
    doc.roundedRect(margin + contentWidth - 46, y + 2.5, 42, 5, 1, 1, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(r.tagText[0], r.tagText[1], r.tagText[2]);
    doc.text(r.tag, margin + contentWidth - 25, y + 6, { align: 'center' });

    // Desc
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.8);
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    const splitDesc = doc.splitTextToSize(r.desc, contentWidth - 8);
    doc.text(splitDesc, margin + 4, y + 11.5);

    y += 26;
  });

  // Section: Payment Gateway on Personal Account Answer Box
  y += 2;
  doc.setFillColor(238, 242, 255);
  doc.setDrawColor(199, 210, 254);
  doc.roundedRect(margin, y, contentWidth, 34, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.8);
  doc.setTextColor(49, 46, 129);
  doc.text('INTEGRATION QUERY: CAN PAYMENT GATEWAYS WORK ON A REGULAR/SAVINGS ACCOUNT?', margin + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.6);
  doc.setTextColor(30, 41, 59);
  const pgAnswer = 
    "YES. Razorpay, Cashfree, and Instamojo allow Individual / Sole Proprietor onboarding without a registered Private Limited company or Current Bank Account.\n" +
    "• Setup: Choose 'Unregistered Business / Individual' or 'Freelancer/Proprietor' during KYC.\n" +
    "• Bank Link: Connect the Federal Bank account (Sushant Tiwari) with PAN, Aadhaar, and cancelled cheque.\n" +
    "• Monthly Limits: ₹50,000/month initially until video/document KYC completion, then upgraded to unlimited.\n" +
    "• Alternative Zero-MDR Solution: Deploy Direct UPI QR (PhonePe / GPay Business) linked to Sushant's Federal Bank account (VPA: sushant650@federal) for instant 0% fee settlement.";
  
  doc.text(doc.splitTextToSize(pgAnswer, contentWidth - 8), margin + 4, y + 11.5);
  y += 38;

  // Signoff & Official Seal Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 20, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(navy[0], navy[1], navy[2]);
  doc.text('STAY WILLAS LUXURY HOSPITALITY GROUP', margin + 4, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Properties: The Angle House | Canopy Crest | Casa De Reva | Willow Peak (Breeze, Crest, Heaven)', margin + 4, y + 9.5);
  doc.text('Account: Federal Bank | Sushant Girish Chandra Tiwari | A/C: 99980100571517 | IFSC: FDRL0001542', margin + 4, y + 14);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(16, 185, 129);
  doc.text('Status: READY FOR PRODUCTION DEPLOYMENT', pageWidth - margin - 4, y + 14, { align: 'right' });

  addFooter();

  // Save to public/downloads/
  const outputPath = path.join(__dirname, 'public', 'downloads', 'Ekostay_vs_StayVista_Booking_Case_Study.pdf');
  const pdfBytes = doc.output();
  fs.writeFileSync(outputPath, Buffer.from(pdfBytes, 'binary'));
  console.log(`PDF generated successfully at: ${outputPath} (${pdfBytes.length} bytes)`);
}

generateCaseStudyPDF();
