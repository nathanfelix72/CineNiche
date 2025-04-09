import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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

  // Step 1: Fetch current user info (email, userId, and name)
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await fetch('https://localhost:5000/User/current', {
          credentials: 'include',
        });
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
  
  return (
    <AuthorizeView>
      <div className={styles.homePage}>
        <Logout>
          Logout <AuthorizedUser value="email" />
        </Logout>
        <br />
        <h1>Welcome {userName ? userName : userEmail}!</h1>

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
