'use client'

import React, { useState, useEffect } from 'react'

const ramayanaCharacters = [
  {
    name: "Shri Ram (श्री राम)",
    title: "Maryada Purushottam",
    deed: "Pita ke vachan hetu 14 varsh ka vanvas sweekar kiya aur asatya par satya ki vijay sthapit ki.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Lord_Rama_drawing.jpg/440px-Lord_Rama_drawing.jpg",
    badge: "The Supreme Ideal"
  },
  {
    name: "Mata Sita (माता सीता)",
    title: "Pavitrata & Tyag ki Moorti",
    deed: "Rajya ke sabhi sukhon ka tyag karke vanvas mein sahayatri bani aur atulya dhairya ka parichay diya.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Sita_Ram_Lakshman_Hanuman.jpg/500px-Sita_Ram_Lakshman_Hanuman.jpg",
    badge: "Devotion & Grace"
  },
  {
    name: "Lakshman ji (लक्ष्मण जी)",
    title: "Bhratruprem & Nishtha",
    deed: "Bina ek pal soche bade bhai Shri Ram aur bhabhi ke sath vanvas gaye aur din-raat adig pehra diya.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Lakshmana_in_Ramayana.jpg/400px-Lakshmana_in_Ramayana.jpg",
    badge: "Eternal Loyalty"
  },
  {
    name: "Jatayu (जटायु)",
    title: "Param Pakshiraj & Yoddha",
    deed: "Mata Sita ki raksha ke liye akash mein Ravan se bhayanak yuddh kiya aur apna jeevan samarpit kiya.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Jatayu_Fights_Ravana.jpg/500px-Jatayu_Fights_Ravana.jpg",
    badge: "The Brave Protector"
  },
  {
    name: "Hanuman ji (हनुमान जी)",
    title: "Pawanputra & Sankat Mochan",
    deed: "Samudra langh kar Lanka mein Mata Sita ki khoj ki, Lanka dahan kiya aur Sanjeevani se pran bachaye.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Lord_Hanuman.jpg/440px-Lord_Hanuman.jpg",
    badge: "Supreme Devotee"
  },
  {
    name: "Sugriva & Angada (सुग्रीव व अंगद)",
    title: "Kishkindha Allies & Leaders",
    deed: "Shri Ram ke sath sachha mitrata ka vachan nibhaya aur mahan Vanara sena ka netritva kiya.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Sugriva_fighting_Vali.jpg/500px-Sugriva_fighting_Vali.jpg",
    badge: "The Vanara Strength"
  },
  {
    name: "Jambavan (जाम्बवान जी)",
    title: "Riksharaj & Wise Elder",
    deed: "Apni agya aur gyan se Hanuman ji ko unki alaukik shaktiyon ka smaran karaya.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Jambavan.jpg/400px-Jambavan.jpg",
    badge: "Divine Wisdom"
  },
  {
    name: "Nala & Nila (नल और नीलकंठ)",
    title: "Divine Architects",
    deed: "Vishwakarma ke aashirwad aur gyan se samudra par mahan 'Ram Setu' ka nirmaan kiya.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Rama_Setu_Construction.jpg/500px-Rama_Setu_Construction.jpg",
    badge: "Master Engineers"
  }
];

