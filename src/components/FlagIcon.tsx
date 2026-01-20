import React from 'react';

interface FlagIconProps {
  code: string;
  className?: string;
}

const flags: Record<string, React.ReactElement> = {
  pt: (
    <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <rect width="512" height="512" fill="#009c3b"/>
      <polygon points="256,64 480,256 256,448 32,256" fill="#ffdf00"/>
      <circle cx="256" cy="256" r="90" fill="#002776"/>
      <path d="M160,256 Q256,200 352,256" stroke="#fff" strokeWidth="12" fill="none"/>
    </svg>
  ),
  en: (
    <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <rect width="512" height="512" fill="#bf0a30"/>
      <g fill="#fff">
        <rect y="39.4" width="512" height="39.4"/>
        <rect y="118.2" width="512" height="39.4"/>
        <rect y="197" width="512" height="39.4"/>
        <rect y="275.8" width="512" height="39.4"/>
        <rect y="354.6" width="512" height="39.4"/>
        <rect y="433.4" width="512" height="39.4"/>
      </g>
      <rect width="256" height="275.8" fill="#002868"/>
      <g fill="#fff">
        {[...Array(9)].map((_, row) =>
          [...Array(row % 2 === 0 ? 6 : 5)].map((_, col) => (
            <circle
              key={`${row}-${col}`}
              cx={21.3 + col * 42.6 + (row % 2 === 0 ? 0 : 21.3)}
              cy={15.3 + row * 30.6}
              r="8"
            />
          ))
        )}
      </g>
    </svg>
  ),
  es: (
    <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <rect width="512" height="512" fill="#c60b1e"/>
      <rect y="128" width="512" height="256" fill="#ffc400"/>
    </svg>
  ),
};

export const FlagIcon: React.FC<FlagIconProps> = ({ code, className }) => {
  const flag = flags[code];

  if (!flag) return null;

  return (
    <span className={`flag-icon ${className || ''}`}>
      {flag}
    </span>
  );
};
