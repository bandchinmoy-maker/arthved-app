'use client';

import React, { useState, useEffect, useRef } from 'react'

const ramayanaSlides = [
  { name: "Shri Ram (श्री राम)", title: "Maryada Purushottam — The Supreme Ideal", deed: "Pita ke vachan hetu 14 varsh ka vanvas sweekar kiya aur asatya par satya ki vijay sthapit karke maryada ka adarsh sthapit kiya.", symbol: "🏹", badge: "Divine Epitome" },
  { name: "Mata Sita (माता सीता)", title: "Pavitrata & Tyag ki Moorti", deed: "Rajya ke sabhi sukhon ka tyag karke vanvas mein sahayatri bani, atulya dhairya aur aatma-bal ka sacha parichay diya.", symbol: "🪷", badge: "Grace & Resilience" },
  { name: "Lakshman ji (लक्ष्मण जी)", title: "Bhratruprem & Nishtha", deed: "Bina ek pal soche bade bhai Shri Ram aur bhabhi ke sath vanvas gaye aur din-raat adig pehra dekar lakshman rekha ki maryada rakhi.", symbol: "🛡️", badge: "Eternal Loyalty" },
  { name: "Hanuman ji (हनुमान जी)", title: "Pawanputra & Sankat Mochan", deed: "Samudra langh kar Lanka mein Mata Sita ki khoj ki, Lanka dahan kiya aur Sanjeevani booti laakar lakshman ji ke pran bachaye.", symbol: "🏔️", badge: "Supreme Devotee" },
  { name: "Jatayu (जटायु)", title: "Param Pakshiraj & Yoddha", deed: "Mata Sita ki raksha ke liye akash mein Ravan se bhayanak yuddh kiya aur dharm ke liye apne praan samarpit kiye.", symbol: "🦅", badge: "Brave Protector" },
  { name: "Sugriva & Angada (सुग्रीव व अंगद)", title: "Kishkindha Leaders", deed: "Shri Ram ke sath sachha mitrata ka vachan nibhaya aur mahan Vanara sena ka netritva karke adharm ka nash kiya.", symbol: "🤝", badge: "Vanara Strength" },
  { name: "Jambavan (जाम्बवान जी)", title: "Riksharaj & Wise Elder", deed: "Apni agya aur gyan se Hanuman ji ko unki alaukik shaktiyon ka smaran karaya aur yuddh mein param margdarshan diya.", symbol: "🐻", badge: "Divine Wisdom" },
  { name: "Nala & Nila (नल और नीलकंठ)", title: "Divine Architects", deed: "Vishwakarma ke aashirwad aur gyan se samudra par mahan 'Ram Setu' ka nirmaan kiya jisse sena Lanka pahunchi.", symbol: "🌉", badge: "Master Engineers" }
];

