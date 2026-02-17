
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Bell, 
  Settings, 
  User, 
  AlertTriangle, 
  ChevronDown, 
  FileText, 
  RefreshCcw,
  Cpu,
  Info,
  CheckCircle2,
  Trash2,
  ShieldCheck,
  Zap,
  Lock,
  ArrowRight,
  LogOut,
  ChevronRight,
  Activity,
  Globe,
  HelpCircle,
  Smartphone,
  LifeBuoy,
  MessageSquare,
  Mail,
  Phone
} from 'lucide-react';
import GasCylinder from './components/GasCylinder';
import UsageChart from './components/UsageChart';
import { Order, VendorSettings } from './types';
import { GoogleGenAI } from "@google/genai";

// Simulated Database Keys
const DB_KEYS = {
  AUTH_STATUS: 'gas_monitor_auth',
  GAS_LEVEL: 'gas_monitor_level',
  SETTINGS: 'gas_monitor_settings',
  ORDERS: 'gas_monitor_orders',
  HAS_LEAK: 'gas_monitor_leak'
};

const VENDORS = ['Bharat Gas', 'Indane Gas', 'HP Gas', 'Super Gas'];

const App: React.FC = () => {
  // Navigation State: 'landing' | 'login' | 'dashboard'
  const [view, setView] = useState<'landing' | 'login' | 'dashboard'>(() => {
    return (localStorage.getItem(DB_KEYS.AUTH_STATUS) === 'true') ? 'dashboard' : 'landing';
  });

  // Toggle for Landing Page "Learn More" content
  const [showLearnMore, setShowLearnMore] = useState(false);
  const learnMoreRef = useRef<HTMLDivElement>(null);
  const supportRef = useRef<HTMLElement>(null);

  // --- Dashboard States ---
  const [gasLevel, setGasLevel] = useState<number>(() => {
    const saved = localStorage.getItem(DB_KEYS.GAS_LEVEL);
    return saved ? parseInt(saved) : 72;
  });
  const [hasLeak, setHasLeak] = useState<boolean>(() => localStorage.getItem(DB_KEYS.HAS_LEAK) === 'true');
  const [isRefilling, setIsRefilling] = useState(false);
  const [vendorSettings, setVendorSettings] = useState<VendorSettings>(() => {
    const saved = localStorage.getItem(DB_KEYS.SETTINGS);
    return saved ? JSON.parse(saved) : {
      preferredVendor: 'Bharat Gas',
      refillThreshold: 20,
      autoPay: false,
      payOnDelivery: true,
    };
  });
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(DB_KEYS.ORDERS);
    return saved ? JSON.parse(saved) : [
      { id: '2024001', date: 'Jan 10, 2024', status: 'Delivered', vendor: 'Bharat Gas' }
    ];
  });
  const [aiInsight, setAiInsight] = useState<string>("");
  const [showVendorDropdown, setShowVendorDropdown] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'info'} | null>(null);

  // Sync with storage
  useEffect(() => {
    localStorage.setItem(DB_KEYS.GAS_LEVEL, gasLevel.toString());
    localStorage.setItem(DB_KEYS.HAS_LEAK, hasLeak.toString());
    localStorage.setItem(DB_KEYS.SETTINGS, JSON.stringify(vendorSettings));
    localStorage.setItem(DB_KEYS.ORDERS, JSON.stringify(orders));
    localStorage.setItem(DB_KEYS.AUTH_STATUS, (view === 'dashboard').toString());
  }, [gasLevel, hasLeak, vendorSettings, orders, view]);

  const showToast = (message: string, type: 'success' | 'info' = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchAiInsight = useCallback(async () => {
    if (view !== 'dashboard') return;
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Status: Gas Level ${gasLevel}%. Provide one short safety tip.`,
      });
      setAiInsight(response.text?.trim() || "Ensure ventilation is optimal.");
    } catch (e) {
      setAiInsight("Check your gas connections regularly.");
    }
  }, [gasLevel, view]);

  useEffect(() => {
    fetchAiInsight();
  }, [fetchAiInsight]);

  // Handle Learn More scroll
  useEffect(() => {
    if (showLearnMore && learnMoreRef.current) {
      learnMoreRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showLearnMore]);

  // --- Handlers ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setView('dashboard');
    showToast("Successfully logged in", "success");
  };

  const handleLogout = () => {
    setView('landing');
    setShowLearnMore(false);
    localStorage.setItem(DB_KEYS.AUTH_STATUS, 'false');
    showToast("Logged out safely");
  };

  const scrollToSupport = () => {
    if (!showLearnMore) setShowLearnMore(true);
    setTimeout(() => {
      supportRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // --- Views ---

  const LandingView = () => (
    <div className="min-h-screen bg-black text-white selection:bg-blue-900 selection:text-blue-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-blue-950/20 to-black pt-24 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-blue-600/10 text-blue-400 border border-blue-500/20 px-4 py-1.5 rounded-full text-sm font-bold mb-8 animate-fade-in">
            <Zap className="w-4 h-4" />
            <span>Smart Home Innovation 2024</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-[1.1]">
            The Future of <br />
            <span className="text-blue-500">Kitchen Safety.</span>
          </h1>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
            Stop checking your cylinder manually. Auto-Gas monitors your supply 24/7, 
            detects invisible leaks, and orders a refill before you ever run out.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button 
              onClick={() => setView('login')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-3xl font-black text-lg shadow-2xl shadow-blue-900/40 transition-all flex items-center group active:scale-95"
            >
              Access My Dashboard
              <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => setShowLearnMore(!showLearnMore)}
              className={`font-bold transition-all py-5 px-10 rounded-3xl border ${showLearnMore ? 'bg-white text-black border-white' : 'text-white bg-transparent border-white/20 hover:bg-white/5'}`}
            >
              {showLearnMore ? 'Show Less' : 'Learn More'}
            </button>
            <button 
              onClick={scrollToSupport}
              className="text-blue-400 font-bold hover:text-blue-300 transition-all py-5 px-6 rounded-3xl flex items-center"
            >
              <LifeBuoy className="w-5 h-5 mr-2" />
              Support
            </button>
          </div>
        </div>
      </div>

      {/* Conditionally Rendered Content Section */}
      {showLearnMore && (
        <div ref={learnMoreRef} className="animate-fade-in-up">
          {/* How It Works Section */}
          <section id="how-it-works" className="py-24 px-6 bg-black">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-20">
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-blue-500 mb-4">The Process</h2>
                <h3 className="text-4xl md:text-5xl font-black text-white tracking-tight">How Auto-Gas Works</h3>
              </div>
              
              <div className="grid md:grid-cols-4 gap-8 relative">
                {/* Steps with Icons */}
                <div className="text-center group">
                  <div className="w-20 h-20 bg-blue-900/20 text-blue-400 border border-blue-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                    <Smartphone className="w-8 h-8" />
                  </div>
                  <h4 className="font-black text-white mb-2">1. Connect Sensor</h4>
                  <p className="text-gray-400 text-sm leading-relaxed px-4">Attach our non-invasive smart sensor to your gas cylinder base.</p>
                </div>
                <div className="text-center group">
                  <div className="w-20 h-20 bg-indigo-900/20 text-indigo-400 border border-indigo-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                    <Activity className="w-8 h-8" />
                  </div>
                  <h4 className="font-black text-white mb-2">2. Live Monitoring</h4>
                  <p className="text-gray-400 text-sm leading-relaxed px-4">Data is streamed to your dashboard in real-time with 99.9% precision.</p>
                </div>
                <div className="text-center group">
                  <div className="w-20 h-20 bg-green-900/20 text-green-400 border border-green-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-6 group-hover:bg-green-600 group-hover:text-white transition-all duration-500">
                    <RefreshCcw className="w-8 h-8" />
                  </div>
                  <h4 className="font-black text-white mb-2">3. Auto-Ordering</h4>
                  <p className="text-gray-400 text-sm leading-relaxed px-4">When levels hit your set threshold, we book a refill with your vendor.</p>
                </div>
                <div className="text-center group">
                  <div className="w-20 h-20 bg-purple-900/20 text-purple-400 border border-purple-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-600 group-hover:text-white transition-all duration-500">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <h4 className="font-black text-white mb-2">4. 24/7 Safety</h4>
                  <p className="text-gray-400 text-sm leading-relaxed px-4">AI monitors for unusual usage patterns that indicate a potential leak.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Feature Breakdown / Why Choose Us */}
          <section className="bg-neutral-950 py-24 px-6 border-y border-white/5">
            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-blue-500 mb-4">Precision Technology</h3>
                <h4 className="text-4xl font-black text-white mb-8 leading-tight">Engineered for absolute reliability and user peace of mind.</h4>
                <div className="space-y-8">
                  <div className="flex items-start space-x-5">
                    <div className="bg-white/5 p-3 rounded-2xl border border-white/10"><Globe className="text-blue-500 w-6 h-6" /></div>
                    <div>
                      <h5 className="font-black text-white mb-1">Universal Compatibility</h5>
                      <p className="text-gray-400 text-sm">Works with all major vendors including Bharat Gas, Indane, and HP Gas.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-5">
                    <div className="bg-white/5 p-3 rounded-2xl border border-white/10"><Cpu className="text-indigo-500 w-6 h-6" /></div>
                    <div>
                      <h5 className="font-black text-white mb-1">AI-Powered Optimization</h5>
                      <p className="text-gray-400 text-sm">Gemini-integrated insights predict exactly when your supply will run out.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="bg-[#111] rounded-[3rem] p-10 shadow-3xl shadow-blue-900/20 border border-white/10 relative z-10">
                    <GasCylinder level={45} className="w-48 h-64 mx-auto mb-8 animate-float" />
                    <div className="text-center">
                      <span className="text-xs font-black text-gray-500 uppercase tracking-widest block mb-1">Active Monitoring</span>
                      <div className="text-5xl font-black text-blue-500">45.2%</div>
                      <p className="text-gray-400 text-sm mt-4 font-medium italic">"System optimized for 14 more days of cooking."</p>
                    </div>
                </div>
                <div className="absolute -top-10 -right-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-24 px-6 bg-black border-b border-white/5">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-blue-500 mb-4">FAQ</h2>
                <h3 className="text-4xl font-black text-white">Common Questions</h3>
              </div>
              <div className="space-y-4">
                {[
                  { q: "Is the sensor compatible with my cylinder?", a: "Yes, our universal bracket fits all standard domestic gas cylinders." },
                  { q: "How accurate is the leak detection?", a: "The sensor detects propane and butane at levels 95% below the lower explosive limit, alerting you instantly." },
                  { q: "Do I need a separate internet hub?", a: "No, the sensor connects directly to your home Wi-Fi via our secure 2.4GHz module." }
                ].map((item, idx) => (
                  <div key={idx} className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-blue-500/30 transition-all cursor-default group">
                    <div className="flex items-start">
                      <HelpCircle className="w-5 h-5 text-blue-500 mr-4 mt-0.5" />
                      <div>
                        <h5 className="font-bold text-white mb-2">{item.q}</h5>
                        <p className="text-gray-400 text-sm leading-relaxed">{item.a}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Support Section */}
          <section ref={supportRef} className="py-24 px-6 bg-[#0a0a0a]">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-blue-500 mb-4">Need Help?</h2>
                <h3 className="text-4xl font-black text-white">Contact & Support</h3>
                <p className="text-gray-400 mt-4 max-w-xl mx-auto">Our dedicated support team is available 24/7 to assist you with installation, troubleshooting, and order management.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 text-center hover:bg-white/10 hover:border-white/20 transition-all group">
                  <div className="w-16 h-16 bg-blue-900/30 text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition">
                    <MessageSquare className="w-8 h-8" />
                  </div>
                  <h4 className="font-black text-white mb-2">Live Chat</h4>
                  <p className="text-gray-400 text-sm mb-6">Talk to a human expert instantly about any technical issues.</p>
                  <button className="text-blue-500 font-bold hover:underline">Start Chatting</button>
                </div>
                <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 text-center hover:bg-white/10 hover:border-white/20 transition-all group">
                  <div className="w-16 h-16 bg-indigo-900/30 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition">
                    <Mail className="w-8 h-8" />
                  </div>
                  <h4 className="font-black text-white mb-2">Email Support</h4>
                  <p className="text-gray-400 text-sm mb-6">Send us a ticket and get a response within 2 business hours.</p>
                  <button className="text-indigo-500 font-bold hover:underline">support@autogas.io</button>
                </div>
                <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 text-center hover:bg-white/10 hover:border-white/20 transition-all group">
                  <div className="w-16 h-16 bg-green-900/30 text-green-400 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition">
                    <Phone className="w-8 h-8" />
                  </div>
                  <h4 className="font-black text-white mb-2">Direct Line</h4>
                  <p className="text-gray-400 text-sm mb-6">Immediate phone support for emergencies or device failures.</p>
                  <button className="text-green-500 font-bold hover:underline">+1 (800) AUTO-GAS</button>
                </div>
              </div>

              <div className="mt-16 bg-[#111] p-10 rounded-[3rem] border border-white/10 max-w-2xl mx-auto">
                <h4 className="text-2xl font-black text-white mb-6">Send a Message</h4>
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); showToast("Message sent to support!"); }}>
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="Your Name" className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder:text-gray-600" required />
                    <input type="email" placeholder="Email Address" className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder:text-gray-600" required />
                  </div>
                  <textarea placeholder="How can we help?" className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500 h-32 text-white placeholder:text-gray-600" required></textarea>
                  <button type="submit" className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-900/20 hover:bg-blue-700 transition">Submit Request</button>
                </form>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Legal Section - Always visible at bottom of landing */}
      <section id="legal" className="bg-[#050505] text-white py-24 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20">
          <div>
            <h2 className="text-3xl font-black mb-8 flex items-center">
              <Lock className="mr-3 w-8 h-8 text-blue-500" />
              Privacy Policy
            </h2>
            <div className="space-y-6 text-gray-400 text-sm leading-relaxed">
              <p>Your safety is our priority, but your data is yours. We collect only necessary sensor data to ensure accurate monitoring.</p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                  <span><strong>Data Collection:</strong> We do not sell your personal usage data to third parties.</span>
                </li>
              </ul>
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-black mb-8 flex items-center">
              <FileText className="mr-3 w-8 h-8 text-blue-500" />
              Terms & Conditions
            </h2>
            <div className="space-y-6 text-gray-400 text-sm leading-relaxed">
              <p>By using the Auto-Gas system, you agree to allow the application to act as a proxy for gas delivery services.</p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                  <span><strong>Automatic Booking:</strong> You are responsible for any charges incurred through automated refill triggers.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      <footer className="py-12 text-center text-gray-500 text-sm border-t border-white/5 font-medium bg-black">
        &copy; 2024 Auto-Gas Systems. Designed for a safer tomorrow.
      </footer>
    </div>
  );

  const LoginView = () => (
    <div className="min-h-screen flex items-center justify-center bg-black px-6">
      <div className="max-w-md w-full bg-[#111] rounded-[3rem] p-12 shadow-3xl shadow-blue-900/20 border border-white/10 animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-blue-600 rounded-[2rem] mx-auto flex items-center justify-center text-white mb-8 shadow-2xl shadow-blue-900/40">
            <Lock className="w-10 h-10" />
          </div>
          <h2 className="text-4xl font-black text-white tracking-tighter">Welcome</h2>
          <p className="text-gray-500 font-bold mt-2 uppercase tracking-widest text-[10px]">Enter Your Credentials</p>
        </div>

        {/* Demo Account Hint */}
        <div className="bg-blue-950/20 border border-blue-500/20 rounded-2xl p-4 mb-8 flex items-start space-x-3">
          <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-1">Demo Credentials</p>
            <div className="text-[11px] text-blue-200/70 space-y-1 font-mono">
              <p>Email: <span className="font-bold text-white select-all">demo@autogas.com</span></p>
              <p>Pass: <span className="font-bold text-white select-all">password123</span></p>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3 ml-2">Email Address</label>
            <input 
              type="email" 
              required
              defaultValue="demo@autogas.com"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 focus:ring-2 focus:ring-blue-500 focus:bg-white/10 outline-none transition font-medium text-white placeholder:text-gray-700"
              placeholder="name@company.com"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3 ml-2">Secure Password</label>
            <input 
              type="password" 
              required
              defaultValue="password123"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 focus:ring-2 focus:ring-blue-500 focus:bg-white/10 outline-none transition font-medium text-white placeholder:text-gray-700"
              placeholder="••••••••"
            />
          </div>
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center text-gray-500 font-bold cursor-pointer hover:text-gray-300 transition">
              <input type="checkbox" className="mr-3 w-4 h-4 rounded border-white/20 bg-white/5 text-blue-600 focus:ring-blue-500" defaultChecked />
              Trust Device
            </label>
            <button 
              onClick={(e) => { e.preventDefault(); scrollToSupport(); setView('landing'); }} 
              className="text-blue-500 font-black hover:underline"
            >
              Need Support?
            </button>
          </div>
          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-[2rem] shadow-2xl shadow-blue-900/40 transition-all flex items-center justify-center space-x-3 active:scale-95 mt-8"
          >
            <span>Start Session</span>
            <ChevronRight className="w-6 h-6" />
          </button>
        </form>
        
        <div className="mt-10 pt-10 border-t border-white/5 text-center">
          <p className="text-gray-500 text-sm font-bold">
            New user? <button onClick={() => setView('landing')} className="text-blue-500 font-black hover:underline ml-1">View Tour</button>
          </p>
        </div>
      </div>
    </div>
  );

  const DashboardView = () => (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-12 transition-colors duration-500">
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed top-20 right-6 z-[60] px-6 py-3 rounded-2xl shadow-2xl border flex items-center space-x-3 animate-bounce
          ${notification.type === 'success' ? 'bg-green-600 border-green-500 text-white' : 'bg-blue-600 border-blue-500 text-white'}`}>
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-medium">{notification.message}</span>
        </div>
      )}

      {/* Emergency Header */}
      {hasLeak && (
        <div className="bg-red-600 text-white py-3 px-6 flex items-center justify-center animate-pulse sticky top-0 z-50 shadow-lg">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-6 h-6" />
            <span className="font-bold uppercase tracking-wide">
              EMERGENCY: Gas Leak Detected in Kitchen
            </span>
          </div>
          <button 
            onClick={() => setHasLeak(false)}
            className="ml-6 bg-white/20 hover:bg-white/30 px-3 py-1 rounded text-sm transition"
          >
            Dismiss Alert
          </button>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <RefreshCcw className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-gray-800 tracking-tight">AUTO-GAS</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-500 hover:bg-gray-200 rounded-full transition relative group">
              <Bell className="w-6 h-6" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              <div className="absolute top-full right-0 mt-2 w-48 bg-white shadow-xl border rounded-xl p-3 opacity-0 group-hover:opacity-100 pointer-events-none transition z-50 text-xs">
                Cylinder is at {gasLevel}%. {gasLevel < vendorSettings.refillThreshold ? 'Refill recommended.' : 'Level is healthy.'}
              </div>
            </button>
            <button 
              onClick={() => { setHasLeak(!hasLeak); showToast(hasLeak ? "Safety normal" : "EMERGENCY SIM ACTIVE"); }}
              className="p-2 text-gray-500 hover:bg-gray-200 rounded-full transition" title="Toggle Leak Sim">
              <Settings className="w-6 h-6" />
            </button>
            <button 
              onClick={handleLogout}
              className="p-2 text-red-400 hover:bg-red-50 rounded-full transition" title="Logout">
              <LogOut className="w-6 h-6" />
            </button>
            <div className="flex items-center space-x-2 pl-4 border-l border-gray-300">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold border-2 border-white shadow-sm overflow-hidden">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-6">
            <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col items-center md:flex-row md:items-start space-x-0 md:space-x-8">
              <GasCylinder level={gasLevel} className="w-40 h-56 mb-6 md:mb-0" />
              <div className="flex-1 text-center md:text-left">
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Real-time Level</p>
                <div className="flex items-baseline justify-center md:justify-start">
                   <h2 className={`text-8xl font-black mb-4 transition-colors ${gasLevel < 20 ? 'text-red-500' : 'text-gray-900'}`}>{gasLevel}</h2>
                   <span className="text-3xl font-bold text-gray-300 ml-1">%</span>
                </div>
                <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-600 border border-green-100">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                    Sensor Online
                  </span>
                  <span className="text-gray-400 text-xs font-bold self-center uppercase">
                    Est. {Math.floor(gasLevel * 0.25)} days left
                  </span>
                </div>
              </div>
            </section>

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => { setIsRefilling(true); setTimeout(() => { setGasLevel(100); setIsRefilling(false); showToast("Refilled!", "success"); }, 1000); }}
                disabled={isRefilling}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold py-5 rounded-3xl shadow-xl shadow-blue-100 transition-all flex flex-col items-center justify-center space-y-1 active:scale-[0.98]"
              >
                <RefreshCcw className={`w-6 h-6 ${isRefilling ? 'animate-spin' : ''}`} />
                <span className="text-sm">Manual Refill</span>
              </button>
              <button 
                onClick={() => { const newO: Order = {id: Math.random().toString().slice(2,8), date: 'Today', status: 'Pending', vendor: vendorSettings.preferredVendor}; setOrders([newO, ...orders]); showToast("Ordered!"); }}
                className="bg-white hover:bg-gray-50 text-gray-800 font-bold py-5 rounded-3xl shadow-sm border border-gray-100 transition-all flex flex-col items-center justify-center space-y-1 active:scale-[0.98]"
              >
                <FileText className="w-6 h-6 text-blue-500" />
                <span className="text-sm">Order Now</span>
              </button>
            </div>

            <section className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl p-6 border border-blue-400 shadow-xl relative overflow-hidden group">
              <div className="flex items-center space-x-3 mb-3 relative z-10">
                <div className="bg-white/20 p-2 rounded-lg"><Cpu className="w-5 h-5 text-white" /></div>
                <h3 className="font-bold text-white uppercase tracking-wider text-xs">AI Safety Insight</h3>
              </div>
              <p className="text-blue-50 text-sm leading-relaxed font-medium relative z-10 italic">"{aiInsight || "Analyzing environment..."}"</p>
            </section>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-black text-gray-800 uppercase tracking-tight">Refill Config</h3>
                <div className="relative">
                  <button onClick={() => setShowVendorDropdown(!showVendorDropdown)} className="bg-gray-50 text-gray-700 px-4 py-2 rounded-xl text-sm font-bold border border-gray-100 flex items-center hover:bg-gray-100 transition shadow-sm">
                    {vendorSettings.preferredVendor} <ChevronDown className="w-4 h-4 ml-2" />
                  </button>
                  {showVendorDropdown && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 overflow-hidden">
                      {VENDORS.map(v => (
                        <button key={v} onClick={() => { setVendorSettings({...vendorSettings, preferredVendor: v}); setShowVendorDropdown(false); showToast(`Vendor: ${v}`); }} className="w-full text-left px-5 py-3 text-sm font-medium hover:bg-blue-50 hover:text-blue-600 transition">
                          {v}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-8 p-6 bg-blue-50/50 rounded-2xl">
                <div className="flex justify-between mb-3 text-xs font-black text-blue-900/60 uppercase"><span>Threshold</span><span>{vendorSettings.refillThreshold}%</span></div>
                <input type="range" min="5" max="50" step="5" value={vendorSettings.refillThreshold} onChange={(e) => setVendorSettings({...vendorSettings, refillThreshold: parseInt(e.target.value)})} className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl cursor-pointer" onClick={() => setVendorSettings({...vendorSettings, autoPay: !vendorSettings.autoPay})}>
                  <span className="text-sm font-black text-gray-700 uppercase tracking-tighter">Auto-pay</span>
                  <div className={`w-12 h-6 flex items-center rounded-full p-1 transition ${vendorSettings.autoPay ? 'bg-blue-600' : 'bg-gray-300'}`}><div className={`bg-white w-4 h-4 rounded-full shadow transition ${vendorSettings.autoPay ? 'translate-x-6' : ''}`}></div></div>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl cursor-pointer" onClick={() => setVendorSettings({...vendorSettings, payOnDelivery: !vendorSettings.payOnDelivery})}>
                  <span className="text-sm font-black text-gray-700 uppercase tracking-tighter">COD</span>
                  <div className={`w-12 h-6 flex items-center rounded-full p-1 transition ${vendorSettings.payOnDelivery ? 'bg-blue-600' : 'bg-gray-300'}`}><div className={`bg-white w-4 h-4 rounded-full shadow transition ${vendorSettings.payOnDelivery ? 'translate-x-6' : ''}`}></div></div>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-lg font-black text-gray-800 uppercase tracking-tight mb-6">Activity Log</h3>
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {orders.map((o) => (
                  <div key={o.id} className="flex justify-between p-4 border border-gray-50 rounded-2xl hover:bg-gray-50">
                    <div>
                      <p className="font-black text-gray-800 text-sm">ORDER #{o.id} <span className="ml-2 text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded uppercase">{o.status}</span></p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">{o.date} • {o.vendor}</p>
                    </div>
                    <button onClick={() => { if(confirm("Clear?")) setOrders(orders.filter(ord => ord.id !== o.id)); }} className="text-gray-300 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );

  return (
    <>
      {view === 'landing' && <LandingView />}
      {view === 'login' && <LoginView />}
      {view === 'dashboard' && <DashboardView />}
    </>
  );
};

export default App;
