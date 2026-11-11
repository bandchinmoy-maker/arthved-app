'use client'

import React, { useState, useEffect } from 'react'

const ramayanaSlides = [
  { name: "Shri Ram (श्री राम)", title: "Maryada Purushottam — The Supreme Ideal", deed: "Pita ke vachan hetu 14 varsh ka vanvas sweekar kiya aur asatya par satya ki vijay sthapit karke maryada ka adarsh sthapit kiya.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Lord_Rama_drawing.jpg/440px-Lord_Rama_drawing.jpg", badge: "Divine Epitome" },
  { name: "Mata Sita (माता सीता)", title: "Pavitrata & Tyag ki Moorti", deed: "Rajya ke sabhi sukhon ka tyag karke vanvas mein sahayatri bani, atulya dhairya aur aatma-bal ka sacha parichay diya.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Sita_Ram_Lakshman_Hanuman.jpg/500px-Sita_Ram_Lakshman_Hanuman.jpg", badge: "Grace & Resilience" },
  { name: "Lakshman ji (लक्ष्मण जी)", title: "Bhratruprem & Nishtha", deed: "Bina ek pal soche bade bhai Shri Ram aur bhabhi ke sath vanvas gaye aur din-raat adig pehra dekar lakshman rekha ki maryada rakhi.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Lakshmana_in_Ramayana.jpg/400px-Lakshmana_in_Ramayana.jpg", badge: "Eternal Loyalty" },
  { name: "Hanuman ji (हनुमान जी)", title: "Pawanputra & Sankat Mochan", deed: "Samudra langh kar Lanka mein Mata Sita ki khoj ki, Lanka dahan kiya aur Sanjeevani booti laakar lakshman ji ke pran bachaye.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Lord_Hanuman.jpg/440px-Lord_Hanuman.jpg", badge: "Supreme Devotee" },
  { name: "Jatayu (जटायु)", title: "Param Pakshiraj & Yoddha", deed: "Mata Sita ki raksha ke liye akash mein Ravan se bhayanak yuddh kiya aur dharm ke liye apne praan samarpit kiye.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Jatayu_Fights_Ravana.jpg/500px-Jatayu_Fights_Ravana.jpg", badge: "Brave Protector" },
  { name: "Sugriva & Angada (सुग्रीव व अंगद)", title: "Kishkindha Leaders", deed: "Shri Ram ke sath sachha mitrata ka vachan nibhaya aur mahan Vanara sena ka netritva karke adharm ka nash kiya.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Sugriva_fighting_Vali.jpg/500px-Sugriva_fighting_Vali.jpg", badge: "Vanara Strength" },
  { name: "Jambavan (जाम्बवान जी)", title: "Riksharaj & Wise Elder", deed: "Apni agya aur gyan se Hanuman ji ko unki alaukik shaktiyon ka smaran karaya aur yuddh mein param margdarshan diya.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Jambavan.jpg/400px-Jambavan.jpg", badge: "Divine Wisdom" },
  { name: "Nala & Nila (नल और नीलकंठ)", title: "Divine Architects", deed: "Vishwakarma ke aashirwad aur gyan se samudra par mahan 'Ram Setu' ka nirmaan kiya jisse sena Lanka pahunchi.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Rama_Setu_Construction.jpg/500px-Rama_Setu_Construction.jpg", badge: "Master Engineers" }
];

const TABS = ['Overview', 'Transactions', 'To collect', 'Reports', 'Business setup'];
const ICONS = { 'Overview': '📊', 'Transactions': '📜', 'To collect': '📥', 'Reports': '📈', 'Business setup': '⚙️' };

// Shared styles (so we do not repeat long class names everywhere)
const screenCls = 'min-h-screen bg-[#120f0c] flex items-center justify-center p-4';
const inputCls = 'w-full border border-amber-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white';
const labelCls = 'block text-xs font-bold text-slate-700 uppercase mb-1';
const primaryBtn = 'w-full py-3.5 bg-amber-800 hover:bg-amber-900 text-white font-bold text-sm rounded-xl shadow-md transition cursor-pointer';
const emptyTx = { text: '', amount: '', type: 'income', category: 'General', paymentMode: 'Cash' };

