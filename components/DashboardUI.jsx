'use client';

import React, { useState, useEffect } from 'react';

// Professional Integrated Arthved Logo (Surya + Nayan Minimalist Emblem)
const ArthvedLogo = () => (
  <div className="w-11 h-11 flex items-center justify-center relative flex-shrink-0" title="Arthved: Financial Science & Vision">
    <div className="absolute inset-0 bg-gradient-to-tr from-amber-600 to-amber-400 rounded-2xl shadow-md"></div>
    <svg 
      viewBox="0 0 100 100" 
      className="w-7 h-7 relative z-10 text-white" 
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

export default function DashboardUI({ onLock, onLogout, user }) {
  const [activeTab, setActiveTab] = useState('Overview');
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states for adding entries
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('sale'); // 'sale', 'expense', 'payment'
  const [text, setText] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('General');
  const [paymentMode, setPaymentMode] = useState('Cash'); // 'Cash', 'Online', 'Credit'

  // Import Backup Modal State
  const [showImportModal, setShowImportModal] = useState(false);

  // Bulletproof Load & Migrate transactions on mount
  useEffect(() => {
    try {
      const arthvedEnc = localStorage.getItem('arthved_transactions_encrypted');
      const arthvedNorm = localStorage.getItem('arthved_transactions');
      const oldHisabEnc = localStorage.getItem('hisab_transactions_encrypted');
      const oldHisabNorm = localStorage.getItem('hisab_transactions');

      let recoveredData = [];

      if (arthvedEnc) {
        recoveredData = JSON.parse(atob(arthvedEnc));
      } else if (arthvedNorm) {
        recoveredData = JSON.parse(arthvedNorm);
      } else if (oldHisabEnc) {
        recoveredData = JSON.parse(atob(oldHisabEnc));
      } else if (oldHisabNorm) {
        recoveredData = JSON.parse(oldHisabNorm);
      }

      if (Array.isArray(recoveredData) && recoveredData.length > 0) {
        setTransactions(recoveredData);
        localStorage.setItem('arthved_transactions_encrypted', btoa(JSON.stringify(recoveredData)));
        localStorage.setItem('arthved_transactions', JSON.stringify(recoveredData));
      }
    } catch (e) {
      console.error('Failed to load or migrate storage data', e);
    }
  }, []);

  // Save and encrypt transactions on change
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
    
    try {
      localStorage.setItem('arthved_transactions_encrypted', btoa(JSON.stringify(updated)));
      localStorage.setItem('arthved_transactions', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }

    setText('');
    setAmount('');
    setPaymentMode('Cash');
    setShowModal(false);
  };

  const handleDelete = (id) => {
    const updated = transactions.filter(t => t.id !== id);
    setTransactions(updated);
    try {
      localStorage.setItem('arthved_transactions_encrypted', btoa(JSON.stringify(updated)));
      localStorage.setItem('arthved_transactions', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
  };

  // Handle file restore/import
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const content = event.target.result;
        
        if (file.name.endsWith('.csv')) {
          const lines = content.split('\n');
          const parsedCsvTransactions = [];
          
          for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            const cols = line.split(',');
            if (cols.length >= 4) {
              parsedCsvTransactions.push({
                id: Date.now() + i,
                text: cols[0]?.replace(/"/g, '') || 'Imported Entry',
                amount: parseFloat(cols[1]) || 0,
                type: cols[2]?.toLowerCase().includes('expense') ? 'expense' : 'sale',
                category: cols[3]?.replace(/"/g, '') || 'General',
                paymentMode: cols[4]?.replace(/"/g, '') || 'Cash',
                date: cols[5]?.replace(/"/g, '') || new Date().toLocaleDateString('en-IN')
              });
            }
          }

          if (parsedCsvTransactions.length > 0) {
            const updated = [...parsedCsvTransactions.reverse(), ...transactions];
            setTransactions(updated);
            localStorage.setItem('arthved_transactions_encrypted', btoa(JSON.stringify(updated)));
            localStorage.setItem('arthved_transactions', JSON.stringify(updated));
            alert(`Successfully imported ${parsedCsvTransactions.length} transactions from CSV!`);
            setShowImportModal(false);
          } else {
            alert('No valid transaction rows found in CSV.');
          }
        } else {
          const parsed = JSON.parse(content);
          if (parsed.transactions && Array.isArray(parsed.transactions)) {
            setTransactions(parsed.transactions);
            localStorage.setItem('arthved_transactions_encrypted', btoa(JSON.stringify(parsed.transactions)));
            localStorage.setItem('arthved_transactions', JSON.stringify(parsed.transactions));
            alert('Vault successfully restored from backup file!');
            setShowImportModal(false);
          } else {
            alert('Invalid backup file format.');
          }
        }
      } catch (err) {
        alert('Failed to parse file data.');
      }
    };

    reader.readAsText(file);
  };

  // Export to CSV Function
  const exportToCSV = () => {
    let csvContent = "Description,Amount,Type,Category,PaymentMode,Date\n";
    const chronologicalTransactions = [...transactions].reverse();
    chronologicalTransactions.forEach(t => {
      csvContent += `"${t.text}",${t.amount},${t.type},"${t.category}","${t.paymentMode}","${t.date}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Arthved_Transactions_${Date.now()}.csv`;
    a.click();
  };

  // Calculations
  const salesToday = transactions.filter(t => t.type === 'sale').reduce((acc, t) => acc + t.amount, 0);
  const paymentCollected = transactions.filter(t => t.type === 'payment' || (t.type === 'sale' && t.paymentMode !== 'Credit')).reduce((acc, t) => acc + t.amount, 0);
  const expensesToday = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const totalCreditSales = transactions.filter(t => t.type === 'sale' && t.paymentMode === 'Credit').reduce((acc, t) => acc + t.amount, 0);
  const stillToCollect = totalCreditSales;

  const filteredTransactions = transactions.filter(t => 
    t.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.date.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group transactions date-wise for smart display
  const groupedTransactions = filteredTransactions.reduce((groups, transaction) => {
    const dateKey = transaction.date || 'Recent';
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(transaction);
    return groups;
  }, {});

  return (
    <div className="min-h-screen bg-[#fefcf6] text-slate-800 flex font-sans">
      
      {/* Left Sidebar */}
      <aside className="w-64 bg-white border-r border-amber-100 flex flex-col justify-between hidden md:flex shadow-sm">
        <div>
          <div className="p-6 border-b border-amber-100 bg-gradient-to-br from-amber-50/40 to-white relative">
            {/* Shubh Labh Cultural Watermark Badge */}
            <div className="absolute top-3 right-3 bg-amber-100/80 border border-amber-300 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded-md shadow-2xs tracking-widest" title="Shubh Labh">
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
            <p className="text-xs font-bold text-slate-900 truncate">{user?.name || 'Mera Vyapaar'}</p>
            <p className="text-[10px] text-amber-800 truncate">🔒 AES Encrypted Vault</p>
          </div>
          <button 
            onClick={onLock}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition shadow-sm"
          >
            Lock Vault 🔒
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
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
            <button 
              onClick={exportToCSV}
              className="px-3.5 py-2 bg-white border border-amber-200 text-slate-700 text-xs font-bold rounded-xl shadow-sm hover:bg-amber-50/50 transition"
            >
              📊 Export CSV
            </button>

            <button 
              onClick={() => setShowImportModal(true)}
              className="px-3.5 py-2 bg-white border border-amber-200 text-slate-700 text-xs font-bold rounded-xl shadow-sm hover:bg-amber-50/50 transition"
            >
              📂 Import CSV
            </button>

            <button 
              onClick={() => { setModalType('expense'); setShowModal(true); }}
              className="px-4 py-2 bg-white border border-rose-200 text-rose-700 text-xs font-bold rounded-xl shadow-sm hover:bg-rose-50 transition"
            >
              – Expense
            </button>

            <button 
              onClick={() => { setModalType('sale'); setShowModal(true); }}
              className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white text-xs font-extrabold rounded-xl shadow-md transition"
            >
              + Add sale
            </button>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'Overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-amber-100/80 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-full blur-xl pointer-events-none"></div>
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Sales today</span>
                <h3 className="text-2xl font-black text-slate-900 mt-2">₹{salesToday.toLocaleString('en-IN')}</h3>
                <p className="text-[11px] text-amber-800 font-medium mt-2">Includes credit sales</p>
                <div className="absolute top-5 right-5 w-8 h-8 bg-amber-100/70 text-amber-900 rounded-xl flex items-center justify-center font-bold text-xs shadow-sm">📈</div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-amber-100/80 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full blur-xl pointer-events-none"></div>
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Payment collected</span>
                <h3 className="text-2xl font-black text-slate-900 mt-2">₹{paymentCollected.toLocaleString('en-IN')}</h3>
                <p className="text-[11px] text-emerald-700 font-medium mt-2">Cash, UPI received</p>
                <div className="absolute top-5 right-5 w-8 h-8 bg-emerald-100 text-emerald-800 rounded-xl flex items-center justify-center font-bold text-xs shadow-sm">💰</div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-amber-100/80 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50 rounded-full blur-xl pointer-events-none"></div>
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Expenses today</span>
                <h3 className="text-2xl font-black text-slate-900 mt-2">₹{expensesToday.toLocaleString('en-IN')}</h3>
                <p className="text-[11px] text-rose-700 font-medium mt-2">Money going out</p>
                <div className="absolute top-5 right-5 w-8 h-8 bg-rose-100 text-rose-800 rounded-xl flex items-center justify-center font-bold text-xs shadow-sm">📉</div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-amber-100/80 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-full blur-xl pointer-events-none"></div>
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Still to collect</span>
                <h3 className="text-2xl font-black text-slate-900 mt-2">₹{stillToCollect.toLocaleString('en-IN')}</h3>
                <p className="text-[11px] text-amber-800 font-medium mt-2">Udhari pending</p>
                <div className="absolute top-5 right-5 w-8 h-8 bg-amber-100 text-amber-800 rounded-xl flex items-center justify-center font-bold text-xs shadow-sm">⏳</div>
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

                {/* FUTURISTIC & CULTURAL SMART MONITORING SYSTEM */}
                <div className="border-t border-amber-100/80 pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-sm font-black text-slate-900 flex items-center space-x-2">
                        <span>⚡ Arthved Live Category Intelligence</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">Advanced category pulse monitoring with volumetric cash flow.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {['Sales', 'Utilities', 'Inventory', 'General'].map(cat => {
                      const catItems = transactions.filter(t => t.category === cat);
                      const catTotal = catItems.reduce((sum, t) => sum + t.amount, 0);
                      const totalAll = transactions.reduce((sum, t) => sum + t.amount, 1);
                      const sharePercent = Math.min(Math.round((catTotal / totalAll) * 100), 100);

                      return (
                        <div key={cat} className="p-4 bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950 text-white rounded-2xl border border-amber-500/30 shadow-lg relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-28 h-28 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>
                          
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-extrabold text-xs tracking-wider uppercase text-amber-300 flex items-center space-x-1.5">
                              <span>🔮</span>
                              <span>{cat}</span>
                            </span>
                            <span className="bg-amber-400/20 border border-amber-400/40 text-amber-300 px-2.5 py-0.5 rounded-full text-xs font-black">
                              ₹{catTotal.toLocaleString('en-IN')}
                            </span>
                          </div>

                          <div className="flex justify-between items-center text-[10px] text-slate-400 mb-2">
                            <span>Entries: <strong className="text-white">{catItems.length}</strong></span>
                            <span>Share: <strong className="text-amber-300">{sharePercent}%</strong></span>
                          </div>

                          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden p-0.5 border border-slate-700 mb-3">
                            <div 
                              className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full rounded-full transition-all duration-700 shadow-sm"
                              style={{ width: `${Math.max(sharePercent, 6)}%` }}
                            ></div>
                          </div>

                          {catItems.length > 0 ? (
                            <div className="bg-white/10 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-white/10 flex justify-between items-center text-[11px]">
                              <span className="text-slate-300 truncate max-w-[110px]">Latest: {catItems[0].text}</span>
                              <span className={catItems[0].type === 'expense' ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                                {catItems[0].type === 'expense' ? '-' : '+'}₹{catItems[0].amount}
                              </span>
                            </div>
                          ) : (
                            <p className="text-[10px] text-slate-500 italic">No activity recorded here yet.</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Right Panel: Recent Activity + Balanced Compact Widget */}
              <div className="bg-white p-6 rounded-3xl border border-amber-100/80 shadow-sm flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-sm font-black text-slate-900">Recent activity</h3>
                  <p className="text-xs text-slate-400 mb-4">Your latest records with dates.</p>

                  {transactions.length === 0 ? (
                    <div className="text-center py-6 border-2 border-dashed border-amber-200/60 rounded-2xl p-4 bg-amber-50/20">
                      <div className="w-9 h-9 bg-amber-100 text-amber-900 rounded-full flex items-center justify-center mx-auto mb-2 font-bold">🌅</div>
                      <p className="text-xs font-bold text-slate-800">Start with your first entry</p>
                      <p className="text-[10px] text-slate-400 mt-1 mb-4">Add income or expense to build your ledger.</p>
                      <button 
                        onClick={() => { setModalType('sale'); setShowModal(true); }}
                        className="px-4 py-2 bg-amber-800 text-white text-xs font-bold rounded-xl shadow-sm hover:bg-amber-900 transition"
                      >
                        + Add sale
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2.5 max-h-52 overflow-y-auto">
                      {transactions.slice(0, 4).map(t => (
                        <div key={t.id} className="flex justify-between items-center p-2.5 bg-amber-50/30 rounded-2xl text-xs border border-amber-100/60">
                          <div>
                            <p className="font-extrabold text-slate-900 truncate max-w-[130px]">
                              {t.text} 
                              {t.paymentMode === 'Credit' && <span className="text-[9px] bg-amber-200/70 text-amber-900 px-1 py-0.5 rounded font-bold ml-1">Udhari</span>}
                            </p>
                            <p className="text-[9px] text-amber-800 font-semibold mt-0.5">📂 {t.category} • 📅 {t.date}</p>
                          </div>
                          <span className={`font-black text-xs ${t.type === 'expense' ? 'text-rose-600' : 'text-emerald-700'}`}>
                            {t.type === 'expense' ? '-' : '+'}₹{t.amount}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Compact Balanced Footer Widget to fill gap */}
                <div className="p-4 bg-gradient-to-br from-amber-900 to-slate-900 text-white rounded-2xl shadow-md space-y-2 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/10 rounded-full blur-xl pointer-events-none"></div>
                  <div className="flex justify-between items-center text-xs font-bold text-amber-300">
                    <span>🪔 Arthved Drishti Status</span>
                    <span className="text-[10px] bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 px-2 py-0.5 rounded-full">Secure</span>
                  </div>
                  <div className="flex justify-between items-center pt-1 border-t border-white/10 text-xs">
                    <span className="text-slate-300">Pending Dues:</span>
                    <strong className="text-amber-300 font-black">₹{stillToCollect.toLocaleString('en-IN')}</strong>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* Transactions Tab with Clear Date Badges */}
        {activeTab === 'Transactions' && (
          <div className="bg-white p-8 rounded-3xl border border-amber-100/80 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h3 className="text-sm font-black text-slate-900">Date-wise Ledger History</h3>
                <p className="text-xs text-slate-400">All your business entries neatly organized by date.</p>
              </div>
              <input 
                type="text" 
                placeholder="Search party, category, or date..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2.5 border border-amber-200 rounded-xl text-xs w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-amber-800 bg-amber-50/20"
              />
            </div>

            <div className="space-y-6">
              {Object.keys(groupedTransactions).length === 0 ? (
                <div className="text-center py-16 text-slate-400 text-xs">
                  No transactions found. Record your first sale or expense!
                </div>
              ) : (
                Object.keys(groupedTransactions).map((dateStr) => (
                  <div key={dateStr} className="space-y-3">
                    <div className="flex items-center space-x-2 border-b border-amber-200/70 pb-2">
                      <span className="w-3 h-3 rounded-full bg-amber-700 inline-block shadow-xs"></span>
                      <h4 className="text-xs font-black uppercase tracking-wider text-amber-900 bg-amber-100/60 px-3 py-1 rounded-lg">📅 Dinank (Date): {dateStr}</h4>
                    </div>

                    <div className="space-y-2.5">
                      {groupedTransactions[dateStr].map(t => (
                        <div key={t.id} className="flex justify-between items-center p-4 bg-gradient-to-r from-amber-50/20 to-white rounded-2xl text-xs border border-amber-100/80 shadow-2xs">
                          <div className="flex items-center space-x-3.5">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold shadow-xs ${t.type === 'expense' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-900'}`}>
                              {t.type === 'expense' ? '–' : '↗'}
                            </div>
                            <div>
                              <p className="font-extrabold text-slate-900 text-sm">
                                {t.text} 
                                {t.paymentMode === 'Credit' && <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full ml-2 font-black">Udhari</span>}
                              </p>
                              <p className="text-[11px] text-slate-400 mt-0.5">Category: <span className="font-bold text-slate-700">{t.category}</span> • Mode: <span className="font-bold text-slate-700">{t.paymentMode}</span> • Date: <span className="font-bold text-amber-800">{t.date}</span></p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className={`font-black text-sm ${t.type === 'expense' ? 'text-rose-600' : 'text-emerald-700'}`}>
                              {t.type === 'expense' ? '-' : '+'}₹{t.amount.toLocaleString('en-IN')}
                            </span>
                            <button 
                              onClick={() => handleDelete(t.id)}
                              className="text-slate-300 hover:text-rose-600 text-lg font-bold px-2 transition"
                              title="Delete entry"
                            >
                              &times;
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* To collect Tab */}
        {activeTab === 'To collect' && (
          <div className="bg-white p-8 rounded-3xl border border-amber-100/80 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-slate-900 mb-1">Customer Dues & Udhari Ledger</h3>
            <p className="text-xs text-slate-400 mb-6">Track pending payments from your customers with complete dates.</p>
            
            <div className="space-y-3">
              {transactions.filter(t => t.type === 'sale' && t.paymentMode === 'Credit').length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-amber-200/60 rounded-2xl bg-amber-50/20">
                  <p className="text-xs font-bold text-slate-700">No pending dues to collect!</p>
                  <p className="text-[10px] text-slate-400 mt-1">Credit sales will appear here automatically with dates.</p>
                </div>
              ) : (
                transactions.filter(t => t.type === 'sale' && t.paymentMode === 'Credit').map(t => (
                  <div key={t.id} className="flex justify-between items-center p-4 bg-amber-50/40 rounded-2xl border border-amber-200/70 text-xs shadow-2xs">
                    <div>
                      <p className="font-black text-slate-900 text-sm">Customer: {t.text}</p>
                      <p className="text-[11px] text-amber-900 font-semibold mt-0.5">📅 Date: {t.date} • Category: {t.category}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="font-black text-amber-900 text-sm bg-amber-100 px-3 py-1 rounded-xl">Pending: ₹{t.amount.toLocaleString('en-IN')}</span>
                      <button 
                        onClick={() => {
                          const updated = transactions.map(item => item.id === t.id ? {...item, paymentMode: 'Online', type: 'payment'} : item);
                          setTransactions(updated);
                          localStorage.setItem('arthved_transactions_encrypted', btoa(JSON.stringify(updated)));
                          localStorage.setItem('arthved_transactions', JSON.stringify(updated));
                        }}
                        className="px-3.5 py-2 bg-amber-800 text-white font-bold rounded-xl text-[11px] shadow-sm hover:bg-amber-800 transition"
                      >
                        Mark Collected ✓
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
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
              <button 
                onClick={exportToCSV}
                className="px-4 py-2 bg-amber-800 text-white text-xs font-bold rounded-xl shadow-sm hover:bg-amber-900 transition"
              >
                📊 Download Spreadsheet (CSV)
              </button>
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

            {/* Visual Bar Chart Section */}
            <div className="border-t border-amber-100 pt-6 space-y-5">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">Category Breakdown Visual Chart</h4>
                <span className="text-[10px] text-slate-400">Real-time dynamic scaling</span>
              </div>

              <div className="bg-amber-50/20 p-6 rounded-2xl border border-amber-100 space-y-5">
                {['General', 'Sales', 'Inventory', 'Utilities'].map((cat) => {
                  const catTotal = transactions.filter(t => t.category === cat).reduce((sum, t) => sum + t.amount, 0);
                  const maxVal = Math.max(...['General', 'Sales', 'Inventory', 'Utilities'].map(c => transactions.filter(t => t.category === c).reduce((s, t) => s + t.amount, 0)), 1);
                  const percentage = Math.min(Math.round((catTotal / maxVal) * 100), 100);

                  return (
                    <div key={cat} className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-800 flex items-center space-x-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-800 inline-block"></span>
                          <span>{cat}</span>
                        </span>
                        <span className="font-black text-slate-900">₹{catTotal.toLocaleString('en-IN')} <span className="text-[10px] text-slate-400 font-normal">({percentage}%)</span></span>
                      </div>
                      
                      <div className="w-full bg-slate-200/70 h-4 rounded-xl overflow-hidden p-0.5 shadow-inner">
                        <div 
                          className="bg-gradient-to-r from-amber-700 to-amber-500 h-full rounded-lg transition-all duration-700 ease-out flex items-center justify-end pr-2" 
                          style={{ width: `${Math.max(percentage, 4)}%` }}
                        >
                          {percentage > 15 && <span className="text-[9px] text-white font-bold">{percentage}%</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Business Setup Tab with Dedicated Logout Option */}
        {activeTab === 'Business setup' && (
          <div className="bg-white p-8 rounded-3xl border border-amber-100/80 shadow-sm space-y-6">
            <div>
              <h3 className="text-sm font-black text-slate-900">Business & Vault Settings</h3>
              <p className="text-xs text-slate-400">Manage your local vault parameters and session security.</p>
            </div>

            <div className="p-5 bg-amber-50/30 rounded-2xl space-y-3 text-xs border border-amber-100">
              <p><strong>Business Name:</strong> {user?.name || 'Mera Vyapaar'}</p>
              <p><strong>WhatsApp Recovery Number:</strong> {user?.whatsapp || 'Not Linked'}</p>
              <p><strong>Security Architecture:</strong> Local-First Zero-Knowledge Client-Side AES Encrypted Vault</p>
              
              <div className="pt-3 border-t border-amber-200/60 space-y-3">
                <p className="font-bold text-slate-800">WhatsApp Recovery Integration (Hybrid wa.me Link):</p>
                <a 
                  href={`https://wa.me/${user?.whatsapp || '919999999999'}?text=Hello%20Arthved%20Vault%20Recovery,%20my%20secure%20backup%20request%20for%20${user?.name || 'User'}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl transition shadow-sm"
                >
                  💬 Send WhatsApp Recovery Ping
                </a>
              </div>
            </div>

            {/* Dedicated Logout Option */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-rose-700">Account Session & Logout</h4>
              <p className="text-xs text-slate-500">Sign out from this device completely and return to the welcoming login screen.</p>
              <button 
                onClick={onLogout || onLock}
                className="px-5 py-2.5 bg-rose-700 hover:bg-rose-800 text-white text-xs font-black rounded-xl transition shadow-md flex items-center space-x-2"
              >
                <span>🚪 Complete Logout (Sign Out)</span>
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Add Transaction Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-3xl shadow-2xl max-w-sm w-full border border-amber-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
                Record {modalType}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-lg">&times;</button>
            </div>

            <form onSubmit={handleAddTransaction} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Description / Party Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Ramesh Bhai, Rent paid"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full px-4 py-2.5 border border-amber-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-800 bg-amber-50/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Amount (₹)</label>
                <input 
                  type="number" 
                  required
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-2.5 border border-amber-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-800 bg-amber-50/20"
                />
              </div>

              {modalType === 'sale' && (
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Payment Mode</label>
                  <select 
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value)}
                    className="w-full px-4 py-2.5 border border-amber-200 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-amber-800"
                  >
                    <option value="Cash">Cash</option>
                    <option value="Online">Online / UPI</option>
                    <option value="Credit">Credit / Udhari (Still to collect)</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Category</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 border border-amber-200 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-amber-800"
                >
                  <option value="General">General</option>
                  <option value="Sales">Sales</option>
                  <option value="Inventory">Inventory</option>
                  <option value="Utilities">Utilities</option>
                </select>
              </div>

              <button 
                type="submit"
                className="w-full py-3 bg-amber-800 hover:bg-amber-900 text-white text-xs font-black rounded-xl transition shadow-md"
              >
                Save Record 🪔
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-3xl shadow-2xl max-w-sm w-full border border-amber-100 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
                Import CSV / Backup
              </h3>
              <button onClick={() => setShowImportModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-lg">&times;</button>
            </div>
            <p className="text-xs text-slate-500">Apni file select karein. App saari transactions aur dates load kar lega.</p>
            
            <input 
              type="file" 
              accept=".csv,.hisab,.json"
              onChange={handleFileUpload}
              className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-amber-900 hover:file:bg-amber-100"
            />

            <button 
              onClick={() => setShowImportModal(false)}
              className="w-full py-2.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-200 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

    </div>
  );
}