// Static data for Planora AI - Events and User Interests
// This data will be used until Supabase integration is complete

export const userInterests = [
  "Music Concerts",
  "Art Exhibitions",
  "Sports Events",
  "Tech Conferences",
  "Food Festivals",
  "Theater & Drama",
  "Workshops",
  "Networking Events",
  "Cultural Events",
  "Comedy Shows"
];

export const planoraEvents = [
  {
    id: "evt001",
    title: "Summer Music Festival 2025",
    category: "Music Concerts",
    date: "2025-12-15",
    time: "18:00",
    location: "Cairo Festival City Arena",
    city: "Cairo",
    country: "Egypt",
    description: "The biggest music festival of the year featuring international and local artists. Experience an unforgettable night of music, lights, and entertainment.",
    capacity: 5000,
    ticketPrice: 500,
    organizer: "Planora Events",
    tags: ["music", "festival", "outdoor", "family-friendly"],
    status: "upcoming"
  },
  {
    id: "evt002",
    title: "Digital Innovation Summit",
    category: "Tech Conferences",
    date: "2025-11-20",
    time: "09:00",
    location: "Nile Ritz-Carlton",
    city: "Cairo",
    country: "Egypt",
    description: "Join industry leaders and tech innovators for a day of inspiring talks about AI, blockchain, and digital transformation in the Middle East.",
    capacity: 300,
    ticketPrice: 1500,
    organizer: "Tech Leaders Egypt",
    tags: ["technology", "networking", "business", "innovation"],
    status: "upcoming"
  },
  {
    id: "evt003",
    title: "Contemporary Art Exhibition",
    category: "Art Exhibitions",
    date: "2025-11-25",
    time: "10:00",
    location: "Cairo Opera House",
    city: "Cairo",
    country: "Egypt",
    description: "Explore the finest contemporary art from Egyptian and Arab artists. A month-long exhibition showcasing paintings, sculptures, and digital art.",
    capacity: 200,
    ticketPrice: 100,
    organizer: "Art Cairo Gallery",
    tags: ["art", "culture", "exhibition", "indoor"],
    status: "upcoming"
  },
  {
    id: "evt004",
    title: "Mediterranean Food Festival",
    category: "Food Festivals",
    date: "2025-12-01",
    time: "16:00",
    location: "Gouna Marina",
    city: "El Gouna",
    country: "Egypt",
    description: "Taste authentic Mediterranean cuisine from top chefs. Wine tasting, cooking demonstrations, and live music included.",
    capacity: 800,
    ticketPrice: 300,
    organizer: "Culinary Events Egypt",
    tags: ["food", "culture", "tasting", "outdoor"],
    status: "upcoming"
  },
  {
    id: "evt005",
    title: "Marathon for Hope",
    category: "Sports Events",
    date: "2025-11-18",
    time: "06:00",
    location: "Corniche Road",
    city: "Alexandria",
    country: "Egypt",
    description: "Annual charity marathon supporting children's hospitals. 5K, 10K, and full marathon options available.",
    capacity: 2000,
    ticketPrice: 150,
    organizer: "Alexandria Sports Club",
    tags: ["sports", "charity", "outdoor", "health"],
    status: "upcoming"
  },
  {
    id: "evt006",
    title: "Stand-Up Comedy Night",
    category: "Comedy Shows",
    date: "2025-11-22",
    time: "20:00",
    location: "The Greek Campus",
    city: "Cairo",
    country: "Egypt",
    description: "An evening of laughter with Egypt's top comedians. Special guest appearances and interactive segments.",
    capacity: 400,
    ticketPrice: 250,
    organizer: "Comedy Factory Egypt",
    tags: ["comedy", "entertainment", "indoor", "adults"],
    status: "upcoming"
  },
  {
    id: "evt007",
    title: "Entrepreneurship Workshop Series",
    category: "Workshops",
    date: "2025-11-28",
    time: "14:00",
    location: "AUC Tahrir Campus",
    city: "Cairo",
    country: "Egypt",
    description: "3-day intensive workshop on starting and scaling your business. Expert mentors, networking, and pitch sessions.",
    capacity: 100,
    ticketPrice: 800,
    organizer: "Startup Hub Egypt",
    tags: ["business", "workshop", "education", "networking"],
    status: "upcoming"
  },
  {
    id: "evt008",
    title: "Shakespeare Under the Stars",
    category: "Theater & Drama",
    date: "2025-12-05",
    time: "19:00",
    location: "Cairo Opera House Open Air Theatre",
    city: "Cairo",
    country: "Egypt",
    description: "Classic Shakespeare performance of 'A Midsummer Night's Dream' in an enchanting outdoor setting.",
    capacity: 500,
    ticketPrice: 200,
    organizer: "Cairo Theatre Company",
    tags: ["theater", "culture", "outdoor", "classic"],
    status: "upcoming"
  },
  {
    id: "evt009",
    title: "Business Networking Gala",
    category: "Networking Events",
    date: "2025-11-30",
    time: "18:30",
    location: "Four Seasons Cairo",
    city: "Cairo",
    country: "Egypt",
    description: "Connect with industry leaders, investors, and entrepreneurs. Formal networking dinner with keynote speakers.",
    capacity: 250,
    ticketPrice: 1200,
    organizer: "Business Leaders Forum",
    tags: ["networking", "business", "formal", "indoor"],
    status: "upcoming"
  },
  {
    id: "evt010",
    title: "Heritage & Culture Festival",
    category: "Cultural Events",
    date: "2025-12-10",
    time: "11:00",
    location: "Citadel of Saladin",
    city: "Cairo",
    country: "Egypt",
    description: "Celebrate Egyptian heritage with traditional music, dance, crafts, and cuisine. Family-friendly cultural experience.",
    capacity: 1000,
    ticketPrice: 80,
    organizer: "Egyptian Heritage Society",
    tags: ["culture", "heritage", "family", "outdoor"],
    status: "upcoming"
  }
];