export default function HisabApp() {
  const [step, setStep] = useState('loading');
  const [activeTab, setActiveTab] = useState('Overview');
  const [currentSlide, setCurrentSlide] = useState(0);

  const [formData, setFormData] = useState({ name: '', phone: '', pin: '' });
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);

  const [transactions, setTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [txData, setTxData] = useState(emptyTx);

  // Splash screen: also loads saved transactions
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const savedTx = localStorage.getItem('arthved_tx');
        if (savedTx) setTransactions(JSON.parse(savedTx));
      } catch (err) {
        console.error('Could not read saved transactions', err);
      }
      setStep(localStorage.getItem('arthved_user') ? 'login' : 'welcome');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % ramayanaSlides.length);
    }, 5000);
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
      setEnteredPin('');
    } else {
      setPinError(true);
    }
  };

  // FIXED: locking only goes to the login screen. It no longer deletes the account.
  const handleLock = () => {
    setStep('login');
    setEnteredPin('');
    setPinError(false);
  };

  const handleResetVault = () => {
    localStorage.removeItem('arthved_user');
    localStorage.removeItem('arthved_tx');
    setTransactions([]);
    setStep('welcome');
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
    const updated = [newTx, ...transactions];
    setTransactions(updated);
    // FIXED: save so data stays after refresh
    localStorage.setItem('arthved_tx', JSON.stringify(updated));
    setIsModalOpen(false);
    setTxData(emptyTx);
  };

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((a, c) => a + c.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((a, c) => a + c.amount, 0);
  const netBalance = totalIncome - totalExpense;

  if (step === 'loading') {
    return (
      <div className="min-h-screen bg-[#120f0c] flex flex-col items-center justify-center font-sans text-amber-100">
        <div className="w-24 h-24 bg-gradient-to-tr from-amber-600 to-amber-400 rounded-3xl flex items-center justify-center shadow-2xl text-4xl animate-bounce mb-6 border border-amber-300/30">🪔</div>
        <h1 className="text-4xl font-black tracking-widest text-amber-500 animate-pulse">ARTHVED</h1>
        <p className="text-xs text-amber-200/60 mt-2 font-medium tracking-wider uppercase">Financial Science & Vision • Ayodhya Edition</p>
      </div>
    );
  }

  if (step === 'welcome') {
    return (
      <div className={screenCls}>
        <div className="bg-white/95 backdrop-blur-md p-8 rounded-3xl shadow-2xl max-w-md w-full border border-amber-300/40 text-center">
          <div className="w-16 h-16 bg-amber-100 text-amber-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl shadow-inner">👁️</div>
          <h2 className="text-2xl font-black text-slate-900 mb-1">Welcome to ArthVed</h2>
          <p className="text-xs text-slate-500 mb-6">Surya ki urja, Nayan ki drishti — har hisab ekdam saaf.</p>
          <div className="space-y-3">
            <button onClick={() => setStep('register')} className={primaryBtn}>✨ New User (Register Vault)</button>
            <button onClick={() => setStep('login')} className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm rounded-xl transition cursor-pointer">🔑 Old User (Unlock Vault)</button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'register') {
    return (
      <div className={screenCls}>
        <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full border border-amber-200">
          <h2 className="text-xl font-black text-amber-900 mb-1">Create Your Vault</h2>
          <p className="text-xs text-slate-500 mb-6">Set your name and a PIN to protect your accounts on this device.</p>
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className={labelCls}>Full Name / Vyapaar Name</label>
              <input type="text" required placeholder="Enter your name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>WhatsApp Number for Recovery</label>
              <input type="text" placeholder="10-digit number" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Set Secure PIN or Password</label>
              <input type="password" required placeholder="Enter PIN (e.g. 1234 or word)" value={formData.pin} onChange={(e) => setFormData({ ...formData, pin: e.target.value })} className={inputCls + ' tracking-widest'} />
            </div>
            <button type="submit" className={primaryBtn + ' mt-2'}>INITIALIZE ARTHVED VAULT 🚀</button>
            <button type="button" onClick={() => setStep('welcome')} className="w-full text-xs text-slate-500 hover:underline mt-2 text-center block">← Back to Welcome</button>
          </form>
        </div>
      </div>
    );
  }

  if (step === 'login') {
    return (
      <div className={screenCls}>
        <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full border border-amber-200 text-center">
          <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-2xl flex items-center justify-center mx-auto mb-3 text-xl">🔒</div>
          <h2 className="text-2xl font-black text-slate-900 mb-1">Unlock ArthVed Vault</h2>
          <p className="text-xs text-slate-500 mb-6">Enter your PIN or Password</p>
          <input
            type="password"
            value={enteredPin}
            onChange={(e) => setEnteredPin(e.target.value)}
            placeholder="••••"
            className={`w-full px-4 py-3 border rounded-xl mb-2 focus:outline-none text-center tracking-widest text-lg font-bold bg-amber-50/20 ${pinError ? 'border-rose-500' : 'border-amber-200'}`}
            onKeyDown={(e) => { if (e.key === 'Enter') handleLogin(); }}
          />
          {pinError && <p className="text-xs text-rose-500 mb-4 font-medium">Wrong PIN! Please try again.</p>}
          <button onClick={handleLogin} className={primaryBtn}>Unlock Dashboard 🔓</button>
          <button
            onClick={() => { if (window.confirm('This will delete your account AND all saved transactions on this device. Continue?')) handleResetVault(); }}
            className="mt-4 text-xs text-slate-400 hover:underline block mx-auto font-medium"
          >
            Reset Vault / Register New Account
          </button>
        </div>
      </div>
    );
  }

  const slide = ramayanaSlides[currentSlide];

  const txTable = (
    <div className="bg-white rounded-2xl border border-amber-200 shadow-sm p-6 mb-12">
      <h2 className="text-xl font-bold text-amber-900 mb-4 flex items-center gap-2"><span>📜</span> Karma Lekha (Transactions)</h2>
      {transactions.length === 0 ? (
        <p className="text-sm text-slate-500 py-8 text-center">Abhi tak koi bhi len-den darj nahi kiya gaya hai.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-amber-100 text-xs text-amber-900 uppercase">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Vivaran (Description)</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Payment Mode</th>
                <th className="py-3 px-4">Rashi (Amount)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-50 text-sm">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-amber-50/50">
                  <td className="py-3 px-4 text-slate-500">{tx.date}</td>
                  <td className="py-3 px-4 font-semibold text-slate-800">{tx.text}</td>
                  <td className="py-3 px-4 text-slate-600">{tx.category || 'General'}</td>
                  <td className="py-3 px-4"><span className="bg-amber-100 text-amber-900 text-xs px-2 py-1 rounded-md font-bold">{tx.paymentMode || 'Cash'}</span></td>
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
  );

  return (
    <div className="min-h-screen bg-[#fefcf6] text-slate-800 flex font-sans">
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
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full text-left px-4 py-3 rounded-xl font-bold text-xs transition cursor-pointer flex items-center gap-3 ${activeTab === tab ? 'bg-amber-800 text-white shadow-md' : 'text-slate-600 hover:bg-amber-50 hover:text-amber-900'}`}
              >
                <span>{ICONS[tab]}</span>{tab}
              </button>
            ))}
          </nav>
        </div>
        <div className="pt-4 border-t border-amber-100">
          <button onClick={handleLock} className="w-full py-2.5 px-4 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer">
            <span>🔒</span> Lock Vault
          </button>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-8 overflow-y-auto min-w-0">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 border-b border-amber-200 pb-4 gap-4">
          <div>
            <h2 className="text-2xl font-black text-amber-900">{activeTab}</h2>
            <p className="text-xs text-slate-500 mt-0.5">Surya ki urja, Nayan ki drishti — har hisab ekdam saaf.</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setIsModalOpen(true)} className="bg-amber-800 hover:bg-amber-900 text-amber-50 px-4 py-2.5 rounded-xl font-bold text-sm shadow-md transition flex items-center gap-2 cursor-pointer">
              <span>➕</span> Add Sale / Expense
            </button>
            {/* NEW: lock button for phones */}
            <button onClick={handleLock} className="md:hidden bg-slate-100 text-slate-700 px-3 py-2.5 rounded-xl font-bold text-sm cursor-pointer">🔒</button>
          </div>
        </header>

        {/* NEW: tab menu for phones */}
        <div className="md:hidden flex gap-2 overflow-x-auto pb-3 mb-4">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap px-3 py-2 rounded-xl font-bold text-xs cursor-pointer ${activeTab === tab ? 'bg-amber-800 text-white' : 'bg-white border border-amber-200 text-slate-600'}`}
            >
              {ICONS[tab]} {tab}
            </button>
          ))}
        </div>

        {/* Ramayana banner now shows only on Overview */}
        {activeTab === 'Overview' && (
          <div className="relative w-full rounded-3xl overflow-hidden shadow-xl border border-amber-300 mb-8 bg-slate-900 text-white min-h-[320px] flex items-center">
            <div className="absolute inset-0 bg-cover bg-center transition-all duration-700 opacity-30" style={{ backgroundImage: `url(${slide.image})` }}></div>
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent"></div>
            <div className="relative z-10 p-6 md:p-10 flex flex-col md:flex-row items-center gap-6 w-full">
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl overflow-hidden border-2 border-amber-400/80 shadow-2xl flex-shrink-0 bg-amber-950">
                <img src={slide.image} alt={slide.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow">{slide.badge}</span>
                  <span className="text-amber-300 text-xs font-bold">✦ Valmiki Ramayana Chronicle ✦</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-amber-100 tracking-wide mb-1">{slide.name}</h3>
                <p className="text-amber-400 text-xs font-bold mb-2">{slide.title}</p>
                <p className="text-slate-200 text-xs md:text-sm leading-relaxed font-medium max-w-2xl">"{slide.deed}"</p>
                <div className="flex items-center gap-2 mt-4">
                  {ramayanaSlides.map((_, idx) => (
                    <button key={idx} onClick={() => setCurrentSlide(idx)} className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${currentSlide === idx ? 'w-8 bg-amber-400' : 'w-2 bg-white/30 hover:bg-white/60'}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Overview' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-2xl border border-amber-200 shadow-sm">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Net Balance (Kosh)</p>
                <h3 className={`text-2xl font-black mt-2 ${netBalance >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>₹ {netBalance.toLocaleString()}</h3>
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
            {txTable}
          </>
        )}

        {activeTab === 'Transactions' && txTable}

        {activeTab !== 'Overview' && activeTab !== 'Transactions' && (
          <div className="bg-white rounded-2xl border border-amber-200 shadow-sm p-8 text-center">
            <h3 className="text-xl font-bold text-amber-900 mb-2">{activeTab}</h3>
            <p className="text-sm text-slate-500">Yeh section jald aa raha hai (coming soon).</p>
          </div>
        )}
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-amber-200">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-amber-100">
              <h3 className="text-lg font-bold text-amber-900">Naya Karma Lekha Jodein</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-rose-600 text-xl font-bold p-1 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer">✕</button>
            </div>
            <form onSubmit={handleAddTransaction} className="space-y-4">
              <div>
                <label className={labelCls}>Vivaran (Description)</label>
                <input type="text" required placeholder="Jaise: Yajna Samagri, Seva daan..." value={txData.text} onChange={(e) => setTxData({ ...txData, text: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Rashi (Amount in ₹)</label>
                <input type="number" required min="0" step="0.01" placeholder="0.00" value={txData.amount} onChange={(e) => setTxData({ ...txData, amount: e.target.value })} className={inputCls} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Prakar (Type)</label>
                  <select value={txData.type} onChange={(e) => setTxData({ ...txData, type: e.target.value })} className={inputCls}>
                    <option value="income">Aagman (Income)</option>
                    <option value="expense">Vyaya (Expense)</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Payment Mode</label>
                  <select value={txData.paymentMode} onChange={(e) => setTxData({ ...txData, paymentMode: e.target.value })} className={inputCls}>
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI</option>
                    <option value="Online">Online</option>
                    <option value="Credit Sales">Credit Sales</option>
                  </select>
                </div>
              </div>
              <div>
                <label className={labelCls}>Category</label>
                <input type="text" placeholder="Jaise: Samagri, Bhent, Nivesh..." value={txData.category} onChange={(e) => setTxData({ ...txData, category: e.target.value })} className={inputCls} />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-amber-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer">Cancel</button>
                <button type="submit" className="bg-amber-800 hover:bg-amber-900 text-amber-50 px-5 py-2.5 rounded-xl text-sm font-bold shadow-md transition-all cursor-pointer">Surakshit Karein</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
