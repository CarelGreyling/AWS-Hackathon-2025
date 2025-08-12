// Main App component with complete user interaction handling

import React, { useState, useCallback, useRef } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  ThemeProvider,
  createTheme,
  CssBaseline
} from '@mui/material';
import AlertNameInput from './components/AlertNameInput';
import ImpactAnalysisDisplay from './components/ImpactAnalysisDisplay';
import { analyzeImpact } from './services/apiService';

// Create Material-UI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
    },
  },
});

function App() {
  const [alertName, setAlertName] = useState('');
  const [validationState, setValidationState] = useState({ isValid: false, errors: [] });
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Ref to prevent multiple simultaneous requests
  const analysisInProgress = useRef(false);

  // Handle alert name change
  const handleAlertNameChange = useCallback((value) => {
    setAlertName(value);
    // Clear previous results when input changes
    if (analysisData || error) {
      setAnalysisData(null);
      setError(null);
    }
  }, [analysisData, error]);

  // Handle validation state change
  const handleValidationChange = useCallback((validation) => {
    setValidationState(validation);
  }, []);

  // Handle impact analysis
  const handleAnalyze = useCallback(async () => {
    // Prevent multiple simultaneous requests
    if (analysisInProgress.current || loading) {
      return;
    }

    // Validate input
    if (!validationState.isValid || !alertName.trim()) {
      return;
    }

    analysisInProgress.current = true;
    setLoading(true);
    setError(null);
    setAnalysisData(null);
    
    try {
      const result = await analyzeImpact({
        alertName: alertName.trim(),
        userId: 'user-123', // Mock user ID
        accountId: 'account-456', // Mock account ID
        timestamp: new Date().toISOString()
      });
      
      if (result.success && result.data && result.data.impactAnalysis) {
        setAnalysisData(result.data.impactAnalysis);
      } else {
        setError('Invalid response format received');
      }
    } catch (err) {
      console.error('Impact analysis error:', err);
      setError(err.message || 'Failed to analyze impact');
      setAnalysisData(null);
    } finally {
      setLoading(false);
      analysisInProgress.current = false;
    }
  }, [validationState.isValid, alertName, loading]);

  // Handle keyboard events
  const handleKeyPress = useCallback((event) => {
    if (event.key === 'Enter' && canAnalyze && !loading) {
      event.preventDefault();
      handleAnalyze();
    }
  }, [handleAnalyze, loading]);

  // Determine if analysis can be performed
  const canAnalyze = validationState.isValid && alertName.trim().length >= 3;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom 
            align="center"
            role="heading"
            aria-level={1}
          >
            Parameter Risk Analysis
          </Typography>
          
          <Typography 
            variant="body1" 
            color="text.secondary" 
            paragraph 
            align="center"
          >
            Enter an alert name to analyze the potential customer impact of configuration changes.
          </Typography>

          <Box sx={{ mb: 4 }} onKeyPress={handleKeyPress}>
            <Typography variant="h6" gutterBottom>
              Alert Name
            </Typography>
            <AlertNameInput
              value={alertName}
              onChange={handleAlertNameChange}
              onValidationChange={handleValidationChange}
              placeholder="Enter a descriptive name for your alert (e.g., 'High CPU Usage Alert')"
              disabled={loading}
            />
          </Box>

          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleAnalyze}
              disabled={!canAnalyze || loading}
              sx={{ minWidth: 200 }}
              role="button"
              aria-label={loading ? 'Analyzing impact' : 'Analyze Impact'}
            >
              {loading ? 'Analyzing...' : 'Analyze Impact'}
            </Button>
          </Box>

          <ImpactAnalysisDisplay
            data={analysisData}
            loading={loading}
            error={error}
          />
        </Paper>
      </Container>
    </ThemeProvider>
  );
}

export default App;
