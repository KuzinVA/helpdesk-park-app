import React from 'react';
import { TelegramUser } from '@/types/telegram';

interface TelegramUserInfoProps {
  user: TelegramUser;
  showDetails?: boolean;
  className?: string;
}

export const TelegramUserInfo: React.FC<TelegramUserInfoProps> = ({ 
  user, 
  showDetails = false, 
  className = '' 
}) => {
  const getInitials = (firstName: string, lastName?: string) => {
    if (lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
    return firstName.charAt(0).toUpperCase();
  };

  const getFullName = (firstName: string, lastName?: string) => {
    if (lastName) {
      return `${firstName} ${lastName}`;
    }
    return firstName;
  };

  return (
    <div className={`flex items-center ${className}`}>
      <div className="flex-shrink-0 mr-3">
        {user.photo_url ? (
          <img 
            src={user.photo_url} 
            alt={getFullName(user.first_name, user.last_name)}
            className="h-10 w-10 rounded-full border-2 border-blue-200 dark:border-blue-700"
          />
        ) : (
          <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-bold border-2 border-blue-200 dark:border-blue-700">
            {getInitials(user.first_name, user.last_name)}
          </div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
          {getFullName(user.first_name, user.last_name)}
        </p>
        
        {showDetails && (
          <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
            {user.username && (
              <p className="truncate">
                @{user.username}
              </p>
            )}
            {user.is_premium && (
              <div className="flex items-center">
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732L14.146 12.8 12.967 17.256a1 1 0 01-1.934 0L9.854 12.8 6.5 9.134a1 1 0 010-1.732L9.854 7.2 11.033 2.744A1 1 0 0112 2z" clipRule="evenodd" />
                  </svg>
                  Premium
                </span>
              </div>
            )}
            {user.language_code && (
              <p className="truncate">
                Язык: {user.language_code.toUpperCase()}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
