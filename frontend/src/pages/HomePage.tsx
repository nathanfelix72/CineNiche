import { useEffect, useState } from 'react';
import AuthorizeView, { AuthorizedUser } from '../components/AuthorizeView';
import Logout from '../components/Logout';
import './HomePage.css';

const HomePage = () => {
  const [recs, setRecs] = useState<{ [key: string]: string[] }>({});
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  // ✅ Step 1: Fetch logged-in user's email
  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const res = await fetch('https://localhost:5000/pingauth', {
          credentials: 'include',
        });
        const data = await res.json();
        setUserEmail(data.email);
      } catch (error) {
        console.error('Error fetching user email:', error);
      }
    };

    fetchUserEmail();
  }, []);

  // ✅ Step 2: Fetch user ID by email
  useEffect(() => {
    if (!userEmail) return;

    const fetchUserId = async () => {
      try {
        console.log('Fetching user ID for:', userEmail);
        const res = await fetch(
          `https://localhost:5000/api/users/by-email?email=${encodeURIComponent(userEmail)}`,
          {
            credentials: 'include',
          }
        );
        const data = await res.json();
        console.log('User ID fetch result:', data);
        setUserId(data.userId);
      } catch (error) {
        console.error('Error fetching user ID:', error);
      }
    };

    fetchUserId();
  }, [userEmail]);

  // ✅ Step 3: Fetch user recommendations
  useEffect(() => {
    if (!userId) return;

    const fetchRecs = async () => {
      try {
        const res = await fetch(
          `https://localhost:5000/api/recommendations/user?userId=${userId}`,
          {
            credentials: 'include',
          }
        );
        const data = await res.json();
        setRecs(data);
      } catch (err) {
        console.error('Error fetching user recommendations:', err);
      }
    };

    fetchRecs();
  }, [userId]);

  return (
    <AuthorizeView>
      <div className="home-page">
        <Logout>
          Logout <AuthorizedUser value="email" />
        </Logout>
        <br />
        <h1>Welcome to CineNiche 🎬</h1>

        {Object.entries(recs).map(([section, movies]) => (
          <div key={section} className="carousel-section">
            <h2>{section}</h2>
            <div className="carousel">
              {movies.map((title, index) => (
                <div key={index} className="carousel-item">
                  <a href={`/movie/${encodeURIComponent(title)}`}>{title}</a>
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
