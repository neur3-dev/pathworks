export interface Industry {
  slug: string;
  name: string;
  iconKey: string;
  shortDesc: string;
  description: string;
  clusters: string[];
  whyTexas: string;
  sampleRoles: string[];
  metros: string[];
}

export const industries: Industry[] = [
  {
    slug: 'advanced-manufacturing',
    name: 'Advanced Manufacturing',
    iconKey: 'factory',
    shortDesc:
      'Automation, sensing, and cutting-edge production technology across aerospace, automotive, semiconductors, and heavy machinery.',
    description:
      'The Advanced Manufacturing sector includes businesses and industries that use innovative technologies and processes to create products of all kinds. The sector encompasses a broad range of manufacturing activities and outputs and is unified by the incorporation of automation, sensing, and other cutting-edge technologies in production.',
    clusters: [
      'Aerospace Vehicles, Aircraft and Defense',
      'Automotive',
      'Computers, Electronics and Semiconductors',
      'Production Technology and Heavy Machinery'
    ],
    whyTexas:
      'Texas is a state of doers and makers. Access to domestic and global markets, a business-friendly climate, and world-class education programs position Texas to design and build the products of the future.',
    sampleRoles: [
      'CNC Operator',
      'Quality Control Inspector',
      'Industrial Maintenance Technician',
      'Production Supervisor',
      'Robotics Technician'
    ],
    metros: ['Dallas-Fort Worth', 'Houston', 'Austin', 'San Antonio']
  },
  {
    slug: 'energy-evolution',
    name: 'Energy Evolution',
    iconKey: 'zap',
    shortDesc: 'Oil, gas, and renewables. Texas powers the state, the country, and the world.',
    description:
      'The Energy Evolution sector is centered on the production and transmission of energy of all kinds, including oil, gas and renewables. The sector composition reflects Texas’ all-of-the-above energy strategy and positions the state to maintain its role as a global energy leader for generations to come.',
    clusters: [
      'Electric Power Generation and Transmission',
      'Oil and Gas Extraction, Production and Transportation',
      'Renewables'
    ],
    whyTexas:
      'Texas is the leading producer of oil, gas, wind, and utility-scale solar energy in the U.S. and home to large energy companies and innovative startups alike.',
    sampleRoles: [
      'Wind Turbine Technician',
      'Solar Installer',
      'Electrical Lineworker',
      'Oil and Gas Field Technician',
      'Energy Plant Operator'
    ],
    metros: ['Houston', 'Midland-Odessa', 'Corpus Christi', 'Dallas-Fort Worth']
  },
  {
    slug: 'food-and-livestock',
    name: 'Food and Livestock Products',
    iconKey: 'wheat',
    shortDesc: 'High-quality food products from beef and poultry to tortillas and snack foods.',
    description:
      'The Food and Livestock Products sector is focused on creating a wide variety of high-quality food products ranging from beef and poultry to tortillas and snack foods. The sector is critical to the food supply in Texas and beyond and is linked to a number of other target sectors.',
    clusters: ['Food Processing', 'Livestock Processing'],
    whyTexas:
      'Large tracts of affordable land well-suited to food manufacturing and livestock processing make Texas a promising destination for food companies looking to grow and expand.',
    sampleRoles: [
      'Food Production Worker',
      'Meat Processor',
      'Quality Assurance Technician',
      'Packaging Line Operator',
      'Cold Storage Forklift Operator'
    ],
    metros: ['Amarillo', 'Lubbock', 'San Antonio', 'Houston']
  },
  {
    slug: 'hospitality-tourism-culture',
    name: 'Hospitality, Tourism and Culture',
    iconKey: 'camera',
    shortDesc: 'Film, music, hospitality, and tourism — the experiences that promote the Texas brand.',
    description:
      'The Hospitality, Tourism and Culture sector is focused on the provision of services and experiences to entertain and accommodate Texans and visitors alike. This sector is built upon Texas’ rich diversity of experiences, events and geographies.',
    clusters: ['Film, Music and Culture', 'Hospitality and Tourism'],
    whyTexas:
      'Texas’ iconic locations, skilled workforce, competitive incentive programs, and unique cultural attractions make our state a top destination for Hospitality, Tourism and Culture businesses.',
    sampleRoles: [
      'Hotel Front Desk Associate',
      'Event Coordinator',
      'Restaurant Manager',
      'Film Production Assistant',
      'Tour Guide'
    ],
    metros: ['Austin', 'San Antonio', 'Houston', 'Dallas-Fort Worth']
  },
  {
    slug: 'it-and-ai',
    name: 'Information Technology & AI',
    iconKey: 'cpu',
    shortDesc: 'Software, data, and artificial intelligence — driving every other industry forward.',
    description:
      'The Information Technology sector includes a variety of industries that use computer systems to exchange information and manage, process, and protect data. Texas has identified Information Technology and Artificial Intelligence as a target cluster expected to drive innovation across other industries.',
    clusters: ['Information Technology and Artificial Intelligence'],
    whyTexas:
      'Texas’ robust university system, skilled workforce, and growing tech hubs have propelled the state to the forefront of the IT sector and position it to create and deploy pioneering products and services for years to come.',
    sampleRoles: [
      'IT Support Technician',
      'Help Desk Analyst',
      'Junior Software Developer',
      'Data Analyst',
      'Cybersecurity Analyst (Entry-Level)',
      'AI Operations Associate'
    ],
    metros: ['Austin', 'Dallas-Fort Worth', 'Houston', 'San Antonio']
  },
  {
    slug: 'life-sciences-biotech',
    name: 'Life Sciences and Biotechnology',
    iconKey: 'microscope',
    shortDesc: 'Research, development, and production of biology- and medicine-based solutions.',
    description:
      'The Life Sciences and Biotechnology sector includes the research, development, and production of scientific solutions focused on living things. The sector spans a variety of industries related to biology, medicine, and agriculture.',
    clusters: ['Biotechnology, Pharmaceutical and Medical Devices', 'Agricultural Science and Technology'],
    whyTexas:
      'World-renowned research and medical institutions and a robust sector supply chain give Texas a competitive advantage in life sciences and biotechnology. Entrepreneurs and businesses can take new products and technologies through the full product lifecycle — including research, testing, trials, and commercialization — all without leaving the state.',
    sampleRoles: [
      'Lab Technician',
      'Pharmacy Technician',
      'Medical Device Assembly Technician',
      'Clinical Research Coordinator',
      'Quality Control Microbiologist'
    ],
    metros: ['Houston (Texas Medical Center)', 'Dallas-Fort Worth', 'Austin', 'San Antonio']
  },
  {
    slug: 'petroleum-and-chemicals',
    name: 'Petroleum Refining and Chemicals',
    iconKey: 'flame',
    shortDesc: 'Industrial chemicals, fuels, and plastics derived from crude oil refining.',
    description:
      'The Petroleum Refining and Chemicals sector is focused on the conversion of crude oil into petroleum products, including chemicals, fuel, and plastics.',
    clusters: ['Industrial Chemical Products', 'Petroleum Refining', 'Plastics'],
    whyTexas:
      'Texas’ abundance of natural resources and raw materials, along with a supportive regulatory environment, gives the state a strong competitive advantage in industrial chemicals, petroleum refining, and plastics.',
    sampleRoles: [
      'Process Operator',
      'Refinery Maintenance Technician',
      'Pipefitter',
      'Chemical Plant Operator',
      'Plastics Extruder Operator'
    ],
    metros: ['Houston', 'Beaumont-Port Arthur', 'Corpus Christi']
  },
  {
    slug: 'professional-services',
    name: 'Professional Services and Corporate Operations',
    iconKey: 'briefcase',
    shortDesc: 'Business services, financial services, and corporate headquarters.',
    description:
      'The Professional Services and Corporate Operations sector is focused on providing support for a variety of industries through information technology, business, and financial services. Two clusters are positioned to excel in Texas: Business Services and Corporate Headquarters; and Financial Services.',
    clusters: ['Business Services and Corporate Headquarters', 'Financial Services'],
    whyTexas:
      'Texas’ low tax burden, network of leading businesses, and top-tier talent have both cultivated the development of homegrown businesses and attracted companies from across the nation.',
    sampleRoles: [
      'Administrative Assistant',
      'Accounts Payable Clerk',
      'Customer Service Representative',
      'HR Coordinator',
      'Bank Teller'
    ],
    metros: ['Dallas-Fort Worth', 'Houston', 'Austin', 'San Antonio']
  },
  {
    slug: 'rare-earth-and-mining',
    name: 'Rare Earth Elements and Mineral Mining',
    iconKey: 'pickaxe',
    shortDesc: 'Extraction of metal and nonmetal elements that fuel infrastructure and high-tech industries.',
    description:
      'The Rare Earth Elements and Mineral Mining sector is focused on the extraction of both metal and nonmetal elements, including a variety of metal ores, crushed stone, sand, and rare earth elements. Metal mining supports high-tech and defense industries; nonmetal mining products are essential to construction and oil extraction.',
    clusters: ['Metal Mining', 'Nonmetal Mining'],
    whyTexas:
      'Texas’ deposit of natural resources combined with its mining expertise have positioned it as a leader within Rare Earth Elements and Mineral Mining.',
    sampleRoles: [
      'Mining Equipment Operator',
      'Geological Sampler',
      'Crushing and Grinding Machine Operator',
      'Mining Safety Technician',
      'Drilling Helper'
    ],
    metros: ['El Paso', 'West Texas', 'San Antonio']
  },
  {
    slug: 'transportation-and-logistics',
    name: 'Transportation and Logistics',
    iconKey: 'truck',
    shortDesc: 'Movement of people and goods — distribution, e-commerce, and aviation.',
    description:
      'The Transportation and Logistics sector is focused on the movement of people and goods via multimodal transportation as well as the distribution of products through physical and electronic retailers.',
    clusters: ['Distribution and E-Commerce', 'Transportation and Aviation Services'],
    whyTexas:
      'Texas’ central location within the United States, robust transportation system, and efficient logistics infrastructure make the state one of the most globally connected locations in the world.',
    sampleRoles: [
      'Warehouse Associate',
      'CDL Driver',
      'Logistics Coordinator',
      'Forklift Operator',
      'Aviation Maintenance Technician',
      'Air Traffic Controller (Entry)'
    ],
    metros: ['Dallas-Fort Worth', 'Houston', 'Laredo', 'El Paso', 'San Antonio']
  }
];

export function getIndustryBySlug(slug: string): Industry | undefined {
  return industries.find((i) => i.slug === slug);
}
