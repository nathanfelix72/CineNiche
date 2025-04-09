import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './identity.css';
import '@fortawesome/fontawesome-free/css/all.css';

function LoginPage() {
  // state variables for email and passwords
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rememberme, setRememberme] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  // state variable for error messages
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  // handle change events for input fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    if (type === 'checkbox') {
      setRememberme(checked);
    } else if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  // handle submit event for the form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(''); // Clear any previous errors

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    const loginUrl = rememberme
      ? 'https://cineniche-backend-eshedfdkc8c4amft.westus2-01.azurewebsites.net/login?useCookies=true'
      : 'https://cineniche-backend-eshedfdkc8c4amft.westus2-01.azurewebsites.net/login?useSessionCookies=true';

    try {
      const response = await fetch(loginUrl, {
        method: 'POST',
        credentials: 'include', // Ensures cookies are sent & received
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }), // email and password from form
      });

      // Ensure we only parse JSON if there is content
      let data = null;
      const contentLength = response.headers.get('content-length');
      if (contentLength && parseInt(contentLength, 10) > 0) {
        data = await response.json();
      }

      if (!response.ok) {
        throw new Error(data?.message || 'Invalid email or password.');
      }

      navigate('/');
    } catch (error: any) {
      setError(error.message || 'Error logging in.');
      console.error('Fetch attempt failed:', error);
    }
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
      <div className="container">
        <div className="row justify-content-center">
          <div
            className="card border-0 shadow rounded-3"
            style={{ maxWidth: '400px', width: '100%' }}
          >
            {' '}
            {/* Adjust the width here */}
            <div className="card-body p-4 p-sm-5">
              <h5 className="card-title text-center mb-5 fs-2">Sign In</h5>
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
                <div className="form-floating mb-3 position-relative">
                  <input
                    className="form-control"
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={password}
                    onChange={handleChange}
                  />
                  <label htmlFor="password">Password</label>
                  <i
                    className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      right: '1rem',
                      transform: 'translateY(-50%)',
                      cursor: 'pointer',
                      zIndex: 2,
                    }}
                  ></i>
                </div>

                <div className="d-flex align-items-center mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="rememberme"
                    name="rememberme"
                    checked={rememberme}
                    onChange={handleChange}
                    style={{ marginRight: '0.4rem' }} // optional fine-tuning
                  />
                  <label className="form-check-label mb-0" htmlFor="rememberme">
                    Remember me
                  </label>
                </div>

                <div className="d-grid mb-2">
                  <button
                    className="btn btn-primary btn-login text-uppercase fw-bold"
                    type="submit"
                  >
                    Sign in
                  </button>
                </div>
                <div className="d-grid mb-2">
                  <button
                    className="btn btn-primary btn-login text-uppercase fw-bold"
                    onClick={handleRegisterClick}
                  >
                    Register
                  </button>
                </div>
                <hr className="my-4" />
                <div className="d-grid mb-2">
                  <button
                    className="btn btn-google btn-login text-uppercase fw-bold text-white"
                    type="button"
                  >
                    <i className="fa-brands fa-google me-2"></i> Sign in with
                    Google
                  </button>
                </div>
              </form>
              {error && <p className="error">{error}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
