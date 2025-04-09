import { useEffect, useState } from 'react';
import { MoviesUser } from '../types/MoviesUser';
import { MoviesTitle } from '../types/MoviesTitle';
import {
  fetchUser,
  fetchUserRatings,
  updateUser,
  fetchCurrentUser,
} from '../api/MoviesAPI'; // Add fetchCurrentUser here
import AuthorizeView from '../components/AuthorizeView';

interface RatedMovie {
  movie: {
    title: string;
  };
  rating: number;
}

interface AggregatedMovie {
  title: string;
  ratingSum: number;
  ratingCount: number;
}

const ProfilePage = () => {
  const [user, setUser] = useState<MoviesUser | null>(null);
  const [userRatedMovies, setUserRatedMovies] = useState<
    { movie: MoviesTitle; rating: number }[]
  >([]);
  const [editing, setEditing] = useState(false);
  const [userId, setUserId] = useState<number | null>(null); // Store userId here

  // You might want to move these hooks inside a child component
  // that only renders *after* AuthorizeView confirms authentication,
  // or ensure they handle auth errors gracefully. For now, let's
  // focus on the structure.

  useEffect(() => {
    fetchCurrentUser()
      .then((data) => {
        setUserId(data.userId);
      })
      .catch((err) => console.error('Failed to get current user ID', err));
  }, []);

  useEffect(() => {
    if (!userId) return;
    fetchUser(userId)
      .then((data) => {
        setUser(data);
      })
      .catch((err) => console.error('Failed to fetch user', err));

    fetchUserRatings()
      .then((data) => setUserRatedMovies(data))
      .catch((err) => console.error('Failed to fetch user rated movies', err));
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // ... same as before
    const { name, value } = e.target;
    setUser((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const handleSave = () => {
    // ... same as before
    if (user && user.userId) {
      updateUser(user.userId, user) // Pass user.userId to the update function
        .then(() => setEditing(false))
        .catch((err) => console.error('Update failed', err));
    }
  };

  // Wrap the *entire output* in AuthorizeView
  return (
    <AuthorizeView>
      {/* Conditionally render based on 'user' state *inside* the authorized view */}
      {!user ? (
        <div>Loading profile data...</div> // Show profile-specific loading only if authorized but data isn't ready
      ) : (
        // The actual profile content, rendered only if authorized AND user data is loaded
        <div className="max-w-2xl mx-auto p-4 bg-black text-white shadow-md rounded-md">
          <h2 className="text-2xl font-bold mb-4">User Profile</h2>
          {/* ... rest of your form and rated movies list ... */}
          {[
            'name',
            'phone',
            'email',
            'age',
            'gender',
            'city',
            'state',
            'zip',
          ].map((field) => (
            <div className="mb-3" key={field}>
              <label className="block text-sm font-medium">
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                name={field}
                value={user[field as keyof MoviesUser] || ''}
                onChange={handleChange}
                disabled={!editing}
                className="w-full border border-gray-300 rounded p-2"
              />
            </div>
          ))}

          {editing ? (
            <div className="mt-4 flex gap-2">
              <button
                onClick={handleSave}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Save
              </button>
              <button
                onClick={() => setEditing(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
            >
              Edit Profile
            </button>
          )}

          {/* Display Rated Movies */}
          <h3 className="text-xl font-bold mt-6">Rated Movies:</h3>
          {/* ... rated movies list ... */}
          <ul>
            {userRatedMovies.length > 0 ? (
              userRatedMovies
                .reduce((acc: AggregatedMovie[], item: RatedMovie) => {
                  const movie = acc.find((m) => m.title === item.movie.title);
                  if (movie) {
                    movie.ratingSum += item.rating;
                    movie.ratingCount += 1;
                  } else {
                    acc.push({
                      title: item.movie.title,
                      ratingSum: item.rating,
                      ratingCount: 1,
                    });
                  }
                  return acc;
                }, [])
                .map((movie, index) => (
                  <li key={index} className="mb-2">
                    <strong>{movie.title}</strong>:{' '}
                    {(movie.ratingSum / movie.ratingCount).toFixed(1)} stars
                  </li>
                ))
            ) : (
              <li>No rated movies found.</li>
            )}
          </ul>
        </div>
      )}
    </AuthorizeView>
  );
};

export default ProfilePage;
