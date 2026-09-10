import React from 'react';

export const TechIcon: React.FC<{ name: string; className?: string }> = ({ name, className = 'w-5 h-5' }) => {
  switch (name.toLowerCase()) {
    case 'python':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.9 2C6.8 2 7.1 4.2 7.1 4.2L7.2 6.5H12V7.2H5.1C5.1 7.2 2 6.8 2 12C2 17.2 4.7 17 4.7 17H6.3V14.6C6.3 14.6 6.1 11.8 9 11.8H13.7C13.7 11.8 16.3 11.8 16.3 9.2V4.5C16.3 4.5 16.7 2 11.9 2ZM9.5 3.6C10.1 3.6 10.6 4.1 10.6 4.7C10.6 5.3 10.1 5.8 9.5 5.8C8.9 5.8 8.4 5.3 8.4 4.7C8.4 4.1 8.9 3.6 9.5 3.6Z" fill="#092A4A" />
          <path d="M12.1 22C17.2 22 16.9 19.8 16.9 19.8L16.8 17.5H12V16.8H18.9C18.9 16.8 22 17.2 22 12C22 6.8 19.3 7 19.3 7H17.7V9.4C17.7 9.4 17.9 12.2 15 12.2H10.3C10.3 12.2 7.7 12.2 7.7 14.8V19.5C7.7 19.5 7.3 22 12.1 22ZM14.5 20.4C13.9 20.4 13.4 19.9 13.4 19.3C13.4 18.7 13.9 18.2 14.5 18.2C15.1 18.2 15.6 18.7 15.6 19.3C15.6 19.9 15.1 20.4 14.5 20.4Z" fill="#D7A93D" />
        </svg>
      );
    case 'javascript':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="3" fill="#D7A93D" />
          <path d="M7 18.5V11H9.2V15.7C9.2 17.1 8.2 17.6 7 17.6M12.5 18.5C13.8 18.5 15.2 17.8 15.2 16.1C15.2 14.2 13.8 13.7 12.8 13.2C11.9 12.8 11.4 12.4 11.4 11.9C11.4 11.4 11.9 11 12.6 11C13.4 11 14 11.4 14.3 12L15.8 11C15.2 9.8 14.1 9.4 12.6 9.4C10.8 9.4 9.6 10.5 9.6 12C9.6 13.8 10.9 14.4 12 14.8C12.9 15.2 13.4 15.6 13.4 16.3C13.4 17 12.8 17.3 12 17.3C11 17.3 10.2 16.7 9.8 15.9L8.3 17C9 18.1 10.5 18.5 12.5 18.5Z" fill="#092A4A" stroke="#092A4A" strokeWidth="0.5" />
        </svg>
      );
    case 'react':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="12" cy="12" rx="10" ry="4.2" stroke="#092A4A" strokeWidth="1.6" transform="rotate(30 12 12)" />
          <ellipse cx="12" cy="12" rx="10" ry="4.2" stroke="#092A4A" strokeWidth="1.6" transform="rotate(90 12 12)" />
          <ellipse cx="12" cy="12" rx="10" ry="4.2" stroke="#092A4A" strokeWidth="1.6" transform="rotate(150 12 12)" />
          <circle cx="12" cy="12" r="2.2" fill="#092A4A" />
        </svg>
      );
    case 'nodejs':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L21 7.2V17.5L12 22.7L3 17.5V7.2L12 2Z" stroke="#3DA66B" strokeWidth="1.8" fill="#3DA66B" fillOpacity="0.1" />
          <path d="M12 7V17M7 9.5L17 15M17 9.5L7 15" stroke="#092A4A" strokeWidth="1.5" />
        </svg>
      );
    case 'postgresql':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 3C8 3 5 5.5 5 9C5 12.5 7 14.5 9 15.5V20H15V15.5C17 14.5 19 12.5 19 9C19 5.5 16 3 12 3Z" stroke="#092A4A" strokeWidth="1.6" fill="#092A4A" fillOpacity="0.1" />
          <circle cx="9" cy="8.5" r="1" fill="#092A4A" />
          <circle cx="15" cy="8.5" r="1" fill="#092A4A" />
          <path d="M10 12C11 13 13 13 14 12" stroke="#092A4A" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case 'mongodb':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C12 2 6 7.5 6 13C6 16.5 8.5 20.5 12 22C15.5 20.5 18 16.5 18 13C18 7.5 12 2 12 2Z" fill="#3DA66B" fillOpacity="0.2" stroke="#3DA66B" strokeWidth="1.6" />
          <path d="M12 3V21" stroke="#092A4A" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );
    case 'docker':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 13C3.5 13 4.5 14 6 14C7.5 14 8.5 13 10 13C11.5 13 12.5 14 14 14C15.5 14 16.5 13 18 13C19.5 13 20.5 13.5 22 14.5C21.5 18 18 20.5 12 20.5C5.5 20.5 2.5 17 2 13Z" fill="#092A4A" />
          <rect x="5" y="9" width="2.5" height="2.5" fill="#123F68" />
          <rect x="8.5" y="9" width="2.5" height="2.5" fill="#123F68" />
          <rect x="12" y="9" width="2.5" height="2.5" fill="#123F68" />
          <rect x="8.5" y="5.5" width="2.5" height="2.5" fill="#123F68" />
          <rect x="12" y="5.5" width="2.5" height="2.5" fill="#123F68" />
          <circle cx="19" cy="12" r="0.8" fill="currentColor" />
        </svg>
      );
    case 'aws':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 15C8 18 16 18 20 15" stroke="#D7A93D" strokeWidth="2" strokeLinecap="round" />
          <path d="M18.5 13.5L20.5 15.5L17.5 16.5" stroke="#D7A93D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <text x="5" y="11" fill="#092A4A" fontFamily="Space Grotesk, sans-serif" fontWeight="bold" fontSize="7.5">
            aws
          </text>
        </svg>
      );
    case 'brain':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#092A4A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
          <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
          <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
          <path d="M17.599 6.5a3 3 0 0 0 .399-1.375" />
          <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5" />
          <path d="M3.477 10.896a4 4 0 0 1 .585-.396" />
          <path d="M19.938 10.5a4 4 0 0 1 .585.396" />
          <path d="M6 18a4 4 0 0 1-1.967-.516" />
          <path d="M19.967 17.484A4 4 0 0 1 18 18" />
        </svg>
      );
    case 'security':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#092A4A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      );
    case 'tools':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#092A4A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      );
    default:
      return null;
  }
};
