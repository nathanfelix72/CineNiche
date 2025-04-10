// components/RequireRole.tsx
import React, { useContext } from 'react';
import { UserContext } from './AuthorizeView'; // Adjust path as needed
import { Navigate } from 'react-router-dom';

interface RequireRoleProps {
  children: React.ReactNode;
  role: string; // The role required to access the children
  redirectTo?: string; // Optional path to redirect if role check fails
}

// REMOVE ": JSX.Element" from here:
function RequireRole({
  children,
  role,
  redirectTo = '/homepage',
}: RequireRoleProps) {
  const user = useContext(UserContext);

  if (!user || !user.roles || !user.roles.includes(role)) {
    console.warn(
      `Role check failed: User does not have required role "${role}". Redirecting to ${redirectTo}`
    );
    return <Navigate to={redirectTo} />;
  }

  // If role check passes, render the protected children
  return <>{children}</>;
}

export default RequireRole;
