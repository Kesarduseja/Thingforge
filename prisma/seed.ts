import { PrismaClient } from '@prisma/client';
import { calculateStartupMatch } from '../src/lib/ai-matching.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting PRAMAN Database Seeding...');

  // Clear existing tables
  await prisma.notification.deleteMany({});
  await prisma.auditLog.deleteMany({});
  await prisma.reuseOpportunity.deleteMany({});
  await prisma.decision.deleteMany({});
  await prisma.kPI.deleteMany({});
  await prisma.milestone.deleteMany({});
  await prisma.pilot.deleteMany({});
  await prisma.evaluation.deleteMany({});
  await prisma.matchScore.deleteMany({});
  await prisma.challenge.deleteMany({});
  await prisma.startup.deleteMany({});
  await prisma.department.deleteMany({});
  await prisma.user.deleteMany({});

  // 1. Create Demo Users for Role-Based Access
  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Rajesh Sharma (IAS)',
        email: 'gov@praman.gov.in',
        role: 'GOVERNMENT',
        department: 'Urban Development & Municipal Affairs Dept',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Ananya Verma (CEO, EcoSmart)',
        email: 'startup@ecosmart.io',
        role: 'STARTUP',
        startupName: 'EcoSmart Waste Tech',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Dr. Vikramaditya Roy',
        email: 'expert@iitb.ac.in',
        role: 'EVALUATOR',
        department: 'Dept of Smart Infrastructure, IIT Bombay',
      },
    }),
    prisma.user.create({
      data: {
        name: 'P. K. Mishra (Procurement Director)',
        email: 'authority@procure.gov.in',
        role: 'DECISION_AUTHORITY',
        department: 'State Innovation Procurement Board',
      },
    }),
    prisma.user.create({
      data: {
        name: 'PRAMAN System Administrator',
        email: 'admin@praman.gov.in',
        role: 'ADMIN',
      },
    }),
  ]);

  console.log('✅ Created Demo Users');

  // 2. Create Departments
  const dept = await prisma.department.create({
    data: {
      name: 'Urban Development & Municipal Affairs Department',
      code: 'UDMA-MH',
      domain: 'Smart Cities & Sanitation',
      state: 'Maharashtra',
      city: 'Mumbai',
    },
  });

  // 3. Create Sample Startups
  const startups = await Promise.all([
    prisma.startup.create({
      data: {
        name: 'EcoSmart Waste Tech',
        description: 'AI-driven smart bin sensors and dynamic route optimization software for municipal waste management.',
        domain: 'Smart Waste Management',
        technologies: 'AI/ML, IoT Sensors, Route Optimization, GIS Mapping, Web Dashboards',
        location: 'Pune, Maharashtra',
        teamSize: 24,
        stage: 'Growth Stage',
        yearsOperating: 4,
        previousProjects: 'Smart Garbage Tracking Pilot in Pimpri-Chinchwad Municipal Corp (120 bins monitored)',
        certifications: 'DIPP Recognized (DIPP98721), ISO 9001:2015, CPCB Certified',
        complianceStatus: 'Fully Compliant',
        fundingInfo: 'Seed Funded (₹1.8 Cr by CleanTech Fund)',
        solutionDescription: 'Dynamic ultrasonic fill-level sensors installed on municipal bins transmitting real-time fill status to an AI routing engine that auto-dispatches municipal collection trucks, reducing fuel costs by 34% and preventing bin overflows.',
        contactEmail: 'contact@ecosmart.io',
      },
    }),
    prisma.startup.create({
      data: {
        name: 'CleanCity Analytics AI',
        description: 'Computer vision & IoT analytics platform for city sanitation monitoring and route dispatch.',
        domain: 'Smart Waste & CleanTech',
        technologies: 'Computer Vision, IoT Sensors, Predictive Analytics, React Native, Python',
        location: 'Mumbai, Maharashtra',
        teamSize: 18,
        stage: 'Seed Stage',
        yearsOperating: 3,
        previousProjects: 'Commercial waste monitoring for 40+ corporate parks in BKC',
        certifications: 'DIPP Recognized (DIPP84320), ISO 27001',
        complianceStatus: 'Fully Compliant',
        fundingInfo: 'Bootstrapped / Angel (₹80 Lakhs)',
        solutionDescription: 'CCTV camera-based waste dump detection paired with smart bin fill alerts.',
        contactEmail: 'hello@cleancity.ai',
      },
    }),
    prisma.startup.create({
      data: {
        name: 'GreenLoop Systems',
        description: 'Decentralized organic waste processing IoT units with smart monitoring dashboards.',
        domain: 'CleanTech & Circular Economy',
        technologies: 'IoT Sensors, SCADA Controllers, Solar Integration, Mobile App',
        location: 'Bengaluru, Karnataka',
        teamSize: 15,
        stage: 'Seed Stage',
        yearsOperating: 3,
        previousProjects: 'Organic waste converter units for 25 apartment complexes',
        certifications: 'DIPP Recognized (DIPP76211)',
        complianceStatus: 'Verified',
        fundingInfo: 'Grant Funded (BIRAC ₹50 Lakhs)',
        solutionDescription: 'On-site organic waste composting units with remote IoT temperature and moisture tracking.',
        contactEmail: 'info@greenloop.in',
      },
    }),
    prisma.startup.create({
      data: {
        name: 'Civix Logistics & Route AI',
        description: 'Fleet management & GPS truck tracking software for municipal vehicles.',
        domain: 'Urban Logistics',
        technologies: 'GPS Tracking, Route Optimization, Fleet Telematics, React, Node.js',
        location: 'Hyderabad, Telangana',
        teamSize: 20,
        stage: 'Growth Stage',
        yearsOperating: 5,
        previousProjects: 'Bus fleet tracking for Telangana State Road Transport',
        certifications: 'DIPP Recognized (DIPP55432)',
        complianceStatus: 'Fully Compliant',
        fundingInfo: 'Series A (₹4.5 Cr)',
        solutionDescription: 'GPS telematics box for garbage trucks without smart bin sensor integration.',
        contactEmail: 'support@civixlogistics.com',
      },
    }),
    prisma.startup.create({
      data: {
        name: 'UrbanTech Smart Sensors',
        description: 'Generic smart city IoT hardware manufacturer specializing in environmental & water sensors.',
        domain: 'Smart City Hardware',
        technologies: 'LoRaWAN, Hardware Engineering, Microcontrollers, Microservices',
        location: 'Delhi NCR',
        teamSize: 30,
        stage: 'Growth Stage',
        yearsOperating: 6,
        previousProjects: 'Smart street lighting sensor network for NDMC',
        certifications: 'ISO 9001, CE Certified',
        complianceStatus: 'Verified',
        fundingInfo: 'Bootstrapped',
        solutionDescription: 'Custom IoT sensor nodes for various municipal telemetry measurements.',
        contactEmail: 'sales@urbantech.in',
      },
    }),
    prisma.startup.create({
      data: {
        name: 'WasteRecycle Robotics',
        description: 'AI-powered robotic sorting arms for material recovery facilities.',
        domain: 'Robotics & Recycling',
        technologies: 'Computer Vision, Robotics, Deep Learning, Edge Computing',
        location: 'Chennai, Tamil Nadu',
        teamSize: 12,
        stage: 'Early Stage',
        yearsOperating: 2,
        previousProjects: 'Automated plastic sorting pilot for private recycler in Ambattur',
        certifications: 'DIPP Recognized (DIPP12093)',
        complianceStatus: 'Pending Verification',
        fundingInfo: 'Pre-seed (₹30 Lakhs)',
        solutionDescription: 'Robotic conveyor arms that sort recyclable plastics at waste processing plants.',
        contactEmail: 'team@wasterecyclebot.com',
      },
    }),
    prisma.startup.create({
      data: {
        name: 'BioClean Energy Tech',
        description: 'Waste-to-energy biomethanation plant automation and monitoring systems.',
        domain: 'Clean Energy & Biomass',
        technologies: 'Process Automation, SCADA, Anaerobic Digestion Tech',
        location: 'Ahmedabad, Gujarat',
        teamSize: 28,
        stage: 'Growth Stage',
        yearsOperating: 5,
        previousProjects: '10 TPD Biomethanation plant automation in Surat',
        certifications: 'ISO 14001, MNRE Approved',
        complianceStatus: 'Fully Compliant',
        fundingInfo: 'Venture Backed',
        solutionDescription: 'Large scale bio-CNG generation control systems.',
        contactEmail: 'contact@biocleanenergy.in',
      },
    }),
    prisma.startup.create({
      data: {
        name: 'AquaPure Water Tech',
        description: 'Real-time water quality monitoring and leak detection network for municipal water supply.',
        domain: 'Water Utilities',
        technologies: 'Water Flow Sensors, Chemical Spectrometry, Cellular Telemetry',
        location: 'Jaipur, Rajasthan',
        teamSize: 16,
        stage: 'Seed Stage',
        yearsOperating: 3,
        previousProjects: 'Jal Jeevan Mission telemetry pilot in 12 villages',
        certifications: 'DIPP Recognized (DIPP65431)',
        complianceStatus: 'Fully Compliant',
        fundingInfo: 'Seed Funded (₹1 Cr)',
        solutionDescription: 'Pipe flow sensors and online water quality testing nodes.',
        contactEmail: 'info@aquapure.co.in',
      },
    }),
  ]);

  console.log(`✅ Seeded ${startups.length} Demo Startups`);

  // 4. Create Primary Challenge (SIH Primary Demo Scenario)
  const challenge = await prisma.challenge.create({
    data: {
      title: 'AI-Enabled Solid Waste Collection Optimization System',
      problemDescription: 'Municipal waste collection routes are inefficient, leading to bin overflows, high fuel consumption, delayed citizen complaint redressal, and lack of real-time visibility for city authorities across 14 municipal zones.',
      departmentName: 'Urban Development & Municipal Affairs Department',
      domain: 'Smart Waste Management',
      requiredTechnologies: 'AI/ML, IoT Sensors, Route Optimization, GIS Mapping',
      budgetRange: '₹15 Lakhs - ₹40 Lakhs (Pilot Stage)',
      location: 'Mumbai & Thane Region, Maharashtra',
      eligibilityRequirements: 'DIPP Recognized Startup, Minimum 2 Years Operating, Prior IoT/Analytics Pilot Experience, Fully Compliant Statutory Status',
      expectedOutcomes: 'Reduce bin overflow incidents by >80%, improve collection truck route efficiency by >25%, achieve real-time dashboard visibility across 250 smart bins.',
      pilotDuration: '60 Days',
      kpis: 'Response Time < 15 mins, Bin Overflow Reduction > 80%, Truck Fuel Saving > 20%, Citizen Complaint Resolution Rate > 90%',
      status: 'PILOT_ACTIVE',
    },
  });

  console.log('✅ Created Primary Demo Challenge');

  // 5. Generate Match Scores for all Startups against Primary Challenge using our AI Engine
  for (const st of startups) {
    const match = calculateStartupMatch(
      {
        domain: challenge.domain,
        requiredTechnologies: challenge.requiredTechnologies,
        eligibilityRequirements: challenge.eligibilityRequirements,
        location: challenge.location,
      },
      {
        domain: st.domain,
        technologies: st.technologies,
        certifications: st.certifications,
        yearsOperating: st.yearsOperating,
        complianceStatus: st.complianceStatus,
        previousProjects: st.previousProjects,
        stage: st.stage,
        location: st.location,
      }
    );

    await prisma.matchScore.create({
      data: {
        challengeId: challenge.id,
        startupId: st.id,
        totalScore: match.totalScore,
        domainScore: match.domainScore,
        techScore: match.techScore,
        eligibilityScore: match.eligibilityScore,
        experienceScore: match.experienceScore,
        locationStageScore: match.locationStageScore,
        matchedSkills: JSON.stringify(match.matchedSkills),
        missingSkills: JSON.stringify(match.missingSkills),
        whyExplanation: match.whyExplanation,
        eligibilityStatus: match.eligibilityStatus,
      },
    });
  }

  console.log('✅ Calculated AI Match Scores for all Startups');

  // 6. Expert Evaluation for Top Startup (EcoSmart Waste Tech)
  const ecoSmart = startups[0]; // EcoSmart Waste Tech
  const evaluatorUser = users[2]; // Dr. Vikramaditya Roy

  await prisma.evaluation.create({
    data: {
      challengeId: challenge.id,
      startupId: ecoSmart.id,
      evaluatorId: evaluatorUser.id,
      technicalFeasibility: 24,  // Max 25
      innovation: 18,            // Max 20
      costEffectiveness: 14,     // Max 15
      scalability: 14,           // Max 15
      publicImpact: 14,          // Max 15
      implementationReadiness: 9,// Max 10
      totalScore: 93,            // Sum = 93/100
      comments: 'EcoSmart demonstrates a exceptionally strong hardware-software integration. Ultrasonic sensors have proven battery longevity and the GIS routing engine handles dense urban traffic conditions seamlessly.',
    },
  });

  // Second evaluation for CleanCity Analytics
  await prisma.evaluation.create({
    data: {
      challengeId: challenge.id,
      startupId: startups[1].id,
      evaluatorId: evaluatorUser.id,
      technicalFeasibility: 21,
      innovation: 17,
      costEffectiveness: 12,
      scalability: 13,
      publicImpact: 13,
      implementationReadiness: 8,
      totalScore: 84,
      comments: 'Solid computer vision capability, though camera maintenance in dusty road conditions requires clear SLA safeguards.',
    },
  });

  console.log('✅ Created Expert Evaluations');

  // 7. Active Pilot Setup for EcoSmart Waste Tech
  const pilot = await prisma.pilot.create({
    data: {
      challengeId: challenge.id,
      startupId: ecoSmart.id,
      departmentName: 'Urban Development & Municipal Affairs Department',
      title: 'PRAMAN Pilot: Smart Bin Fill Telemetry & AI Route Dispatch (Zone 4 & 7)',
      startDate: '2026-07-01',
      endDate: '2026-08-30',
      status: 'IN_PROGRESS',
      progress: 75,
      pilotSuccessScore: 88,
      procurementReadinessScore: 92,
      blockers: '⚠ Final statutory GST compliance document pending upload from startup',
    },
  });

  // Milestones for Pilot
  await Promise.all([
    prisma.milestone.create({
      data: {
        pilotId: pilot.id,
        title: 'Phase 1: Hardware Deployment & Calibration',
        description: 'Installation of 250 ultrasonic fill-level sensors on municipal bins across Zone 4 & 7.',
        targetDate: '2026-07-15',
        status: 'COMPLETED',
        evidenceUrl: 'https://praman.gov.in/evidence/phase1_deployment_report.pdf',
        comments: 'All 250 sensors activated and broadcasting via LoRaWAN network. 100% data transmission signal strength.',
      },
    }),
    prisma.milestone.create({
      data: {
        pilotId: pilot.id,
        title: 'Phase 2: AI Dispatch Integration & Testing',
        description: 'Integration of dynamic routing algorithm with municipal sanitation truck driver tablet units.',
        targetDate: '2026-07-31',
        status: 'COMPLETED',
        evidenceUrl: 'https://praman.gov.in/evidence/ai_dispatch_verification.pdf',
        comments: 'Driver application deployed to 18 collection vehicles with automated route turn-by-turn navigation.',
      },
    }),
    prisma.milestone.create({
      data: {
        pilotId: pilot.id,
        title: 'Phase 3: Mid-Pilot Performance Review',
        description: '30-day continuous monitoring of overflow incidents and fuel consumption metrics.',
        targetDate: '2026-08-15',
        status: 'COMPLETED',
        evidenceUrl: 'https://praman.gov.in/evidence/mid_pilot_audit.pdf',
        comments: 'Overflow complaints dropped by 84%. Route distance optimized by 28.5%.',
      },
    }),
    prisma.milestone.create({
      data: {
        pilotId: pilot.id,
        title: 'Phase 4: Final Evaluation & Scale Blueprint',
        description: 'End-to-end outcome measurement and preparation of multi-city procurement proposal.',
        targetDate: '2026-08-30',
        status: 'IN_PROGRESS',
        evidenceUrl: 'https://praman.gov.in/evidence/final_scale_blueprint_draft.pdf',
        comments: 'Final evaluation meeting scheduled with State Innovation Procurement Board.',
      },
    }),
  ]);

  // KPIs for Pilot
  await Promise.all([
    prisma.kPI.create({
      data: {
        pilotId: pilot.id,
        name: 'Bin Overflow Response Time',
        baseline: '45 mins',
        target: '15 mins',
        actual: '12 mins',
        achievementPct: 120,
        status: 'PASS',
      },
    }),
    prisma.kPI.create({
      data: {
        pilotId: pilot.id,
        name: 'Collection Truck Fuel Saving',
        baseline: '0% (Baseline)',
        target: '20%',
        actual: '28.5%',
        achievementPct: 142,
        status: 'PASS',
      },
    }),
    prisma.kPI.create({
      data: {
        pilotId: pilot.id,
        name: 'Public Garbage Complaint Redressal',
        baseline: '62% resolved',
        target: '90% resolved',
        actual: '96% resolved',
        achievementPct: 107,
        status: 'PASS',
      },
    }),
    prisma.kPI.create({
      data: {
        pilotId: pilot.id,
        name: 'Sensor Telemetry Uptime',
        baseline: 'N/A',
        target: '98.0%',
        actual: '99.4%',
        achievementPct: 101,
        status: 'PASS',
      },
    }),
  ]);

  console.log('✅ Created Pilot Workspace, Milestones & KPI Outcome Data');

  // 8. Cross-Department Reuse Opportunities (Module 11)
  await Promise.all([
    prisma.reuseOpportunity.create({
      data: {
        solutionTitle: 'AI-Enabled Solid Waste Collection & Dynamic Dispatch System',
        startupName: 'EcoSmart Waste Tech',
        originDept: 'Urban Development & Municipal Affairs Dept (Mumbai/Thane)',
        targetDept: 'Brihanmumbai Municipal Corporation (BMC)',
        targetCity: 'Mumbai',
        similarityScore: 96,
        matchingReason: 'High density urban waste collection problem statement with 92% structural similarity in bin density and vehicle logistics.',
        status: 'PROPOSED',
      },
    }),
    prisma.reuseOpportunity.create({
      data: {
        solutionTitle: 'AI-Enabled Solid Waste Collection & Dynamic Dispatch System',
        startupName: 'EcoSmart Waste Tech',
        originDept: 'Urban Development & Municipal Affairs Dept (Mumbai/Thane)',
        targetDept: 'Pune Municipal Corporation (PMC)',
        targetCity: 'Pune',
        similarityScore: 91,
        matchingReason: 'Similar smart city IoT mandate. PMC recently published tender RFQ for garbage truck telematics.',
        status: 'PROPOSED',
      },
    }),
    prisma.reuseOpportunity.create({
      data: {
        solutionTitle: 'AI-Enabled Solid Waste Collection & Dynamic Dispatch System',
        startupName: 'EcoSmart Waste Tech',
        originDept: 'Urban Development & Municipal Affairs Dept (Mumbai/Thane)',
        targetDept: 'Nagpur Municipal Corporation (NMC)',
        targetCity: 'Nagpur',
        similarityScore: 88,
        matchingReason: 'Active municipal waste optimization requirement under Swachh Bharat Urban 2.0 grant.',
        status: 'PROPOSED',
      },
    }),
  ]);

  console.log('✅ Seeded Scale & Reuse Opportunities');

  // 9. Initial Audit Trail Logs
  await Promise.all([
    prisma.auditLog.create({
      data: {
        userId: users[0].id,
        userName: users[0].name,
        userRole: 'GOVERNMENT',
        action: 'CHALLENGE_CREATED',
        details: 'Created challenge: AI-Enabled Solid Waste Collection Optimization System (ID: UDMA-2026-01)',
      },
    }),
    prisma.auditLog.create({
      data: {
        userId: users[4].id,
        userName: 'PRAMAN AI Engine',
        userRole: 'SYSTEM',
        action: 'AI_MATCHING_COMPLETED',
        details: 'Evaluated 8 registered startups. Top match identified: EcoSmart Waste Tech (Match Score: 92%)',
      },
    }),
    prisma.auditLog.create({
      data: {
        userId: users[2].id,
        userName: users[2].name,
        userRole: 'EVALUATOR',
        action: 'EXPERT_EVALUATION_SUBMITTED',
        details: 'Submitted evaluation score for EcoSmart Waste Tech: 93/100 (Technical Feasibility: 24/25)',
      },
    }),
    prisma.auditLog.create({
      data: {
        userId: users[0].id,
        userName: users[0].name,
        userRole: 'GOVERNMENT',
        action: 'PILOT_INITIATED',
        details: 'Approved 60-day field pilot for EcoSmart Waste Tech in Zone 4 & 7',
      },
    }),
    prisma.auditLog.create({
      data: {
        userId: users[1].id,
        userName: users[1].name,
        userRole: 'STARTUP',
        action: 'MILESTONE_UPDATED',
        details: 'Updated Milestone Phase 3 to COMPLETED with KPI evidence report upload',
      },
    }),
  ]);

  console.log('✅ Created Initial Audit Trail Logs');

  // 10. Sample Notifications
  await Promise.all([
    prisma.notification.create({
      data: {
        role: 'DECISION_AUTHORITY',
        title: 'Procurement Review Ready',
        message: 'Pilot UDMA-2026-01 for EcoSmart Waste Tech has reached 92/100 Procurement Readiness Score. Authorized review required.',
        link: `/pilots/${pilot.id}`,
      },
    }),
    prisma.notification.create({
      data: {
        role: 'GOVERNMENT',
        title: 'KPI Achievement Alert',
        message: 'Fuel savings KPI achieved 142% of target for EcoSmart Waste Tech pilot.',
        link: `/pilots/${pilot.id}`,
      },
    }),
  ]);

  console.log('✅ Created Initial System Notifications');
  console.log('🎉 PRAMAN Seed Completed Successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
