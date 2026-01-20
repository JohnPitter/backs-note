import { useState, useRef, useEffect } from 'react';

interface PinInputProps {
  value: string;
  onChange: (pin: string) => void;
  maxLength?: number;
  placeholder?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  error?: boolean;
}

export const PinInput: React.FC<PinInputProps> = ({
  value,
  onChange,
  maxLength = 6,
  placeholder = 'PIN',
  disabled = false,
  autoFocus = false,
  error = false
}) => {
  const [showPin, setShowPin] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/\D/g, '').slice(0, maxLength);
    onChange(newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow: backspace, delete, tab, escape, enter
    if (
      [8, 46, 9, 27, 13].includes(e.keyCode) ||
      // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
      (e.keyCode >= 65 && e.keyCode <= 90 && (e.ctrlKey || e.metaKey)) ||
      // Allow: home, end, left, right, down, up
      (e.keyCode >= 35 && e.keyCode <= 40)
    ) {
      return;
    }
    // Block non-numeric keys
    if ((e.shiftKey || e.keyCode < 48 || e.keyCode > 57) &&
        (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
    }
  };

  const toggleShowPin = () => {
    setShowPin(!showPin);
  };

  return (
    <div className={`pin-input-container ${error ? 'pin-input-error' : ''}`}>
      <input
        ref={inputRef}
        type={showPin ? 'text' : 'password'}
        className="pin-input"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        inputMode="numeric"
        pattern="[0-9]*"
        autoComplete="off"
        aria-label={placeholder}
      />
      <button
        type="button"
        className="pin-toggle-btn"
        onClick={toggleShowPin}
        disabled={disabled}
        aria-label={showPin ? 'Ocultar PIN' : 'Mostrar PIN'}
      >
        {showPin ? '🙈' : '👁️'}
      </button>
    </div>
  );
};