// Comprehensive Global Countries & Currencies List (All World Countries Included, Pakistan & Bangladesh Excluded)
const GLOBAL_COUNTRIES = [
  { country: "India", currency: "INR", symbol: "₹", rateToINR: 1 },
  { country: "Qatar", currency: "QAR", symbol: "QR", rateToINR: 22.80 },
  { country: "United States", currency: "USD", symbol: "$", rateToINR: 86.50 },
  { country: "United Arab Emirates", currency: "AED", symbol: "AED", rateToINR: 23.50 },
  { country: "United Kingdom", currency: "GBP", symbol: "£", rateToINR: 110.20 },
  { country: "Eurozone (Germany, France, Italy, etc.)", currency: "EUR", symbol: "€", rateToINR: 92.40 },
  { country: "Saudi Arabia", currency: "SAR", symbol: "SR", rateToINR: 23.05 },
  { country: "Afghanistan", currency: "AFN", symbol: "؋", rateToINR: 1.20 },
  { country: "Albania", currency: "ALL", symbol: "L", rateToINR: 0.92 },
  { country: "Algeria", currency: "DZD", symbol: "دج", rateToINR: 0.64 },
  { country: "Andorra", currency: "EUR", symbol: "€", rateToINR: 92.40 },
  { country: "Angola", currency: "AOA", symbol: "Kz", rateToINR: 0.10 },
  { country: "Argentina", currency: "ARS", symbol: "$", rateToINR: 0.088 },
  { country: "Armenia", currency: "AMD", symbol: "֏", rateToINR: 0.22 },
  { country: "Australia", currency: "AUD", symbol: "A$", rateToINR: 55.60 },
  { country: "Austria", currency: "EUR", symbol: "€", rateToINR: 92.40 },
  { country: "Azerbaijan", currency: "AZN", symbol: "₼", rateToINR: 50.80 },
  { country: "Bahamas", currency: "BSD", symbol: "$", rateToINR: 86.50 },
  { country: "Bahrain", currency: "BHD", symbol: "BD", rateToINR: 229.30 },
  { country: "Barbados", currency: "BBD", symbol: "$", rateToINR: 43.25 },
  { country: "Belarus", currency: "BYN", symbol: "Br", rateToINR: 26.50 },
  { country: "Belgium", currency: "EUR", symbol: "€", rateToINR: 92.40 },
  { country: "Belize", currency: "BZD", symbol: "BZ$", rateToINR: 42.80 },
  { country: "Benin", currency: "XOF", symbol: "CFA", rateToINR: 0.14 },
  { country: "Bhutan", currency: "BTN", symbol: "Nu.", rateToINR: 1.00 },
  { country: "Bolivia", currency: "BOB", symbol: "Bs.", rateToINR: 12.50 },
  { country: "Bosnia and Herzegovina", currency: "BAM", symbol: "KM", rateToINR: 47.20 },
  { country: "Botswana", currency: "BWP", symbol: "P", rateToINR: 6.40 },
  { country: "Brazil", currency: "BRL", symbol: "R$", rateToINR: 14.80 },
  { country: "Brunei", currency: "BND", symbol: "B$", rateToINR: 65.40 },
  { country: "Bulgaria", currency: "BGN", symbol: "лв", rateToINR: 47.20 },
  { country: "Burkina Faso", currency: "XOF", symbol: "CFA", rateToINR: 0.14 },
  { country: "Burundi", currency: "BIF", symbol: "FBu", rateToINR: 0.030 },
  { country: "Cambodia", currency: "KHR", symbol: "៛", rateToINR: 0.021 },
  { country: "Cameroon", currency: "XAF", symbol: "FCFA", rateToINR: 0.14 },
  { country: "Canada", currency: "CAD", symbol: "C$", rateToINR: 61.20 },
  { country: "Cape Verde", currency: "CVE", symbol: "Esc", rateToINR: 0.84 },
  { country: "Central African Republic", currency: "XAF", symbol: "FCFA", rateToINR: 0.14 },
  { country: "Chad", currency: "XAF", symbol: "FCFA", rateToINR: 0.14 },
  { country: "Chile", currency: "CLP", symbol: "$", rateToINR: 0.091 },
  { country: "China", currency: "CNY", symbol: "¥", rateToINR: 11.90 },
  { country: "Colombia", currency: "COP", symbol: "$", rateToINR: 0.021 },
  { country: "Comoros", currency: "KMF", symbol: "CF", rateToINR: 0.19 },
  { country: "Congo (Democratic Republic)", currency: "CDF", symbol: "FC", rateToINR: 0.030 },
  { country: "Congo (Republic)", currency: "XAF", symbol: "FCFA", rateToINR: 0.14 },
  { country: "Costa Rica", currency: "CRC", symbol: "₡", rateToINR: 0.17 },
  { country: "Croatia", currency: "EUR", symbol: "€", rateToINR: 92.40 },
  { country: "Cuba", currency: "CUP", symbol: "$", rateToINR: 3.60 },
  { country: "Cyprus", currency: "EUR", symbol: "€", rateToINR: 92.40 },
  { country: "Czech Republic", currency: "CZK", symbol: "Kč", rateToINR: 3.70 },
  { country: "Denmark", currency: "DKK", symbol: "kr", rateToINR: 12.35 },
  { country: "Djibouti", currency: "DJF", symbol: "Fdj", rateToINR: 0.49 },
  { country: "Dominica", currency: "XCD", symbol: "EC$", rateToINR: 32.00 },
  { country: "Dominican Republic", currency: "DOP", symbol: "RD$", rateToINR: 1.45 },
  { country: "Ecuador", currency: "USD", symbol: "$", rateToINR: 86.50 },
  { country: "Egypt", currency: "EGP", symbol: "E£", rateToINR: 1.78 },
  { country: "El Salvador", currency: "USD", symbol: "$", rateToINR: 86.50 },
  { country: "Equatorial Guinea", currency: "XAF", symbol: "FCFA", rateToINR: 0.14 },
  { country: "Eritrea", currency: "ERN", symbol: "Nfk", rateToINR: 5.76 },
  { country: "Estonia", currency: "EUR", symbol: "€", rateToINR: 92.40 },
  { country: "Eswatini", currency: "SZL", symbol: "L", rateToINR: 4.75 },
  { country: "Ethiopia", currency: "ETB", symbol: "Br", rateToINR: 0.74 },
  { country: "Fiji", currency: "FJD", symbol: "FJ$", rateToINR: 38.50 },
  { country: "Finland", currency: "EUR", symbol: "€", rateToINR: 92.40 },
  { country: "France", currency: "EUR", symbol: "€", rateToINR: 92.40 },
  { country: "Gabon", currency: "XAF", symbol: "FCFA", rateToINR: 0.14 },
  { country: "Gambia", currency: "GMD", symbol: "D", rateToINR: 1.25 },
  { country: "Georgia", currency: "GEL", symbol: "₾", rateToINR: 31.80 },
  { country: "Germany", currency: "EUR", symbol: "€", rateToINR: 92.40 },
  { country: "Ghana", currency: "GHS", symbol: "GH₵", rateToINR: 5.80 },
  { country: "Greece", currency: "EUR", symbol: "€", rateToINR: 92.40 },
  { country: "Grenada", currency: "XCD", symbol: "EC$", rateToINR: 32.00 },
  { country: "Guatemala", currency: "GTQ", symbol: "Q", rateToINR: 11.20 },
  { country: "Guinea", currency: "GNF", symbol: "FG", rateToINR: 0.010 },
  { country: "Guinea-Bissau", currency: "XOF", symbol: "CFA", rateToINR: 0.14 },
  { country: "Guyana", currency: "GYD", symbol: "G$", rateToINR: 0.41 },
  { country: "Haiti", currency: "HTG", symbol: "G", rateToINR: 0.65 },
  { country: "Honduras", currency: "HNL", symbol: "L", rateToINR: 3.50 },
  { country: "Hungary", currency: "HUF", symbol: "Ft", rateToINR: 0.23 },
  { country: "Iceland", currency: "ISK", symbol: "kr", rateToINR: 0.62 },
  { country: "Indonesia", currency: "IDR", symbol: "Rp", rateToINR: 0.0054 },
  { country: "Iran", currency: "IRR", symbol: "﷼", rateToINR: 0.0020 },
  { country: "Iraq", currency: "IQD", symbol: "ع.د", rateToINR: 0.066 },
  { country: "Ireland", currency: "EUR", symbol: "€", rateToINR: 92.40 },
  { country: "Israel", currency: "ILS", symbol: "₪", rateToINR: 23.40 },
  { country: "Italy", currency: "EUR", symbol: "€", rateToINR: 92.40 },
  { country: "Jamaica", currency: "JMD", symbol: "J$", rateToINR: 0.55 },
  { country: "Japan", currency: "JPY", symbol: "¥", rateToINR: 0.56 },
  { country: "Jordan", currency: "JOD", symbol: "JD", rateToINR: 122.00 },
  { country: "Kazakhstan", currency: "KZT", symbol: "₸", rateToINR: 0.17 },
  { country: "Kenya", currency: "KES", symbol: "KSh", rateToINR: 0.67 },
  { country: "Kiribati", currency: "AUD", symbol: "A$", rateToINR: 55.60 },
  { country: "Korea (North)", currency: "KPW", symbol: "₩", rateToINR: 0.96 },
  { country: "Korea (South)", currency: "KRW", symbol: "₩", rateToINR: 0.061 },
  { country: "Kuwait", currency: "KWD", symbol: "KD", rateToINR: 281.50 },
  { country: "Kyrgyzstan", currency: "KGS", symbol: "с", rateToINR: 0.98 },
  { country: "Laos", currency: "LAK", symbol: "₭", rateToINR: 0.0040 },
  { country: "Latvia", currency: "EUR", symbol: "€", rateToINR: 92.40 },
  { country: "Lebanon", currency: "LBP", symbol: "ل.ل", rateToINR: 0.00096 },
  { country: "Lesotho", currency: "LSL", symbol: "L", rateToINR: 4.75 },
  { country: "Liberia", currency: "LRD", symbol: "L$", rateToINR: 0.44 },
  { country: "Libya", currency: "LYD", symbol: "LD", rateToINR: 17.80 },
  { country: "Liechtenstein", currency: "CHF", symbol: "CHF", rateToINR: 98.20 },
  { country: "Lithuania", currency: "EUR", symbol: "€", rateToINR: 92.40 },
  { country: "Luxembourg", currency: "EUR", symbol: "€", rateToINR: 92.40 },
  { country: "Madagascar", currency: "MGA", symbol: "Ar", rateToINR: 0.019 },
  { country: "Malawi", currency: "MWK", symbol: "MK", rateToINR: 0.050 },
  { country: "Malaysia", currency: "MYR", symbol: "RM", rateToINR: 19.40 },
  { country: "Maldives", currency: "MVR", symbol: "Rf", rateToINR: 5.60 },
  { country: "Mali", currency: "XOF", symbol: "CFA", rateToINR: 0.14 },
  { country: "Malta", currency: "EUR", symbol: "€", rateToINR: 92.40 },
  { country: "Marshall Islands", currency: "USD", symbol: "$", rateToINR: 86.50 },
  { country: "Mauritania", currency: "MRU", symbol: "UM", rateToINR: 2.20 },
  { country: "Mauritius", currency: "MUR", symbol: "₨", rateToINR: 1.88 },
  { country: "Mexico", currency: "MXN", symbol: "$", rateToINR: 4.30 },
  { country: "Micronesia", currency: "USD", symbol: "$", rateToINR: 86.50 },
  { country: "Moldova", currency: "MDL", symbol: "L", rateToINR: 4.80 },
  { country: "Monaco", currency: "EUR", symbol: "€", rateToINR: 92.40 },
  { country: "Mongolia", currency: "MNT", symbol: "₮", rateToINR: 0.025 },
  { country: "Montenegro", currency: "EUR", symbol: "€", rateToINR: 92.40 },
  { country: "Morocco", currency: "MAD", symbol: "DH", rateToINR: 8.60 },
  { country: "Mozambique", currency: "MZN", symbol: "MT", rateToINR: 1.35 },
  { country: "Myanmar", currency: "MMK", symbol: "K", rateToINR: 0.041 },
  { country: "Namibia", currency: "NAD", symbol: "$", rateToINR: 4.75 },
  { country: "Nauru", currency: "AUD", symbol: "A$", rateToINR: 55.60 },
  { country: "Nepal", currency: "NPR", symbol: "रू", rateToINR: 0.62 },
  { country: "Netherlands", currency: "EUR", symbol: "€", rateToINR: 92.40 },
  { country: "New Zealand", currency: "NZD", symbol: "NZ$", rateToINR: 51.20 },
  { country: "Nicaragua", currency: "NIO", symbol: "C$", rateToINR: 2.35 },
  { country: "Niger", currency: "XOF", symbol: "CFA", rateToINR: 0.14 },
  { country: "Nigeria", currency: "NGN", symbol: "₦", rateToINR: 0.055 },
  { country: "North Macedonia", currency: "MKD", symbol: "ден", rateToINR: 1.50 },
  { country: "Norway", currency: "NOK", symbol: "kr", rateToINR: 7.90 },
  { country: "Oman", currency: "OMR", symbol: "OMR", rateToINR: 224.80 },
  { country: "Palau", currency: "USD", symbol: "$", rateToINR: 86.50 },
  { country: "Panama", currency: "PAB", symbol: "B/.", rateToINR: 86.50 },
  { country: "Papua New Guinea", currency: "PGK", symbol: "K", rateToINR: 22.10 },
  { country: "Paraguay", currency: "PYG", symbol: "₲", rateToINR: 0.011 },
  { country: "Peru", currency: "PEN", symbol: "S/.", rateToINR: 23.20 },
  { country: "Philippines", currency: "PHP", symbol: "₱", rateToINR: 1.48 },
  { country: "Poland", currency: "PLN", symbol: "zł", rateToINR: 21.50 },
  { country: "Portugal", currency: "EUR", symbol: "€", rateToINR: 92.40 },
  { country: "Romania", currency: "RON", symbol: "lei", rateToINR: 18.50 },
  { country: "Russia", currency: "RUB", symbol: "₽", rateToINR: 0.92 },
  { country: "Rwanda", currency: "RWF", symbol: "FRw", rateToINR: 0.064 },
  { country: "Saint Kitts and Nevis", currency: "XCD", symbol: "EC$", rateToINR: 32.00 },
  { country: "Saint Lucia", currency: "XCD", symbol: "EC$", rateToINR: 32.00 },
  { country: "Saint Vincent and the Grenadines", currency: "XCD", symbol: "EC$", rateToINR: 32.00 },
  { country: "Samoa", currency: "WST", symbol: "T", rateToINR: 31.50 },
  { country: "San Marino", currency: "EUR", symbol: "€", rateToINR: 92.40 },
  { country: "Sao Tome and Principe", currency: "STN", symbol: "Db", rateToINR: 3.75 },
  { country: "Senegal", currency: "XOF", symbol: "CFA", rateToINR: 0.14 },
  { country: "Serbia", currency: "RSD", symbol: "дин", rateToINR: 0.79 },
  { country: "Seychelles", currency: "SCR", symbol: "SR", rateToINR: 6.30 },
  { country: "Sierra Leone", currency: "SLL", symbol: "Le", rateToINR: 0.0039 },
  { country: "Singapore", currency: "SGD", symbol: "S$", rateToINR: 65.40 },
  { country: "Slovakia", currency: "EUR", symbol: "€", rateToINR: 92.40 },
  { country: "Slovenia", currency: "EUR", symbol: "€", rateToINR: 92.40 },
  { country: "Solomon Islands", currency: "SBD", symbol: "SI$", rateToINR: 10.20 },
  { country: "Somalia", currency: "SOS", symbol: "Sh.so", rateToINR: 0.15 },
  { country: "South Africa", currency: "ZAR", symbol: "R", rateToINR: 4.75 },
  { country: "South Sudan", currency: "SSP", symbol: "£", rateToINR: 0.066 },
  { country: "Spain", currency: "EUR", symbol: "€", rateToINR: 92.40 },
  { country: "Sri Lanka", currency: "LKR", symbol: "Rs", rateToINR: 0.29 },
  { country: "Sudan", currency: "SDG", symbol: "SD", rateToINR: 0.14 },
  { country: "Suriname", currency: "SRD", symbol: "$", rateToINR: 2.30 },
  { country: "Sweden", currency: "SEK", symbol: "kr", rateToINR: 8.10 },
  { country: "Switzerland", currency: "CHF", symbol: "CHF", rateToINR: 98.20 },
  { country: "Syria", currency: "SYP", symbol: "£", rateToINR: 0.034 },
  { country: "Taiwan", currency: "TWD", symbol: "NT$", rateToINR: 2.65 },
  { country: "Tajikistan", currency: "TJS", symbol: "SM", rateToINR: 7.90 },
  { country: "Tanzania", currency: "TZS", symbol: "TSh", rateToINR: 0.033 },
  { country: "Thailand", currency: "THB", symbol: "฿", rateToINR: 2.50 },
  { country: "Timor-Leste", currency: "USD", symbol: "$", rateToINR: 86.50 },
  { country: "Togo", currency: "XOF", symbol: "CFA", rateToINR: 0.14 },
  { country: "Tonga", currency: "TOP", symbol: "T$", rateToINR: 36.50 },
  { country: "Trinidad and Tobago", currency: "TTD", symbol: "TT$", rateToINR: 12.70 },
  { country: "Tunisia", currency: "TND", symbol: "د.ت", rateToINR: 27.50 },
  { country: "Turkey", currency: "TRY", symbol: "₺", rateToINR: 2.50 },
  { country: "Turkmenistan", currency: "TMT", symbol: "m", rateToINR: 24.70 },
  { country: "Tuvalu", currency: "AUD", symbol: "A$", rateToINR: 55.60 },
  { country: "Uganda", currency: "UGX", symbol: "USh", rateToINR: 0.023 },
  { country: "Ukraine", currency: "UAH", symbol: "₴", rateToINR: 2.10 },
  { country: "Uruguay", currency: "UYU", symbol: "$U", rateToINR: 2.15 },
  { country: "Uzbekistan", currency: "UZS", symbol: "so'm", rateToINR: 0.0068 },
  { country: "Vanuatu", currency: "VUV", symbol: "VT", rateToINR: 0.72 },
  { country: "Vatican City", currency: "EUR", symbol: "€", rateToINR: 92.40 },
  { country: "Venezuela", currency: "VES", symbol: "Bs.", rateToINR: 2.35 },
  { country: "Vietnam", currency: "VND", symbol: "₫", rateToINR: 0.0034 },
  { country: "Yemen", currency: "YER", symbol: "﷼", rateToINR: 0.35 },
  { country: "Zambia", currency: "ZMW", symbol: "ZK", rateToINR: 3.20 },
  { country: "Zimbabwe", currency: "ZWL", symbol: "Z$", rateToINR: 0.27 }
];

