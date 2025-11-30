// Interactive quiz with voting and live results
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
import API_BASE from '../utils/api';
import './Quiz.css';

interface QuizOption {
  text: string;
  isCorrect: boolean;
}

interface QuizTheme {
  primary: string;
  secondary: string;
  iconColor: string;
  textColor: string;
  borderColor: string;
  chipBackground?: string;
  chipBorder?: string;
}

interface QuizProps {
  question: string;
  options: QuizOption[];
  explanation?: string;
  questionId: string; // Unique identifier for this question (e.g., "white-q1", "green-q2")
  theme?: QuizTheme; // Optional theme for matching page colors
}

export default function Quiz({ question, options, explanation, questionId, theme }: QuizProps) {
  const defaultTheme: QuizTheme = {
    primary: '#fff7e7',
    secondary: '#e9d1a9',
    iconColor: 'rgba(201, 165, 112, 0.9)',
    textColor: 'var(--ink)',
    borderColor: 'rgba(201, 165, 112, 0.3)',
    chipBackground: 'rgba(201, 165, 112, 0.3)',
    chipBorder: 'rgba(201, 165, 112, 0.4)'
  };
  
  const quizTheme = theme || defaultTheme;
  
  // Check if theme is dark (black or pu-erh tea)
  const isDarkTheme = quizTheme.primary === '#3e2723' || quizTheme.primary === '#6d4c41';
  
  const getOptionBackground = (isSelected: boolean) => {
    if (isDarkTheme) {
      return isSelected 
        ? quizTheme.secondary 
        : `linear-gradient(135deg, ${quizTheme.primary}, ${quizTheme.secondary})`;
    } else {
      return isSelected
        ? 'rgba(255, 255, 255, 0.9)'
        : 'rgba(255, 255, 255, 0.6)';
    }
  };
  
  const getOptionHoverBackground = () => {
    if (isDarkTheme) {
      return quizTheme.secondary;
    } else {
      return 'rgba(255, 255, 255, 0.8)';
    }
  };
  
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [votes, setVotes] = useState<Record<number, { count: number; users: string[] }>>(() => {
    const initial: Record<number, { count: number; users: string[] }> = {};
    options.forEach((_, index) => {
      initial[index] = { count: 0, users: [] };
    });
    return initial;
  });
  const [userVote, setUserVote] = useState<number | null>(null);

  useEffect(() => {
    const fetchVotes = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/votes/${questionId}`);
        if (response.ok) {
          const voteData = await response.json();
          const aggregated: Record<number, { count: number; users: string[] }> = {};
          options.forEach((_, index) => {
            const optionLetter = String.fromCharCode(65 + index);
            const optionVotes = voteData.filter((v: any) => v.selectedOption === optionLetter);
            aggregated[index] = {
              count: optionVotes.length,
              users: optionVotes.map((v: any) => v.userName)
            };
          });
          setVotes(aggregated);
        }
      } catch (err) {
        console.error("Error fetching votes:", err);
      }
    };
    fetchVotes();
  }, [questionId, options.length]);

  const handleOptionClick = async (index: number) => {
    if (showResult && userVote === index) {
      return;
    }

    let currentUserName = getUsername();
    if (!currentUserName.trim()) {
      const name = prompt('Please enter your name to vote:') || 'Anonymous';
      if (name && name !== 'Anonymous') {
        setUsername(name);
        currentUserName = name;
      } else {
        currentUserName = name;
      }
    }

    const optionLetter = String.fromCharCode(65 + index); // Convert index to letter: 0->A, 1->B, etc.

    try {
      // Post vote to API
      const response = await fetch(`${API_BASE}/api/votes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: currentUserName,
          questionId: questionId,
          selectedOption: optionLetter
        })
      });

      if (response.ok) {
        const voteResponse = await fetch(`${API_BASE}/api/votes/${questionId}`);
        if (voteResponse.ok) {
          const voteData = await voteResponse.json();
          const aggregated: Record<number, { count: number; users: string[] }> = {};
          options.forEach((_, idx) => {
            const optLetter = String.fromCharCode(65 + idx);
            const optionVotes = voteData.filter((v: any) => v.selectedOption === optLetter);
            aggregated[idx] = {
              count: optionVotes.length,
              users: optionVotes.map((v: any) => v.userName)
            };
          });
          setVotes(aggregated);
        }
        setUserVote(index);
        setSelectedOption(index);
        setShowResult(true);
      } else {
        console.error("Error posting vote:", await response.text());
        alert('Failed to submit vote. Please try again.');
      }
    } catch (err) {
      console.error("Error posting vote:", err);
      alert('Failed to submit vote. Please try again.');
    }
  };

  // Calculate total votes across all options for percentage calculations
  const totalVotes = Object.values(votes).reduce((sum, v) => sum + v.count, 0);

  return (
    <Card 
      className="quiz-container"
      sx={{
        background: `linear-gradient(145deg, ${quizTheme.primary}, ${quizTheme.secondary})`,
        borderRadius: '20px',
        border: `2px solid ${quizTheme.borderColor}`,
        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
        overflow: 'visible'
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <QuizIcon sx={{ color: quizTheme.iconColor, fontSize: '2rem' }} />
          <Typography 
            variant="h5" 
            component="h3"
            sx={{ 
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              color: quizTheme.textColor,
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
                        ? (isDarkTheme ? quizTheme.borderColor : 'rgba(201, 165, 112, 0.5)')
                        : (isDarkTheme ? quizTheme.borderColor : 'rgba(0, 0, 0, 0.1)')
                  }`,
                  background: showCorrect
                    ? (isCorrect ? 'rgba(74, 124, 89, 0.1)' : 'rgba(201, 74, 74, 0.1)')
                    : getOptionBackground(isSelected),
                  '&:hover': {
                    transform: 'translateX(4px)',
                    boxShadow: 4,
                    background: getOptionHoverBackground()
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: showResult ? 1 : 0 }}>
                  <Chip
                    label={String.fromCharCode(65 + index)}
                    size="small"
                    sx={{
                      background: isDarkTheme ? (quizTheme.chipBackground || 'rgba(255, 255, 255, 0.15)') : 'rgba(201, 165, 112, 0.3)',
                      color: quizTheme.textColor,
                      fontWeight: 700,
                      minWidth: '32px',
                      border: isDarkTheme ? `1px solid ${quizTheme.chipBorder || quizTheme.borderColor}` : 'none'
                    }}
                  />
                  <Typography sx={{ flex: 1, color: quizTheme.textColor, fontWeight: isSelected ? 600 : 400 }}>
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
                      <Typography variant="caption" sx={{ fontWeight: 600, color: quizTheme.textColor }}>
                        {votes[index].count} votes ({percentage.toFixed(0)}%)
                      </Typography>
                      {votes[index].users.length > 0 && (
                        <Typography variant="caption" sx={{ 
                          fontStyle: 'italic', 
                          color: isDarkTheme ? 'rgba(239, 235, 233, 0.7)' : 'rgba(44, 27, 16, 0.6)' 
                        }}>
                          {votes[index].users.slice(0, 3).join(', ')}
                          {votes[index].users.length > 3 && ` +${votes[index].users.length - 3} more`}
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

