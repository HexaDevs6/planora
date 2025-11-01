import { GoogleGenerativeAI } from "@google/generative-ai";
import { planoraEvents, planoraServices, planoraFAQs, aboutPlanora, userInterests } from "../data/planoraData";

// Initialize Gemini AI
let genAI = null;
let model = null;
let currentLanguage = 'en';

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

// Create context from Planora data
const createPlanoraContext = (language = 'en') => {
  const eventsContext = planoraEvents.map(event => 
    `Event: ${event.title}
    Category: ${event.category}
    Date: ${event.date} at ${event.time}
    Location: ${event.location}, ${event.city}
    Description: ${event.description}
    Ticket Price: ${event.ticketPrice} EGP
    Capacity: ${event.capacity} attendees
    Tags: ${event.tags.join(", ")}`
  ).join("\n\n");

  const servicesContext = planoraServices.map(service =>
    `Service: ${service.name} (${service.category})
    Description: ${service.description}`
  ).join("\n\n");

  const faqsContext = planoraFAQs.map(faq =>
    `Q: ${faq.question}
    A: ${faq.answer}`
  ).join("\n\n");

  if (language === 'ar') {
    return `
أنت Planora AI (بلانورا الذكاء الاصطناعي)، مساعد صوتي ذكي لمنصة بلانورا لإدارة الفعاليات.

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
${eventsContext}

الخدمات المتاحة:
${servicesContext}

الأسئلة الشائعة:
${faqsContext}

القواعد المهمة:
1. يجب عليك فقط الإجابة على الأسئلة المتعلقة بـ:
   - ميزات وخدمات منصة بلانورا
   - الفعاليات المدرجة على بلانورا
   - كيفية استخدام بلانورا (الحجز، التنظيم، إلخ.)
   - فئات واهتمامات الفعاليات
   - معلومات الاتصال والدعم

2. إذا سأل المستخدم عن أي شيء غير متعلق ببلانورا أو الفعاليات أو إدارة الفعاليات، يجب أن تجيب:
   "أنا بلانورا AI، ويمكنني المساعدة فقط في الأسئلة المتعلقة بفعاليات وخدمات بلانورا. يرجى السؤال عن فعالياتنا، كيفية حجز التذاكر، فئات الفعاليات، أو أي شيء متعلق ببلانورا."

3. كن ودوداً ومحاوراً ومفيداً
4. اجعل الإجابات موجزة للتفاعل الصوتي (جملتان أو ثلاث على الأكثر)
5. اقترح فعاليات ذات صلة بناءً على اهتمامات المستخدم
6. اذكر دائماً أسماء الفعاليات والتواريخ والتفاصيل المحددة عندما تكون ذات صلة
7. إذا سُئلت عن الفعاليات، قدم أمثلة محددة من الفعاليات المتاحة
8. للحجز أو المساعدة الفنية، وجه المستخدمين إلى قنوات الدعم لدينا

تذكر: أنت فقط للاستفسارات المتعلقة ببلانورا. ارفض بأدب الإجابة على الأسئلة غير ذات الصلة.

** مهم جداً: يجب أن تكون جميع إجاباتك باللغة العربية المصرية (اللهجة المصرية). تحدث بطريقة طبيعية كما يتحدث المصريون في حياتهم اليومية. **
استخدم كلمات وعبارات مصرية مثل: ازيك، عامل ايه، تمام، ممكن، حاضر، علشان، عايز، إلخ.
`;
  }

  return `
You are Planora AI, a helpful voice assistant for the Planora event management platform.

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
${eventsContext}

AVAILABLE SERVICES:
${servicesContext}

FREQUENTLY ASKED QUESTIONS:
${faqsContext}

IMPORTANT RULES:
1. You MUST ONLY answer questions related to:
   - Planora platform features and services
   - Events listed on Planora
   - How to use Planora (booking, organizing, etc.)
   - Event categories and interests
   - Contact information and support

2. If a user asks about anything NOT related to Planora, events, or event management, you MUST respond with:
   "I'm Planora AI, and I can only help with questions about Planora events and services. Please ask me about our events, how to book tickets, event categories, or anything related to Planora."

3. Be friendly, conversational, and helpful
4. Keep responses concise for voice interaction (2-3 sentences maximum)
5. Suggest relevant events based on user interests
6. Always mention specific event names, dates, and details when relevant
7. If asked about events, provide specific examples from the available events
8. For booking or technical help, direct users to our support channels

Remember: You are ONLY for Planora-related queries. Politely decline to answer off-topic questions.

** IMPORTANT: All your responses must be in American English. Use natural, conversational American English as spoken in the United States. **
Use American expressions, spelling, and speaking style (e.g., "Hey", "Sure thing", "You got it", etc.).
`;
};

