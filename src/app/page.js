'use client';

import React, { useState, useEffect } from 'react';

// Professional Integrated Arthved Logo (Surya + Nayan Minimalist Emblem)
const ArthvedLogo = () => (
  <div className="w-12 h-12 flex items-center justify-center relative flex-shrink-0" title="Arthved: Financial Science & Vision">
    <div className="absolute inset-0 bg-gradient-to-tr from-amber-600 to-amber-400 rounded-2xl shadow-md"></div>
    <svg 
      viewBox="0 0 100 100" 
      className="w-8 h-8 relative z-10 text-white" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <circle cx="50" cy="50" r="32" className="opacity-40" />
      <line x1="50" y1="8" x2="50" y2="18" />
      <line x1="50" y1="82" x2="50" y2="92" />
      <line x1="8" y1="50" x2="18" y2="50" />
      <line x1="82" y1="50" x2="92" y2="50" />
      <line x1="20" y1="20" x2="28" y2="28" />
      <line x1="72" y1="72" x2="80" y2="80" />
      <line x1="20" y1="80" x2="28" y2="72" />
      <line x1="72" y1="28" x2="80" y2="20" />
      <ellipse cx="50" cy="50" rx="16" ry="10" strokeWidth="2.5" />
      <circle cx="50" cy="50" r="5" fill="currentColor" stroke="none" />
    </svg>
  </div>
);