export const planoraServices = [
  {
    id: "srv001",
    name: "Event Planning",
    category: "Planning",
    description: "Professional event planning services for corporate and private events"
  },
  {
    id: "srv002",
    name: "Catering Services",
    category: "Food & Beverage",
    description: "Premium catering with diverse menu options"
  },
  {
    id: "srv003",
    name: "DJ Services",
    category: "Entertainment",
    description: "Professional DJs for all types of events"
  },
  {
    id: "srv004",
    name: "Photography",
    category: "Media",
    description: "Professional event photography and videography"
  }
];

export const planoraFAQs = [
  {
    question: "What is Planora?",
    answer: "Planora is a comprehensive event management and discovery platform that connects event organizers, attendees, and service providers. We help you discover amazing events, book tickets, and manage your event experience all in one place."
  },
  {
    question: "How do I book tickets?",
    answer: "You can browse events on Planora, select the event you're interested in, choose your ticket type, and complete the booking through our secure payment system. You'll receive a confirmation email with your e-ticket."
  },
  {
    question: "Can I get a refund?",
    answer: "Refund policies vary by event. Generally, tickets are refundable up to 48 hours before the event. Please check the specific event's refund policy on the event details page."
  },
  {
    question: "How do I become an event organizer on Planora?",
    answer: "To become an event organizer, register for a host account on Planora. Once verified, you can create and manage events, sell tickets, and access our event management tools."
  },
  {
    question: "What types of events are on Planora?",
    answer: "Planora features a wide variety of events including music concerts, tech conferences, art exhibitions, food festivals, sports events, theater performances, workshops, networking events, comedy shows, and cultural celebrations."
  },
  {
    question: "Is Planora available in my city?",
    answer: "Planora is currently focused on major cities in Egypt including Cairo, Alexandria, and El Gouna. We're continuously expanding to new locations."
  },
  {
    question: "How do I contact event organizers?",
    answer: "You can contact event organizers through the messaging system on their event page or through the contact information provided in the event details."
  },
  {
    question: "What payment methods does Planora accept?",
    answer: "Planora accepts various payment methods including credit/debit cards, digital wallets, and bank transfers for a seamless booking experience."
  }
];

export const aboutPlanora = {
  mission: "To revolutionize event discovery and management in the Middle East by connecting people with experiences that matter to them.",
  vision: "To become the leading event platform in the region, making every event accessible and every experience memorable.",
  features: [
    "Discover events based on your interests",
    "Secure online ticket booking",
    "Event management tools for organizers",
    "Connect with service providers",
    "AI-powered event recommendations",
    "Real-time event updates",
    "Community reviews and ratings",
    "Multi-language support (Arabic & English)"
  ],
  contact: {
    email: "info@planora.com",
    phone: "+20 123 456 7890",
    address: "Cairo, Egypt"
  }
};