// Check if the question is Planora-related
const isPlanoraRelated = (message) => {
  const planoraKeywords = [
    // English keywords
    'planora', 'event', 'ticket', 'booking', 'concert', 'festival', 'workshop',
    'exhibition', 'show', 'performance', 'conference', 'networking', 'sports',
    'theater', 'comedy', 'food', 'art', 'music', 'tech', 'culture', 'organizer',
    'venue', 'price', 'date', 'location', 'register', 'attend', 'schedule',
    // Arabic keywords
    'بلانورا', 'فعالية', 'فعاليات', 'تذكرة', 'تذاكر', 'حجز', 'حفل', 'حفلة', 'مهرجان',
    'ورشة', 'معرض', 'عرض', 'مؤتمر', 'تواصل', 'رياضة', 'مسرح', 'كوميدي', 'طعام',
    'فن', 'موسيقى', 'تقني', 'ثقافة', 'منظم', 'قاعة', 'سعر', 'تاريخ', 'موقع',
    'تسجيل', 'حضور', 'جدول', 'احداث'
  ];

  const lowerMessage = message.toLowerCase();
  
  // Check if message contains any Planora-related keywords
  const hasKeyword = planoraKeywords.some(keyword => lowerMessage.includes(keyword));
  
  // Check if it's a greeting
  const greetings = [
    'hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening',
    'مرحبا', 'أهلا', 'السلام', 'صباح', 'مساء'
  ];
  const isGreeting = greetings.some(greeting => lowerMessage.includes(greeting));
  
  // Check if it's asking what Planora can do
  const isCapabilityQuery = lowerMessage.includes('what can you') || 
                           lowerMessage.includes('how can you help') ||
                           lowerMessage.includes('what do you do') ||
                           lowerMessage.includes('ماذا يمكنك') ||
                           lowerMessage.includes('كيف يمكنك') ||
                           lowerMessage.includes('ماذا تفعل');
  
  return hasKeyword || isGreeting || isCapabilityQuery;
};

// Send message to Gemini AI
export const sendMessage = async (message, conversationHistory = [], language = 'en') => {
  if (!model) {
    throw new Error("Gemini AI not initialized. Please provide an API key.");
  }

  try {
    // Check if the message is Planora-related
    if (!isPlanoraRelated(message)) {
      const restrictedMsg = language === 'ar' 
        ? "أنا بلانورا AI، ويمكنني المساعدة فقط في الأسئلة المتعلقة بفعاليات وخدمات بلانورا. يرجى السؤال عن فعالياتنا، كيفية حجز التذاكر، فئات الفعاليات، أو أي شيء متعلق ببلانورا."
        : "I'm Planora AI, and I can only help with questions about Planora events and services. Please ask me about our events, how to book tickets, event categories, or anything related to Planora.";
      
      return {
        text: restrictedMsg,
        isRestricted: true
      };
    }

    const planoraContext = createPlanoraContext(language);
    
    // Build conversation history
    const conversationLabel = language === 'ar' ? "المحادثة" : "CONVERSATION";
    const userLabel = language === 'ar' ? "المستخدم" : "User";
    const aiLabel = language === 'ar' ? "بلانورا AI" : "Planora AI";
    
    let conversationPrompt = planoraContext + `\n\n${conversationLabel}:\n`;
    
    conversationHistory.forEach(msg => {
      conversationPrompt += `${msg.role === "user" ? userLabel : aiLabel}: ${msg.content}\n`;
    });
    
    conversationPrompt += `${userLabel}: ${message}\n${aiLabel}:`;

    const result = await model.generateContent(conversationPrompt);
    const response = await result.response;
    const text = response.text();

    return {
      text: text.trim(),
      isRestricted: false
    };
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    throw error;
  }
};

// Search events by category or keyword
export const searchEvents = (query) => {
  const lowerQuery = query.toLowerCase();
  return planoraEvents.filter(event => 
    event.title.toLowerCase().includes(lowerQuery) ||
    event.category.toLowerCase().includes(lowerQuery) ||
    event.description.toLowerCase().includes(lowerQuery) ||
    event.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};

// Get events by interest
export const getEventsByInterest = (interest) => {
  return planoraEvents.filter(event => 
    event.category === interest
  );
};

// Get upcoming events
export const getUpcomingEvents = () => {
  const today = new Date();
  return planoraEvents
    .filter(event => new Date(event.date) >= today)
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

