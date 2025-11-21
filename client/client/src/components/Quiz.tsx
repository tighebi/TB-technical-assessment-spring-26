/**
 * Quiz.tsx
 * ----------
 * Interactive quiz component with live results
 */
import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip,
  Stack,
  Paper,
  IconButton
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Quiz as QuizIcon
} from '@mui/icons-material';
import { getUsername, setUsername } from '../utils/username';
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
  // Track votes for each option: { 0: {count: 5, users: ['Alice', 'Bob']}, 1: {...}, ... }
  // Initialize with 0 votes for each option when component loads
  const [votes, setVotes] = useState<Record<number, { count: number; users: string[] }>>(() => {
    const initial: Record<number, { count: number; users: string[] }> = {};
    options.forEach((_, index) => {
      initial[index] = { count: 0, users: [] }; // Start with empty vote counts
    });
    return initial;
  });
  const [userName, setUserName] = useState('');
  const [userVote, setUserVote] = useState<number | null>(null);

  useEffect(() => {
    const storedUsername = getUsername();
    if (storedUsername) {
      setUserName(storedUsername);
    } else {
      const name = prompt('Please enter your name to vote:') || 'Anonymous';
      if (name && name !== 'Anonymous') {
        setUsername(name);
      }
      setUserName(name);
    }
  }, []);

  const handleOptionClick = (index: number) => {
    if (showResult && userVote === index) {
      return;
    }

    // User is changing their vote: remove from old option, add to new option
    if (showResult && userVote !== null) {
      const oldVote = userVote;
      // Update both old and new vote counts atomically
      setVotes(prev => ({
        ...prev,
        [oldVote]: {
          count: prev[oldVote].count - 1, // Decrement old vote
          users: prev[oldVote].users.filter(u => u !== userName) // Remove user from old list
        },
        [index]: {
          count: prev[index].count + 1, // Increment new vote
          users: [...prev[index].users, userName] // Add user to new list
        }
      }));
      setUserVote(index);
    } else {
      if (!userName.trim()) {
        const name = prompt('Please enter your name to vote:') || 'Anonymous';
        if (name && name !== 'Anonymous') {
          setUsername(name);
        }
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

  // Calculate total votes across all options for percentage calculations
  const totalVotes = Object.values(votes).reduce((sum, v) => sum + v.count, 0);

  return (
    <Card 
      className="quiz-container"
      sx={{
        background: 'linear-gradient(145deg, #fff7e7, #e9d1a9)',
        borderRadius: '20px',
        border: '2px solid rgba(201, 165, 112, 0.3)',
        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
        overflow: 'visible'
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <QuizIcon sx={{ color: 'rgba(201, 165, 112, 0.9)', fontSize: '2rem' }} />
          <Typography 
            variant="h5" 
            component="h3"
            sx={{ 
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              color: 'var(--ink)',
              flex: 1
            }}
          >
            {question}
          </Typography>
        </Box>
        
        <Stack spacing={1.5}>
          {options.map((option, index) => {
            const isSelected = selectedOption === index; // Is this the option user clicked?
            const isCorrect = option.isCorrect; // Is this the correct answer?
            // Calculate percentage: (votes for this option / total votes) * 100
            const percentage = totalVotes > 0 ? (votes[index].count / totalVotes) * 100 : 0;
            // Only show correct/incorrect indicator if user selected this option
            const showCorrect = showResult && isSelected;

            return (
              <Paper
                key={index}
                elevation={isSelected ? 4 : 1}
                onClick={() => handleOptionClick(index)}
                sx={{
                  p: 2,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  border: `2px solid ${
                    showCorrect 
                      ? (isCorrect ? 'rgba(74, 124, 89, 0.5)' : 'rgba(201, 74, 74, 0.5)')
                      : isSelected 
                        ? 'rgba(201, 165, 112, 0.5)'
                        : 'rgba(0, 0, 0, 0.1)'
                  }`,
                  background: showCorrect
                    ? (isCorrect ? 'rgba(74, 124, 89, 0.1)' : 'rgba(201, 74, 74, 0.1)')
                    : isSelected
                      ? 'rgba(255, 255, 255, 0.9)'
                      : 'rgba(255, 255, 255, 0.6)',
                  '&:hover': {
                    transform: 'translateX(4px)',
                    boxShadow: 4,
                    background: 'rgba(255, 255, 255, 0.8)'
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: showResult ? 1 : 0 }}>
                  <Chip
                    label={String.fromCharCode(65 + index)} // Convert index to letter: 0->A, 1->B, 2->C, 3->D
                    size="small"
                    sx={{
                      background: 'rgba(201, 165, 112, 0.3)',
                      color: 'var(--ink)',
                      fontWeight: 700,
                      minWidth: '32px'
                    }}
                  />
                  <Typography sx={{ flex: 1, color: 'var(--ink)', fontWeight: isSelected ? 600 : 400 }}>
                    {option.text}
                  </Typography>
                  {showCorrect && (
                    <IconButton size="small" disabled>
                      {isCorrect ? (
                        <CheckCircle sx={{ color: '#4a7c59', fontSize: '1.8rem' }} />
                      ) : (
                        <Cancel sx={{ color: '#c94a4a', fontSize: '1.8rem' }} />
                      )}
                    </IconButton>
                  )}
                </Box>
                
                {showResult && (
                  <Box sx={{ mt: 1.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: 'var(--ink)' }}>
                        {votes[index].count} votes ({percentage.toFixed(0)}%)
                      </Typography>
                      {votes[index].users.length > 0 && (
                        <Typography variant="caption" sx={{ fontStyle: 'italic', color: 'rgba(44, 27, 16, 0.6)' }}>
                          {votes[index].users.slice(0, 3).join(', ')} {/* Show first 3 users */}
                          {votes[index].users.length > 3 && ` +${votes[index].users.length - 3} more`} {/* Show count if more than 3 */}
                        </Typography>
                      )}
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={percentage}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: 'rgba(0, 0, 0, 0.05)',
                        '& .MuiLinearProgress-bar': {
                          // Color bar based on correctness: green if correct, red if incorrect, tan if not selected
                          background: showCorrect && isCorrect
                            ? 'linear-gradient(90deg, #4a7c59, #6b9d7a)' // Green for correct answer
                            : showCorrect && !isCorrect
                              ? 'linear-gradient(90deg, #c94a4a, #d96a6a)' // Red for incorrect answer
                              : 'linear-gradient(90deg, rgba(201, 165, 112, 0.6), rgba(201, 165, 112, 0.8))', // Tan for unselected options
                          borderRadius: 4
                        }
                      }}
                    />
                  </Box>
                )}
              </Paper>
            );
          })}
        </Stack>

        {showResult && explanation && selectedOption !== null && (
          <Paper
            elevation={0}
            sx={{
              mt: 3,
              p: 2,
              borderRadius: 2,
              background: options[selectedOption].isCorrect
                ? 'rgba(74, 124, 89, 0.1)'
                : 'rgba(201, 74, 74, 0.1)',
              borderLeft: `4px solid ${options[selectedOption].isCorrect ? '#4a7c59' : '#c94a4a'}`,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: options[selectedOption].isCorrect ? '#2d4a35' : '#7a2525',
                lineHeight: 1.6
              }}
            >
              {explanation}
            </Typography>
          </Paper>
        )}

        {showResult && userVote !== null && (
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              mt: 2,
              textAlign: 'center',
              fontStyle: 'italic',
              color: 'rgba(44, 27, 16, 0.6)'
            }}
          >
            You can click another option to change your vote!
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

