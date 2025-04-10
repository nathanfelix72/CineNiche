import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthorizeView, { AuthorizedUser } from '../components/AuthorizeView';
import Logout from '../components/Logout';
import styles from './HomePage.module.css';
import { getMovieImage } from '../utils/imageHelpers';

//  read recommender API URL from .env
const RECOMMENDER_API = import.meta.env.VITE_RECOMMENDER_API;

const HomePage = () => {
  const [recs, setRecs] = useState<{
    [key: string]: { id: number; title: string }[];
  }>({});
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch current user info
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

  // Fetch user recommendations from your recommender API
  useEffect(() => {
    if (!userId || !RECOMMENDER_API) return;

    const fetchRecs = async () => {
      try {
        const res = await fetch(
          `${RECOMMENDER_API}/user-recs?user_id=${userId}`
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

  const handleNavigateToAdminMovies = () => {
    navigate('/adminmovies');
  };

  return (
    <AuthorizeView>
      <div className={styles.homePage}>
        <Logout>
          Logout <AuthorizedUser value="email" />
        </Logout>
        <br />
        <h1>Welcome {userName ? userName : userEmail}!</h1>

        <button onClick={handleNavigateToAdminMovies}>
          Go to Admin Movies Page
        </button>

        {Object.entries(recs).map(([section, movies]) => (
          <div key={section} className={styles.carouselSection}>
            <h2>{section}</h2>
            <div className={styles.carousel}>
              {movies.map((movie) => (
                <div key={movie.id} className={styles.carouselItem}>
                  <Link to={`/movie/${movie.id}`}>
                    <img
                      src={getMovieImage(movie.title)}
                      alt={movie.title}
                      style={{
                        width: '120px',
                        height: '180px',
                        objectFit: 'cover',
                        borderRadius: '6px',
                        display: 'block',
                        marginBottom: '0.5rem',
                      }}
                    />
                    <div style={{ textAlign: 'center' }}>{movie.title}</div>
                  </Link>
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
