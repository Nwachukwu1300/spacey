import React, { useState, useEffect } from 'react';
import Avatar from '../Avatar/Avatar';
import './Results.css';

const Results = ({ quizResults, badges, feedbackMessages, onContinue }) => {
  const [showBadge, setShowBadge] = useState(false);
  const [avatarSpeaking, setAvatarSpeaking] = useState(true);
  const [avatarAnimation, setAvatarAnimation] = useState('excited');
  const [avatarMessage, setAvatarMessage] = useState('');
  const [earnedBadges, setEarnedBadges] = useState([]);

  useEffect(() => {
    // Always add completion badge
    const badgesToAward = [badges.completion];
    
    // Add perfect score badge if applicable
    if (quizResults.isPerfect) {
      badgesToAward.push(badges.perfectScore);
    }
    
    setEarnedBadges(badgesToAward);
    
    // Set appropriate feedback message based on score
    let feedbackMessage = '';
    const percentage = quizResults.percentage;
    
    if (percentage === 100) {
      feedbackMessage = feedbackMessages.perfect;
      setAvatarAnimation('celebrating');
    } else if (percentage >= 80) {
      feedbackMessage = feedbackMessages.great;
      setAvatarAnimation('happy');
    } else if (percentage >= 60) {
      feedbackMessage = feedbackMessages.good;
      setAvatarAnimation('encouraging');
    } else {
      feedbackMessage = feedbackMessages.needsPractice;
      setAvatarAnimation('supportive');
    }
    
    setAvatarMessage(`${feedbackMessage} You got ${quizResults.score} out of ${quizResults.total} questions correct!`);
    
    // Animate badges appearing after avatar speaks
    const badgeTimer = setTimeout(() => {
      setShowBadge(true);
    }, 3000);
    
    return () => clearTimeout(badgeTimer);
  }, [quizResults, badges, feedbackMessages]);

  const handleAnimationComplete = () => {
    setAvatarSpeaking(false);
  };

  return (
    <div className="results-container">
      <div className="results-header">
        <h2>Mission Complete!</h2>
      </div>
      
      <div className="results-content">
        <div className="results-avatar-section">
          <Avatar 
            speaking={avatarSpeaking}
            currentAnimation={avatarAnimation}
            message={avatarMessage}
            onAnimationComplete={handleAnimationComplete}
          />
        </div>
        
        <div className="results-score-section">
          <div className="score-display">
            <div className="score-circle">
              <span className="score-percentage">{quizResults.percentage}%</span>
              <span className="score-label">Score</span>
            </div>
            <p className="score-text">You answered {quizResults.score} out of {quizResults.total} questions correctly!</p>
          </div>
          
          <div className={`badges-section ${showBadge ? 'show' : ''}`}>
            <h3>Badges Earned</h3>
            <div className="badges-container">
              {earnedBadges.map((badge, index) => (
                <div key={index} className="badge-item">
                  <div className="badge-image">
                    <img src={`/assets/badges/${badge.image}`} alt={badge.name} />
                  </div>
                  <div className="badge-info">
                    <h4>{badge.name}</h4>
                    <p>{badge.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="results-actions">
            <button 
              className="continue-button"
              onClick={onContinue}
            >
              Continue Your Space Journey
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;