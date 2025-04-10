// components/AuthorizeView.tsx
import React, { useState, useEffect, createContext, useContext } from 'react'; // Added useContext
import { Navigate, useLocation } from 'react-router-dom'; // Import useLocation

// --- Define User interface (ensure this matches your actual user object) ---
interface User {
  email: string;
  roles: string[];
}

export const UserContext = createContext<User | null>(null);

// Props definition might vary, ensure children is included
interface AuthorizeViewProps {
  children: React.ReactNode;
}

function AuthorizeView({ children }: AuthorizeViewProps) {
  // Destructure props
  const [authorized, setAuthorized] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const emptyuser: User = { email: '', roles: [] };
  const [user, setUser] = useState<User>(emptyuser);

  const location = useLocation(); // <-- Get current location

  useEffect(() => {
    console.log('AuthorizeView useEffect running'); // Debug log
    async function fetchWithRetry(url: string, options: RequestInit) {
      // Use RequestInit type
      // ... (rest of your fetchWithRetry logic remains the same) ...
      // Make sure setAuthorized, setUser, setLoading are called correctly
      try {
        const response = await fetch(url, options);
        // ... handle response, check content type ...
        if (!response.ok) {
          // If response is 401 or 403, definitely not authorized
          if (response.status === 401 || response.status === 403) {
            console.log('Auth check failed with status:', response.status);
            setAuthorized(false);
            setUser(emptyuser);
            setLoading(false);
            return; // Stop processing on clear auth failure
          }
          // Handle other non-ok statuses if needed
          throw new Error(`Auth check HTTP error! Status: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Invalid response format from server');
        }
        const data = await response.json();

        if (data.userName && Array.isArray(data.roles)) {
          setUser({ email: data.userName, roles: data.roles });
          setAuthorized(true);
        } else {
          console.error(
            'Auth check failed: Missing userName or roles array',
            data
          );
          setAuthorized(false); // Ensure unauthorized if data is invalid
          setUser(emptyuser);
        }
      } catch (error) {
        console.error('Authorization fetch failed:', error);
        setAuthorized(false);
        setUser(emptyuser);
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
    // Optional: check location here too if you want to avoid showing loading on /login
    // if (location.pathname === '/login') return <>{children}</>;
    return <p>Loading Authentication...</p>; // Or a spinner
  }

  if (authorized) {
    // Provide the user context ONLY when authorized
    return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
  }

  // --- Redirect Logic ---
  // If NOT authorized AND we are NOT already on the /login page...
  if (location.pathname !== '/login') {
    console.log(
      `AuthorizeView: Not authorized, redirecting from ${location.pathname} to /login`
    );
    // Redirect to login, passing the current location to redirect back later
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If NOT authorized BUT we ARE ALREADY on /login, render children
  // (which should include the LoginPage). No context is provided here.
  console.log(
    'AuthorizeView: Not authorized, but already on /login. Rendering children (no context).'
  );
  return <>{children}</>;
}

// --- AuthorizedUser component (export if needed) ---
export function AuthorizedUser(props: { value: keyof User }) {
  // Use keyof User
  const user = useContext(UserContext);
  if (!user) return null;
  // Check if props.value is a valid key before accessing
  return props.value in user ? <>{user[props.value]}</> : null;
}

export default AuthorizeView;
