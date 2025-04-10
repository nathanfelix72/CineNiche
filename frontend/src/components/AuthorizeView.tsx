import React, { useState, useEffect, createContext } from 'react';
import { Navigate } from 'react-router-dom';

// --- Define User interface to include roles ---
interface User {
  email: string;
  roles: string[]; // Add roles array
}

// --- Create Context with the updated User type ---
// (Context creation itself doesn't change, but the type it holds does)
export const UserContext = createContext<User | null>(null);

function AuthorizeView(props: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // --- Initialize user state with empty roles ---
  const emptyuser: User = { email: '', roles: [] };
  const [user, setUser] = useState<User>(emptyuser); // Use User type here

  useEffect(() => {
    async function fetchWithRetry(url: string, options: any) {
      try {
        const response = await fetch(url, options);
        const contentType = response.headers.get('content-type');

        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Invalid response format from server');
        }
        const data = await response.json();

        // --- Check for userName AND roles ---
        if (data.userName && Array.isArray(data.roles)) {
          // --- Set user state including roles ---
          setUser({ email: data.userName, roles: data.roles });
          setAuthorized(true);
        } else {
          // Could log which part was missing (userName or roles)
          console.error(
            'Auth check failed: Missing userName or roles array in response',
            data
          );
          throw new Error('Invalid user session data');
        }
      } catch (error) {
        // Log the actual error if needed
        console.error('Authorization fetch failed:', error);
        setAuthorized(false);
        setUser(emptyuser); // Reset user on error
      } finally {
        setLoading(false);
      }
    }

    fetchWithRetry(
      'https://cineniche-backend-eshedfdkc8c4amft.westus2-01.azurewebsites.net/pingauth',
      {
        method: 'GET',
        credentials: 'include',
      }
    );
  }, []);

  if (loading) {
    return <p>Loading...</p>; // Or a spinner component
  }

  if (authorized) {
    // Provide the full user object (with roles) to the context
    return (
      <UserContext.Provider value={user}>{props.children}</UserContext.Provider>
    );
  }

  // Redirect to login if not authorized
  return <Navigate to="/login" />;
}

// --- AuthorizedUser component can stay the same for now ---
export function AuthorizedUser(props: { value: string }) {
  const user = React.useContext(UserContext);
  if (!user) return null;
  return props.value === 'email' ? <>{user.email}</> : null;
}

// --- Export the context along with the component ---
// export { UserContext }; // Export context if needed directly elsewhere (optional)
export default AuthorizeView;
