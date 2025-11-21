/**
 * Quiz.tsx
 * ----------
 * Interactive quiz component with live results
 */
import { useState } from 'react';
import './Quiz.css';

interface QuizOption {
  text: string;
  isCorrect: boolean;
}

interface QuizProps {
  question: string;
  options: QuizOption[];
  explanation?: string;
}

export default function Quiz({ question, options, explanation }: QuizProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [votes, setVotes] = useState<Record<number, { count: number; users: string[] }>>(() => {
    const initial: Record<number, { count: number; users: string[] }> = {};
    options.forEach((_, index) => {
      initial[index] = { count: 0, users: [] };
    });
    return initial;
  });
  const [userName, setUserName] = useState('');
  const [userVote, setUserVote] = useState<number | null>(null);

  const handleOptionClick = (index: number) => {
    if (showResult && userVote !== null) {
      // Change vote
      const oldVote = userVote;
      setVotes(prev => ({
        ...prev,
        [oldVote]: {
          count: prev[oldVote].count - 1,
          users: prev[oldVote].users.filter(u => u !== userName)
        },
        [index]: {
          count: prev[index].count + 1,
          users: [...prev[index].users, userName]
        }
      }));
      setUserVote(index);
    } else {
      // First vote
      if (!userName.trim()) {
        const name = prompt('Please enter your name to vote:') || 'Anonymous';
        setUserName(name);
        setVotes(prev => ({
          ...prev,
          [index]: {
            count: prev[index].count + 1,
            users: [...prev[index].users, name]
          }
        }));
        setUserVote(index);
      } else {
        setVotes(prev => ({
          ...prev,
          [index]: {
            count: prev[index].count + 1,
            users: [...prev[index].users, userName]
          }
        }));
        setUserVote(index);
      }
    }
    setSelectedOption(index);
    setShowResult(true);
  };

  const totalVotes = Object.values(votes).reduce((sum, v) => sum + v.count, 0);

  return (
    <div className="quiz-container">
      <h3 className="quiz-question">{question}</h3>
      <div className="quiz-options">
        {options.map((option, index) => {
          const isSelected = selectedOption === index;
          const isCorrect = option.isCorrect;
          const percentage = totalVotes > 0 ? (votes[index].count / totalVotes) * 100 : 0;
          const showCorrect = showResult && isSelected;

          return (
            <div
              key={index}
              className={`quiz-option ${isSelected ? 'selected' : ''} ${showCorrect ? (isCorrect ? 'correct' : 'incorrect') : ''}`}
              onClick={() => handleOptionClick(index)}
            >
              <div className="quiz-option-content">
                <div className="quiz-option-text">
                  <span className="quiz-option-label">{String.fromCharCode(65 + index)}.</span>
                  <span>{option.text}</span>
                  {showCorrect && (
                    <span className="quiz-result-icon">
                      {isCorrect ? '✓' : '✗'}
                    </span>
                  )}
                </div>
                {showResult && (
                  <div className="quiz-results">
                    <div className="quiz-bar-container">
                      <div 
                        className="quiz-bar" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="quiz-stats">
                      <span className="quiz-count">{votes[index].count} votes ({percentage.toFixed(0)}%)</span>
                      {votes[index].users.length > 0 && (
                        <span className="quiz-users">
                          {votes[index].users.slice(0, 3).join(', ')}
                          {votes[index].users.length > 3 && ` +${votes[index].users.length - 3} more`}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {showResult && explanation && selectedOption !== null && (
        <div className={`quiz-explanation ${options[selectedOption].isCorrect ? 'correct' : 'incorrect'}`}>
          {explanation}
        </div>
      )}
      {showResult && userVote !== null && (
        <p className="quiz-change-note">You can click another option to change your vote!</p>
      )}
    </div>
  );
}

