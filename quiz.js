import React, { useState, useEffect } from 'react';
import Avatar from '../Avatar/Avatar';
import './Quiz.css';

const Quiz = ({ questions, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [avatarSpeaking, setAvatarSpeaking] = useState(true);
  const [avatarMessage, setAvatarMessage] = useState('');
  const [avatarAnimation, setAvatarAnimation] = useState('questioning');

  const currentQuestion = questions[currentQuestionIndex];

  // Set initial avatar message
  useEffect(() => {
    setAvatarMessage(`Question ${currentQuestionIndex + 1}: ${currentQuestion.question}`);
  }, [currentQuestionIndex, currentQuestion]);

  const handleAnswerSelect = (answerIndex) => {
    if (showFeedback) return; // Prevent selecting another answer during feedback
    
    setSelectedAnswer(answerIndex);
    const correct = answerIndex === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(score + 1);
    }
    
    setShowFeedback(true);
    setAvatarSpeaking(true);
    setAvatarMessage(correct ? currentQuestion.feedback.correct : currentQuestion.feedback.incorrect);
    setAvatarAnimation(correct ? 'happy' : 'thinking');
  };

  const handleNextQuestion = () => {
    setShowFeedback(false);
    setSelectedAnswer(null);
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizCompleted(true);
      
      // Calculate percentage score
      const percentage = Math.round((score / questions.length) * 100);
      
      // Pass results to parent component
      onComplete({
        score,
        total: questions.length,
        percentage,
        isPerfect: score === questions.length
      });
    }
  };

  const handleAnimationComplete = () => {
    setAvatarSpeaking(false);
  };

  return (
    <div className="quiz-container">
      {!quizCompleted ? (
        <>
          <div className="quiz-header">
            <h2>Mars Rover Mission Quiz</h2>
            <div className="quiz-progress">
              <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="quiz-content">
            <div className="quiz-avatar-section">
              <Avatar 
                speaking={avatarSpeaking}
                currentAnimation={avatarAnimation}
                message={avatarMessage}
                onAnimationComplete={handleAnimationComplete}
              />
            </div>

            <div className="quiz-question-section">
              <h3>{currentQuestion.question}</h3>
              
              <div className="quiz-options">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    className={`quiz-option ${selectedAnswer === index ? 'selected' : ''} 
                               ${showFeedback && index === currentQuestion.correctAnswer ? 'correct' : ''}
                               ${showFeedback && selectedAnswer === index && index !== currentQuestion.correctAnswer ? 'incorrect' : ''}`}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={showFeedback}
                  >
                    {option}
                  </button>
                ))}
              </div>
              
              {showFeedback && (
                <div className={`quiz-feedback ${isCorrect ? 'correct-feedback' : 'incorrect-feedback'}`}>
                  <p>{isCorrect ? currentQuestion.feedback.correct : currentQuestion.feedback.incorrect}</p>
                  <button 
                    className="next-question-button"
                    onClick={handleNextQuestion}
                  >
                    {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'See Results'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="quiz-loading">
          <p>Calculating your results...</p>
          {/* This would be replaced with a loading animation */}
        </div>
      )}
    </div>
  );
};

export default Quiz;