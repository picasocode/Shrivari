import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/password";

// Track if seeding has been attempted in this process
let seedAttempted = false;

export async function GET() {
  try {
    // Prevent multiple concurrent seed attempts
    if (seedAttempted) {
      const productCount = await db.product.count();
      return NextResponse.json({
        message: productCount > 0 ? "Database already seeded" : "Seeding in progress",
        seeded: productCount > 0,
        counts: productCount > 0 ? {
          products: productCount,
          services: await db.service.count(),
          clients: await db.client.count(),
          testimonials: await db.testimonial.count(),
          blogs: await db.blog.count(),
          projects: await db.project.count(),
          settings: await db.siteSetting.count(),
          teamMembers: await db.teamMember.count(),
          sectors: await db.sector.count(),
          milestones: await db.milestone.count(),
          branches: await db.branch.count(),
          careers: await db.career.count(),
          users: await db.user.count(),
        } : null,
      });
    }

    seedAttempted = true;

    // Check if already seeded
    const productCount = await db.product.count();
    if (productCount > 0) {
      return NextResponse.json({
        message: "Database already seeded",
        seeded: false,
        counts: {
          products: productCount,
          services: await db.service.count(),
          clients: await db.client.count(),
          testimonials: await db.testimonial.count(),
          blogs: await db.blog.count(),
          projects: await db.project.count(),
          settings: await db.siteSetting.count(),
          teamMembers: await db.teamMember.count(),
          sectors: await db.sector.count(),
          milestones: await db.milestone.count(),
          branches: await db.branch.count(),
          careers: await db.career.count(),
          users: await db.user.count(),
        },
      });
    }

    console.log("Auto-seeding database via API route...");

    // ============================================================
    // 1. ADMIN USER
    // ============================================================
    const adminPassword = await hashPassword("admin123");
    await db.user.create({
      data: {
        name: "SVEPL Admin",
        email: "admin@shrivaari.com",
        password: adminPassword,
        role: "admin",
      },
    });

    // ============================================================
    // 2. PRODUCTS (LT Panels + HT Panels)
    // ============================================================
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
        order: 12,
      },
    ];

    for (const product of [...ltProducts, ...htProducts]) {
      await db.product.create({ data: product });
    }

    // ============================================================
    // 3. SERVICES (9 services)
    // ============================================================
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
          "We provide liaison services with the Chief Electrical Inspector to Government (CEIG) for obtaining statutory approvals, inspections, and certifications for electrical installations.",
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
          "We facilitate liaison with state electricity utilities including TNEB, KPTCL, APTRANSCO, and TSTRANSCO for power supply agreements, load enhancements, and grid connectivity approvals.",
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
          "Our Solar Works division provides comprehensive solar energy solutions including design, engineering, procurement, installation, and commissioning of rooftop and ground-mounted solar power plants.",
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
      await db.service.create({ data: service });
    }

    // ============================================================
    // 4. CLIENTS (25+)
    // ============================================================
    const clients = [
      { name: "Ashok Leyland", industry: "Automobile", location: "Hosur", description: "Leading commercial vehicle manufacturer and one of India's largest truck and bus producers.", order: 1 },
      { name: "TVS Srichakra Ltd", industry: "Manufacturing", location: "Madurai", description: "Major manufacturer of two-wheeler and three-wheeler tyres, part of the TVS Group.", order: 2 },
      { name: "Delta Electronics India", industry: "Electronics", location: "Hosur", description: "Global leader in power and thermal management solutions and a major provider of industrial automation.", order: 3 },
      { name: "M.J. Casting Limited", industry: "Manufacturing", location: "Hosur", description: "Specialized castings manufacturer serving the automotive and industrial sectors.", order: 4 },
      { name: "Madras Security Printers", industry: "Printing & Security", location: "Chennai", description: "Government-approved security printing and document management company.", order: 5 },
      { name: "PSG Institute of Technology", industry: "Education", location: "Coimbatore", description: "Premier engineering institution and one of the oldest technical schools in India.", order: 6 },
      { name: "MM Forging", industry: "Forging & Manufacturing", location: "Viralimalai", description: "Leading manufacturer of forged and machined components for automotive and industrial applications.", order: 7 },
      { name: "Solon India Pvt Ltd", industry: "Solar Energy", location: "Mothagam", description: "Solar energy developer specializing in large-scale photovoltaic power plants.", order: 8 },
      { name: "TVS Motor Company", industry: "Automobile", location: "Hosur", description: "India's third-largest two-wheeler manufacturer and a key player in the TVS Group.", order: 9 },
      { name: "Hyundai Motor India", industry: "Automobile", location: "Sriperumbudur", description: "India's second-largest car manufacturer and largest automobile exporter from India.", order: 10 },
      { name: "Saint-Gobain India", industry: "Glass Manufacturing", location: "Sriperumbudur", description: "World leader in the habitat and construction markets, designing and manufacturing building materials.", order: 11 },
      { name: "Titan Company Ltd", industry: "Watch & Jewellery Manufacturing", location: "Hosur", description: "India's leading manufacturer of watches, jewellery, and eyewear, a Tata Group company.", order: 12 },
      { name: "Britannia Industries", industry: "Food Processing", location: "Chennai", description: "One of India's biggest food brands and leading dairy and bakery products company.", order: 13 },
      { name: "LMW Ltd", industry: "Textile Machinery", location: "Coimbatore", description: "India's largest manufacturer of textile machinery and a leader in CNC machine tools.", order: 14 },
      { name: "Elgi Equipments Ltd", industry: "Compressor Manufacturing", location: "Coimbatore", description: "Global leader in air compressors and automotive equipment manufacturing.", order: 15 },
      { name: "Sundaram Clayton", industry: "Auto Components", location: "Chennai", description: "Leading manufacturer of brake systems and die-casting products for automotive OEMs.", order: 16 },
      { name: "MRF Tyres", industry: "Tyre Manufacturing", location: "Tiruvottiyur", description: "India's largest tyre manufacturer with a strong global presence in over 65 countries.", order: 17 },
      { name: "Crompton Greaves", industry: "Electrical Equipment", location: "Chennai", description: "Pioneer in electrical equipment manufacturing with a legacy spanning over 85 years.", order: 18 },
      { name: "Grasim Industries", industry: "Cement & Fibre", location: "Nagpur", description: "Aditya Birla Group flagship company and India's largest cement producer.", order: 19 },
      { name: "Dalmia Cement", industry: "Cement Manufacturing", location: "Dalmiapuram", description: "One of India's pioneering cement companies with a strong presence in South India.", order: 20 },
      { name: "Reliance Industries", industry: "Petrochemical & Refining", location: "Jamnagar", description: "India's largest private sector company with businesses spanning energy, petrochemicals, and retail.", order: 21 },
      { name: "Schneider Electric India", industry: "Energy Management", location: "Bangalore", description: "Global specialist in energy management and automation with strong presence in India.", order: 22 },
      { name: "IOCL - Indian Oil Corporation", industry: "Oil & Gas", location: "Chennai", description: "India's largest commercial enterprise and flagship national oil company.", order: 23 },
      { name: "ITC Limited", industry: "Diversified Conglomerate", location: "Chennai", description: "One of India's foremost private sector companies with diversified presence in FMCG, hotels, and paperboards.", order: 24 },
      { name: "TATA Power", industry: "Power & Utilities", location: "Mumbai", description: "India's largest integrated power company and pioneer in the Indian power sector.", order: 25 },
      { name: "NTPC Limited", industry: "Power Generation", location: "Hyderabad", description: "India's largest power generating company and a Maharatna CPSE.", order: 26 },
      { name: "Bangalore International Airport", industry: "Infrastructure", location: "Bangalore", description: "Kempegowda International Airport, one of India's busiest airports handling 30+ million passengers.", order: 27 },
      { name: "Chennai Petroleum Corporation", industry: "Oil Refining", location: "Chennai", description: "Major petroleum refining company and a subsidiary of IOCL serving South India.", order: 28 },
    ];

    for (const client of clients) {
      await db.client.create({ data: client });
    }

    // ============================================================
    // 5. TESTIMONIALS (10+)
    // ============================================================
    const testimonials = [
      {
        name: "Rajesh Kumar",
        company: "Ashok Leyland",
        designation: "Vice President - Engineering",
        content:
          "Shri Vaari Electricals has been our trusted partner for over a decade. Their expertise in HT panel manufacturing and switchyard projects is exceptional. The quality of their panels and the professionalism of their project execution team have consistently exceeded our expectations.",
        rating: 5,
        order: 1,
      },
      {
        name: "Dr. Meena Krishnan",
        company: "PSG Institute of Technology",
        designation: "Director - Infrastructure",
        content:
          "The 11KV electrification project executed by Shri Vaari for our campus was completed on time and within budget. Their technical team demonstrated deep understanding of our requirements and provided innovative solutions. The after-sales support has been outstanding.",
        rating: 5,
        order: 2,
      },
      {
        name: "Suresh Babu",
        company: "TVS Srichakra Ltd",
        designation: "General Manager - Projects",
        content:
          "We have been associated with Shri Vaari for our VCB panel requirements and the experience has been excellent. Their design team pays meticulous attention to detail, and their manufacturing facility maintains the highest quality standards.",
        rating: 5,
        order: 3,
      },
      {
        name: "Anand Sharma",
        company: "Delta Electronics India",
        designation: "Head of Operations",
        content:
          "Shri Vaari's EPC capabilities in transformer and VCB panel installations are truly impressive. Their team handled the complete electrification project for our Hosur facility with remarkable efficiency. The safety standards they maintain on-site are exemplary.",
        rating: 5,
        order: 4,
      },
      {
        name: "Priya Venkataraman",
        company: "Solon India Pvt Ltd",
        designation: "Project Director",
        content:
          "The 33KV bay extension for our 10MW solar project was a complex undertaking, but Shri Vaari delivered it flawlessly. Their understanding of solar grid integration requirements and their liaison capabilities with utility companies made the entire process smooth.",
        rating: 4,
        order: 5,
      },
      {
        name: "Karthik Rajan",
        company: "MM Forging",
        designation: "Chief Technical Officer",
        content:
          "Shri Vaari has been instrumental in setting up our 132KV switchyard and it has been running without any issues since commissioning. Their project management is commendable—they kept us informed at every stage and delivered the project ahead of schedule.",
        rating: 5,
        order: 6,
      },
      {
        name: "Venkateshwaran R.",
        company: "Titan Company Ltd",
        designation: "Senior Manager - Facility Management",
        content:
          "We engaged Shri Vaari for the complete LT panel upgrade at our Hosur facility. Their team conducted a thorough audit before recommending the right solutions. The retrofitting was done with zero downtime to our production lines, which was critical for us.",
        rating: 5,
        order: 7,
      },
      {
        name: "Fatima Begum",
        company: "Dalmia Cement",
        designation: "Director - Projects",
        content:
          "Executing electrical projects in a cement plant environment is extremely demanding due to dust, vibration, and continuous operation requirements. Shri Vaari understood these challenges from the outset and delivered panels that have performed flawlessly for years.",
        rating: 5,
        order: 8,
      },
      {
        name: "R. Mohan",
        company: "Schneider Electric India",
        designation: "Partnership Manager - South India",
        content:
          "As a strategic partner, we have witnessed Shri Vaari's commitment to quality firsthand. Their switchboard manufacturing facility at Guindy is world-class, and their adherence to Schneider's design standards is impeccable. They are one of our most trusted panel builders in South India.",
        rating: 5,
        order: 9,
      },
      {
        name: "Dr. A. Sivakumar",
        company: "Bangalore International Airport",
        designation: "Chief Engineer - Electrical",
        content:
          "Airport electrical systems demand the highest reliability and safety standards. Shri Vaari's team demonstrated exceptional technical competence in delivering our HT distribution panels. Their liaison support with KPTCL for grid connectivity was invaluable.",
        rating: 5,
        order: 10,
      },
      {
        name: "Nisha Patel",
        company: "Reliance Industries",
        designation: "General Manager - Electrical",
        content:
          "We required a contractor capable of handling the scale and complexity of our refinery electrification. Shri Vaari rose to the challenge with their EHV expertise and delivered a 110KV switchyard that meets our stringent reliability requirements. Their safety record on our project was impeccable.",
        rating: 5,
        order: 11,
      },
    ];

    for (const testimonial of testimonials) {
      await db.testimonial.create({ data: testimonial });
    }

    // ============================================================
    // 6. BLOGS (4)
    // ============================================================
    const blogs = [
      {
        title: "The Future of Electrical Panel Manufacturing in India",
        slug: "future-of-electrical-panel-manufacturing-in-india",
        excerpt:
          "India's electrical panel manufacturing sector is undergoing a transformation driven by smart grid technology, IoT integration, and the push for Make in India.",
        content:
          "India's electrical panel manufacturing industry is at a pivotal juncture. With the government's push for indigenous manufacturing under the \"Make in India\" initiative and the rapid adoption of smart grid technologies, the sector is poised for significant growth and transformation.\n\n## The Smart Panel Revolution\n\nModern electrical panels are no longer just passive distribution boards. The integration of IoT sensors, cloud connectivity, and intelligent monitoring systems has transformed them into smart devices capable of real-time data analytics, predictive maintenance, and remote control.\n\n## Key Trends Shaping the Industry\n\n### 1. Digital Twin Technology\nManufacturers are leveraging digital twin technology to create virtual replicas of electrical panels.\n\n### 2. Sustainable Manufacturing\nWith growing emphasis on sustainability, manufacturers are adopting eco-friendly materials and energy-efficient production processes.\n\n### 3. Automation and Industry 4.0\nFactory automation, robotic assembly lines, and AI-powered quality control systems are becoming standard.\n\n### 4. Customization and Modular Design\nCustomers increasingly demand customized solutions. Modular panel designs are gaining popularity.",
        author: "Shri Vaari",
        published: true,
      },
      {
        title: "Understanding HT and LT Panels: A Complete Guide",
        slug: "understanding-ht-and-lt-panels-complete-guide",
        excerpt:
          "High Tension and Low Tension panels form the backbone of industrial electrical systems.",
        content:
          "Electrical panels are the nerve centers of any industrial power distribution system.\n\n## What are HT Panels?\nHigh Tension panels operate at voltages above 1kV, typically at 11kV, 22kV, or 33kV.\n\n## What are LT Panels?\nLow Tension panels operate at voltages up to 1kV, typically 415V in three-phase systems.\n\n### Types of LT Panels\n- PCC (Power Control Centre)\n- MCC (Motor Control Centre)\n- PMCC: Combined PCC and MCC\n- APFC Panel: Automatic power factor correction\n- DG Synchronization Panel\n- PLC Panel: Programmable logic control",
        author: "Shri Vaari",
        published: true,
      },
      {
        title: "Solar Energy: Powering India's Sustainable Future",
        slug: "solar-energy-powering-india-sustainable-future",
        excerpt:
          "India's solar energy sector is booming with ambitious targets and rapid installations.",
        content:
          "India has emerged as one of the world's fastest-growing solar energy markets, with installed capacity crossing 70 GW and ambitious targets of 280 GW by 2030.\n\n## Role of Electrical Engineering Companies\n\n1. Design & Engineering\n2. HT Panel Integration\n3. Switchyard Construction\n4. Utility Liaison\n5. Testing & Commissioning\n6. AMC Services",
        author: "Shri Vaari",
        published: true,
      },
      {
        title: "Importance of Energy Audits for Industrial Facilities",
        slug: "importance-of-energy-audits-industrial-facilities",
        excerpt:
          "Energy audits are essential for identifying wastage, reducing costs, and ensuring power quality.",
        content:
          "A comprehensive energy audit can identify 15-30% potential energy savings.\n\n## Why Energy Audits Matter\n\n### 1. Cost Reduction\nIndustrial facilities typically waste 15-30% of energy through inefficiencies.\n\n### 2. Power Factor Optimization\n### 3. Harmonic Assessment\n### 4. Equipment Health Assessment\n\n## ROI of Energy Audits\n- Payback Period: 3-6 months for most recommendations",
        author: "Shri Vaari",
        published: true,
      },
    ];

    for (const blog of blogs) {
      await db.blog.create({ data: blog });
    }

    // ============================================================
    // 7. PROJECTS (12+)
    // ============================================================
    const projects = [
      {
        name: "11KV/433V Electrification",
        client: "Madras Security Printers",
        location: "Chennai",
        description: "Complete electrification project including 11KV VCB panels, 11KV/433V transformers, LT panels, and cabling.",
        category: "completed",
        order: 1,
      },
      {
        name: "33KV 1250A VCB Panel",
        client: "M.J. Casting Limited",
        location: "Hosur",
        description: "Supply and installation of 33KV 1250A VCB panel with complete protection scheme.",
        category: "completed",
        order: 2,
      },
      {
        name: "11KV/433V Electrification",
        client: "PSG Institute of Technology",
        location: "Coimbatore",
        description: "Campus-wide electrification project including 11KV switchyard, distribution transformers, LT panels.",
        category: "completed",
        order: 3,
      },
      {
        name: "110KV/11KV Switchyard",
        client: "Ashok Leyland",
        location: "Hosur",
        description: "Design, engineering, and construction of 110KV/11KV switchyard including power transformers and VCB panels.",
        category: "ongoing",
        order: 4,
      },
      {
        name: "132KV/11KV Switchyard",
        client: "MM Forging",
        location: "Viralimalai",
        description: "Complete 132KV/11KV switchyard construction with SCADA system.",
        category: "completed",
        order: 5,
      },
      {
        name: "33KV Bay Extension for 10MW Solar",
        client: "Solon India",
        location: "Mothagam",
        description: "33KV bay extension work for 10MW solar power plant integration.",
        category: "completed",
        order: 6,
      },
      {
        name: "11KV VCB Panels",
        client: "TVS Srichakra",
        location: "Madurai",
        description: "Supply and commissioning of 11KV VCB panels with numerical protection relays.",
        category: "completed",
        order: 7,
      },
      {
        name: "11KV Transformer/VCB Panels",
        client: "Delta Electronics",
        location: "Hosur",
        description: "Complete 11KV switchboard with transformer feed VCB panels. Includes CEIG approval and TNEB liaison.",
        category: "completed",
        order: 8,
      },
      {
        name: "230KV Substation & Transmission Line",
        client: "TATA Power",
        location: "Mumbai",
        description: "Engineering, supply, and construction of 230KV substation with associated transmission line infrastructure and SCADA integration.",
        category: "ongoing",
        order: 9,
      },
      {
        name: "110KV GIS Substation",
        client: "Reliance Industries",
        location: "Jamnagar",
        description: "Supply and commissioning of 110KV Gas Insulated Substation for refinery power distribution with dual feed arrangement.",
        category: "ongoing",
        order: 10,
      },
      {
        name: "450MW Ground-Mount Solar EPC",
        client: "NTPC Limited",
        location: "Hyderabad",
        description: "Complete EPC for 450MW ground-mounted solar plant including 33KV/132KV switchyard, power evacuation, and grid connectivity.",
        category: "ongoing",
        order: 11,
      },
      {
        name: "Airport HT Distribution Upgrade",
        client: "Bangalore International Airport",
        location: "Bangalore",
        description: "Upgrade of entire HT distribution network including 11KV panels, transformers, and SCADA system for terminal expansion.",
        category: "ongoing",
        order: 12,
      },
      {
        name: "Dalmia Cement 33KV Switchyard",
        client: "Dalmia Cement",
        location: "Dalmiapuram",
        description: "Design, engineering, and construction of 33KV switchyard with VT and CT chambers, protection panels, and control room equipment.",
        category: "completed",
        order: 13,
      },
      {
        name: "Chennai Petroleum 11KV Panels",
        client: "Chennai Petroleum Corporation",
        location: "Chennai",
        description: "Supply of flameproof 11KV panels for refinery application with anti-explosive certification and special protection schemes.",
        category: "completed",
        order: 14,
      },
    ];

    for (const project of projects) {
      await db.project.create({ data: project });
    }

    // ============================================================
    // 8. SITE SETTINGS (expanded)
    // ============================================================
    const settings = [
      { key: "company_name", value: "Shri Vaari Electricals Pvt Ltd" },
      { key: "company_short_name", value: "SVEPL" },
      { key: "company_tagline", value: "Concept to Commissioning" },
      { key: "company_phone", value: "+91 9941905833" },
      { key: "company_email", value: "srivaari@gmail.com" },
      { key: "company_admin_email", value: "admin@shrivaari.com" },
      { key: "company_address", value: "C-37, Thiru-Vi-Ka Industrial Estate, Guindy, Chennai - 600032, Tamil Nadu, India" },
      { key: "company_city", value: "Chennai" },
      { key: "company_state", value: "Tamil Nadu" },
      { key: "company_country", value: "India" },
      { key: "business_hours", value: "Mon-Sat: 9:30am to 6:30pm" },
      { key: "hero_subtitle", value: "Design to Post-commissioning" },
      {
        key: "about_text",
        value:
          "Shri Vaari Electricals Pvt. Ltd. is a professionally managed, multi-location based engineering firm, having market leadership in South India and on its way to establish significant position in the pan Indian market. We offer innovative and value-added solutions to our customers for total electrical systems from design to commissioning.",
      },
      { key: "about_mission", value: "To be the most trusted and preferred electrical engineering partner for industries across India and beyond, delivering excellence from concept to commissioning." },
      { key: "about_vision", value: "To emerge as a pan-India leader in EHV projects, solar EPC, and industrial electrical solutions, driving innovation and sustainability in power infrastructure." },
      { key: "founded_year", value: "1998" },
      { key: "crisil_rating", value: "BB+" },
      { key: "tneb_class", value: "Class-1" },
      { key: "max_voltage", value: "400 KV" },
      { key: "international_countries", value: "6" },
      { key: "certification", value: "IEC-61439" },
      { key: "stat_customers", value: "3000+" },
      { key: "stat_employees", value: "364+" },
      { key: "stat_branches", value: "8" },
      { key: "stat_turnover", value: "200 Crores" },
      { key: "stat_mncs", value: "20+" },
      { key: "stat_transmission", value: "100Km+" },
      { key: "stat_consultants", value: "20+" },
      { key: "stat_ehv", value: "55+" },
      { key: "stat_solar_mw", value: "450+" },
      { key: "stat_panels_installed", value: "10000+" },
      { key: "stat_projects", value: "1200+" },
      { key: "stat_cagr", value: "~23%" },
      { key: "youtube_video_url", value: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
      { key: "social_linkedin", value: "https://www.linkedin.com/company/shrivaari" },
      { key: "social_facebook", value: "https://www.facebook.com/shrivaari" },
      { key: "social_twitter", value: "" },
      { key: "social_instagram", value: "" },
      { key: "meta_title", value: "Shri Vaari Electricals Pvt Ltd | HT/LT Panels, Switchyards, Solar EPC" },
      { key: "meta_description", value: "Leading electrical engineering company in South India specializing in HT/LT panel manufacturing, EHV switchyards, solar EPC, and complete power infrastructure solutions. CRISIL BB+ rated, 29+ years experience." },
      { key: "google_maps_embed", value: "" },
    ];

    for (const setting of settings) {
      await db.siteSetting.create({ data: setting });
    }

    // ============================================================
    // 9. TEAM MEMBERS (6 Directors)
    // ============================================================
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
        gradientFrom: "#2A5A8A",
        gradientTo: "#34D399",
        accent: "#2A5A8A",
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
      await db.teamMember.create({ data: member });
    }

    // ============================================================
    // 10. SECTORS (10)
    // ============================================================
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
        details: JSON.stringify([
          "EHV Substations up to 400KV",
          "Switchyard design & construction",
          "Power transformer installation",
          "SCADA & protection system integration",
        ]),
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
        details: JSON.stringify([
          "LT/HT Panel supply & installation",
          "Motor Control Centres (MCC)",
          "Power Control Centres (PCC)",
          "Industrial automation & PLC panels",
        ]),
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
        details: JSON.stringify([
          "Flameproof panel manufacturing",
          "GIS substation construction",
          "Hazardous area classification design",
          "Fire-rated cable & busduct systems",
        ]),
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
        details: JSON.stringify([
          "Rooftop solar EPC (up to 5.5MW)",
          "Ground-mounted solar plants",
          "Power evacuation & grid integration",
          "Net metering & utility liaison",
        ]),
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
        details: JSON.stringify([
          "HT/LT distribution for commercial buildings",
          "Building Management Systems (BMS)",
          "Emergency power & DG synchronization",
          "Energy-efficient lighting & APFC systems",
        ]),
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
        details: JSON.stringify([
          "Airport electrical systems",
          "Railway & metro substation works",
          "Port & harbor power distribution",
          "Tunnel ventilation & emergency systems",
        ]),
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
        details: JSON.stringify([
          "Heavy-duty LT/HT panel manufacturing",
          "Kiln & mill motor control systems",
          "Dust-resistant panel enclosures",
          "High-capacity busbar trunking systems",
        ]),
        order: 7,
      },
      {
        name: "Chemical & Pharmaceutical",
        description: "Precision electrical installations for chemical processing plants and pharmaceutical manufacturing with cleanroom-compatible panels and compliance to FDA/GMP standards.",
        icon: "FlaskConical",
        stat: "25+",
        statLabel: "Pharma/Chem Projects",
        gradientFrom: "#2A5A8A",
        gradientTo: "#34D399",
        accent: "#2A5A8A",
        details: JSON.stringify([
          "Cleanroom-compatible panels",
          "Corrosion-resistant enclosures",
          "Redundant power supply systems",
          "GMP-compliant electrical design",
        ]),
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
        details: JSON.stringify([
          "Hospital-grade electrical systems",
          "Uninterruptible power supply (UPS) integration",
          "Emergency backup & fire safety systems",
          "CEIG/CEA compliance & certification",
        ]),
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
        details: JSON.stringify([
          "Substation projects in Nigeria & Sierra Leone",
          "Power infrastructure in Qatar & Oman",
          "Electrification projects in Bangladesh",
          "Grid connectivity in Sri Lanka",
        ]),
        order: 10,
      },
    ];

    for (const sector of sectors) {
      await db.sector.create({ data: sector });
    }

    // ============================================================
    // 11. MILESTONES (11)
    // ============================================================
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
      await db.milestone.create({ data: milestone });
    }

    // ============================================================
    // 12. BRANCHES (8)
    // ============================================================
    const branches = [
      {
        city: "Chennai",
        state: "Tamil Nadu",
        type: "Headquarters",
        icon: "Building2",
        isHQ: true,
        order: 1,
      },
      {
        city: "Hyderabad",
        state: "Telangana",
        type: "Regional Office",
        icon: "MapPin",
        isHQ: false,
        order: 2,
      },
      {
        city: "Bangalore",
        state: "Karnataka",
        type: "Regional Office",
        icon: "MapPin",
        isHQ: false,
        order: 3,
      },
      {
        city: "Vishakhapatnam",
        state: "Andhra Pradesh",
        type: "Branch Office",
        icon: "MapPin",
        isHQ: false,
        order: 4,
      },
      {
        city: "Tirupati",
        state: "Andhra Pradesh",
        type: "Branch Office",
        icon: "MapPin",
        isHQ: false,
        order: 5,
      },
      {
        city: "Pondicherry",
        state: "Puducherry",
        type: "Branch Office",
        icon: "MapPin",
        isHQ: false,
        order: 6,
      },
      {
        city: "Hosur",
        state: "Tamil Nadu",
        type: "Branch Office",
        icon: "MapPin",
        isHQ: false,
        order: 7,
      },
      {
        city: "Trivandrum",
        state: "Kerala",
        type: "Branch Office",
        icon: "MapPin",
        isHQ: false,
        order: 8,
      },
    ];

    for (const branch of branches) {
      await db.branch.create({ data: branch });
    }

    // ============================================================
    // 13. CAREERS (8 job openings)
    // ============================================================
    const careers = [
      {
        title: "Senior Electrical Engineer",
        location: "Chennai",
        experience: "5-10 years",
        department: "Engineering",
        type: "Full-time",
        icon: "Zap",
        accent: "#1B3A5C",
        order: 1,
      },
      {
        title: "Project Manager — Solar EPC",
        location: "Bangalore",
        experience: "8-12 years",
        department: "Operations",
        type: "Full-time",
        icon: "Hammer",
        accent: "#E8751A",
        order: 2,
      },
      {
        title: "Testing & Commissioning Engineer",
        location: "Hyderabad",
        experience: "3-7 years",
        department: "Engineering",
        type: "Full-time",
        icon: "FlaskConical",
        accent: "#1B3A5C",
        order: 3,
      },
      {
        title: "Site Engineer — Transmission Lines",
        location: "Multiple Locations",
        experience: "2-5 years",
        department: "Operations",
        type: "Full-time",
        icon: "Building2",
        accent: "#E8751A",
        order: 4,
      },
      {
        title: "Design Engineer — LT/HT Panels",
        location: "Chennai",
        experience: "3-6 years",
        department: "Design",
        type: "Full-time",
        icon: "Lightbulb",
        accent: "#7C3AED",
        order: 5,
      },
      {
        title: "Liasion Officer — CEIG/TNEB",
        location: "Chennai",
        experience: "5-10 years",
        department: "Operations",
        type: "Full-time",
        icon: "Shield",
        accent: "#E8751A",
        order: 6,
      },
      {
        title: "AMC Service Technician",
        location: "Pondicherry",
        experience: "2-4 years",
        department: "Service",
        type: "Full-time",
        icon: "Sparkles",
        accent: "#0D9488",
        order: 7,
      },
      {
        title: "Graduate Engineer Trainee",
        location: "All Branches",
        experience: "Freshers Welcome",
        department: "Engineering",
        type: "Full-time",
        icon: "GraduationCap",
        accent: "#1B3A5C",
        order: 8,
      },
    ];

    for (const career of careers) {
      await db.career.create({ data: career });
    }

    // ============================================================
    // DONE - Return counts
    // ============================================================
    console.log("Auto-seeding complete!");

    return NextResponse.json({
      message: "Database seeded successfully!",
      seeded: true,
      counts: {
        users: 1,
        products: ltProducts.length + htProducts.length,
        services: services.length,
        clients: clients.length,
        testimonials: testimonials.length,
        blogs: blogs.length,
        projects: projects.length,
        settings: settings.length,
        teamMembers: teamMembers.length,
        sectors: sectors.length,
        milestones: milestones.length,
        branches: branches.length,
        careers: careers.length,
      },
    });
  } catch (error) {
    console.error("Seed API error:", error);
    seedAttempted = false;
    return NextResponse.json(
      { message: "Seeding failed", error: String(error) },
      { status: 500 }
    );
  }
}
