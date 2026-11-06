import React, { useState, useEffect } from 'react';
import OnboardingFlow from './OnboardingFlow';
import DashboardUI from './DashboardUI';
import RecoveryModal from './RecoveryModal';

export default function HisabApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('hisab_user_session');
    const onboardingDone = localStorage.getItem('hisab_onboarding_done');

    if (onboardingDone === 'true') {
      setHasCompletedOnboarding(true);
    }
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const handleOnboardingComplete = (userData) => {
    localStorage.setItem('hisab_onboarding_done', 'true');
    localStorage.setItem('hisab_user_session', JSON.stringify(userData));
    setCurrentUser(userData);
    setHasCompletedOnboarding(true);
    setIsAuthenticated(true);
  };

  const handleLockApp = () => {
    setIsAuthenticated(false);
  };

  return (
    <div className="min-h-screen bg-[#fefcf6] text-slate-800 font-sans">
      {!hasCompletedOnboarding ? (
        <OnboardingFlow onComplete={handleOnboardingComplete} />
      ) : !isAuthenticated ? (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-amber-100 text-center">
            <h2 className="text-2xl font-bold text-amber-700 mb-2">Hisab Locked</h2>
            <p className="text-sm text-slate-500 mb-6">Enter your PIN or Password to unlock your secure data.</p>
            
            <input 
              type="password" 
              placeholder="Enter 4-digit PIN or Password" 
              className="w-full px-4 py-3 border border-slate-200 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-amber-500 text-center tracking-widest text-lg"
              onKeyDown={(e) => {
                if (e.key === 'Enter') setIsAuthenticated(true);
              }}
            />
            
            <button 
              onClick={() => setIsAuthenticated(true)}
              className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl transition shadow-md"
            >
              Unlock Dashboard
            </button>

            <button 
              onClick={() => setShowRecovery(true)}
              className="mt-4 text-xs text-amber-600 hover:underline block mx-auto font-medium"
            >
              Forgot Password / Recover via WhatsApp?
            </button>
          </div>
        </div>
      ) : (
        <DashboardUI onLock={handleLockApp} user={currentUser} />
      )}

      {showRecovery && (
        <RecoveryModal onClose={() => setShowRecovery(false)} />
      )}
    </div>
  );
}