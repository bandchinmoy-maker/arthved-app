'use client'

import React, { useState, useEffect } from 'react'

const ramayanaSlides = [
  {
    name: "Shri Ram (श्री राम)",
    title: "Maryada Purushottam — The Supreme Ideal",
    deed: "Pita ke vachan hetu 14 varsh ka vanvas sweekar kiya aur asatya par satya ki vijay sthapit karke maryada ka adarsh sthapit kiya.",
    image: "https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?q=80&w=1000&auto=format&fit=crop", // Cinematic spiritual representation
    badge: "Divine Epitome"
  },
  {
    name: "Mata Sita (माता सीता)",
    title: "Pavitrata & Tyag ki Moorti",
    deed: "Rajya ke sabhi sukhon ka tyag karke vanvas mein sahayatri bani, atulya dhairya aur aatma-bal ka sacho parichay diya.",
    image: "https://images.unsplash.com/photo-1590073844006-33379778ae09?q=80&w=1000&auto=format&fit=crop",
    badge: "Grace & Resilience"
  },
  {
    name: "Hanuman ji (हनुमान जी)",
    title: "Pawanputra & Sankat Mochan",
    deed: "Samudra langh kar Lanka mein Mata Sita ki khoj ki, Lanka dahan kiya aur apani bhakti se amar kirti sthapit ki.",
    image: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?q=80&w=1000&auto=format&fit=crop",
    badge: "Supreme Devotee"
  },
  {
    name: "Jatayu (जटायु)",
    title: "Param Pakshiraj & Yoddha",
    deed: "Mata Sita ki raksha ke liye akash mein Ravan se bhayanak yuddh kiya aur dharm ke liye apne praan samarpit kiye.",
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1000&auto=format&fit=crop",
    badge: "Brave Protector"
  },
  {
    name: "Sugriva & Vanara Sena (सुग्रीव व वानर सेना)",
    title: "Kishkindha Allies & Builders",
    deed: "Mitrata ka sacha dharm nibhate hue mahan Vanara sena ke sath Ram Setu ka nirmaan kiya aur Asaty par vijay paayi.",
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1000&auto=format&fit=crop",
    badge: "Eternal Alliance"
  }
];

