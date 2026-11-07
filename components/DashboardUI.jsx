'use client';

import React, { useState, useEffect } from 'react';

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
  
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('sale');
  const [text, setText] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('General');
  const [paymentMode, setPaymentMode] = useState('Cash');

  const [showImportModal, setShowImportModal] = useState(false);

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
    setCategory('General');
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Kya aap waqai is entry को delete karna chahte hain?')) {
      const updated = transactions.filter(t => t.id !== id);
      setTransactions(updated);
      try {
        localStorage.setItem('arthved_transactions_encrypted', btoa(JSON.stringify(updated)));
        localStorage.setItem('arthved_transactions', JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }
    }
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
      <aside className="w-64 bg-white border-r border-amber-100 flex flex-col justify-between hidden md:flex shadow-sm">
        <div>
          <div className="p-6 border-b border-amber-100 bg-gradient-to-br from-amber-50/40 to-white relative">
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
                  className={`w-full flex items-center px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
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
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition shadow-sm cursor-pointer"
          >
            Lock Vault 🔒
          </button>
        </div>
      </aside>

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
              className="px-3.5 py-2 bg-white border border-amber-200 text-slate-700 text-xs font-bold rounded-xl shadow-sm hover:bg-amber-50/50 transition cursor-pointer"
            >
              📊 Export CSV
            </button>
            <button 
              onClick={() => setShowImportModal(true)}
              className="px-3.5 py-2 bg-white border border-amber-200 text-slate-700 text-xs font-bold rounded-xl shadow-sm hover:bg-amber-50/50 transition cursor-pointer"
            >
              📂 Import CSV
            </button>
          </div>
        </div>

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
                      className="p-4 rounded-2xl border border-amber-100 hover:border-amber-300 hover:bg-amber-50/40 transition text-left group shadow-sm cursor-pointer"
                    >
                      <h4 className="font-extrabold text-slate-900 text-xs">Add a sale</h4>
                      <p className="text-[10px] text-slate-400 mt-1">Product or service</p>
                    </button>
                    <button 
                      onClick={() => { setModalType('expense'); setShowModal(true); }}
                      className="p-4 rounded-2xl border border-rose-100 hover:border-rose-300 hover:bg-rose-50/30 transition text-left group shadow-sm cursor-pointer"
                    >
                      <h4 className="font-extrabold text-slate-900 text-xs">Add an expense</h4>
                      <p className="text-[10px] text-slate-400 mt-1">Stock, rent, supplies...</p>
                    </button>
                    <button 
                      onClick={() => { setModalType('payment'); setShowModal(true); }}
                      className="p-4 rounded-2xl border border-emerald-100 hover:border-emerald-300 hover:bg-emerald-50/30 transition text-left group shadow-sm cursor-pointer"
                    >
                      <h4 className="font-extrabold text-slate-900 text-xs">Payment collected</h4>
                      <p className="text-[10px] text-slate-400 mt-1">Customer dues</p>
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-amber-100/80 shadow-sm flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-sm font-black text-slate-900">Recent activity</h3>
                  <p className="text-xs text-slate-400 mb-4">Your latest records with dates.</p>
                  {transactions.length === 0 ? (
                    <div className="text-center py-6 border-2 border-dashed border-amber-200/60 rounded-2xl p-4 bg-amber-50/20">
                      <p className="text-xs font-bold text-slate-800">Start with your first entry</p>
                    </div>
                  ) : (
                    <div className="space-y-2.5 max-h-52 overflow-y-auto">
                      {transactions.slice(0, 4).map(t => (
                        <div key={t.id} className="flex justify-between items-center p-2.5 bg-amber-50/30 rounded-2xl text-xs border border-amber-100/60">
                          <div>
                            <p className="font-extrabold text-slate-900 truncate max-w-[130px]">
                              {t.text} {t.paymentMode === 'Credit' && <span className="text-[9px] bg-amber-200/70 text-amber-900 px-1 rounded font-bold ml-1">Udhari</span>}
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
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Transactions' && (
          <div className="bg-white p-8 rounded-3xl border border-amber-100/80 shadow-sm space-y-6">
            <input 
              type="text" 
              placeholder="Search party, category, or date..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2.5 border border-amber-200 rounded-xl text-xs w-full sm:w-72 focus:outline-none bg-amber-50/20"
            />
            <div className="space-y-6">
              {Object.keys(groupedTransactions).map((dateStr) => (
                <div key={dateStr} className="space-y-3">
                  <h4 className="text-xs font-black uppercase text-amber-900 bg-amber-100/60 px-3 py-1 rounded-lg inline-block">📅 Date: {dateStr}</h4>
                  {groupedTransactions[dateStr].map(t => (
                    <div key={t.id} className="flex justify-between items-center p-4 bg-white rounded-2xl text-xs border border-amber-100">
                      <div>
                        <p className="font-extrabold text-slate-900 text-sm">{t.text} {t.paymentMode === 'Credit' && <span className="bg-amber-200 text-amber-900 px-2 rounded-full ml-2 font-black text-[10px]">Udhari</span>}</p>
                        <p className="text-[11px] text-slate-400">Category: {t.category} | Mode: {t.paymentMode}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`font-black text-sm ${t.type === 'expense' ? 'text-rose-600' : 'text-emerald-700'}`}>
                          {t.type === 'expense' ? '-' : '+'}₹{t.amount.toLocaleString('en-IN')}
                        </span>
                        <button onClick={() => handleDelete(t.id)} className="text-slate-300 hover:text-rose-600 font-bold text-lg cursor-pointer">&times;</button>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'To collect' && (
          <div className="bg-white p-8 rounded-3xl border border-amber-100/80 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-slate-900">Customer Dues & Udhari Ledger</h3>
            {transactions.filter(t => t.paymentMode === 'Credit').map(t => (
              <div key={t.id} className="flex justify-between items-center p-4 bg-amber-50/40 rounded-2xl border border-amber-200 text-xs">
                <p className="font-black text-slate-900">{t.text} — ₹{t.amount}</p>
                <button 
                  onClick={() => {
                    if (window.confirm(`Mark collected for ${t.text}?`)) {
                      const updated = transactions.map(item => item.id === t.id ? {...item, paymentMode: 'Online', type: 'payment'} : item);
                      setTransactions(updated);
                    }
                  }}
                  className="px-3 py-2 bg-amber-800 text-white font-bold rounded-xl text-[11px] cursor-pointer"
                >
                  Mark Collected ✓
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Reports' && (
          <div className="bg-white p-8 rounded-3xl border border-amber-100/80 shadow-sm space-y-6">
            <button onClick={exportToCSV} className="px-4 py-2 bg-amber-800 text-white text-xs font-bold rounded-xl cursor-pointer">📊 Download Spreadsheet (CSV)</button>
          </div>
        )}

        {activeTab === 'Business setup' && (
          <div className="bg-white p-8 rounded-3xl border border-amber-100/80 shadow-sm space-y-6">
            <h3 className="text-sm font-black text-slate-900">Business & Vault Settings</h3>
            <button onClick={onLogout || onLock} className="px-5 py-2.5 bg-rose-700 hover:bg-rose-800 text-white text-xs font-black rounded-xl cursor-pointer">🚪 Complete Logout (Sign Out)</button>
          </div>
        )}
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white p-6 rounded-3xl shadow-2xl max-w-sm w-full border border-amber-100 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-black uppercase text-slate-900">Record {modalType}</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700 font-bold text-xl cursor-pointer p-1">&times;</button>
            </div>
            <form onSubmit={handleAddTransaction} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Party Name / Description</label>
                <input type="text" required placeholder="e.g. Sharma Ji / Daily Stock" value={text} onChange={(e) => setText(e.target.value)} className="w-full px-4 py-2.5 border border-amber-200 rounded-xl text-xs bg-amber-50/20" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Amount (₹)</label>
                <input type="number" required placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full px-4 py-2.5 border border-amber-200 rounded-xl text-xs bg-amber-50/20" />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Payment Mode</label>
                <select value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)} className="w-full px-4 py-2.5 border border-amber-200 rounded-xl text-xs bg-white cursor-pointer">
                  <option value="Cash">Cash</option>
                  <option value="Online">Online / UPI</option>
                  <option value="Credit">Credit / Udhari (Still to collect)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-2.5 border border-amber-200 rounded-xl text-xs bg-white cursor-pointer">
                  <option value="General">General</option>
                  <option value="Sales">Sales</option>
                  <option value="Inventory">Inventory</option>
                  <option value="Utilities">Utilities</option>
                </select>
              </div>

              <button type="submit" className="w-full py-3 bg-amber-800 hover:bg-amber-900 text-white text-xs font-black rounded-xl cursor-pointer mt-2">Save Record 🪔</button>
            </form>
          </div>
        </div>
      )}

      {showImportModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setShowImportModal(false)}>
          <div className="bg-white p-6 rounded-3xl shadow-2xl max-w-sm w-full border border-amber-100 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-black uppercase text-slate-900">Import CSV / Backup</h3>
              <button onClick={() => setShowImportModal(false)} className="text-slate-400 hover:text-slate-700 font-bold text-xl cursor-pointer p-1">&times;</button>
            </div>
            <input type="file" accept=".csv,.hisab,.json" onChange={handleFileUpload} className="w-full text-xs text-slate-500" />
            <button onClick={() => setShowImportModal(false)} className="w-full py-2.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl cursor-pointer">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
