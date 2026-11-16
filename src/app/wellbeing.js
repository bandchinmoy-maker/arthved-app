'use client'

import React, { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useLang } from './i18n'
import { getContent } from './content'
import { CosmicDance, useMotif } from './cosmic'
import { saveCheckIn, getCheckIns, saveReflection, getReflections, deleteAllJournalData } from './journal'

const card = 'bg-white/90 rounded-3xl border border-[#E3D9B5] shadow-[0_8px_30px_-12px_rgba(27,59,34,0.25)] p-6'
const btn = 'bg-[#1B3B22] hover:bg-[#14301a] disabled:opacity-40 text-[#F4EEDC] font-bold text-sm px-6 py-3 rounded-xl cursor-pointer transition active:scale-95'
const accent = 'bg-[#E05A38] hover:bg-[#c94e2f] disabled:opacity-40 text-white font-bold text-sm px-6 py-3 rounded-xl cursor-pointer transition active:scale-95'
const ghost = 'bg-[#E3D9B5]/40 hover:bg-[#E3D9B5]/70 text-[#1E2923] font-bold text-sm px-5 py-3 rounded-xl cursor-pointer transition active:scale-95'
const field = 'w-full border border-[#E3D9B5] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3B22] bg-white'
const serif = 'font-serif text-[#1B3B22]'
const ORB = ['#9DB0C4', '#BDB6D3', '#E3D8A8', '#A9CFA2', '#F3BC52']
const dayKey = (d) => { const x = new Date(d); return `${x.getFullYear()}-${x.getMonth() + 1}-${x.getDate()}` }

export function SafetyNote() {
  const { t } = useLang()
  return (
    <details className="text-xs text-[#4A5D50]">
      <summary className="cursor-pointer font-bold">ⓘ {t('safetyTitle')}</summary>
      <p className="mt-2 leading-relaxed">{t('safety')}</p>
    </details>
  )
}

function MoodOrbs({ value, onChange, moods, large = true }) {
  const dim = large ? 'w-14 h-14 text-2xl' : 'w-11 h-11 text-xl'
  return (
    <div className="flex justify-between gap-1">
      {moods.map((m) => {
        const on = value === m.v
        return (
          <button key={m.v} type="button" onClick={() => onChange(m.v)} aria-pressed={on} className="flex flex-col items-center gap-1.5 cursor-pointer group flex-1">
            <span className={`${dim} rounded-full flex items-center justify-center transition-all duration-300 ${on ? 'scale-110 shadow-lg ring-4 ring-offset-2 ring-offset-white' : 'opacity-75 group-hover:opacity-100 group-hover:scale-105'}`} style={{ background: ORB[m.v - 1], '--tw-ring-color': ORB[m.v - 1] }}>{m.e}</span>
            <span className={`text-[10px] font-bold text-center leading-tight ${on ? 'text-[#1B3B22]' : 'text-[#4A5D50]'}`}>{m.l}</span>
          </button>
        )
      })}
    </div>
  )
}

