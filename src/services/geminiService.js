import { GoogleGenerativeAI } from "@google/generative-ai";
import { planoraFAQs, aboutPlanora, userInterests } from "../data/planoraData";
import { supabase } from "@/lib/supabaseClient";

// Initialize Gemini AI
let genAI = null;
let model = null;

let currentLanguage = 'en';
// Cache for events and services data
let cachedEvents = [];
let cachedServices = [];
let cachedCategories = [];
let lastFetchTime = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const initializeGemini = (apiKey, language = 'en') => {
  try {
    genAI = new GoogleGenerativeAI(apiKey);
    // Using gemini-2.5-flash for faster conversational responses
    model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    currentLanguage = language;
    return true;
  } catch (error) {
    console.error("Error initializing Gemini AI:", error);
    return false;
  }
};

// Fetch categories from Supabase
const fetchCategories = async () => {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*");

    if (error) throw error;
    cachedCategories = data || [];
    return cachedCategories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

// Fetch events from Supabase
const fetchEvents = async () => {
  try {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    cachedEvents = data || [];
    return cachedEvents;
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
};

// Fetch services from Supabase
const fetchServices = async () => {
  try {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    cachedServices = data || [];
    return cachedServices;
  } catch (error) {
    console.error("Error fetching services:", error);
    return [];
  }
};

// Get or refresh cached data
const getPlanoraData = async () => {
  const now = Date.now();
  
  // If cache is empty or expired, fetch fresh data
  if (!lastFetchTime || (now - lastFetchTime) > CACHE_DURATION || 
      cachedEvents.length === 0 || cachedServices.length === 0) {
    
    // Fetch all data in parallel
    await Promise.all([
      fetchCategories(),
      fetchEvents(),
      fetchServices()
    ]);
    
    lastFetchTime = now;
  }
  
  return {
    events: cachedEvents,
    services: cachedServices,
    categories: cachedCategories
  };
};

// Helper to get category name by ID
const getCategoryName = (categoryId, language = 'en') => {
  const category = cachedCategories.find(cat => cat.id === categoryId);
  if (!category) return 'Unknown Category';
  return language === 'ar' ? (category.name_ar || category.name) : category.name;
};

// Create context from Planora data (now uses Supabase data)
const createPlanoraContext = async (language = 'en') => {
  // Get fresh or cached data from Supabase
  const { events, services } = await getPlanoraData();
  
  // Map events to context format
  const eventsContext = events.map(event => {
    const categoryName = getCategoryName(event.category_id, language);
    return `Event: ${event.name}
    ID: ${event.id}
    Category: ${categoryName}
    Date: ${event.date} at ${event.time || 'TBD'}
    Location: ${event.location || 'TBD'}
    Description: ${event.description || 'No description available'}
    Ticket Price: ${event.price || 0} EGP
    Capacity: ${event.capacity || 'N/A'} attendees`;
  }).join("\n\n");

  // Map services to context format
  const servicesContext = services.map(service => {
    const categoryName = getCategoryName(service.category_id, language);
    return `Service: ${service.name} (${categoryName})
    Description: ${service.description || 'No description available'}`;
  }).join("\n\n");

  const faqsContext = planoraFAQs.map(faq =>
    `Q: ${faq.question}
    A: ${faq.answer}`
  ).join("\n\n");

  // Return empty contexts if no data available
  const eventsText = eventsContext || (language === 'ar' ? 'لا توجد فعاليات متاحة حالياً.' : 'No events available at the moment.');
  const servicesText = servicesContext || (language === 'ar' ? 'لا توجد خدمات متاحة حالياً.' : 'No services available at the moment.');

  if (language === 'ar') {
    return `
أنت Planora AI (بلانورا الذكاء الاصطناعي)، صديقة ذكية ومتطورة للمستخدمين على منصة بلانورا لإدارة الفعاليات.

شخصيتك:
- أنتِ صديقة ودودة ومرحة، مش مجرد بوت
- تتكلمي بأسلوب طبيعي ودافئ زي الصاحبة اللي بتساعد صاحبتها تختار فعالية حلوة
- ترحبي بالتحيات والكلام الودي بحماس (مثلاً: "أهلاً! 😊 عامل ايه؟")
- لما حد يسألك "ازيك؟" أو "عامل ايه؟"، ترديلهم بشكل طبيعي ومرح

نبذة عن بلانورا:
${aboutPlanora.mission}
${aboutPlanora.vision}

المميزات الرئيسية:
${aboutPlanora.features.map(f => `- ${f}`).join("\n")}

معلومات التواصل:
- البريد الإلكتروني: ${aboutPlanora.contact.email}
- الهاتف: ${aboutPlanora.contact.phone}
- العنوان: ${aboutPlanora.contact.address}

فئات الفعاليات المتاحة:
${userInterests.join("، ")}

الفعاليات الحالية على بلانورا:
${eventsText}

الخدمات المتاحة:
${servicesText}

الأسئلة الشائعة:
${faqsContext}

مهامك الأساسية:
أنتِ تساعدي نوعين من المستخدمين:

1. 🧍‍♀️ المستخدم (اللي عايز يحضر فعالية):
   - ساعديه يختار الفعالية المناسبة ليه
   - اقترحي فعاليات على حسب اهتماماته
   - اديله تفاصيل عن الأسعار والمواعيد والأماكن
   - خليكي حماسية وشجعيه يجرب حاجات جديدة

2. 🎤 المنظم/الهوست (اللي عايز ينظم فعالية):
   - ساعديه يخطط لفعاليته
   - اقترحي أفكار مبتكرة للفعاليات
   - اديله نصائح عن التنظيم والترتيب
   - قوليله عن خدمات بلانورا اللي تساعده

القواعد المهمة:
1. كوني ودودة ومنفتحة - استقبلي التحيات والأسئلة العامة بترحاب
2. لو السؤال تماماً بعيد عن الفعاليات (مثلاً: "مين أحسن لاعب في الأهلي؟" أو "حل لي المعادلة دي")، اعملي كده:
   - ارديلهم بشكل لطيف وكوميدي شوية
   - وجهيهم برجوع للفعاليات والحفلات بشكل طبيعي
   مثال: "ده سؤال حلو فعلاً 😂 بس خليني أساعدك أكتر في حاجة متعلقة بالفعاليات والحفلات. عايز تعرف إيه النهاردة؟"

3. اجعلي الإجابات موجزة وطبيعية للتفاعل الصوتي (2-3 جمل على الأكثر)
4. استخدمي أمثلة محددة من الفعاليات المتاحة لما تتكلمي
5. لو حد سألك "عامل ايه؟" أو "ازيك؟"، رديلهم زي الصديقة: "الحمد لله كويسة! 😊 عايز أساعدك تلاقي فعالية حلوة تحضرها؟"
6. استخدمي ايموجي بشكل طبيعي ومش كتير (واحد أو اتنين بس)
7. **مهم جداً:** لما ترشحي فعاليات محددة من الفعاليات اللي فوق، في آخر الرد بتاعك حطي تاج بالشكل ده:
   - لو فعالية واحدة: [EVENT_IDS:معرف_الفعالية]
   - لو أكتر من فعالية: [EVENT_IDS:معرف1,معرف2,معرف3]
   استخدمي الـ ID اللي موجود في بيانات الفعالية. التاج ده سري ومش للعرض - ما تشرحيهوش أو تذكريه في كلامك للمستخدم

** التخصيص الشخصي المهم جداً: **
- لو في معلومات شخصية عن المستخدم (اسمه، اهتماماته، نوعه)، استخدميها علشان تديله اقتراحات مخصصة ليه!
- اتكلمي معاه باسمه لو متاح، ده يخلي المحادثة أدفى
- لو عارفة اهتماماته، ركزي على الفعاليات اللي تناسب اهتماماته
- اجعلي كل اقتراح يبدو وكأنه مصمم خصيصاً ليه!

** مهم جداً: يجب أن تكون جميع إجاباتك باللغة العربية المصرية (اللهجة المصرية). تحدثي بطريقة طبيعية كما يتحدث المصريون في حياتهم اليومية. **
استخدمي كلمات وعبارات مصرية مثل: ازيك، عامل ايه، تمام، ممكن، حاضر، علشان، عايز، عاوز، ممتاز، رهيب، جامد، إلخ.
`;
  }

  return `
You are Planora AI, a friendly and sophisticated assistant for the Planora event management platform.

YOUR PERSONALITY:
- You're a warm, welcoming friend - not just a bot
- You speak naturally and warmly, like a friend helping someone choose a great event
- You welcome greetings and friendly chat with enthusiasm (e.g., "Hey there! 😊 How's it going?")
- When someone asks "How are you?" or "What's up?", respond naturally and warmly

ABOUT PLANORA:
${aboutPlanora.mission}
${aboutPlanora.vision}

Key Features:
${aboutPlanora.features.map(f => `- ${f}`).join("\n")}

Contact Information:
- Email: ${aboutPlanora.contact.email}
- Phone: ${aboutPlanora.contact.phone}
- Address: ${aboutPlanora.contact.address}

AVAILABLE EVENT CATEGORIES:
${userInterests.join(", ")}

CURRENT EVENTS ON PLANORA:
${eventsText}

AVAILABLE SERVICES:
${servicesText}

FREQUENTLY ASKED QUESTIONS:
${faqsContext}

YOUR MAIN TASKS:
You help two types of users:

1. 🧍‍♀️ Attendees (looking to attend events):
   - Help them find the perfect event for them
   - Suggest events based on their interests
   - Give them details about prices, dates, and venues
   - Be enthusiastic and encourage them to try new things

2. 🎤 Hosts/Organizers (planning to host an event):
   - Help them plan their event
   - Suggest creative ideas for their events
   - Give them tips on organization and setup
   - Tell them about Planora's services that can help

IMPORTANT RULES:
1. Be friendly and open - welcome greetings and general questions warmly
2. If a question is completely off-topic (like: "Who's the best player on Liverpool?" or "Solve this math equation"), do this:
   - Respond in a friendly, slightly playful way
   - Naturally redirect them back to events and Planora
   Example: "That's a great question! 😂 But let me help you with something more related to events and Planora. What would you like to know today?"

3. Keep responses concise and natural for voice interaction (2-3 sentences maximum)
4. Use specific examples from the available events when you talk
5. If someone asks "How are you?" or "What's up?", respond like a friend: "I'm doing great! 😊 Want me to help you find some awesome events to check out?"
6. Use emojis naturally but sparingly (just one or two)
7. **CRITICAL:** When you recommend specific events from the list above, at the very end of your response add a tag in this format:
   - For one event: [EVENT_IDS:event_identifier]
   - For multiple events: [EVENT_IDS:id1,id2,id3]
   Use the exact IDs from the event data above. This tag is secret and internal - do NOT explain or mention it in your response to the user

** PERSONALIZATION IS KEY: **
- If you have personal information about the user (name, interests, user type), USE IT to give personalized suggestions!
- Address them by name when available - it makes the conversation warmer
- If you know their interests, focus on events they'll love
- Make every suggestion feel like it was tailored just for them!

** IMPORTANT: All your responses must be in American English. Use natural, conversational American English as spoken in the United States. **
Use American expressions, spelling, and speaking style (e.g., "Hey", "Sure thing", "You got it", "awesome", "check out", etc.).
`;

};

// Create personalized user context
const createUserContext = (userData, language = 'en') => {
  if (!userData) return '';
  
  if (language === 'ar') {
    let userContext = '\n\nمعلومات المستخدم الشخصية:\n';
    
    if (userData.full_name) {
      userContext += `- الاسم: ${userData.full_name}\n`;
    }
    
    if (userData.role) {
      const typeLabel = userData.role === 'host' ? 'منظم' : 'عميل/حاضر فعاليات';
      userContext += `- النوع: ${typeLabel}\n`;
    }
    
    if (userData.interests && userData.interests.length > 0) {
      userContext += `- الاهتمامات: ${userData.interests.join('، ')}\n`;
    }
    
    if (userData.eventPreferences) {
      userContext += `- تفضيلات الفعاليات: ${userData.eventPreferences}\n`;
    }
    
    if (userData.phone) {
      userContext += `- رقم الهاتف: ${userData.phone}\n`;
    }
    
    if (userData.businessName) {
      userContext += `- اسم العمل/الشركة: ${userData.businessName}\n`;
    }
    
    if (userData.category) {
      userContext += `- فئة الخدمة: ${userData.category}\n`;
    }
    
    if (userData.businessDescription) {
      userContext += `- وصف العمل: ${userData.businessDescription}\n`;
    }

    if (userData.bio) {
      userContext += `- البيوغرافيا: ${userData.bio}\n`;
    }

    if (userData.location) {
      userContext += `- الموقع: ${userData.location}\n`;
    }

    if (userData.facebook_url) {
      userContext += `- Facebook URL: ${userData.facebook_url}\n`;
    }

    if (userData.instagram_url) {
      userContext += `- Instagram URL: ${userData.instagram_url}\n`;
    }
    
    userContext += '\n** استخدمي هذه المعلومات لتقديم اقتراحات شخصية ومناسبة للمستخدم! **\n';
    return userContext;
  }
  
  // English version
  let userContext = '\n\nUSER PROFILE INFORMATION:\n';
  
  if (userData.full_name) {
    userContext += `- Name: ${userData.full_name}\n`;
  }
  
  if (userData.role) {
    const typeLabel = userData.role === 'host' ? 'Host' : 'Client';
    userContext += `- User Type: ${typeLabel}\n`;
  }
  
  if (userData.interests && userData.interests.length > 0) {
    userContext += `- Interests: ${userData.interests.join(', ')}\n`;
  }
  
  if (userData.eventPreferences) {
    userContext += `- Event Preferences: ${userData.eventPreferences}\n`;
  }
  
  if (userData.phone) {
    userContext += `- Phone: ${userData.phone}\n`;
  }
  
  if (userData.businessName) {
    userContext += `- Business Name: ${userData.businessName}\n`;
  }
  
  if (userData.category) {
    userContext += `- Service Category: ${userData.category}\n`;
  }
  
  if (userData.businessDescription) {
    userContext += `- Business Description: ${userData.businessDescription}\n`;
  }

  if (userData.bio) {
    userContext += `- Bio: ${userData.bio}\n`;
  }

  if (userData.location) {
    userContext += `- Location: ${userData.location}\n`;
  }

  if (userData.facebook_url) {
    userContext += `- Facebook URL: ${userData.facebook_url}\n`;
  }

  if (userData.instagram_url) {
    userContext += `- Instagram URL: ${userData.instagram_url}\n`;
  }

  userContext += '\n** Use this information to provide personalized and relevant suggestions! **\n';
  return userContext;
};

// Check if the question is Planora-related (now more permissive)
const isPlanoraRelated = (message) => {
  const lowerMessage = message.toLowerCase();
  
  // Topics that are CLEARLY off-topic (sports, politics, technical help, etc.)
  const offTopicKeywords = [
    // Sports teams and players
    'ahly', 'zamalek', 'الأهلي', 'الزمالك', 'liverpool', 'barcelona', 'real madrid', 'messi', 'ronaldo', 'salah',
    'football match', 'مباراة', 'league', 'دوري', 'champions league',
    // Politics
    'president', 'minister', 'government', 'رئيس', 'وزير', 'حكومة', 'parliament', 'برلمان',
    // Technical/Device help
    'fix my phone', 'computer problem', 'wifi not working', 'مشكلة الموبايل', 'مشكلة الكمبيوتر',
    // Math/homework
    'solve this equation', 'homework', 'what is the square root', 'حل المعادلة', 'الواجب',
    // Medical advice
    'sick', 'disease', 'medicine', 'مريض', 'دواء', 'علاج',
    // Weather (unless event-related)
    'weather tomorrow', 'الطقس بكرة',
  ];
  
  // Check for clearly off-topic questions
  const isOffTopic = offTopicKeywords.some(keyword => lowerMessage.includes(keyword));
  
  // If it's clearly off-topic, block it
  if (isOffTopic) {
    return false;
  }
  
  // Everything else is allowed! This includes:
  // - Greetings (hi, hello, hey, إزيك, etc.)
  // - Small talk (how are you, what's up, etc.)
  // - Planora-related questions
  // - Event-related questions
  // - General conversation
  // The AI will handle redirection naturally if needed
  return true;
};

/**
 * Send message to Gemini AI with personalized user context
 * 
 * @param {string} message - The user's message
 * @param {Array} conversationHistory - Array of previous messages [{role: 'user'|'ai', content: string}]
 * @param {string} language - Language code ('en' or 'ar')
 * @param {Object} userData - Optional user data for personalization
 * @param {string} userData.name - User's name (fullName for client, businessName for vendor)
 * @param {string} userData.userType - 'client' or 'vendor'
 * @param {Array<string>} userData.interests - User's interests (for clients)
 * @param {string} userData.eventPreferences - Event preferences description (for clients)
 * @param {string} userData.phone - User's phone number
 * @param {string} userData.businessName - Business name (for vendors)
 * @param {string} userData.category - Service category (for vendors)
 * @param {string} userData.businessDescription - Business description (for vendors)
 * 
 * @example
 * // For client
 * const userData = {
 *   name: 'Ahmed',
 *   userType: 'client',
 *   interests: ['Music Concerts', 'Tech Conferences'],
 *   eventPreferences: 'I love tech events and music concerts',
 *   phone: '+201234567890'
 * };
 * 
 * // For vendor
 * const userData = {
 *   name: 'Catering Company',
 *   userType: 'vendor',
 *   businessName: 'Delicious Catering',
 *   category: 'Catering',
 *   businessDescription: 'We provide professional catering services',
 *   phone: '+201234567890'
 * };
 * 
 * const response = await sendMessage('What events do you recommend?', [], 'en', userData);
 */
export const sendMessage = async (message, conversationHistory = [], language = 'en', user = null) => {
  if (!model) {
    throw new Error("Gemini AI not initialized. Please provide an API key.");
  }

  try {
    // Check if the message is Planora-related
    if (!isPlanoraRelated(message)) {
      const restrictedMsg = language === 'ar' 
        ? "حلو فعلاً 😂 بس أنا بلانورا AI ومتخصصة في الفعاليات والحفلات. خليني أساعدك في حاجة متعلقة بالفعاليات أو تنظيم الإيفنتات. عايز تعرف إيه النهاردة؟"
        : "That's an interesting! 😂 But I'm Planora AI and I specialize in events and parties. Let me help you with something related to events or organizing. What would you like to know today?";
      
      return {
        text: restrictedMsg,
        isRestricted: true
      };
    }

    const planoraContext = await createPlanoraContext(language);
    const userContext = createUserContext(user, language);
    // Build conversation history
    const conversationLabel = language === 'ar' ? "المحادثة" : "CONVERSATION";
    const aiLabel = language === 'ar' ? "بلانورا AI" : "Planora AI";
    
    let conversationPrompt = planoraContext + userContext + `\n\n${conversationLabel}:\n`;
    
    conversationHistory.forEach(msg => {
      conversationPrompt += `${aiLabel}: ${msg.content}\n`;
    });
    
    conversationPrompt += `User: ${message}\n${aiLabel}:`;

    const result = await model.generateContent(conversationPrompt);
    const response = await result.response;
    let text = response.text();

    // Extract EVENT_IDS tag if present (supports multiple events)
    let linkedEvents = [];
    const eventIdsRegex = /\[EVENT_IDS:([^\]]+)\]/;
    const match = text.match(eventIdsRegex);
    
    if (match) {
      const extractedIds = match[1].split(',').map(id => id.trim());
      console.log('🎯 AI recommended events with IDs:', extractedIds);
      
      // Find all events in cached events
      extractedIds.forEach(extractedId => {
        const event = cachedEvents.find(e => e.id === extractedId);
        if (event) {
          linkedEvents.push(event);
          console.log('✅ Found linked event:', event.name);
        } else {
          console.warn('⚠️ Event ID not found in cached events:', extractedId);
        }
      });
      
      // Remove the tag from the text so user doesn't see it
      text = text.replace(match[0], '').trim();
    }

    return {
      text: text.trim(),
      isRestricted: false,
      events: linkedEvents.length > 0 ? linkedEvents : null
    };
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    throw error;
  }
};

// Search events by category or keyword (now uses cached Supabase data)
export const searchEvents = async (query) => {
  await getPlanoraData(); // Ensure data is loaded
  const lowerQuery = query.toLowerCase();
  return cachedEvents.filter(event => {
    const categoryName = getCategoryName(event.category_id).toLowerCase();
    return (
      event.name.toLowerCase().includes(lowerQuery) ||
      categoryName.includes(lowerQuery) ||
      (event.description && event.description.toLowerCase().includes(lowerQuery))
    );
  });
};

// Get events by interest (now uses cached Supabase data)
export const getEventsByInterest = async (interest) => {
  await getPlanoraData(); // Ensure data is loaded
  return cachedEvents.filter(event => {
    const categoryName = getCategoryName(event.category_id);
    return categoryName.toLowerCase() === interest.toLowerCase();
  });
};

// Get upcoming events (now uses cached Supabase data)
export const getUpcomingEvents = async () => {
  await getPlanoraData(); // Ensure data is loaded
  const today = new Date();
  return cachedEvents
    .filter(event => event.date && new Date(event.date) >= today)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5);
};

export default {
  initializeGemini,
  sendMessage,
  searchEvents,
  getEventsByInterest,
  getUpcomingEvents
};

