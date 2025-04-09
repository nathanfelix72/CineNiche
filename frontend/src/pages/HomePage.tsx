import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import AuthorizeView, { AuthorizedUser } from '../components/AuthorizeView';
import Logout from '../components/Logout';
import styles from './HomePage.module.css';

const HomePage = () => {
  const [recs, setRecs] = useState<{
    [key: string]: { id: number; title: string }[];
  }>({});
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const navigate = useNavigate(); // Initialize the navigate hook

  // Step 1: Fetch current user info (email, userId, and name)
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await fetch(
          'https://cineniche-backend-eshedfdkc8c4amft.westus2-01.azurewebsites.net/user/current',
          {
            credentials: 'include',
          }
        );
        const data = await res.json();
        setUserEmail(data.email);
        setUserId(data.userId);
        setUserName(data.name);
      } catch (error) {
        console.error('Error fetching current user info:', error);
      }
    };

    fetchUserInfo();
  }, []);

  // Step 2: Fetch user recommendations
  useEffect(() => {
    if (!userId) return;

    const fetchRecs = async () => {
      try {
        const res = await fetch(
          `https://localhost:5000/api/recommendations/user?userId=${userId}`,
          { credentials: 'include' }
        );

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`HTTP ${res.status}: ${errorText}`);
        }

        const data = await res.json();
        console.log('Fetched recommendations:', JSON.stringify(data, null, 2));
        setRecs(data);
      } catch (err) {
        console.error('Error fetching user recommendations:', err);
      }
    };

    fetchRecs();
  }, [userId]);

  console.log('Rendering recs:', recs);

  // Navigate to the Admin Movies page
  const handleNavigateToAdminMovies = () => {
    navigate('/adminmovies'); // Navigate to the admin movies page
  };

  return (
    <AuthorizeView>
      <div className={styles.homePage}>
        <Logout>
          Logout <AuthorizedUser value="email" />
        </Logout>
        <br />
        <h1>Welcome {userName ? userName : userEmail}!</h1>

        {/* Add the button to navigate to the admin movies page */}
        <button onClick={handleNavigateToAdminMovies}>
          Go to Admin Movies Page
        </button>

        {Object.entries(recs).map(([section, movies]) => (
          <div key={section} className={styles.carouselSection}>
            <h2>{section}</h2>
            <div className={styles.carousel}>
              {movies.map((movie) => (
                <div key={movie.id} className={styles.carouselItem}>
                  <Link to={`/movie/${movie.id}`}>{movie.title}</Link>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </AuthorizeView>
  );
};

export default HomePage;
