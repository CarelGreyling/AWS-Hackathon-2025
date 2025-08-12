// ImpactAnalysisDisplay React component - Implementation to make tests pass (TDD GREEN phase)

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  LinearProgress,
  Divider
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';

// Risk level configurations
const RISK_CONFIGS = {
  LOW: {
    color: 'success',
    icon: CheckCircleIcon,
    className: 'risk-low',
    bgColor: '#e8f5e8'
  },
  MEDIUM: {
    color: 'warning',
    icon: WarningIcon,
    className: 'risk-medium',
    bgColor: '#fff3e0'
  },
  HIGH: {
    color: 'error',
    icon: ErrorIcon,
    className: 'risk-high',
    bgColor: '#ffebee'
  },
  CRITICAL: {
    color: 'error',
    icon: CancelIcon,
    className: 'risk-critical',
    bgColor: '#ffcdd2'
  }
};

const ImpactAnalysisDisplay = ({
  data,
  loading = false,
  error = null
}) => {
  const [expandedSections, setExpandedSections] = useState({
    criticalServices: false,
    dependentAlerts: false
  });

  // Handle section expansion
  const handleSectionToggle = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Format number with commas
  const formatNumber = (num) => {
    return num?.toLocaleString() || '0';
  };

  // Get confidence score styling
  const getConfidenceClass = (score) => {
    if (score >= 0.8) return 'confidence-high';
    if (score >= 0.6) return 'confidence-medium';
    return 'confidence-low';
  };

  // Render loading state
  if (loading) {
    return (
      <Box 
        data-testid="impact-analysis-loading"
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          p: 4 
        }}
      >
        <CircularProgress size={40} />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Analyzing potential customer impact...
        </Typography>
      </Box>
    );
  }

  // Render error state
  if (error) {
    return (
      <Alert 
        severity="error" 
        data-testid="impact-analysis-error"
        sx={{ mt: 2 }}
      >
        {error}
      </Alert>
    );
  }

  // Don't render if no data
  if (!data) {
    return null;
  }

  const {
    customersAffected = 0,
    criticalServices = [],
    dependentAlerts = [],
    estimatedDowntime = 'Unknown',
    riskLevel = 'LOW',
    confidenceScore = 0,
    recommendations = []
  } = data;

  const riskConfig = RISK_CONFIGS[riskLevel] || RISK_CONFIGS.LOW;
  const RiskIcon = riskConfig.icon;

  return (
    <Card 
      data-testid="impact-analysis-results"
      aria-label="Impact analysis results"
      sx={{ mt: 3 }}
    >
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          Impact Analysis
        </Typography>

        {/* Customer Impact Summary */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            ⚠️ {formatNumber(customersAffected)} customers may be affected
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Chip
              data-testid="risk-level-badge"
              aria-label={`Risk level: ${riskLevel}`}
              label={riskLevel}
              color={riskConfig.color}
              className={riskConfig.className}
              icon={<RiskIcon />}
              sx={{ 
                fontWeight: 'bold',
                backgroundColor: riskConfig.bgColor
              }}
            />
            
            <Typography variant="body2" color="text.secondary">
              Estimated downtime: {estimatedDowntime}
            </Typography>
            
            <Typography 
              variant="body2" 
              data-testid="confidence-score"
              className={getConfidenceClass(confidenceScore)}
              sx={{ 
                fontWeight: 'bold',
                color: confidenceScore >= 0.8 ? 'success.main' : 
                       confidenceScore >= 0.6 ? 'warning.main' : 'error.main'
              }}
            >
              {Math.round(confidenceScore * 100)}% confidence
            </Typography>
          </Box>

          <LinearProgress 
            variant="determinate" 
            value={confidenceScore * 100}
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Critical Services Section */}
        <Box data-testid="critical-services-section" sx={{ mb: 2 }}>
          <Accordion 
            expanded={expandedSections.criticalServices}
            onChange={() => handleSectionToggle('criticalServices')}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              data-testid="expand-critical-services"
              tabIndex={0}
            >
              <Typography variant="h6">
                {criticalServices.length > 0 
                  ? `Critical Services (${criticalServices.length})`
                  : 'No critical services affected'
                }
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {criticalServices.length > 0 ? (
                <List dense>
                  {criticalServices.map((service, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={service} />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography color="text.secondary">
                  No critical services affected
                </Typography>
              )}
            </AccordionDetails>
          </Accordion>
        </Box>

        {/* Dependent Alerts Section */}
        <Box data-testid="dependent-alerts-section" sx={{ mb: 2 }}>
          <Accordion 
            expanded={expandedSections.dependentAlerts}
            onChange={() => handleSectionToggle('dependentAlerts')}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">
                {dependentAlerts.length > 0 
                  ? `Dependent Alerts (${dependentAlerts.length})`
                  : 'No dependent alerts'
                }
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {dependentAlerts.length > 0 ? (
                <List dense>
                  {dependentAlerts.map((alert, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={alert} />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography color="text.secondary">
                  No dependent alerts
                </Typography>
              )}
            </AccordionDetails>
          </Accordion>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Recommendations Section */}
        <Box data-testid="recommendations-panel">
          <Typography variant="h6" component="h3" gutterBottom>
            Recommendations
          </Typography>
          
          {recommendations.length > 0 ? (
            <List data-testid="recommendations-list" dense>
              {recommendations.map((recommendation, index) => {
                const isCritical = recommendation.includes('DO NOT PROCEED');
                return (
                  <ListItem key={index} role="listitem">
                    <ListItemText 
                      primary={recommendation}
                      className={isCritical ? 'recommendation-critical' : ''}
                      sx={{
                        '& .MuiListItemText-primary': {
                          color: isCritical ? 'error.main' : 'text.primary',
                          fontWeight: isCritical ? 'bold' : 'normal'
                        }
                      }}
                    />
                  </ListItem>
                );
              })}
            </List>
          ) : (
            <Typography color="text.secondary">
              No specific recommendations available
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ImpactAnalysisDisplay;
