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
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
    } else if (password !== confirmPassword) {
      setError('Passwords do not match.');
    } else {
      setError('');
      fetch('https://localhost:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      })
        .then((data) => {
          console.log(data);
          if (data.ok) setError('Successful registration. Please log in.');
          else setError('Error registering.');
        })
        .catch((error) => {
          console.error(error);
          setError('Error registering.');
        });
    }
  };

  return (
    <div style={{ 
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
      alignItems: 'center'
    }}>
    <div className="container">
      <div className="row justify-content-center">
        <div className="card border-0 shadow rounded-3" style={{ maxWidth: '400px', width: '100%' }}>  {/* Adjust the width here */}
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
                <button className="btn btn-primary btn-login text-uppercase fw-bold" type="submit">
                  Register
                </button>
              </div>
              <br />
              <div className="text-center mt-3">
                <label style={{ cursor: 'default', color: '#d4145a', fontFamily: 'serif' }}>
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