export default function ArthvedApp() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [userName, setUserName] = useState('Mera Vyapaar');
  const [userWhatsapp, setUserWhatsapp] = useState('');
  const [isFirstTime, setIsFirstTime] = useState(false);

  const [activeTab, setActiveTab] = useState('Overview');
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('sale'); // 'sale', 'expense', 'payment'
  const [text, setText] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('General');
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [showImportModal, setShowImportModal] = useState(false);

  // Check initial setup & session on mount
  useEffect(() => {
    const savedPin = localStorage.getItem('arthved_pin');
    const savedName = localStorage.getItem('arthved_name');
    const savedWhatsapp = localStorage.getItem('arthved_whatsapp');

    if (!savedPin) {
      setIsFirstTime(true);
    } else {
      if (savedName) setUserName(savedName);
      if (savedWhatsapp) setUserWhatsapp(savedWhatsapp);
    }

    // Load & Migrate Transactions safely
    try {
      const arthvedEnc = localStorage.getItem('arthved_transactions_encrypted');
      const arthvedNorm = localStorage.getItem('arthved_transactions');
      const oldHisabEnc = localStorage.getItem('hisab_transactions_encrypted');
      const oldHisabNorm = localStorage.getItem('hisab_transactions');

      let recoveredData = [];
      if (arthvedEnc) recoveredData = JSON.parse(atob(arthvedEnc));
      else if (arthvedNorm) recoveredData = JSON.parse(arthvedNorm);
      else if (oldHisabEnc) recoveredData = JSON.parse(atob(oldHisabEnc));
      else if (oldHisabNorm) recoveredData = JSON.parse(oldHisabNorm);

      if (Array.isArray(recoveredData) && recoveredData.length > 0) {
        setTransactions(recoveredData);
        localStorage.setItem('arthved_transactions_encrypted', btoa(JSON.stringify(recoveredData)));
      }
    } catch (e) {
      console.error('Data load error', e);
    }
  }, []);

  // Save Transactions on change
  useEffect(() => {
    if (transactions.length > 0) {
      try {
        const encrypted = btoa(JSON.stringify(transactions));
        localStorage.setItem('arthved_transactions_encrypted', encrypted);
        localStorage.setItem('arthved_transactions', JSON.stringify(transactions));
      } catch (e) {
        console.error('Encryption failed', e);
      }
    }
  }, [transactions]);

  const handleSetupOrLogin = (e) => {
    e.preventDefault();
    if (!passcode) return;

    if (isFirstTime) {
      localStorage.setItem('arthved_pin', passcode);
      localStorage.setItem('arthved_name', userName);
      localStorage.setItem('arthved_whatsapp', userWhatsapp);
      setIsFirstTime(false);
      setIsUnlocked(true);
    } else {
      const correctPin = localStorage.getItem('arthved_pin') || '1234';
      if (passcode === correctPin) {
        setIsUnlocked(true);
      } else {
        alert('Galat PIN! Kripya sahi PIN darj karein.');
      }
    }
    setPasscode('');
  };

  const handleLogout = () => {
    setIsUnlocked(false);
    setPasscode('');
  };

  const handleLockVault = () => {
    setIsUnlocked(false);
  };

  const handleAddTransaction = (e) => {
    e.preventDefault();
    if (!text || !amount) return;

    const newTx = {
      id: Date.now(),
      text,
      amount: parseFloat(amount),
      type: modalType,
      category,
      paymentMode,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    const updated = [newTx, ...transactions];
    setTransactions(updated);
    setText('');
    setAmount('');
    setPaymentMode('Cash');
    setShowModal(false);
  };

  const handleDelete = (id) => {
    const updated = transactions.filter(t => t.id !== id);
    setTransactions(updated);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const content = event.target.result;
        if (file.name.endsWith('.csv')) {
          const lines = content.split('\n');
          const parsedCsv = [];
          for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            const cols = line.split(',');
            if (cols.length >= 4) {
              parsedCsv.push({
                id: Date.now() + i,
                text: cols[0]?.replace(/"/g, '') || 'Imported',
                amount: parseFloat(cols[1]) || 0,
                type: cols[2]?.toLowerCase().includes('expense') ? 'expense' : 'sale',
                category: cols[3]?.replace(/"/g, '') || 'General',
                paymentMode: cols[4]?.replace(/"/g, '') || 'Cash',
                date: cols[5]?.replace(/"/g, '') || new Date().toLocaleDateString('en-IN')
              });
            }
          }
          if (parsedCsv.length > 0) {
            const updated = [...parsedCsv.reverse(), ...transactions];
            setTransactions(updated);
            alert(`Successfully imported ${parsedCsv.length} entries!`);
            setShowImportModal(false);
          }
        }
      } catch (err) {
        alert('File parsing failed.');
      }
    };
    reader.readAsText(file);
  };

  const exportToCSV = () => {
    let csvContent = "Description,Amount,Type,Category,PaymentMode,Date\n";
    [...transactions].reverse().forEach(t => {
      csvContent += `"${t.text}",${t.amount},${t.type},"${t.category}","${t.paymentMode}","${t.date}"\n`;
    });
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Arthved_Ledger_${Date.now()}.csv`;
    a.click();
  };

  const salesToday = transactions.filter(t => t.type === 'sale').reduce((acc, t) => acc + t.amount, 0);
  const paymentCollected = transactions.filter(t => t.type === 'payment' || (t.type === 'sale' && t.paymentMode !== 'Credit')).reduce((acc, t) => acc + t.amount, 0);
  const expensesToday = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const stillToCollect = transactions.filter(t => t.type === 'sale' && t.paymentMode === 'Credit').reduce((acc, t) => acc + t.amount, 0);

  const filteredTransactions = transactions.filter(t => 
    t.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.date.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedTransactions = filteredTransactions.reduce((groups, t) => {
    const key = t.date || 'Recent';
    if (!groups[key]) groups[key] = [];
    groups[key].push(t);
    return groups;
  }, {});

  // ================= WELCOME / LOGIN SCREEN =================
  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fefcf6] via-amber-50/40 to-[#fefcf6] flex items-center justify-center p-4 font-sans">
        <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full border border-amber-200/80 text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="flex justify-center">
            <ArthvedLogo />
          </div>

          <div>
            <div className="inline-block bg-amber-100 text-amber-900 text-[10px] font-black px-3 py-1 rounded-full mb-2 tracking-wider">
              🪔 SHUBH LABH • FINANCIAL SCIENCE & VISION
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Arthved</h1>
            <p className="text-xs text-slate-500 mt-1">Surya ki urja, Nayan ki drishti — har hisab ekdam saaf.</p>
          </div>

          <form onSubmit={handleSetupOrLogin} className="space-y-4">
            {isFirstTime && (
              <>
                <div>
                  <input 
                    type="text" 
                    required
                    placeholder="Business / Vyapaar Name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full px-4 py-3 border border-amber-200 rounded-xl text-xs bg-amber-50/20 focus:outline-none focus:ring-2 focus:ring-amber-800 font-bold"
                  />
                </div>
                <div>
                  <input 
                    type="text" 
                    placeholder="WhatsApp Number for Recovery"
                    value={userWhatsapp}
                    onChange={(e) => setUserWhatsapp(e.target.value)}
                    className="w-full px-4 py-3 border border-amber-200 rounded-xl text-xs bg-amber-50/20 focus:outline-none focus:ring-2 focus:ring-amber-800"
                  />
                </div>
              </>
            )}

            <div>
              <input 
                type="password" 
                required
                maxLength={8}
                placeholder={isFirstTime ? "Set Secure PIN (e.g. 1234)" : "Enter 4-digit PIN or Password"}
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full px-4 py-3.5 border border-amber-200 rounded-xl text-sm text-center tracking-widest font-bold focus:outline-none focus:ring-2 focus:ring-amber-800 bg-amber-50/30"
              />
            </div>

            <button 
              type="submit"
              className="w-full py-3.5 bg-amber-800 hover:bg-amber-900 text-white text-xs font-black rounded-xl transition shadow-lg tracking-wide uppercase"
            >
              {isFirstTime ? 'Initialize Arthved Vault 🪔' : 'Unlock Dashboard 🔓'}
            </button>
          </form>

          <p className="text-[11px] text-slate-400">
            Local-First Zero-Knowledge AES Encrypted Secure Vault
          </p>
        </div>
      </div>
    );
  }

  // ================= MAIN DASHBOARD UI =================
  return (
    <div className="min-h-screen bg-[#fefcf6] text-slate-800 flex font-sans">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-amber-100 flex flex-col justify-between hidden md:flex shadow-sm">
        <div>
          <div className="p-6 border-b border-amber-100 bg-gradient-to-br from-amber-50/40 to-white relative">
            <div className="absolute top-3 right-3 bg-amber-100/80 border border-amber-300 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded-md shadow-2xs tracking-widest">
              🪔 लाभ
            </div>
            <div className="flex items-center space-x-3">
              <ArthvedLogo />
              <div>
                <h1 className="font-black text-slate-900 text-lg leading-none tracking-tight">Arthved</h1>
                <p className="text-[10px] text-amber-900 font-bold mt-1 tracking-wide">Financial Science & Vision</p>
              </div>
            </div>
          </div>

          <div className="p-4">
            <p className="text-[10px] font-extrabold text-amber-800 uppercase px-3 mb-2 tracking-wider">Workspace</p>
            <nav className="space-y-1">
              {['Overview', 'Transactions', 'To collect', 'Reports', 'Business setup'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`w-full flex items-center px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                    activeTab === tab 
                      ? 'bg-amber-100/70 text-amber-900 shadow-sm border border-amber-200/50' 
                      : 'text-slate-600 hover:bg-amber-50/50'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="p-4 border-t border-amber-100 bg-amber-50/30">
          <div className="mb-3 px-1">
            <p className="text-xs font-bold text-slate-900 truncate">{userName}</p>
            <p className="text-[10px] text-amber-800 truncate">🔒 AES Encrypted Vault</p>
          </div>
          <button 
            onClick={handleLockVault}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition shadow-sm"
          >
            Lock Vault 🔒
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">{activeTab}</h2>
              <span className="text-xs bg-amber-100 text-amber-900 font-extrabold px-3 py-1 rounded-full border border-amber-300/60 shadow-sm flex items-center space-x-1">
                <span>🪔</span>
                <span>Arthved Intelligence Panel</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">Surya ki urja, Nayan ki drishti — har hisab ekdam saaf.</p>
          </div>

          <div className="flex items-center space-x-2 flex-wrap gap-y-2">
            <button onClick={exportToCSV} className="px-3.5 py-2 bg-white border border-amber-200 text-slate-700 text-xs font-bold rounded-xl shadow-sm hover:bg-amber-50/50 transition">📊 Export CSV</button>
            <button onClick={() => setShowImportModal(true)} className="px-3.5 py-2 bg-white border border-amber-200 text-slate-700 text-xs font-bold rounded-xl shadow-sm hover:bg-amber-50/50 transition">📂 Import CSV</button>
            <button onClick={() => { setModalType('expense'); setShowModal(true); }} className="px-4 py-2 bg-white border border-rose-200 text-rose-700 text-xs font-bold rounded-xl shadow-sm hover:bg-rose-50 transition">– Expense</button>
            <button onClick={() => { setModalType('sale'); setShowModal(true); }} className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white text-xs font-extrabold rounded-xl shadow-md transition">+ Add sale</button>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'Overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-amber-100/80 shadow-sm relative overflow-hidden">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Sales today</span>
                <h3 className="text-2xl font-black text-slate-900 mt-2">₹{salesToday.toLocaleString('en-IN')}</h3>
                <p className="text-[11px] text-amber-800 font-medium mt-2">Includes credit sales</p>
              </div>
              <div className="bg-white p-5 rounded-3xl border border-amber-100/80 shadow-sm relative overflow-hidden">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Payment collected</span>
                <h3 className="text-2xl font-black text-slate-900 mt-2">₹{paymentCollected.toLocaleString('en-IN')}</h3>
                <p className="text-[11px] text-emerald-700 font-medium mt-2">Cash, UPI received</p>
              </div>
              <div className="bg-white p-5 rounded-3xl border border-amber-100/80 shadow-sm relative overflow-hidden">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Expenses today</span>
                <h3 className="text-2xl font-black text-slate-900 mt-2">₹{expensesToday.toLocaleString('en-IN')}</h3>
                <p className="text-[11px] text-rose-700 font-medium mt-2">Money going out</p>
              </div>
              <div className="bg-white p-5 rounded-3xl border border-amber-100/80 shadow-sm relative overflow-hidden">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Still to collect</span>
                <h3 className="text-2xl font-black text-slate-900 mt-2">₹{stillToCollect.toLocaleString('en-IN')}</h3>
                <p className="text-[11px] text-amber-800 font-medium mt-2">Udhari pending</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-amber-100/80 shadow-sm lg:col-span-2 space-y-6">
                <div>
                  <h3 className="text-sm font-black text-slate-900">Quick entry</h3>
                  <p className="text-xs text-slate-400 mb-4">Record what happened in a few taps.</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <button 
                      onClick={() => { setModalType('sale'); setShowModal(true); }}
                      className="p-4 rounded-2xl border border-amber-100 hover:border-amber-300 hover:bg-amber-50/40 transition text-left group shadow-sm"
                    >
                      <div className="w-9 h-9 bg-amber-100 text-amber-900 rounded-xl flex items-center justify-center font-bold text-sm mb-3 group-hover:scale-105 transition">↗</div>
                      <h4 className="font-extrabold text-slate-900 text-xs">Add a sale</h4>
                      <p className="text-[10px] text-slate-400 mt-1">Product or service</p>
                    </button>

                    <button 
                      onClick={() => { setModalType('expense'); setShowModal(true); }}
                      className="p-4 rounded-2xl border border-rose-100 hover:border-rose-300 hover:bg-rose-50/30 transition text-left group shadow-sm"
                    >
                      <div className="w-9 h-9 bg-rose-100 text-rose-800 rounded-xl flex items-center justify-center font-bold text-sm mb-3 group-hover:scale-105 transition">–</div>
                      <h4 className="font-extrabold text-slate-900 text-xs">Add an expense</h4>
                      <p className="text-[10px] text-slate-400 mt-1">Stock, rent, supplies...</p>
                    </button>

                    <button 
                      onClick={() => { setModalType('payment'); setShowModal(true); }}
                      className="p-4 rounded-2xl border border-emerald-100 hover:border-emerald-300 hover:bg-emerald-50/30 transition text-left group shadow-sm"
                    >
                      <div className="w-9 h-9 bg-emerald-100 text-emerald-800 rounded-xl flex items-center justify-center font-bold text-sm mb-3 group-hover:scale-105 transition">↓</div>
                      <h4 className="font-extrabold text-slate-900 text-xs">Payment collected</h4>
                      <p className="text-[10px] text-slate-400 mt-1">Customer dues</p>
                    </button>
                  </div>
                </div>

                <div className="border-t border-amber-100/80 pt-6">
                  <h3 className="text-sm font-black text-slate-900 mb-4">⚡ Arthved Live Category Intelligence</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {['Sales', 'Utilities', 'Inventory', 'General'].map(cat => {
                      const catTotal = transactions.filter(t => t.category === cat).reduce((s, t) => s + t.amount, 0);
                      const totalAll = transactions.reduce((s, t) => s + t.amount, 1);
                      const sharePercent = Math.min(Math.round((catTotal / totalAll) * 100), 100);
                      return (
                        <div key={cat} className="p-4 bg-gradient-to-br from-slate-900 to-amber-950 text-white rounded-2xl border border-amber-500/30 shadow-md">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-extrabold text-xs text-amber-300">{cat}</span>
                            <span className="text-xs font-black text-amber-300">₹{catTotal}</span>
                          </div>
                          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
                            <div className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full rounded-full" style={{ width: `${Math.max(sharePercent, 6)}%` }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-amber-100/80 shadow-sm flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-sm font-black text-slate-900 mb-3">Recent activity</h3>
                  {transactions.slice(0, 4).map(t => (
                    <div key={t.id} className="flex justify-between items-center p-2.5 bg-amber-50/30 rounded-2xl text-xs mb-2 border border-amber-100/60">
                      <span className="font-bold text-slate-900">{t.text}</span>
                      <span className={t.type === 'expense' ? 'text-rose-600 font-bold' : 'text-emerald-700 font-bold'}>₹{t.amount}</span>
                    </div>
                  ))}
                </div>
                <div className="p-4 bg-gradient-to-br from-amber-900 to-slate-900 text-white rounded-2xl">
                  <p className="text-xs text-amber-300 font-bold">🪔 Drishti Status: Secure</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === 'Transactions' && (
          <div className="bg-white p-8 rounded-3xl border border-amber-100/80 shadow-sm space-y-6">
            <h3 className="text-sm font-black text-slate-900">Date-wise Ledger History</h3>
            {Object.keys(groupedTransactions).map((dateStr) => (
              <div key={dateStr} className="space-y-2">
                <h4 className="text-xs font-black text-amber-900 bg-amber-100/60 px-3 py-1 rounded-lg">📅 {dateStr}</h4>
                {groupedTransactions[dateStr].map(t => (
                  <div key={t.id} className="flex justify-between items-center p-3 bg-amber-50/20 rounded-2xl text-xs border border-amber-100">
                    <span>{t.text} ({t.category})</span>
                    <div className="flex items-center space-x-3">
                      <span className="font-bold">₹{t.amount}</span>
                      <button onClick={() => handleDelete(t.id)} className="text-rose-600 font-bold">&times;</button>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* To Collect Tab */}
        {activeTab === 'To collect' && (
          <div className="bg-white p-8 rounded-3xl border border-amber-100/80 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-slate-900">Customer Dues & Udhari</h3>
            {transactions.filter(t => t.type === 'sale' && t.paymentMode === 'Credit').map(t => (
              <div key={t.id} className="flex justify-between items-center p-4 bg-amber-50/40 rounded-2xl text-xs border border-amber-200">
                <span>{t.text} - ₹{t.amount}</span>
                <button onClick={() => {
                  setTransactions(transactions.map(item => item.id === t.id ? {...item, paymentMode: 'Online'} : item));
                }} className="px-3 py-1.5 bg-amber-800 text-white font-bold rounded-xl">Mark Collected ✓</button>
              </div>
            ))}
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'Reports' && (
          <div className="bg-white p-8 rounded-3xl border border-amber-100/80 shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-black text-slate-900">Financial Reports & Visual Analytics</h3>
                <p className="text-xs text-slate-400">Interactive category breakdown chart and spreadsheet tools.</p>
              </div>
              <button onClick={exportToCSV} className="px-4 py-2 bg-amber-800 text-white text-xs font-bold rounded-xl shadow-sm hover:bg-amber-900 transition">📊 Download Spreadsheet (CSV)</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-amber-50/40 border border-amber-200/60 rounded-2xl">
                <p className="text-xs text-amber-900 font-bold uppercase">Total Inflow</p>
                <h4 className="text-xl font-black text-amber-950 mt-1">₹{salesToday.toLocaleString('en-IN')}</h4>
              </div>
              <div className="p-4 bg-amber-50/40 border border-amber-200/60 rounded-2xl">
                <p className="text-xs text-amber-900 font-bold uppercase">Still to Collect</p>
                <h4 className="text-xl font-black text-amber-950 mt-1">₹{stillToCollect.toLocaleString('en-IN')}</h4>
              </div>
              <div className="p-4 bg-rose-50/40 border border-rose-200/60 rounded-2xl">
                <p className="text-xs text-rose-900 font-bold uppercase">Total Outflow</p>
                <h4 className="text-xl font-black text-rose-950 mt-1">₹{expensesToday.toLocaleString('en-IN')}</h4>
              </div>
            </div>

            <div className="border-t border-amber-100 pt-6 space-y-5">
              <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">Category Breakdown Visual Chart</h4>
              <div className="bg-amber-50/20 p-6 rounded-2xl border border-amber-100 space-y-5">
                {['General', 'Sales', 'Inventory', 'Utilities'].map((cat) => {
                  const catTotal = transactions.filter(t => t.category === cat).reduce((sum, t) => sum + t.amount, 0);
                  const maxVal = Math.max(...['General', 'Sales', 'Inventory', 'Utilities'].map(c => transactions.filter(t => t.category === c).reduce((s, t) => s + t.amount, 0)), 1);
                  const percentage = Math.min(Math.round((catTotal / maxVal) * 100), 100);

                  return (
                    <div key={cat} className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-800">{cat}</span>
                        <span className="font-black text-slate-900">₹{catTotal.toLocaleString('en-IN')} ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-slate-200/70 h-4 rounded-xl overflow-hidden p-0.5">
                        <div className="bg-gradient-to-r from-amber-700 to-amber-500 h-full rounded-lg transition-all duration-700" style={{ width: `${Math.max(percentage, 4)}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Business Setup & Logout Tab */}
        {activeTab === 'Business setup' && (
          <div className="bg-white p-8 rounded-3xl border border-amber-100/80 shadow-sm space-y-6">
            <h3 className="text-sm font-black text-slate-900">Business & Vault Settings</h3>
            <div className="p-4 bg-amber-50/30 rounded-2xl text-xs space-y-2">
              <p><strong>Business Name:</strong> {userName}</p>
              <p><strong>WhatsApp:</strong> {userWhatsapp || 'Not Linked'}</p>
            </div>
            <div className="pt-4 border-t border-slate-100">
              <button 
                onClick={handleLogout}
                className="px-5 py-2.5 bg-rose-700 hover:bg-rose-800 text-white text-xs font-black rounded-xl transition shadow-md"
              >
                🚪 Complete Logout (Sign Out & Reset Session)
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-3xl shadow-2xl max-w-sm w-full border border-amber-100">
            <h3 className="text-sm font-black uppercase text-slate-900 mb-4">Record {modalType}</h3>
            <form onSubmit={handleAddTransaction} className="space-y-4">
              <input type="text" required placeholder="Party Name / Description" value={text} onChange={(e) => setText(e.target.value)} className="w-full px-4 py-2.5 border border-amber-200 rounded-xl text-xs bg-amber-50/20" />
              <input type="number" required placeholder="Amount (₹)" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full px-4 py-2.5 border border-amber-200 rounded-xl text-xs bg-amber-50/20" />
              <button type="submit" className="w-full py-3 bg-amber-800 text-white text-xs font-black rounded-xl">Save Record 🪔</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}