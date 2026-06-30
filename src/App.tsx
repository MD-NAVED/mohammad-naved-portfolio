import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mail,
  Phone,
  Github,
  Linkedin,
  MapPin,
  Briefcase,
  GraduationCap,
  ChevronDown,
  Database,
  BarChart,
  TerminalSquare,
  Sun,
  Moon,
  X,
  ArrowUpRight,
  Terminal,
  Server,
  FileSpreadsheet,
  Calculator,
  LineChart,
  Download,
  Workflow,
  Menu,
  Sparkles,
  Brain,
  Code2,
  Globe,
  Cpu,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const techSkillsData = [
  { name: "Gemini API", icon: <Sparkles className="w-6 h-6" /> },
  { name: "Prompt Engineering", icon: <Brain className="w-6 h-6" /> },
  { name: "LangChain", icon: <Workflow className="w-6 h-6" /> },
  { name: "n8n", icon: <Cpu className="w-6 h-6" /> },
  { name: "Python", icon: <Terminal className="w-6 h-6" /> },
  { name: "SQL", icon: <Database className="w-6 h-6" /> },
  { name: "DuckDB", icon: <Server className="w-6 h-6" /> },
  { name: "React", icon: <Globe className="w-6 h-6" /> },
  { name: "TypeScript", icon: <Code2 className="w-6 h-6" /> }
];

const projectsData = [
  {
    id: 3,
    title: "SmartNest — Smart Home IoT Solution",
    domain: "IoT & Full-Stack Automation",
    tags: ["React Native", "FastAPI", "MQTT", "PostgreSQL", "Expo", "Docker"],
    summary: [
      "Built a home automation platform with React Native/Expo client and FastAPI backend for multi-room device bulk control and scheduling.",
      "Integrated MQTT (EMQX) broker connection and JSON payload routing on ESP32 microcontrollers for real-time control and telemetry.",
      "Engineered a camera-based QR provisioner to scan, pair, and register device hardware profiles instantly, with manual Node ID fallbacks."
    ]
  },
  {
    id: 2,
    title: "AutoApply AI — Automated Job Application System",
    domain: "AI Automation",
    tags: ["Python", "JavaScript", "Gemini AI", "Automation"],
    summary: [
      "Designed a multi-step prompt chain that reads a job description, extracts requirements, and generates a tailored resume and cover letter through structured LLM calls.",
      "Engineered system prompts to keep Gemini's output format, tone, and length consistent across hundreds of varying job postings.",
      "Built fallback and retry prompt logic to handle malformed or incomplete model outputs in production use."
    ],
    liveLink: "https://autoapply-ai-alpha.vercel.app/"
  },
  {
    id: 1,
    title: "DataLens AI — Full-Stack AI Analytics Platform",
    domain: "Frontend Architecture & BI",
    tags: ["React", "TypeScript", "Recharts", "Gemini AI", "Analytics"],
    summary: [
      "Built an AI chat interface that converts natural-language questions into SQL queries via prompt-driven query generation.",
      "Designed prompt templates for the ML Lab module to explain model outputs and surface insights in plain language.",
      "Directed end-to-end product development — frontend, ETL pipeline, and SQL engine — using AI-assisted, prompt-first development."
    ],
    liveLink: "https://data-lens-ai-omega.vercel.app/"
  },
  {
    id: 4,
    title: "Interactive Portfolio & PDF Automation Pipeline",
    domain: "Frontend & DevOps Automation",
    tags: ["React", "TypeScript", "Framer Motion", "Node.js", "Puppeteer", "TailwindCSS"],
    summary: [
      "Engineered an interactive React/TypeScript portfolio featuring hardware-accelerated Framer Motion animations, a responsive terminal interface, and a system theme-matching toggle.",
      "Automated resume exports by building a Node.js script using Puppeteer to dynamically scrape the live portfolio build and compile a pixel-perfect A4 PDF resume.",
      "Optimized bundle loading and routing to achieve fast load times and clean responsiveness across all viewport layouts."
    ]
  }
];


