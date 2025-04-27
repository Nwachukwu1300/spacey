import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '../components/Avatar/Avatar';
import Webcam from '../components/Webcam/Webcam';
import Quiz from '../components/Quiz/Quiz';
import Results from '../components/Results/Results';
import lessonScript from '../data/lessonScript';
import { useUserContext } from '../contexts/UserContext';
import './Lesson.css';

// Lesson stages
const LESSON_STAGES = {
  INTRODUCTION: 'introduction',
  CONTENT: 'content',
  QUIZ: 'quiz',
  RESULTS: 'results',
};

const Lesson = () => {
  const navigate = useNavigate();
  const { updateUserProgress, saveEarnedBadge } = useUserContext();
  
  const [currentStage, setCurrentStage] = useState(LESSON_STAGES.INTRODUCTION);
  const [contentIndex, setContentIndex] = useState(0);
  const [sectionIndex, setSectionIndex] = useState(0);
  const [webcamActive, setWebcamActive] = useState(false);
  const [avatarSpeaking, setAvatarSpeaking] = useState(true);
  const [avatarAnimation, setAvatarAnimation] = useState('greeting');
  const [avatarMessage, setAvatarMessage] = useState('');
  const [quizResults, setQuizResults] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState('intro-bg.jpg');
  const [currentVisual, setCurrentVisual] = useState(null);
  
  const lessonContentRef = useRef(null);

  // Handle the introduction stage
  useEffect(() => {
    if (currentStage === LESSON_STAGES.INTRODUCTION) {
      const introContent = lessonScript.introduction.content;
      
      if (contentIndex < introContent.length) {
        const content = introContent[contentIndex];
        setAvatarMessage(content.text);
        setAvatarAnimation(content.animation || 'talking');
        setAvatarSpeaking(true);
        
        // Wait for webcam if needed
        if (content.waitForWebcam && !webcamActive) {
          // Don't advance until webcam is active
        } else if (content.transition) {
          // Handle transition effect
          setTimeout(() => {
            setBackgroundImage('mars-surface.jpg');
            advanceContent();
          }, 2000);
        }
      } else {
        // Move to main content when introduction is complete
        setCurrentStage(LESSON_STAGES.CONTENT);
        setSectionIndex(0);
        setContentIndex(0);
        setBackgroundImage('mars-surface.jpg');
      }
    }
  }, [currentStage, contentIndex, webcamActive]);

  // Handle the main content stage
  useEffect(() => {
    if (currentStage === LESSON_STAGES.CONTENT) {
      const sections = lessonScript.mainContent;
      
      if (sectionIndex < sections.length) {
        const currentSection = sections[sectionIndex];
        
        if (contentIndex < currentSection.content.length) {
          const content = currentSection.content[contentIndex];
          setAvatarMessage(content.text);
          setAvatarAnimation(content.animation || 'explaining');
          setAvatarSpeaking(true);
          
          // Set visual aid if available
          if (content.visual) {
            setCurrentVisual(content.visual);
          } else {
            setCurrentVisual(null);
          }
        } else {
          // Move to next section when current section is complete
          if (sectionIndex < sections.length - 1) {
            setSectionIndex(sectionIndex + 1);
            setContentIndex(0);
          } else {
            // All sections complete, show conclusion
            const conclusionContent = lessonScript.conclusion.content;
            setCurrentStage(LESSON_STAGES.INTRODUCTION); // Reusing introduction stage for conclusion
            setContentIndex(0);
            setAvatarAnimation(lessonScript.conclusion.avatarState);
            
            // Set up transition to quiz
            if (contentIndex >= conclusionContent.length - 1) {
              setTimeout(() => {
                setCurrentStage(LESSON_STAGES.QUIZ);
              }, 2000);
            }
          }
        }
      }
    }
  }, [currentStage, sectionIndex, contentIndex]);

  // Advance to next content item
  const advanceContent = () => {
    if (currentStage === LESSON_STAGES.INTRODUCTION) {
      const introContent = lessonScript.introduction.content;
      if (contentIndex < introContent.length - 1) {
        setContentIndex(contentIndex + 1);
      } else {
        setCurrentStage(LESSON_STAGES.CONTENT);
        setSectionIndex(0);
        setContentIndex(0);
      }
    } else if (currentStage === LESSON_STAGES.CONTENT) {
      const sections = lessonScript.mainContent;
      const currentSection = sections[sectionIndex];
      
      if (contentIndex < currentSection.content.length - 1) {
        setContentIndex(contentIndex + 1);
      } else if (sectionIndex < sections.length - 1) {
        setSectionIndex(sectionIndex + 1);
        setContentIndex(0);
      } else {
        // Move to conclusion
        setCurrentStage(LESSON_STAGES.INTRODUCTION); // Reusing introduction for conclusion
        setContentIndex(0);
        
        // Schedule transition to quiz
        setTimeout(() => {
          setCurrentStage(LESSON_STAGES.QUIZ);
        }, 5000);
      }
    }
  };

  // Handle webcam permission callback
  const handleWebcamPermissionGranted = () => {
    setWebcamActive(true);
    
    // If we were waiting for webcam, advance content
    const introContent = lessonScript.introduction.content;
    if (contentIndex < introContent.length && introContent[contentIndex].waitForWebcam) {
      setTimeout(() => {
        advanceContent();
      }, 1000);
    }
  };

  // Handle avatar animation complete
  const handleAvatarAnimationComplete = () => {
    setAvatarSpeaking(false);
    
    // Auto-advance after a delay
    setTimeout(() => {
      advanceContent();
    }, 1500);
  };

  // Handle quiz completion
  const handleQuizComplete = (results) => {
    setQuizResults(results);
    
    // Record progress in user context
    updateUserProgress('mars-rover-mission', {
      completed: true,
      score: results.percentage,
      date: new Date().toISOString()
    });
    
    // Award badges
    if (results.isPerfect) {
      saveEarnedBadge(lessonScript.badges.perfectScore);
    }
    saveEarnedBadge(lessonScript.badges.completion);
    
    // Show results
    setCurrentStage(LESSON_STAGES.RESULTS);
  };

  // Handle continue after results
  const handleContinueAfterResults = () => {
    // Navigate back to dashboard or next lesson
    navigate('/dashboard');
  };

  return (
    <div 
      className="lesson-container" 
      style={{ backgroundImage: `url(/assets/backgrounds/${backgroundImage})` }}
    >
      <div className="lesson-header">
        <h1>Mars Rover Mission</h1>
        {currentStage === LESSON_STAGES.CONTENT && (
          <div className="lesson-progress">
            <span>
              Section {sectionIndex + 1} of {lessonScript.mainContent.length}
            </span>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${((sectionIndex * 100) / lessonScript.mainContent.length)}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      <div className="lesson-content" ref={lessonContentRef}>
        {(currentStage === LESSON_STAGES.INTRODUCTION || currentStage === LESSON_STAGES.CONTENT) && (
          <div className="lesson-main-content">
            <div className="avatar-section">
              <Avatar 
                speaking={avatarSpeaking}
                currentAnimation={avatarAnimation}
                message={avatarMessage}
                onAnimationComplete={handleAvatarAnimationComplete}
              />
            </div>
            
            {currentStage === LESSON_STAGES.CONTENT && currentVisual && (
              <div className="visual-section">
                <img 
                  src={`/assets/visuals/${currentVisual}`} 
                  alt="Visual aid" 
                  className="lesson-visual"
                />
              </div>
            )}
            
            <div className="webcam-section">
              <Webcam 
                onPermissionGranted={handleWebcamPermissionGranted}
                onPermissionDenied={() => {}}
              />
            </div>
          </div>
        )}

        {currentStage === LESSON_STAGES.QUIZ && (
          <Quiz 
            questions={lessonScript.quizQuestions}
            onComplete={handleQuizComplete}
          />
        )}

        {currentStage === LESSON_STAGES.RESULTS && (
          <Results 
            quizResults={quizResults}
            badges={lessonScript.badges}
            feedbackMessages={lessonScript.feedbackMessages}
            onContinue={handleContinueAfterResults}
          />
        )}
      </div>
    </div>
  );
};

export default Lesson;