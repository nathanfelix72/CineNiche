import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './identity.css';
import '@fortawesome/fontawesome-free/css/all.css';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Pre-fill email if query parameter is present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailFromQuery = params.get('email');
    if (emailFromQuery) {
      setEmail(emailFromQuery);
    }
  }, [location]);

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
    if (name === 'confirmPassword') setConfirmPassword(value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Basic client-side checks (keep these)
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return; // Stop submission
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return; // Stop submission
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return; // Stop submission
    }

    // --- Modification starts here ---
    setError(''); // Clear previous errors before submitting

    fetch('https://localhost:5000/register', {
      // Ensure this URL matches your backend
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
        // MapIdentityApi might also accept 'confirmPassword', check its requirements if needed
      }),
    })
      .then(async (response) => {
        // Make the callback async to use await
        console.log('Registration Response Status:', response.status);

        if (response.ok) {
          // --- Success Case ---
          console.log('Registration successful');
          // Provide clearer success feedback, maybe navigate or disable form
          setError('Successful registration! Please proceed to login.');
          // Example: navigate('/login');
        } else {
          // --- Error Case ---
          let errorMsg = 'An unknown registration error occurred.'; // Default
          try {
            // Attempt to parse the JSON error response from the backend
            const errorData = await response.json();
            console.log('Registration Error Data:', errorData);

            // Extract specific error messages from the response body
            // MapIdentityApi often uses RFC 7807 problem details format
            if (
              errorData &&
              errorData.errors &&
              typeof errorData.errors === 'object'
            ) {
              // Flatten errors from potentially multiple fields into one list
              const messages = Object.values(errorData.errors).flat();
              if (messages.length > 0) {
                // Join messages, filtering potential duplicates if Identity sends them
                errorMsg = [...new Set(messages)].join(' ');
              } else if (errorData.title) {
                // Fallback to problem details title if no specific messages found
                errorMsg = errorData.title;
              }
            } else if (errorData && errorData.message) {
              // Handle simpler { message: "..." } responses if backend sends those
              errorMsg = errorData.message;
            } else {
              // Fallback if JSON parsing worked but structure is unexpected
              errorMsg = `Registration failed (Status: ${response.status}).`;
            }
          } catch (jsonError) {
            // Handle cases where the error response wasn't valid JSON
            console.error('Failed to parse error response JSON:', jsonError);
            errorMsg = `Registration failed with status ${response.status}. Unable to parse server response.`;
          }
          setError(errorMsg); // Set the specific error message
        }
      })
      .catch((networkError) => {
        // Handle network errors (server down, CORS, etc.)
        console.error('Network error during registration:', networkError);
        setError('Network error: Could not connect to the server.');
      });
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'url(/images/niche_movie.png)', // Set the image URL here
        backgroundSize: 'cover', // Ensures the image covers the entire background
        backgroundPosition: 'center', // Centers the image
        backgroundRepeat: 'no-repeat', // Prevents the image from repeating
        overflowY: 'auto',
        zIndex: 9999,
        display: 'flex', // Centers the card horizontally and vertically
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          backgroundColor: 'rgba(158, 86, 86, 0.69)',
          zIndex: 0,
        }}
      ></div>
      <div className="container">
        <div className="row justify-content-center">
          <div
            className="card border-0 shadow rounded-3"
            style={{
              maxWidth: '400px',
              width: '100%',
              backgroundImage:
                'radial-gradient(circle at 5% 90%, #d13e4a 0%, #f5e9d9 70%)',
            }}
          >
            {' '}
            {/* Adjust the width here */}
            <div className="card-body p-4 p-sm-5">
              <h5 className="card-title text-center mb-4 fs-2">Register</h5>
              <form onSubmit={handleSubmit}>
                <div className="form-floating mb-3">
                  <input
                    className="form-control"
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={handleChange}
                  />
                  <label htmlFor="email">Email address</label>
                </div>
                <div className="form-floating mb-3">
                  <input
                    className="form-control"
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={handleChange}
                  />
                  <label htmlFor="password">Password</label>
                </div>
                <div className="form-floating mb-3">
                  <input
                    className="form-control"
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={handleChange}
                  />
                  <label htmlFor="confirmPassword">Confirm Password</label>
                </div>

                <div className="d-grid mb-2">
                  <button
                    className="btn btn-google btn-login text-uppercase fw-bold text-white"
                    type="submit"
                  >
                    Register
                  </button>
                </div>
                <br />
                <div className="text-center mt-3">
                  <label
                    style={{
                      cursor: 'default',
                      color: '#f5e9d9',
                      fontFamily: 'serif',
                    }}
                  >
                    Already have an account?{' '}
                    <span
                      onClick={handleLoginClick}
                      style={{
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        transition: 'transform 0.2s ease',
                        display: 'inline-block',
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.transform = 'scale(1.1)')
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.transform = 'scale(1)')
                      }
                    >
                      Go to Login
                    </span>
                  </label>
                </div>
              </form>
              <strong>{error && <p className="error">{error}</p>}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
