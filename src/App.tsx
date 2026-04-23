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
  Menu
} from 'lucide-react';

const techSkillsData = [
  { name: "Python", icon: <Terminal className="w-6 h-6" /> },
  { name: "SQL", icon: <Database className="w-6 h-6" /> },
  { name: "DuckDB", icon: <Server className="w-6 h-6" /> },
  { name: "Pandas", icon: <FileSpreadsheet className="w-6 h-6" /> },
  { name: "NumPy", icon: <Calculator className="w-6 h-6" /> },
  { name: "Matplotlib", icon: <LineChart className="w-6 h-6" /> }
];

const projectsData = [
  {
    id: 1,
    title: "Stock Market Data Analyzer",
    domain: "Finance Domain",
    tags: ["Python", "Pandas", "Matplotlib"],
    summary: [
      "Developed an end-to-end data pipeline to ingest and analyze historical stock market datasets, extracting actionable insights for long-term investment trends.",
      "Processed complex timeline data and resolved missing values using intelligent interpolation techniques, ensuring accurate financial modeling without dropping critical data points.",
      "Engineered informative visualizations using Matplotlib to map out stock price trends, enabling better decision-making for hypothetical risk assessment and portfolio tracking."
    ],
    caseStudy: {
      challenge: "Handling multi-year sequential data laden with weekend gaps, public holidays, and anomalous volatility spikes that skewed standard moving average calculations.",
      methodology: [
        "Data Ingestion: Automated extraction of multi-ticker external APIs and raw CSV data streams into structured pipelines.",
        "Data Cleaning: Implemented robust forward/backward fill mechanisms for null values to stabilize rolling window aggregations.",
        "Signal Generation: Built custom logic to tag golden/death crosses algorithmically based on adjusted closing prices.",
        "Visualization Engine: Designed modular functions to output pristine, high-contrast trend charts mapping risk trajectories."
      ],
      imageLabel: "[ Placeholder for Stock Trends Dashboard & Crossover Chart ]"
    }
  },
  {
    id: 2,
    title: "Financial Data Cleaning & Feature Engineering",
    domain: "Data Engineering",
    tags: ["Python", "DuckDB", "Pandas", "SQL"],
    summary: [
      "Built a comprehensive automated framework to sanitize messy datasets, enforcing strict data quality standards for downstream reporting.",
      "Corrected invalid data types and standardized text formats using Regex, reducing data inconsistencies.",
      "Generated aggregated statistical summaries, multi-dimensional views, and cross-tabulations utilizing Pandas Pivot Tables to highlight key business metrics."
    ],
    caseStudy: {
      challenge: "Processing thousands of raw, unstructured transaction records (differing date formats, currency symbols, and typo-ridden categories) into a single unified analytical schema.",
      methodology: [
        "Standardization: Leveraged sophisticated Regex patterns to strip errant symbols and harmonize casing globally.",
        "Validation Gates: Created type-casting gates to automatically drop or flag corrupted inputs without failing the entire pipeline.",
        "Feature Engineering: Dynamically generated 'Transaction Month/Year', 'Bucket Category', and 'Spend Velocity' attributes for granular reporting.",
        "Aggregation: Utilized Pandas Pivot Tables seamlessly to summarize spending velocity by customized timeblocks."
      ],
      imageLabel: "[ Placeholder for Before/After Dataset Transformation Preview ]"
    }
  },
  {
    id: 3,
    title: "In-Memory SQL Data Analytics Engine",
    domain: "Analytics Architecture",
    tags: ["Python", "DuckDB", "Pandas", "SQL"],
    summary: [
      "Integrated an OLAP database system (DuckDB) to execute ultra-fast native SQL queries (SELECT, WHERE, GROUP BY) on large-scale datasets.",
      "Bridged traditional SQL logic with modern Python workflows, drastically reducing query times for advanced data aggregation and analysis."
    ],
    caseStudy: {
      challenge: "Legacy Pandas scripts were bottlenecking execution times and consuming massive RAM overhead when performing multi-key group-bys and complex window functions on million-row CSVs.",
      methodology: [
        "System Architecture: Bootstrapped an embedded DuckDB instance directly within the Python runtime for zero-configuration analytics.",
        "Logic Migration: Transcribed heavy Pandas DataFrame transformation logic into optimized native SQL syntaxes.",
        "Memory Optimization: Employed columnar data processing native to DuckDB to bypass local RAM limits and eliminate memory bloat.",
        "Performant Results: Succeeded in reducing baseline processing benchmarks by over 70%, allowing near-instant exploratory analytics."
      ],
      imageLabel: "[ Placeholder for Query Performance Benchmark Graph: Pandas vs DuckDB ]"
    }
  }
];