export default function HisabApp() {
  const [step, setStep] = useState('loading'); // loading -> welcome -> register -> login -> dashboard
  const [userType, setUserType] = useState(null); // 'new' or 'old'
  const [formData, setFormData] = useState({ name: '', phone: '', pin: '' });
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);

  // Dashboard States
  const [transactions, setTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [txData, setTxData] = useState({ text: '', amount: '', type: 'income', category: 'General', paymentMode: 'Cash' });

  useEffect(() => {
    // Initial loading animation timer
    const timer = setTimeout(() => {
      const savedUser = localStorage.getItem('arthved_user');
      if (savedUser) {
        setStep('login');
      } else {
        setStep('welcome');
      }
    }, 2000);
    return () => clearTimeout(timer);
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

  // 1. LOADING ANIMATION SCREEN
  if (step === 'loading') {
    return (
      <div className="min-h-screen bg-[#fefcf6] flex flex-col items-center justify-center font-sans">
        <div className="w-20 h-20 bg-gradient-to-tr from-amber-600 to-amber-400 rounded-3xl flex items-center justify-center shadow-xl text-3xl animate-bounce text-white mb-4">
          🪔
        </div>
        <h1 className="text-3xl font-black text-amber-900 tracking-wider animate-pulse">ArthVed</h1>
        <p className="text-xs text-slate-500 mt-2 font-medium">Surya ki urja, Nayan ki drishti — har hisab ekdam saaf.</p>
      </div>
    );
  }

  // 2. WELCOME / NEW OR OLD USER SCREEN
  if (step === 'welcome') {
    return (
      <div className="min-h-screen bg-[#fefcf6] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full border border-amber-200 text-center">
          <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">👁️</div>
          <h2 className="text-2xl font-black text-slate-900 mb-1">Welcome to ArthVed</h2>
          <p className="text-xs text-slate-500 mb-6">Financial Science & Vision • Ayodhya Edition</p>
          
          <div className="space-y-3">
            <button 
              onClick={() => { setUserType('new'); setStep('register'); }}
              className="w-full py-3.5 bg-amber-800 hover:bg-amber-900 text-white font-bold text-sm rounded-xl shadow-md transition cursor-pointer"
            >
              ✨ New User (Register)
            </button>
            <button 
              onClick={() => { setUserType('old'); setStep('login'); }}
              className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm rounded-xl transition cursor-pointer"
            >
              🔑 Old User (Login)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. REGISTRATION SCREEN (Name, Phone, Secure PIN Setup)
  if (step === 'register') {
    return (
      <div className="min-h-screen bg-[#fefcf6] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full border border-amber-200">
          <h2 className="text-xl font-black text-amber-900 mb-1">Create Your Vault</h2>
          <p className="text-xs text-slate-500 mb-6">Enter your details to secure your financial records.</p>
          
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name</label>
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
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">WhatsApp / Phone</label>
              <input 
                type="text" 
                placeholder="For recovery purpose"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full border border-amber-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Set Secure PIN (Letters or Numbers)</label>
              <input 
                type="password" 
                required
                placeholder="Enter PIN / Password"
                value={formData.pin}
                onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
                className="w-full border border-amber-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 tracking-widest"
              />
            </div>
            <button 
              type="submit"
              className="w-full py-3.5 bg-amber-800 hover:bg-amber-900 text-white font-bold text-sm rounded-xl shadow-md transition cursor-pointer mt-2"
            >
              Initialize Vault 🚀
            </button>
            <button 
              type="button"
              onClick={() => setStep('welcome')}
              className="w-full text-xs text-slate-500 hover:underline mt-2 text-center block"
            >
              ← Back
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 4. LOGIN SCREEN (Enter PIN)
  if (step === 'login') {
    return (
      <div className="min-h-screen bg-[#fefcf6] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full border border-amber-200 text-center">
          <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-3 text-xl">🔒</div>
          <h2 className="text-2xl font-black text-slate-900 mb-1">Unlock ArthVed</h2>
          <p className="text-xs text-slate-500 mb-6">Enter your secure PIN or Password to access vault.</p>
          
          <input 
            type="password" 
            value={enteredPin}
            onChange={(e) => setEnteredPin(e.target.value)}
            placeholder="Enter PIN / Password" 
            className={`w-full px-4 py-3 border rounded-xl mb-2 focus:outline-none text-center tracking-widest text-sm bg-amber-50/20 ${
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

  // 5. MAIN DASHBOARD WITH PERMANENT RAMAYANA CHRONICLE
  return (
    <div className="min-h-screen bg-[#fefcf6] text-slate-800 p-4 md:p-8 font-sans">
      {/* Header */}
      <header className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center mb-8 border-b border-amber-200 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-amber-900 tracking-tight flex items-center gap-2">
            <span>🪷</span> ArthVed Ledger <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full border border-amber-300">Ayodhya Edition</span>
          </h1>
          <p className="text-xs text-slate-600 mt-1">Dharmik Niti aur Vanara Sena ke prabandh par aadharit financial vault.</p>
        </div>
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-amber-800 hover:bg-amber-900 text-amber-50 px-4 py-2.5 rounded-xl font-bold text-sm shadow-md transition flex items-center gap-2 cursor-pointer"
          >
            <span>➕</span> Add Sale
          </button>
          <button
            onClick={handleLogout}
            className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-2.5 rounded-xl font-bold text-xs cursor-pointer"
          >
            Lock Vault 🔒
          </button>
        </div>
      </header>

      {/* Main Stats Cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
      <div className="max-w-6xl mx-auto bg-white rounded-2xl border border-amber-200 shadow-sm p-6 mb-12">
        <h2 className="text-xl font-bold text-amber-900 mb-4 flex items-center gap-2">
          <span>📜</span> Karma Lekha (Recent Transactions)
        </h2>
        {transactions.length === 0 ? (
          <p className="text-sm text-slate-500 py-6 text-center">Abhi tak koi bhi len-den darj nahi kiya gaya hai.</p>
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

      {/* PERMANENT VALMIKI RAMAYANA & KISHKINDHA CHRONICLE */}
      <div className="max-w-6xl mx-auto bg-[#fefcf6] border-2 border-amber-300 rounded-3xl p-6 md:p-10 my-10 shadow-xl text-slate-900">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-3xl">🏹🪷</span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-amber-900 mt-2 tracking-wide">
            Valmiki Ramayana & Kishkindha Chronicle
          </h2>
          <p className="text-sm text-slate-700 mt-2 font-medium">
            The immortal legacy and timeless inspiration of Shri Ram, Mata Sita, Lakshman ji, Jatayu, and the mighty Vanara Army who established eternal righteousness.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ramayanaCharacters.map((char, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl overflow-hidden border border-amber-200 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 w-full overflow-hidden bg-amber-50">
                  <img 
                    src={char.image} 
                    alt={char.name} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <div className="absolute top-3 right-3 bg-amber-900/90 backdrop-blur-sm text-amber-100 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
                    {char.badge}
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-extrabold text-amber-900 text-base leading-snug">{char.name}</h3>
                  <p className="text-xs font-bold text-amber-600 mt-0.5">{char.title}</p>
                  <p className="text-xs text-slate-600 mt-3 leading-relaxed">{char.deed}</p>
                </div>
              </div>
              
              <div className="p-5 pt-0">
                <div className="pt-3 border-t border-amber-100 flex items-center justify-between text-[11px] font-bold text-amber-800">
                  <span>Valmiki Ramayana</span>
                  <span>✦ 🪔 ✦</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction Modal with Cancel Button */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-amber-200 relative">
            
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
