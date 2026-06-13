import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Check if database is already seeded
  const productCount = await prisma.product.count();
  if (productCount > 0) {
    console.log("Database already seeded, skipping...");
    return;
  }

  console.log("Seeding database...");

  // ==================== PRODUCTS ====================
  console.log("Creating products...");

  const ltProducts = [
    {
      name: "CRP - Control & Relay Panel",
      slug: "crp-control-relay-panel",
      category: "LT Panels",
      description:
        "Control and Relay Panels are designed for protection, control, and monitoring of electrical power systems. These panels house relays, control switches, and indicating instruments for effective power system management. Built with high-quality components and strict adherence to IS/IEC standards, our CRP panels ensure reliable operation in demanding industrial environments.",
      features: JSON.stringify([
        "Numerical/digital relay integration",
        "SCADA compatibility",
        "Anti-pumping and trip circuit supervision",
        "Customized mimic bus bar arrangement",
        "Dust and vermin proof enclosures",
        "Type tested for short circuit withstand",
      ]),
      imageUrl: "https://shrivaarielectricals.com/img/portfolio/630x400.jpg",
      order: 1,
    },
    {
      name: "PCC - Power Control Centre",
      slug: "pcc-power-control-centre",
      category: "LT Panels",
      description:
        "Power Control Centres are the central distribution boards that receive power from transformers or generators and distribute it to various loads. Our PCC panels are engineered for maximum safety, reliability, and ease of maintenance, featuring robust busbar systems and advanced protection schemes suitable for heavy industrial applications.",
      features: JSON.stringify([
        "Rated up to 6300A busbar capacity",
        "Fully type-tested assemblies",
        "Drawout and fixed type ACBs",
        "Integrated power monitoring systems",
        "Capacitor bank integration for PF correction",
        "Multi-tier busbar arrangements",
      ]),
      imageUrl: "https://shrivaarielectricals.com/img/portfolio/630x400.jpg",
      order: 2,
    },
    {
      name: "MCC - Motor Control Centre",
      slug: "mcc-motor-control-centre",
      category: "LT Panels",
      description:
        "Motor Control Centres provide centralized control and protection for multiple electric motors. Our MCC panels feature intelligent motor protection relays, soft starters, and VFD integration, ensuring optimal motor performance and energy efficiency across industrial operations.",
      features: JSON.stringify([
        "Intelligent motor protection relays",
        "VFD and soft starter integration",
        "DOL and star-delta starters",
        "Auto/manual control modes",
        "Interlocking and safety features",
        "Plug-in type compartments for easy maintenance",
      ]),
      imageUrl: "https://shrivaarielectricals.com/img/portfolio/630x400.jpg",
      order: 3,
    },
    {
      name: "PMCC - Power Motor Control Centre",
      slug: "pmcc-power-motor-control-centre",
      category: "LT Panels",
      description:
        "Power Motor Control Centres combine the functionality of PCC and MCC in a single integrated panel. These hybrid panels are ideal for medium-scale industries that need both power distribution and motor control in a compact footprint, reducing installation costs and floor space requirements.",
      features: JSON.stringify([
        "Combined PCC and MCC functionality",
        "Optimized floor space utilization",
        "Integrated power and motor control",
        "Simplified cabling and installation",
        "Centralized monitoring and control",
        "Cost-effective solution for medium industries",
      ]),
      imageUrl: "https://shrivaarielectricals.com/img/portfolio/630x400.jpg",
      order: 4,
    },
    {
      name: "SSBs - Sub Switch Board",
      slug: "ssbs-sub-switch-board",
      category: "LT Panels",
      description:
        "Sub Switch Boards distribute power from the main PCC to specific areas or departments within a facility. Designed for flexibility and safety, our SSBs feature modular construction, allowing easy expansion and modification as facility needs evolve.",
      features: JSON.stringify([
        "Modular and expandable design",
        "SFU/MCCB incoming options",
        "Outgoing feeders with individual protection",
        "Isolating switches for safe maintenance",
        "Compact footprint for space-constrained areas",
        "Compliance with IS 8623 / IEC 61439",
      ]),
      imageUrl: "https://shrivaarielectricals.com/img/portfolio/630x400.jpg",
      order: 5,
    },
    {
      name: "DG - DG Synchronization Panel",
      slug: "dg-synchronization-panel",
      category: "LT Panels",
      description:
        "DG Synchronization Panels enable multiple diesel generators to operate in parallel, sharing the load efficiently. Our synchronization panels feature advanced auto-synch relays, load sharing controllers, and comprehensive protection systems for seamless power backup in critical facilities.",
      features: JSON.stringify([
        "Auto/manual synchronization modes",
        "Active and reactive load sharing",
        "Reverse power relay protection",
        "Black start capability",
        "Auto start-stop with mains failure detection",
        "Multi-generator paralleling up to 16 sets",
      ]),
      imageUrl: "https://shrivaarielectricals.com/img/portfolio/630x400.jpg",
      order: 6,
    },
    {
      name: "APFC - Automatic Power Factor Control",
      slug: "apfc-automatic-power-factor-control",
      category: "LT Panels",
      description:
        "Automatic Power Factor Control panels dynamically switch capacitor banks to maintain the power factor close to unity, reducing electricity bills and avoiding penalties from utilities. Our APFC panels feature intelligent controllers with real-time monitoring and step-wise capacitor switching.",
      features: JSON.stringify([
        "Microcontroller-based APFC relay",
        "Real-time PF monitoring and display",
        "Step-wise automatic capacitor switching",
        "Harmonic filtering with detuned reactors",
        "THD monitoring and protection",
        "Target PF setting (0.95 to 0.99)",
      ]),
      imageUrl: "https://shrivaarielectricals.com/img/portfolio/630x400.jpg",
      order: 7,
    },
    {
      name: "PLC - Program Logic Control",
      slug: "plc-program-logic-control",
      category: "LT Panels",
      description:
        "Programmable Logic Control panels integrate industrial automation with electrical power distribution. Our PLC panels feature industry-standard controllers from Siemens, Allen Bradley, and Schneider, enabling intelligent process control, data acquisition, and remote monitoring capabilities.",
      features: JSON.stringify([
        "SCADA and HMI integration",
        "Modular I/O configuration",
        "Communication protocols (Modbus, Profibus, Ethernet)",
        "Data logging and trending",
        "Alarm management systems",
        "Remote monitoring and control capability",
      ]),
      imageUrl: "https://shrivaarielectricals.com/img/portfolio/630x400.jpg",
      order: 8,
    },
    {
      name: "Busducts",
      slug: "busducts",
      category: "LT Panels",
      description:
        "Busducts are enclosed busbar systems used for high-current power distribution between transformers, panels, and loads. Our busducts are manufactured with high-conductivity copper or aluminum busbars, insulated and enclosed for safe, reliable, and efficient power transmission across industrial facilities.",
      features: JSON.stringify([
        "Copper and aluminum busbar options",
        "Ratings up to 6300A",
        "IP54/IP65 protection levels",
        "Plug-in tap-off boxes for flexibility",
        "Fire-rated and non-fire-rated variants",
        "Low impedance design for minimal voltage drop",
      ]),
      imageUrl: "https://shrivaarielectricals.com/img/portfolio/630x400.jpg",
      order: 9,
    },
  ];

  const htProducts = [
    {
      name: "11 KV Panel",
      slug: "11-kv-panel",
      category: "HT Panels",
      description:
        "11 KV HT Panels are designed for receiving and distributing high tension power at 11kV voltage level. These panels feature vacuum circuit breakers, current and voltage transformers, and comprehensive protection relays for safe and reliable medium voltage power distribution in industrial and commercial facilities.",
      features: JSON.stringify([
        "VCB rated up to 630A/1250A",
        "Current transformer and potential transformer integration",
        "Numerical relay protection (overcurrent, earth fault)",
        "Busbar rating up to 1250A",
        "Interlocked and safety-grounded design",
        "Indoor and outdoor configurations",
      ]),
      imageUrl: "https://shrivaarielectricals.com/img/portfolio/630x400.jpg",
      order: 10,
    },
    {
      name: "22 KV Panel",
      slug: "22-kv-panel",
      category: "HT Panels",
      description:
        "22 KV HT Panels are engineered for medium voltage power distribution at the 22kV level. These panels are commonly used in large industrial plants and utility substations, featuring advanced vacuum circuit breaker technology and sophisticated protection systems for critical power infrastructure.",
      features: JSON.stringify([
        "VCB with high breaking capacity",
        "Comprehensive protection scheme",
        "Auto-reclosing functionality",
        "SCADA integration ready",
        "Seismic-qualified construction",
        "Type tested as per IS/IEC standards",
      ]),
      imageUrl: "https://shrivaarielectricals.com/img/portfolio/630x400.jpg",
      order: 11,
    },
    {
      name: "33 KV Panel",
      slug: "33-kv-panel",
      category: "HT Panels",
      description:
        "33 KV HT Panels are the highest voltage class panels in our product range, designed for heavy industrial applications and utility substations. These panels incorporate state-of-the-art vacuum/SF6 circuit breakers, advanced numerical relays, and robust busbar systems for mission-critical power distribution.",
      features: JSON.stringify([
        "VCB/SF6 circuit breaker options",
        "Busbar ratings up to 2000A",
        "Advanced numerical protection relays",
        "Differential protection for transformers",
        "Auto-changeover and interlocking",
        "Complete switchyard solutions",
      ]),
      imageUrl: "https://shrivaarielectricals.com/img/portfolio/630x400.jpg",
      order: 12,
    },
  ];

  for (const product of [...ltProducts, ...htProducts]) {
    await prisma.product.create({ data: product });
  }
  console.log(`Created ${ltProducts.length + htProducts.length} products`);

  // ==================== SERVICES ====================
  console.log("Creating services...");

  const services = [
    {
      name: "Design & Engineering",
      slug: "design-engineering",
      description:
        "Our Design & Engineering services cover the complete electrical system design from concept to detailed engineering. We employ experienced engineers who use cutting-edge design tools and adhere to national and international standards to deliver optimized electrical solutions for industrial, commercial, and utility sectors.",
      features: JSON.stringify([
        "Single line diagram preparation",
        "Load flow and short circuit studies",
        "Protection coordination studies",
        "Cable sizing and routing design",
        "Earthing and lightning protection design",
        "Detailed Bill of Materials preparation",
      ]),
      order: 1,
    },
    {
      name: "Project Execution",
      slug: "project-execution",
      description:
        "We provide end-to-end project execution services for electrical installations, from procurement and installation to testing and commissioning. Our project management team ensures timely delivery, quality workmanship, and adherence to safety standards across all project phases.",
      features: JSON.stringify([
        "Turnkey project management",
        "Procurement and logistics coordination",
        "Installation and erection supervision",
        "Testing and commissioning",
        "Documentation and handover",
        "Post-commissioning support",
      ]),
      order: 2,
    },
    {
      name: "Testing",
      slug: "testing",
      description:
        "Our testing services include comprehensive electrical testing and commissioning of HT/LT panels, transformers, switchyards, and protection systems. We use calibrated testing equipment and follow IS/IEC standards to ensure all installations meet performance and safety requirements.",
      features: JSON.stringify([
        "Type testing and routine testing",
        "Relay testing and calibration",
        "CT/PT testing and ratio verification",
        "Insulation resistance testing",
        "Contact resistance measurement",
        "Megger and high voltage testing",
      ]),
      order: 3,
    },
    {
      name: "Energy & Harmonic Audit",
      slug: "energy-harmonic-audit",
      description:
        "Our Energy and Harmonic Audit services help industries identify energy wastage, power quality issues, and harmonic distortion problems. We provide detailed analysis and actionable recommendations to improve energy efficiency, reduce electricity costs, and ensure compliance with IEEE 519 harmonic standards.",
      features: JSON.stringify([
        "Power quality analysis and monitoring",
        "Harmonic measurement and assessment",
        "Energy consumption profiling",
        "Power factor optimization studies",
        "IEEE 519 compliance verification",
        "Cost-benefit analysis for improvements",
      ]),
      order: 4,
    },
    {
      name: "AMC",
      slug: "amc",
      description:
        "Our Annual Maintenance Contracts provide preventive and breakdown maintenance services for all types of electrical installations. Our dedicated service teams ensure minimal downtime and maximum equipment life through regular inspections, timely repairs, and proactive maintenance strategies.",
      features: JSON.stringify([
        "Scheduled preventive maintenance",
        "24/7 breakdown support",
        "Spare parts management",
        "Thermography scanning",
        "Oil testing for transformers",
        "Performance monitoring and reporting",
      ]),
      order: 5,
    },
    {
      name: "HT/LT Panel Retrofitting",
      slug: "ht-lt-panel-retrofitting",
      description:
        "We specialize in retrofitting and upgrading existing HT and LT panels with modern switchgear, protection relays, and control systems. Our retrofitting solutions extend the life of existing installations while improving safety, reliability, and compliance with current standards.",
      features: JSON.stringify([
        "Old switchgear replacement",
        "Relay upgrade to numerical relays",
        "Busbar uprating and replacement",
        "Control circuit modernization",
        "Insulation refurbishment",
        "Compliance upgrade to latest standards",
      ]),
      order: 6,
    },
    {
      name: "Liasion with CEIG",
      slug: "liasion-ceig",
      description:
        "We provide liaison services with the Chief Electrical Inspector to Government (CEIG) for obtaining statutory approvals, inspections, and certifications for electrical installations. Our experienced team handles all documentation and coordination to ensure smooth and timely statutory compliance.",
      features: JSON.stringify([
        "CEIG approval and certification",
        "Statutory inspection coordination",
        "Documentation preparation and submission",
        "Follow-up with inspectorate",
        "Compliance certificate procurement",
        "Renewal and periodic inspection management",
      ]),
      order: 7,
    },
    {
      name: "Liasion with TNEB/KPTCL/APTRANSCO/TSTRANSCO",
      slug: "liasion-utilities",
      description:
        "We facilitate liaison with state electricity utilities including TNEB, KPTCL, APTRANSCO, and TSTRANSCO for power supply agreements, load enhancements, and grid connectivity approvals. Our established relationships with utility companies ensure faster processing and issue resolution.",
      features: JSON.stringify([
        "Power supply agreement facilitation",
        "Load enhancement applications",
        "Grid connectivity approvals",
        "Metering and billing dispute resolution",
        "Transformer and line construction coordination",
        "Regulatory compliance assistance",
      ]),
      order: 8,
    },
    {
      name: "Solar Works",
      slug: "solar-works",
      description:
        "Our Solar Works division provides comprehensive solar energy solutions including design, engineering, procurement, installation, and commissioning of rooftop and ground-mounted solar power plants. We deliver turnkey EPC solutions that help industries reduce energy costs and carbon footprint.",
      features: JSON.stringify([
        "Rooftop and ground-mounted solar EPC",
        "Site assessment and feasibility study",
        "System design and engineering",
        "Grid-tied and off-grid solutions",
        "Net metering facilitation",
        "O&M and performance monitoring",
      ]),
      order: 9,
    },
  ];

  for (const service of services) {
    await prisma.service.create({ data: service });
  }
  console.log(`Created ${services.length} services`);

  // ==================== CLIENTS ====================
  console.log("Creating clients...");

  const clients = [
    // ── Auto & Ancillary ──
    { name: "Ashok Leyland", industry: "Auto & Ancillary", location: "Hosur", description: "Leading commercial vehicle manufacturer — HT switchyard & panel supply", logoUrl: "https://shrivaarielectricals.com/img/client/1.jpg", order: 1 },
    { name: "TVS Motor Company", industry: "Auto & Ancillary", location: "Hosur", description: "Two-wheeler & three-wheeler major — complete electrification projects", logoUrl: "https://shrivaarielectricals.com/img/client/2.jpg", order: 2 },
    { name: "Hyundai Motor India", industry: "Auto & Ancillary", location: "Sriperumbudur", description: "Passenger car giant — substation & HT panel installation", logoUrl: "https://shrivaarielectricals.com/img/client/3.jpg", order: 3 },
    { name: "TVS Srichakra Ltd", industry: "Auto & Ancillary", location: "Madurai", description: "Tyre & rubber products — 11KV VCB panels & protection systems", logoUrl: "https://shrivaarielectricals.com/img/client/4.jpg", order: 4 },
    { name: "Sundaram Clayton", industry: "Auto & Ancillary", location: "Chennai", description: "Auto components & braking systems — LT panel supply", logoUrl: "https://shrivaarielectricals.com/img/client/5.jpg", order: 5 },
    { name: "MRF Tyres", industry: "Auto & Ancillary", location: "Tiruvottiyur", description: "Tyre manufacturing leader — PCC & MCC panels", logoUrl: "https://shrivaarielectricals.com/img/client/6.jpg", order: 6 },
    { name: "Renault Nissan Automotive", industry: "Auto & Ancillary", location: "Chennai", description: "Car manufacturing JV — power distribution panels", logoUrl: "https://shrivaarielectricals.com/img/client/7.jpg", order: 7 },

    // ── Engineering ──
    { name: "Delta Electronics India", industry: "Engineering", location: "Hosur", description: "Power electronics & automation — 11KV transformer & VCB panels", logoUrl: "https://shrivaarielectricals.com/img/client/22.jpg", order: 8 },
    { name: "Crompton Greaves", industry: "Engineering", location: "Chennai", description: "Electrical equipment manufacturer — HT panel & switchyard projects", logoUrl: "https://shrivaarielectricals.com/img/client/23.jpg", order: 9 },
    { name: "Elgi Equipments Ltd", industry: "Engineering", location: "Coimbatore", description: "Compressor & automotive equipment — complete LT panel solutions", logoUrl: "https://shrivaarielectricals.com/img/client/24.jpg", order: 10 },
    { name: "LMW Ltd", industry: "Engineering", location: "Coimbatore", description: "Textile machinery manufacturer — PCC & MCC panel supply", logoUrl: "https://shrivaarielectricals.com/img/client/25.jpg", order: 11 },
    { name: "Bosch Ltd", industry: "Engineering", location: "Bangalore", description: "Technology & services company — industrial electrification", logoUrl: "https://shrivaarielectricals.com/img/client/26.jpg", order: 12 },

    // ── Forging ──
    { name: "MM Forging", industry: "Forging", location: "Viralimalai", description: "Steel forging major — 132KV/11KV switchyard construction & AMC", logoUrl: "https://shrivaarielectricals.com/img/client/36.jpg", order: 13 },
    { name: "Bharat Forge", industry: "Forging", location: "Pune", description: "Forging & automotive components — HT panel supply", logoUrl: "https://shrivaarielectricals.com/img/client/37.jpg", order: 14 },
    { name: "Ramakrishna Forgings", industry: "Forging", location: "Hyderabad", description: "Forging products manufacturer — substation installation", logoUrl: "https://shrivaarielectricals.com/img/client/38.jpg", order: 15 },

    // ── Electronics ──
    { name: "Dell International", industry: "Electronics", location: "Chennai", description: "IT hardware manufacturing — power distribution panels", logoUrl: "https://shrivaarielectricals.com/img/client/27.jpg", order: 16 },
    { name: "Flextronics India", industry: "Electronics", location: "Sriperumbudur", description: "Electronics manufacturing services — LT panel solutions", logoUrl: "https://shrivaarielectricals.com/img/client/28.jpg", order: 17 },
    { name: "Samsung India Electronics", industry: "Electronics", location: "Sriperumbudur", description: "Consumer electronics — HT/LT panel installation", logoUrl: "https://shrivaarielectricals.com/img/client/8.jpg", order: 18 },

    // ── Power & Energy ──
    { name: "Solon India Pvt Ltd", industry: "Power & Energy", location: "Mothagam", description: "Solar energy company — 33KV bay extension for 10MW solar plant", logoUrl: "https://shrivaarielectricals.com/img/client/45.jpg", order: 19 },
    { name: "TNEB (Tamil Nadu Electricity Board)", industry: "Power & Energy", location: "Chennai", description: "State utility — grid connectivity & substation projects", logoUrl: "https://shrivaarielectricals.com/img/client/46.jpg", order: 20 },
    { name: "Adani Green Energy", industry: "Power & Energy", location: "Mumbai", description: "Renewable energy — solar switchyard & evacuation systems", logoUrl: "https://shrivaarielectricals.com/img/client/47.jpg", order: 21 },
    { name: "NTPC Ltd", industry: "Power & Energy", location: "New Delhi", description: "Power generation — switchyard & protection panel supply", logoUrl: "https://shrivaarielectricals.com/img/client/48.jpg", order: 22 },

    // ── Metal ──
    { name: "M.J. Casting Limited", industry: "Metal", location: "Hosur", description: "Castings & foundry — 33KV 1250A VCB panel with SCADA integration", logoUrl: "https://shrivaarielectricals.com/img/client/86.jpg", order: 23 },
    { name: "JSW Steel", industry: "Metal", location: "Salem", description: "Steel manufacturing — HT switchyard & panel retrofitting", logoUrl: "https://shrivaarielectricals.com/img/client/87.jpg", order: 24 },
    { name: "Tata Steel", industry: "Metal", location: "Jamshedpur", description: "Steel major — LT panel supply & AMC services", logoUrl: "https://shrivaarielectricals.com/img/client/88.jpg", order: 25 },

    // ── Chemicals ──
    { name: "Grasim Industries", industry: "Chemicals", location: "Nagpur", description: "Cement, fibre & chemicals — panel supply & electrification", logoUrl: "https://shrivaarielectricals.com/img/client/108.jpg", order: 26 },
    { name: "Coromandel International", industry: "Chemicals", location: "Chennai", description: "Fertilizers & chemicals — HT panel & protection systems", logoUrl: "https://shrivaarielectricals.com/img/client/172.jpg", order: 27 },
    { name: "Chemplast Sanmar", industry: "Chemicals", location: "Cuddalore", description: "PVC & specialty chemicals — 11KV electrification project", logoUrl: "https://shrivaarielectricals.com/img/client/173.jpg", order: 28 },

    // ── Commercial ──
    { name: "Madras Security Printers", industry: "Commercial", location: "Chennai", description: "Security printing — 11KV/433V electrification project", logoUrl: "https://shrivaarielectricals.com/img/client/78.jpg", order: 29 },
    { name: "ITC Grand Chola", industry: "Commercial", location: "Chennai", description: "Luxury hotel — DG synchronization & APFC panels", logoUrl: "https://shrivaarielectricals.com/img/client/79.jpg", order: 30 },
    { name: "Prestige Group", industry: "Commercial", location: "Bangalore", description: "Real estate developer — LT panel supply for commercial buildings", logoUrl: "https://shrivaarielectricals.com/img/client/80.jpg", order: 31 },

    // ── Hospitals & Institutions ──
    { name: "PSG Institute of Technology", industry: "Hospitals & Institutions", location: "Coimbatore", description: "Engineering institution — 11KV campus electrification", logoUrl: "https://shrivaarielectricals.com/img/client/60.jpg", order: 32 },
    { name: "Apollo Hospitals", industry: "Hospitals & Institutions", location: "Chennai", description: "Healthcare chain — DG sync panels & backup power systems", logoUrl: "https://shrivaarielectricals.com/img/client/61.jpg", order: 33 },
    { name: "Sri Ramachandra Institute", industry: "Hospitals & Institutions", location: "Chennai", description: "Medical university — HT/LT panel installation", logoUrl: "https://shrivaarielectricals.com/img/client/62.jpg", order: 34 },
    { name: "VIT University", industry: "Hospitals & Institutions", location: "Vellore", description: "Technical university — substation & campus electrification", logoUrl: "https://shrivaarielectricals.com/img/client/63.jpg", order: 35 },

    // ── Petroleum ──
    { name: "Indian Oil Corporation", industry: "Petroleum", location: "Chennai", description: "Petroleum refinery — hazardous area panel supply", logoUrl: "https://shrivaarielectricals.com/img/client/101.jpg", order: 36 },
    { name: "HPCL", industry: "Petroleum", location: "Bangalore", description: "Oil & gas distribution — HT panel & switchyard", logoUrl: "https://shrivaarielectricals.com/img/client/102.jpg", order: 37 },

    // ── Food Industry ──
    { name: "Britannia Industries", industry: "Food Industry", location: "Chennai", description: "Food processing major — LT panel & APFC installation", logoUrl: "https://shrivaarielectricals.com/img/client/128.jpg", order: 38 },
    { name: "Murray & Roberts (M&F)", industry: "Food Industry", location: "Coimbatore", description: "Food processing equipment — MCC panel supply", logoUrl: "https://shrivaarielectricals.com/img/client/129.jpg", order: 39 },

    // ── Textiles ──
    { name: "Vardhman Textiles", industry: "Textiles", location: "Coimbatore", description: "Textile manufacturer — PCC & MCC panels for spinning mills", logoUrl: "https://shrivaarielectricals.com/img/client/127.jpg", order: 40 },
    { name: "Arvind Ltd", industry: "Textiles", location: "Bangalore", description: "Textile & apparel major — LT panel solutions", logoUrl: "https://shrivaarielectricals.com/img/client/130.jpg", order: 41 },

    // ── Pharma ──
    { name: "Sun Pharma", industry: "Pharma", location: "Chennai", description: "Pharmaceutical manufacturer — cleanroom panel supply", logoUrl: "https://shrivaarielectricals.com/img/client/125.jpg", order: 42 },
    { name: "Dr. Reddy's Laboratories", industry: "Pharma", location: "Hyderabad", description: "Pharma major — HT panel & UPS integration", logoUrl: "https://shrivaarielectricals.com/img/client/126.jpg", order: 43 },

    // ── MNC ──
    { name: "Saint-Gobain India", industry: "MNC", location: "Sriperumbudur", description: "Glass manufacturing MNC — HT panel & switchyard installation", logoUrl: "https://shrivaarielectricals.com/img/client/52.jpg", order: 44 },
    { name: "Titan Company Ltd", industry: "MNC", location: "Hosur", description: "Watch & jewellery MNC — complete LT panel solutions", logoUrl: "https://shrivaarielectricals.com/img/client/53.jpg", order: 45 },
    { name: "Volvo Eicher Commercial Vehicles", industry: "MNC", location: "Pithampur", description: "Commercial vehicle MNC — electrification projects", logoUrl: "https://shrivaarielectricals.com/img/client/54.jpg", order: 46 },

    // ── IT ──
    { name: "Infosys Ltd", industry: "IT", location: "Bangalore", description: "IT services major — DG sync & APFC panels for campuses", logoUrl: "https://shrivaarielectricals.com/img/client/29.jpg", order: 47 },
    { name: "Wipro Technologies", industry: "IT", location: "Bangalore", description: "IT services — power distribution & backup panels", logoUrl: "https://shrivaarielectricals.com/img/client/30.jpg", order: 48 },
    { name: "TCS (Tata Consultancy Services)", industry: "IT", location: "Chennai", description: "IT services — campus electrification & panel supply", logoUrl: "https://shrivaarielectricals.com/img/client/31.jpg", order: 49 },

    // ── Real Estate ──
    { name: "DLF Ltd", industry: "Real Estate", location: "Chennai", description: "Real estate developer — LT panel supply for IT parks", logoUrl: "https://shrivaarielectricals.com/img/client/169.jpg", order: 50 },
    { name: "Sobha Ltd", industry: "Real Estate", location: "Bangalore", description: "Real estate — residential & commercial panel installation", logoUrl: "https://shrivaarielectricals.com/img/client/170.jpg", order: 51 },

    // ── Cranes ──
    { name: "ACE Ltd (Action Construction Equipment)", industry: "Cranes", location: "Chennai", description: "Crane & construction equipment — LT panel supply", logoUrl: "https://shrivaarielectricals.com/img/client/75.jpg", order: 52 },

    // ── Granites ──
    { name: "Pokarna Ltd", industry: "Granites", location: "Hyderabad", description: "Granite & quartz surfaces — HT panel installation", logoUrl: "https://shrivaarielectricals.com/img/client/135.jpg", order: 53 },

    // ── Government ──
    { name: "CPWD (Central Public Works Dept)", industry: "Government", location: "Chennai", description: "Government infrastructure — panel supply for public buildings", logoUrl: "https://shrivaarielectricals.com/img/client/109.jpg", order: 54 },
    { name: "Tamil Nadu Housing Board", industry: "Government", location: "Chennai", description: "Government housing — LT panel & substation projects", logoUrl: "https://shrivaarielectricals.com/img/client/110.jpg", order: 55 },

    // ── Airport ──
    { name: "Chennai International Airport (AAI)", industry: "Airport", location: "Chennai", description: "Airport authority — backup power & APFC panels", logoUrl: "https://shrivaarielectricals.com/img/client/111.jpg", order: 56 },

    // ── Carbon ──
    { name: "Graphite India Ltd", industry: "Carbon", location: "Bangalore", description: "Carbon & graphite products — HT panel supply", logoUrl: "https://shrivaarielectricals.com/img/client/112.jpg", order: 57 },

    // ── Media ──
    { name: "The Hindu Group", industry: "Media", location: "Chennai", description: "Publishing & media — printing press electrification", logoUrl: "https://shrivaarielectricals.com/img/client/122.jpg", order: 58 },
  ];

  for (const client of clients) {
    await prisma.client.create({ data: client });
  }
  console.log(`Created ${clients.length} clients`);

  // ==================== TESTIMONIALS ====================
  console.log("Creating testimonials...");

  const testimonials = [
    {
      name: "Rajesh Kumar",
      company: "Ashok Leyland",
      designation: "Vice President - Engineering",
      content:
        "Shri Vaari Electricals has been our trusted partner for over a decade. Their expertise in HT panel manufacturing and switchyard projects is exceptional. The quality of their panels and the professionalism of their project execution team have consistently exceeded our expectations. We consider them an extension of our own engineering team.",
      rating: 5,
      order: 1,
    },
    {
      name: "Dr. Meena Krishnan",
      company: "PSG Institute of Technology",
      designation: "Director - Infrastructure",
      content:
        "The 11KV electrification project executed by Shri Vaari for our campus was completed on time and within budget. Their technical team demonstrated deep understanding of our requirements and provided innovative solutions. The after-sales support has been outstanding, making them our go-to electrical contractor.",
      rating: 5,
      order: 2,
    },
    {
      name: "Suresh Babu",
      company: "TVS Srichakra Ltd",
      designation: "General Manager - Projects",
      content:
        "We have been associated with Shri Vaari for our VCB panel requirements and the experience has been excellent. Their design team pays meticulous attention to detail, and their manufacturing facility maintains the highest quality standards. The panels have been performing flawlessly since installation.",
      rating: 5,
      order: 3,
    },
    {
      name: "Anand Sharma",
      company: "Delta Electronics India",
      designation: "Head of Operations",
      content:
        "Shri Vaari's EPC capabilities in transformer and VCB panel installations are truly impressive. Their team handled the complete electrification project for our Hosur facility with remarkable efficiency. The safety standards they maintain on-site are exemplary. Highly recommended for any industrial electrical project.",
      rating: 5,
      order: 4,
    },
    {
      name: "Priya Venkataraman",
      company: "Solon India Pvt Ltd",
      designation: "Project Director",
      content:
        "The 33KV bay extension for our 10MW solar project was a complex undertaking, but Shri Vaari delivered it flawlessly. Their understanding of solar grid integration requirements and their liaison capabilities with utility companies made the entire process smooth. A truly dependable EPC partner.",
      rating: 4,
      order: 5,
    },
    {
      name: "Karthik Rajan",
      company: "MM Forging",
      designation: "Chief Technical Officer",
      content:
        "Shri Vaari has been instrumental in setting up our 132KV switchyard and it has been running without any issues since commissioning. Their project management is commendable—they kept us informed at every stage and delivered the project ahead of schedule. Their AMC service ensures our systems run at peak performance year-round.",
      rating: 5,
      order: 6,
    },
  ];

  for (const testimonial of testimonials) {
    await prisma.testimonial.create({ data: testimonial });
  }
  console.log(`Created ${testimonials.length} testimonials`);

  // ==================== BLOGS ====================
  console.log("Creating blogs...");

  const blogs = [
    {
      title: "The Future of Electrical Panel Manufacturing in India",
      slug: "future-of-electrical-panel-manufacturing-in-india",
      excerpt:
        "India's electrical panel manufacturing sector is undergoing a transformation driven by smart grid technology, IoT integration, and the push for Make in India. Explore the trends shaping the industry's future.",
      content: `India's electrical panel manufacturing industry is at a pivotal juncture. With the government's push for indigenous manufacturing under the "Make in India" initiative and the rapid adoption of smart grid technologies, the sector is poised for significant growth and transformation.

## The Smart Panel Revolution

Modern electrical panels are no longer just passive distribution boards. The integration of IoT sensors, cloud connectivity, and intelligent monitoring systems has transformed them into smart devices capable of real-time data analytics, predictive maintenance, and remote control. Indian manufacturers are increasingly adopting these technologies to stay competitive in the global market.

## Key Trends Shaping the Industry

### 1. Digital Twin Technology
Manufacturers are leveraging digital twin technology to create virtual replicas of electrical panels, enabling simulation, testing, and optimization before physical production begins. This reduces development time and costs significantly.

### 2. Sustainable Manufacturing
With growing emphasis on sustainability, manufacturers are adopting eco-friendly materials, energy-efficient production processes, and recyclable components. The shift towards green manufacturing is not just an environmental imperative but also a competitive advantage.

### 3. Automation and Industry 4.0
Factory automation, robotic assembly lines, and AI-powered quality control systems are becoming standard in panel manufacturing facilities. Industry 4.0 adoption is improving precision, reducing errors, and increasing production capacity.

### 4. Customization and Modular Design
Customers increasingly demand customized solutions tailored to their specific requirements. Modular panel designs that allow easy configuration, expansion, and modification are gaining popularity.

## The Road Ahead

The Indian electrical panel market is projected to grow at a CAGR of over 8% through 2030, driven by infrastructure development, industrialization, and the renewable energy sector. Manufacturers who invest in technology, quality, and innovation will lead this growth story.

At Shri Vaari Electricals, we are committed to staying at the forefront of these technological advancements, continuously upgrading our capabilities to deliver world-class electrical solutions to our customers.`,
      author: "Shri Vaari",
      coverImageUrl: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=800",
      published: true,
    },
    {
      title: "Understanding HT and LT Panels: A Complete Guide",
      slug: "understanding-ht-and-lt-panels-complete-guide",
      excerpt:
        "High Tension and Low Tension panels form the backbone of industrial electrical systems. This comprehensive guide explains their differences, applications, and selection criteria.",
      content: `Electrical panels are the nerve centers of any industrial power distribution system. Understanding the differences between High Tension (HT) and Low Tension (LT) panels is crucial for engineers, facility managers, and decision-makers involved in electrical infrastructure projects.

## What are HT Panels?

High Tension panels, also known as Medium Voltage panels, operate at voltages above 1kV, typically at 11kV, 22kV, or 33kV in the Indian context. These panels serve as the primary point of power receipt from the utility grid and distribute power to transformers for step-down to usable voltage levels.

### Key Components of HT Panels
- **Circuit Breakers**: VCB (Vacuum Circuit Breakers) or SF6 circuit breakers for arc interruption
- **Current Transformers (CT)**: For current measurement and relay inputs
- **Potential Transformers (PT)**: For voltage measurement and relay inputs
- **Protection Relays**: Numerical relays for overcurrent, earth fault, and differential protection
- **Isolators**: For visible break during maintenance
- **Busbars**: Copper or aluminum conductors for power distribution

## What are LT Panels?

Low Tension panels operate at voltages up to 1kV, typically 415V in three-phase systems. They receive power from distribution transformers and distribute it to various loads including motors, lighting, and other equipment.

### Types of LT Panels
- **PCC (Power Control Centre)**: Main incoming and distribution panel
- **MCC (Motor Control Centre)**: Centralized motor control and protection
- **PMCC**: Combined PCC and MCC
- **APFC Panel**: Automatic power factor correction
- **SSB**: Sub switch boards for area distribution
- **DG Synchronization Panel**: Multiple generator paralleling
- **PLC Panel**: Programmable logic control

## Key Differences

| Parameter | HT Panels | LT Panels |
|-----------|-----------|-----------|
| Voltage Level | Above 1kV (11kV, 22kV, 33kV) | Up to 1kV (415V) |
| Application | Power receiving & primary distribution | Secondary distribution & load control |
| Switchgear | VCB/SF6 breakers | ACB/MCCB/OCB |
| Protection | Complex numerical relays | Thermal/magnetic/electronic relays |
| Insulation | Higher insulation class | Standard insulation |
| Cost | Higher per panel | Lower per panel |
| Testing Standards | IS 3427 / IEC 62271 | IS 8623 / IEC 61439 |

## Selection Criteria

When selecting HT or LT panels, consider:
1. **System voltage and current ratings**
2. **Short circuit level at the installation point**
3. **Environmental conditions (indoor/outdoor, altitude, humidity)**
4. **Protection requirements**
5. **Future expansion needs**
6. **Compliance with local utility requirements**
7. **Maintenance accessibility**

Understanding these fundamentals helps in making informed decisions for your electrical infrastructure projects. At Shri Vaari Electricals, our engineering team provides expert guidance in selecting the right panels for your specific requirements.`,
      author: "Shri Vaari",
      coverImageUrl: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800",
      published: true,
    },
    {
      title: "Solar Energy: Powering India's Sustainable Future",
      slug: "solar-energy-powering-india-sustainable-future",
      excerpt:
        "India's solar energy sector is booming with ambitious targets and rapid installations. Learn about the opportunities and challenges in the country's renewable energy revolution.",
      content: `India has emerged as one of the world's fastest-growing solar energy markets, with installed capacity crossing 70 GW and ambitious targets of 280 GW by 2030. This solar revolution is creating unprecedented opportunities for electrical engineering companies and transforming the nation's energy landscape.

## India's Solar Journey

The launch of the National Solar Mission in 2010 set India on the path to becoming a global solar powerhouse. Since then, the country has made remarkable progress:

- **Installed Capacity**: Over 70 GW as of 2024
- **Annual Additions**: 15-20 GW per year
- **Target**: 280 GW by 2030
- **Investment**: Over $50 billion in the last decade

## Types of Solar Installations

### Utility-Scale Solar Parks
Large ground-mounted solar parks ranging from 100 MW to several GW capacity. These projects feed power directly into the grid and are typically developed under government auctions.

### Industrial Rooftop Solar
Factories, warehouses, and commercial buildings install rooftop solar systems to reduce electricity costs and carbon footprint. Net metering policies allow excess power to be fed back into the grid.

### Off-Grid Solar
Remote areas without grid connectivity use solar power with battery storage for electrification. This includes solar water pumps, street lights, and home systems.

## Role of Electrical Engineering Companies

Electrical engineering firms like Shri Vaari play a crucial role in solar projects:

1. **Design & Engineering**: System design, single line diagrams, and protection schemes
2. **HT Panel Integration**: 11kV/33kV panels for grid connectivity
3. **Switchyard Construction**: Complete switchyard for solar power evacuation
4. **Utility Liaison**: Coordination with TNEB, APTRANSCO, and other utilities
5. **Testing & Commissioning**: Comprehensive testing as per CEIG requirements
6. **AMC Services**: Ongoing operation and maintenance support

## Challenges and Opportunities

### Challenges
- **Grid Integration**: Managing intermittent solar power injection
- **Land Acquisition**: Securing suitable land for large projects
- **Financing**: Arranging project finance at competitive rates
- **Regulatory**: Navigating varying state policies and regulations

### Opportunities
- **Manufacturing**: Growing demand for solar components
- **EPC Services**: Increasing number of project installations
- **O&M Services**: Large installed base requires maintenance
- **Energy Storage**: Emerging battery storage market

The solar sector presents immense opportunities for companies with the right technical capabilities and industry experience. At Shri Vaari Electricals, our Solar Works division is equipped to deliver end-to-end solar EPC solutions, from design to commissioning and beyond.`,
      author: "Shri Vaari",
      coverImageUrl: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800",
      published: true,
    },
    {
      title: "Importance of Energy Audits for Industrial Facilities",
      slug: "importance-of-energy-audits-industrial-facilities",
      excerpt:
        "Energy audits are essential for identifying wastage, reducing costs, and ensuring power quality in industrial facilities. Discover why every plant should conduct regular energy and harmonic audits.",
      content: `In an era of rising energy costs and stringent environmental regulations, energy audits have become indispensable for industrial facilities. A comprehensive energy audit can identify 15-30% potential energy savings, improve power quality, and ensure compliance with harmonic standards.

## What is an Energy Audit?

An energy audit is a systematic assessment of an industrial facility's energy consumption patterns, identifying areas of wastage and opportunities for improvement. It involves detailed measurement, analysis, and reporting of energy flows across all electrical systems.

### Types of Energy Audits

**Preliminary Audit (Walk-Through)**
A quick assessment identifying obvious areas of energy wastage and potential savings. Typically completed in 1-2 days.

**Detailed Audit (Comprehensive)**
An in-depth analysis involving extensive measurements, data logging, and engineering calculations. This audit provides specific recommendations with cost-benefit analysis and payback periods.

## Why Energy Audits Matter

### 1. Cost Reduction
Industrial facilities in India typically waste 15-30% of their energy consumption through inefficiencies. An energy audit identifies these losses and provides actionable recommendations that can save lakhs of rupees annually.

### 2. Power Factor Optimization
Low power factor results in penalties from electricity boards and reduced system capacity. Energy audits identify the root causes and recommend optimal capacitor bank sizing and placement.

### 3. Harmonic Assessment
Non-linear loads like VFDs, UPS systems, and rectifiers generate harmonics that can damage equipment, cause overheating, and trigger nuisance tripping. A harmonic audit measures THD levels and recommends mitigation measures.

### 4. Equipment Health Assessment
Energy audits often reveal degraded equipment performance—failing transformers, overloaded cables, or worn-out motors—before they cause catastrophic failures.

### 5. Regulatory Compliance
CEIG and utility companies increasingly require evidence of power quality compliance. Energy audits provide documentation needed for regulatory approvals.

## The Shri Vaari Approach

Our Energy & Harmonic Audit service follows a structured methodology:

1. **Data Collection**: Review of electricity bills, single line diagrams, and equipment details
2. **On-Site Measurements**: Power quality analyzers and data loggers deployed for 7-15 days
3. **Analysis**: Detailed analysis of voltage, current, power factor, harmonics, and load patterns
4. **Reporting**: Comprehensive report with findings, recommendations, and ROI calculations
5. **Implementation Support**: Assistance in implementing recommended measures

## Common Findings in Industrial Audits

- **Low Power Factor**: Often below 0.85, attracting penalties
- **High Harmonic Distortion**: THD exceeding IEEE 519 limits
- **Overloaded Transformers**: Running beyond rated capacity
- **Inefficient Motors**: Old motors with low efficiency
- **Poor Lighting**: Outdated lighting consuming excess energy
- **Air Compressor Leaks**: Significant energy waste in compressed air systems

## ROI of Energy Audits

The typical return on investment for an energy audit is impressive:
- **Audit Cost**: ₹2-5 lakhs depending on facility size
- **Annual Savings**: ₹10-50 lakhs identified through audit
- **Payback Period**: 3-6 months for most recommendations
- **Equipment Life**: Extended by 20-30% through corrective measures

Don't let energy inefficiencies drain your profits. Contact Shri Vaari Electricals today for a comprehensive energy and harmonic audit of your facility.`,
      author: "Shri Vaari",
      coverImageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800",
      published: true,
    },
  ];

  for (const blog of blogs) {
    await prisma.blog.create({ data: blog });
  }
  console.log(`Created ${blogs.length} blogs`);

  // ==================== PROJECTS ====================
  console.log("Creating projects...");

  const projects = [
    {
      name: "11KV/433V Electrification",
      client: "Madras Security Printers",
      location: "Chennai",
      description:
        "Complete electrification project including 11KV VCB panels, 11KV/433V transformers, LT panels, and cabling for the printing facility. Project involves design, supply, installation, testing, and commissioning of the entire electrical system.",
      category: "ongoing",
      order: 1,
    },
    {
      name: "33KV 1250A VCB Panel",
      client: "M.J. Casting Limited",
      location: "Hosur",
      description:
        "Supply and installation of 33KV 1250A VCB panel with complete protection scheme including numerical relays, CT/PT, and SCADA integration for the foundry facility.",
      category: "ongoing",
      order: 2,
    },
    {
      name: "11KV/433V Electrification",
      client: "PSG Institute of Technology",
      location: "Coimbatore",
      description:
        "Campus-wide electrification project for the engineering institute including 11KV switchyard, distribution transformers, LT panels, and internal cabling for multiple buildings.",
      category: "ongoing",
      order: 3,
    },
    {
      name: "110KV/11KV Switchyard",
      client: "Ashok Leyland",
      location: "Hosur",
      description:
        "Design, engineering, and construction of 110KV/11KV switchyard including power transformers, VCB panels, control panels, protection systems, and complete switchyard civil works.",
      category: "ongoing",
      order: 4,
    },
    {
      name: "132KV/11KV Switchyard",
      client: "MM Forging",
      location: "Viralimalai",
      description:
        "Complete 132KV/11KV switchyard construction including power transformer, SF6 breaker, isolators, CT/PT, protection panels, and control room with SCADA system for the forging plant.",
      category: "ongoing",
      order: 5,
    },
    {
      name: "33KV Bay Extension for 10MW Solar",
      client: "Solon India",
      location: "Mothagam",
      description:
        "33KV bay extension work for 10MW solar power plant integration, including VCB panels, protection relays, metering panels, and grid connectivity as per TNEB requirements.",
      category: "ongoing",
      order: 6,
    },
    {
      name: "11KV VCB Panels",
      client: "TVS Srichakra",
      location: "Madurai",
      description:
        "Supply and commissioning of 11KV VCB panels with numerical protection relays, auto-reclosing facility, and SCADA communication for the tyre manufacturing facility.",
      category: "ongoing",
      order: 7,
    },
    {
      name: "11KV Transformer/VCB Panels",
      client: "Delta Electronics",
      location: "Hosur",
      description:
        "Complete 11KV switchboard with transformer feed VCB panels, metering panels, and protection systems for the electronics manufacturing unit. Includes CEIG approval and TNEB liaison.",
      category: "ongoing",
      order: 8,
    },
  ];

  for (const project of projects) {
    await prisma.project.create({ data: project });
  }
  console.log(`Created ${projects.length} projects`);

  // ==================== SITE SETTINGS ====================
  console.log("Creating site settings...");

  const settings = [
    { key: "company_name", value: "Shri Vaari Electricals Pvt Ltd" },
    { key: "company_phone", value: "+91 9941905833" },
    { key: "company_email", value: "srivaari@gmail.com" },
    { key: "company_address", value: "Chennai, Tamil Nadu, India" },
    { key: "business_hours", value: "Mon-Sat: 9:30am to 6:30pm" },
    { key: "hero_subtitle", value: "Design to Post-commissioning" },
    {
      key: "about_text",
      value:
        "Shri Vaari Electricals Pvt. Ltd. is a professionally managed, multi-location based engineering firm, having market leadership in South India and on its way to establish significant position in the pan Indian market. We offer innovative and value-added solutions to our customers for total electrical systems from design to commissioning.",
    },
    { key: "stat_customers", value: "3000+" },
    { key: "stat_employees", value: "400+" },
    { key: "stat_branches", value: "7" },
    { key: "stat_turnover", value: "125 Crores" },
    { key: "stat_mncs", value: "20+" },
    { key: "stat_transmission", value: "100Km+" },
    { key: "stat_consultants", value: "20+" },
    { key: "stat_ehv", value: "30+" },
    {
      key: "youtube_video_url",
      value: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    },
  ];

  for (const setting of settings) {
    await prisma.siteSetting.create({ data: setting });
  }
  console.log(`Created ${settings.length} site settings`);

  // ==================== TEAM MEMBERS ====================
  console.log("Creating team members...");

  const teamMembers = [
    {
      name: "Mr. Rengarajan",
      designation: "Managing Director",
      responsibility: "Design/Marketing/Liaisoning",
      experience: 38,
      initials: "R",
      gradientFrom: "#1B3A5C",
      gradientTo: "#2A5F8F",
      accent: "#1B3A5C",
      order: 1,
    },
    {
      name: "Mr. Sivagami Nathan",
      designation: "Executive Director",
      responsibility: "Administration/Finance/Tendering",
      experience: 45,
      initials: "SN",
      gradientFrom: "#E8751A",
      gradientTo: "#F59E0B",
      accent: "#E8751A",
      order: 2,
    },
    {
      name: "Mr. Rakesh Kumar",
      designation: "Operations Director",
      responsibility: "Operations",
      experience: 10,
      initials: "RK",
      gradientFrom: "#0D9488",
      gradientTo: "#2DD4BF",
      accent: "#0D9488",
      order: 3,
    },
    {
      name: "Mr. Ambalarajan",
      designation: "Director - Projects",
      responsibility: "Project Execution/Renewable Energy",
      experience: 15,
      initials: "A",
      gradientFrom: "#059669",
      gradientTo: "#34D399",
      accent: "#059669",
      order: 4,
    },
    {
      name: "Mr. Anand Purushothaman",
      designation: "Technical Director",
      responsibility: "Design/Marketing/Project Execution",
      experience: 35,
      initials: "AP",
      gradientFrom: "#7C3AED",
      gradientTo: "#A78BFA",
      accent: "#7C3AED",
      order: 5,
    },
    {
      name: "Mr. Manjari",
      designation: "Project Director",
      responsibility: "EHV Projects",
      experience: 40,
      initials: "M",
      gradientFrom: "#D97706",
      gradientTo: "#FBBF24",
      accent: "#D97706",
      order: 6,
    },
  ];

  for (const member of teamMembers) {
    await prisma.teamMember.create({ data: member });
  }
  console.log(`Created ${teamMembers.length} team members`);

  // ==================== MILESTONES ====================
  console.log("Creating milestones...");

  const milestones = [
    {
      year: "1998",
      title: "Inception",
      description: "Shri Vaari Electricals was established as a firm in Chennai",
      icon: "Rocket",
      color: "#1B3A5C",
      order: 1,
    },
    {
      year: "1999",
      title: "AMC Services Launched",
      description: "Started a new business vertical — Annual Maintenance Contract Services for Industrial Customers",
      icon: "Wrench",
      color: "#E8751A",
      order: 2,
    },
    {
      year: "2003",
      title: "New Office & Factory",
      description: "Constructed a new office and factory building at Guindy, Chennai with 20,000 sq ft space",
      icon: "Factory",
      color: "#0D9488",
      order: 3,
    },
    {
      year: "2005",
      title: "Private Limited Entity",
      description: "The company was formally incorporated as a Private Limited Entity",
      icon: "Award",
      color: "#1B3A5C",
      order: 4,
    },
    {
      year: "2009",
      title: "First EHV Project",
      description: "Executed our first Extra High Voltage project",
      icon: "Zap",
      color: "#E8751A",
      order: 5,
    },
    {
      year: "2014",
      title: "Solar EPC Division",
      description: "Started Solar Plants EPC division",
      icon: "Sun",
      color: "#0D9488",
      order: 6,
    },
    {
      year: "2015",
      title: "Schneider Partnership",
      description: "Formed a strategic partnership with Schneider Electric",
      icon: "Handshake",
      color: "#1B3A5C",
      order: 7,
    },
    {
      year: "2016",
      title: "Industrial AMC Vertical",
      description: "Launched a dedicated new business vertical for AMC Services",
      icon: "Wrench",
      color: "#E8751A",
      order: 8,
    },
    {
      year: "2018",
      title: "₹100+ Crores Turnover",
      description: "Achieved a landmark turnover of ₹100+ Crores",
      icon: "TrendingUp",
      color: "#0D9488",
      order: 9,
    },
    {
      year: "2023",
      title: "55+ EHV Projects",
      description: "Completed 55+ EHV Projects including substations up to 400KV",
      icon: "Building2",
      color: "#1B3A5C",
      order: 10,
    },
    {
      year: "2025",
      title: "IEC-61439 Certified",
      description: "LT Panels tested to IEC-61439 standards",
      icon: "BadgeCheck",
      color: "#E8751A",
      order: 11,
    },
  ];

  for (const milestone of milestones) {
    await prisma.milestone.create({ data: milestone });
  }
  console.log(`Created ${milestones.length} milestones`);

  // ==================== SECTORS ====================
  console.log("Creating sectors...");

  const sectors = [
    {
      name: "Power & Utilities",
      description: "Complete electrical infrastructure for power generation, transmission, and distribution utilities including switchyards up to 400KV and SCADA-integrated substations.",
      icon: "Zap",
      stat: "65+",
      statLabel: "Switchyards",
      gradientFrom: "#1B3A5C",
      gradientTo: "#2A5F9E",
      accent: "#1B3A5C",
      details: JSON.stringify(["EHV Substations up to 400KV", "Switchyard design & construction", "Power transformer installation", "SCADA & protection system integration"]),
      order: 1,
    },
    {
      name: "Industrial & Manufacturing",
      description: "End-to-end electrical solutions for manufacturing plants including LT/HT panel manufacturing, motor control centres, and power distribution systems.",
      icon: "Factory",
      stat: "10,000+",
      statLabel: "Panels Installed",
      gradientFrom: "#E8751A",
      gradientTo: "#F59E0B",
      accent: "#E8751A",
      details: JSON.stringify(["LT/HT Panel supply & installation", "Motor Control Centres (MCC)", "Power Control Centres (PCC)", "Industrial automation & PLC panels"]),
      order: 2,
    },
    {
      name: "Oil & Gas / Petrochemical",
      description: "Specialized electrical installations for refineries, petrochemical plants, and oil & gas facilities with explosion-proof and flameproof certified equipment.",
      icon: "Droplets",
      stat: "10+",
      statLabel: "GIS Substations",
      gradientFrom: "#0D9488",
      gradientTo: "#14B8A6",
      accent: "#0D9488",
      details: JSON.stringify(["Flameproof panel manufacturing", "GIS substation construction", "Hazardous area classification design", "Fire-rated cable & busduct systems"]),
      order: 3,
    },
    {
      name: "Solar & Renewable Energy",
      description: "Comprehensive solar EPC services from rooftop installations to utility-scale ground-mounted solar plants with grid connectivity and power evacuation systems.",
      icon: "Sun",
      stat: "450+ MW",
      statLabel: "Solar Capacity",
      gradientFrom: "#D97706",
      gradientTo: "#FBBF24",
      accent: "#D97706",
      details: JSON.stringify(["Rooftop solar EPC (up to 5.5MW)", "Ground-mounted solar plants", "Power evacuation & grid integration", "Net metering & utility liaison"]),
      order: 4,
    },
    {
      name: "Commercial & Real Estate",
      description: "Electrical infrastructure for commercial complexes, IT parks, residential towers, and mixed-use developments with intelligent building management systems.",
      icon: "Building2",
      stat: "200+",
      statLabel: "Projects",
      gradientFrom: "#7C3AED",
      gradientTo: "#A78BFA",
      accent: "#7C3AED",
      details: JSON.stringify(["HT/LT distribution for commercial buildings", "Building Management Systems (BMS)", "Emergency power & DG synchronization", "Energy-efficient lighting & APFC systems"]),
      order: 5,
    },
    {
      name: "Infrastructure & Transportation",
      description: "Electrical systems for airports, railways, metro stations, ports, and other critical transportation infrastructure with high-reliability requirements.",
      icon: "Train",
      stat: "50+",
      statLabel: "Infra Projects",
      gradientFrom: "#DC2626",
      gradientTo: "#F87171",
      accent: "#DC2626",
      details: JSON.stringify(["Airport electrical systems", "Railway & metro substation works", "Port & harbor power distribution", "Tunnel ventilation & emergency systems"]),
      order: 6,
    },
    {
      name: "Cement & Heavy Industry",
      description: "Robust electrical solutions for cement plants, steel mills, and heavy industries that demand high-reliability power distribution in extreme operating conditions.",
      icon: "Hammer",
      stat: "30+",
      statLabel: "Heavy Industry",
      gradientFrom: "#78716C",
      gradientTo: "#A8A29E",
      accent: "#78716C",
      details: JSON.stringify(["Heavy-duty LT/HT panel manufacturing", "Kiln & mill motor control systems", "Dust-resistant panel enclosures", "High-capacity busbar trunking systems"]),
      order: 7,
    },
    {
      name: "Chemical & Pharmaceutical",
      description: "Precision electrical installations for chemical processing plants and pharmaceutical manufacturing with cleanroom-compatible panels and compliance to FDA/GMP standards.",
      icon: "FlaskConical",
      stat: "25+",
      statLabel: "Pharma/Chem Projects",
      gradientFrom: "#059669",
      gradientTo: "#34D399",
      accent: "#059669",
      details: JSON.stringify(["Cleanroom-compatible panels", "Corrosion-resistant enclosures", "Redundant power supply systems", "GMP-compliant electrical design"]),
      order: 8,
    },
    {
      name: "Healthcare & Institutional",
      description: "Critical power infrastructure for hospitals, educational institutions, and government facilities with emphasis on reliability, backup power, and safety compliance.",
      icon: "Heart",
      stat: "100+",
      statLabel: "Institutions Served",
      gradientFrom: "#EC4899",
      gradientTo: "#F9A8D4",
      accent: "#EC4899",
      details: JSON.stringify(["Hospital-grade electrical systems", "Uninterruptible power supply (UPS) integration", "Emergency backup & fire safety systems", "CEIG/CEA compliance & certification"]),
      order: 9,
    },
    {
      name: "International Projects",
      description: "Electrical engineering projects across 6 countries in Africa and the Middle East, delivering switchyards, substations, and power infrastructure to global standards.",
      icon: "Globe",
      stat: "6",
      statLabel: "Countries",
      gradientFrom: "#2563EB",
      gradientTo: "#60A5FA",
      accent: "#2563EB",
      details: JSON.stringify(["Substation projects in Nigeria & Sierra Leone", "Power infrastructure in Qatar & Oman", "Electrification projects in Bangladesh", "Grid connectivity in Sri Lanka"]),
      order: 10,
    },
  ];

  for (const sector of sectors) {
    await prisma.sector.create({ data: sector });
  }
  console.log(`Created ${sectors.length} sectors`);

  // ==================== BRANCHES ====================
  console.log("Creating branches...");

  const branches = [
    { city: "Chennai", state: "Tamil Nadu", type: "Headquarters", icon: "Building2", isHQ: true, order: 1 },
    { city: "Hyderabad", state: "Telangana", type: "Regional Office", icon: "MapPin", isHQ: false, order: 2 },
    { city: "Bangalore", state: "Karnataka", type: "Regional Office", icon: "MapPin", isHQ: false, order: 3 },
    { city: "Vishakhapatnam", state: "Andhra Pradesh", type: "Branch Office", icon: "MapPin", isHQ: false, order: 4 },
    { city: "Tirupati", state: "Andhra Pradesh", type: "Branch Office", icon: "MapPin", isHQ: false, order: 5 },
    { city: "Pondicherry", state: "Puducherry", type: "Branch Office", icon: "MapPin", isHQ: false, order: 6 },
    { city: "Hosur", state: "Tamil Nadu", type: "Branch Office", icon: "MapPin", isHQ: false, order: 7 },
    { city: "Trivandrum", state: "Kerala", type: "Branch Office", icon: "MapPin", isHQ: false, order: 8 },
  ];

  for (const branch of branches) {
    await prisma.branch.create({ data: branch });
  }
  console.log(`Created ${branches.length} branches`);

  // ==================== CAREERS ====================
  console.log("Creating careers...");

  const careers = [
    { title: "Senior Electrical Engineer", location: "Chennai", experience: "5-10 years", department: "Engineering", type: "Full-time", icon: "Zap", accent: "#1B3A5C", order: 1 },
    { title: "Project Manager — Solar EPC", location: "Bangalore", experience: "8-12 years", department: "Operations", type: "Full-time", icon: "Hammer", accent: "#E8751A", order: 2 },
    { title: "Testing & Commissioning Engineer", location: "Hyderabad", experience: "3-7 years", department: "Engineering", type: "Full-time", icon: "FlaskConical", accent: "#1B3A5C", order: 3 },
    { title: "Site Engineer — Transmission Lines", location: "Multiple Locations", experience: "2-5 years", department: "Operations", type: "Full-time", icon: "Building2", accent: "#E8751A", order: 4 },
    { title: "Design Engineer — LT/HT Panels", location: "Chennai", experience: "3-6 years", department: "Design", type: "Full-time", icon: "Lightbulb", accent: "#7C3AED", order: 5 },
    { title: "Liasion Officer — CEIG/TNEB", location: "Chennai", experience: "5-10 years", department: "Operations", type: "Full-time", icon: "Shield", accent: "#E8751A", order: 6 },
    { title: "AMC Service Technician", location: "Pondicherry", experience: "2-4 years", department: "Service", type: "Full-time", icon: "Sparkles", accent: "#0D9488", order: 7 },
    { title: "Graduate Engineer Trainee", location: "All Branches", experience: "Freshers Welcome", department: "Engineering", type: "Full-time", icon: "GraduationCap", accent: "#1B3A5C", order: 8 },
  ];

  for (const career of careers) {
    await prisma.career.create({ data: career });
  }
  console.log(`Created ${careers.length} careers`);

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error("Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