export function TodayView({ onReflect }) {
  const { user } = useUser()
  const { t, lang } = useLang()
  const { on: motif } = useMotif()
  const C = getContent(lang)
  const [mood, setMood] = useState(null)
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(null)
  const [lastNote, setLastNote] = useState('')
  const [days, setDays] = useState(0)
  const thought = C.THOUGHTS[new Date().getDay() % C.THOUGHTS.length]
  const hour = new Date().getHours()
  const greet = hour < 12 ? t('greetM') : hour < 17 ? t('greetA') : t('greetE')

  const loadDays = async () => {
    try {
      const res = await getCheckIns(7)
      if (res.success) setDays(new Set(res.data.map((c) => dayKey(c.createdAt))).size)
    } catch (err) {
      console.error(err)
    }
  }
  useEffect(() => { loadDays() }, [])

  const submit = async () => {
    if (!mood || saving) return
    setSaving(true)
    try {
      const res = await saveCheckIn({ mood, note })
      if (!res.success) throw new Error(res.error)
      setDone(mood)
      setLastNote(note)
      setNote('')
      loadDays()
    } catch (err) {
      console.error(err)
      alert(t('saveFail'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 mb-8">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1B3B22] to-[#0F2415] text-[#F4EEDC] p-6 md:p-8 shadow-lg">
        {motif && <div className="absolute -right-8 -top-8 opacity-90 pointer-events-none"><CosmicDance size={190} light /></div>}
        <p className="text-xs uppercase tracking-[0.2em] text-[#F4EEDC]/70 font-bold">{greet}</p>
        <h2 className="mt-1 text-3xl font-black font-serif">{user && user.firstName ? user.firstName : 'Arthveda'}</h2>
        <p className="mt-2 text-[#F4EEDC]/80 max-w-[62%]">{t('moodQ')}</p>
        <div className="mt-6 flex items-center gap-3">
          <svg width="44" height="44" viewBox="0 0 48 48" aria-hidden="true">
            <circle cx="24" cy="24" r="20" fill="none" stroke="#F4EEDC" strokeOpacity=".2" strokeWidth="5" />
            <circle cx="24" cy="24" r="20" fill="none" stroke="#E05A38" strokeWidth="5" strokeLinecap="round" strokeDasharray={`${(days / 7) * 125.6} 125.6`} transform="rotate(-90 24 24)" className="transition-all duration-700" />
          </svg>
          <span className="text-sm font-bold">{t('weekDays', { n: days })}</span>
        </div>
      </section>

      <section className={card}>
        <MoodOrbs value={mood} onChange={setMood} moods={C.MOODS} />
        <input type="text" maxLength={280} value={note} onChange={(e) => setNote(e.target.value)} placeholder={t('notePh')} className={field + ' mt-6'} />
        <button onClick={submit} disabled={!mood || saving} className={accent + ' mt-4'}>{saving ? t('saving') : t('saveCheck')}</button>
        {done && (
          <div className="mt-5 rounded-2xl bg-[#1B3B22]/5 border border-[#1B3B22]/15 p-4 av-in">
            <div className="flex items-center gap-3">
              <span className="av-pop w-8 h-8 rounded-full bg-[#1B3B22] text-[#F4EEDC] flex items-center justify-center text-sm">✓</span>
              <p className="font-bold text-[#1B3B22]">{t('checkSaved')}</p>
            </div>
            <p className="text-sm text-[#1E2923] mt-2">{done <= 2 ? t('lowMsg') : done === 3 ? t('afterMid') : t('afterHigh')}</p>
            {done <= 2 && <p className="text-xs text-[#4A5D50] mt-2">{t('safety')}</p>}
            <button onClick={() => onReflect(lastNote)} className={ghost + ' mt-3'}>{t('reflectNow')}</button>
          </div>
        )}
      </section>

      <section className={card + ' border-l-4 border-l-[#E05A38]'}>
        <p className="text-xs font-bold text-[#E05A38] uppercase tracking-wider">{t('thoughtLbl')}</p>
        <p className="text-xl font-serif font-bold text-[#1B3B22] mt-2 leading-snug">{thought}</p>
        <button onClick={() => onReflect(thought)} className={ghost + ' mt-4'}>{t('thinkOn')}</button>
      </section>

      <section>
        <p className="text-xs font-bold text-[#4A5D50] uppercase tracking-wider mb-2">{t('quickStart')}</p>
        <div className="flex flex-wrap gap-2">
          {C.TOPIC_CHIPS.slice(0, 4).map((c) => (
            <button key={c} onClick={() => onReflect(c)} className="px-4 py-2 rounded-full text-xs font-bold border border-[#E3D9B5] bg-white/80 hover:bg-white hover:-translate-y-0.5 transition cursor-pointer">{c}</button>
          ))}
        </div>
      </section>
      <SafetyNote />
    </div>
  )
}

export function ReflectView({ startTopic }) {
  const { t, lang } = useLang()
  const C = getContent(lang)
  const [step, setStep] = useState(1)
  const [q, setQ] = useState(0)
  const [topic, setTopic] = useState(startTopic || '')
  const [lensId, setLensId] = useState(null)
  const [answers, setAnswers] = useState([])
  const [moodBefore, setMoodBefore] = useState(null)
  const [moodAfter, setMoodAfter] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [past, setPast] = useState([])
  const lens = C.LENSES.find((l) => l.id === lensId)
  const n = lens ? lens.questions.length : 0
  const icons = { gita: '🪔', stoic: '⚖️', buddhist: '🌸', reason: '🔎' }

  const loadPast = async () => {
    try {
      const res = await getReflections(5)
      if (res.success) setPast(res.data)
    } catch (err) {
      console.error(err)
    }
  }
  useEffect(() => { loadPast() }, [])

  const pickLens = (l) => { setLensId(l.id); setAnswers(l.questions.map(() => '')); setQ(0); setStep(3) }

  const save = async () => {
    if (saving) return
    setSaving(true)
    try {
      const res = await saveReflection({ topic, lens: lensId, answers, moodBefore, moodAfter })
      if (!res.success) throw new Error(res.error)
      setSaved(true)
      loadPast()
    } catch (err) {
      console.error(err)
      alert(t('saveFail'))
    } finally {
      setSaving(false)
    }
  }

  const restart = () => { setStep(1); setQ(0); setTopic(''); setLensId(null); setAnswers([]); setMoodBefore(null); setMoodAfter(null); setSaved(false) }
  const face = (v) => (C.MOODS.find((m) => m.v === v) || {}).e

  return (
    <div className="space-y-6 mb-8">
      {step === 1 && (
        <div className={card + ' av-in'}>
          <h2 className={`text-2xl font-black ${serif}`}>{t('topicQ')}</h2>
          <div className="flex flex-wrap gap-2 mt-4">
            {C.TOPIC_CHIPS.map((c) => (
              <button key={c} onClick={() => setTopic(c)} className={`px-4 py-2 rounded-full text-xs font-bold border cursor-pointer transition ${topic === c ? 'bg-[#1B3B22] text-[#F4EEDC] border-[#1B3B22]' : 'bg-white border-[#E3D9B5] text-[#1E2923] hover:bg-[#F4EEDC]'}`}>{c}</button>
            ))}
          </div>
          <textarea rows={3} maxLength={300} value={topic} onChange={(e) => setTopic(e.target.value)} placeholder={t('topicPh')} className={field + ' mt-4'}></textarea>
          <button onClick={() => setStep(2)} disabled={!topic.trim()} className={btn + ' mt-4'}>{t('next')}</button>
        </div>
      )}
      {step === 2 && (
        <div className={card + ' av-in'}>
          <h2 className={`text-2xl font-black ${serif}`}>{t('lensQ')}</h2>
          <p className="text-sm text-[#4A5D50] mt-1 italic">“{topic}”</p>
          <div className="grid gap-3 mt-5">
            {C.LENSES.map((l) => (
              <button key={l.id} onClick={() => pickLens(l)} className="flex items-center gap-4 text-left border border-[#E3D9B5] bg-white hover:bg-[#F4EEDC] hover:-translate-y-0.5 hover:shadow-md transition rounded-2xl p-4 cursor-pointer">
                <span className="w-12 h-12 rounded-2xl bg-[#1B3B22]/8 flex items-center justify-center text-2xl bg-[#1B3B22]/10">{icons[l.id]}</span>
                <span>
                  <span className="block font-bold text-[#1E2923]">{l.name}</span>
                  <span className="block text-xs text-[#4A5D50] mt-0.5">{l.tagline}</span>
                </span>
              </button>
            ))}
          </div>
          <button onClick={() => setStep(1)} className={ghost + ' mt-5'}>{t('back')}</button>
        </div>
      )}
      {step === 3 && lens && (
        <div className={card + ' av-in'} key={q + '-' + saved}>
          <p className="text-xs font-bold text-[#E05A38] uppercase tracking-wider">{lens.name}</p>
          <div className="h-1.5 rounded-full bg-[#E3D9B5] mt-3 overflow-hidden">
            <div className="h-full bg-[#1B3B22] rounded-full transition-all duration-500" style={{ width: `${(saved ? 1 : q / (n + 1)) * 100}%` }}></div>
          </div>
          {saved ? (
            <div className="mt-6 text-center">
              <span className="av-pop inline-flex w-14 h-14 rounded-full bg-[#1B3B22] text-[#F4EEDC] items-center justify-center text-2xl">✓</span>
              <p className={`mt-4 text-xl font-bold ${serif}`}>{t('reflSaved')}</p>
              <button onClick={restart} className={ghost + ' mt-5'}>{t('newRefl')}</button>
            </div>
          ) : q === 0 ? (
            <div className="mt-6">
              <h3 className={`text-lg font-bold ${serif}`}>{t('moodBefore')}</h3>
              <p className="text-sm text-[#4A5D50] italic mt-1">“{topic}”</p>
              <div className="mt-5"><MoodOrbs value={moodBefore} onChange={setMoodBefore} moods={C.MOODS} large={false} /></div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(2)} className={ghost}>{t('back')}</button>
                <button onClick={() => setQ(1)} className={btn}>{t('next')}</button>
              </div>
            </div>
          ) : q <= n ? (
            <div className="mt-6">
              <p className="text-xs font-bold text-[#4A5D50] uppercase tracking-wider">{t('stepOf', { i: q, n })}</p>
              <h3 className={`text-xl font-bold mt-2 leading-snug ${serif}`}>{lens.questions[q - 1]}</h3>
              <textarea autoFocus rows={4} maxLength={1000} value={answers[q - 1] || ''} onChange={(e) => setAnswers(answers.map((a, j) => (j === q - 1 ? e.target.value : a)))} className={field + ' mt-4'}></textarea>
              <div className="flex gap-3 mt-4">
                <button onClick={() => setQ(q - 1)} className={ghost}>{t('back')}</button>
                <button onClick={() => setQ(q + 1)} className={btn}>{t('next')}</button>
              </div>
            </div>
          ) : (
            <div className="mt-6">
              <h3 className={`text-lg font-bold ${serif}`}>{t('moodAfter')}</h3>
              <div className="mt-5"><MoodOrbs value={moodAfter} onChange={setMoodAfter} moods={C.MOODS} large={false} /></div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setQ(n)} className={ghost}>{t('back')}</button>
                <button onClick={save} disabled={saving} className={accent}>{saving ? t('saving') : t('saveRefl')}</button>
              </div>
            </div>
          )}
        </div>
      )}
      {past.length > 0 && (
        <div className={card}>
          <h3 className={`font-bold ${serif} mb-3`}>{t('pastRefl')}</h3>
          <div className="space-y-2">
            {past.map((r) => (
              <details key={r.id} className="border border-[#E3D9B5] rounded-xl p-3 bg-white">
                <summary className="text-sm font-bold text-[#1E2923] cursor-pointer">
                  {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} · {r.topic}
                  {r.moodBefore && r.moodAfter ? ` · ${face(r.moodBefore)}→${face(r.moodAfter)}` : ''}
                </summary>
                <ul className="mt-2 space-y-1 text-sm text-[#4A5D50] list-disc pl-5">
                  {r.answers.filter(Boolean).map((a, i) => <li key={i}>{a}</li>)}
                </ul>
              </details>
            ))}
          </div>
        </div>
      )}
      <SafetyNote />
    </div>
  )
}

export function WeekView() {
  const { t, lang } = useLang()
  const C = getContent(lang)
  const [checks, setChecks] = useState([])
  const [refl, setRefl] = useState([])
  const [loaded, setLoaded] = useState(false)
  const [grown, setGrown] = useState(false)
  const locale = lang === 'hi' ? 'hi-IN' : 'en-IN'

  useEffect(() => {
    const load = async () => {
      try {
        const [c, r] = await Promise.all([getCheckIns(7), getReflections(200)])
        if (c.success) setChecks(c.data)
        if (r.success) setRefl(r.data)
      } catch (err) {
        console.error(err)
      }
      setLoaded(true)
      setTimeout(() => setGrown(true), 80)
    }
    load()
  }, [])

  const days = [...Array(7)].map((_, i) => {
    const d = new Date(Date.now() - (6 - i) * 86400000)
    const key = dayKey(d)
    const list = checks.filter((c) => dayKey(c.createdAt) === key)
    const avg = list.length ? list.reduce((a, c) => a + c.mood, 0) / list.length : null
    return { label: d.toLocaleDateString(locale, { weekday: 'short' }), full: d.toLocaleDateString(locale, { weekday: 'long' }), avg }
  })
  const withData = days.filter((d) => d.avg !== null)
  const lowest = withData.length > 1 ? withData.reduce((a, b) => (b.avg < a.avg ? b : a)) : null
  const weekRefl = refl.filter((r) => new Date(r.createdAt).getTime() >= Date.now() - 7 * 86400000).length
  const both = refl.filter((r) => r.moodBefore && r.moodAfter && new Date(r.createdAt).getTime() >= Date.now() - 30 * 86400000)
  const shift = both.length >= 3 ? both.reduce((a, r) => a + (r.moodAfter - r.moodBefore), 0) / both.length : null
  const avgAll = checks.length ? checks.reduce((a, c) => a + c.mood, 0) / checks.length : null

  const exportData = async () => {
    const [c, r] = await Promise.all([getCheckIns(365), getReflections(500)])
    const data = { app: 'arthveda', exportedAt: new Date().toISOString(), checkIns: c.success ? c.data : [], reflections: r.success ? r.data : [] }
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }))
    a.download = 'arthveda-my-data.json'
    a.click()
  }

  const wipe = async () => {
    if (!window.confirm(t('wipeConfirm'))) return
    const res = await deleteAllJournalData()
    if (res.success) { setChecks([]); setRefl([]); alert(t('wipeDone')) } else alert(t('wipeFail'))
  }

  return (
    <div className="space-y-6 mb-8">
      <div className="grid grid-cols-3 gap-3">
        {[[t('statChecks'), checks.length], [t('statRefl'), weekRefl], [t('statMood'), avgAll ? `${C.MOODS[Math.round(avgAll) - 1].e} ${avgAll.toFixed(1)}` : '–']].map(([label, value]) => (
          <div key={label} className="rounded-2xl bg-[#1B3B22] text-[#F4EEDC] p-4 shadow-md">
            <p className="text-2xl font-black font-serif">{value}</p>
            <p className="text-[10px] uppercase tracking-wider text-[#F4EEDC]/70 font-bold mt-1">{label}</p>
          </div>
        ))}
      </div>
      <div className={card}>
        <h2 className={`text-xl font-black ${serif}`}>{t('weekTitle')}</h2>
        {!loaded ? <p className="text-sm text-[#4A5D50] mt-3">{t('loading')}</p> : (
          <>
            <div className="flex items-end gap-3 h-48 mt-5">
              {days.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                  <span className="text-lg mb-1 transition-opacity duration-700" style={{ opacity: grown && d.avg ? 1 : 0 }}>{d.avg ? C.MOODS[Math.round(d.avg) - 1].e : ''}</span>
                  <div className="w-full rounded-t-xl transition-all duration-700 ease-out" style={{ height: grown && d.avg ? `${(d.avg / 5) * 80}%` : '4px', background: d.avg ? ORB[Math.round(d.avg) - 1] : '#E3D9B5', transitionDelay: `${i * 70}ms` }}></div>
                  <span className="text-[11px] font-bold text-[#4A5D50] mt-1">{d.label}</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-[#4A5D50] mt-4">{t('weekCounts', { c: checks.length, r: weekRefl })}</p>
            {withData.length === 0 && <p className="text-sm text-[#4A5D50] mt-2">{t('weekEmpty')}</p>}
          </>
        )}
      </div>
      {lowest && (
        <div className={card + ' border-l-4 border-l-[#E05A38]'}>
          <p className={`text-lg font-serif font-bold ${serif}`}>{t('lowestDay', { d: lowest.full })}</p>
        </div>
      )}
      {shift !== null && (
        <div className={card}>
          <p className="text-sm text-[#1E2923]">{t('shift', { d: (shift > 0 ? '+' : '') + shift.toFixed(1) })}</p>
        </div>
      )}
      <details className={card}>
        <summary className={`cursor-pointer font-bold ${serif}`}>{t('dataTitle')}</summary>
        <p className="text-xs text-[#4A5D50] mt-3">{t('dataDesc')}</p>
        <div className="flex gap-3 mt-3 flex-wrap">
          <button onClick={exportData} className={ghost}>{t('download')}</button>
          <button onClick={wipe} className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-sm px-5 py-3 rounded-xl cursor-pointer">{t('wipe')}</button>
        </div>
      </details>
      <SafetyNote />
    </div>
  )
}
