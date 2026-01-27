import { useEffect, useState } from 'react';

const MOTIVATIONAL_MESSAGES = [
  "You're doing great! 🚀",
  "Keep going! 💪",
  "Almost there! ⭐",
  "You're crushing it! 🔥",
  "Excellent progress! 🌟",
  "You're a rockstar! 🎸"
];

function ProgressIndicator({ currentStep, totalSteps }) {
  const [message, setMessage] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);
  
  const progress = ((currentStep + 1) / totalSteps) * 100;

  useEffect(() => {
    if (currentStep < totalSteps - 1) {
      const randomMessage = MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)];
      setMessage(randomMessage);
      setShowCelebration(true);
      const timer = setTimeout(() => setShowCelebration(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [currentStep, totalSteps]);

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">
          Step {currentStep + 1} of {totalSteps}
        </span>
        <span className="text-sm font-semibold text-primary-600">
          {Math.round(progress)}% Complete
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-500 ease-out relative"
          style={{ width: `${progress}%` }}
        >
          {showCelebration && (
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 animate-pulse" />
          )}
        </div>
      </div>
      {message && showCelebration && (
        <p className="text-center mt-2 text-sm font-medium text-primary-600 animate-bounce">
          {message}
        </p>
      )}
    </div>
  );
}

export default ProgressIndicator;
