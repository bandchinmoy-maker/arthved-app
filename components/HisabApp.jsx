import React, { useState, useEffect } from 'react';
import OnboardingFlow from './OnboardingFlow';
import DashboardUI from './DashboardUI';
import RecoveryModal from './RecoveryModal';

export default function HisabApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('hisab_user_session');
    const onboardingDone = localStorage.getItem('hisab_onboarding_done');

    if (onboardingDone === 'true' && savedUser) {
      setHasCompletedOnboarding(true);
      setCurrentUser(JSON.parse(savedUser));
      setIsAuthenticated(false);
    }
  }, []);

  const handleOnboardingComplete = (userData) => {
    localStorage.setItem('hisab_onboarding_done', 'true');
    localStorage.setItem('hisab_user_session', JSON.stringify(userData));
    setCurrentUser(userData);
    setHasCompletedOnboarding(true);
    setIsAuthenticated(true);
  };

  const handleUnlock = () => {
    if (currentUser && currentUser.pin) {
      if (enteredPin === currentUser.pin) {
        setIsAuthenticated(true);
        setPinError(false);
      } else {
        setPinError(true);
      }
    } else {
      setIsAuthenticated(true);
    }
  };

  const handleLockApp = () => {
    setIsAuthenticated(false);
    setEnteredPin('');
  };

  const handleLogoutApp = () => {
    localStorage.removeItem('hisab_user_session');
    localStorage.removeItem('hisab_onboarding_done');
    setHasCompletedOnboarding(false);
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  return (
    <div className="min-h-screen bg-[#fefcf6] text-slate-800 font-sans">
      {!hasCompletedOnboarding ? (
        <OnboardingFlow onComplete={handleOnboardingComplete} />
      ) : !isAuthenticated ? (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-amber-100 text-center">
            <h2 className="text-2xl font-bold text-amber-700 mb-2">Arthved Vault Locked</h2>
            <p className="text-sm text-slate-500 mb-6">Enter your 4-digit PIN or Password to unlock your secure ledger.</p>
            
            <input 
              type="password" 
              value={enteredPin}
              onChange={(e) => setEnteredPin(e.target.value)}
              placeholder="Enter PIN" 
              className={`w-full px-4 py-3 border rounded-xl mb-2 focus:outline-none text-center tracking-widest text-lg ${
                pinError ? 'border-red-500' : 'border-slate-200'
              }`}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleUnlock();
              }}
            />
            {pinError && (
              <p className="text-xs text-red-500 mb-4 font-medium">Wrong PIN! Please try again.</p>
            )}
            
            <button 
              onClick={handleUnlock}
              className="w-full py-3 bg-amber-800 hover:bg-amber-900 text-white font-semibold rounded-xl transition shadow-md mt-2 cursor-pointer"
            >
              Unlock Dashboard 🔓
            </button>

            <button 
              onClick={() => setShowRecovery(true)}
              className="mt-4 text-xs text-amber-700 hover:underline block mx-auto font-medium cursor-pointer"
            >
              Forgot PIN? Recover via WhatsApp or Email 📱
            </button>
          </div>
        </div>
      ) : (
        <DashboardUI onLock={handleLockApp} onLogout={handleLogoutApp} user={currentUser} />
      )}

      {showRecovery && (
        <RecoveryModal onClose={() => setShowRecovery(false)} />
      )}
    </div>
  );
}
