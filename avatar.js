import React, { useState, useEffect, useRef } from 'react';
import './Avatar.css';

// Animations map for different avatar states
const ANIMATIONS = {
  IDLE: 'idle',
  TALKING: 'talking',
  THINKING: 'thinking',
  EXCITED: 'excited',
  EXPLAINING: 'explaining',
};

const Avatar = ({ 
  speaking = false, 
  currentAnimation = ANIMATIONS.IDLE,
  message = '',
  onAnimationComplete = () => {},
}) => {
  const [animation, setAnimation] = useState(currentAnimation);
  const [displayedMessage, setDisplayedMessage] = useState('');
  const [charIndex, setCharIndex] = useState(0);
  const avatarRef = useRef(null);

  // Handle typing effect for the avatar's message
  useEffect(() => {
    if (!message) return;
    
    if (charIndex < message.length) {
      const timer = setTimeout(() => {
        setDisplayedMessage(prev => prev + message[charIndex]);
        setCharIndex(charIndex + 1);
      }, 30); // Speed of typing
      
      return () => clearTimeout(timer);
    } else {
      onAnimationComplete();
    }
  }, [message, charIndex, onAnimationComplete]);

  // Reset typing when message changes
  useEffect(() => {
    setDisplayedMessage('');
    setCharIndex(0);
  }, [message]);

  // Change animation state based on speaking status
  useEffect(() => {
    setAnimation(speaking ? ANIMATIONS.TALKING : ANIMATIONS.IDLE);
  }, [speaking]);

  return (
    <div className="avatar-container">
      <div 
        className={`avatar ${animation}`} 
        ref={avatarRef}
        data-testid="avatar"
      >
        {/* This will be replaced with actual avatar animations */}
        <div className="avatar-placeholder">
          <div className="avatar-face">
            <div className="avatar-eyes"></div>
            <div className={`avatar-mouth ${speaking ? 'speaking' : ''}`}></div>
          </div>
        </div>
      </div>
      
      <div className="avatar-speech-bubble">
        <p>{displayedMessage}</p>
      </div>
    </div>
  );
};

export default Avatar;