import React from 'react';
import { useNavigate } from 'react-router-dom';
import firebase from 'firebase/app';
import 'firebase/auth';
import { useUserContext } from '../contexts/UserContext';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentUser, userProgress, earnedBadges } = useUserContext();
  
  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle starting a lesson
  const handleStartLesson = (lessonId) => {
    navigate(`/lesson`);
  };

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await firebase.auth().signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Check if Mars Rover lesson is completed
  const marsRoverCompleted = userProgress['mars-rover-mission']?.completed || false;
  const marsRoverScore = userProgress['mars-rover-mission']?.score || 0;
  const marsRoverCompletionDate = userProgress['mars-rover-mission']?.date || null;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <img 
          src="/assets/logo/spacey-logo.png" 
          alt="Spacey Logo" 
          className="spacey-logo-small"
        />
        <h1>Space Explorer Dashboard</h1>
        <div className="user-info">
          <span className="user-name">
            {currentUser?.displayName || 'Space Explorer'}
          </span>
          <button className="sign-out-button" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-section">
          <h2>Your Space Journey</h2>
          
          <div className="lessons-grid">
            {/* Mars Rover Mission Card */}
            <div className={`lesson-card ${marsRoverCompleted ? 'completed' : ''}`}>
              <div className="lesson-card-image">
                <img 
                  src="/assets/lesson-thumbnails/mars-rover.jpg" 
                  alt="Mars Rover Mission" 
                />
                {marsRoverCompleted && (
                  <div className="completion-badge">
                    <span className="score">{marsRoverScore}%</span>
                  </div>
                )}
              </div>
              <div className="lesson-card-content">
                <h3>Mars Rover Mission</h3>
                <p>Learn about Mars rovers and their exciting discoveries on the Red Planet.</p>
                
                {marsRoverCompleted ? (
                  <div className="completion-info">
                    <span className="completion-date">
                      Completed on {formatDate(marsRoverCompletionDate)}
                    </span>
                    <button 
                      className="replay-button"
                      onClick={() => handleStartLesson('mars-rover-mission')}
                    >
                      Replay Lesson
                    </button>
                  </div>
                ) : (
                  <button 
                    className="start-button"
                    onClick={() => handleStartLesson('mars-rover-mission')}
                  >
                    Start Lesson
                  </button>
                )}
              </div>
            </div>
            
            {/* Coming Soon Lessons */}
            {['build-satellite', 'spaghettification', 'zero-gravity', 'space-exploration'].map((id, index) => (
              <div key={id} className="lesson-card coming-soon">
                <div className="lesson-card-image">
                  <img 
                    src={`/assets/lesson-thumbnails/coming-soon-${(index % 2) + 1}.jpg`}
                    alt="Coming Soon" 
                  />
                  <div className="coming-soon-label">Coming Soon</div>
                </div>
                <div className="lesson-card-content">
                  <h3>
                    {id === 'build-satellite' && 'Build Your Own Satellite'}
                    {id === 'spaghettification' && 'Spaghettification'}
                    {id === 'zero-gravity' && 'Zero Gravity'}
                    {id === 'space-exploration' && "What's New in Space Exploration"}
                  </h3>
                  <p>This exciting space adventure is coming soon!</p>
                  <button className="coming-soon-button" disabled>
                    Coming Soon
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Your Space Badges</h2>
          
          <div className="badges-grid">
            {earnedBadges.length > 0 ? (
              earnedBadges.map((badge, index) => (
                <div key={index} className="badge-card">
                  <div className="badge-image">
                    <img 
                      src={`/assets/badges/${badge.image}`} 
                      alt={badge.name} 
                    />
                  </div>
                  <div className="badge-content">
                    <h3>{badge.name}</h3>
                    <p>{badge.description}</p>
                    <span className="badge-date">
                      Earned on {formatDate(badge.earnedDate)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-badges">
                <p>Complete lessons to earn special space badges!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;