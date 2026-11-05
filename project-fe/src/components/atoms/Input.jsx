import React, { forwardRef } from 'react';

export const Input = forwardRef(function Input(
  {
    label,
    error,
    helperText,
    startIcon,
    endIcon,
    className = '',
    id,
    type = 'text',
    required = false,
    ...props
  },
  ref
) {
  const inputId = id || props.name || Math.random().toString(36).substring(7);

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold text-slate-700 mb-1.5"
        >
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className="relative rounded-lg">
        {startIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            {startIcon}
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          required={required}
          className={`block w-full rounded-lg border text-sm transition-colors duration-150 py-2.5 px-3.5 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
            startIcon ? 'pl-10' : ''
          } ${endIcon ? 'pr-10' : ''} ${
            error
              ? 'border-rose-400 text-rose-900 focus:border-rose-500 focus:ring-rose-200'
              : 'border-slate-300 text-slate-900 focus:border-slate-800 focus:ring-slate-200 hover:border-slate-400'
          } ${className}`}
          {...props}
        />
        {endIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400">
            {endIcon}
          </div>
        )}
      </div>
      {error ? (
        <p className="mt-1.5 text-xs text-rose-600 font-medium">{error}</p>
      ) : helperText ? (
        <p className="mt-1.5 text-xs text-slate-500">{helperText}</p>
      ) : null}
    </div>
  );
});

export default Input;
