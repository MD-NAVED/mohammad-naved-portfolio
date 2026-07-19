import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Analytics } from '@vercel/analytics/react';
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
    title: "4Layers — Smart Home IoT Solution",
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


interface PromptTerminalProps {
  currentView: 'home' | 'projects' | 'experience' | 'contact';
  setCurrentView: (view: 'home' | 'projects' | 'experience' | 'contact') => void;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
  sendEmail: (name: string, email: string, message: string) => Promise<boolean>;
}

function PromptTerminal({ currentView, setCurrentView, isDarkMode, setIsDarkMode, sendEmail }: PromptTerminalProps) {
  const [messages, setMessages] = useState<{
    id: string;
    sender: 'user' | 'agent';
    text: string;
    toolLog?: string;
  }[]>([
    {
      id: 'welcome',
      sender: 'agent',
      text: "Hello! I am Naved's AI assistant. Ask me anything about his projects, skills, or request to download his CV! I can also interact with this website for you."
    }
  ]);
  
  const [customInput, setCustomInput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'model', text: string}[]>([]);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isRunning]);

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim() || isRunning) return;

    const queryText = customInput.trim();
    setCustomInput('');
    setIsRunning(true);
    
    // Add user message to chat list
    const userMsgId = Math.random().toString();
    setMessages(prev => [...prev, { id: userMsgId, sender: 'user', text: queryText }]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: queryText,
          history: chatHistory,
          currentView: currentView
        })
      });

      if (!response.ok) {
        throw new Error('API Error');
      }

      const data = await response.json();
      let finalResponseText = data.text;
      let toolLog = '';

      if (data.toolCall) {
        const { name, args } = data.toolCall;
        
        if (name === 'download_resume') {
          toolLog = "📄 Downloading Naved's Resume...";
          const link = document.createElement('a');
          link.href = '/Mohammad_Naved_Resume.pdf';
          link.download = 'Mohammad_Naved_Resume.pdf';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          finalResponseText = "I have initiated the CV download in your browser window. Let me know if you need help with anything else!";
        } 
        else if (name === 'toggle_theme') {
          const mode = args.mode || (isDarkMode ? 'light' : 'dark');
          toolLog = `🎨 Switching website theme to ${mode} mode...`;
          setIsDarkMode(mode === 'dark');
          finalResponseText = `Switched theme to ${mode} mode successfully.`;
        } 
        else if (name === 'navigate_site') {
          const section = args.section;
          toolLog = `🌐 Navigating view to ${section.toUpperCase()}...`;
          setCurrentView(section);
          finalResponseText = `Navigating you directly to my ${section} page.`;
        } 
        else if (name === 'send_email') {
          toolLog = "✉️ Sending email handshake...";
          const success = await sendEmail(args.name, args.email, args.message);
          if (success) {
            finalResponseText = `Thanks ${args.name}! I have securely transmitted your message directly to Naved's inbox. He will reply back to your email: ${args.email}.`;
          } else {
            finalResponseText = "I encountered an error trying to deliver the email message. You can reach Naved directly at andyk4548@gmail.com.";
          }
        }
      }

      // Add to conversation history
      setChatHistory(prev => [
        ...prev,
        { role: 'user', text: queryText },
        { role: 'model', text: finalResponseText }
      ]);

      // Split the response by double newlines or paragraph blocks to send separately
      const paragraphs = finalResponseText.split(/\n\n+/).map(p => p.trim()).filter(p => p.length > 0);

      // Sequentially print paragraphs with delay to simulate real chatting
      for (let i = 0; i < paragraphs.length; i++) {
        // Show typing indicator
        setIsRunning(true);
        
        // Calculate typing delay based on paragraph length (min 600ms, max 1800ms)
        const delay = Math.max(600, Math.min(1800, paragraphs[i].length * 12));
        await new Promise(resolve => setTimeout(resolve, delay));
        
        const agentMsgId = Math.random().toString();
        setMessages(prev => [
          ...prev,
          { 
            id: agentMsgId, 
            sender: 'agent', 
            text: paragraphs[i], 
            // Include toolLog only on the first bubble of the response
            toolLog: i === 0 ? toolLog : undefined 
          }
        ]);
      }

    } catch (error) {
      console.error(error);
      const agentMsgId = Math.random().toString();
      setMessages(prev => [
        ...prev, 
        { 
          id: agentMsgId, 
          sender: 'agent', 
          text: "I encountered a connection error. Please make sure your serverless functions are configured correctly or try again later." 
        }
      ]);
    } finally {
      setIsRunning(false);
    }
  };

  const parseMarkdown = (text: string) => {
    const parts = text.split(/\*\*([^*]+)\*\*/g);
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return <strong key={index} className="font-extrabold text-neutral-950 dark:text-white">{part}</strong>;
      }
      return part;
    });
  };

  const handleQuickAction = (text: string) => {
    if (isRunning) return;
    setCustomInput(text);
    // Submit programmatically in next microtask
    setTimeout(() => {
      const form = document.getElementById('chat-form');
      if (form) {
        form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      }
    }, 50);
  };

  return (
    <div className="relative w-full max-w-lg group">
      {/* Dynamic ambient glow behind the chat container */}
      <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 opacity-20 blur-md group-hover:opacity-30 transition duration-500"></div>
      
      <div className="relative w-full bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-xl rounded-3xl border border-neutral-200/80 dark:border-neutral-800/80 text-neutral-800 dark:text-neutral-300 font-sans overflow-hidden shadow-2xl flex flex-col h-[480px] text-left">
        {/* Window Titlebar */}
        <div className="bg-neutral-50 dark:bg-[#121212]/90 backdrop-blur-md px-5 py-4 flex items-center justify-between border-b border-neutral-200/60 dark:border-neutral-900/60 select-none">
          <div className="flex items-center space-x-2">
            <div className="w-3.5 h-3.5 rounded-full bg-[#ff5f56] shadow-[0_0_8px_rgba(255,95,86,0.2)]"></div>
            <div className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] shadow-[0_0_8px_rgba(255,189,46,0.2)]"></div>
            <div className="w-3.5 h-3.5 rounded-full bg-[#27c93f] shadow-[0_0_8px_rgba(39,201,63,0.2)]"></div>
          </div>
          <div className="text-[10px] uppercase font-bold tracking-widest text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#27c93f] animate-pulse"></span>
            Naved's AI Agent
          </div>
          <div className="w-12"></div>
        </div>

        {/* Chat Message Window */}
        <div className="flex-grow p-5 overflow-y-auto space-y-4 bg-transparent custom-scrollbar flex flex-col">
          {messages.map((msg) => (
            <div key={msg.id} className="flex flex-col">
              {/* Tool Execution Logs */}
              {msg.toolLog && (
                <div className="flex justify-center my-2">
                  <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono font-bold py-1 px-3 rounded-full flex items-center gap-1.5 shadow-sm">
                    {msg.toolLog}
                  </span>
                </div>
              )}
              
              <div className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} items-start gap-2.5`}>
                {msg.sender === 'agent' && (
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-md flex-shrink-0">
                    <Brain className="w-4 h-4 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 rounded-tr-none font-medium'
                      : 'bg-neutral-100 dark:bg-[#161616] text-neutral-800 dark:text-neutral-200 rounded-tl-none border border-neutral-200/30 dark:border-neutral-800/30'
                  }`}
                >
                  {parseMarkdown(msg.text)}
                </div>
              </div>
            </div>
          ))}

          {/* Thinking bubble */}
          {isRunning && (
            <div className="flex justify-start items-start gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-md flex-shrink-0">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <div className="bg-neutral-100 dark:bg-[#161616] rounded-2xl rounded-tl-none px-4 py-3 text-[13px] border border-neutral-200/30 dark:border-neutral-800/30 flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-500 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-500 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-500 animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Footer Area */}
        <div className="p-4 bg-neutral-50/50 dark:bg-[#0c0c0c]/80 backdrop-blur-md border-t border-neutral-200/60 dark:border-neutral-900/60 flex flex-col gap-3">
          {/* Quick Actions Scrollable */}
          <div className="flex gap-2 overflow-x-auto pb-1.5 no-scrollbar select-none">
            <button 
              onClick={() => handleQuickAction('Show me your projects')}
              className="px-3.5 py-1.5 rounded-full bg-white dark:bg-[#161616] border border-neutral-200 dark:border-neutral-800 text-[10px] font-bold text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              📂 Projects
            </button>
            <button 
              onClick={() => handleQuickAction('List your top skills')}
              className="px-3.5 py-1.5 rounded-full bg-white dark:bg-[#161616] border border-neutral-200 dark:border-neutral-800 text-[10px] font-bold text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              🛠️ Skills
            </button>
            <button 
              onClick={() => handleQuickAction('Download your CV')}
              className="px-3.5 py-1.5 rounded-full bg-white dark:bg-[#161616] border border-neutral-200 dark:border-neutral-800 text-[10px] font-bold text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              📄 Download Resume
            </button>
            <button 
              onClick={() => handleQuickAction('How can I contact you?')}
              className="px-3.5 py-1.5 rounded-full bg-white dark:bg-[#161616] border border-neutral-200 dark:border-neutral-800 text-[10px] font-bold text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              ✉️ Contact Info
            </button>
          </div>

          {/* Form Input */}
          <form id="chat-form" onSubmit={handleCustomSubmit} className="flex gap-2 items-center">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              disabled={isRunning}
              placeholder="Ask the AI Agent..."
              className="flex-grow bg-white dark:bg-[#161616] border border-neutral-200 dark:border-neutral-800 rounded-2xl px-4 py-3 text-[12px] placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-500 dark:text-white transition-colors"
            />
            <button
              type="submit"
              disabled={isRunning || !customInput.trim()}
              className="p-3 bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 rounded-2xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all flex items-center justify-center cursor-pointer shadow-md"
            >
              <ArrowUpRight className="w-4 h-4 rotate-45" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'projects' | 'experience' | 'services' | 'contact'>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedProject, setSelectedProject] = useState<typeof projectsData[0] | null>(null);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const viewsList: ('home' | 'projects' | 'experience' | 'services' | 'contact')[] = ['home', 'projects', 'experience', 'services', 'contact'];

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

  // Load Microsoft Clarity dynamically if VITE_CLARITY_PROJECT_ID is present
  useEffect(() => {
    const clarityId = import.meta.env.VITE_CLARITY_PROJECT_ID;
    if (clarityId) {
      (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);
        t.async=1;
        t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];
        if (y && y.parentNode) {
          y.parentNode.insertBefore(t,y);
        }
      })(window, document, "clarity", "script", clarityId);
    }
  }, []);

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

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus('submitting');

    // Honeypot spam check
    const formData = new FormData(e.currentTarget);
    const botcheck = formData.get('botcheck');
    if (botcheck) {
      // Silently succeed to fool spam bots without calling Web3Forms API
      setFormStatus('success');
      setContactName('');
      setContactEmail('');
      setContactMessage('');
      setTimeout(() => setFormStatus('idle'), 4000);
      return;
    }

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

  const sendEmailDirectly = async (name: string, email: string, message: string) => {
    setFormStatus('submitting');
    setContactName(name);
    setContactEmail(email);
    setContactMessage(message);

    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || "YOUR_ACCESS_KEY_HERE";
    const payload = {
      access_key: accessKey,
      name,
      email,
      message,
      subject: `AI Agent Handshake from ${name}`
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
        return true;
      }
      setFormStatus('error');
      setTimeout(() => setFormStatus('idle'), 4000);
      return false;
    } catch (e) {
      console.error(e);
      setFormStatus('error');
      setTimeout(() => setFormStatus('idle'), 4000);
      return false;
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
    { id: 'services', label: 'Services' },
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
                            <p className="text-[10px] text-neutral-400 dark:text-neutral-500 uppercase tracking-widest font-bold transition-colors mb-1">Interactive AI Assistant</p>
                            <p className="text-2xl font-bold flex items-center gap-2 text-neutral-900 dark:text-white transition-colors">Chat with my AI Agent</p>
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


              {/* SERVICES/FREELANCE VIEW */}
              {currentView === 'services' && (
                <motion.div key="services" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-16">
                  
                  <div className="border-b border-neutral-200 dark:border-neutral-800 pb-8">
                    <h2 className="text-3xl md:text-5xl font-medium tracking-tighter text-neutral-900 dark:text-neutral-100 transition-colors">Freelance Services</h2>
                    <p className="text-neutral-500 dark:text-neutral-400 mt-4 max-w-2xl font-light leading-relaxed">
                      Custom AI solutions, workflow automation, and full-stack development designed to accelerate your business.
                    </p>
                  </div>

                  {/* Pricing and Engagement Models Grid */}
                  <div className="space-y-8">
                    <div className="flex items-center gap-2 border-b border-neutral-200/50 dark:border-neutral-800/50 pb-4">
                      <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 transition-colors">Engagement Models</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      
                      {/* Hourly Rate Card */}
                      <motion.div 
                        whileHover={{ y: -6, scale: 1.01 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="p-8 rounded-3xl bg-white/40 dark:bg-[#111111]/40 border border-white/60 dark:border-white/5 shadow-sm backdrop-blur-md flex flex-col justify-between"
                      >
                        <div>
                          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/5 flex items-center justify-center text-indigo-500 mb-6">
                            <Briefcase className="w-6 h-6" />
                          </div>
                          <h3 className="text-xl font-medium mb-3 text-neutral-900 dark:text-neutral-100">Hourly Collaboration</h3>
                          <p className="text-sm font-light text-neutral-500 dark:text-neutral-400 leading-relaxed mb-6">
                            Best for debugging, consultation, ad-hoc prompt tuning, or helping you build features step-by-step.
                          </p>
                        </div>
                        <div>
                          <div className="text-3xl font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                            $25 - $35 <span className="text-xs text-neutral-400 dark:text-neutral-500 font-bold uppercase tracking-wider">/ Hour</span>
                          </div>
                          <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-500 bg-indigo-500/10 px-3 py-1 rounded-full">Flexible</span>
                        </div>
                      </motion.div>

                      {/* Project-Based Card */}
                      <motion.div 
                        whileHover={{ y: -6, scale: 1.01 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="p-8 rounded-3xl bg-white/40 dark:bg-[#111111]/40 border border-white/60 dark:border-white/5 shadow-sm backdrop-blur-md flex flex-col justify-between"
                      >
                        <div>
                          <div className="w-12 h-12 rounded-2xl bg-violet-500/10 dark:bg-violet-500/5 flex items-center justify-center text-violet-500 mb-6">
                            <Workflow className="w-6 h-6" />
                          </div>
                          <h3 className="text-xl font-medium mb-3 text-neutral-900 dark:text-neutral-100">Project-Based</h3>
                          <p className="text-sm font-light text-neutral-500 dark:text-neutral-400 leading-relaxed mb-6">
                            Best for complete products with scoped requirements (e.g., custom AI agent pipelines or dashboards).
                          </p>
                        </div>
                        <div>
                          <div className="text-3xl font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                            Custom Quote
                          </div>
                          <span className="text-[10px] uppercase font-bold tracking-widest text-violet-500 bg-violet-500/10 px-3 py-1 rounded-full">Scoped Scope</span>
                        </div>
                      </motion.div>

                      {/* Monthly Retainer Card */}
                      <motion.div 
                        whileHover={{ y: -6, scale: 1.01 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="p-8 rounded-3xl bg-white/40 dark:bg-[#111111]/40 border border-white/60 dark:border-white/5 shadow-sm backdrop-blur-md flex flex-col justify-between"
                      >
                        <div>
                          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/5 flex items-center justify-center text-emerald-500 mb-6">
                            <Server className="w-6 h-6" />
                          </div>
                          <h3 className="text-xl font-medium mb-3 text-neutral-900 dark:text-neutral-100">Monthly Retainer</h3>
                          <p className="text-sm font-light text-neutral-500 dark:text-neutral-400 leading-relaxed mb-6">
                            Best for ongoing support, regular pipeline updates, prompt monitoring, or continuous AI building.
                          </p>
                        </div>
                        <div>
                          <div className="text-3xl font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                            $1,000+ <span className="text-xs text-neutral-400 dark:text-neutral-500 font-bold uppercase tracking-wider">/ Month</span>
                          </div>
                          <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full">Dedicated</span>
                        </div>
                      </motion.div>

                    </div>
                  </div>

                  {/* Services List / Core Offerings */}
                  <div className="space-y-8">
                    <div className="flex items-center gap-2 border-b border-neutral-200/50 dark:border-neutral-800/50 pb-4">
                      <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 transition-colors">Core Capabilities</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-xl bg-neutral-200/50 dark:bg-neutral-800/50 flex items-center justify-center text-neutral-600 dark:text-neutral-400 mt-1">
                            <Brain className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">AI Prompt Engineering & Optimization</h4>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed mt-2 font-light">
                              Designing complex prompt chains, structured output formats (JSON/XML), few-shot learning systems, and safety filters that make LLMs perform reliably in production applications.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-xl bg-neutral-200/50 dark:bg-neutral-800/50 flex items-center justify-center text-neutral-600 dark:text-neutral-400 mt-1">
                            <Workflow className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">Agentic Workflows & Automation</h4>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed mt-2 font-light">
                              Creating autonomous agent systems that use tool callings, database actions, and automated integrations (e.g. n8n, LangChain, or custom Puppeteer scraping scripts) to reduce manual work.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-xl bg-neutral-200/50 dark:bg-neutral-800/50 flex items-center justify-center text-neutral-600 dark:text-neutral-400 mt-1">
                            <Cpu className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">Full-Stack AI Prototyping</h4>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed mt-2 font-light">
                              Developing lightweight React interfaces, API endpoints (Vite, Express, FastAPI), and databases (PostgreSQL/SQL) to quickly bring AI concepts from idea to a working prototype.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-xl bg-neutral-200/50 dark:bg-neutral-800/50 flex items-center justify-center text-neutral-600 dark:text-neutral-400 mt-1">
                            <Database className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">Custom Automation Tooling</h4>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed mt-2 font-light">
                              Building automated PDF pipelines, web scrapers, data parsers, and custom workflows to sync resources and remove manual tasks.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* My Working Process */}
                  <div className="space-y-8">
                    <div className="flex items-center gap-2 border-b border-neutral-200/50 dark:border-neutral-800/50 pb-4">
                      <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 transition-colors">How I Work</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 pt-4">
                      
                      <div className="p-6 rounded-2xl bg-white/20 dark:bg-[#111111]/20 border border-white/40 dark:border-white/5">
                        <div className="text-xs font-bold text-indigo-500 mb-2">01</div>
                        <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">Discovery</h4>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">
                          We discuss your requirements, target goals, and technical stack details.
                        </p>
                      </div>

                      <div className="p-6 rounded-2xl bg-white/20 dark:bg-[#111111]/20 border border-white/40 dark:border-white/5">
                        <div className="text-xs font-bold text-indigo-500 mb-2">02</div>
                        <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">Prototype</h4>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">
                          I build a quick, testable prototype using AI-assisted speeds.
                        </p>
                      </div>

                      <div className="p-6 rounded-2xl bg-white/20 dark:bg-[#111111]/20 border border-white/40 dark:border-white/5">
                        <div className="text-xs font-bold text-indigo-500 mb-2">03</div>
                        <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">Refine</h4>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">
                          We run evaluations, test edge cases, and tune prompts for consistency.
                        </p>
                      </div>

                      <div className="p-6 rounded-2xl bg-white/20 dark:bg-[#111111]/20 border border-white/40 dark:border-white/5">
                        <div className="text-xs font-bold text-indigo-500 mb-2">04</div>
                        <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">Delivery</h4>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">
                          I deliver complete documentation, codebase transfer, and Vercel hosting setup.
                        </p>
                      </div>

                    </div>
                  </div>

                  {/* Call to Action */}
                  <div className="p-8 rounded-3xl bg-gradient-to-r from-indigo-500/10 to-violet-500/10 border border-indigo-500/20 dark:border-indigo-500/10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                      <h3 className="text-xl font-medium text-neutral-900 dark:text-neutral-100">Ready to build your next AI project?</h3>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 font-light mt-1">Let's discuss how we can turn your product vision into a working application.</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCurrentView('contact')}
                      className="px-6 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-950 font-semibold text-sm transition-all shadow-md cursor-pointer"
                    >
                      Start Collaboration
                    </motion.button>
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
                          {/* Honeypot Spam Protection */}
                          <input 
                            type="checkbox" 
                            name="botcheck" 
                            className="hidden" 
                            style={{ display: 'none' }} 
                            tabIndex={-1}
                            autoComplete="off"
                          />
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

                <PromptTerminal 
                  currentView={currentView}
                  setCurrentView={(view) => {
                    setCurrentView(view);
                    setTimeout(() => {
                      setIsTerminalOpen(false);
                    }, 1500);
                  }}
                  isDarkMode={isDarkMode}
                  setIsDarkMode={setIsDarkMode}
                  sendEmail={sendEmailDirectly}
                />
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
        {/* Floating AI Agent Trigger Button (Visible on all pages when terminal is closed) */}
        {!isTerminalOpen && !selectedProject && (
          <motion.button
            onClick={() => setIsTerminalOpen(true)}
            initial={{ scale: 0, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-xl hover:shadow-2xl transition-all cursor-pointer flex items-center justify-center border border-white/10 dark:border-neutral-800"
            aria-label="Ask AI Agent"
          >
            <Brain className="w-6 h-6" />
          </motion.button>
        )}

        <Analytics />
      </div>
    </div>
  );
}
