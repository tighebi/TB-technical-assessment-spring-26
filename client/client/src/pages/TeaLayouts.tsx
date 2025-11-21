/**
 * TeaLayouts.tsx
 * ----------
 * Unified layout for all tea types with tea-specific color themes
 */
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Stack,
  Fade,
  Grid,
  Container
} from '@mui/material';
import {
  LocationOn,
  LocalFlorist,
  Build,
  Favorite,
  Coffee,
  Lightbulb,
  ExpandMore
} from '@mui/icons-material';

// TeaData interface
interface TeaData {
  name: string;
  subtitle: string;
  origin: string;
  flavorProfile: string;
  processing: string;
  healthBenefits: string[];
  brewingTips: string;
  funFacts: string[];
  quizzes: Array<{
    question: string;
    options: Array<{ text: string; isCorrect: boolean }>;
    explanation: string;
  }>;
}

interface TeaLayoutsProps {
  tea: TeaData;
  teaType: string;
  firstQuizRef: React.RefObject<HTMLDivElement | null>;
  secondQuizRef: React.RefObject<HTMLDivElement | null>;
  firstQuizVisible: boolean;
  secondQuizVisible: boolean;
  QuizComponent: React.ComponentType<any>;
  CommentsComponent: React.ComponentType<any>;
}

// Color theme configurations based on tea type
interface TeaTheme {
  primary: string;           // Main card gradient start
  secondary: string;         // Main card gradient end
  iconColor: string;         // Icon color
  textColor: string;         // Text color
  borderColor: string;       // Border color
  chipBackground: string;    // Chip background
  chipBorder: string;        // Chip border
  accordionBg: string;       // Accordion background
}

/**
 * Returns color theme configuration based on tea type
 * Each tea has a unique color scheme that matches its characteristics
 * (e.g., white tea = light colors, black tea = dark colors)
 */
const getTeaTheme = (teaType: string | undefined): TeaTheme => {
  switch (teaType) {
    case 'white':
      return {
        primary: '#f5f3f0',      // Very light cream/white
        secondary: '#e8e3d8',    // Soft beige
        iconColor: 'rgba(180, 170, 160, 0.9)',
        textColor: 'var(--ink)',
        borderColor: 'rgba(180, 170, 160, 0.3)',
        chipBackground: 'rgba(255, 255, 255, 0.7)',
        chipBorder: 'rgba(180, 170, 160, 0.4)',
        accordionBg: 'linear-gradient(145deg, #f5f3f0, #e8e3d8)'
      };
    case 'yellow':
      return {
        primary: '#fff9e6',      // Pale yellow
        secondary: '#fff4cc',    // Light gold
        iconColor: 'rgba(255, 193, 7, 0.9)',
        textColor: 'var(--ink)',
        borderColor: 'rgba(255, 193, 7, 0.3)',
        chipBackground: 'rgba(255, 255, 255, 0.7)',
        chipBorder: 'rgba(255, 193, 7, 0.4)',
        accordionBg: 'linear-gradient(145deg, #fff9e6, #fff4cc)'
      };
    case 'green':
      return {
        primary: '#e8f5e9',      // Light green
        secondary: '#c8e6c9',    // Medium green
        iconColor: 'rgba(76, 175, 80, 0.9)',
        textColor: 'var(--ink)',
        borderColor: 'rgba(76, 175, 80, 0.3)',
        chipBackground: 'rgba(255, 255, 255, 0.7)',
        chipBorder: 'rgba(76, 175, 80, 0.4)',
        accordionBg: 'linear-gradient(145deg, #e8f5e9, #c8e6c9)'
      };
    case 'oolong':
      return {
        primary: '#fff3e0',      // Light amber/orange
        secondary: '#ffe0b2',    // Medium amber
        iconColor: 'rgba(255, 152, 0, 0.9)',
        textColor: 'var(--ink)',
        borderColor: 'rgba(255, 152, 0, 0.3)',
        chipBackground: 'rgba(255, 255, 255, 0.7)',
        chipBorder: 'rgba(255, 152, 0, 0.4)',
        accordionBg: 'linear-gradient(145deg, #fff3e0, #ffe0b2)'
      };
    case 'black':
      return {
        primary: '#3e2723',      // Dark brown
        secondary: '#5d4037',    // Medium dark brown
        iconColor: '#d7ccc8',
        textColor: '#efebe9',
        borderColor: 'rgba(121, 85, 72, 0.4)',
        chipBackground: 'rgba(255, 255, 255, 0.15)',
        chipBorder: 'rgba(215, 204, 200, 0.3)',
        accordionBg: 'linear-gradient(145deg, #3e2723, #5d4037)'
      };
    case 'pu-erh':
      return {
        primary: '#6d4c41',      // Dark earthy brown
        secondary: '#8d6e63',    // Medium earthy brown
        iconColor: '#d7ccc8',
        textColor: '#efebe9',
        borderColor: 'rgba(141, 110, 99, 0.4)',
        chipBackground: 'rgba(255, 255, 255, 0.15)',
        chipBorder: 'rgba(215, 204, 200, 0.3)',
        accordionBg: 'linear-gradient(145deg, #6d4c41, #8d6e63)'
      };
    default:
      return {
        primary: '#f5e3c8',
        secondary: '#e9d1a9',
        iconColor: 'rgba(201, 165, 112, 0.9)',
        textColor: 'var(--ink)',
        borderColor: 'rgba(201, 165, 112, 0.2)',
        chipBackground: 'rgba(255, 255, 255, 0.6)',
        chipBorder: 'rgba(201, 165, 112, 0.3)',
        accordionBg: 'linear-gradient(145deg, #f5e3c8, #e9d1a9)'
      };
  }
};

