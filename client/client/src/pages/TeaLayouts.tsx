/**
 * TeaLayouts.tsx
 * ----------
 * Unique layout components for each tea type
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
  firstQuizRef: React.RefObject<HTMLDivElement>;
  secondQuizRef: React.RefObject<HTMLDivElement>;
  firstQuizVisible: boolean;
  secondQuizVisible: boolean;
  QuizComponent: React.ComponentType<any>;
  CommentsComponent: React.ComponentType<any>;
}

// Helper component for info cards
const InfoCard = ({ 
  icon, 
  title, 
  content, 
  delay, 
  gradient, 
  offset = false,
  fullWidth = false,
  gridSize = { xs: 12, md: 6 },
  sx = {}
}: any) => (
  <Grid item xs={gridSize.xs} md={gridSize.md}>
    <Fade in={true} timeout={delay}>
      <Card 
        sx={{ 
          height: '100%',
          background: gradient,
          borderRadius: '20px', 
          padding: fullWidth ? '3rem' : '2.5rem',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
          border: '1px solid rgba(201, 165, 112, 0.2)',
          transition: 'all 0.3s ease',
          ml: offset ? { xs: 0, md: 4 } : 0,
          mr: offset ? { xs: 0, md: 4 } : 0,
          '&:hover': {
            transform: 'translateY(-6px)',
            boxShadow: '0 16px 50px rgba(0, 0, 0, 0.2)'
          },
          ...sx
        }}
      >
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            {icon}
            <Typography 
              variant="h4"
              sx={{ 
                fontFamily: "'Playfair Display', serif",
                fontSize: fullWidth ? '2rem' : '1.8rem',
                color: 'rgba(201, 165, 112, 0.9)',
                fontWeight: 700
              }}
            >
              {title}
            </Typography>
          </Box>
          {typeof content === 'string' ? (
            <Typography sx={{ color: 'var(--ink)', lineHeight: 1.9, fontSize: fullWidth ? '1.1rem' : '1rem' }}>
              {content}
            </Typography>
          ) : (
            content
          )}
        </CardContent>
      </Card>
    </Fade>
  </Grid>
);

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
  
  // White Tea - Delicate, minimal, vertical stack
  if (teaType === 'white') {
    return (
      <Container maxWidth="md" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        <Stack spacing={3} sx={{ mb: 3 }}>
          <InfoCard
            icon={<LocationOn sx={{ color: 'rgba(201, 165, 112, 0.9)', fontSize: '2.5rem' }} />}
            title="Origin"
            content={tea.origin}
            delay={600}
            gradient="linear-gradient(135deg, #f5e3c8 0%, #e9d1a9 100%)"
            fullWidth
            gridSize={{ xs: 12, md: 12 }}
          />
          <InfoCard
            icon={<LocalFlorist sx={{ color: 'rgba(201, 165, 112, 0.9)', fontSize: '2.5rem' }} />}
            title="Flavor Profile"
            content={tea.flavorProfile}
            delay={800}
            gradient="linear-gradient(135deg, #e9d1a9 0%, #f5e3c8 100%)"
            fullWidth
            gridSize={{ xs: 12, md: 12 }}
          />
          <InfoCard
            icon={<Build sx={{ color: 'rgba(201, 165, 112, 0.9)', fontSize: '2.5rem' }} />}
            title="How It's Made"
            content={tea.processing}
            delay={1000}
            gradient="linear-gradient(145deg, #f5e3c8, #e9d1a9)"
            fullWidth
            gridSize={{ xs: 12, md: 12 }}
          />
        </Stack>

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

        <Stack spacing={3} sx={{ mb: 3, mt: 3 }}>
          <InfoCard
            icon={<Favorite sx={{ color: 'rgba(201, 165, 112, 0.9)', fontSize: '2.5rem' }} />}
            title="Health Benefits"
            content={
              <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
                {tea.healthBenefits.map((benefit, idx) => (
                  <Chip
                    key={idx}
                    label={benefit}
                    sx={{
                      background: 'rgba(255, 255, 255, 0.6)',
                      color: 'var(--ink)',
                      border: '1px solid rgba(201, 165, 112, 0.3)',
                      fontWeight: 500,
                      fontSize: '0.95rem',
                      padding: '0.5rem 0.75rem',
                      '&:hover': {
                        background: 'rgba(201, 165, 112, 0.3)',
                        transform: 'scale(1.05)'
                      },
                      transition: 'all 0.2s ease'
                    }}
                  />
                ))}
              </Stack>
            }
            delay={1200}
            gradient="linear-gradient(135deg, #e9d1a9 0%, #f5e3c8 100%)"
            fullWidth
            gridSize={{ xs: 12, md: 12 }}
          />
          <InfoCard
            icon={<Coffee sx={{ color: 'rgba(201, 165, 112, 0.9)', fontSize: '2.5rem' }} />}
            title="Brewing Tips"
            content={tea.brewingTips}
            delay={1400}
            gradient="linear-gradient(135deg, #f5e3c8 0%, #e9d1a9 100%)"
            fullWidth
            gridSize={{ xs: 12, md: 12 }}
          />
        </Stack>

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

        <Fade in={true} timeout={1600}>
          <Box sx={{ mb: 3, mt: 3 }}>
            <Accordion 
              sx={{ 
                background: 'linear-gradient(145deg, #f5e3c8, #e9d1a9)',
                borderRadius: '20px !important',
                border: '1px solid rgba(201, 165, 112, 0.2)',
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                '&:before': { display: 'none' },
                '&.Mui-expanded': { margin: 0 }
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMore sx={{ color: 'rgba(201, 165, 112, 0.9)', fontSize: '2rem' }} />}
                sx={{
                  padding: '2rem 2.5rem',
                  '& .MuiAccordionSummary-content': {
                    alignItems: 'center',
                    gap: 1.5
                  }
                }}
              >
                <Lightbulb sx={{ color: 'rgba(201, 165, 112, 0.9)', fontSize: '2.5rem' }} />
                <Typography 
                  variant="h4"
                  sx={{ 
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '1.8rem',
                    color: 'rgba(201, 165, 112, 0.9)',
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
                          background: 'rgba(255, 255, 255, 0.6)',
                          color: 'var(--ink)',
                          fontWeight: 700,
                          minWidth: '40px',
                          height: '40px',
                          fontSize: '1rem'
                        }}
                      />
                      <Typography sx={{ color: 'var(--ink)', lineHeight: 1.9, flex: 1, fontSize: '1.05rem' }}>
                        {fact}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </AccordionDetails>
            </Accordion>
          </Box>
        </Fade>

        <Divider sx={{ my: 4, borderColor: 'rgba(201, 165, 112, 0.3)' }} />
        <Box sx={{ maxWidth: '900px', mx: 'auto' }}>
          <CommentsComponent pageId={teaType} />
        </Box>
      </Container>
    );
  }

  // Yellow Tea - Premium, centered, elegant
  if (teaType === 'yellow') {
    return (
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
          <Stack spacing={4} sx={{ mb: 3 }}>
            <InfoCard
              icon={<LocationOn sx={{ color: 'rgba(201, 165, 112, 0.9)', fontSize: '2.5rem' }} />}
              title="Origin"
              content={tea.origin}
              delay={600}
              gradient="linear-gradient(135deg, #f5e3c8 0%, #e9d1a9 100%)"
              fullWidth
              gridSize={{ xs: 12, md: 12 }}
            />
            <InfoCard
              icon={<LocalFlorist sx={{ color: 'rgba(201, 165, 112, 0.9)', fontSize: '2.5rem' }} />}
              title="Flavor Profile"
              content={tea.flavorProfile}
              delay={800}
              gradient="linear-gradient(135deg, #e9d1a9 0%, #f5e3c8 100%)"
              fullWidth
              gridSize={{ xs: 12, md: 12 }}
            />
            <InfoCard
              icon={<Build sx={{ color: 'rgba(201, 165, 112, 0.9)', fontSize: '2.5rem' }} />}
              title="How It's Made"
              content={tea.processing}
              delay={1000}
              gradient="linear-gradient(145deg, #f5e3c8, #e9d1a9)"
              fullWidth
              gridSize={{ xs: 12, md: 12 }}
            />
          </Stack>
        </Box>

        {tea.quizzes.length > 0 && (
          <Box sx={{ maxWidth: '800px', mx: 'auto', mb: 3 }}>
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
          </Box>
        )}

        <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Fade in={true} timeout={1200}>
                <Card 
                  sx={{ 
                    height: '100%',
                    background: 'linear-gradient(135deg, #e9d1a9 0%, #f5e3c8 100%)',
                    borderRadius: '20px', 
                    padding: '2.5rem',
                    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                    border: '1px solid rgba(201, 165, 112, 0.2)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      boxShadow: '0 16px 50px rgba(0, 0, 0, 0.2)'
                    }
                  }}
                >
                  <CardContent sx={{ p: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                      <Favorite sx={{ color: 'rgba(201, 165, 112, 0.9)', fontSize: '2.5rem' }} />
                      <Typography 
                        variant="h4"
                        sx={{ 
                          fontFamily: "'Playfair Display', serif",
                          fontSize: '1.8rem',
                          color: 'rgba(201, 165, 112, 0.9)',
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
                            background: 'rgba(255, 255, 255, 0.6)',
                            color: 'var(--ink)',
                            border: '1px solid rgba(201, 165, 112, 0.3)',
                            fontWeight: 500,
                            fontSize: '0.95rem',
                            padding: '0.5rem 0.75rem',
                            '&:hover': {
                              background: 'rgba(201, 165, 112, 0.3)',
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
                    background: 'linear-gradient(135deg, #f5e3c8 0%, #e9d1a9 100%)',
                    borderRadius: '20px', 
                    padding: '2.5rem',
                    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                    border: '1px solid rgba(201, 165, 112, 0.2)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      boxShadow: '0 16px 50px rgba(0, 0, 0, 0.2)'
                    }
                  }}
                >
                  <CardContent sx={{ p: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                      <Coffee sx={{ color: 'rgba(201, 165, 112, 0.9)', fontSize: '2.5rem' }} />
                      <Typography 
                        variant="h4"
                        sx={{ 
                          fontFamily: "'Playfair Display', serif",
                          fontSize: '1.6rem',
                          color: 'rgba(201, 165, 112, 0.9)',
                          fontWeight: 700
                        }}
                      >
                        Brewing
                      </Typography>
                    </Box>
                    <Typography sx={{ color: 'var(--ink)', lineHeight: 1.9, fontSize: '1rem' }}>
                      {tea.brewingTips}
                    </Typography>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          </Grid>
        </Box>

        {tea.quizzes.length > 1 && (
          <Box sx={{ maxWidth: '800px', mx: 'auto', mb: 3 }}>
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
          </Box>
        )}

        <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
          <Fade in={true} timeout={1600}>
            <Accordion 
              sx={{ 
                background: 'linear-gradient(145deg, #f5e3c8, #e9d1a9)',
                borderRadius: '20px !important',
                border: '1px solid rgba(201, 165, 112, 0.2)',
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                '&:before': { display: 'none' },
                '&.Mui-expanded': { margin: 0 }
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMore sx={{ color: 'rgba(201, 165, 112, 0.9)', fontSize: '2rem' }} />}
                sx={{
                  padding: '2rem 2.5rem',
                  '& .MuiAccordionSummary-content': {
                    alignItems: 'center',
                    gap: 1.5
                  }
                }}
              >
                <Lightbulb sx={{ color: 'rgba(201, 165, 112, 0.9)', fontSize: '2.5rem' }} />
                <Typography 
                  variant="h4"
                  sx={{ 
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '1.8rem',
                    color: 'rgba(201, 165, 112, 0.9)',
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
                          background: 'rgba(255, 255, 255, 0.6)',
                          color: 'var(--ink)',
                          fontWeight: 700,
                          minWidth: '40px',
                          height: '40px',
                          fontSize: '1rem'
                        }}
                      />
                      <Typography sx={{ color: 'var(--ink)', lineHeight: 1.9, flex: 1, fontSize: '1.05rem' }}>
                        {fact}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </AccordionDetails>
            </Accordion>
          </Fade>
        </Box>

        <Divider sx={{ my: 4, borderColor: 'rgba(201, 165, 112, 0.3)' }} />
        <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
          <CommentsComponent pageId={teaType} />
        </Box>
      </Container>
    );
  }

  // Green Tea - Fresh, vibrant, alternating side-by-side
  if (teaType === 'green') {
    return (
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <Fade in={true} timeout={600}>
              <Card 
                sx={{ 
                  height: '100%',
                  background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
                  borderRadius: '20px', 
                  padding: '2.5rem',
                  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                  border: '2px solid rgba(76, 175, 80, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-6px) rotate(-1deg)',
                    boxShadow: '0 16px 50px rgba(0, 0, 0, 0.2)'
                  }
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                    <LocationOn sx={{ color: 'rgba(76, 175, 80, 0.9)', fontSize: '2.5rem' }} />
                    <Typography 
                      variant="h4"
                      sx={{ 
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '1.8rem',
                        color: 'rgba(76, 175, 80, 0.9)',
                        fontWeight: 700
                      }}
                    >
                      Origin
                    </Typography>
                  </Box>
                  <Typography sx={{ color: 'var(--ink)', lineHeight: 1.9, fontSize: '1.1rem' }}>
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
                  background: 'linear-gradient(135deg, #c8e6c9 0%, #e8f5e9 100%)',
                  borderRadius: '20px', 
                  padding: '2.5rem',
                  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                  border: '2px solid rgba(76, 175, 80, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-6px) rotate(1deg)',
                    boxShadow: '0 16px 50px rgba(0, 0, 0, 0.2)'
                  }
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                    <LocalFlorist sx={{ color: 'rgba(76, 175, 80, 0.9)', fontSize: '2.5rem' }} />
                    <Typography 
                      variant="h4"
                      sx={{ 
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '1.8rem',
                        color: 'rgba(76, 175, 80, 0.9)',
                        fontWeight: 700
                      }}
                    >
                      Flavor
                    </Typography>
                  </Box>
                  <Typography sx={{ color: 'var(--ink)', lineHeight: 1.9, fontSize: '1.1rem' }}>
                    {tea.flavorProfile}
                  </Typography>
                </CardContent>
              </Card>
            </Fade>
          </Grid>
        </Grid>

        <Fade in={true} timeout={1000}>
          <Box sx={{ mb: 3 }}>
            <Card 
              sx={{ 
                background: 'linear-gradient(145deg, #e8f5e9, #c8e6c9)',
                borderRadius: '24px', 
                padding: '3rem',
                boxShadow: '0 16px 50px rgba(0, 0, 0, 0.18)',
                border: '2px solid rgba(76, 175, 80, 0.3)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.22)'
                }
              }}
            >
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <Build sx={{ color: 'rgba(76, 175, 80, 0.9)', fontSize: '2.5rem' }} />
                  <Typography 
                    variant="h3"
                    sx={{ 
                      fontFamily: "'Playfair Display', serif",
                      fontSize: '2rem',
                      color: 'rgba(76, 175, 80, 0.9)',
                      fontWeight: 700
                    }}
                  >
                    How It's Made
                  </Typography>
                </Box>
                <Typography sx={{ color: 'var(--ink)', lineHeight: 1.9, fontSize: '1.1rem' }}>
                  {tea.processing}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Fade>

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

        <Grid container spacing={3} sx={{ mb: 3, mt: 3 }}>
          <Grid item xs={12} md={6}>
            <Fade in={true} timeout={1200}>
              <Card 
                sx={{ 
                  height: '100%',
                  background: 'linear-gradient(135deg, #c8e6c9 0%, #e8f5e9 100%)',
                  borderRadius: '20px', 
                  padding: '2.5rem',
                  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                  border: '2px solid rgba(76, 175, 80, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: '0 16px 50px rgba(0, 0, 0, 0.2)'
                  }
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                    <Favorite sx={{ color: 'rgba(76, 175, 80, 0.9)', fontSize: '2.5rem' }} />
                    <Typography 
                      variant="h4"
                      sx={{ 
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '1.8rem',
                        color: 'rgba(76, 175, 80, 0.9)',
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
                          background: 'rgba(255, 255, 255, 0.7)',
                          color: 'var(--ink)',
                          border: '1px solid rgba(76, 175, 80, 0.4)',
                          fontWeight: 500,
                          fontSize: '0.95rem',
                          padding: '0.5rem 0.75rem',
                          '&:hover': {
                            background: 'rgba(76, 175, 80, 0.2)',
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
                  background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
                  borderRadius: '20px', 
                  padding: '2.5rem',
                  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                  border: '2px solid rgba(76, 175, 80, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: '0 16px 50px rgba(0, 0, 0, 0.2)'
                  }
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                    <Coffee sx={{ color: 'rgba(76, 175, 80, 0.9)', fontSize: '2.5rem' }} />
                    <Typography 
                      variant="h4"
                      sx={{ 
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '1.8rem',
                        color: 'rgba(76, 175, 80, 0.9)',
                        fontWeight: 700
                      }}
                    >
                      Brewing
                    </Typography>
                  </Box>
                  <Typography sx={{ color: 'var(--ink)', lineHeight: 1.9, fontSize: '1rem' }}>
                    {tea.brewingTips}
                  </Typography>
                </CardContent>
              </Card>
            </Fade>
          </Grid>
        </Grid>

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

        <Fade in={true} timeout={1600}>
          <Box sx={{ mb: 3 }}>
            <Accordion 
              sx={{ 
                background: 'linear-gradient(145deg, #e8f5e9, #c8e6c9)',
                borderRadius: '20px !important',
                border: '2px solid rgba(76, 175, 80, 0.3)',
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                '&:before': { display: 'none' },
                '&.Mui-expanded': { margin: 0 }
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMore sx={{ color: 'rgba(76, 175, 80, 0.9)', fontSize: '2rem' }} />}
                sx={{
                  padding: '2rem 2.5rem',
                  '& .MuiAccordionSummary-content': {
                    alignItems: 'center',
                    gap: 1.5
                  }
                }}
              >
                <Lightbulb sx={{ color: 'rgba(76, 175, 80, 0.9)', fontSize: '2.5rem' }} />
                <Typography 
                  variant="h4"
                  sx={{ 
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '1.8rem',
                    color: 'rgba(76, 175, 80, 0.9)',
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
                          background: 'rgba(255, 255, 255, 0.7)',
                          color: 'var(--ink)',
                          fontWeight: 700,
                          minWidth: '40px',
                          height: '40px',
                          fontSize: '1rem'
                        }}
                      />
                      <Typography sx={{ color: 'var(--ink)', lineHeight: 1.9, flex: 1, fontSize: '1.05rem' }}>
                        {fact}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </AccordionDetails>
            </Accordion>
          </Box>
        </Fade>

        <Divider sx={{ my: 4, borderColor: 'rgba(76, 175, 80, 0.3)' }} />
        <Box sx={{ maxWidth: '900px', mx: 'auto' }}>
          <CommentsComponent pageId={teaType} />
        </Box>
      </Container>
    );
  }

  // Oolong Tea - Balanced, symmetrical grid
  if (teaType === 'oolong') {
    return (
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <Fade in={true} timeout={600}>
              <Card 
                sx={{ 
                  height: '100%',
                  background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
                  borderRadius: '20px', 
                  padding: '2.5rem',
                  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                  border: '1px solid rgba(255, 152, 0, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: '0 16px 50px rgba(0, 0, 0, 0.2)'
                  }
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                    <LocationOn sx={{ color: 'rgba(255, 152, 0, 0.9)', fontSize: '2.5rem' }} />
                    <Typography 
                      variant="h4"
                      sx={{ 
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '1.8rem',
                        color: 'rgba(255, 152, 0, 0.9)',
                        fontWeight: 700
                      }}
                    >
                      Origin
                    </Typography>
                  </Box>
                  <Typography sx={{ color: 'var(--ink)', lineHeight: 1.9, fontSize: '1.1rem' }}>
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
                  background: 'linear-gradient(135deg, #ffe0b2 0%, #fff3e0 100%)',
                  borderRadius: '20px', 
                  padding: '2.5rem',
                  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                  border: '1px solid rgba(255, 152, 0, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: '0 16px 50px rgba(0, 0, 0, 0.2)'
                  }
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                    <LocalFlorist sx={{ color: 'rgba(255, 152, 0, 0.9)', fontSize: '2.5rem' }} />
                    <Typography 
                      variant="h4"
                      sx={{ 
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '1.8rem',
                        color: 'rgba(255, 152, 0, 0.9)',
                        fontWeight: 700
                      }}
                    >
                      Flavor
                    </Typography>
                  </Box>
                  <Typography sx={{ color: 'var(--ink)', lineHeight: 1.9, fontSize: '1.1rem' }}>
                    {tea.flavorProfile}
                  </Typography>
                </CardContent>
              </Card>
            </Fade>
          </Grid>
        </Grid>

        <Fade in={true} timeout={1000}>
          <Box sx={{ mb: 3, maxWidth: '800px', mx: 'auto' }}>
            <Card 
              sx={{ 
                background: 'linear-gradient(145deg, #fff3e0, #ffe0b2)',
                borderRadius: '24px', 
                padding: '3rem',
                boxShadow: '0 16px 50px rgba(0, 0, 0, 0.18)',
                border: '1px solid rgba(255, 152, 0, 0.3)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.22)'
                }
              }}
            >
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <Build sx={{ color: 'rgba(255, 152, 0, 0.9)', fontSize: '2.5rem' }} />
                  <Typography 
                    variant="h3"
                    sx={{ 
                      fontFamily: "'Playfair Display', serif",
                      fontSize: '2rem',
                      color: 'rgba(255, 152, 0, 0.9)',
                      fontWeight: 700
                    }}
                  >
                    How It's Made
                  </Typography>
                </Box>
                <Typography sx={{ color: 'var(--ink)', lineHeight: 1.9, fontSize: '1.1rem' }}>
                  {tea.processing}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Fade>

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

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <Fade in={true} timeout={1200}>
              <Card 
                sx={{ 
                  height: '100%',
                  background: 'linear-gradient(135deg, #ffe0b2 0%, #fff3e0 100%)',
                  borderRadius: '20px', 
                  padding: '2.5rem',
                  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                  border: '1px solid rgba(255, 152, 0, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: '0 16px 50px rgba(0, 0, 0, 0.2)'
                  }
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                    <Favorite sx={{ color: 'rgba(255, 152, 0, 0.9)', fontSize: '2.5rem' }} />
                    <Typography 
                      variant="h4"
                      sx={{ 
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '1.8rem',
                        color: 'rgba(255, 152, 0, 0.9)',
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
                          background: 'rgba(255, 255, 255, 0.7)',
                          color: 'var(--ink)',
                          border: '1px solid rgba(255, 152, 0, 0.4)',
                          fontWeight: 500,
                          fontSize: '0.95rem',
                          padding: '0.5rem 0.75rem',
                          '&:hover': {
                            background: 'rgba(255, 152, 0, 0.2)',
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
                  background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
                  borderRadius: '20px', 
                  padding: '2.5rem',
                  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                  border: '1px solid rgba(255, 152, 0, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: '0 16px 50px rgba(0, 0, 0, 0.2)'
                  }
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                    <Coffee sx={{ color: 'rgba(255, 152, 0, 0.9)', fontSize: '2.5rem' }} />
                    <Typography 
                      variant="h4"
                      sx={{ 
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '1.8rem',
                        color: 'rgba(255, 152, 0, 0.9)',
                        fontWeight: 700
                      }}
                    >
                      Brewing
                    </Typography>
                  </Box>
                  <Typography sx={{ color: 'var(--ink)', lineHeight: 1.9, fontSize: '1rem' }}>
                    {tea.brewingTips}
                  </Typography>
                </CardContent>
              </Card>
            </Fade>
          </Grid>
        </Grid>

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

        <Fade in={true} timeout={1600}>
          <Box sx={{ mb: 3, maxWidth: '800px', mx: 'auto' }}>
            <Accordion 
              sx={{ 
                background: 'linear-gradient(145deg, #fff3e0, #ffe0b2)',
                borderRadius: '20px !important',
                border: '1px solid rgba(255, 152, 0, 0.3)',
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                '&:before': { display: 'none' },
                '&.Mui-expanded': { margin: 0 }
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMore sx={{ color: 'rgba(255, 152, 0, 0.9)', fontSize: '2rem' }} />}
                sx={{
                  padding: '2rem 2.5rem',
                  '& .MuiAccordionSummary-content': {
                    alignItems: 'center',
                    gap: 1.5
                  }
                }}
              >
                <Lightbulb sx={{ color: 'rgba(255, 152, 0, 0.9)', fontSize: '2.5rem' }} />
                <Typography 
                  variant="h4"
                  sx={{ 
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '1.8rem',
                    color: 'rgba(255, 152, 0, 0.9)',
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
                          background: 'rgba(255, 255, 255, 0.7)',
                          color: 'var(--ink)',
                          fontWeight: 700,
                          minWidth: '40px',
                          height: '40px',
                          fontSize: '1rem'
                        }}
                      />
                      <Typography sx={{ color: 'var(--ink)', lineHeight: 1.9, flex: 1, fontSize: '1.05rem' }}>
                        {fact}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </AccordionDetails>
            </Accordion>
          </Box>
        </Fade>

        <Divider sx={{ my: 4, borderColor: 'rgba(255, 152, 0, 0.3)' }} />
        <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
          <CommentsComponent pageId={teaType} />
        </Box>
      </Container>
    );
  }

  // Black Tea - Bold, full-width emphasis
  if (teaType === 'black') {
    return (
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        <Stack spacing={3} sx={{ mb: 3 }}>
          <Fade in={true} timeout={600}>
            <Card 
              sx={{ 
                background: 'linear-gradient(145deg, #3e2723 0%, #5d4037 100%)',
                borderRadius: '24px', 
                padding: '3.5rem',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                border: '2px solid rgba(121, 85, 72, 0.4)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 24px 70px rgba(0, 0, 0, 0.35)'
                }
              }}
            >
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                  <LocationOn sx={{ color: '#d7ccc8', fontSize: '2.5rem' }} />
                  <Typography 
                    variant="h3"
                    sx={{ 
                      fontFamily: "'Playfair Display', serif",
                      fontSize: '2.2rem',
                      color: '#d7ccc8',
                      fontWeight: 700
                    }}
                  >
                    Origin
                  </Typography>
                </Box>
                <Typography sx={{ color: '#efebe9', lineHeight: 1.9, fontSize: '1.15rem' }}>
                  {tea.origin}
                </Typography>
              </CardContent>
            </Card>
          </Fade>

          <Fade in={true} timeout={800}>
            <Card 
              sx={{ 
                background: 'linear-gradient(145deg, #5d4037 0%, #3e2723 100%)',
                borderRadius: '24px', 
                padding: '3.5rem',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                border: '2px solid rgba(121, 85, 72, 0.4)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 24px 70px rgba(0, 0, 0, 0.35)'
                }
              }}
            >
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                  <LocalFlorist sx={{ color: '#d7ccc8', fontSize: '2.5rem' }} />
                  <Typography 
                    variant="h3"
                    sx={{ 
                      fontFamily: "'Playfair Display', serif",
                      fontSize: '2.2rem',
                      color: '#d7ccc8',
                      fontWeight: 700
                    }}
                  >
                    Flavor Profile
                  </Typography>
                </Box>
                <Typography sx={{ color: '#efebe9', lineHeight: 1.9, fontSize: '1.15rem' }}>
                  {tea.flavorProfile}
                </Typography>
              </CardContent>
            </Card>
          </Fade>

          <Fade in={true} timeout={1000}>
            <Card 
              sx={{ 
                background: 'linear-gradient(145deg, #3e2723, #5d4037)',
                borderRadius: '24px', 
                padding: '3.5rem',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                border: '2px solid rgba(121, 85, 72, 0.4)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 24px 70px rgba(0, 0, 0, 0.35)'
                }
              }}
            >
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                  <Build sx={{ color: '#d7ccc8', fontSize: '2.5rem' }} />
                  <Typography 
                    variant="h3"
                    sx={{ 
                      fontFamily: "'Playfair Display', serif",
                      fontSize: '2.2rem',
                      color: '#d7ccc8',
                      fontWeight: 700
                    }}
                  >
                    How It's Made
                  </Typography>
                </Box>
                <Typography sx={{ color: '#efebe9', lineHeight: 1.9, fontSize: '1.15rem' }}>
                  {tea.processing}
                </Typography>
              </CardContent>
            </Card>
          </Fade>
        </Stack>

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

        <Stack spacing={3} sx={{ mb: 3, mt: 3 }}>
          <Fade in={true} timeout={1200}>
            <Card 
              sx={{ 
                background: 'linear-gradient(145deg, #5d4037 0%, #3e2723 100%)',
                borderRadius: '24px', 
                padding: '3.5rem',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                border: '2px solid rgba(121, 85, 72, 0.4)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 24px 70px rgba(0, 0, 0, 0.35)'
                }
              }}
            >
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                  <Favorite sx={{ color: '#d7ccc8', fontSize: '2.5rem' }} />
                  <Typography 
                    variant="h3"
                    sx={{ 
                      fontFamily: "'Playfair Display', serif",
                      fontSize: '2.2rem',
                      color: '#d7ccc8',
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
                        background: 'rgba(255, 255, 255, 0.15)',
                        color: '#efebe9',
                        border: '1px solid rgba(215, 204, 200, 0.3)',
                        fontWeight: 500,
                        fontSize: '1rem',
                        padding: '0.6rem 0.9rem',
                        '&:hover': {
                          background: 'rgba(255, 255, 255, 0.25)',
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

          <Fade in={true} timeout={1400}>
            <Card 
              sx={{ 
                background: 'linear-gradient(145deg, #3e2723 0%, #5d4037 100%)',
                borderRadius: '24px', 
                padding: '3.5rem',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                border: '2px solid rgba(121, 85, 72, 0.4)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 24px 70px rgba(0, 0, 0, 0.35)'
                }
              }}
            >
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                  <Coffee sx={{ color: '#d7ccc8', fontSize: '2.5rem' }} />
                  <Typography 
                    variant="h3"
                    sx={{ 
                      fontFamily: "'Playfair Display', serif",
                      fontSize: '2.2rem',
                      color: '#d7ccc8',
                      fontWeight: 700
                    }}
                  >
                    Brewing Tips
                  </Typography>
                </Box>
                <Typography sx={{ color: '#efebe9', lineHeight: 1.9, fontSize: '1.15rem' }}>
                  {tea.brewingTips}
                </Typography>
              </CardContent>
            </Card>
          </Fade>
        </Stack>

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

        <Fade in={true} timeout={1600}>
          <Box sx={{ mb: 3 }}>
            <Accordion 
              sx={{ 
                background: 'linear-gradient(145deg, #3e2723, #5d4037)',
                borderRadius: '24px !important',
                border: '2px solid rgba(121, 85, 72, 0.4)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                '&:before': { display: 'none' },
                '&.Mui-expanded': { margin: 0 }
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMore sx={{ color: '#d7ccc8', fontSize: '2rem' }} />}
                sx={{
                  padding: '2.5rem 3rem',
                  '& .MuiAccordionSummary-content': {
                    alignItems: 'center',
                    gap: 1.5
                  }
                }}
              >
                <Lightbulb sx={{ color: '#d7ccc8', fontSize: '2.5rem' }} />
                <Typography 
                  variant="h3"
                  sx={{ 
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '2rem',
                    color: '#d7ccc8',
                    fontWeight: 700
                  }}
                >
                  Fun Facts
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ padding: '0 3rem 2.5rem' }}>
                <Stack spacing={2}>
                  {tea.funFacts.map((fact, idx) => (
                    <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                      <Chip 
                        label={idx + 1}
                        sx={{
                          background: 'rgba(255, 255, 255, 0.15)',
                          color: '#efebe9',
                          fontWeight: 700,
                          minWidth: '40px',
                          height: '40px',
                          fontSize: '1rem'
                        }}
                      />
                      <Typography sx={{ color: '#efebe9', lineHeight: 1.9, flex: 1, fontSize: '1.1rem' }}>
                        {fact}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </AccordionDetails>
            </Accordion>
          </Box>
        </Fade>

        <Divider sx={{ my: 4, borderColor: 'rgba(121, 85, 72, 0.4)' }} />
        <Box sx={{ maxWidth: '900px', mx: 'auto' }}>
          <CommentsComponent pageId={teaType} />
        </Box>
      </Container>
    );
  }

  // Pu-erh Tea - Sophisticated, offset cards with elegant spacing
  if (teaType === 'pu-erh') {
    return (
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        <Grid container spacing={4} sx={{ mb: 4 }}>
          <Grid item xs={12} md={5}>
            <Fade in={true} timeout={600}>
              <Card 
                sx={{ 
                  height: '100%',
                  background: 'linear-gradient(135deg, #6d4c41 0%, #8d6e63 100%)',
                  borderRadius: '20px', 
                  padding: '2.5rem',
                  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.25)',
                  border: '2px solid rgba(141, 110, 99, 0.4)',
                  transition: 'all 0.3s ease',
                  ml: { xs: 0, md: 6 },
                  '&:hover': {
                    transform: 'translateY(-6px) translateX(-4px)',
                    boxShadow: '0 16px 50px rgba(0, 0, 0, 0.3)'
                  }
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                    <LocationOn sx={{ color: '#d7ccc8', fontSize: '2.5rem' }} />
                    <Typography 
                      variant="h4"
                      sx={{ 
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '1.8rem',
                        color: '#d7ccc8',
                        fontWeight: 700
                      }}
                    >
                      Origin
                    </Typography>
                  </Box>
                  <Typography sx={{ color: '#efebe9', lineHeight: 1.9, fontSize: '1.1rem' }}>
                    {tea.origin}
                  </Typography>
                </CardContent>
              </Card>
            </Fade>
          </Grid>
          <Grid item xs={12} md={7}>
            <Fade in={true} timeout={800}>
              <Card 
                sx={{ 
                  height: '100%',
                  background: 'linear-gradient(135deg, #8d6e63 0%, #6d4c41 100%)',
                  borderRadius: '20px', 
                  padding: '2.5rem',
                  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.25)',
                  border: '2px solid rgba(141, 110, 99, 0.4)',
                  transition: 'all 0.3s ease',
                  mr: { xs: 0, md: 6 },
                  '&:hover': {
                    transform: 'translateY(-6px) translateX(4px)',
                    boxShadow: '0 16px 50px rgba(0, 0, 0, 0.3)'
                  }
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                    <LocalFlorist sx={{ color: '#d7ccc8', fontSize: '2.5rem' }} />
                    <Typography 
                      variant="h4"
                      sx={{ 
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '1.8rem',
                        color: '#d7ccc8',
                        fontWeight: 700
                      }}
                    >
                      Flavor Profile
                    </Typography>
                  </Box>
                  <Typography sx={{ color: '#efebe9', lineHeight: 1.9, fontSize: '1.1rem' }}>
                    {tea.flavorProfile}
                  </Typography>
                </CardContent>
              </Card>
            </Fade>
          </Grid>
        </Grid>

        <Fade in={true} timeout={1000}>
          <Box sx={{ mb: 4, mr: { xs: 0, md: 8 } }}>
            <Card 
              sx={{ 
                background: 'linear-gradient(145deg, #6d4c41, #8d6e63)',
                borderRadius: '24px', 
                padding: '3.5rem',
                boxShadow: '0 16px 50px rgba(0, 0, 0, 0.25)',
                border: '2px solid rgba(141, 110, 99, 0.4)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateX(8px)',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
                }
              }}
            >
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                  <Build sx={{ color: '#d7ccc8', fontSize: '2.5rem' }} />
                  <Typography 
                    variant="h3"
                    sx={{ 
                      fontFamily: "'Playfair Display', serif",
                      fontSize: '2rem',
                      color: '#d7ccc8',
                      fontWeight: 700
                    }}
                  >
                    How It's Made
                  </Typography>
                </Box>
                <Typography sx={{ color: '#efebe9', lineHeight: 1.9, fontSize: '1.15rem' }}>
                  {tea.processing}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Fade>

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

        <Grid container spacing={4} sx={{ mb: 4, mt: 4 }}>
          <Grid item xs={12} md={7}>
            <Fade in={true} timeout={1200}>
              <Card 
                sx={{ 
                  height: '100%',
                  background: 'linear-gradient(135deg, #8d6e63 0%, #6d4c41 100%)',
                  borderRadius: '20px', 
                  padding: '2.5rem',
                  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.25)',
                  border: '2px solid rgba(141, 110, 99, 0.4)',
                  transition: 'all 0.3s ease',
                  ml: { xs: 0, md: 6 },
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: '0 16px 50px rgba(0, 0, 0, 0.3)'
                  }
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                    <Favorite sx={{ color: '#d7ccc8', fontSize: '2.5rem' }} />
                    <Typography 
                      variant="h4"
                      sx={{ 
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '1.8rem',
                        color: '#d7ccc8',
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
                          background: 'rgba(255, 255, 255, 0.15)',
                          color: '#efebe9',
                          border: '1px solid rgba(215, 204, 200, 0.3)',
                          fontWeight: 500,
                          fontSize: '0.95rem',
                          padding: '0.5rem 0.75rem',
                          '&:hover': {
                            background: 'rgba(255, 255, 255, 0.25)',
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
          <Grid item xs={12} md={5}>
            <Fade in={true} timeout={1400}>
              <Card 
                sx={{ 
                  height: '100%',
                  background: 'linear-gradient(135deg, #6d4c41 0%, #8d6e63 100%)',
                  borderRadius: '20px', 
                  padding: '2.5rem',
                  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.25)',
                  border: '2px solid rgba(141, 110, 99, 0.4)',
                  transition: 'all 0.3s ease',
                  mr: { xs: 0, md: 6 },
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: '0 16px 50px rgba(0, 0, 0, 0.3)'
                  }
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                    <Coffee sx={{ color: '#d7ccc8', fontSize: '2.5rem' }} />
                    <Typography 
                      variant="h4"
                      sx={{ 
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '1.6rem',
                        color: '#d7ccc8',
                        fontWeight: 700
                      }}
                    >
                      Brewing
                    </Typography>
                  </Box>
                  <Typography sx={{ color: '#efebe9', lineHeight: 1.9, fontSize: '1rem' }}>
                    {tea.brewingTips}
                  </Typography>
                </CardContent>
              </Card>
            </Fade>
          </Grid>
        </Grid>

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

        <Fade in={true} timeout={1600}>
          <Box sx={{ mb: 4, ml: { xs: 0, md: 8 } }}>
            <Accordion 
              sx={{ 
                background: 'linear-gradient(145deg, #6d4c41, #8d6e63)',
                borderRadius: '20px !important',
                border: '2px solid rgba(141, 110, 99, 0.4)',
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.25)',
                '&:before': { display: 'none' },
                '&.Mui-expanded': { margin: 0 }
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMore sx={{ color: '#d7ccc8', fontSize: '2rem' }} />}
                sx={{
                  padding: '2rem 2.5rem',
                  '& .MuiAccordionSummary-content': {
                    alignItems: 'center',
                    gap: 1.5
                  }
                }}
              >
                <Lightbulb sx={{ color: '#d7ccc8', fontSize: '2.5rem' }} />
                <Typography 
                  variant="h4"
                  sx={{ 
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '1.8rem',
                    color: '#d7ccc8',
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
                          background: 'rgba(255, 255, 255, 0.15)',
                          color: '#efebe9',
                          fontWeight: 700,
                          minWidth: '40px',
                          height: '40px',
                          fontSize: '1rem'
                        }}
                      />
                      <Typography sx={{ color: '#efebe9', lineHeight: 1.9, flex: 1, fontSize: '1.05rem' }}>
                        {fact}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </AccordionDetails>
            </Accordion>
          </Box>
        </Fade>

        <Divider sx={{ my: 4, borderColor: 'rgba(141, 110, 99, 0.4)' }} />
        <Box sx={{ maxWidth: '900px', mx: 'auto' }}>
          <CommentsComponent pageId={teaType} />
        </Box>
      </Container>
    );
  }

  // Default layout (fallback) - Use the existing dynamic grid layout
  return (
    <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Fade in={true} timeout={600}>
            <Card 
              sx={{ 
                height: '100%',
                background: 'linear-gradient(135deg, #f5e3c8 0%, #e9d1a9 100%)',
                borderRadius: '20px', 
                padding: '2.5rem',
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                border: '1px solid rgba(201, 165, 112, 0.2)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-6px)',
                  boxShadow: '0 16px 50px rgba(0, 0, 0, 0.2)'
                }
              }}
            >
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <LocationOn sx={{ color: 'rgba(201, 165, 112, 0.9)', fontSize: '2.5rem' }} />
                  <Typography 
                    variant="h4"
                    sx={{ 
                      fontFamily: "'Playfair Display', serif",
                      fontSize: '1.8rem',
                      color: 'rgba(201, 165, 112, 0.9)',
                      fontWeight: 700
                    }}
                  >
                    Origin
                  </Typography>
                </Box>
                <Typography sx={{ color: 'var(--ink)', lineHeight: 1.9, fontSize: '1.1rem' }}>
                  {tea.origin}
                </Typography>
              </CardContent>
            </Card>
          </Fade>
        </Grid>

        <Grid item xs={12} md={4}>
          <Fade in={true} timeout={800}>
            <Card 
              sx={{ 
                height: '100%',
                background: 'linear-gradient(135deg, #e9d1a9 0%, #f5e3c8 100%)',
                borderRadius: '20px', 
                padding: '2.5rem',
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                border: '1px solid rgba(201, 165, 112, 0.2)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-6px) rotate(1deg)',
                  boxShadow: '0 16px 50px rgba(0, 0, 0, 0.2)'
                }
              }}
            >
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <LocalFlorist sx={{ color: 'rgba(201, 165, 112, 0.9)', fontSize: '2.5rem' }} />
                  <Typography 
                    variant="h4"
                    sx={{ 
                      fontFamily: "'Playfair Display', serif",
                      fontSize: '1.6rem',
                      color: 'rgba(201, 165, 112, 0.9)',
                      fontWeight: 700
                    }}
                  >
                    Flavor
                  </Typography>
                </Box>
                <Typography sx={{ color: 'var(--ink)', lineHeight: 1.9, fontSize: '1rem' }}>
                  {tea.flavorProfile}
                </Typography>
              </CardContent>
            </Card>
          </Fade>
        </Grid>
      </Grid>

      <Fade in={true} timeout={1000}>
        <Box sx={{ mb: 3, ml: { xs: 0, md: 4 } }}>
          <Card 
            sx={{ 
              background: 'linear-gradient(145deg, #f5e3c8, #e9d1a9)',
              borderRadius: '24px', 
              padding: '3rem',
              boxShadow: '0 16px 50px rgba(0, 0, 0, 0.18)',
              border: '1px solid rgba(201, 165, 112, 0.2)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateX(8px)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.22)'
              }
            }}
          >
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Build sx={{ color: 'rgba(201, 165, 112, 0.9)', fontSize: '2.5rem' }} />
                <Typography 
                  variant="h3"
                  sx={{ 
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '2rem',
                    color: 'rgba(201, 165, 112, 0.9)',
                    fontWeight: 700
                  }}
                >
                  How It's Made
                </Typography>
              </Box>
              <Typography sx={{ color: 'var(--ink)', lineHeight: 1.9, fontSize: '1.1rem' }}>
                {tea.processing}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Fade>

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

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={7}>
          <Fade in={true} timeout={1200}>
            <Card 
              sx={{ 
                height: '100%',
                background: 'linear-gradient(135deg, #e9d1a9 0%, #f5e3c8 100%)',
                borderRadius: '20px', 
                padding: '2.5rem',
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                border: '1px solid rgba(201, 165, 112, 0.2)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-6px)',
                  boxShadow: '0 16px 50px rgba(0, 0, 0, 0.2)'
                }
              }}
            >
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                  <Favorite sx={{ color: 'rgba(201, 165, 112, 0.9)', fontSize: '2.5rem' }} />
                  <Typography 
                    variant="h4"
                    sx={{ 
                      fontFamily: "'Playfair Display', serif",
                      fontSize: '1.8rem',
                      color: 'rgba(201, 165, 112, 0.9)',
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
                        background: 'rgba(255, 255, 255, 0.6)',
                        color: 'var(--ink)',
                        border: '1px solid rgba(201, 165, 112, 0.3)',
                        fontWeight: 500,
                        fontSize: '0.95rem',
                        padding: '0.5rem 0.75rem',
                        '&:hover': {
                          background: 'rgba(201, 165, 112, 0.3)',
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

        <Grid item xs={12} md={5}>
          <Fade in={true} timeout={1400}>
            <Card 
              sx={{ 
                height: '100%',
                background: 'linear-gradient(135deg, #f5e3c8 0%, #e9d1a9 100%)',
                borderRadius: '20px', 
                padding: '2.5rem',
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                border: '1px solid rgba(201, 165, 112, 0.2)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-6px) rotate(-1deg)',
                  boxShadow: '0 16px 50px rgba(0, 0, 0, 0.2)'
                }
              }}
            >
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <Coffee sx={{ color: 'rgba(201, 165, 112, 0.9)', fontSize: '2.5rem' }} />
                  <Typography 
                    variant="h4"
                    sx={{ 
                      fontFamily: "'Playfair Display', serif",
                      fontSize: '1.6rem',
                      color: 'rgba(201, 165, 112, 0.9)',
                      fontWeight: 700
                    }}
                  >
                    Brewing
                  </Typography>
                </Box>
                <Typography sx={{ color: 'var(--ink)', lineHeight: 1.9, fontSize: '1rem' }}>
                  {tea.brewingTips}
                </Typography>
              </CardContent>
            </Card>
          </Fade>
        </Grid>
      </Grid>

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

      <Fade in={true} timeout={1600}>
        <Box sx={{ mb: 3, mr: { xs: 0, md: 4 } }}>
          <Accordion 
            sx={{ 
              background: 'linear-gradient(145deg, #f5e3c8, #e9d1a9)',
              borderRadius: '20px !important',
              border: '1px solid rgba(201, 165, 112, 0.2)',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
              '&:before': { display: 'none' },
              '&.Mui-expanded': { margin: 0 },
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 16px 50px rgba(0, 0, 0, 0.2)'
              }
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMore sx={{ color: 'rgba(201, 165, 112, 0.9)', fontSize: '2rem' }} />}
              sx={{
                padding: '2rem 2.5rem',
                '& .MuiAccordionSummary-content': {
                  alignItems: 'center',
                  gap: 1.5
                }
              }}
            >
              <Lightbulb sx={{ color: 'rgba(201, 165, 112, 0.9)', fontSize: '2.5rem' }} />
              <Typography 
                variant="h4"
                sx={{ 
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '1.8rem',
                  color: 'rgba(201, 165, 112, 0.9)',
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
                        background: 'rgba(255, 255, 255, 0.6)',
                        color: 'var(--ink)',
                        fontWeight: 700,
                        minWidth: '40px',
                        height: '40px',
                        fontSize: '1rem'
                      }}
                    />
                    <Typography sx={{ color: 'var(--ink)', lineHeight: 1.9, flex: 1, fontSize: '1.05rem' }}>
                      {fact}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </AccordionDetails>
          </Accordion>
        </Box>
      </Fade>

      <Divider sx={{ my: 4, borderColor: 'rgba(201, 165, 112, 0.3)' }} />
      <Box sx={{ maxWidth: '900px', mx: 'auto' }}>
        <CommentsComponent pageId={teaType} />
      </Box>
    </Container>
  );
}

