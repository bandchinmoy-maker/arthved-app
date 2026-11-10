'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { getTransactions, addTransaction, deleteTransaction } from '@/app/actions';

const ArthvedLogo = () => (
  <div className="w-11 h-11 flex items-center justify-center relative flex-shrink-0" title="Arthved: Financial Science & Vision">
    <div className="absolute inset-0 bg-gradient-to-tr from-amber-600 to-amber-400 rounded-2xl shadow-md"></div>
    <svg viewBox="0 0 100 100" className="w-7 h-7 relative z-10 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="50" cy="50" r="32" className="opacity-40" />
      <line x1="50" y1="8" x2="50" y2="18" />
      <line x1="50" y1="82" x2="50" y2="92" />
      <line x1="8" y1="50" x2="18" y2="50" />
      <line x1="82" y1="50" x2="92" y2="50" />
      <ellipse cx="50" cy="50" rx="16" ry="10" strokeWidth="2.5" />
      <circle cx="50" cy="50" r="5" fill="currentColor" stroke="none" />
    </svg>
  </div>
);

export default function DashboardUI({ onLock, onLogout, user }) {
  const [activeTab, setActiveTab] = useState('Overview');
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [isPending, startTransition] = useTransition();
  
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('sale');
  const [text, setText] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('General');
  const [paymentMode, setPaymentMode] = useState('Cash');

  // Neon DB se transactions load karne ke liye
  useEffect(() => {
    async function loadData() {
      const res = await getTransactions();
      if (res.success) {
        const formatted = res.data.map(t => ({
          ...t,
          date: new Date(t.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
        }));
        setTransactions(formatted);
      }
    }
    loadData();
  }, []);

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    if (!text || !amount) return;

    startTransition(async () => {
      const res = await addTransaction({
        text,
        amount: parseFloat(amount),
        type: modalType,
        category: modalType === 'sale' ? category : 'Utilities',
        paymentMode,
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
      });

      if (res.success) {
        const updatedRes = await getTransactions();
        if (updatedRes.success) {
          const formatted = updatedRes.data.map(t => ({
            ...t,
            date: new Date(t.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
          }));
          setTransactions(formatted);
        }
        setText('');
        setAmount('');
        setPaymentMode('Cash');
        setCategory('General');
        setShowModal(false);
      } else {
        alert('Transaction save nahi ho payi!');
      }
    });
  };

  const handleMarkCollected = async (id) => {
    startTransition(async () => {
      const updated = transactions.map(item => item.id === id ? {...item, paymentMode: 'Online'} : item);
      setTransactions(updated);
    });
  };

  const salesToday = transactions.filter(t => t.type === 'sale').reduce((acc, t) => acc + t.amount, 0);
  const expensesToday = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const netBalance = salesToday - expensesToday;

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.text.toLowerCase().includes(searchTerm.toLowerCase()) || t.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || t.category === filterCategory;
    const matchesType = filterType === 'All' || t.type === filterType;
    return matchesSearch && matchesCategory && matchesType;
  });

  return (
    <div className="min-h-screen bg-[#fefcf6] text-slate-800 flex font-sans">
      <aside className="w-64 bg-white border-r border-amber-100 flex flex-col justify-between hidden md:flex shadow-sm">
        <div>
          <div className="p-6 border-b border-amber-100 bg-gradient-to-br from-amber-50/40 to-white flex items-center space-x-3">
            <ArthvedLogo />
            <div>
              <h1 className="font-black text-slate-900 text-lg leading-tight">HisabCloud</h1>
              <p className="text-[10px] text-amber-900 font-bold tracking-wider mt-0.5">CLOUD LEDGER</p>
            </div>
          </div>
          <nav className="p-4 space-y-1">
            {['Overview', 'Transactions', 'To collect', 'Reports', 'Business setup'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-between ${
                  activeTab === tab ? 'bg-amber-100/70 text-amber-900 border border-amber-200/50 shadow-xs' : 'text-slate-600 hover:bg-amber-50/50'
                }`}
              >
                <span>{tab}</span>
                {tab === 'To collect' && (
                  <span className="bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded-full text-[9px] font-black">
                    {transactions.filter(t => t.paymentMode === 'Credit').length}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t border-amber-100 bg-amber-50/30 space-y-2">
          <div className="p-3 bg-white rounded-2xl border border-amber-200/60 shadow-xs">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Vault</p>
            <p className="text-xs font-black text-slate-900 truncate mt-0.5">{user?.businessName || 'My Enterprise'}</p>
          </div>
          <button onClick={onLock} className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-sm">
            Lock Vault 🔒
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">{activeTab}</h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Neon Cloud Database Sync Active ⚡</p>
          </div>
        </div>

        {activeTab === 'Overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-amber-100 shadow-sm flex flex-col justify-between">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Sales</span>
                <h3 className="text-2xl font-black text-emerald-700 mt-2">₹{salesToday.toLocaleString('en-IN')}</h3>
                <span className="text-[10px] text-emerald-600 font-bold mt-1">Neon Cloud Inflow</span>
              </div>
              <div className="bg-white p-5 rounded-3xl border border-amber-100 shadow-sm flex flex-col justify-between">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Expenses</span>
                <h3 className="text-2xl font-black text-rose-600 mt-2">₹{expensesToday.toLocaleString('en-IN')}</h3>
                <span className="text-[10px] text-rose-500 font-bold mt-1">Cloud Outflows</span>
              </div>
              <div className="bg-white p-5 rounded-3xl border border-amber-100 shadow-sm flex flex-col justify-between">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Net Position</span>
                <h3 className={`text-2xl font-black mt-2 ${netBalance >= 0 ? 'text-slate-900' : 'text-rose-600'}`}>
                  ₹{netBalance.toLocaleString('en-IN')}
                </h3>
                <span className="text-[10px] text-amber-900 font-bold mt-1">Live Database Surplus</span>
              </div>
            </div>

            {/* Clean Quick Entry Section */}
            <div className="bg-white p-6 rounded-3xl border border-amber-100 shadow-sm space-y-4">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">Quick Entry</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button 
                  onClick={() => { setModalType('sale'); setShowModal(true); }}
                  className="p-4 bg-amber-50/50 hover:bg-amber-100/60 border border-amber-200/60 rounded-2xl flex items-center justify-between transition cursor-pointer group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-lg">+</div>
                    <div className="text-left">
                      <p className="text-xs font-black text-slate-900">Record a Sale</p>
                      <p className="text-[10px] text-slate-500">Product, service or cash inflow</p>
                    </div>
                  </div>
                  <span className="text-amber-800 font-bold text-sm group-hover:translate-x-1 transition">→</span>
                </button>

                <button 
                  onClick={() => { setModalType('expense'); setShowModal(true); }}
                  className="p-4 bg-amber-50/50 hover:bg-amber-100/60 border border-amber-200/60 rounded-2xl flex items-center justify-between transition cursor-pointer group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-black text-lg">-</div>
                    <div className="text-left">
                      <p className="text-xs font-black text-slate-900">Record an Expense</p>
                      <p className="text-[10px] text-slate-500">Stock, rent, supplies, bills</p>
                    </div>
                  </div>
                  <span className="text-amber-800 font-bold text-sm group-hover:translate-x-1 transition">→</span>
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-amber-100 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">Recent Financial Entries</h3>
                <button onClick={() => setActiveTab('Transactions')} className="text-xs font-black text-amber-800 hover:underline cursor-pointer">
                  View All →
                </button>
              </div>
              {transactions.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No transactions recorded in cloud yet.</p>
              ) : (
                <div className="space-y-2.5">
                  {transactions.slice(0, 5).map(t => (
                    <div key={t.id} className="flex justify-between items-center p-3.5 bg-amber-50/30 hover:bg-amber-50/60 transition rounded-2xl border border-amber-100 text-xs">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${t.type === 'expense' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                          {t.type === 'expense' ? '↓' : '↑'}
                        </div>
                        <div>
                          <p className="font-extrabold text-slate-900">{t.text}</p>
                          <p className="text-[10px] text-amber-900/80 mt-0.5">{t.category} • {t.paymentMode} • {t.date}</p>
                        </div>
                      </div>
                      <span className={`font-black text-sm ${t.type === 'expense' ? 'text-rose-600' : 'text-emerald-700'}`}>
                        {t.type === 'expense' ? '-' : '+'}₹{t.amount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'Transactions' && (
          <div className="bg-white p-6 rounded-3xl border border-amber-100 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pb-2 border-b border-amber-100">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">Complete Cloud Ledger</h3>
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <input 
                  type="text" 
                  placeholder="Search records..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-3.5 py-2 border border-amber-200 rounded-xl text-xs bg-amber-50/20 w-full sm:w-60 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>
            </div>

            {filteredTransactions.length === 0 ? (
              <p className="text-xs text-slate-400 py-10 text-center">No matching records found.</p>
            ) : (
              <div className="space-y-2.5">
                {filteredTransactions.map(t => (
                  <div key={t.id} className="flex justify-between items-center p-4 bg-amber-50/30 rounded-2xl border border-amber-100 text-xs">
                    <div className="flex items-center space-x-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs ${t.type === 'expense' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {t.type === 'expense' ? '↓' : '↑'}
                      </div>
                      <div>
                        <p className="font-extrabold text-slate-900 text-sm">{t.text}</p>
                        <p className="text-[11px] text-amber-900/80 mt-0.5">
                          <span className="bg-amber-200/60 px-1.5 py-0.5 rounded font-bold mr-1">{t.category}</span>
                          {t.paymentMode} • {t.date}
                        </p>
                      </div>
                    </div>
                    <span className={`font-black text-base ${t.type === 'expense' ? 'text-rose-600' : 'text-emerald-700'}`}>
                      {t.type === 'expense' ? '-' : '+'}₹{t.amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'To collect' && (
          <div className="bg-white p-8 rounded-3xl border border-amber-100/80 shadow-sm space-y-4">
            <div className="pb-3 border-b border-amber-100">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">Customer Dues & Udhari Ledger</h3>
              <p className="text-xs text-slate-500 mt-0.5">Manage outstanding market credit and receivables.</p>
            </div>
            {transactions.filter(t => t.paymentMode === 'Credit').length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <p className="text-sm font-black text-slate-700">All clear!</p>
                <p className="text-xs text-slate-400">No pending credit or udhari entries in your cloud ledger.</p>
              </div>
            ) : (
              transactions.filter(t => t.paymentMode === 'Credit').map(t => (
                <div key={t.id} className="flex justify-between items-center p-4 bg-amber-50/40 rounded-2xl border border-amber-200 text-xs">
                  <div>
                    <p className="font-black text-slate-900 text-sm">{t.text}</p>
                    <p className="text-[11px] text-amber-800 mt-0.5">Recorded on: {t.date} • Category: {t.category}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="font-black text-rose-600 text-sm">₹{t.amount.toLocaleString('en-IN')}</span>
                    <button 
                      onClick={() => handleMarkCollected(t.id)}
                      className="px-3.5 py-2 bg-amber-800 hover:bg-amber-900 text-white font-bold rounded-xl text-xs transition cursor-pointer shadow-xs"
                    >
                      Mark Collected ✓
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'Reports' && (
          <div className="bg-white p-6 rounded-3xl border border-amber-100 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">Reports & Cloud Analytics</h3>
            <p className="text-xs text-slate-500">Total recorded transaction items in Neon DB: <span className="font-bold text-slate-900">{transactions.length}</span></p>
            <div className="p-4 bg-amber-50/40 rounded-2xl border border-amber-100 space-y-2">
              <p className="text-xs font-bold text-amber-900">Database Status: Neon PostgreSQL Connected ⚡</p>
              <p className="text-[11px] text-slate-600">All financial data is safely synced to the cloud server.</p>
            </div>
          </div>
        )}

        {activeTab === 'Business setup' && (
          <div className="bg-white p-6 rounded-3xl border border-amber-100 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">Business Setup & Vault Options</h3>
            <p className="text-xs text-slate-500">Manage enterprise configuration, profile settings, and cloud sync parameters.</p>
            <div className="pt-2">
              <button onClick={onLogout || onLock} className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-sm">
                Sign Out / Lock Vault
              </button>
            </div>
          </div>
        )}
      </main>

      {/* RECORD SALE / EXPENSE MODAL WITH CANCEL BUTTON */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-3xl shadow-2xl max-w-sm w-full border border-amber-100 space-y-4 relative">
            <div className="flex justify-between items-center border-b border-amber-100 pb-3">
              <h3 className="text-sm font-black uppercase text-slate-900 tracking-wider">Record {modalType}</h3>
              <button 
                onClick={() => setShowModal(false)} 
                className="text-slate-400 hover:text-slate-700 font-bold text-xl cursor-pointer p-1 rounded-lg hover:bg-amber-50"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleAddTransaction} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Description / Party Name</label>
                <input type="text" required value={text} onChange={(e) => setText(e.target.value)} className="w-full px-4 py-2.5 border border-amber-200 rounded-xl text-xs bg-amber-50/20 focus:outline-none focus:ring-2 focus:ring-amber-500/20" placeholder="e.g. Sharma Ji" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Amount (₹)</label>
                <input type="number" required value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full px-4 py-2.5 border border-amber-200 rounded-xl text-xs bg-amber-50/20 focus:outline-none focus:ring-2 focus:ring-amber-500/20" placeholder="0.00" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Payment Mode</label>
                <select value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)} className="w-full px-4 py-2.5 border border-amber-200 rounded-xl text-xs bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500/20">
                  <option value="Cash">Cash</option>
                  <option value="Online">Online / UPI</option>
                  <option value="Credit">Credit / Udhari</option>
                </select>
              </div>
              {modalType === 'sale' && (
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-2.5 border border-amber-200 rounded-xl text-xs bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500/20">
                    <option value="General">General</option>
                    <option value="Sales">Sales</option>
                    <option value="Inventory">Inventory</option>
                    <option value="Services">Services</option>
                  </select>
                </div>
              )}
              
              <div className="flex space-x-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="w-1/2 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black rounded-xl transition cursor-pointer shadow-xs"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isPending} 
                  className="w-1/2 py-3 bg-amber-800 hover:bg-amber-900 text-white text-xs font-black rounded-xl transition cursor-pointer shadow-md disabled:opacity-50"
                >
                  {isPending ? 'Saving...' : 'Save Record 🪔'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
