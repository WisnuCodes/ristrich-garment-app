import React from 'react';

export function Typography({
  variant = 'body',
  as,
  children,
  className = '',
  ...props
}) {
  const variants = {
    h1: { tag: 'h1', style: 'text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight font-display' },
    h2: { tag: 'h2', style: 'text-2xl md:text-3xl font-bold tracking-tight text-slate-900 leading-snug font-display' },
    h3: { tag: 'h3', style: 'text-lg md:text-xl font-bold text-slate-900 leading-normal' },
    h4: { tag: 'h4', style: 'text-base font-semibold text-slate-900' },
    lead: { tag: 'p', style: 'text-lg text-slate-600 leading-relaxed' },
    body: { tag: 'p', style: 'text-sm text-slate-600 leading-relaxed' },
    small: { tag: 'span', style: 'text-xs text-slate-500' },
    caption: { tag: 'span', style: 'text-2xs font-medium uppercase tracking-wider text-slate-400' },
  };

  const selected = variants[variant] || variants.body;
  const Component = as || selected.tag;

  return (
    <Component className={`${selected.style} ${className}`} {...props}>
      {children}
    </Component>
  );
}

export default Typography;