function PromptTerminal({ setCurrentView }: { setCurrentView: (view: 'home' | 'projects' | 'experience' | 'contact') => void }) {
  const [activeTab, setActiveTab] = useState<'prompt' | 'output'>('prompt');
  const [currentPrompt, setCurrentPrompt] = useState<string>('');
  const [outputContent, setOutputContent] = useState<string>('// Click a prompt below to execute...\n');
  const [isRunning, setIsRunning] = useState(false);
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const [customInput, setCustomInput] = useState('');

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim() || isRunning) return;

    setIsRunning(true);
    setActiveTab('prompt');
    
    // Simulate query execution logs in terminal input view
    const queryText = customInput;
    setCustomInput('');
    setCurrentPrompt(`POST /agent/chat\nPayload: {\n  "query": "${queryText}"\n}`);
    
    // Process query to determine language and keyword response
    const lowerQuery = queryText.toLowerCase();
    
    // Detect Spanish
    const spanishKeywords = ['hola', 'quien', 'eres', 'proyectos', 'proyecto', 'habilidades', 'contacto', 'resumen', 'cv'];
    const isSpanish = spanishKeywords.some(word => lowerQuery.split(/\s+/).includes(word));
    
    // Detect German
    const germanKeywords = ['hallo', 'wer', 'bist', 'projekte', 'projekt', 'fähigkeiten', 'kontakt', 'lebenslauf'];
    const isGerman = germanKeywords.some(word => lowerQuery.split(/\s+/).includes(word));

    // Detect French
    const frenchKeywords = ['bonjour', 'salut', 'qui', 'es', 'projets', 'projet', 'competences', 'contact'];
    const isFrench = frenchKeywords.some(word => lowerQuery.split(/\s+/).includes(word));

    // Detect Hindi (Devnagari)
    const devnagariKeywords = ['कौन', 'क्या', 'बारे', 'बताओ', 'जानकारी', 'नमस्ते', 'प्रोजेक्ट', 'अनुभव', 'रेज़्युमे', 'कौशल'];
    const isDevnagari = devnagariKeywords.some(word => lowerQuery.includes(word));

    // Detect Bengali
    const bengaliKeywords = ['কে', 'কি', 'প্রজেক্ট', 'দক্ষতা', 'যোগাযোগ', 'নমস্কার'];
    const isBengali = bengaliKeywords.some(word => lowerQuery.includes(word));

    // Detect Telugu
    const teluguKeywords = ['ఎవరు', 'ఏమిటి', 'ప్రాజెక్ట్', 'ప్రాజেকటులు', 'నైపుణ్యాలు', 'నమస్కారం'];
    const isTelugu = teluguKeywords.some(word => lowerQuery.includes(word));

    // Detect Tamil
    const tamilKeywords = ['யார்', 'என்ன', 'திட்டங்கள்', 'திறமைகள்', 'வணக்கம்'];
    const isTamil = tamilKeywords.some(word => lowerQuery.includes(word));

    // Detect Marathi
    const marathiKeywords = ['प्रकल्प', 'कौशल्य', 'नमस्कार', 'कोण', 'काय'];
    const isMarathi = marathiKeywords.some(word => lowerQuery.includes(word));

    // Detect Hinglish
    const hinglishKeywords = [
      'kya', 'kaun', 'tum', 'batao', 'bataiye', 'dikhao', 'dikhaye', 'karo', 
      'karna', 'karke', 'kr', 'kra', 'kru', 'krna', 'karne', 'btao', 'dkhao', 
      'kaise', 'se', 'kar', 'naam', 'toh', 'apna', 'apne', 'apni', 'tumhara', 
      'hai', 'hoon', 'hun', 'tha', 'thi', 'the', 'nhi', 'nahi', 'yaar', 'bhai', 
      'mujhe', 'mujho', 'mera', 'meri', 'mere', 'kai', 'ke', 'bare', 'baare', 
      'mai', 'chaiya', 'chahiye', 'kuch'
    ];
    const isHinglish = !isSpanish && !isGerman && !isFrench && !isDevnagari && !isBengali && !isTelugu && !isTamil && !isMarathi && hinglishKeywords.some(word => lowerQuery.split(/\s+/).includes(word));
    
    let detectedLang = "English";
    if (isSpanish) detectedLang = "Spanish";
    else if (isGerman) detectedLang = "German";
    else if (isFrench) detectedLang = "French";
    else if (isDevnagari) detectedLang = "Hindi (Devnagari)";
    else if (isBengali) detectedLang = "Bengali";
    else if (isTelugu) detectedLang = "Telugu";
    else if (isTamil) detectedLang = "Tamil";
    else if (isMarathi) detectedLang = "Marathi";
    else if (isHinglish) detectedLang = "Hinglish / Hindi";

    let responseText = "";
    
    // Now determine response text based on keywords and detected language
    if (lowerQuery.includes('smartnest')) {
      if (isSpanish) {
        responseText = "SmartNest es una solución de domótica IoT construida con React Native, FastAPI, MQTT, PostgreSQL y Docker, que admite emparejamiento de hardware mediante códigos QR.";
      } else if (isGerman) {
        responseText = "SmartNest ist eine IoT-Hausautomationslösung, die mit React Native, FastAPI, MQTT, PostgreSQL und Docker entwickelt wurde und die Hardware-Kopplung über QR-Codes unterstützt.";
      } else if (isFrench) {
        responseText = "SmartNest est une solution domotique IoT construite avec React Native, FastAPI, MQTT, PostgreSQL et Docker, prenant en charge l'appairage matériel via des codes QR.";
      } else if (isDevnagari) {
        responseText = "स्मार्टनेस्ट एक स्मार्ट होम IoT समाधान है जिसे रिएक्ट नेटिव, FastAPI, MQTT, पोस्टग्रेएसक्यूएल और डॉकर के साथ बनाया गया है, जो क्यूआर कोड के माध्यम से हार्डवेयर पेयरिंग का समर्थन करता है।";
      } else if (isBengali) {
        responseText = "SmartNest হলো একটি আইওটি (IoT) হোম অটোমেশন সিস্টেম যা রিয়্যাক্ট নেটিভ, ফাস্টএপিআই এবং এমকিউটিটি দিয়ে তৈরি।";
      } else if (isTelugu) {
        responseText = "స్మార్ట్‌నెస్ట్ అనేది రియాక్ట్ నేటివ్, FastAPI మరియు MQTT తో నిర్మించబడిన IoT హోమ్ ఆటోమేషన్ సిస్టమ్.";
      } else if (isTamil) {
        responseText = "ஸ்மார்ட்நெஸ்ட் என்பது ரியாக்ட் நேட்டிவ், FastAPI மற்றும் MQTT கொண்டு உருவாக்கப்பட்ட ஒரு IoT ஹோம் ஆட்டோமேஷன் சிஸ்டம் ஆகும்.";
      } else if (isMarathi) {
        responseText = "स्मार्टनेस्ट ही रिएक्ट नेटिव्ह, FastAPI आणि MQTT सह तयार केलेली IoT होम ऑटोमेशन सिस्टीम आहे.";
      } else if (isHinglish) {
        responseText = "SmartNest ek smart home IoT system hai jise React Native, FastAPI, aur MQTT protocol se banaya gaya hai. Ye ESP32 hardware pairing QR/Barcode scan se support karta hai.";
      } else {
        responseText = "SmartNest is Naved's latest IoT home automation system built with React Native (Expo), FastAPI, MQTT, PostgreSQL, Supabase and Docker, supporting hardware pairing via QR/Barcode.";
      }
    } else if (lowerQuery.includes('datalens')) {
      if (isSpanish) {
        responseText = "DataLens AI es una plataforma de análisis que utiliza IA para traducir lenguaje natural a consultas SQL y generar información empresarial explicada en texto plano.";
      } else if (isGerman) {
        responseText = "DataLens AI ist eine Analyseplattform, die KI nutzt, um natürliche Sprache in SQL-Abfragen zu übersetzen und verständliche Erkenntnisse zu generieren.";
      } else if (isFrench) {
        responseText = "DataLens AI est une plateforme d'analyse qui utilise l'IA pour traduire le langage naturel en requêtes SQL et générer des informations expliquées en texte clair.";
      } else if (isDevnagari) {
        responseText = "डेटा लेंस एआई एक पूर्ण-स्टैक एआई एनालिटिक्स प्लेटफॉर्म है जो प्राकृतिक भाषा को एसक्यूएल में बदलने और व्यावसायिक अंतर्दृष्टि उत्पन्न करने के लिए जेमिनी एआई का उपयोग करता है।";
      } else if (isBengali) {
        responseText = "DataLens AI হলো একটি পূর্ণ-স্ট্যাক এআই অ্যানালিটিক্স প্ল্যাটফর্ম যা সহজ ইংরেজি প্রশ্নকে এসকিউএল কোয়েরিতে রূপান্তরিত করে।";
      } else if (isTelugu) {
        responseText = "డేటా లెన్స్ అనేది సహజ భాషను SQL ప్రశ్నలుగా మార్చే పూర్తి-స్టాక్ AI అనలిటిక్స్ ప్లాట్‌ఫారమ్.";
      } else if (isTamil) {
        responseText = "டேட்டாலென்ஸ் என்பது எளிய மொழியை SQL வினவல்களாக மாற்றும் ஒரு முழு-ஸ்டாக் AI பகுப்பாய்வு தளம் ஆகும்.";
      } else if (isMarathi) {
        responseText = "डेटा लेन्स हा एक फुल-स्टॅक AI ॲनालिटिक्स प्लॅटफॉर्म आहे जो सोप्या भाषेला SQL क्वेरीमध्ये रूपांतरित करतो.";
      } else if (isHinglish) {
        responseText = "DataLens AI ek full-stack AI analytics platform hai jo React, TypeScript aur Gemini AI use karta hai. Isme raw English questions ko direct SQL query me convert kiya ja sakta hai.";
      } else {
        responseText = "DataLens AI is a full-stack AI analytics platform featuring natural language to SQL query translation (using Gemini API) and automated ML insight generators.";
      }
    } else if (lowerQuery.includes('autoapply')) {
      if (isSpanish) {
        responseText = "AutoApply AI es un sistema automatizado que lee descripciones de trabajo, extrae requisitos y genera currículums adaptados mediante llamadas estructuradas a LLM.";
      } else if (isGerman) {
        responseText = "AutoApply AI ist ein automatisiertes System, das Stellenbeschreibungen liest, Anforderungen extrahiert und maßgeschneiderte Lebensläufe über strukturierte LLM-Aufrufe generiert.";
      } else if (isFrench) {
        responseText = "AutoApply AI est un système automatisé qui lit les descriptions de poste, extrait les exigences et génère des CV personnalisés via des appels LLM structurés.";
      } else if (isDevnagari) {
        responseText = "ऑटोअप्लाई एआई एक स्वचालित नौकरी आवेदन प्रणाली है जो नौकरी के विवरण को पढ़ती है और जेमिनी के संरचित कॉल्स के माध्यम से अनुकूलित बायोडाटा उत्पन्न करती है।";
      } else if (isBengali) {
        responseText = "AutoApply AI হলো এআই সিস্টেম যা চাকরির বিবরণ পড়ে স্বয়ংক্রিয়ভাবে কাস্টমাইজড রেজ্যুমে এবং কভার লেটার তৈরি করে।";
      } else if (isTelugu) {
        responseText = "ఆటోఅప్లై AI అనేది ఉద్యోగ వివరాలను చదివి స్వయంచాలకంగా అనుకూలీకరించిన రెజ్యూమెలను రూపొందించే AI సిస్టమ్.";
      } else if (isTamil) {
        responseText = "ஆட்டோஅప్ளை AI என்பது வேலை விவரங்களைப் படித்து தானாகவே தனிப்பயனாக்கப்பட்ட பயோடేటாவை உருவாக்கும் ஒரு AI தளம் ஆகும்.";
      } else if (isMarathi) {
        responseText = "ऑटोअप्लाय AI ही एक svayanchalit নোকরি অর্জ প্রণালী আহে জি নোকরিচে তপশীল বাচून कस्टमाइज्ड बायोडाटा तयार करते.";
      } else if (isHinglish) {
        responseText = "AutoApply AI ek job application automation system hai jo python aur LLM prompt chain use karke job description se resume aur cover letter dynamically customize karta hai.";
      } else {
        responseText = "AutoApply AI is an automated job application system that parses job descriptions and dynamically generates custom resumes and cover letters using LLM prompt chaining.";
      }
    } else if (lowerQuery.includes('project') || lowerQuery.includes('work') || lowerQuery.includes('projects') || lowerQuery.includes('proyectos') || lowerQuery.includes('projekte') || lowerQuery.includes('projets') || lowerQuery.includes('প্রজেক্ট') || lowerQuery.includes('ప్రాజెక్ట్') || lowerQuery.includes('திட்டங்கள்') || lowerQuery.includes('प्रकल्प')) {
      if (isSpanish) {
        responseText = "Naved ha desarrollado 4 proyectos clave: SmartNest (Domótica), AutoApply AI (Automatización de Empleo), DataLens AI (Análisis con IA) y el pipeline de currículum en PDF.";
      } else if (isGerman) {
        responseText = "Naved hat 4 Schlüsselprojekte entwickelt: Hausautomation (SmartNest), Job-Automatisierung (AutoApply AI), KI-Analytik (DataLens AI) und die PDF-Lebenslauf-Pipeline.";
      } else if (isFrench) {
        responseText = "Naved a développé 4 projets clés: Domotique (SmartNest), Automatisation d'emploi (AutoApply AI), Analyse IA (DataLens AI) et le pipeline de CV en PDF.";
      } else if (isDevnagari) {
        responseText = "नावेद ने 4 मुख्य प्रोजेक्ट बनाए हैं: स्मार्टनेस्ट (IoT होम ऑटोमेशन), ऑटोअप्लाई एआई (जॉब ऑटोमेशन), डेटा लेंस एआई (एनालिटिक्स) और पोर्टफोलियो पीडीएफ पाइपलाइन।";
      } else if (isBengali) {
        responseText = "নাভেদ ৪টি প্রজেক্ট তৈরি করেছেন: SmartNest (আইওটি), AutoApply AI (জব অটোমেশন), DataLens AI (অ্যানালিটিক্স) এবং পিডিএফ রেজ্যুমে পাইপলাইন।";
      } else if (isTelugu) {
        responseText = "నావేద్ 4 ప్రాజెక్టులను నిర్మించారు: స్మార్ట్‌నెస్ట్, ఆటోఅప్లై AI, డేటా లెన్స్ AI మరియు రెజ్యూమే పిడిఎఫ్ పైప్‌లైన్.";
      } else if (isTamil) {
        responseText = "நாவேத் 4 முக்கிய திட்டங்களை உருவாக்கியுள்ளார்: ஸ்மார்ட்நெஸ்ட், ஆட்டோஅப்ளை AI, டேட்டாலென்ஸ் AI மற்றும் பிடிஎஃப் பயோடேட்டா பைப்லைன்.";
      } else if (isMarathi) {
        responseText = "नावेदमने ४ प्रकल्प तयार केले आहेत: स्मार्टनेस्ट, ऑटोअप्लाय AI, डेटा लेन्स AI आणि पीडीएफ बायोडाटा पाइपलाइन.";
      } else if (isHinglish) {
        responseText = "Naved ne 4 projects banaye hain: SmartNest (IoT Automation), AutoApply AI (Job Application Tool), DataLens AI (Analytics Platform), aur Portfolio PDF Automation.";
      } else {
        responseText = "Naved has built 4 key projects: SmartNest (IoT Home Automation), AutoApply AI (Job Automation), DataLens AI (Analytics Platform), and Portfolio PDF Automation Pipeline.";
      }
    } else if (lowerQuery.includes('skills') || lowerQuery.includes('tech') || lowerQuery.includes('habilidades') || lowerQuery.includes('fähigkeiten') || lowerQuery.includes('competences') || lowerQuery.includes('कौशल') || lowerQuery.includes('দক্ষতা') || lowerQuery.includes('নైపుణ్యాలు') || lowerQuery.includes('திறமைகள்') || lowerQuery.includes('कौशल्य')) {
      if (isSpanish) {
        responseText = "Naved se especializa en Ingeniería de Prompts, Agentes de IA (LangChain, n8n), Python, SQL, React, TypeScript y Docker.";
      } else if (isGerman) {
        responseText = "Naved ist spezialisiert auf Prompt Engineering, KI-Agenten (LangChain, n8n), Python, SQL, React, TypeScript und Docker.";
      } else if (isFrench) {
        responseText = "Naved est spécialisé en ingénierie de prompts, agents d'IA (LangChain, n8n), Python, SQL, React, TypeScript et Docker.";
      } else if (isDevnagari) {
        responseText = "नावेद प्रॉम्प्ट इंजीनियरिंग, एीआई एजेंट वर्कफ़्लो (LangChain, n8n), पायथन, एसक्यूएल और रिएक्ट/टाइपस्क्रिप्ट में कुशल हैं।";
      } else if (isBengali) {
        responseText = "নাভেদ প্রম্পট ইঞ্জিনিয়ারিং, এআই এজেন্ট (LangChain, n8n), পাইথন, এসকিউএল এবং রিয়্যাক্ট/টাইপস্ক্রিপ্ট প্রযুক্তিতে বিশেষজ্ঞ।";
      } else if (isTelugu) {
        responseText = "నావేద్ ప్రాంప్ట్ ఇంజనీరింగ్, AI ఏజెంట్లు (LangChain, n8n), పైథాన్, SQL మరియు రియాక్ట్/టైప్‌స్క్రిప్ట్‌లో నిపుణుడు.";
      } else if (isTamil) {
        responseText = "நாவேத் பிராம்ப் இன்ஜினியரிங், AI ஏஜெண்டுகள் (LangChain, n8n), பைதான், SQL மற்றும் ரியாக்ட்/டைப்ஸ்கிரிப்ட் ஆகியவற்றில் நிபுணத்துவம் பெற்றவர்.";
      } else if (isMarathi) {
        responseText = "नावेद हा प्रॉम्प्ट इंजिनिअरिंग, AI एजंट (LangChain, n8n), पायथन, SQL आणि रिएक्ट/टाइपस्क्रिप्टमध्ये तज्ञ आहे.";
      } else if (isHinglish) {
        responseText = "Naved Prompt Engineering, AI Agents (LangChain, n8n), Python, SQL, aur React/TypeScript frontends me specialized hain.";
      } else {
        responseText = "Naved specializes in Prompt Engineering, AI Agent workflows (LangChain, n8n), Python, SQL, React, TypeScript, and Docker.";
      }
    } else if (lowerQuery.includes('contact') || lowerQuery.includes('email') || lowerQuery.includes('contacto') || lowerQuery.includes('kontakt') || lowerQuery.includes('संपर्क') || lowerQuery.includes('যোগাযোগ') || lowerQuery.includes('సంప్రదించండి') || lowerQuery.includes('தொடர்பு')) {
      if (isSpanish) {
        responseText = "Puede contactar a Naved en andyk4548@gmail.com, por teléfono al +91 9753880839 o conectarse en LinkedIn (in/md-naved-2b79b8382).";
      } else if (isGerman) {
        responseText = "Sie können Naved unter andyk4548@gmail.com, per Telefon unter +91 9753880839 erreichen oder sich auf LinkedIn verbinden.";
      } else if (isFrench) {
        responseText = "Vous pouvez contacter Naved à andyk4548@gmail.com, par téléphone au +91 9753880839 ou vous connecter sur LinkedIn.";
      } else if (isDevnagari) {
        responseText = "आप नावेद से andyk4548@gmail.com पर संपर्क कर सकते हैं, फोन +91 9753880839 पर बात कर सकते हैं या लिंक्डइन पर जुड़ सकते हैं।";
      } else if (isBengali) {
        responseText = "আপনি নাভেদের সাথে andyk4548@gmail.com ইমেইল অথবা +91 9753880839 ফোনে যোগাযোগ করতে পারেন।";
      } else if (isTelugu) {
        responseText = "మీరు నావేద్‌ను andyk4548@gmail.com లేదా +91 9753880839 ద్వారా సంప్రదించవచ్చు.";
      } else if (isTamil) {
        responseText = "நீங்கள் நாவேதை andyk4548@gmail.com அல்லது +91 9753880839 மூலம் தொடர்பு கொள்ளலாம்.";
      } else if (isMarathi) {
        responseText = "तुम्ही नावेदशी andyk4548@gmail.com किंवा +91 9753880839 वर संपर्क साधू शकता.";
      } else if (isHinglish) {
        responseText = "Aap Naved se andyk4548@gmail.com ya phone +91 9753880839 par contact kar sakte hain. LinkedIn link: linkedin.com/in/md-naved-2b79b8382.";
      } else {
        responseText = "You can reach Naved at andyk4548@gmail.com, via phone at +91 9753880839, or connect on LinkedIn (in/md-naved-2b79b8382).";
      }
    } else if (lowerQuery.includes('resume') || lowerQuery.includes('cv') || lowerQuery.includes('resumen') || lowerQuery.includes('lebenslauf') || lowerQuery.includes('रेज़्युमे') || lowerQuery.includes('রেজ্যুমে')) {
      if (isSpanish) {
        responseText = "Puede descargar el currículum en PDF de 2 páginas de Naved directamente desde el botón de descarga del encabezado o en /Mohammad_Naved_Resume.pdf.";
      } else if (isGerman) {
        responseText = "Sie können den zweiseitigen PDF-Lebenslauf von Naved direkt über die Download-Schaltfläche im Header oder unter /Mohammad_Naved_Resume.pdf herunterladen.";
      } else if (isFrench) {
        responseText = "Vous pouvez télécharger le CV PDF en 2 pages de Naved directement depuis le bouton de téléchargement en haut ou à /Mohammad_Naved_Resume.pdf.";
      } else if (isDevnagari) {
        responseText = "आप नावेद का 2-पेज का पीडीएफ रेज़्युमे वेबसाइट हेडर के डाउनलोड बटन से या सीधे /Mohammad_Naved_Resume.pdf से डाउनलोड कर सकते हैं।";
      } else if (isBengali) {
        responseText = "আপনি নাভেদের ২-পৃষ্ঠার পিডিএফ রেজ্যুমে হেডার ডাউনলোড বোতাম থেকে সরাসরি ডাউনলোড করতে পারেন।";
      } else if (isTelugu) {
        responseText = "మీరు నావేద్ యొక్క 2-పేజీల పిడిఎఫ్ రెజ్యూమేను హెడర్ డౌన్‌లోడ్ బటన్ ద్వారా డౌన్‌లోడ్ చేసుకోవచ్చు.";
      } else if (isTamil) {
        responseText = "நீங்கள் நாவேதின் 2-பக்க பிடிஎஃப் பயோடேட்டாவை ஹெடரில் உள்ள பதிவிறக்க பொத்தான் மூலம் பதிவிறக்கம் செய்யலாம்.";
      } else if (isMarathi) {
        responseText = "तुम्ही नावेदचा २-पेजचा पीडीएफ बायोडाटा हेडरमधील डाउनलोड बटणावरून थेट डाउनलोड करू शकता.";
      } else if (isHinglish) {
        responseText = "Aap Naved ka 2-page print-ready PDF resume website header ke download button se ya directly /Mohammad_Naved_Resume.pdf link se download kar sakte hain.";
      } else {
        responseText = "You can download Naved's 2-page print-ready PDF resume directly from the header download button or at /Mohammad_Naved_Resume.pdf.";
      }
    } else if (lowerQuery.includes('hello') || lowerQuery.includes('hi') || lowerQuery.includes('hola') || lowerQuery.includes('hallo') || lowerQuery.includes('bonjour') || lowerQuery.includes('नमस्ते') || lowerQuery.includes('নমস্কার') || lowerQuery.includes('నమస్కారం') || lowerQuery.includes('வணக்கம்')) {
      if (isSpanish) {
        responseText = "¡Hola! Soy el asistente de IA de Naved. ¡Pregúntame cualquier cosa sobre sus proyectos, habilidades técnicas o currículum!";
      } else if (isGerman) {
        responseText = "Hallo! Ich bin Naveds KI-Assistent. Fragen Sie mich alles über seine Projekte, technischen Fähigkeiten oder seinen Lebenslauf!";
      } else if (isFrench) {
        responseText = "Bonjour! Je suis l'assistant IA de Naved. Posez-moi des questions sur ses projets, ses compétences techniques ou son CV!";
      } else if (isDevnagari) {
        responseText = "नमस्ते! मैं नावेद का एआई सहायक हूँ। आप मुझसे उनके प्रोजेक्ट्स, स्किल्स, रेज़्युमे या संपर्क विवरण के बारे में कुछ भी पूछ सकते हैं!";
      } else if (isBengali) {
        responseText = "নমস্কার! আমি নাভেদের এআই সহকারী। তার প্রজেক্ট, দক্ষতা বা রেজ্যুমে সম্পর্কে যেকোনো প্রশ্ন করুন।";
      } else if (isTelugu) {
        responseText = "నమస్కారం! నేను నావేద్ యొక్క AI సహాయకుడిని. అతని ప్రాజెక్ట్‌లు లేదా నైపుణ్యాల గురించి ఏదైనా అడగండి.";
      } else if (isTamil) {
        responseText = "வணக்கம்! நான் நாவேதின் AI உதவியாளர். அவருடைய திட்டங்கள் அல்லது திறன்களைப் பற்றி ஏதேனும் கேளுங்கள்.";
      } else if (isMarathi) {
        responseText = "नमस्कार! मी नावेदचा AI सहाय्यक आहे. मला त्याचे प्रकल्प किंवा कौशल्यांबद्दल काहीही विचारा.";
      } else if (isHinglish) {
        responseText = "Hello! Main Naved ka AI assistant hoon. Aap mujhse Naved ke projects, skills, resume, ya contact details ke baare me kuch bhi puch sakte hain!";
      } else {
        responseText = "Hello! I am Naved's AI assistant. Ask me anything about Naved's projects, technical skills, resume, or contact details!";
      }
    } else {
      if (isSpanish) {
        responseText = "Naved es un Ingeniero de Prompts y de IA Aplicada. Construye sistemas integrados con LLM usando Python y React. Pregúntame sobre sus proyectos.";
      } else if (isGerman) {
        responseText = "Naved ist ein Applied AI & Prompt Engineer. Er baut LLM-integrierte Systeme mit Python und React. Fragen Sie mich nach seinen Projekten.";
      } else if (isFrench) {
        responseText = "Naved est un ingénieur IA appliquée et prompts. Il conçoit des systèmes intégrés avec des LLM à l'aide de Python et React. N'hésitez pas à poser des questions.";
      } else if (isDevnagari) {
        responseText = "नावेद एक एप्लाइड एआई और प्रॉम्प्ट इंजीनियर हैं जो एलएलएम, पायथन और रिएक्ट फ्रंटएंड का उपयोग करके काम करने वाले एप्लिकेशन बनाते हैं।";
      } else if (isBengali) {
        responseText = "নাভেদ একজন অ্যাপ্লাইড এআই এবং প্রম্পট ইঞ্জিনিয়ার। তিনি প্রম্পট চেইনিং এবং এআই এজেন্ট তৈরিতে পারদর্শী।";
      } else if (isTelugu) {
        responseText = "నావేద్ ఒక అప్లైడ్ AI మరియు ప్రాంప్ట్ ఇంజనీర్. అతను AI వర్క్‌ఫ్లోలు మరియు అప్లిকেషన్‌లను నిర్मिస్తాడు.";
      } else if (isTamil) {
        responseText = "நாவேத் ஒரு முக்கிய AI மற்றும் பிராம்ப் பொறியாளர் ஆவார். அவர் எல்எல்এম பயன்பாடுகளை உருவாக்குகிறார்.";
      } else if (isMarathi) {
        responseText = "नावेद हा एक उपयोजित AI आणि प्रॉम्प्ट अभियंता आहे. तो विविध AI ॲप्लिकेशन्स तयार करतो.";
      } else if (isHinglish) {
        responseText = "Naved ek Applied AI & Prompt Engineer hain jo LLMs, Python, aur React frontends ke sath working applications build karte hain. Aap unke projects (SmartNest, DataLens AI, AutoApply AI) ke baare me detail me jaan sakte hain.";
      } else {
        responseText = "Naved is an Applied AI & Prompt Engineer. He builds smart applications using LLM API integrations, custom agents, Python, and React. Feel free to ask about his specific projects (SmartNest, DataLens AI, AutoApply AI).";
      }
    }
    
    const outputJSON = `{
  "status": "success",
  "query": "${queryText}",
  "language_detected": "${detectedLang}",
  "response": "${responseText}"
}`;

    // Staged execution sequence
    setTimeout(() => {
      setActiveTab('output');
      
      // Simulate typing output JSON
      let currentOutput = '';
      let outIndex = 0;
      const outputInterval = setInterval(() => {
        if (outIndex < outputJSON.length) {
          currentOutput += outputJSON.substring(outIndex, outIndex + 3);
          setOutputContent(currentOutput);
          outIndex += 3;
        } else {
          clearInterval(outputInterval);
          setIsRunning(false);
          // Auto-clear active highlights after 3 seconds
          setTimeout(() => {
            setCurrentPrompt('');
          }, 3000);
        }
      }, 10);
    }, 1200);
  };

  const prompts = {
    skills: {
      label: "summarize_skills.sh",
      input: "GET /skills/summary\nHeader: Authorization Bearer Developer\nQuery: list top tech skills and competencies",
      output: `{
  "role": "Prompt Engineer",
  "focus": "LLM Orchestration & Workflows",
  "skills": {
    "core": ["Gemini API", "Prompt Design", "LangChain", "n8n"],
    "data": ["Python", "SQL", "DuckDB", "Power BI"],
    "frontend": ["React", "TypeScript", "TailwindCSS"]
  },
  "status": "ready_to_ship"
}`
    },
    projects: {
      label: "get_projects.json",
      input: "POST /agent/run\nPayload: {\n  \"task\": \"fetch active projects\",\n  \"limit\": 4\n}",
      output: `{
  "status": "success",
  "data": {
    "projects": [
      { "name": "SmartNest", "type": "IoT Smart Home Solution" },
      { "name": "AutoApply AI", "type": "Automation System" },
      { "name": "DataLens AI", "type": "Analytics Platform" },
      { "name": "Interactive Portfolio", "type": "DevOps & Portfolio Automation" }
    ],
    "action": "REDIRECT_TO_PROJECTS"
  }
}`
    },
    contact: {
      label: "initiate_contact.py",
      input: "import agent\n\nagent.trigger_event(\n    type='contact_handshake',\n    target='andyk4548@gmail.com'\n)",
      output: `{
  "status": "success",
  "channel": "email",
  "info": {
    "email": "andyk4548@gmail.com",
    "phone": "+919753880839"
  },
  "action": "REDIRECT_TO_CONTACT"
}`
    }
  };

  const runPrompt = (key: keyof typeof prompts) => {
    if (isRunning) return;
    setIsRunning(true);
    setActiveButton(key);
    setActiveTab('prompt');
    setCurrentPrompt('');
    setOutputContent('');

    const targetPrompt = prompts[key];
    
    // Simulate typing input
    let currentInput = '';
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index < targetPrompt.input.length) {
        currentInput += targetPrompt.input[index];
        setCurrentPrompt(currentInput);
        index++;
      } else {
        clearInterval(typingInterval);
        
        // Simulate execution delay
        setTimeout(() => {
          setActiveTab('output');
          
          // Simulate typing output JSON
          let currentOutput = '';
          let outIndex = 0;
          const outputInterval = setInterval(() => {
            if (outIndex < targetPrompt.output.length) {
              currentOutput += targetPrompt.output.substring(outIndex, outIndex + 3);
              setOutputContent(currentOutput);
              outIndex += 3;
            } else {
              clearInterval(outputInterval);
              setIsRunning(false);
              
              // Handle action redirects
              if (key === 'projects') {
                setTimeout(() => {
                  setCurrentView('projects');
                  setActiveButton(null);
                  setCurrentPrompt('');
                  setOutputContent('// Click a prompt below to execute...\n');
                  setActiveTab('prompt');
                }, 1500);
              } else if (key === 'contact') {
                setTimeout(() => {
                  setCurrentView('contact');
                  setActiveButton(null);
                  setCurrentPrompt('');
                  setOutputContent('// Click a prompt below to execute...\n');
                  setActiveTab('prompt');
                }, 1500);
              } else {
                setTimeout(() => {
                  setActiveButton(null);
                }, 2000);
              }
            }
          }, 15);
        }, 800);
      }
    }, 10);
  };

  const renderHighlightedPrompt = (text: string) => {
    if (!text) return null;
    return text.split('\n').map((line, i) => {
      let lineContent;
      if (line.startsWith('GET') || line.startsWith('POST')) {
        const parts = line.split(' ');
        lineContent = (
          <>
            <span className="text-violet-400 font-bold">{parts[0]}</span>{' '}
            <span className="text-sky-300">{parts[1]}</span>
          </>
        );
      } else if (line.startsWith('Header:') || line.startsWith('Query:') || line.startsWith('Payload:')) {
        const idx = line.indexOf(' ');
        lineContent = (
          <>
            <span className="text-neutral-500 font-semibold">{line.substring(0, idx)}</span>
            <span className="text-neutral-300">{line.substring(idx)}</span>
          </>
        );
      } else if (line.startsWith('import ') || line.startsWith('agent.')) {
        if (line.startsWith('import ')) {
          lineContent = (
            <>
              <span className="text-violet-400">import</span>{line.substring(6)}
            </>
          );
        } else {
          lineContent = (
            <>
              <span className="text-sky-400">agent</span>
              <span className="text-neutral-500">.</span>
              <span className="text-amber-300">trigger_event</span>
              {line.substring(19)}
            </>
          );
        }
      } else {
        lineContent = line;
      }

      return (
        <span key={i}>
          {i > 0 && <br />}
          {lineContent}
        </span>
      );
    });
  };

  const highlightArrayValues = (arrayStr: string) => {
    const parts = arrayStr.split(/"/g);
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return <span key={index} className="text-amber-300">"{part}"</span>;
      }
      return <span key={index} className="text-neutral-400">{part}</span>;
    });
  };

  const renderHighlightedJSON = (text: string) => {
    if (!text || text.startsWith('//')) {
      return <span className="text-neutral-500 italic">{text}</span>;
    }
    return text.split('\n').map((line, i) => {
      const match = line.match(/^(\s*)"([^"]+)":\s*(.*)$/);
      if (match) {
        const [_, indent, key, val] = match;
        let valEl = <span className="text-emerald-400">{val}</span>;
        
        const trimmedVal = val.trim();
        if (trimmedVal.startsWith('[') && (trimmedVal.endsWith('],') || trimmedVal.endsWith(']'))) {
          valEl = <>{highlightArrayValues(trimmedVal)}</>;
        } else if (trimmedVal.startsWith('{') || trimmedVal.endsWith('{')) {
          valEl = <span className="text-neutral-400">{val}</span>;
        } else if (trimmedVal.startsWith('"')) {
          valEl = <span className="text-amber-300">{val}</span>;
        } else if (!isNaN(Number(trimmedVal.replace(/[,\s]/g, '')))) {
          valEl = <span className="text-purple-400">{val}</span>;
        } else if (trimmedVal.includes('true') || trimmedVal.includes('false')) {
          valEl = <span className="text-purple-400">{val}</span>;
        }
        
        return (
          <div key={i} className="min-h-[18px]">
            {indent}
            <span className="text-sky-400">"{key}"</span>
            <span className="text-neutral-400">: </span>
            {valEl}
          </div>
        );
      }
      return <div key={i} className="min-h-[18px] text-neutral-400">{line}</div>;
    });
  };

  return (
    <div className="relative w-full max-w-lg group">
      {/* Dynamic ambient glow behind the terminal */}
      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-neutral-800 via-neutral-700 to-neutral-800 opacity-20 blur-md group-hover:opacity-30 transition duration-500"></div>
      
      <div className="relative w-full bg-[#0a0a0a]/95 backdrop-blur-xl rounded-2xl border border-neutral-800/80 text-neutral-300 font-mono text-[11px] overflow-hidden shadow-2xl flex flex-col h-[340px] text-left">
        {/* macOS Style Window Titlebar */}
        <div className="bg-[#121212]/90 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-neutral-900/60 select-none">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56] shadow-[0_0_8px_rgba(255,95,86,0.2)]"></div>
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e] shadow-[0_0_8px_rgba(255,189,46,0.2)]"></div>
            <div className="w-3 h-3 rounded-full bg-[#27c93f] shadow-[0_0_8px_rgba(39,201,63,0.2)]"></div>
          </div>
          <div className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-neutral-600" />
            gemini-agent-terminal
          </div>
          <div className="w-12"></div>
        </div>

        {/* Tab Headers */}
        <div className="flex border-b border-neutral-900/60 bg-[#0e0e0e]/80 select-none">
          <motion.button 
            onClick={() => !isRunning && setActiveTab('prompt')}
            disabled={isRunning}
            whileHover={!isRunning ? { backgroundColor: 'rgba(255,255,255,0.02)' } : {}}
            whileTap={!isRunning ? { scale: 0.98 } : {}}
            className={`px-4 py-2.5 text-[10px] uppercase font-bold tracking-wider transition-all flex items-center gap-2 border-r border-neutral-900/60 ${
              activeTab === 'prompt' 
                ? 'bg-[#0a0a0a] text-white border-t-2 border-t-neutral-100' 
                : 'text-neutral-500 hover:text-neutral-300 hover:bg-[#111]/30'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            Prompt Input
          </motion.button>
          <motion.button 
            onClick={() => !isRunning && setActiveTab('output')}
            disabled={isRunning}
            whileHover={!isRunning ? { backgroundColor: 'rgba(255,255,255,0.02)' } : {}}
            whileTap={!isRunning ? { scale: 0.98 } : {}}
            className={`px-4 py-2.5 text-[10px] uppercase font-bold tracking-wider transition-all flex items-center gap-2 border-r border-neutral-900/60 ${
              activeTab === 'output' 
                ? 'bg-[#0a0a0a] text-white border-t-2 border-t-neutral-100' 
                : 'text-neutral-500 hover:text-neutral-300 hover:bg-[#111]/30'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            LLM Output {isRunning && activeTab === 'prompt' && <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse ml-0.5"></span>}
          </motion.button>
        </div>

        {/* Console Content Screen */}
        <div className="flex-grow p-4 overflow-y-auto bg-[#0a0a0a]/90 text-neutral-400 relative custom-scrollbar">
          {activeTab === 'prompt' ? (
            <div className="whitespace-pre-wrap leading-relaxed select-text font-mono">
              <span className="text-green-500 font-bold">$ </span>
              {currentPrompt ? (
                <>
                  {renderHighlightedPrompt(currentPrompt)}
                  <span className="animate-pulse bg-neutral-400 text-transparent ml-0.5">|</span>
                </>
              ) : (
                <form onSubmit={handleCustomSubmit} className="inline-flex w-[90%] items-center">
                  <input
                    type="text"
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    disabled={isRunning}
                    placeholder="Ask me anything..."
                    className="bg-transparent border-none outline-none text-neutral-300 w-full placeholder:text-neutral-500 text-[11px] p-0 font-mono focus:ring-0 focus:outline-none"
                    autoFocus
                  />
                </form>
              )}
            </div>
          ) : (
            <div className="whitespace-pre-wrap leading-relaxed font-mono select-text">
              {renderHighlightedJSON(outputContent)}
            </div>
          )}

          {isRunning && activeTab === 'prompt' && (
            <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-neutral-900/90 px-3 py-1.5 rounded-lg border border-neutral-800 text-[10px] text-amber-500 shadow-md">
              <span className="animate-spin inline-block w-3 h-3 border border-t-transparent border-amber-500 rounded-full"></span>
              Executing chain...
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="bg-[#0e0e0e]/80 backdrop-blur-md p-3 border-t border-neutral-900/60 flex flex-wrap gap-2 justify-center select-none">
          <motion.button 
            onClick={() => runPrompt('skills')}
            disabled={isRunning}
            whileHover={!isRunning ? { scale: 1.05, y: -1 } : {}}
            whileTap={!isRunning ? { scale: 0.95 } : {}}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className={`px-3.5 py-1.5 rounded-xl border text-[10px] uppercase font-bold tracking-wider transition-all flex items-center gap-2 ${
              activeButton === 'skills' 
                ? 'bg-neutral-100 text-neutral-950 border-neutral-100 shadow-md' 
                : 'bg-neutral-900/60 hover:bg-neutral-800/80 border-neutral-800/80 text-neutral-400 hover:text-white disabled:opacity-50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Skills
          </motion.button>
          <motion.button 
            onClick={() => runPrompt('projects')}
            disabled={isRunning}
            whileHover={!isRunning ? { scale: 1.05, y: -1 } : {}}
            whileTap={!isRunning ? { scale: 0.95 } : {}}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className={`px-3.5 py-1.5 rounded-xl border text-[10px] uppercase font-bold tracking-wider transition-all flex items-center gap-2 ${
              activeButton === 'projects' 
                ? 'bg-neutral-100 text-neutral-950 border-neutral-100 shadow-md' 
                : 'bg-neutral-900/60 hover:bg-neutral-800/80 border-neutral-800/80 text-neutral-400 hover:text-white disabled:opacity-50'
            }`}
          >
            <Workflow className="w-3.5 h-3.5" />
            Projects
          </motion.button>
          <motion.button 
            onClick={() => runPrompt('contact')}
            disabled={isRunning}
            whileHover={!isRunning ? { scale: 1.05, y: -1 } : {}}
            whileTap={!isRunning ? { scale: 0.95 } : {}}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className={`px-3.5 py-1.5 rounded-xl border text-[10px] uppercase font-bold tracking-wider transition-all flex items-center gap-2 ${
              activeButton === 'contact' 
                ? 'bg-neutral-100 text-neutral-950 border-neutral-100 shadow-md' 
                : 'bg-neutral-900/60 hover:bg-neutral-800/80 border-neutral-800/80 text-neutral-400 hover:text-white disabled:opacity-50'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            Contact
          </motion.button>
        </div>
      </div>
    </div>
  );
}


export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'projects' | 'experience' | 'contact'>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedProject, setSelectedProject] = useState<typeof projectsData[0] | null>(null);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const viewsList: ('home' | 'projects' | 'experience' | 'contact')[] = ['home', 'projects', 'experience', 'contact'];

  useEffect(() => {
    if (isTerminalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isTerminalOpen]);

  // Swipe navigation for touch devices
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => {
      if (isTerminalOpen || selectedProject || isMobileMenuOpen) return;
      setTouchEnd(null);
      setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (isTerminalOpen || selectedProject || isMobileMenuOpen) return;
      setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
      if (!touchStart || !touchEnd) return;
      const distance = touchStart - touchEnd;
      const isLeftSwipe = distance > minSwipeDistance;
      const isRightSwipe = distance < -minSwipeDistance;

      const currentIndex = viewsList.indexOf(currentView);

      if (isLeftSwipe && currentIndex < viewsList.length - 1) {
        setCurrentView(viewsList[currentIndex + 1]);
      } else if (isRightSwipe && currentIndex > 0) {
        setCurrentView(viewsList[currentIndex - 1]);
      }
    };

    window.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchEnd);
    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [touchStart, touchEnd, currentView, isTerminalOpen, selectedProject, isMobileMenuOpen]);

  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');

    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || "YOUR_ACCESS_KEY_HERE";

    const payload = {
      access_key: accessKey,
      name: contactName,
      email: contactEmail,
      message: contactMessage,
      subject: `New Portfolio Message from ${contactName}`
    };

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (result.success) {
        setFormStatus('success');
        setContactName('');
        setContactEmail('');
        setContactMessage('');
        setTimeout(() => setFormStatus('idle'), 4000);
      } else {
        console.error("Web3Forms error:", result);
        setFormStatus('error');
        setTimeout(() => setFormStatus('idle'), 4000);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setFormStatus('error');
      setTimeout(() => setFormStatus('idle'), 4000);
    }
  };

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  useEffect(() => {
    if (selectedProject || isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; }
  }, [selectedProject, isMobileMenuOpen]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  }, [currentView]);

  const pageVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, y: -15, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }
  };

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'projects', label: 'Projects' },
    { id: 'experience', label: 'Experience' },
    { id: 'contact', label: 'Contact' }
  ];

  return (
    <div className={isDarkMode ? 'dark bg-[#0a0a0a]' : 'bg-[#FAFAFA]'}>
      {/* Background Ambience Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-grid-pattern [mask-image:linear-gradient(to_bottom,white,transparent)] opacity-60"></div>
      <div className="fixed inset-0 z-0 pointer-events-none bg-noise opacity-[0.035] dark:opacity-[0.05] mix-blend-overlay"></div>

      {/* Dynamic Background Glow Blobs */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none">
        {/* Blob 1: Top Left / Center */}
        <motion.div
          animate={{
            x: [0, 40, -20, 0],
            y: [0, -30, 20, 0],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-[120px]"
        />
        {/* Blob 2: Middle Right */}
        <motion.div
          animate={{
            x: [0, -50, 30, 0],
            y: [0, 40, -30, 0],
            scale: [1, 0.9, 1.1, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-[30%] -right-[10%] w-[45vw] h-[45vw] max-w-[500px] max-h-[500px] rounded-full bg-blue-500/10 dark:bg-blue-500/5 blur-[120px]"
        />
        {/* Blob 3: Bottom Left */}
        <motion.div
          animate={{
            x: [0, 30, -30, 0],
            y: [0, 20, 40, 0],
            scale: [1, 1.05, 0.9, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-[10%] -left-[5%] w-[40vw] h-[40vw] max-w-[450px] max-h-[450px] rounded-full bg-violet-500/10 dark:bg-violet-500/5 blur-[100px]"
        />
      </div>

      <div className="min-h-screen flex flex-col transition-colors duration-500 bg-transparent text-neutral-900 dark:text-neutral-100 font-sans selection:bg-neutral-200 dark:selection:bg-neutral-800 relative z-10 w-full overflow-x-hidden pt-20">
        
        {/* Fixed Head Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-40 bg-[#FAFAFA]/70 dark:bg-[#0a0a0a]/70 backdrop-blur-xl border-b border-neutral-200/50 dark:border-neutral-800/50 transition-colors">
          <div className="w-full mx-auto px-6 sm:px-8 md:px-12 lg:px-20 h-20 flex justify-between items-center">
            
            {/* Nav Links Desktop */}
            <div className="hidden md:flex gap-8 text-xs font-bold tracking-widest uppercase items-center flex-1">
              {navLinks.map((link) => (
                <motion.button
                  key={link.id}
                  onClick={() => setCurrentView(link.id as any)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`transition-all duration-300 relative py-2 cursor-pointer ${currentView === link.id ? 'text-neutral-900 dark:text-neutral-100' : 'text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'}`}
                >
                  {link.label}
                  {currentView === link.id && (
                    <motion.div layoutId="navIndicator" className="absolute bottom-0 left-0 right-0 h-px bg-neutral-900 dark:bg-neutral-100" />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Nav Link Mobile Hamburger */}
            <div className="md:hidden flex items-center pr-4 border-r border-neutral-200 dark:border-neutral-800">
               <motion.button 
                 onClick={() => setIsMobileMenuOpen(true)}
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
                 className="p-2 -ml-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors cursor-pointer"
                 aria-label="Open Menu"
               >
                 <Menu className="w-6 h-6 text-neutral-900 dark:text-neutral-100" />
               </motion.button>
            </div>

            <div className="flex items-center space-x-4 md:space-x-6 text-sm text-neutral-400 dark:text-neutral-500 transition-colors">
              <motion.a 
                href="/Mohammad_Naved_Resume.pdf" 
                download="Mohammad_Naved_Resume.pdf"
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className="items-center gap-2 px-4 md:px-5 py-2.5 rounded-full border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-900 hover:text-white dark:hover:bg-neutral-100 dark:hover:text-neutral-900 transition-all font-medium text-xs tracking-widest uppercase flex cursor-pointer"
              >
                <span className="hidden sm:inline">Download CV</span>
                <span className="sm:hidden">CV</span>
                <Download className="w-4 h-4" />
              </motion.a>
              <motion.button 
                onClick={toggleDarkMode}
                whileHover={{ scale: 1.1, rotate: 15 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors focus:outline-none flex-shrink-0 cursor-pointer"
                aria-label="Toggle Dark Mode"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={isDarkMode ? 'dark' : 'light'}
                    initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isDarkMode ? 
                      <Sun className="w-5 h-5 text-neutral-400 hover:text-neutral-100 transition-colors" /> : 
                      <Moon className="w-5 h-5 text-neutral-500 hover:text-neutral-900 transition-colors" />
                    }
                  </motion.div>
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </nav>

        {/* Mobile Full Screen Menu overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 bg-[#FAFAFA]/95 dark:bg-[#0a0a0a]/95 backdrop-blur-xl flex flex-col pt-6 px-6 sm:px-8"
            >
              <div className="flex justify-between items-center mb-16">
                 <div className="text-sm font-semibold tracking-widest uppercase text-neutral-900 dark:text-neutral-100">Naved | Portfolio</div>
                 <motion.button 
                    onClick={() => setIsMobileMenuOpen(false)}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className="p-3 -mr-3 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                  >
                    <X className="w-6 h-6 text-neutral-900 dark:text-neutral-100" />
                  </motion.button>
              </div>
              
              <div className="flex flex-col gap-8 items-center justify-center flex-1 pb-20">
                {navLinks.map((link, idx) => (
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    key={link.id}
                    onClick={() => setCurrentView(link.id as any)}
                    className={`text-3xl font-medium tracking-tighter cursor-pointer ${currentView === link.id ? 'text-neutral-900 dark:text-neutral-100' : 'text-neutral-400 dark:text-neutral-600'}`}
                  >
                    {link.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <main className="flex-grow pt-12 pb-24 md:pb-32 px-6 sm:px-8 md:px-12 lg:px-20 w-full max-w-7xl mx-auto">
           <AnimatePresence mode="wait">
             
             {/* HOME VIEW */}
             {currentView === 'home' && (
               <motion.div key="home" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-24 md:space-y-32">
                 
                 <section className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 pt-8 md:pt-16">
                    <div className="md:col-span-12 lg:col-span-7 flex flex-col items-center md:items-start text-center md:text-left">
                      <h1 className="text-6xl md:text-8xl font-semibold tracking-tighter leading-tight mb-8 text-transparent bg-clip-text bg-gradient-to-br from-neutral-950 via-neutral-800 to-neutral-600 dark:from-white dark:via-neutral-300 dark:to-neutral-500 transition-all duration-500">
                        Mohammad<br className="hidden md:block"/> Naved.
                      </h1>
                      <p className="text-xs uppercase tracking-widest font-bold text-neutral-400 dark:text-neutral-500 mb-4">
                        AI-Assisted Builder &bull; Prompt Engineer
                      </p>
                      <p className="text-base text-neutral-500 dark:text-neutral-400 max-w-xl leading-relaxed mb-10 transition-colors mx-auto md:mx-0 font-light">
                        Prompt Engineer who builds and ships real, working AI products by directing large language models rather than writing code line-by-line. Designs system prompts, prompt chains, and agentic workflows that turn LLMs into reliable application components — translating product ideas into working software through precise instruction design, iterative testing, and prompt-level debugging.
                      </p>
                      <div className="flex justify-center md:justify-start items-center space-x-4 mb-8 text-sm w-full">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-green-500 dark:bg-green-400 transition-colors shadow-[0_0_8px_rgba(34,197,94,0.4)]"></div>
                          <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 transition-colors">Available for Opportunities</span>
                        </div>
                      </div>
                    </div>
                    <div className="md:col-span-12 lg:col-span-5 flex flex-col justify-center items-center lg:items-end w-full max-w-lg mx-auto lg:mx-0 space-y-6 lg:pt-8">
                      <motion.div 
                        whileHover={{ scale: 1.02, y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        className="w-full bg-white dark:bg-neutral-900/90 text-neutral-900 dark:text-white p-8 rounded-2xl flex justify-between items-center group border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer shadow-xl"
                        onClick={() => setIsTerminalOpen(true)}
                      >
                        <div className="w-full flex justify-between items-center">
                          <div className="space-y-1">
                            <p className="text-xs text-neutral-400 dark:text-neutral-500 uppercase tracking-widest transition-colors mb-1">Interactive Agent Terminal</p>
                            <p className="text-lg font-medium flex items-center gap-2 text-neutral-900 dark:text-white transition-colors">Ask Gemini Anything</p>
                          </div>
                          <div className="h-12 w-12 rounded-full border border-neutral-300 dark:border-neutral-700 flex items-center justify-center group-hover:bg-neutral-100 dark:group-hover:bg-neutral-850 transition-colors group-hover:translate-x-1">—&gt;</div>
                        </div>
                      </motion.div>
                      <motion.div 
                        whileHover={{ scale: 1.02, y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        className="w-full bg-white dark:bg-neutral-900/90 text-neutral-900 dark:text-white p-8 rounded-2xl flex justify-between items-center group border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer shadow-xl"
                        onClick={() => setCurrentView('contact')}
                      >
                        <div className="w-full flex justify-between items-center">
                          <div className="space-y-1">
                            <p className="text-xs text-neutral-400 dark:text-neutral-500 uppercase tracking-widest transition-colors mb-1">Contact Me</p>
                            <p className="text-lg font-medium flex items-center gap-2 text-neutral-900 dark:text-white transition-colors">andyk4548@gmail.com</p>
                          </div>
                          <div className="h-12 w-12 rounded-full border border-neutral-300 dark:border-neutral-700 flex items-center justify-center group-hover:bg-neutral-100 dark:group-hover:bg-neutral-855 transition-colors group-hover:translate-x-1">—&gt;</div>
                        </div>
                      </motion.div>
                      <div className="flex flex-wrap justify-center lg:justify-end gap-4 md:gap-6 text-sm font-medium tracking-widest uppercase text-neutral-500 dark:text-neutral-400 px-2 mt-4 transition-colors">
                        <motion.a 
                          href="https://github.com/MD-NAVED" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          whileHover={{ scale: 1.05, x: 2 }}
                          whileTap={{ scale: 0.95 }}
                          className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors flex items-center gap-2 cursor-pointer"
                        >
                          GitHub <span className="text-xs">—&gt;</span>
                        </motion.a>
                        <motion.a 
                          href="https://www.linkedin.com/in/md-naved-2b79b8382" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          whileHover={{ scale: 1.05, x: 2 }}
                          whileTap={{ scale: 0.95 }}
                          className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors flex items-center gap-2 cursor-pointer"
                        >
                          LinkedIn <span className="text-xs">—&gt;</span>
                        </motion.a>
                        <motion.a 
                          href="https://www.naukri.com/mnjuser/profile" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          whileHover={{ scale: 1.05, x: 2 }}
                          whileTap={{ scale: 0.95 }}
                          className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors flex items-center gap-2 cursor-pointer"
                        >
                          Naukri <span className="text-xs">—&gt;</span>
                        </motion.a>
                        <motion.a 
                          href="https://www.foundit.in/seeker/profile" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          whileHover={{ scale: 1.05, x: 2 }}
                          whileTap={{ scale: 0.95 }}
                          className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors flex items-center gap-2 cursor-pointer"
                        >
                          Foundit <span className="text-xs">—&gt;</span>
                        </motion.a>
                      </div>
                    </div>
                 </section>

                 <section className="border-t border-neutral-200 dark:border-neutral-800 pt-16 md:pt-24 transition-colors">
                     <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-8 transition-colors flex items-center gap-2">
                       <Brain className="w-4 h-4" />
                       Core Expertise
                     </h3>
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <motion.div 
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-80px" }}
                          transition={{ duration: 0.6, delay: 0, ease: [0.16, 1, 0.3, 1] }}
                          whileHover={{ 
                            y: -8, 
                            scale: 1.015,
                            boxShadow: "0 20px 40px -15px rgba(99, 102, 241, 0.12)"
                          }}
                          whileTap={{ scale: 0.985 }}
                          className="p-8 rounded-3xl bg-white/40 dark:bg-[#111111]/40 backdrop-blur-md border border-white/60 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:border-indigo-500/30 dark:hover:border-indigo-500/20 transition-all duration-300 group overflow-hidden relative cursor-pointer"
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-blue-500/5 dark:from-indigo-500/5 dark:via-transparent dark:to-blue-500/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                          <Sparkles className="relative z-10 w-8 h-8 text-neutral-700 dark:text-neutral-300 mb-6 transition-colors group-hover:text-black dark:group-hover:text-white" />
                          <h4 className="relative z-10 text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-3 transition-colors">Prompt Engineering & Design</h4>
                          <p className="relative z-10 text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed transition-colors">System prompts, few-shot examples, chain-of-thought structuring, and output formatting control.</p>
                        </motion.div>
                        <motion.div 
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-80px" }}
                          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                          whileHover={{ 
                            y: -8, 
                            scale: 1.015,
                            boxShadow: "0 20px 40px -15px rgba(99, 102, 241, 0.12)"
                          }}
                          whileTap={{ scale: 0.985 }}
                          className="p-8 rounded-3xl bg-white/40 dark:bg-[#111111]/40 backdrop-blur-md border border-white/60 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:border-indigo-500/30 dark:hover:border-indigo-500/20 transition-all duration-300 group overflow-hidden relative cursor-pointer"
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-blue-500/5 dark:from-indigo-500/5 dark:via-transparent dark:to-blue-500/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                          <Workflow className="relative z-10 w-8 h-8 text-neutral-700 dark:text-neutral-300 mb-6 transition-colors group-hover:text-black dark:group-hover:text-white" />
                          <h4 className="relative z-10 text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-3 transition-colors">LLM Application Architecture</h4>
                          <p className="relative z-10 text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed transition-colors">Integrating Gemini API into multi-step, robust production-style workflows.</p>
                        </motion.div>
                        <motion.div 
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-80px" }}
                          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                          whileHover={{ 
                            y: -8, 
                            scale: 1.015,
                            boxShadow: "0 20px 40px -15px rgba(99, 102, 241, 0.12)"
                          }}
                          whileTap={{ scale: 0.985 }}
                          className="p-8 rounded-3xl bg-white/40 dark:bg-[#111111]/40 backdrop-blur-md border border-white/60 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:border-indigo-500/30 dark:hover:border-indigo-500/20 transition-all duration-300 group overflow-hidden relative cursor-pointer"
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-blue-500/5 dark:from-indigo-500/5 dark:via-transparent dark:to-blue-500/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                          <Cpu className="relative z-10 w-8 h-8 text-neutral-700 dark:text-neutral-300 mb-6 transition-colors group-hover:text-black dark:group-hover:text-white" />
                          <h4 className="relative z-10 text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-3 transition-colors">AI Agent Workflows</h4>
                          <p className="relative z-10 text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed transition-colors">Building agent pipelines; expanding into LangChain and n8n for autonomous, multi-tool agents.</p>
                        </motion.div>
                        <motion.div 
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-80px" }}
                          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                          whileHover={{ 
                            y: -8, 
                            scale: 1.015,
                            boxShadow: "0 20px 40px -15px rgba(99, 102, 241, 0.12)"
                          }}
                          whileTap={{ scale: 0.985 }}
                          className="p-8 rounded-3xl bg-white/40 dark:bg-[#111111]/40 backdrop-blur-md border border-white/60 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:border-indigo-500/30 dark:hover:border-indigo-500/20 transition-all duration-300 group overflow-hidden relative cursor-pointer"
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-blue-500/5 dark:from-indigo-500/5 dark:via-transparent dark:to-blue-500/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                          <Code2 className="relative z-10 w-8 h-8 text-neutral-700 dark:text-neutral-300 mb-6 transition-colors group-hover:text-black dark:group-hover:text-white" />
                          <h4 className="relative z-10 text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-3 transition-colors">AI-Assisted Development</h4>
                          <p className="relative z-10 text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed transition-colors">Directing AI coding tools ("vibe-coding") to design, build, and ship full-stack products.</p>
                        </motion.div>
                        <motion.div 
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-80px" }}
                          transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                          whileHover={{ 
                            y: -8, 
                            scale: 1.015,
                            boxShadow: "0 20px 40px -15px rgba(99, 102, 241, 0.12)"
                          }}
                          whileTap={{ scale: 0.985 }}
                          className="p-8 rounded-3xl bg-white/40 dark:bg-[#111111]/40 backdrop-blur-md border border-white/60 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:border-indigo-500/30 dark:hover:border-indigo-500/20 transition-all duration-300 group overflow-hidden relative cursor-pointer"
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-blue-500/5 dark:from-indigo-500/5 dark:via-transparent dark:to-blue-500/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                          <Terminal className="relative z-10 w-8 h-8 text-neutral-700 dark:text-neutral-300 mb-6 transition-colors group-hover:text-black dark:group-hover:text-white" />
                          <h4 className="relative z-10 text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-3 transition-colors">Prompt Debugging & Eval</h4>
                          <p className="relative z-10 text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed transition-colors">Iterating on prompt failures, hallucination control, and output consistency across edge cases.</p>
                        </motion.div>
                     </div>
                  </section>

               </motion.div>
             )}


             {/* PROJECTS VIEW */}
             {currentView === 'projects' && (
               <motion.div key="projects" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-12">
                 
                 <div className="border-b border-neutral-200 dark:border-neutral-800 pb-8 rounded-t-lg">
                   <h2 className="text-3xl md:text-5xl font-medium tracking-tighter text-neutral-900 dark:text-neutral-100 transition-colors">Projects</h2>
                   <p className="text-neutral-500 dark:text-neutral-400 mt-4 max-w-2xl font-light leading-relaxed">A selection of my recent works highlighting prompt engineering, agentic workflows, and AI product integrations.</p>
                 </div>
                 
                 <div className="space-y-10">
                   {projectsData.map((project, idx) => (
                      <motion.div 
                        key={project.id}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.7, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
                        whileHover={{ 
                          y: -8, 
                          scale: 1.01,
                          boxShadow: "0 25px 50px -15px rgba(99, 102, 241, 0.15)"
                        }}
                        whileTap={{ scale: 0.99 }}
                        className="group cursor-pointer p-8 md:p-12 rounded-3xl bg-white/40 dark:bg-[#111111]/40 backdrop-blur-md border border-white/60 dark:border-white/5 hover:border-indigo-500/30 dark:hover:border-indigo-500/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] transition-all duration-300 relative overflow-hidden"
                        onClick={() => setSelectedProject(project)}
                      >
                         <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-blue-500/5 dark:from-indigo-500/5 dark:via-transparent dark:to-blue-500/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                         <div className="flex flex-wrap items-start justify-between gap-4 mb-4 relative z-10">
                           <h3 className="text-2xl md:text-3xl font-medium text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-500 transition-colors flex items-center gap-3">
                             {project.title}
                             <ArrowUpRight className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity" />
                           </h3>
                           {project.domain && <span className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest flex-shrink-0 transition-colors mt-2">{project.domain}</span>}
                         </div>
                         <div className="flex flex-wrap gap-2 mb-8 relative z-10">
                           {project.tags.map(tag => (
                             <span key={tag} className="border border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-black/20 px-3 py-1 rounded-full text-xs font-medium text-neutral-500 dark:text-neutral-400 transition-colors">{tag}</span>
                           ))}
                         </div>
                         <ul className="space-y-4 text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed max-w-3xl transition-colors relative z-10">
                           {project.summary.map((point, i) => (
                             <li key={i} className="flex items-start gap-3">
                               <span className="text-neutral-300 dark:text-neutral-700 mt-0.5 transition-colors">—</span>
                               <p>{point}</p>
                             </li>
                           ))}
                         </ul>
                         
                         <div className="mt-10 relative z-10 flex gap-6 items-center">
                            <motion.button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedProject(project);
                              }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-900 dark:text-neutral-100 border-b border-transparent hover:border-neutral-900 dark:hover:border-neutral-100 transition-colors pb-1 focus:outline-none cursor-pointer"
                            >
                              View Details
                            </motion.button>
                            {project.liveLink && (
                              <motion.a 
                                href={project.liveLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-neutral-900 dark:text-neutral-100 border-b border-transparent hover:border-neutral-900 dark:hover:border-neutral-100 transition-colors pb-1 cursor-pointer"
                              >
                                Live Project <ArrowUpRight className="w-3.5 h-3.5" />
                              </motion.a>
                            )}
                         </div>
                      </motion.div>
                   ))}
                 </div>

               </motion.div>
             )}


             {/* EXPERIENCE VIEW */}
             {currentView === 'experience' && (
               <motion.div key="experience" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-16">
                 <div className="border-b border-neutral-200 dark:border-neutral-800 pb-8">
                   <h2 className="text-3xl md:text-5xl font-medium tracking-tighter text-neutral-900 dark:text-neutral-100 transition-colors">Experience & Background</h2>
                   <p className="text-neutral-500 dark:text-neutral-400 mt-4 max-w-2xl font-light leading-relaxed">A detailed look into my professional journey, core competencies, and the value I deliver to teams.</p>
                 </div>

                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 transition-colors">
                     
                     {/* Left Column: Skills */}
                     <motion.div
                       initial={{ opacity: 0, x: -30 }}
                       whileInView={{ opacity: 1, x: 0 }}
                       viewport={{ once: true, margin: "-100px" }}
                       transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                     >
                       <div className="flex items-center gap-2 mb-6 border-b border-neutral-200/50 dark:border-neutral-800/50 pb-4">
                         <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 transition-colors">Skills & Competencies</h2>
                       </div>
                       
                       <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-6 transition-colors">Technical Skills</h3>
                       <div className="grid grid-cols-3 gap-4 mb-12">
                         {techSkillsData.map((skill, idx) => (
                           <div key={idx} className="relative group flex flex-col items-center justify-center">
                             <motion.div
                               whileHover={{ scale: 1.05, y: -2 }}
                               whileTap={{ scale: 0.98 }}
                               className="w-full p-4 rounded-2xl bg-white dark:bg-[#111111] backdrop-blur-sm border border-neutral-200 dark:border-neutral-800 flex flex-col items-center justify-center text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgb(0,0,0,0.1)] transition-all cursor-pointer z-10"
                             >
                               <div className="mb-2 text-neutral-700 dark:text-neutral-300">
                                 {skill.icon}
                               </div>
                               <span className="text-[10px] font-semibold tracking-wider uppercase text-neutral-500 dark:text-neutral-400 text-center">{skill.name}</span>
                             </motion.div>
                           </div>
                         ))}
                       </div>

                       <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-6 transition-colors">Core Competencies</h3>
                       <div className="flex flex-wrap gap-2">
                         <motion.span 
                           whileHover={{ scale: 1.05, backgroundColor: isDarkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)", borderColor: isDarkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)" }}
                           whileTap={{ scale: 0.95 }}
                           transition={{ type: "spring", stiffness: 400, damping: 15 }}
                           className="border border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 px-3 py-1 text-xs font-medium rounded-full transition-colors bg-white/30 dark:bg-[#111111]/30 cursor-default"
                         >
                           Prompt Design
                         </motion.span>
                         <motion.span 
                           whileHover={{ scale: 1.05, backgroundColor: isDarkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)", borderColor: isDarkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)" }}
                           whileTap={{ scale: 0.95 }}
                           transition={{ type: "spring", stiffness: 400, damping: 15 }}
                           className="border border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 px-3 py-1 text-xs font-medium rounded-full transition-colors bg-white/30 dark:bg-[#111111]/30 cursor-default"
                         >
                           Agentic Workflows
                         </motion.span>
                         <motion.span 
                           whileHover={{ scale: 1.05, backgroundColor: isDarkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)", borderColor: isDarkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)" }}
                           whileTap={{ scale: 0.95 }}
                           transition={{ type: "spring", stiffness: 400, damping: 15 }}
                           className="border border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 px-3 py-1 text-xs font-medium rounded-full transition-colors bg-white/30 dark:bg-[#111111]/30 cursor-default"
                         >
                           LLM Orchestration
                         </motion.span>
                         <motion.span 
                           whileHover={{ scale: 1.05, backgroundColor: isDarkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)", borderColor: isDarkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)" }}
                           whileTap={{ scale: 0.95 }}
                           transition={{ type: "spring", stiffness: 400, damping: 15 }}
                           className="border border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 px-3 py-1 text-xs font-medium rounded-full transition-colors bg-white/30 dark:bg-[#111111]/30 cursor-default"
                         >
                           Few-Shot Prompting
                         </motion.span>
                         <motion.span 
                           whileHover={{ scale: 1.05, backgroundColor: isDarkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)", borderColor: isDarkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)" }}
                           whileTap={{ scale: 0.95 }}
                           transition={{ type: "spring", stiffness: 400, damping: 15 }}
                           className="border border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 px-3 py-1 text-xs font-medium rounded-full transition-colors bg-white/30 dark:bg-[#111111]/30 cursor-default"
                         >
                           Schema Enforcement
                         </motion.span>
                         <motion.span 
                           whileHover={{ scale: 1.05, backgroundColor: isDarkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)", borderColor: isDarkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)" }}
                           whileTap={{ scale: 0.95 }}
                           transition={{ type: "spring", stiffness: 400, damping: 15 }}
                           className="border border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 px-3 py-1 text-xs font-medium rounded-full transition-colors bg-white/30 dark:bg-[#111111]/30 cursor-default"
                         >
                           Instruction Debugging
                         </motion.span>
                       </div>
                     </motion.div>

                     {/* Right Column: Certifications & Languages */}
                     <motion.div
                       initial={{ opacity: 0, x: 30 }}
                       whileInView={{ opacity: 1, x: 0 }}
                       viewport={{ once: true, margin: "-100px" }}
                       transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                       className="space-y-12"
                     >
                       <div>
                         <div className="flex items-center gap-2 mb-6 border-b border-neutral-200/50 dark:border-neutral-800/50 pb-4">
                           <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 transition-colors">Certifications & Languages</h2>
                         </div>
                       </div>

                       <div>
                         <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-6 transition-colors">Certifications & Learning</h3>
                         <div className="space-y-4 text-sm text-neutral-600 dark:text-neutral-300 transition-colors bg-white/40 dark:bg-[#111111]/40 p-6 rounded-2xl border border-white/60 dark:border-white/5 backdrop-blur-sm">
                           <div className="border-b border-neutral-200/50 dark:border-neutral-800/50 pb-3">
                              <p className="font-medium text-neutral-900 dark:text-neutral-100">Python for Data Analysis & Visualization</p> 
                              <span className="text-neutral-400 dark:text-neutral-500 text-xs font-bold uppercase tracking-widest mt-1 block">Self-directed</span>
                           </div>
                           <div className="border-b border-neutral-200/50 dark:border-neutral-800/50 pb-3 pt-1">
                              <p className="font-medium text-neutral-900 dark:text-neutral-100">Generative AI with Gemini</p> 
                              <span className="text-neutral-400 dark:text-neutral-500 text-xs font-bold uppercase tracking-widest mt-1 block">Prompt Engineering</span>
                           </div>
                           <div className="border-b border-neutral-200/50 dark:border-neutral-800/50 pb-3 pt-1">
                              <p className="font-medium text-neutral-900 dark:text-neutral-100">SQL for Data Analytics</p> 
                              <span className="text-neutral-400 dark:text-neutral-500 text-xs font-bold uppercase tracking-widest mt-1 block">Relational Database Workflows</span>
                           </div>
                           <div className="pt-1">
                              <p className="font-medium text-neutral-900 dark:text-neutral-100">Power BI</p> 
                              <span className="text-neutral-400 dark:text-neutral-500 text-xs font-bold uppercase tracking-widest mt-1 block">Interactive Dashboard Design & Reporting</span>
                           </div>
                         </div>
                       </div>

                       <div>
                         <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-6 transition-colors">Languages</h3>
                         <div className="space-y-4 text-sm text-neutral-600 dark:text-neutral-300 transition-colors bg-white/40 dark:bg-[#111111]/40 p-6 rounded-2xl border border-white/60 dark:border-white/5 backdrop-blur-sm">
                           <div className="flex justify-between items-center border-b border-neutral-200/50 dark:border-neutral-800/50 pb-3">
                              <p className="font-medium">English</p> 
                              <span className="text-neutral-400 dark:text-neutral-500 text-xs font-bold uppercase tracking-widest">Professional</span>
                           </div>
                           <div className="flex justify-between items-center pt-1">
                               <p className="font-medium">Hindi</p> 
                               <span className="text-neutral-400 dark:text-neutral-500 text-xs font-bold uppercase tracking-widest">Native/Bilingual</span>
                           </div>
                         </div>
                       </div>
                     </motion.div>
                  </div>
                </motion.div>
             )}


             {/* CONTACT VIEW */}
             {currentView === 'contact' && (
               <motion.div key="contact" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-12">
                 
                 <div className="border-b border-neutral-200 dark:border-neutral-800 pb-8">
                   <h2 className="text-3xl md:text-5xl font-medium tracking-tighter text-neutral-900 dark:text-neutral-100 transition-colors">Get in Touch</h2>
                   <p className="text-neutral-500 dark:text-neutral-400 mt-4 max-w-2xl font-light leading-relaxed">Let's discuss how my prompt engineering, agentic workflows, and AI integration skills can add value to your team.</p>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 pt-8">
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                      className="md:col-span-4 space-y-8"
                    >
                      <div>
                        <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-6 transition-colors">Contact Details</h2>
                        <div className="space-y-6">
                          <a href="mailto:andyk4548@gmail.com" className="group flex items-start gap-4 hover:opacity-80 transition-opacity">
                             <div className="mt-1"><Mail className="w-5 h-5 text-neutral-400" /></div>
                             <div>
                                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Email Address</p>
                                <p className="text-sm text-neutral-500 mt-1 font-light">andyk4548@gmail.com</p>
                             </div>
                          </a>
                          <a href="tel:+919753880839" className="group flex items-start gap-4 hover:opacity-80 transition-opacity">
                             <div className="mt-1"><Phone className="w-5 h-5 text-neutral-400" /></div>
                             <div>
                                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Phone</p>
                                <p className="text-sm text-neutral-500 mt-1 font-light">+91 9753880839</p>
                             </div>
                          </a>
                          <a 
                            href="https://www.google.com/maps/search/?api=1&query=Indore,+Madhya+Pradesh" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="group flex items-start gap-4 hover:opacity-80 transition-opacity"
                          >
                             <div className="mt-1"><MapPin className="w-5 h-5 text-neutral-400" /></div>
                             <div>
                                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Location</p>
                                <p className="text-sm text-neutral-500 mt-1 font-light">Indore, Madhya Pradesh</p>
                             </div>
                          </a>
                        </div>
                      </div>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                      className="md:col-span-8"
                    >
                      <div className="w-full max-w-2xl bg-white/40 dark:bg-[#111111]/40 backdrop-blur-md p-8 md:p-12 rounded-3xl border border-white/60 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)]">
                        <form className="space-y-10" onSubmit={handleContactSubmit}>
                          <div>
                            <label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2 block">Name</label>
                            <motion.input 
                              whileFocus={{ backgroundColor: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)', paddingLeft: '16px' }}
                              transition={{ duration: 0.3, ease: 'easeOut' }}
                              type="text" 
                              id="name" 
                              required
                              value={contactName}
                              onChange={(e) => setContactName(e.target.value)}
                              placeholder="Your Name" 
                              className="w-full bg-transparent border-b border-neutral-300 dark:border-neutral-700 py-3 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-400 transition-colors"
                            />
                          </div>
                          <div>
                            <label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2 block">Email</label>
                            <motion.input 
                              whileFocus={{ backgroundColor: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)', paddingLeft: '16px' }}
                              transition={{ duration: 0.3, ease: 'easeOut' }}
                              type="email" 
                              id="email" 
                              required
                              value={contactEmail}
                              onChange={(e) => setContactEmail(e.target.value)}
                              placeholder="Email Address" 
                              className="w-full bg-transparent border-b border-neutral-300 dark:border-neutral-700 py-3 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-400 transition-colors"
                            />
                          </div>
                          <div>
                            <label htmlFor="message" className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2 block">Message</label>
                            <motion.textarea 
                              whileFocus={{ backgroundColor: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)', paddingLeft: '16px' }}
                              transition={{ duration: 0.3, ease: 'easeOut' }}
                              id="message" 
                              rows={4} 
                              required
                              value={contactMessage}
                              onChange={(e) => setContactMessage(e.target.value)}
                              placeholder="Tell me about your project or opportunity..." 
                              className="w-full bg-transparent border-b border-neutral-300 dark:border-neutral-700 py-3 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-400 transition-colors resize-none"
                            />
                          </div>
                          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4">
                            <motion.button 
                              whileHover={{ scale: formStatus === 'idle' ? 1.02 : 1 }}
                              whileTap={{ scale: formStatus === 'idle' ? 0.98 : 1 }}
                              animate={{ 
                                backgroundColor: formStatus === 'success' ? '#22c55e' : (formStatus === 'error' ? '#ef4444' : (isDarkMode ? '#F5F5F5' : '#171717')),
                                color: (formStatus === 'success' || formStatus === 'error') ? '#FFFFFF' : (isDarkMode ? '#171717' : '#FFFFFF')
                              }}
                              transition={{ duration: 0.3 }}
                              type="submit" 
                              disabled={formStatus !== 'idle'}
                              className={`px-8 py-4 text-sm font-bold w-full sm:w-auto rounded-full uppercase tracking-widest flex justify-center items-center shadow-lg ${formStatus === 'submitting' ? 'opacity-80 cursor-wait' : ''}`}
                            >
                              {formStatus === 'idle' && 'Send Message'}
                              {formStatus === 'submitting' && (
                                <motion.div 
                                  animate={{ rotate: 360 }} 
                                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                                  className={`w-4 h-4 border-2 border-t-transparent rounded-full ${isDarkMode ? 'border-neutral-900' : 'border-white'}`}
                                />
                              )}
                              {formStatus === 'success' && 'Message Sent'}
                              {formStatus === 'error' && 'Error Sending'}
                            </motion.button>
                          </div>
                        </form>
                      </div>
                    </motion.div>
                 </div>
               </motion.div>
             )}


           </AnimatePresence>
        </main>

        <footer className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-20 w-full mt-auto pt-8 border-t border-neutral-200/50 dark:border-neutral-800/50 flex flex-col lg:flex-row justify-between items-center lg:items-end gap-6 text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 pb-12 transition-colors relative z-10 text-center lg:text-left">
          <div>
            <span>&copy; {new Date().getFullYear()} Mohammad Naved. All rights reserved.</span>
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-3">
            <motion.a 
              href="https://www.linkedin.com/in/md-naved-2b79b8382" 
              target="_blank" 
              rel="noopener noreferrer" 
              whileHover={{ scale: 1.08, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="hover:text-neutral-900 dark:hover:text-neutral-100 cursor-pointer inline-block"
            >
              LinkedIn
            </motion.a>
            <motion.a 
              href="https://github.com/MD-NAVED" 
              target="_blank" 
              rel="noopener noreferrer" 
              whileHover={{ scale: 1.08, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="hover:text-neutral-900 dark:hover:text-neutral-100 cursor-pointer inline-block"
            >
              GitHub
            </motion.a>
            <motion.a 
              href="https://www.naukri.com/mnjuser/profile" 
              target="_blank" 
              rel="noopener noreferrer" 
              whileHover={{ scale: 1.08, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="hover:text-neutral-900 dark:hover:text-neutral-100 cursor-pointer inline-block"
            >
              Naukri
            </motion.a>
            <motion.a 
              href="https://www.foundit.in/seeker/profile" 
              target="_blank" 
              rel="noopener noreferrer" 
              whileHover={{ scale: 1.08, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="hover:text-neutral-900 dark:hover:text-neutral-100 cursor-pointer inline-block"
            >
              Foundit
            </motion.a>
            <motion.a 
              href="mailto:andyk4548@gmail.com" 
              whileHover={{ scale: 1.08, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="hover:text-neutral-900 dark:hover:text-neutral-100 cursor-pointer inline-block"
            >
              Email
            </motion.a>
          </div>
        </footer>

        {/* Project Case Study Modal */}
        <AnimatePresence>
          {selectedProject && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 md:p-12">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => setSelectedProject(null)}
                className="absolute inset-0 bg-neutral-900/40 dark:bg-black/70 backdrop-blur-md"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative w-full max-w-4xl max-h-full overflow-y-auto bg-white dark:bg-[#0f0f0f] border border-neutral-200/50 dark:border-neutral-800/50 rounded-[2rem] shadow-2xl z-10 custom-scrollbar"
              >
                <div className="p-8 md:p-14 lg:p-20">
                  <motion.button 
                    onClick={() => setSelectedProject(null)}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className="absolute top-6 right-6 md:top-8 md:right-8 p-3 rounded-full bg-neutral-100 dark:bg-[#1a1a1a] text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors cursor-pointer"
                    aria-label="Close modal"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                  
                  <div className="mb-12 md:mb-16">
                    {selectedProject.domain && <span className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-4 block transition-colors">{selectedProject.domain}</span>}
                    <h3 className="text-3xl md:text-5xl font-medium tracking-tighter text-neutral-900 dark:text-neutral-100 transition-colors mb-6">{selectedProject.title}</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.tags.map(tag => (
                        <span key={tag} className="border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#1a1a1a] px-4 py-1.5 rounded-full text-xs font-medium text-neutral-600 dark:text-neutral-300 transition-colors">{tag}</span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-16">
                    <section>
                      <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-900 dark:text-neutral-100 mb-6 transition-colors">Key Contributions</h4>
                      <ul className="space-y-6 pl-0 md:pl-6 border-l-0 md:border-l-2 border-neutral-200 dark:border-neutral-800 text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed font-light transition-colors">
                        {selectedProject.summary.map((point, i) => (
                          <li key={i} className="flex items-start gap-4">
                            <span className="text-neutral-300 dark:text-neutral-700 mt-1">&mdash;</span>
                            <p>{point}</p>
                          </li>
                        ))}
                      </ul>
                    </section>
                  </div>
                  
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Interactive Terminal Modal */}
        <AnimatePresence>
          {isTerminalOpen && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 md:p-12">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => setIsTerminalOpen(false)}
                className="absolute inset-0 bg-neutral-900/40 dark:bg-black/70 backdrop-blur-md"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative w-full max-w-lg z-10"
              >
                {/* Floating Close Button */}
                <motion.button 
                  onClick={() => setIsTerminalOpen(false)}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  className="absolute -top-14 right-2 p-3 rounded-full bg-[#121212] text-neutral-400 hover:text-white transition-colors cursor-pointer border border-neutral-800 shadow-md flex items-center justify-center"
                  aria-label="Close terminal"
                >
                  <X className="w-4 h-4" />
                </motion.button>

                <PromptTerminal setCurrentView={(view) => {
                  setCurrentView(view);
                  setIsTerminalOpen(false);
                }} />
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Desktop Navigation Arrows */}
        {viewsList.indexOf(currentView) > 0 && !isTerminalOpen && !selectedProject && !isMobileMenuOpen && (
          <div className="fixed left-4 top-1/2 -translate-y-1/2 z-40 hidden lg:block">
            <motion.button
              onClick={() => {
                const prevIndex = viewsList.indexOf(currentView) - 1;
                setCurrentView(viewsList[prevIndex]);
              }}
              whileHover={{ scale: 1.1, x: -3 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="w-12 h-12 rounded-full bg-white/20 dark:bg-black/40 border border-neutral-200/50 dark:border-neutral-800/80 backdrop-blur-md flex items-center justify-center text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-all shadow-lg hover:shadow-xl cursor-pointer"
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>
          </div>
        )}

        {viewsList.indexOf(currentView) < viewsList.length - 1 && !isTerminalOpen && !selectedProject && !isMobileMenuOpen && (
          <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden lg:block">
            <motion.button
              onClick={() => {
                const nextIndex = viewsList.indexOf(currentView) + 1;
                setCurrentView(viewsList[nextIndex]);
              }}
              whileHover={{ scale: 1.1, x: 3 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="w-12 h-12 rounded-full bg-white/20 dark:bg-black/40 border border-neutral-200/50 dark:border-neutral-800/80 backdrop-blur-md flex items-center justify-center text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-all shadow-lg hover:shadow-xl cursor-pointer"
              aria-label="Next Page"
            >
              <ChevronRight className="w-6 h-6" />
            </motion.button>
          </div>
        )}

      </div>
    </div>
  );
}
