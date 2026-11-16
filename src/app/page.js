'use client'

import { useState } from 'react'
import { useAuth, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import { LangProvider, LangSwitch, useLang } from './i18n'
import { MotifProvider, useMotif } from './cosmic'
import { TodayView, ReflectView, WeekView } from './wellbeing'

// Paste your Google Form link between the quotes to show a "Share feedback" button.
const FEEDBACK_URL = ''

const GlobalStyles = () => (
  <style>{`
    @keyframes av-orbit{to{transform:rotate(360deg)}}
    @keyframes av-twinkle{0%,100%{opacity:.35}50%{opacity:1}}
    @keyframes av-sway{0%,100%{transform:rotate(-2.5deg)}50%{transform:rotate(2.5deg)}}
    @keyframes av-flick{0%,100%{opacity:.3}50%{opacity:1}}
    @keyframes av-rise{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
    @keyframes av-pop{0%{transform:scale(.5);opacity:0}70%{transform:scale(1.15)}100%{transform:scale(1);opacity:1}}
    .av-orbit{animation:av-orbit 40s linear infinite}
    .av-orbit-r{animation:av-orbit 60s linear infinite reverse}
    .av-stars{background-image:radial-gradient(1px 1px at 20px 30px,#fff,transparent),radial-gradient(1.5px 1.5px at 90px 80px,#F4EEDC,transparent),radial-gradient(1px 1px at 150px 40px,#fff,transparent),radial-gradient(1px 1px at 60px 140px,#fff,transparent),radial-gradient(1.5px 1.5px at 170px 150px,#E05A38,transparent);background-size:200px 200px;animation:av-twinkle 6s ease-in-out infinite}
    .av-sway{animation:av-sway 6s ease-in-out infinite}
    .av-flick-a{animation:av-flick 1.8s ease-in-out infinite}
    .av-flick-b{animation:av-flick 1.8s ease-in-out .9s infinite}
    .av-in{animation:av-rise .45s ease-out both}
    .av-pop{animation:av-pop .5s ease-out both}
    @media (prefers-reduced-motion:reduce){.av-orbit,.av-orbit-r,.av-stars,.av-sway,.av-flick-a,.av-flick-b,.av-in,.av-pop{animation:none}}
  `}</style>
)

function Welcome() {
  const { t } = useLang()
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#0B1A10] via-[#142B1A] to-[#1B3B22] text-[#F4EEDC] flex flex-col items-center px-6 py-6">
      <GlobalStyles />
      <div className="av-stars absolute inset-0 pointer-events-none"></div>
      <div className="relative z-10 w-full max-w-3xl flex justify-end"><LangSwitch dark /></div>
      <div className="relative z-10 flex flex-col items-center text-center max-w-xl mt-8 md:mt-12">
        <div className="relative w-56 h-56 flex items-center justify-center">
          <div className="av-orbit absolute inset-0 rounded-full border border-dashed border-[#F4EEDC]/30">
            <span className="absolute -top-1.5 left-1/2 -ml-1.5 w-3 h-3 rounded-full bg-[#E05A38]"></span>
          </div>
          <div className="av-orbit-r absolute inset-7 rounded-full border border-dashed border-[#F4EEDC]/20">
            <span className="absolute top-1/2 -right-1.5 -mt-1.5 w-3 h-3 rounded-full bg-[#F4EEDC]"></span>
          </div>
          <div className="w-20 h-20 rounded-3xl bg-[#F4EEDC] text-[#1B3B22] flex items-center justify-center text-4xl font-serif font-bold shadow-xl">अ</div>
        </div>
        <h1 className="mt-6 text-5xl font-black font-serif tracking-tight">arthv<span className="text-[#E05A38]">e</span>da</h1>
        <p className="mt-2 text-xs tracking-[0.25em] uppercase text-[#F4EEDC]/70 font-bold">{t('tagline')}</p>
        <h2 className="mt-8 text-2xl md:text-3xl font-bold leading-snug">{t('welcomeHead')}</h2>
        <p className="mt-3 text-[#F4EEDC]/80">{t('welcomeSub')}</p>
        <div className="mt-8 flex gap-3 flex-wrap justify-center">
          <SignUpButton mode="modal"><button className="bg-[#E05A38] hover:bg-[#c94e2f] text-white font-bold px-7 py-3.5 rounded-xl cursor-pointer">{t('start')}</button></SignUpButton>
          <SignInButton mode="modal"><button className="border border-[#F4EEDC]/40 hover:bg-white/10 font-bold px-7 py-3.5 rounded-xl cursor-pointer">{t('login')}</button></SignInButton>
        </div>
      </div>
      <div className="relative z-10 grid sm:grid-cols-3 gap-3 w-full max-w-3xl mt-12">
        {[['pThinkT', 'pThinkD', '🧭'], ['pFeelT', 'pFeelD', '🌙'], ['pTalkT', 'pTalkD', '🪐']].map(([a, b, e]) => (
          <div key={a} className="rounded-2xl bg-white/5 border border-white/10 p-4">
            <div className="text-2xl">{e}</div>
            <p className="font-bold mt-1">{t(a)}</p>
            <p className="text-xs text-[#F4EEDC]/70 mt-1">{t(b)}</p>
          </div>
        ))}
      </div>
      <p className="relative z-10 text-xs text-[#F4EEDC]/60 mt-8 mb-4">{t('trust')}</p>
    </main>
  )
}

