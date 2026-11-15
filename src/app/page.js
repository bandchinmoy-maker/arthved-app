'use client'

import { useState } from 'react'
import { TodayView, ReflectView, WeekView, SafetyNote } from './wellbeing'
import { UserButton } from '@clerk/nextjs'

export default function Home() {
  const [tab, setTab] = useState('today')
  const [reflectionTopic, setReflectionTopic] = useState('')

  return (
    <main className="min-h-screen bg-[#F4EEDC] text-[#1E2923] p-4 md:p-8 relative overflow-hidden">
      
      {/* --- COSMIC SANATAN GEOMETRY BACKGROUND --- */}
      {/* Represents the infinite cosmic ocean, rivers, and divine triad (Vishnu, Shiva, Brahma) in minimalist vector style */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        {/* Central Cosmic Ripple (Vishnu's Ocean / Lotus expansion) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-[#D5C89A] animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-[#D5C89A]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full border border-dashed border-[#C5B787]" />
        
        {/* Sacred Flow / Nadi Flow Lines */}
        <svg className="absolute inset-0 w-full h-full stroke-[#C5B787] fill-none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,100 C300,200 600,0 900,150 C1200,300 1400,100 1600,200" strokeWidth="1.5" strokeDasharray="6 6" opacity="0.6" />
          <path d="M0,400 C400,300 700,500 1000,350 C1300,200 1500,450 1800,300" strokeWidth="1.5" opacity="0.4" />
        </svg>
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        
        {/* Floating Glassmorphism Badges inspired by modern design & sacred elements */}
        <div className="flex flex-wrap gap-2 mb-4 justify-center md:justify-start">
          <span className="text-[11px] font-semibold bg-white/60 backdrop-blur-md px-3 py-1 rounded-full border border-[#E3D9B5] text-[#1B3B22] shadow-2xs flex items-center gap-1.5">
            🌊 Cosmic Ocean [Vishnu]
          </span>
          <span className="text-[11px] font-semibold bg-white/60 backdrop-blur-md px-3 py-1 rounded-full border border-[#E3D9B5] text-[#1B3B22] shadow-2xs flex items-center gap-1.5">
            🔱 Pavitra Shivaling [Shiva]
          </span>
          <span className="text-[11px] font-semibold bg-white/60 backdrop-blur-md px-3 py-1 rounded-full border border-[#E3D9B5] text-[#1B3B22] shadow-2xs flex items-center gap-1.5">
            🪷 Srishti Geometry [Brahma]
          </span>
        </div>

        {/* Header */}
        <header className="flex justify-between items-center mb-8 border-b border-[#E3D9B5] pb-4 bg-white/40 backdrop-blur-sm p-4 rounded-2xl shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1B3B22] flex items-center justify-center text-[#F4EEDC] shadow-md font-serif font-bold text-xl tracking-wider">
              अ
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight font-serif text-[#1E2923]">
                arthv<span className="text-[#E05A38]">e</span>da
              </h1>
              <p className="text-[10px] tracking-widest uppercase text-[#1B3B22] font-bold">Every thought, on purpose.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs bg-[#E3D9B5]/80 text-[#1B3B22] font-semibold px-3 py-1 rounded-full border border-[#D5C89A] shadow-2xs">
              Cosmic Edition
            </span>
            <UserButton afterSignOutUrl="/" />
          </div>
        </header>

        {/* Navigation Tabs */}
        <nav className="flex gap-2 mb-6 bg-white/75 backdrop-blur-md p-1.5 rounded-2xl border border-[#E3D9B5] shadow-xs">
          <button 
            onClick={() => setTab('today')} 
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition cursor-pointer ${tab === 'today' ? 'bg-[#1B3B22] text-[#F4EEDC] shadow-md' : 'text-[#4A5D50] hover:bg-[#E3D9B5]/40'}`}
          >
            Aaj (Today)
          </button>
          <button 
            onClick={() => setTab('reflect')} 
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition cursor-pointer ${tab === 'reflect' ? 'bg-[#1B3B22] text-[#F4EEDC] shadow-md' : 'text-[#4A5D50] hover:bg-[#E3D9B5]/40'}`}
          >
            Scenario Engine
          </button>
          <button 
            onClick={() => setTab('week')} 
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition cursor-pointer ${tab === 'week' ? 'bg-[#1B3B22] text-[#F4EEDC] shadow-md' : 'text-[#4A5D50] hover:bg-[#E3D9B5]/40'}`}
          >
            Vichaar & Data
          </button>
        </nav>

        {/* Active View Render */}
        {tab === 'today' && <TodayView onReflect={(thought) => { setReflectionTopic(thought); setTab('reflet'); }} />}
        {tab === 'reflect' && <ReflectView startTopic={reflectionTopic} />}
        {tab === 'week' && <WeekView />}
      </div>
    </main>
  )
}