/**
 * Unified layout component for all tea types
 * 
 * This component receives tea data and renders it in a consistent layout structure.
 * The theme colors change based on tea type, but the layout structure stays the same.
 * Uses refs to trigger scroll-based animations for quizzes.
 */
export default function TeaLayouts({ 
  tea, 
  teaType, 
  firstQuizRef, 
  secondQuizRef, 
  firstQuizVisible, 
  secondQuizVisible,
  QuizComponent,
  CommentsComponent
}: TeaLayoutsProps) {
  const theme = getTeaTheme(teaType);

  return (
    <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
      {/* First Section: Origin and Flavor side by side */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Fade in={true} timeout={600}>
            <Card 
              sx={{ 
                height: '100%',
                background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`,
                borderRadius: '20px', 
                padding: '2.5rem',
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                border: `1px solid ${theme.borderColor}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-6px)',
                  boxShadow: '0 16px 50px rgba(0, 0, 0, 0.2)'
                }
              }}
            >
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <LocationOn sx={{ color: theme.iconColor, fontSize: '2.5rem' }} />
                  <Typography 
                    variant="h4"
                    sx={{ 
                      fontFamily: "'Playfair Display', serif",
                      fontSize: '1.8rem',
                      color: theme.iconColor,
                      fontWeight: 700
                    }}
                  >
                    Origin
                  </Typography>
                </Box>
                <Typography sx={{ color: theme.textColor, lineHeight: 1.9, fontSize: '1.1rem' }}>
                  {tea.origin}
                </Typography>
              </CardContent>
            </Card>
          </Fade>
        </Grid>
        <Grid item xs={12} md={6}>
          <Fade in={true} timeout={800}>
            <Card 
              sx={{ 
                height: '100%',
                background: `linear-gradient(135deg, ${theme.secondary} 0%, ${theme.primary} 100%)`,
                borderRadius: '20px', 
                padding: '2.5rem',
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                border: `1px solid ${theme.borderColor}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-6px)',
                  boxShadow: '0 16px 50px rgba(0, 0, 0, 0.2)'
                }
              }}
            >
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <LocalFlorist sx={{ color: theme.iconColor, fontSize: '2.5rem' }} />
                  <Typography 
                    variant="h4"
                    sx={{ 
                      fontFamily: "'Playfair Display', serif",
                      fontSize: '1.8rem',
                      color: theme.iconColor,
                      fontWeight: 700
                    }}
                  >
                    Flavor Profile
                  </Typography>
                </Box>
                <Typography sx={{ color: theme.textColor, lineHeight: 1.9, fontSize: '1.1rem' }}>
                  {tea.flavorProfile}
                </Typography>
              </CardContent>
            </Card>
          </Fade>
        </Grid>
      </Grid>

      {/* Processing - Full Width */}
      <Fade in={true} timeout={1000}>
        <Box sx={{ mb: 3 }}>
          <Card 
            sx={{ 
              background: `linear-gradient(145deg, ${theme.primary}, ${theme.secondary})`,
              borderRadius: '24px', 
              padding: '3rem',
              boxShadow: '0 16px 50px rgba(0, 0, 0, 0.18)',
              border: `1px solid ${theme.borderColor}`,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.22)'
              }
            }}
          >
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Build sx={{ color: theme.iconColor, fontSize: '2.5rem' }} />
                <Typography 
                  variant="h3"
                  sx={{ 
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '2rem',
                    color: theme.iconColor,
                    fontWeight: 700
                  }}
                >
                  How It's Made
                </Typography>
              </Box>
              <Typography sx={{ color: theme.textColor, lineHeight: 1.9, fontSize: '1.1rem' }}>
                {tea.processing}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Fade>

      {/* First Quiz */}
      {tea.quizzes.length > 0 && (
        <div 
          ref={firstQuizRef}
          className={`quiz-slide-left ${firstQuizVisible ? 'visible' : ''}`}
        >
          <QuizComponent
            question={tea.quizzes[0].question}
            options={tea.quizzes[0].options}
            explanation={tea.quizzes[0].explanation}
          />
        </div>
      )}

      {/* Second Section: Health Benefits and Brewing side by side */}
      <Grid container spacing={3} sx={{ mb: 3, mt: 3 }}>
        <Grid item xs={12} md={6}>
          <Fade in={true} timeout={1200}>
            <Card 
              sx={{ 
                height: '100%',
                background: `linear-gradient(135deg, ${theme.secondary} 0%, ${theme.primary} 100%)`,
                borderRadius: '20px', 
                padding: '2.5rem',
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                border: `1px solid ${theme.borderColor}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-6px)',
                  boxShadow: '0 16px 50px rgba(0, 0, 0, 0.2)'
                }
              }}
            >
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                  <Favorite sx={{ color: theme.iconColor, fontSize: '2.5rem' }} />
                  <Typography 
                    variant="h4"
                    sx={{ 
                      fontFamily: "'Playfair Display', serif",
                      fontSize: '1.8rem',
                      color: theme.iconColor,
                      fontWeight: 700
                    }}
                  >
                    Health Benefits
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
                  {tea.healthBenefits.map((benefit, idx) => (
                    <Chip
                      key={idx}
                      label={benefit}
                      sx={{
                        background: theme.chipBackground,
                        color: theme.textColor,
                        border: `1px solid ${theme.chipBorder}`,
                        fontWeight: 500,
                        fontSize: '0.95rem',
                        padding: '0.5rem 0.75rem',
                        '&:hover': {
                          background: theme.borderColor,
                          transform: 'scale(1.05)'
                        },
                        transition: 'all 0.2s ease'
                      }}
                    />
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Fade>
        </Grid>
        <Grid item xs={12} md={6}>
          <Fade in={true} timeout={1400}>
            <Card 
              sx={{ 
                height: '100%',
                background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`,
                borderRadius: '20px', 
                padding: '2.5rem',
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                border: `1px solid ${theme.borderColor}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-6px)',
                  boxShadow: '0 16px 50px rgba(0, 0, 0, 0.2)'
                }
              }}
            >
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <Coffee sx={{ color: theme.iconColor, fontSize: '2.5rem' }} />
                  <Typography 
                    variant="h4"
                    sx={{ 
                      fontFamily: "'Playfair Display', serif",
                      fontSize: '1.8rem',
                      color: theme.iconColor,
                      fontWeight: 700
                    }}
                  >
                    Brewing Tips
                  </Typography>
                </Box>
                <Typography sx={{ color: theme.textColor, lineHeight: 1.9, fontSize: '1rem' }}>
                  {tea.brewingTips}
                </Typography>
              </CardContent>
            </Card>
          </Fade>
        </Grid>
      </Grid>

      {/* Second Quiz */}
      {tea.quizzes.length > 1 && (
        <div 
          ref={secondQuizRef}
          className={`quiz-slide-right ${secondQuizVisible ? 'visible' : ''}`}
        >
          <QuizComponent
            question={tea.quizzes[1].question}
            options={tea.quizzes[1].options}
            explanation={tea.quizzes[1].explanation}
          />
        </div>
      )}

      {/* Fun Facts Accordion */}
      <Fade in={true} timeout={1600}>
        <Box sx={{ mb: 3 }}>
          <Accordion 
            sx={{ 
              background: theme.accordionBg,
              borderRadius: '20px !important',
              border: `1px solid ${theme.borderColor}`,
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
              '&:before': { display: 'none' },
              '&.Mui-expanded': { margin: 0 }
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMore sx={{ color: theme.iconColor, fontSize: '2rem' }} />}
              sx={{
                padding: '2rem 2.5rem',
                '& .MuiAccordionSummary-content': {
                  alignItems: 'center',
                  gap: 1.5
                }
              }}
            >
              <Lightbulb sx={{ color: theme.iconColor, fontSize: '2.5rem' }} />
              <Typography 
                variant="h4"
                sx={{ 
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '1.8rem',
                  color: theme.iconColor,
                  fontWeight: 700
                }}
              >
                Fun Facts
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ padding: '0 2.5rem 2rem' }}>
              <Stack spacing={2}>
                {tea.funFacts.map((fact, idx) => (
                  <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                    <Chip 
                      label={idx + 1}
                      sx={{
                        background: theme.chipBackground,
                        color: theme.textColor,
                        fontWeight: 700,
                        minWidth: '40px',
                        height: '40px',
                        fontSize: '1rem'
                      }}
                    />
                    <Typography sx={{ color: theme.textColor, lineHeight: 1.9, flex: 1, fontSize: '1.05rem' }}>
                      {fact}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </AccordionDetails>
          </Accordion>
        </Box>
      </Fade>

      {/* Comments Section */}
      <Divider sx={{ my: 4, borderColor: theme.borderColor }} />
      <Box sx={{ maxWidth: '900px', mx: 'auto' }}>
        <CommentsComponent pageId={teaType} />
      </Box>
    </Container>
  );
}