export default function HisabApp() {
  const [step, setStep] = useState('loading'); // loading -> welcome -> register -> login -> dashboard
  const [activeTab, setActiveTab] = useState('Overview');
  const [currentSlide, setCurrentSlide] = useState(0);

  const [formData, setFormData] = useState({ name: '', phone: '', pin: '' });
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);

  // Dashboard States
  const [transactions, setTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [txData, setTxData] = useState({ text: '', amount: '', type: 'income', category: 'General', paymentMode: 'Cash' });

  // Initial App Load & Auto Sliding Cinematic Ramayana Background Effect
  useEffect(() => {
    const timer = setTimeout(() => {
      const savedUser = localStorage.getItem('arthved_user');
      setStep(savedUser ? 'login' : 'welcome');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % ramayanaSlides.length);
    }, 4500); // Changes slide smoothly every 4.5 seconds
    return () => clearInterval(slideInterval);
  }, []);

  const handleRegister = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.pin) return;
    localStorage.setItem('arthved_user', JSON.stringify(formData));
    setStep('dashboard');
  };

  const handleLogin = () => {
    const savedUser = JSON.parse(localStorage.getItem('arthved_user') || '{}');
    if (enteredPin === savedUser.pin) {
      setStep('dashboard');
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('arthved_user');
    setStep('welcome');
    setEnteredPin('');
  };

  const handleAddTransaction = (e) => {
    e.preventDefault();
    if (!txData.text || !txData.amount) return;
    const newTx = {
      id: Date.now(),
      ...txData,
      amount: parseFloat(txData.amount),
      date: new Date().toLocaleDateString()
    };
    setTransactions([newTx, ...transactions]);
    setIsModalOpen(false);
    setTxData({ text: '', amount: '', type: 'income', category: 'General', paymentMode: 'Cash' });
  };

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
  const netBalance = totalIncome - totalExpense;

  // 1. LOADING INTRO ANIMATION
  if (step === 'loading') {
    return (
      <div className="min-h-screen bg-[#120f0c] flex flex-col items-center justify-center font-sans text-amber-100">
        <div className="w-24 h-24 bg-gradient-to-tr from-amber-600 to-amber-400 rounded-3xl flex items-center justify-center shadow-2xl text-4xl animate-bounce mb-6 border border-amber-300/30">
          🪔
        </div>
        <h1 className="text-4xl font-black tracking-widest text-amber-500 animate-pulse">ARTHVED</h1>
        <p className="text-xs text-amber-200/60 mt-2 font-medium tracking-wider uppercase">Financial Science & Vision • Ayodhya Edition</p>
      </div>
    );
  }

  // 2. WELCOME / NEW OR OLD USER
  if (step === 'welcome') {
    return (
      <div className="min-h-screen bg-[#120f0c] flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-cover bg-center" style={{ backgroundImage: `url(${ramayanaSlides[0].image})` }}></div>
        <div className="bg-white/95 backdrop-blur-md p-8 rounded-3xl shadow-2xl max-w-md w-full border border-amber-300/40 text-center relative z-10">
          <div className="w-16 h-16 bg-amber-100 text-amber-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl shadow-inner">👁️</div>
          <h2 className="text-2xl font-black text-slate-900 mb-1">Welcome to ArthVed</h2>
          <p className="text-xs text-slate-500 mb-6">Surya ki urja, Nayan ki drishti — har hisab ekdam saaf.</p>
          
          <div className="space-y-3">
            <button 
              onClick={() => setStep('register')}
              className="w-full py-3.5 bg-amber-800 hover:bg-amber-900 text-white font-bold text-sm rounded-xl shadow-lg transition cursor-pointer"
            >
              ✨ New User (Register Vault)
            </button>
            <button 
              onClick={() => setStep('login')}
              className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm rounded-xl transition cursor-pointer"
            >
              🔑 Old User (Unlock Vault)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. REGISTRATION
  if (step === 'register') {
    return (
      <div className="min-h-screen bg-[#120f0c] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full border border-amber-200">
          <h2 className="text-xl font-black text-amber-900 mb-1">Create Your Vault</h2>
          <p className="text-xs text-slate-500 mb-6">Secure Zero-Knowledge AFS Encrypted Vault setup.</p>
          
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name / Vyapaar Name</label>
              <input 
                type="text" 
                required
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border border-amber-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">WhatsApp Number for Recovery</label>
              <input 
                type="text" 
                placeholder="10-digit number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full border border-amber-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Set Secure PIN or Password</label>
              <input 
                type="password" 
                required
                placeholder="Enter PIN (e.g. 1234 or word)"
                value={formData.pin}
                onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
                className="w-full border border-amber-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 tracking-widest"
              />
            </div>
            <button 
              type="submit"
              className="w-full py-3.5 bg-amber-800 hover:bg-amber-900 text-white font-bold text-sm rounded-xl shadow-md transition cursor-pointer mt-2"
            >
              INITIALIZE ARTHVED VAULT 🚀
            </button>
            <button 
              type="button"
              onClick={() => setStep('welcome')}
              className="w-full text-xs text-slate-500 hover:underline mt-2 text-center block"
            >
              ← Back to Welcome
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 4. LOGIN PIN SCREEN
  if (step === 'login') {
    return (
      <div className="min-h-screen bg-[#120f0c] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full border border-amber-200 text-center">
          <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-2xl flex items-center justify-center mx-auto mb-3 text-xl">🔒</div>
          <h2 className="text-2xl font-black text-slate-900 mb-1">Unlock ArthVed Vault</h2>
          <p className="text-xs text-slate-500 mb-6">Enter your 4-digit PIN or Password</p>
          
          <input 
            type="password" 
            value={enteredPin}
            onChange={(e) => setEnteredPin(e.target.value)}
            placeholder="••••" 
            className={`w-full px-4 py-3 border rounded-xl mb-2 focus:outline-none text-center tracking-widest text-lg font-bold bg-amber-50/20 ${
              pinError ? 'border-rose-500' : 'border-amber-200'
            }`}
            onKeyDown={(e) => { if (e.key === 'Enter') handleLogin(); }}
          />
          {pinError && <p className="text-xs text-rose-500 mb-4 font-medium">Wrong PIN! Please try again.</p>}
          
          <button 
            onClick={handleLogin}
            className="w-full py-3.5 bg-amber-800 hover:bg-amber-900 text-white font-bold text-sm rounded-xl shadow-md transition cursor-pointer"
          >
            Unlock Dashboard 🔓
          </button>
          
          <button 
            onClick={() => { localStorage.clear(); setStep('welcome'); }}
            className="mt-4 text-xs text-slate-400 hover:underline block mx-auto font-medium"
          >
            Reset Vault / Register New Account
          </button>
        </div>
      </div>
    );
  }

  // 5. FULL DASHBOARD WITH SIDEBAR & CINEMATIC RAMAYANA EXPERIENCE BANNER
  const slide = ramayanaSlides[currentSlide];

  return (
    <div className="min-h-screen bg-[#fefcf6] text-slate-800 flex font-sans">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-64 bg-white border-r border-amber-200 hidden md:flex flex-col justify-between p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-amber-100">
            <span className="text-2xl">🪷</span>
            <div>
              <h1 className="font-black text-amber-900 text-lg leading-tight">ArthVed</h1>
              <p className="text-[10px] text-amber-600 font-bold uppercase tracking-wider">Ayodhya Edition</p>
            </div>
          </div>

          <nav className="space-y-1">
            {['Overview', 'Transactions', 'To collect', 'Reports', 'Business setup'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full text-left px-4 py-3 rounded-xl font-bold text-xs transition cursor-pointer flex items-center gap-3 ${
                  activeTab === tab 
                    ? 'bg-amber-800 text-white shadow-md' 
                    : 'text-slate-600 hover:bg-amber-50 hover:text-amber-900'
                }`}
              >
                <span>{tab === 'Overview' ? '📊' : tab === 'Transactions' ? '📜' : tab === 'To collect' ? '📥' : tab === 'Reports' ? '📈' : '⚙️'}</span>
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="pt-4 border-t border-amber-100">
          <button
            onClick={handleLogout}
            className="w-full py-2.5 px-4 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>🔒</span> Lock Vault
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        
        {/* Top Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-amber-200 pb-4 gap-4">
          <div>
            <h2 className="text-2xl font-black text-amber-900">{activeTab}</h2>
            <p className="text-xs text-slate-500 mt-0.5">Surya ki urja, Nayan ki drishti — har hisab ekdam saaf.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-amber-800 hover:bg-amber-900 text-amber-50 px-4 py-2.5 rounded-xl font-bold text-sm shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <span>➕</span> Add Sale
            </button>
          </div>
        </header>

        {/* 🌟 CINEMATIC RAMAYANA EXPERIENCE BANNER (AUTO-SLIDING / FADING BACKGROUND EXPERIENCE) */}
        <div className="relative w-full rounded-3xl overflow-hidden shadow-xl border border-amber-300 mb-8 bg-slate-900 text-white min-h-[300px] flex items-center">
          {/* Background Image with Cinematic Overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-all duration-1000 scale-105 opacity-40"
            style={{ backgroundImage: `url(${slide.image})` }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent"></div>

          {/* Banner Content */}
          <div className="relative z-10 p-6 md:p-10 max-w-3xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-amber-500/90 text-slate-950 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow">
                {slide.badge}
              </span>
              <span className="text-amber-400 text-xs font-bold tracking-wider">✦ Valmiki Ramayana Chronicle ✦</span>
            </div>
            
            <h3 className="text-2xl md:text-3xl font-black text-amber-100 tracking-wide mb-2">
              {slide.name}
            </h3>
            <p className="text-amber-400 text-xs font-bold mb-3">{slide.title}</p>
            <p className="text-slate-300 text-xs md:text-sm leading-relaxed font-medium">
              "{slide.deed}"
            </p>

            {/* Slide Indicators */}
            <div className="flex items-center gap-2 mt-6">
              {ramayanaSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    currentSlide === idx ? 'w-8 bg-amber-400' : 'w-2 bg-white/30 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Financial Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-amber-200 shadow-sm">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Net Balance (Kosh)</p>
            <h3 className={`text-2xl font-black mt-2 ${netBalance >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
              ₹ {netBalance.toLocaleString()}
            </h3>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-amber-200 shadow-sm">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Aagman (Total Income)</p>
            <h3 className="text-2xl font-black mt-2 text-emerald-600">₹ {totalIncome.toLocaleString()}</h3>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-amber-200 shadow-sm">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Vyaya (Total Expense)</p>
            <h3 className="text-2xl font-black mt-2 text-rose-600">₹ {totalExpense.toLocaleString()}</h3>
          </div>
        </div>

        {/* Transactions List */}
        <div className="bg-white rounded-2xl border border-amber-200 shadow-sm p-6 mb-12">
          <h2 className="text-xl font-bold text-amber-900 mb-4 flex items-center gap-2">
            <span>📜</span> Karma Lekha (Recent Transactions)
          </h2>
          {transactions.length === 0 ? (
            <p className="text-sm text-slate-500 py-8 text-center">Abhi tak koi bhi len-den darj nahi kiya gaya hai.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-amber-100 text-xs text-amber-900 uppercase">
                    <th className="py-3 px-4">Vivaran (Description)</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Payment Mode</th>
                    <th className="py-3 px-4">Rashi (Amount)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-50 text-sm">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-amber-50/50">
                      <td className="py-3 px-4 font-semibold text-slate-800">{tx.text}</td>
                      <td className="py-3 px-4 text-slate-600">{tx.category || 'General'}</td>
                      <td className="py-3 px-4">
                        <span className="bg-amber-100 text-amber-900 text-xs px-2 py-1 rounded-md font-bold">
                          {tx.paymentMode || 'Cash'}
                        </span>
                      </td>
                      <td className={`py-3 px-4 font-bold ${tx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {tx.type === 'income' ? '+' : '-'} ₹ {Math.abs(tx.amount).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Transaction Modal with Cancel Button */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-amber-200 relative animate-in fade-in zoom-in duration-200">
            
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-amber-100">
              <h3 className="text-lg font-bold text-amber-900">Naya Karma Lekha Jodein</h3>
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-rose-600 text-xl font-bold p-1 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddTransaction} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Vivaran (Description)</label>
                <input 
                  type="text" 
                  required
                  placeholder="Jaise: Yajna Samagri, Seva daan..."
                  value={txData.text}
                  onChange={(e) => setTxData({ ...txData, text: e.target.value })}
                  className="w-full border border-amber-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Rashi (Amount in ₹)</label>
                <input 
                  type="number" 
                  required
                  placeholder="0.00"
                  value={txData.amount}
                  onChange={(e) => setTxData({ ...txData, amount: e.target.value })}
                  className="w-full border border-amber-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Prakar (Type)</label>
                  <select 
                    value={txData.type}
                    onChange={(e) => setTxData({ ...txData, type: e.target.value })}
                    className="w-full border border-amber-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                  >
                    <option value="income">Aagman (Income)</option>
                    <option value="expense">Vyaya (Expense)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Payment Mode</label>
                  <select 
                    value={txData.paymentMode}
                    onChange={(e) => setTxData({ ...txData, paymentMode: e.target.value })}
                    className="w-full border border-amber-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                  >
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI</option>
                    <option value="Online">Online</option>
                    <option value="Credit Sales">Credit Sales</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Category</label>
                <input 
                  type="text" 
                  placeholder="Jaise: Samagri, Bhent, Nivesh..."
                  value={txData.category}
                  onChange={(e) => setTxData({ ...txData, category: e.target.value })}
                  className="w-full border border-amber-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-amber-100">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-amber-800 hover:bg-amber-900 text-amber-50 px-5 py-2.5 rounded-xl text-sm font-bold shadow-md transition-all cursor-pointer"
                >
                  Surakshit Karein
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