const TABS = ['Overview', 'Transactions', 'To collect', 'Reports', 'Bank Accounts', 'Business setup'];
const ICONS = { 'Overview': '📊', 'Transactions': '📜', 'To collect': '📥', 'Reports': '📈', 'Bank Accounts': '🏦', 'Business setup': '⚙️' };

const screenCls = 'min-h-screen bg-[#120f0c] flex items-center justify-center p-4';
const inputCls = 'w-full border border-amber-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white';
const labelCls = 'block text-xs font-bold text-slate-700 uppercase mb-1';
const primaryBtn = 'w-full py-3.5 bg-amber-800 hover:bg-amber-900 text-white font-bold text-sm rounded-xl shadow-md transition cursor-pointer';
const emptyTx = { text: '', amount: '', type: 'income', category: 'General', paymentMode: 'Cash', bankAccount: 'Main Cash Drawer', country: 'India', currency: 'INR', symbol: '₹' };

const AnimStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600;700&display=swap');
    .signature-font { font-family: 'Dancing Script', cursive; }
    @keyframes av-rise{from{opacity:0;transform:translateY(24px) scale(.8)}to{opacity:1;transform:none}}
    @keyframes av-shine{0%{background-position:0% 50%}100%{background-position:200% 50%}}
    @keyframes av-flame{0%,100%{transform:scale(1) rotate(-3deg);filter:drop-shadow(0 0 6px #f59e0b)}50%{transform:scale(1.12) rotate(3deg);filter:drop-shadow(0 0 16px #fbbf24)}}
    @keyframes av-glow{0%,100%{box-shadow:0 0 25px 4px rgba(245,158,11,.35)}50%{box-shadow:0 0 55px 14px rgba(245,158,11,.6)}}
    @keyframes av-spin{to{transform:rotate(360deg)}}
    @keyframes av-fade{from{opacity:0}to{opacity:1}}
    @keyframes av-pop{from{opacity:0;transform:scale(.7) rotate(-6deg)}to{opacity:1;transform:none}}
    .av-letter{display:inline-block;background:linear-gradient(90deg,#b45309,#fbbf24,#fff7d6,#fbbf24,#b45309);background-size:200% 100%;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:av-rise .7s ease-out both,av-shine 3s linear infinite}
    .av-title{background:linear-gradient(90deg,#78350f,#d97706,#78350f);background-size:200% 100%;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:av-shine 4s linear infinite}
    .av-flame{display:inline-block;animation:av-flame 1.6s ease-in-out infinite}
    .av-glow{animation:av-glow 2.4s ease-in-out infinite}
    .av-ring{animation:av-spin 12s linear infinite}
    .av-fade{animation:av-fade 1.5s ease-out 1.2s both}
    .av-pop{animation:av-pop .6s ease-out both}
  `}</style>
);

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
  const [dues, setDues] = useState([]);
  const [dueForm, setDueForm] = useState({ party: '', amount: '', dueDate: '' });
  const [biz, setBiz] = useState({ name: '', owner: '', gstin: '', phone: '', address: '' });
  const [bizSaved, setBizSaved] = useState(false);

  const [bankAccounts, setBankAccounts] = useState([
    { id: 1, name: 'Main Cash Drawer', type: 'Cash', accountNo: 'Cash' }
  ]);
  const [bankForm, setBankForm] = useState({ name: '', type: 'Bank', accountNo: '' });
  const [isListening, setIsListening] = useState(false);
  const [detectedSms, setDetectedSms] = useState('');

  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.error("Audio playback failed:", err);
        alert("Please place your audio file in public folder or check audio source.");
      });
    }
  };

  const saveDues = (list) => { setDues(list); localStorage.setItem('arthved_dues', JSON.stringify(list)); };
  
  const addDue = (e) => {
    e.preventDefault();
    if (!dueForm.party || !dueForm.amount) return;
    saveDues([{ id: Date.now(), party: dueForm.party, amount: parseFloat(dueForm.amount), dueDate: dueForm.dueDate }, ...dues]);
    setDueForm({ party: '', amount: '', dueDate: '' });
  };

  const receiveDue = (due) => {
    const newTx = { id: Date.now(), text: `Received from ${due.party}`, amount: due.amount, type: 'income', category: 'Udhaar Wapasi', paymentMode: 'Cash', bankAccount: 'Main Cash Drawer', currency: 'INR', symbol: '₹', date: new Date().toLocaleDateString() };
    const updated = [newTx, ...transactions];
    setTransactions(updated);
    localStorage.setItem('arthved_tx', JSON.stringify(updated));
    saveDues(dues.filter((d) => d.id !== due.id));
  };

  const deleteDue = (id) => saveDues(dues.filter((d) => d.id !== id));

  const saveBiz = (e) => {
    e.preventDefault();
    localStorage.setItem('arthved_biz', JSON.stringify(biz));
    setBizSaved(true);
    setTimeout(() => setBizSaved(false), 2500);
  };

  const handleAddBank = (e) => {
    e.preventDefault();
    if (!bankForm.name) return;
    const updatedBanks = [...bankAccounts, { id: Date.now(), ...bankForm }];
    setBankAccounts(updatedBanks);
    localStorage.setItem('arthved_banks', JSON.stringify(updatedBanks));
    setBankForm({ name: '', type: 'Bank', accountNo: '' });
  };

  const deleteBank = (id) => {
    const updatedBanks = bankAccounts.filter(b => b.id !== id);
    setBankAccounts(updatedBanks);
    localStorage.setItem('arthved_banks', JSON.stringify(updatedBanks));
  };

  const startVoiceRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in this browser. Please use Chrome.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'hi-IN';
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const numberMatch = transcript.match(/\d+/);
      const amount = numberMatch ? numberMatch[0] : '';
      const text = transcript.replace(/\d+/g, '').trim();
      const isExpense = transcript.toLowerCase().includes('kharcha') || transcript.toLowerCase().includes('paid') || transcript.toLowerCase().includes('diya');
      
      setTxData(prev => ({
        ...prev,
        text: text || prev.text,
        amount: amount || prev.amount,
        type: isExpense ? 'expense' : 'income'
      }));
    };
    recognition.start();
  };

  const checkClipboardForSMS = async () => {
    try {
      if (!navigator.clipboard || !navigator.clipboard.readText) {
        alert("Clipboard access not available.");
        return;
      }
      const text = await navigator.clipboard.readText();
      if (!text) {
        alert("Clipboard is empty.");
        return;
      }
      const numMatch = text.match(/(?:Rs\.?|INR|₹)\s*(\d+)/i) || text.match(/\b\d+\b/);
      const amount = numMatch ? (numMatch[1] || numMatch[0]) : '';
      const isExpense = text.toLowerCase().includes('debited') || text.toLowerCase().includes('paid') || text.toLowerCase().includes('sent');
      
      setDetectedSms(text);
      setTxData(prev => ({
        ...prev,
        text: text.slice(0, 40) + '...',
        amount: amount,
        type: isExpense ? 'expense' : 'income',
        paymentMode: 'Online'
      }));
    } catch (err) {
      console.error("Clipboard read failed", err);
      alert("Please allow clipboard permission to read SMS.");
    }
  };

  const downloadCSV = () => {
    const rows = [['Date', 'Description', 'Category', 'Payment Mode', 'Bank Account', 'Country', 'Currency', 'Type', 'Amount'], ...transactions.map((t) => [t.date, t.text, t.category, t.paymentMode, t.bankAccount || 'Main Cash Drawer', t.country || 'India', t.currency || 'INR', t.type, t.amount])];
    const csv = rows.map((r) => r.map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = 'arthved-report.csv';
    a.click();
  };

  const totalDue = dues.reduce((a, d) => a + d.amount, 0);
  const byCategory = Object.entries(transactions.filter((t) => t.type === 'expense').reduce((m, t) => { const k = t.category || 'General'; m[k] = (m[k] || 0) + t.amount; return m; }, {})).sort((a, b) => b[1] - a[1]);
  const byMode = Object.entries(transactions.reduce((m, t) => { const k = t.paymentMode || 'Cash'; m[k] = (m[k] || 0) + t.amount; return m; }, {}));

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const savedTx = localStorage.getItem('arthved_tx');
        if (savedTx) setTransactions(JSON.parse(savedTx));
      } catch (err) {
        console.error('Could not read saved transactions', err);
      }
      try {
        const savedDues = localStorage.getItem('arthved_dues');
        if (savedDues) setDues(JSON.parse(savedDues));
        const savedBiz = localStorage.getItem('arthved_biz');
        if (savedBiz) setBiz(JSON.parse(savedBiz));
        const savedBanks = localStorage.getItem('arthved_banks');
        if (savedBanks) setBankAccounts(JSON.parse(savedBanks));
      } catch (err) {
        console.error('Could not read saved data', err);
      }
      setStep(localStorage.getItem('arthved_user') ? 'login' : 'welcome');
    }, 2600);
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

  const handleLock = () => {
    setStep('login');
    setEnteredPin('');
    setPinError(false);
  };

  const handleResetVault = () => {
    localStorage.removeItem('arthved_user');
    localStorage.removeItem('arthved_tx');
    localStorage.removeItem('arthved_dues');
    localStorage.removeItem('arthved_biz');
    localStorage.removeItem('arthved_banks');
    setTransactions([]);
    setDues([]);
    setBiz({ name: '', owner: '', gstin: '', phone: '', address: '' });
    setStep('welcome');
  };

  const handleAddTransaction = (e) => {
    e.preventDefault();
    if (!txData.text || !txData.amount) return;
    const amountVal = parseFloat(txData.amount);
    
    const countryObj = GLOBAL_COUNTRIES.find(c => c.country === (txData.country || 'India')) || GLOBAL_COUNTRIES[0];

    const newTx = {
      id: Date.now(),
      ...txData,
      amount: amountVal,
      country: countryObj.country,
      currency: countryObj.currency,
      symbol: countryObj.symbol,
      date: new Date().toLocaleDateString()
    };
    const updated = [newTx, ...transactions];
    setTransactions(updated);
    localStorage.setItem('arthved_tx', JSON.stringify(updated));

    if (txData.paymentMode === 'Credit Sales') {
      const newDue = {
        id: Date.now() + 1,
        party: txData.text,
        amount: amountVal,
        dueDate: ''
      };
      saveDues([newDue, ...dues]);
    }

    setIsModalOpen(false);
    setTxData(emptyTx);
    setDetectedSms('');
  };

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((a, c) => a + c.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((a, c) => a + c.amount, 0);
  const netBalance = totalIncome - totalExpense;

  if (step === 'loading') {
    return (
      <div className="min-h-screen bg-[#120f0c] flex flex-col items-center justify-center font-sans text-amber-100 overflow-hidden relative">
        <AnimStyles />
        <audio ref={audioRef} src="/music.mp3" loop />
        <div className="relative mb-8">
          <div className="av-ring absolute -inset-6 rounded-full border-2 border-dashed border-amber-500/40"></div>
          <div className="av-glow w-28 h-28 bg-gradient-to-tr from-amber-600 to-amber-400 rounded-full flex items-center justify-center text-5xl border border-amber-300/40">
            <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="48" fill="#120f0c" stroke="#f59e0b" strokeWidth="4"/>
              <path d="M50 8V18M50 82V92M8 50H18M82 50H92M20 20L27 27M73 73L80 80M20 80L27 73M73 27L80 20" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round"/>
              <circle cx="50" cy="50" r="24" fill="#f59e0b"/>
              <path d="M26 50C34 38 42 34 50 34C58 34 66 38 74 50C66 62 58 66 50 66C42 66 34 62 26 50Z" fill="#120f0c" stroke="#fbbf24" strokeWidth="3"/>
              <circle cx="50" cy="50" r="9" fill="#fbbf24"/>
              <circle cx="52" cy="48" r="3" fill="#120f0c"/>
            </svg>
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-black flex gap-1 md:gap-2">
          {'ARTHVED'.split('').map((ch, i) => (
            <span key={i} className="av-letter" style={{ animationDelay: `${i * 0.12}s, 0s` }}>{ch}</span>
          ))}
        </h1>
        <p className="av-fade text-xs text-amber-200/60 mt-3 font-medium tracking-wider uppercase">Financial Science & Vision • Ayodhya Edition</p>
        <div className="absolute bottom-6 text-amber-300/80 text-sm signature-font tracking-wide">
          Crafted by Chinmoy Suryakant Band
        </div>
      </div>
    );
  }

  if (step === 'welcome') {
    return (
      <div className={screenCls + " relative"}>
        <audio ref={audioRef} src="/music.mp3" loop />
        <div className="bg-white/95 backdrop-blur-md p-8 rounded-3xl shadow-2xl max-w-md w-full border border-amber-300/40 text-center">
          <div className="w-16 h-16 bg-amber-100 text-amber-800 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
            <svg width="36" height="36" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="48" fill="#120f0c" stroke="#f59e0b" strokeWidth="4"/>
              <path d="M50 10V20M50 80V90M10 50H20M80 50H90" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round"/>
              <circle cx="50" cy="50" r="22" fill="#f59e0b"/>
              <path d="M28 50C36 40 43 36 50 36C57 36 64 40 72 50C64 60 57 64 50 64C43 64 36 60 28 50Z" fill="#120f0c" stroke="#fbbf24" strokeWidth="2.5"/>
              <circle cx="50" cy="50" r="8" fill="#fbbf24"/>
            </svg>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-1">Welcome to ArthVed</h2>
          <p className="text-xs text-slate-500 mb-6">Surya ki urja, Nayan ki drishti — har hisab ekdam saaf.</p>
          <div className="space-y-3">
            <button onClick={() => setStep('register')} className={primaryBtn}>✨ New User (Register Vault)</button>
            <button onClick={() => setStep('login')} className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm rounded-xl transition cursor-pointer">🔑 Old User (Unlock Vault)</button>
          </div>
          <div className="mt-6 pt-4 border-t border-amber-100 text-amber-900/60 text-sm signature-font">
            Chinmoy Suryakant Band
          </div>
        </div>
      </div>
    );
  }

  if (step === 'register') {
    return (
      <div className={screenCls + " relative"}>
        <audio ref={audioRef} src="/music.mp3" loop />
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
          <div className="mt-6 text-center text-amber-900/60 text-sm signature-font">
            Chinmoy Suryakant Band
          </div>
        </div>
      </div>
    );
  }

  if (step === 'login') {
    return (
      <div className={screenCls + " relative"}>
        <audio ref={audioRef} src="/music.mp3" loop />
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
          <div className="mt-6 text-amber-900/60 text-sm signature-font">
            Chinmoy Suryakant Band
          </div>
        </div>
      </div>
    );
  }

  const slide = ramayanaSlides[currentSlide];

  const txTable = (
    <div className="bg-white rounded-2xl border border-amber-200 shadow-sm p-6 mb-12">
      <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
        <h2 className="text-xl font-bold text-amber-900 flex items-center gap-2"><span>📜</span> Karma Lekha (Transactions)</h2>
        <span className="text-xs bg-amber-100 text-amber-800 px-3 py-1 rounded-lg font-bold">
          Multi-Currency Secured Ledger 🌐
        </span>
      </div>
      {transactions.length === 0 ? (
        <p className="text-sm text-slate-500 py-8 text-center">Abhi tak koi bhi len-den darj nahi kiya gaya hai.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-amber-100 text-xs text-amber-900 uppercase">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Vivaran (Description)</th>
                <th className="py-3 px-4">Country / Currency</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Payment Mode</th>
                <th className="py-3 px-4">Account Tag</th>
                <th className="py-3 px-4">Rashi (Amount)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-50 text-sm">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-amber-50/50">
                  <td className="py-3 px-4 text-slate-500">{tx.date}</td>
                  <td className="py-3 px-4 font-semibold text-slate-800">{tx.text}</td>
                  <td className="py-3 px-4">
                    <span className="bg-slate-100 text-slate-700 text-xs px-2 py-1 rounded font-bold">
                      {tx.country || 'India'} ({tx.currency || 'INR'})
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{tx.category || 'General'}</td>
                  <td className="py-3 px-4"><span className="bg-amber-100 text-amber-900 text-xs px-2 py-1 rounded-md font-bold">{tx.paymentMode || 'Cash'}</span></td>
                  <td className="py-3 px-4"><span className="bg-slate-100 text-slate-800 text-xs px-2 py-1 rounded-md font-medium">🏦 {tx.bankAccount || 'Main Cash Drawer'}</span></td>
                  <td className={`py-3 px-4 font-bold ${tx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {tx.type === 'income' ? '+' : '-'} {tx.symbol || '₹'} {Math.abs(tx.amount).toLocaleString()}
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
      <AnimStyles />
      <audio ref={audioRef} src="/music.mp3" loop />
      
      <aside className="w-64 bg-white border-r border-amber-200 hidden md:flex flex-col justify-between p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-amber-100">
            <svg width="38" height="38" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]">
              <circle cx="50" cy="50" r="48" fill="#120f0c" stroke="#f59e0b" strokeWidth="3.5"/>
              <path d="M50 10V20M50 80V90M10 50H20M80 50H90M22 22L29 29M71 71L78 78M22 78L29 71M71 29L78 22" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round"/>
              <circle cx="50" cy="50" r="24" fill="#f59e0b"/>
              <path d="M26 50C34 38 42 34 50 34C58 34 66 38 74 50C66 62 58 66 50 66C42 66 34 62 26 50Z" fill="#120f0c" stroke="#fbbf24" strokeWidth="2.5"/>
              <circle cx="50" cy="50" r="9" fill="#fbbf24"/>
              <circle cx="52" cy="48" r="3" fill="#120f0c"/>
            </svg>
            <div>
              <h1 className="av-title font-black text-lg leading-tight">ArthVed</h1>
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

        {/* Music Widget & Live Exchange Rate Ticker */}
        <div className="pt-4 border-t border-amber-100 space-y-3">
          
          <div className="bg-amber-900 text-amber-100 p-2.5 rounded-xl text-[10px] shadow-inner space-y-1 border border-amber-700">
            <div className="flex items-center justify-between font-bold text-amber-300">
              <span>🌐 Live FX Ticker (vs INR)</span>
              <span className="animate-pulse">● Live</span>
            </div>
            <div className="flex justify-between text-slate-200">
              <span>1 USD = ₹86.50</span>
              <span>1 QAR = ₹22.80</span>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200/60 p-3 rounded-2xl text-center shadow-inner">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-amber-900 uppercase">🎵 Divine Dhun</span>
              <button 
                onClick={toggleMusic}
                className="bg-amber-800 hover:bg-amber-900 text-white text-xs px-3 py-1 rounded-lg font-bold shadow transition cursor-pointer"
              >
                {isPlaying ? '⏸ Pause' : '▶ Play'}
              </button>
            </div>
            <p className="text-[10px] text-slate-600 font-medium leading-tight">
              Music by <span className="font-bold text-amber-900">Kalpesh Ajugia</span> from <span className="font-bold text-amber-900">Pixabay</span>[cite: 5]
            </p>
          </div>

          <div className="text-center text-amber-900/70 text-sm signature-font">
            Chinmoy Suryakant Band
          </div>

          <button onClick={handleLock} className="w-full py-2 px-4 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer">
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
            <button onClick={handleLock} className="md:hidden bg-slate-100 text-slate-700 px-3 py-2.5 rounded-xl font-bold text-sm cursor-pointer">🔒</button>
          </div>
        </header>

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

        {activeTab === 'Overview' && (
          <div className="relative w-full rounded-3xl overflow-hidden shadow-xl border border-amber-300 mb-8 bg-slate-900 text-white min-h-[320px] flex items-center">
            <div key={"bg"+currentSlide} className="av-pop absolute inset-y-0 right-0 pr-8 flex items-center text-[13rem] opacity-10 select-none pointer-events-none">{slide.symbol}</div>
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent"></div>
            <div className="relative z-10 p-6 md:p-10 flex flex-col md:flex-row items-center gap-6 w-full">
              <div key={currentSlide} className="av-pop w-28 h-28 md:w-36 md:h-36 rounded-2xl border-2 border-amber-400/80 shadow-2xl flex-shrink-0 bg-gradient-to-br from-amber-800 to-amber-950 flex items-center justify-center text-6xl md:text-7xl">{slide.symbol}</div>
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
                <p className="text-[10px] text-slate-400 mt-1">*Multi-currency native records secured</p>
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

        {activeTab === 'To collect' && (
          <div className="space-y-6 mb-12">
            <div className="bg-white p-6 rounded-2xl border border-amber-200 shadow-sm">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Baaki (To Collect)</p>
              <h3 className="text-2xl font-black mt-2 text-amber-700">₹ {totalDue.toLocaleString()}</h3>
            </div>
            <form onSubmit={addDue} className="bg-white p-6 rounded-2xl border border-amber-200 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div><label className={labelCls}>Party Name</label><input type="text" required placeholder="Jaise: Sharma ji" value={dueForm.party} onChange={(e) => setDueForm({ ...dueForm, party: e.target.value })} className={inputCls} /></div>
              <div><label className={labelCls}>Rashi (₹)</label><input type="number" required min="0" step="0.01" placeholder="0.00" value={dueForm.amount} onChange={(e) => setDueForm({ ...dueForm, amount: e.target.value })} className={inputCls} /></div>
              <div><label className={labelCls}>Due Date</label><input type="date" value={dueForm.dueDate} onChange={(e) => setDueForm({ ...dueForm, dueDate: e.target.value })} className={inputCls} /></div>
              <button type="submit" className={primaryBtn}>➕ Add Baaki</button>
            </form>
            <div className="bg-white rounded-2xl border border-amber-200 shadow-sm p-6">
              <h2 className="text-xl font-bold text-amber-900 mb-4">📥 Wasooli List</h2>
              {dues.length === 0 ? (
                <p className="text-sm text-slate-500 py-8 text-center">Koi baaki nahi hai. Sab hisab saaf! 🎉</p>
              ) : (
                <div className="divide-y divide-amber-50">
                  {dues.map((d) => {
                    const overdue = d.dueDate && new Date(d.dueDate) < new Date();
                    return (
                      <div key={d.id} className="py-3 flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-800">{d.party}</p>
                          <p className={`text-xs ${overdue ? 'text-rose-600 font-bold' : 'text-slate-500'}`}>{d.dueDate ? `Due: ${d.dueDate}${overdue ? ' (late)' : ''}` : 'No due date'}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-amber-700">₹ {d.amount.toLocaleString()}</span>
                          <button onClick={() => receiveDue(d)} className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-2 rounded-lg cursor-pointer">✔ Mila</button>
                          <button onClick={() => { if (window.confirm('Delete this entry?')) deleteDue(d.id); }} className="text-slate-400 hover:text-rose-600 text-sm cursor-pointer">🗑️</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'Bank Accounts' && (
          <div className="space-y-6 mb-12 max-w-3xl">
            <div className="bg-white p-6 rounded-2xl border border-amber-200 shadow-sm">
              <h2 className="text-xl font-bold text-amber-900 mb-1">🏦 Bank & Online Accounts Management</h2>
              <p className="text-xs text-slate-500 mb-4">Add your personal bank accounts or UPI IDs here so you can tag your transactions accurately.</p>
              
              <form onSubmit={handleAddBank} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mb-6">
                <div><label className={labelCls}>Account Name</label><input type="text" required placeholder="Jaise: SBI Current, Paytm" value={bankForm.name} onChange={(e) => setBankForm({ ...bankForm, name: e.target.value })} className={inputCls} /></div>
                <div><label className={labelCls}>Account No / UPI ID</label><input type="text" placeholder="**** 1234 / UPI" value={bankForm.accountNo} onChange={(e) => setBankForm({ ...bankForm, accountNo: e.target.value })} className={inputCls} /></div>
                <button type="submit" className={primaryBtn}>➕ Add Account</button>
              </form>

              <div className="divide-y divide-amber-50">
                {bankAccounts.map((acc) => (
                  <div key={acc.id} className="py-3 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-800">{acc.name}</p>
                      <p className="text-xs text-slate-500">{acc.accountNo || 'Secure Vault Tag'}</p>
                    </div>
                    {bankAccounts.length > 1 && (
                      <button onClick={() => deleteBank(acc.id)} className="text-rose-500 text-xs font-bold hover:underline cursor-pointer">Remove</button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Reports' && (
          <div className="space-y-6 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[['Aagman (Income)', totalIncome, 'text-emerald-600'], ['Vyaya (Expense)', totalExpense, 'text-rose-600'], ['Net Balance', netBalance, netBalance >= 0 ? 'text-emerald-700' : 'text-rose-700'], ['Baaki (To Collect)', totalDue, 'text-amber-700']].map(([label, val, cls]) => (
                <div key={label} className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</p>
                  <h3 className={`text-xl font-black mt-2 ${cls}`}>₹ {val.toLocaleString()}</h3>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl border border-amber-200 shadow-sm p-6">
              <div className="flex flex-wrap justify-between items-center gap-3 mb-2">
                <h2 className="text-xl font-bold text-amber-900">📈 Bachat (Savings): {totalIncome > 0 ? Math.round((netBalance / totalIncome) * 100) : 0}% of income</h2>
                <button onClick={downloadCSV} disabled={transactions.length === 0} className="bg-amber-800 hover:bg-amber-900 disabled:opacity-40 text-white text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer">⬇ Download CSV (Excel)</button>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-amber-200 shadow-sm p-6">
              <h2 className="text-lg font-bold text-amber-900 mb-4">Kharcha by Category</h2>
              {byCategory.length === 0 ? <p className="text-sm text-slate-500 py-4 text-center">Abhi koi kharcha darj nahi hai.</p> : byCategory.map(([cat, amt]) => (
                <div key={cat} className="mb-3">
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1"><span>{cat}</span><span>₹ {amt.toLocaleString()} ({Math.round((amt / totalExpense) * 100)}%)</span></div>
                  <div className="h-2.5 bg-amber-100 rounded-full overflow-hidden"><div className="h-full bg-amber-600 rounded-full transition-all duration-700" style={{ width: `${(amt / totalExpense) * 100}%` }}></div></div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl border border-amber-200 shadow-sm p-6">
              <h2 className="text-lg font-bold text-amber-900 mb-4">Payment Mode</h2>
              {byMode.length === 0 ? <p className="text-sm text-slate-500 py-4 text-center">Abhi koi len-den nahi hai.</p> : (
                <div className="flex flex-wrap gap-3">
                  {byMode.map(([mode, amt]) => (
                    <div key={mode} className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                      <p className="text-xs font-bold text-amber-900 uppercase">{mode}</p>
                      <p className="font-black text-slate-800">₹ {amt.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'Business setup' && (
          <form onSubmit={saveBiz} className="bg-white rounded-2xl border border-amber-200 shadow-sm p-6 max-w-2xl space-y-4 mb-12">
            <h2 className="text-xl font-bold text-amber-900">⚙️ Vyapaar ki Jaankari</h2>
            <div><label className={labelCls}>Business Name</label><input type="text" placeholder="Jaise: Sharma General Store" value={biz.name} onChange={(e) => setBiz({ ...biz, name: e.target.value })} className={inputCls} /></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className={labelCls}>Owner Name</label><input type="text" value={biz.owner} onChange={(e) => setBiz({ ...biz, owner: e.target.value })} className={inputCls} /></div>
              <div><label className={labelCls}>Phone</label><input type="text" value={biz.phone} onChange={(e) => setBiz({ ...biz, phone: e.target.value })} className={inputCls} /></div>
            </div>
            <div><label className={labelCls}>GSTIN (optional)</label><input type="text" maxLength={15} placeholder="15-character GST number" value={biz.gstin} onChange={(e) => setBiz({ ...biz, gstin: e.target.value.toUpperCase() })} className={inputCls + ' tracking-widest'} /></div>
            <div><label className={labelCls}>Address</label><textarea rows={3} value={biz.address} onChange={(e) => setBiz({ ...biz, address: e.target.value })} className={inputCls}></textarea></div>
            <button type="submit" className={primaryBtn}>Surakshit Karein 💾</button>
            {bizSaved && <p className="text-sm text-emerald-600 font-bold text-center">✔ Saved on this device!</p>}
            
            <div className="pt-4 border-t border-amber-100 text-center text-amber-900/60 text-sm signature-font">
              Chinmoy Suryakant Band
            </div>
          </form>
        )}

        <footer className="mt-12 py-4 border-t border-amber-200/60 text-center text-amber-900/60 text-sm signature-font">
          ArthVed • Designed & Developed by Chinmoy Suryakant Band
        </footer>
      </main>

      {/* Smart Add Transaction Modal with Fixed Overlap & Independent Currency History */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-amber-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-amber-100">
              <h3 className="text-lg font-bold text-amber-900">Add Transaction</h3>
              <button type="button" onClick={() => { setIsModalOpen(false); setDetectedSms(''); }} className="text-slate-400 hover:text-rose-600 text-xl font-bold p-1 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-2xl flex flex-col justify-between">
                <p className="text-[11px] font-bold text-amber-900 mb-1">🎙️ Voice Ledger</p>
                <button 
                  type="button" 
                  onClick={startVoiceRecognition}
                  className={`w-full py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer shadow transition ${isListening ? 'bg-rose-600 text-white animate-pulse' : 'bg-amber-800 text-white hover:bg-amber-900'}`}
                >
                  {isListening ? 'Sun rahe hain...' : 'Bolie'}
                </button>
              </div>

              <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-2xl flex flex-col justify-between">
                <p className="text-[11px] font-bold text-amber-900 mb-1">📋 SMS Auto-Paste</p>
                <button 
                  type="button" 
                  onClick={checkClipboardForSMS}
                  className="w-full py-1.5 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer shadow transition"
                >
                  Detect SMS
                </button>
              </div>
            </div>

            {detectedSms && (
              <div className="mb-4 bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl text-[11px] text-emerald-900">
                <span className="font-bold">💡 SMS Detected & Auto-Filled:</span> {detectedSms}
              </div>
            )}

            <form onSubmit={handleAddTransaction} className="space-y-4">
              
              <div>
                <label className={labelCls}>Select Country (Auto-detects Currency)</label>
                <select 
                  value={txData.country || 'India'} 
                  onChange={(e) => {
                    const selectedC = GLOBAL_COUNTRIES.find(c => c.country === e.target.value);
                    setTxData({ 
                      ...txData, 
                      country: e.target.value, 
                      currency: selectedC ? selectedC.currency : 'INR',
                      symbol: selectedC ? selectedC.symbol : '₹'
                    });
                  }} 
                  className={inputCls}
                >
                  {GLOBAL_COUNTRIES.map((c) => (
                    <option key={c.country} value={c.country}>
                      {c.country} ({c.currency} - {c.symbol})
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-amber-700 mt-1 font-medium">
                  ℹ️ New entries will be securely saved in {txData.currency || 'INR'} ({txData.symbol || '₹'}). Past history remains intact.
                </p>
              </div>

              <div>
                <label className={labelCls}>Description</label>
                <input type="text" required placeholder="Jaise: Yajna Samagri, Seva daan..." value={txData.text} onChange={(e) => setTxData({ ...txData, text: e.target.value })} className={inputCls} />
              </div>
              
              <div>
                <label className={labelCls}>
                  Amount (in {txData.currency || 'INR'} [{txData.symbol || '₹'}])
                </label>
                <div className="relative">
                  {/* Fixed Overlap with pl-14 padding */}
                  <span className="absolute left-3 top-2.5 text-amber-800 font-extrabold text-sm select-none">
                    {txData.symbol || '₹'}
                  </span>
                  <input 
                    type="number" 
                    required 
                    min="0" 
                    step="0.01" 
                    placeholder="0.00" 
                    value={txData.amount} 
                    onChange={(e) => setTxData({ ...txData, amount: e.target.value })} 
                    className={inputCls + ' pl-14 font-bold text-slate-900'} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Type</label>
                  <select value={txData.type} onChange={(e) => setTxData({ ...txData, type: e.target.value })} className={inputCls}>
                    <option value="income">Income (Aagman)</option>
                    <option value="expense">Expense (Vyaya)</option>
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Bank / Account Tag</label>
                  <select value={txData.bankAccount} onChange={(e) => setTxData({ ...txData, bankAccount: e.target.value })} className={inputCls}>
                    {bankAccounts.map(b => (
                      <option key={b.id} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Category</label>
                  <input type="text" placeholder="Jaise: Samagri, Bhent..." value={txData.category} onChange={(e) => setTxData({ ...txData, category: e.target.value })} className={inputCls} />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-amber-100">
                <button type="button" onClick={() => { setIsModalOpen(false); setDetectedSms(''); }} className="px-4 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer">Cancel</button>
                <button type="submit" className="bg-amber-800 hover:bg-amber-900 text-amber-50 px-5 py-2.5 rounded-xl text-sm font-bold shadow-md transition-all cursor-pointer">Save Entry</button>
              </div>
            </form>
            <div className="mt-4 pt-3 border-t border-amber-100 text-center text-amber-900/60 text-xs signature-font">
              Chinmoy Suryakant Band
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