const testimonialsData = [
  {
    quote: "Naved's ability to transform messy, unstructured financial data into actionable insights is exceptional. His implementation of the analytics pipeline saved us countless hours of manual processing.",
    name: "Sarah Jenkins",
    title: "Senior Finance Manager"
  },
  {
    quote: "A rare mix of strong technical skills and business acumen. He consistently delivered high-quality work, especially when it came to automating our cash flow tracking systems.",
    name: "David Chen",
    title: "Lead Data Scientist"
  }
];

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'projects' | 'experience' | 'contact'>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedProject, setSelectedProject] = useState<typeof projectsData[0] | null>(null);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    setTimeout(() => {
      setFormStatus('success');
      setTimeout(() => setFormStatus('idle'), 3000);
    }, 1500);
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

      <div className="min-h-screen flex flex-col transition-colors duration-500 bg-transparent text-neutral-900 dark:text-neutral-100 font-sans selection:bg-neutral-200 dark:selection:bg-neutral-800 relative z-10 w-full overflow-x-hidden pt-20">
        
        {/* Fixed Head Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-40 bg-[#FAFAFA]/70 dark:bg-[#0a0a0a]/70 backdrop-blur-xl border-b border-neutral-200/50 dark:border-neutral-800/50 transition-colors">
          <div className="w-full mx-auto px-6 sm:px-8 md:px-12 lg:px-20 h-20 flex justify-between items-center">
            
            {/* Nav Links Desktop */}
            <div className="hidden md:flex gap-8 text-xs font-bold tracking-widest uppercase items-center flex-1">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => setCurrentView(link.id as any)}
                  className={`transition-all duration-300 relative py-2 ${currentView === link.id ? 'text-neutral-900 dark:text-neutral-100' : 'text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'}`}
                >
                  {link.label}
                  {currentView === link.id && (
                    <motion.div layoutId="navIndicator" className="absolute bottom-0 left-0 right-0 h-px bg-neutral-900 dark:bg-neutral-100" />
                  )}
                </button>
              ))}
            </div>

            {/* Nav Link Mobile Hamburger */}
            <div className="md:hidden flex items-center pr-4 border-r border-neutral-200 dark:border-neutral-800">
               <button 
                 onClick={() => setIsMobileMenuOpen(true)}
                 className="p-2 -ml-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
                 aria-label="Open Menu"
               >
                 <Menu className="w-6 h-6 text-neutral-900 dark:text-neutral-100" />
               </button>
            </div>

            <div className="flex items-center space-x-4 md:space-x-6 text-sm text-neutral-400 dark:text-neutral-500 transition-colors">
              <a 
                href="https://drive.google.com/uc?export=download&id=1ju6zL66sYaNKdFWcF3ClSCT0wSZiB-N3" 
                download="Mohammad_Naved_Resume.pdf"
                className="items-center gap-2 px-4 md:px-5 py-2.5 rounded-full border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-900 hover:text-white dark:hover:bg-neutral-100 dark:hover:text-neutral-900 transition-all font-medium text-xs tracking-widest uppercase flex"
              >
                <span className="hidden sm:inline">Download CV</span>
                <span className="sm:hidden">CV</span>
                <Download className="w-4 h-4" />
              </a>
              <button 
                onClick={toggleDarkMode}
                className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors focus:outline-none flex-shrink-0"
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
              </button>
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
                 <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-3 -mr-3 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
                >
                  <X className="w-6 h-6 text-neutral-900 dark:text-neutral-100" />
                </button>
              </div>
              
              <div className="flex flex-col gap-8 items-center justify-center flex-1 pb-20">
                {navLinks.map((link, idx) => (
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={link.id}
                    onClick={() => setCurrentView(link.id as any)}
                    className={`text-3xl font-medium tracking-tighter ${currentView === link.id ? 'text-neutral-900 dark:text-neutral-100' : 'text-neutral-400 dark:text-neutral-600'}`}
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
                      <h1 className="text-6xl md:text-8xl font-medium tracking-tighter leading-tight mb-8 text-neutral-900 dark:text-neutral-100 transition-colors">
                        Mohammad<br className="hidden md:block"/> Naved.
                      </h1>
                      <p className="text-lg md:text-xl text-neutral-500 dark:text-neutral-400 max-w-md leading-relaxed mb-10 transition-colors mx-auto md:mx-0">
                        Finance Data Analyst bridging technical data processing with business intelligence to extract actionable insights.
                      </p>
                      <div className="flex justify-center md:justify-start items-center space-x-4 mb-8 text-sm w-full">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-green-500 dark:bg-green-400 transition-colors shadow-[0_0_8px_rgba(34,197,94,0.4)]"></div>
                          <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 transition-colors">Available for Opportunities</span>
                        </div>
                      </div>
                    </div>
                    <div className="md:col-span-12 lg:col-span-5 flex flex-col justify-center items-center lg:items-end w-full max-w-lg mx-auto lg:mx-0 space-y-6 lg:pt-8">
                      <div 
                        className="w-full bg-neutral-900 dark:bg-neutral-100 p-8 rounded-2xl text-white dark:text-neutral-900 flex justify-between items-center group hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors cursor-pointer shadow-xl"
                        onClick={() => setCurrentView('contact')}
                      >
                        <div className="w-full flex justify-between items-center">
                          <div className="space-y-1">
                            <p className="text-xs text-neutral-400 dark:text-neutral-500 uppercase tracking-widest transition-colors mb-1">Contact Me</p>
                            <p className="text-lg font-medium flex items-center gap-2 text-white dark:text-neutral-900 transition-colors">andyk4548@gmail.com</p>
                          </div>
                          <div className="h-12 w-12 rounded-full border border-neutral-700 dark:border-neutral-300 flex items-center justify-center group-hover:bg-neutral-700 dark:group-hover:bg-neutral-300 transition-colors group-hover:translate-x-1">—&gt;</div>
                        </div>
                      </div>
                      <div className="flex flex-wrap justify-center lg:justify-end gap-4 md:gap-6 text-sm font-medium tracking-widest uppercase text-neutral-500 dark:text-neutral-400 px-2 mt-4 transition-colors">
                        <a href="https://github.com/MD-NAVED" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors flex items-center gap-2 hover:-translate-y-0.5">
                          GitHub <span className="text-xs">—&gt;</span>
                        </a>
                        <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors flex items-center gap-2 hover:-translate-y-0.5">
                          LinkedIn <span className="text-xs">—&gt;</span>
                        </a>
                        <a href="https://www.naukri.com/mnjuser/profile" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors flex items-center gap-2 hover:-translate-y-0.5">
                          Naukri <span className="text-xs">—&gt;</span>
                        </a>
                        <a href="https://www.foundit.in/seeker/profile" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors flex items-center gap-2 hover:-translate-y-0.5">
                          Foundit <span className="text-xs">—&gt;</span>
                        </a>
                      </div>
                    </div>
                 </section>

                 <section className="border-t border-neutral-200 dark:border-neutral-800 pt-16 md:pt-24 transition-colors">
                    <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-8 transition-colors flex items-center gap-2">
                      <TerminalSquare className="w-4 h-4" />
                      Key Focus Areas
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div className="p-8 rounded-3xl bg-white/40 dark:bg-[#111111]/40 backdrop-blur-md border border-white/60 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-300 group overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/5 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                        <Database className="relative z-10 w-8 h-8 text-neutral-700 dark:text-neutral-300 mb-6 transition-colors group-hover:text-black dark:group-hover:text-white" />
                        <h4 className="relative z-10 text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-3 transition-colors">Data Architecture</h4>
                        <p className="relative z-10 text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed transition-colors">Designing resilient data models and fast native analytical databases.</p>
                      </div>
                      <div className="p-8 rounded-3xl bg-white/40 dark:bg-[#111111]/40 backdrop-blur-md border border-white/60 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-300 group overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/5 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                        <LineChart className="relative z-10 w-8 h-8 text-neutral-700 dark:text-neutral-300 mb-6 transition-colors group-hover:text-black dark:group-hover:text-white" />
                        <h4 className="relative z-10 text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-3 transition-colors">Financial Analysis</h4>
                        <p className="relative z-10 text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed transition-colors">Extracting actionable business metrics from messy transactional data.</p>
                      </div>
                      <div className="p-8 rounded-3xl bg-white/40 dark:bg-[#111111]/40 backdrop-blur-md border border-white/60 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-300 group overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/5 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                        <Workflow className="relative z-10 w-8 h-8 text-neutral-700 dark:text-neutral-300 mb-6 transition-colors group-hover:text-black dark:group-hover:text-white" />
                        <h4 className="relative z-10 text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-3 transition-colors">Automated Pipelines</h4>
                        <p className="relative z-10 text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed transition-colors">Building end-to-end workflows to reduce manual processing overhead.</p>
                      </div>
                    </div>
                 </section>

               </motion.div>
             )}


             {/* PROJECTS VIEW */}
             {currentView === 'projects' && (
               <motion.div key="projects" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-12">
                 
                 <div className="border-b border-neutral-200 dark:border-neutral-800 pb-8 rounded-t-lg">
                   <h2 className="text-3xl md:text-5xl font-medium tracking-tighter text-neutral-900 dark:text-neutral-100 transition-colors">Projects</h2>
                   <p className="text-neutral-500 dark:text-neutral-400 mt-4 max-w-2xl font-light leading-relaxed">A selection of my recent works highlighting automated pipelines, statistical models, and optimized data workflows.</p>
                 </div>
                 
                 <div className="space-y-10">
                   {projectsData.map((project) => (
                     <div 
                       key={project.id}
                       className="group cursor-pointer p-8 md:p-12 rounded-3xl bg-white/40 dark:bg-[#111111]/40 backdrop-blur-md border border-white/60 dark:border-white/5 hover:border-neutral-300 dark:hover:border-neutral-700 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] hover:-translate-y-2 transition-all duration-300 relative overflow-hidden"
                       onClick={() => setSelectedProject(project)}
                     >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/5 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
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
                        
                        <div className="mt-10 relative z-10">
                           <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-900 dark:text-neutral-100 border-b border-transparent group-hover:border-neutral-900 dark:group-hover:border-neutral-100 transition-colors pb-1">
                             View Case Study
                           </span>
                        </div>
                      </div>
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

                 {/* Work History */}
                 <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16">
                   <div className="md:col-span-4">
                     <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 transition-colors">Work History</h2>
                   </div>
                   <div className="md:col-span-8 space-y-12">
                     <div className="group">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                          <div className="mb-2 md:mb-0">
                            <h3 className="text-xl font-medium text-neutral-900 dark:text-neutral-100 transition-colors">Financial Operations & Accounting Analyst</h3>
                            <div className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400 mt-2 text-sm transition-colors">
                              <MapPin className="w-3.5 h-3.5" />
                              <span>Indore, Madhya Pradesh</span>
                            </div>
                          </div>
                          <span className="text-xs text-neutral-400 dark:text-neutral-500 uppercase tracking-widest font-bold flex-shrink-0 transition-colors md:mt-1 border border-neutral-200 dark:border-neutral-800 px-3 py-1.5 rounded-full">
                            Sep 2025 — Apr 2026
                          </span>
                        </div>
                        <ul className="space-y-4 text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed max-w-2xl transition-colors">
                          <li className="flex items-start gap-4">
                            <span className="text-neutral-300 dark:text-neutral-700 mt-0.5 transition-colors">—</span>
                            <p>Analyzed and reconciled monthly bank statements, identifying cash flow patterns and ensuring 100% data integrity for business ledgers.</p>
                          </li>
                          <li className="flex items-start gap-4">
                            <span className="text-neutral-300 dark:text-neutral-700 mt-0.5 transition-colors">—</span>
                            <p>Managed and processed financial bills, utilizing analytical skills to track expenditures and optimize daily financial reporting workflows.</p>
                          </li>
                          <li className="flex items-start gap-4">
                            <span className="text-neutral-300 dark:text-neutral-700 mt-0.5 transition-colors">—</span>
                            <p>Applied logical data tracking methodologies to minimize discrepancies and maintain accurate financial records for seamless operations.</p>
                          </li>
                        </ul>
                     </div>
                   </div>
                 </div>

                 {/* Skills & Educ */}
                 <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 border-t border-neutral-200 dark:border-neutral-800 pt-16 transition-colors">
                   <div className="md:col-span-4">
                     <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 transition-colors">Skills & Educ.</h2>
                   </div>
                   <div className="md:col-span-8 flex flex-col md:flex-row gap-16 md:gap-24">
                      
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-6 transition-colors">Technical Skills</h3>
                        <div className="flex flex-wrap gap-4 mb-12 border-b border-neutral-100 dark:border-neutral-800/60 pb-10">
                          {techSkillsData.map((skill, idx) => (
                            <div key={idx} className="relative group flex flex-col items-center justify-center">
                              <motion.div
                                whileHover={{ scale: 1.15, y: -4 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-16 h-16 rounded-2xl bg-white dark:bg-[#111111] backdrop-blur-sm border border-neutral-200 dark:border-neutral-800 flex items-center justify-center text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgb(0,0,0,0.1)] transition-all cursor-pointer z-10"
                              >
                                {skill.icon}
                              </motion.div>
                              <div className="absolute -top-10 scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-200 text-xs font-bold tracking-wide bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 px-3 py-1.5 rounded-lg pointer-events-none z-20 shadow-xl whitespace-nowrap flex flex-col items-center">
                                {skill.name}
                                <div className="absolute -bottom-1 w-2 h-2 bg-neutral-900 dark:bg-neutral-100 rotate-45"></div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-6 transition-colors">Core Competencies</h3>
                        <div className="flex flex-wrap gap-2">
                          <span className="border border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 px-3 py-1 text-xs font-medium rounded-full transition-colors">Data Analysis</span>
                          <span className="border border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 px-3 py-1 text-xs font-medium rounded-full transition-colors">Cash Flow Tracking</span>
                          <span className="border border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 px-3 py-1 text-xs font-medium rounded-full transition-colors">EDA</span>
                          <span className="border border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 px-3 py-1 text-xs font-medium rounded-full transition-colors">Data Cleaning</span>
                          <span className="border border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 px-3 py-1 text-xs font-medium rounded-full transition-colors">Time Series</span>
                        </div>
                      </div>

                      <div className="flex-1 flex flex-col gap-12">
                        <div>
                          <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-6 transition-colors">Education</h3>
                          <div className="bg-white/40 dark:bg-[#111111]/40 p-6 rounded-2xl border border-white/60 dark:border-white/5 backdrop-blur-sm">
                            <p className="font-medium text-neutral-900 dark:text-neutral-100 text-sm md:text-base transition-colors">B.Tech in Computer Science</p>
                            <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-2 transition-colors leading-relaxed">Rajiv Gandhi Proudyogiki Vishwavidyalaya</p>
                            <p className="text-xs font-bold text-neutral-400 dark:text-neutral-600 uppercase tracking-widest mt-4 transition-colors">2021 — 2025</p>
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
                      </div>

                   </div>
                 </div>

                 {/* Testimonials */}
                 <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 border-t border-neutral-200 dark:border-neutral-800 pt-16 transition-colors">
                    <div className="md:col-span-4">
                      <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 transition-colors">Testimonials</h2>
                    </div>
                    <div className="md:col-span-8 space-y-16">
                      {testimonialsData.map((testimonial, index) => (
                        <div key={index} className="relative p-8 md:p-10 rounded-3xl bg-white/40 dark:bg-[#111111]/40 backdrop-blur-md border border-white/60 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
                           <div className="text-neutral-200/50 dark:text-neutral-800/50 absolute top-4 left-6 text-8xl font-serif leading-none select-none transition-colors">"</div>
                           <blockquote className="relative z-10 pt-4">
                             <p className="text-xl md:text-2xl text-neutral-800 dark:text-neutral-200 font-light leading-relaxed mb-8 transition-colors">
                               {testimonial.quote}
                             </p>
                             <footer className="flex items-center gap-4">
                               <div className="h-10 w-10 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-sm font-medium">
                                  {testimonial.name.charAt(0)}
                               </div>
                               <div>
                                 <div className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm transition-colors">{testimonial.name}</div>
                                 <div className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mt-1 transition-colors">{testimonial.title}</div>
                               </div>
                             </footer>
                           </blockquote>
                        </div>
                      ))}
                    </div>
                 </div>

               </motion.div>
             )}


             {/* CONTACT VIEW */}
             {currentView === 'contact' && (
               <motion.div key="contact" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-12">
                 
                 <div className="border-b border-neutral-200 dark:border-neutral-800 pb-8">
                   <h2 className="text-3xl md:text-5xl font-medium tracking-tighter text-neutral-900 dark:text-neutral-100 transition-colors">Get in Touch</h2>
                   <p className="text-neutral-500 dark:text-neutral-400 mt-4 max-w-2xl font-light leading-relaxed">Let's discuss how my data analysis and financial tracking expertise can add value to your team.</p>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 pt-8">
                   <div className="md:col-span-4 space-y-8">
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
                         <a href="#" className="group flex items-start gap-4 hover:opacity-80 transition-opacity">
                            <div className="mt-1"><MapPin className="w-5 h-5 text-neutral-400" /></div>
                            <div>
                               <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Location</p>
                               <p className="text-sm text-neutral-500 mt-1 font-light">Indore, Madhya Pradesh</p>
                            </div>
                         </a>
                       </div>
                     </div>
                   </div>

                   <div className="md:col-span-8">
                     <div className="w-full max-w-2xl bg-white/40 dark:bg-[#111111]/40 backdrop-blur-md p-8 md:p-12 rounded-3xl border border-white/60 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)]">
                       <form className="space-y-10" onSubmit={handleContactSubmit}>
                         <div>
                           <label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2 block">Name</label>
                           <motion.input 
                             whileFocus={{ backgroundColor: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)', paddingLeft: '16px' }}
                             transition={{ duration: 0.3, ease: 'easeOut' }}
                             type="text" 
                             id="name" 
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
                             placeholder="Tell me about your project or opportunity..." 
                             className="w-full bg-transparent border-b border-neutral-300 dark:border-neutral-700 py-3 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-400 transition-colors resize-none"
                           />
                         </div>
                         <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4">
                           <motion.button 
                             whileHover={{ scale: formStatus === 'idle' ? 1.02 : 1 }}
                             whileTap={{ scale: formStatus === 'idle' ? 0.98 : 1 }}
                             animate={{ 
                               backgroundColor: formStatus === 'success' ? '#22c55e' : (isDarkMode ? '#F5F5F5' : '#171717'),
                               color: formStatus === 'success' ? '#FFFFFF' : (isDarkMode ? '#171717' : '#FFFFFF')
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
                           </motion.button>
                         </div>
                       </form>
                     </div>
                   </div>
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
            <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-all hover:-translate-y-1 hover:drop-shadow-[0_0_8px_rgba(0,0,0,0.15)] dark:hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] inline-block">LinkedIn</a>
            <a href="https://github.com/MD-NAVED" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-all hover:-translate-y-1 hover:drop-shadow-[0_0_8px_rgba(0,0,0,0.15)] dark:hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] inline-block">GitHub</a>
            <a href="https://www.naukri.com/mnjuser/profile" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-all hover:-translate-y-1 hover:drop-shadow-[0_0_8px_rgba(0,0,0,0.15)] dark:hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] inline-block">Naukri</a>
            <a href="https://www.foundit.in/seeker/profile" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-all hover:-translate-y-1 hover:drop-shadow-[0_0_8px_rgba(0,0,0,0.15)] dark:hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] inline-block">Foundit</a>
            <a href="mailto:andyk4548@gmail.com" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-all hover:-translate-y-1 hover:drop-shadow-[0_0_8px_rgba(0,0,0,0.15)] dark:hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] inline-block">Email</a>
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
                  <button 
                    onClick={() => setSelectedProject(null)}
                    className="absolute top-6 right-6 md:top-8 md:right-8 p-3 rounded-full bg-neutral-100 dark:bg-[#1a1a1a] text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-all hover:scale-110 active:scale-95"
                    aria-label="Close modal"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  
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
                      <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-900 dark:text-neutral-100 mb-6 transition-colors">The Challenge</h4>
                      <div className="pl-0 md:pl-6 border-l-0 md:border-l-2 border-neutral-200 dark:border-neutral-800">
                        <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed font-light transition-colors">
                          {selectedProject.caseStudy.challenge}
                        </p>
                      </div>
                    </section>

                    <section>
                      <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-900 dark:text-neutral-100 mb-8 transition-colors">Methodology</h4>
                      <div className="space-y-6 md:space-y-8">
                        {selectedProject.caseStudy.methodology.map((step, i) => {
                          const separatorIndex = step.indexOf(': ');
                          const title = separatorIndex !== -1 ? step.substring(0, separatorIndex) : null;
                          const desc = separatorIndex !== -1 ? step.substring(separatorIndex + 2) : step;
                          
                          return (
                            <div key={i} className="flex flex-col md:flex-row gap-2 md:gap-8 border-b border-neutral-100 dark:border-neutral-800/50 pb-6 last:border-0 transition-colors">
                              <span className="text-xs font-bold uppercase tracking-widest text-neutral-400 md:w-24 flex-shrink-0 transition-colors mt-1">Phase 0{i + 1}</span>
                              <p className="text-neutral-600 dark:text-neutral-300 text-base leading-relaxed font-light transition-colors">
                                {title && desc ? <><strong className="font-medium text-neutral-900 dark:text-neutral-100 transition-colors">{title}:</strong> {desc}</> : step}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </section>

                    <section className="bg-neutral-50 dark:bg-[#141414] rounded-3xl border border-neutral-200/60 dark:border-neutral-800/60 p-8 md:p-16 flex flex-col items-center justify-center text-center transition-colors">
                      <div className="w-16 h-16 rounded-full bg-white dark:bg-[#1a1a1a] border border-neutral-200 dark:border-neutral-800 mb-6 flex items-center justify-center shadow-md transition-colors">
                        <BarChart className="w-6 h-6 text-neutral-400" />
                      </div>
                      <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-3 transition-colors">Interactive Demo View</p>
                      <p className="text-neutral-500 dark:text-neutral-400 text-sm font-light max-w-md mx-auto transition-colors">{selectedProject.caseStudy.imageLabel}</p>
                    </section>
                  </div>
                  
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
