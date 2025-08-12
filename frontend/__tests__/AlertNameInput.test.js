// AlertNameInput component tests - These should FAIL initially (TDD RED phase)

const { render, screen, fireEvent, waitFor } = require('@testing-library/react');
const userEvent = require('@testing-library/user-event');

// Import component - this will fail initially as component doesn't exist yet
let AlertNameInput;
try {
  AlertNameInput = require('../src/components/AlertNameInput').default;
} catch (error) {
  // Expected to fail in RED phase
  AlertNameInput = null;
}

describe('AlertNameInput Component', () => {
  const defaultProps = {
    value: '',
    onChange: jest.fn(),
    onValidationChange: jest.fn(),
    placeholder: 'Enter a descriptive name for your alert'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    test('should render input field with placeholder', () => {
      if (!AlertNameInput) {
        throw new Error('AlertNameInput component not available - expected in RED phase');
      }

      render(<AlertNameInput {...defaultProps} />);
      
      const input = screen.getByPlaceholderText('Enter a descriptive name for your alert');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('type', 'text');
    });

    test('should render with correct initial value', () => {
      if (!AlertNameInput) {
        throw new Error('AlertNameInput component not available - expected in RED phase');
      }

      render(<AlertNameInput {...defaultProps} value="Test Alert" />);
      
      const input = screen.getByDisplayValue('Test Alert');
      expect(input).toBeInTheDocument();
    });

    test('should render character counter', () => {
      if (!AlertNameInput) {
        throw new Error('AlertNameInput component not available - expected in RED phase');
      }

      render(<AlertNameInput {...defaultProps} value="Test Alert" />);
      
      const counter = screen.getByText(/\d+\/255/);
      expect(counter).toBeInTheDocument();
    });

    test('should have proper data-testid attributes', () => {
      if (!AlertNameInput) {
        throw new Error('AlertNameInput component not available - expected in RED phase');
      }

      render(<AlertNameInput {...defaultProps} />);
      
      expect(screen.getByTestId('alert-name-input')).toBeInTheDocument();
      expect(screen.getByTestId('character-counter')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    test('should call onChange when user types', async () => {
      if (!AlertNameInput) {
        throw new Error('AlertNameInput component not available - expected in RED phase');
      }

      const user = userEvent.setup();
      const mockOnChange = jest.fn();
      
      render(<AlertNameInput {...defaultProps} onChange={mockOnChange} />);
      
      const input = screen.getByTestId('alert-name-input');
      await user.type(input, 'Test');
      
      expect(mockOnChange).toHaveBeenCalledTimes(4); // One call per character
      expect(mockOnChange).toHaveBeenLastCalledWith('Test');
    });

    test('should update character counter as user types', async () => {
      if (!AlertNameInput) {
        throw new Error('AlertNameInput component not available - expected in RED phase');
      }

      const user = userEvent.setup();
      
      render(<AlertNameInput {...defaultProps} value="Test Alert" />);
      
      expect(screen.getByText('10/255')).toBeInTheDocument();
    });

    test('should handle backspace and deletion', async () => {
      if (!AlertNameInput) {
        throw new Error('AlertNameInput component not available - expected in RED phase');
      }

      const user = userEvent.setup();
      const mockOnChange = jest.fn();
      
      render(<AlertNameInput {...defaultProps} value="Test" onChange={mockOnChange} />);
      
      const input = screen.getByTestId('alert-name-input');
      await user.clear(input);
      
      expect(mockOnChange).toHaveBeenCalledWith('');
    });
  });

  describe('Validation Display', () => {
    test('should show validation error for too short input', () => {
      if (!AlertNameInput) {
        throw new Error('AlertNameInput component not available - expected in RED phase');
      }

      render(<AlertNameInput {...defaultProps} value="Al" />);
      
      const errorMessage = screen.getByTestId('alert-name-error');
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveTextContent('Alert name must be at least 3 characters long');
    });

    test('should show validation error for too long input', () => {
      if (!AlertNameInput) {
        throw new Error('AlertNameInput component not available - expected in RED phase');
      }

      const longName = 'A'.repeat(256);
      render(<AlertNameInput {...defaultProps} value={longName} />);
      
      const errorMessage = screen.getByTestId('alert-name-error');
      expect(errorMessage).toHaveTextContent('Alert name cannot exceed 255 characters');
    });

    test('should show validation error for invalid characters', () => {
      if (!AlertNameInput) {
        throw new Error('AlertNameInput component not available - expected in RED phase');
      }

      render(<AlertNameInput {...defaultProps} value="Alert@Name!" />);
      
      const errorMessage = screen.getByTestId('alert-name-error');
      expect(errorMessage).toHaveTextContent('Alert name contains invalid characters');
    });

    test('should show validation error for reserved names', () => {
      if (!AlertNameInput) {
        throw new Error('AlertNameInput component not available - expected in RED phase');
      }

      render(<AlertNameInput {...defaultProps} value="default" />);
      
      const errorMessage = screen.getByTestId('alert-name-error');
      expect(errorMessage).toHaveTextContent('This name is reserved');
    });

    test('should not show error for valid input', () => {
      if (!AlertNameInput) {
        throw new Error('AlertNameInput component not available - expected in RED phase');
      }

      render(<AlertNameInput {...defaultProps} value="Valid Alert Name" />);
      
      expect(screen.queryByTestId('alert-name-error')).not.toBeInTheDocument();
    });

    test('should call onValidationChange with validation status', async () => {
      if (!AlertNameInput) {
        throw new Error('AlertNameInput component not available - expected in RED phase');
      }

      const mockOnValidationChange = jest.fn();
      
      render(<AlertNameInput {...defaultProps} value="Valid Alert" onValidationChange={mockOnValidationChange} />);
      
      expect(mockOnValidationChange).toHaveBeenCalledWith({
        isValid: true,
        errors: []
      });
    });
  });

  describe('Styling and States', () => {
    test('should apply error styling when validation fails', () => {
      if (!AlertNameInput) {
        throw new Error('AlertNameInput component not available - expected in RED phase');
      }

      render(<AlertNameInput {...defaultProps} value="Al" />);
      
      const input = screen.getByTestId('alert-name-input');
      expect(input).toHaveClass('error');
    });

    test('should apply success styling when validation passes', () => {
      if (!AlertNameInput) {
        throw new Error('AlertNameInput component not available - expected in RED phase');
      }

      render(<AlertNameInput {...defaultProps} value="Valid Alert Name" />);
      
      const input = screen.getByTestId('alert-name-input');
      expect(input).toHaveClass('valid');
    });

    test('should show character counter in warning color when approaching limit', () => {
      if (!AlertNameInput) {
        throw new Error('AlertNameInput component not available - expected in RED phase');
      }

      const nearLimitName = 'A'.repeat(240);
      render(<AlertNameInput {...defaultProps} value={nearLimitName} />);
      
      const counter = screen.getByTestId('character-counter');
      expect(counter).toHaveClass('warning');
    });

    test('should show character counter in error color when over limit', () => {
      if (!AlertNameInput) {
        throw new Error('AlertNameInput component not available - expected in RED phase');
      }

      const overLimitName = 'A'.repeat(260);
      render(<AlertNameInput {...defaultProps} value={overLimitName} />);
      
      const counter = screen.getByTestId('character-counter');
      expect(counter).toHaveClass('error');
    });
  });

  describe('Accessibility', () => {
    test('should have proper ARIA attributes', () => {
      if (!AlertNameInput) {
        throw new Error('AlertNameInput component not available - expected in RED phase');
      }

      render(<AlertNameInput {...defaultProps} value="Al" />);
      
      const input = screen.getByTestId('alert-name-input');
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input).toHaveAttribute('aria-describedby');
    });

    test('should associate error message with input', () => {
      if (!AlertNameInput) {
        throw new Error('AlertNameInput component not available - expected in RED phase');
      }

      render(<AlertNameInput {...defaultProps} value="Al" />);
      
      const input = screen.getByTestId('alert-name-input');
      const errorMessage = screen.getByTestId('alert-name-error');
      
      expect(input.getAttribute('aria-describedby')).toContain(errorMessage.id);
    });

    test('should be keyboard accessible', async () => {
      if (!AlertNameInput) {
        throw new Error('AlertNameInput component not available - expected in RED phase');
      }

      const user = userEvent.setup();
      
      render(<AlertNameInput {...defaultProps} />);
      
      const input = screen.getByTestId('alert-name-input');
      await user.tab();
      
      expect(input).toHaveFocus();
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty string input', () => {
      if (!AlertNameInput) {
        throw new Error('AlertNameInput component not available - expected in RED phase');
      }

      render(<AlertNameInput {...defaultProps} value="" />);
      
      const counter = screen.getByText('0/255');
      expect(counter).toBeInTheDocument();
    });

    test('should handle null/undefined value gracefully', () => {
      if (!AlertNameInput) {
        throw new Error('AlertNameInput component not available - expected in RED phase');
      }

      render(<AlertNameInput {...defaultProps} value={null} />);
      
      const input = screen.getByTestId('alert-name-input');
      expect(input.value).toBe('');
    });

    test('should handle special characters in validation', () => {
      if (!AlertNameInput) {
        throw new Error('AlertNameInput component not available - expected in RED phase');
      }

      const specialChars = ['@', '#', '$', '%', '^', '&', '*', '(', ')', '+', '='];
      
      specialChars.forEach(char => {
        const { rerender } = render(<AlertNameInput {...defaultProps} value={`Test${char}Alert`} />);
        
        expect(screen.getByTestId('alert-name-error')).toBeInTheDocument();
        
        rerender(<AlertNameInput {...defaultProps} value="" />);
      });
    });
  });
});

// These tests should ALL FAIL initially since we haven't implemented the component yet
// This is the expected behavior in the TDD RED phase
