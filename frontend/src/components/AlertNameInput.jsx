// AlertNameInput React component - Implementation to make tests pass (TDD GREEN phase)

import React, { useState, useEffect, useCallback } from 'react';
import {
  TextField,
  FormHelperText,
  Box,
  Typography,
  InputAdornment
} from '@mui/material';
import { Warning as WarningIcon } from '@mui/icons-material';

// Reserved names that cannot be used for alerts
const RESERVED_NAMES = ['default', 'system', 'admin', 'root', 'null', 'undefined'];

// Validation rules
const MIN_LENGTH = 3;
const MAX_LENGTH = 255;
const VALID_PATTERN = /^[a-zA-Z0-9][a-zA-Z0-9\-_\s]*$/;

const AlertNameInput = ({
  value = '',
  onChange,
  onValidationChange,
  placeholder = 'Enter a descriptive name for your alert',
  disabled = false,
  ...props
}) => {
  const [validationState, setValidationState] = useState({
    isValid: true,
    errors: []
  });

  // Validate alert name
  const validateAlertName = useCallback((name) => {
    const errors = [];
    const trimmedName = (name || '').trim();

    if (!trimmedName) {
      return { isValid: true, errors: [] }; // Empty is valid (not required here)
    }

    // Length validation
    if (trimmedName.length < MIN_LENGTH) {
      errors.push('Alert name must be at least 3 characters long');
    }

    if (trimmedName.length > MAX_LENGTH) {
      errors.push('Alert name cannot exceed 255 characters');
    }

    // Character validation
    if (!VALID_PATTERN.test(trimmedName)) {
      errors.push('Alert name contains invalid characters. Use only letters, numbers, hyphens, underscores, and spaces');
    }

    // Reserved names validation
    if (RESERVED_NAMES.includes(trimmedName.toLowerCase())) {
      errors.push('This name is reserved. Please choose a different name');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }, []);

  // Update validation state when value changes
  useEffect(() => {
    const validation = validateAlertName(value);
    setValidationState(validation);
    
    if (onValidationChange) {
      onValidationChange(validation);
    }
  }, [value, validateAlertName, onValidationChange]);

  // Handle input change
  const handleChange = (event) => {
    const newValue = event.target.value;
    if (onChange) {
      onChange(newValue);
    }
  };

  // Get character counter styling
  const getCounterClass = () => {
    const length = (value || '').length;
    if (length > MAX_LENGTH) return 'error';
    if (length > MAX_LENGTH - 15) return 'warning';
    return 'normal';
  };

  // Get input styling classes
  const getInputClass = () => {
    if (!value || value.trim() === '') return '';
    return validationState.isValid ? 'valid' : 'error';
  };

  const characterCount = (value || '').length;
  const hasError = !validationState.isValid && value && value.trim() !== '';

  return (
    <Box sx={{ width: '100%' }}>
      <TextField
        fullWidth
        value={value || ''}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        error={hasError}
        inputProps={{
          'data-testid': 'alert-name-input',
          'aria-invalid': hasError,
          'aria-describedby': hasError ? 'alert-name-error' : undefined,
          maxLength: MAX_LENGTH + 50, // Allow typing beyond limit to show error
        }}
        className={getInputClass()}
        InputProps={{
          endAdornment: hasError && (
            <InputAdornment position="end">
              <WarningIcon color="error" />
            </InputAdornment>
          ),
        }}
        {...props}
      />
      
      {/* Character Counter */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mt: 1 
      }}>
        <Box>
          {hasError && (
            <FormHelperText 
              error 
              id="alert-name-error"
              data-testid="alert-name-error"
            >
              {validationState.errors[0]}
            </FormHelperText>
          )}
        </Box>
        
        <Typography
          variant="caption"
          data-testid="character-counter"
          className={getCounterClass()}
          sx={{
            color: getCounterClass() === 'error' ? 'error.main' : 
                   getCounterClass() === 'warning' ? 'warning.main' : 
                   'text.secondary'
          }}
        >
          {characterCount}/{MAX_LENGTH}
        </Typography>
      </Box>
    </Box>
  );
};

export default AlertNameInput;
