export interface Industry {
  slug: string;
  name: string;
  iconKey: string;
  shortDesc: string;
  description: string;
  clusters: string[];
  outlook: string;
  sampleRoles: string[];
}

export const industries: Industry[] = [
  {
    slug: 'advanced-manufacturing',
    name: 'Advanced Manufacturing',
    iconKey: 'factory',
    shortDesc:
      'Automation, sensing, and cutting-edge production technology across aerospace, automotive, semiconductors, and heavy machinery.',
    description:
      'Advanced Manufacturing includes businesses and industries that use innovative technologies and processes to create products of all kinds. The sector spans a broad range of activities, unified by the use of automation, sensing, and other cutting-edge technologies in production.',
    clusters: [
      'Aerospace Vehicles, Aircraft and Defense',
      'Automotive',
      'Computers, Electronics and Semiconductors',
      'Production Technology and Heavy Machinery'
    ],
    outlook:
      'Reshoring of manufacturing, semiconductor investment, and automation buildout continue to drive employer demand for skilled operators, technicians, and supervisors. Entry roles often pair on-the-job training with industry certifications.',
    sampleRoles: [
      'CNC Operator',
      'Quality Control Inspector',
      'Industrial Maintenance Technician',
      'Production Supervisor',
      'Robotics Technician'
    ]
  },
  {
    slug: 'energy-evolution',
    name: 'Energy Evolution',
    iconKey: 'zap',
    shortDesc: 'Oil, gas, and renewables. The production and transmission of energy that powers the modern economy.',
    description:
      'Energy Evolution centers on the production and transmission of energy of all kinds, including oil, gas, and renewables. The sector reflects an all-of-the-above strategy that positions energy producers to remain economic anchors for decades to come.',
    clusters: [
      'Electric Power Generation and Transmission',
      'Oil and Gas Extraction, Production and Transportation',
      'Renewables'
    ],
    outlook:
      'Wind and utility-scale solar continue to expand alongside traditional oil and gas operations. Demand stays strong for field technicians, plant operators, lineworkers, and renewable installers as the grid modernizes.',
    sampleRoles: [
      'Wind Turbine Technician',
      'Solar Installer',
      'Electrical Lineworker',
      'Oil and Gas Field Technician',
      'Energy Plant Operator'
    ]
  },
  {
    slug: 'food-and-livestock',
    name: 'Food and Livestock Products',
    iconKey: 'wheat',
    shortDesc: 'High-quality food products from beef and poultry to tortillas and snack foods.',
    description:
      'Food and Livestock Products focuses on creating a wide variety of high-quality food products ranging from beef and poultry to tortillas and snack foods. The sector is critical to the food supply and links to several other industries, including manufacturing and life sciences.',
    clusters: ['Food Processing', 'Livestock Processing'],
    outlook:
      'Food processing and livestock processing remain steady employers as consumer demand grows and processing facilities modernize. Entry roles typically pair short-term training with on-the-job certifications.',
    sampleRoles: [
      'Food Production Worker',
      'Meat Processor',
      'Quality Assurance Technician',
      'Packaging Line Operator',
      'Cold Storage Forklift Operator'
    ]
  },
  {
    slug: 'hospitality-tourism-culture',
    name: 'Hospitality, Tourism and Culture',
    iconKey: 'camera',
    shortDesc: 'Film, music, hospitality, and tourism. The experiences that drive cultural and economic life.',
    description:
      'Hospitality, Tourism and Culture provides services and experiences to entertain and accommodate residents and visitors. The sector spans a wide range of roles, from film production to event coordination to front-of-house hospitality.',
    clusters: ['Film, Music and Culture', 'Hospitality and Tourism'],
    outlook:
      'Travel and live-events demand continues to recover and grow, and film production capacity is expanding outside traditional hubs. Hospitality and tourism employers consistently report demand for trained front-line staff and supervisors.',
    sampleRoles: [
      'Hotel Front Desk Associate',
      'Event Coordinator',
      'Restaurant Manager',
      'Film Production Assistant',
      'Tour Guide'
    ]
  },
  {
    slug: 'it-and-ai',
    name: 'Information Technology & AI',
    iconKey: 'cpu',
    shortDesc: 'Software, data, and artificial intelligence. The infrastructure driving every other industry forward.',
    description:
      'The Information Technology sector covers industries that use computer systems to exchange information and manage, process, and protect data. Artificial Intelligence is the fastest-growing cluster, and is expected to drive innovation across nearly every other industry.',
    clusters: ['Information Technology and Artificial Intelligence'],
    outlook:
      'IT support, data analysis, cybersecurity, and AI operations roles are among the fastest-growing job categories tracked by the U.S. Bureau of Labor Statistics. Entry-level certifications like CompTIA A+, Google IT Support, and AWS Cloud Practitioner remain reliable on-ramps.',
    sampleRoles: [
      'IT Support Technician',
      'Help Desk Analyst',
      'Junior Software Developer',
      'Data Analyst',
      'Cybersecurity Analyst (Entry-Level)',
      'AI Operations Associate'
    ]
  },
  {
    slug: 'life-sciences-biotech',
    name: 'Life Sciences and Biotechnology',
    iconKey: 'microscope',
    shortDesc: 'Research, development, and production of biology- and medicine-based solutions.',
    description:
      'Life Sciences and Biotechnology includes the research, development, and production of scientific solutions focused on living things. The sector spans biology, medicine, and agriculture, with two target clusters: Biotechnology, Pharmaceutical and Medical Devices; and Agricultural Science and Technology.',
    clusters: ['Biotechnology, Pharmaceutical and Medical Devices', 'Agricultural Science and Technology'],
    outlook:
      'Pharmaceutical manufacturing, clinical research, and medical device assembly all continue to expand. The sector consistently posts above-average growth for technician-level roles that pair short-term training with on-the-job credentialing.',
    sampleRoles: [
      'Lab Technician',
      'Pharmacy Technician',
      'Medical Device Assembly Technician',
      'Clinical Research Coordinator',
      'Quality Control Microbiologist'
    ]
  },
  {
    slug: 'petroleum-and-chemicals',
    name: 'Petroleum Refining and Chemicals',
    iconKey: 'flame',
    shortDesc: 'Industrial chemicals, fuels, and plastics derived from crude oil refining.',
    description:
      'Petroleum Refining and Chemicals focuses on the conversion of crude oil into petroleum products, including chemicals, fuel, and plastics. Three clusters anchor the sector: Industrial Chemical Products, Petroleum Refining, and Plastics.',
    clusters: ['Industrial Chemical Products', 'Petroleum Refining', 'Plastics'],
    outlook:
      'Refining and chemical processing demand remains strong as global supply chains recover. Process operators, maintenance technicians, and pipefitters are in steady demand, often with paid training pathways through employers.',
    sampleRoles: [
      'Process Operator',
      'Refinery Maintenance Technician',
      'Pipefitter',
      'Chemical Plant Operator',
      'Plastics Extruder Operator'
    ]
  },
  {
    slug: 'professional-services',
    name: 'Professional Services and Corporate Operations',
    iconKey: 'briefcase',
    shortDesc: 'Business services, financial services, and corporate headquarters operations.',
    description:
      'Professional Services and Corporate Operations supports a wide variety of industries through information technology, business, and financial services. Two clusters anchor the sector: Business Services and Corporate Headquarters; and Financial Services.',
    clusters: ['Business Services and Corporate Headquarters', 'Financial Services'],
    outlook:
      'Administrative, customer service, and financial operations roles remain the backbone of corporate hiring. Entry-level positions provide stable on-ramps to long-term career growth in larger organizations.',
    sampleRoles: [
      'Administrative Assistant',
      'Accounts Payable Clerk',
      'Customer Service Representative',
      'HR Coordinator',
      'Bank Teller'
    ]
  },
  {
    slug: 'rare-earth-and-mining',
    name: 'Rare Earth Elements and Mineral Mining',
    iconKey: 'pickaxe',
    shortDesc: 'Extraction of metal and nonmetal elements that fuel infrastructure and high-tech industries.',
    description:
      'Rare Earth Elements and Mineral Mining focuses on the extraction of both metal and nonmetal elements, including metal ores, crushed stone, sand, and rare earth elements. Metal mining supports high-tech and defense industries; nonmetal mining supports construction and oil extraction.',
    clusters: ['Metal Mining', 'Nonmetal Mining'],
    outlook:
      'Domestic mineral and rare earth extraction is a national priority as the country reduces dependence on imported critical minerals. Equipment operators, samplers, and safety technicians are in growing demand.',
    sampleRoles: [
      'Mining Equipment Operator',
      'Geological Sampler',
      'Crushing and Grinding Machine Operator',
      'Mining Safety Technician',
      'Drilling Helper'
    ]
  },
  {
    slug: 'transportation-and-logistics',
    name: 'Transportation and Logistics',
    iconKey: 'truck',
    shortDesc: 'Movement of people and goods. Distribution, e-commerce, and aviation services.',
    description:
      'Transportation and Logistics covers the movement of people and goods via multimodal transportation, as well as the distribution of products through physical and electronic retailers. Two clusters anchor the sector: Distribution and E-Commerce; and Transportation and Aviation Services.',
    clusters: ['Distribution and E-Commerce', 'Transportation and Aviation Services'],
    outlook:
      'E-commerce growth continues to drive warehouse, distribution, and CDL hiring. Aviation maintenance and air traffic operations also report sustained demand, with employer-funded training programs common at the entry level.',
    sampleRoles: [
      'Warehouse Associate',
      'CDL Driver',
      'Logistics Coordinator',
      'Forklift Operator',
      'Aviation Maintenance Technician',
      'Air Traffic Controller (Entry)'
    ]
  }
];

export function getIndustryBySlug(slug: string): Industry | undefined {
  return industries.find((i) => i.slug === slug);
}
