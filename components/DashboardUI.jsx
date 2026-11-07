'use client';

import React, { useState, useEffect } from 'react';

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
  
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('sale');
  const [text, setText] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('General');
  const [paymentMode, setPaymentMode] = useState('Cash');

  useEffect(() => {
    try {
      const data = localStorage.getItem('arthved_transactions');
      if (data) setTransactions(JSON.parse(data));
    } catch (e) {
      console.error(e);
    }
  }, []);

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
    localStorage.setItem('arthved_transactions', JSON.stringify(updated));

    setText('');
    setAmount('');
    setPaymentMode('Cash');
    setCategory('General');
    setShowModal(false);
  };

  const salesToday = transactions.filter(t => t.type === 'sale').reduce((acc, t) => acc + t.amount, 0);
  const expensesToday = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="min-h-screen bg-[#fefcf6] text-slate-800 flex font-sans">
      <aside className="w-64 bg-white border-r border-amber-100 flex flex-col justify-between hidden md:flex shadow-sm">
        <div>
          <div className="p-6 border-b border-amber-100 bg-gradient-to-br from-amber-50/40 to-white">
            <h1 className="font-black text-slate-900 text-lg">Arthved</h1>
            <p className="text-[10px] text-amber-900 font-bold mt-1">Financial Science & Vision</p>
          </div>
          <nav className="p-4 space-y-1">
            {['Overview', 'Transactions', 'To collect', 'Reports', 'Business setup'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeTab === tab ? 'bg-amber-100/70 text-amber-900 border border-amber-200/50' : 'text-slate-600 hover:bg-amber-50/50'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t border-amber-100 bg-amber-50/30">
          <button onClick={onLock} className="w-full py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl cursor-pointer">
            Lock Vault 🔒
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-slate-900">{activeTab}</h2>
          <button onClick={() => { setModalType('sale'); setShowModal(true); }} className="px-4 py-2.5 bg-amber-800 text-white text-xs font-bold rounded-xl cursor-pointer">
            + Add Entry
          </button>
        </div>

        {activeTab === 'Overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-amber-100 shadow-sm">
                <span className="text-xs text-slate-500 font-bold uppercase">Sales today</span>
                <h3 className="text-2xl font-black text-slate-900 mt-2">₹{salesToday}</h3>
              </div>
              <div className="bg-white p-5 rounded-3xl border border-amber-100 shadow-sm">
                <span className="text-xs text-slate-500 font-bold uppercase">Expenses today</span>
                <h3 className="text-2xl font-black text-slate-900 mt-2">₹{expensesToday}</h3>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-amber-100 shadow-sm">
              <h3 className="text-sm font-black text-slate-900 mb-4">Recent Records</h3>
              {transactions.length === 0 ? (
                <p className="text-xs text-slate-400">No transactions recorded yet.</p>
              ) : (
                <div className="space-y-2">
                  {transactions.slice(0, 5).map(t => (
                    <div key={t.id} className="flex justify-between items-center p-3 bg-amber-50/30 rounded-xl text-xs border border-amber-100">
                      <div>
                        <p className="font-extrabold text-slate-900">{t.text}</p>
                        <p className="text-[10px] text-amber-800">{t.category} • {t.paymentMode}</p>
                      </div>
                      <span className={`font-black ${t.type === 'expense' ? 'text-rose-600' : 'text-emerald-700'}`}>
                        {t.type === 'expense' ? '-' : '+'}₹{t.amount}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'Transactions' && (
          <div className="bg-white p-6 rounded-3xl border border-amber-100 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 mb-4">All Transactions</h3>
            {transactions.length === 0 ? (
              <p className="text-xs text-slate-400">No transactions recorded yet.</p>
            ) : (
              <div className="space-y-2">
                {transactions.map(t => (
                  <div key={t.id} className="flex justify-between items-center p-3 bg-amber-50/30 rounded-xl text-xs border border-amber-100">
                    <div>
                      <p className="font-extrabold text-slate-900">{t.text} <span className="text-[9px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded ml-1">{t.paymentMode}</span></p>
                      <p className="text-[10px] text-amber-800">{t.category} • {t.date}</p>
                    </div>
                    <span className={`font-black ${t.type === 'expense' ? 'text-rose-600' : 'text-emerald-700'}`}>
                      {t.type === 'expense' ? '-' : '+'}₹{t.amount}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {activeTab === 'To collect' && (
          <div className="bg-white p-8 rounded-3xl border border-amber-100/80 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-slate-900">Customer Dues & Udhari Ledger</h3>
            {transactions.filter(t => t.paymentMode === 'Credit').length === 0 ? (
              <p className="text-xs text-slate-400">No pending credit or udhari entries.</p>
            ) : (
              transactions.filter(t => t.paymentMode === 'Credit').map(t => (
                <div key={t.id} className="flex justify-between items-center p-4 bg-amber-50/40 rounded-2xl border border-amber-200 text-xs">
                  <div>
                    <p className="font-black text-slate-900">{t.text}</p>
                    <p className="text-[10px] text-amber-800">Date: {t.date} • Category: {t.category}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="font-black text-rose-600">₹{t.amount}</span>
                    <button 
                      onClick={() => {
                        const updated = transactions.map(item => item.id === t.id ? {...item, paymentMode: 'Online'} : item);
                        setTransactions(updated);
                        localStorage.setItem('arthved_transactions', JSON.stringify(updated));
                      }}
                      className="px-3 py-2 bg-amber-800 text-white font-bold rounded-xl text-[11px] cursor-pointer"
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
            <h3 className="text-sm font-black text-slate-900">Reports & Analytics</h3>
            <p className="text-xs text-slate-500">Total recorded transactions: {transactions.length}</p>
          </div>
        )}

        {activeTab === 'Business setup' && (
          <div className="bg-white p-6 rounded-3xl border border-amber-100 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-slate-900">Business Setup & Vault Options</h3>
            <button onClick={onLogout || onLock} className="px-4 py-2.5 bg-rose-600 text-white text-xs font-bold rounded-xl cursor-pointer">
              Sign Out / Lock Vault
            </button>
          </div>
        )}
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-3xl shadow-2xl max-w-sm w-full border border-amber-100 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-black uppercase text-slate-900">Record {modalType}</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700 font-bold text-xl cursor-pointer p-1">&times;</button>
            </div>
            <form onSubmit={handleAddTransaction} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Description / Party Name</label>
                <input type="text" required value={text} onChange={(e) => setText(e.target.value)} className="w-full px-4 py-2.5 border border-amber-200 rounded-xl text-xs bg-amber-50/20" placeholder="e.g. Sharma Ji" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Amount (₹)</label>
                <input type="number" required value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full px-4 py-2.5 border border-amber-200 rounded-xl text-xs bg-amber-50/20" placeholder="0.00" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Payment Mode</label>
                <select value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)} className="w-full px-4 py-2.5 border border-amber-200 rounded-xl text-xs bg-white cursor-pointer">
                  <option value="Cash">Cash</option>
                  <option value="Online">Online / UPI</option>
                  <option value="Credit">Credit / Udhari</option>
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
              <button type="submit" className="w-full py-3 bg-amber-800 text-white text-xs font-black rounded-xl cursor-pointer">Save Record 🪔</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
