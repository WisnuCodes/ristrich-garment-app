import React from 'react';
import MuiButton from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  loading = false,
  startIcon = null,
  endIcon = null,
  className = '',
  onClick,
  ...props
}) {
  // Map variant to styling
  const customStyles = {
    primary: {
      backgroundColor: '#090d16',
      color: '#ffffff',
      border: '1px solid #090d16',
      '&:hover': {
        backgroundColor: '#1e293b',
        borderColor: '#1e293b',
      },
    },
    secondary: {
      backgroundColor: '#ffffff',
      color: '#0f172a',
      border: '1px solid #cbd5e1',
      '&:hover': {
        backgroundColor: '#f8fafc',
        borderColor: '#94a3b8',
      },
    },
    accent: {
      backgroundColor: '#d97706',
      color: '#ffffff',
      border: '1px solid #d97706',
      '&:hover': {
        backgroundColor: '#b45309',
        borderColor: '#b45309',
      },
    },
    danger: {
      backgroundColor: '#e11d48',
      color: '#ffffff',
      border: '1px solid #e11d48',
      '&:hover': {
        backgroundColor: '#be123c',
        borderColor: '#be123c',
      },
    },
    outline: {
      backgroundColor: 'transparent',
      color: '#0f2942',
      border: '1px solid #0f2942',
      '&:hover': {
        backgroundColor: '#f1f5f9',
      },
    },
    ghost: {
      backgroundColor: 'transparent',
      color: '#475569',
      border: '1px solid transparent',
      '&:hover': {
        backgroundColor: '#f1f5f9',
        color: '#0f172a',
      },
    },
  };

  const sizeProps = {
    sm: {
      fontSize: '0.75rem', // 12px
      padding: '4px 10px',
      height: '30px',
    },
    md: {
      fontSize: '0.8125rem', // 13px
      padding: '6px 14px',
      height: '36px',
    },
    lg: {
      fontSize: '0.875rem', // 14px
      padding: '8px 18px',
      height: '42px',
    },
  };

  const selectedSize = sizeProps[size] || sizeProps.md;
  const selectedStyle = customStyles[variant] || customStyles.primary;

  return (
    <MuiButton
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      startIcon={!loading ? startIcon : null}
      endIcon={!loading ? endIcon : null}
      disableElevation
      sx={{
        fontFamily: "'Poppins', sans-serif",
        textTransform: 'none',
        borderRadius: '6px',
        fontWeight: 600,
        letterSpacing: '-0.01em',
        transition: 'all 120ms ease-in-out',
        minWidth: 'auto',
        ...selectedSize,
        ...selectedStyle,
      }}
      className={className}
      {...props}
    >
      {loading ? (
        <span className="inline-flex items-center gap-1.5">
          <CircularProgress size={14} color="inherit" thickness={5} />
          <span className="text-2xs font-semibold">Tunggu...</span>
        </span>
      ) : (
        children
      )}
    </MuiButton>
  );
}

export default Button;
