import React, { createContext, useContext, useState, useCallback } from 'react';
import { Cookies } from 'react-cookie-consent';

interface ConsentContextType {
  hasConsent: boolean;
  acceptConsent: () => void;
  declineConsent: () => void;
}

const ConsentContext = createContext<ConsentContextType | undefined>(undefined);

export const useConsent = (): ConsentContextType => {
  const context = useContext(ConsentContext);
  if (!context) {
    throw new Error('useConsent must be used within a ConsentProvider');
  }
  return context;
};

export const ConsentProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [hasConsent, setHasConsent] = useState(
    () => !!Cookies.get('userCookieConsent')
  );

  const acceptConsent = useCallback(() => {
    // Assuming CookieConsent component handles setting the actual cookie
    setHasConsent(true);
    console.log('Cookie consent accepted (via context).');
  }, []);

  const declineConsent = useCallback(() => {
    // Assuming CookieConsent component handles removing/ignoring cookie
    setHasConsent(false);
    console.log('Cookie consent declined (via context).');
  }, []);

  return (
    <ConsentContext.Provider
      value={{ hasConsent, acceptConsent, declineConsent }}
    >
      {children}
    </ConsentContext.Provider>
  );
};