function Shell() {
  const { t } = useLang()
  const { on, toggle } = useMotif()
  const { isLoaded, isSignedIn } = useAuth()
  const [tab, setTab] = useState('today')
  const [reflectionTopic, setReflectionTopic] = useState('')

  if (!isLoaded) return <main className="min-h-screen bg-[#F4EEDC]"></main>
  if (!isSignedIn) return <Welcome />

  const tabs = [['today', 'tabToday', '🪔'], ['reflect', 'tabReflect', '🧭'], ['week', 'tabWeek', '📅']]

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#F7F1E1] to-[#EADFC3] text-[#1E2923] p-4 md:p-8">
      <GlobalStyles />
      <div className="max-w-3xl mx-auto">
        <header className="flex flex-wrap gap-3 justify-between items-center mb-6 pb-4 border-b border-[#E3D9B5]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#1B3B22] flex items-center justify-center text-[#F4EEDC] shadow-md font-serif font-bold text-xl">अ</div>
            <div>
              <h1 className="text-2xl font-black tracking-tight font-serif">arthv<span className="text-[#E05A38]">e</span>da</h1>
              <p className="text-[10px] tracking-widest uppercase text-[#1B3B22] font-bold">{t('tagline')}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <LangSwitch />
            <button onClick={toggle} title={t('motif')} aria-label={t('motif')} className="w-9 h-9 rounded-full border border-[#E3D9B5] bg-white/70 hover:bg-white cursor-pointer text-sm">{on ? '🌀' : '○'}</button>
            <UserButton />
          </div>
        </header>

        <nav className="flex gap-2 mb-6 bg-white/70 backdrop-blur p-1.5 rounded-2xl border border-[#E3D9B5] sticky top-2 z-20">
          {tabs.map(([id, key, icon]) => (
            <button key={id} onClick={() => setTab(id)} className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 cursor-pointer ${tab === id ? 'bg-[#1B3B22] text-[#F4EEDC] shadow-md' : 'text-[#4A5D50] hover:bg-[#E3D9B5]/40'}`}>
              <span className="mr-1">{icon}</span>{t(key)}
            </button>
          ))}
        </nav>

        <div key={tab} className="av-in">
          {tab === 'today' && <TodayView onReflect={(topic) => { setReflectionTopic(topic); setTab('reflect') }} />}
          {tab === 'reflect' && <ReflectView key={reflectionTopic} startTopic={reflectionTopic} />}
          {tab === 'week' && <WeekView />}
        </div>

        {FEEDBACK_URL && (
          <p className="text-center mt-4 mb-2"><a href={FEEDBACK_URL} target="_blank" rel="noreferrer" className="text-xs font-bold text-[#1B3B22] underline">{t('feedback')}</a></p>
        )}
      </div>
    </main>
  )
}

export default function Home() {
  return (
    <LangProvider>
      <MotifProvider>
        <Shell />
      </MotifProvider>
    </LangProvider>
  )
}
