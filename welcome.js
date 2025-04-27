import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import firebase from 'firebase/app';
import 'firebase/auth';
import { useUserContext } from '../contexts/UserContext';
import './Welcome.css';

const Welcome = () => {
  const navigate = useNavigate();
  const { createGuestAccount } = useUserContext();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle start as guest
  const handleStartAsGuest = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await createGuestAccount();
      navigate('/lesson');
    } catch (err) {
      setError('Failed to create guest account. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle sign in with Google
  const handleSignInWithGoogle = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      await firebase.auth().signInWithPopup(provider);
      navigate('/dashboard');
    } catch (err) {
      setError('Google sign-in failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <div className="welcome-header">
          <img 
            src="/assets/logo/spacey-logo.png" 
            alt="Spacey Logo" 
            className="spacey-logo"
          />
          <h1>Welcome to Spacey!</h1>
          <p className="welcome-subtitle">
            Explore the wonders of space through interactive lessons
          </p>
        </div>
        
        <div className="lesson-preview">
          <div className="lesson-card">
            <div className="lesson-card-image">
              <img 
                src="/assets/lesson-thumbnails/mars-rover.jpg" 
                alt="Mars Rover Mission" 
              />
            </div>
            <div className="lesson-card-content">
              <h2>Mars Rover Mission</h2>
              <p>
                Join our exciting mission to explore the Red Planet! Learn about 
                Mars rovers, their scientific instruments, and their incredible 
                discoveries.
              </p>
              <div className="lesson-info">
                <span className="lesson-duration">Duration: 5-7 minutes</span>
                <span className="lesson-age">Age: 7-12</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="welcome-actions">
          <button 
            className="start-button"
            onClick={handleStartAsGuest}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Start Mars Rover Mission!'}
          </button>
          
          <div className="sign-in-section">
            <p>Want to save your progress?</p>
            <button 
              className="google-sign-in"
              onClick={handleSignInWithGoogle}
              disabled={loading}
            >
              <img 
                src="/assets/icons/google-logo.png" 
                alt="Google" 
                className="google-icon"
              />
              Sign in with Google
            </button>
          </div>
          
          {error && <p className="error-message">{error}</p>}
        </div>
        
        <div className="welcome-footer">
          <p>
            Spacey helps children learn about space through interactive, 
            AI-powered lessons. Start exploring today!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;