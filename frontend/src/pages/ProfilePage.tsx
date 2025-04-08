import { useEffect, useState } from 'react';
import { MoviesUser } from '../types/MoviesUser';
import { MoviesTitle } from '../types/MoviesTitle'; // Import MoviesTitle interface
import { fetchUser, fetchUserRatings, updateUser } from '../api/MoviesAPI'; // Import the API functions

interface ProfilePageProps {
  userId: number;
}

const ProfilePage = ({ userId }: ProfilePageProps) => {
  const [user, setUser] = useState<MoviesUser | null>(null);
  const [userRatedMovies, setUserRatedMovies] = useState<
    { movie: MoviesTitle; rating: number }[] // Store both movie and rating
  >([]);
  // State for rated movies
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    // Fetch user data
    fetchUser(userId)
      .then((data) => {
        setUser(data);
      })
      .catch((err) => console.error('Failed to fetch user', err));

    // Fetch rated movies for the user
    fetchUserRatings(userId)
      .then((data) => {
        console.log(data); // Log the data for debugging
        setUserRatedMovies(data);
      })
      .catch((err) => console.error('Failed to fetch user rated movies', err));
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const handleSave = () => {
    if (user) {
      // Save updated user data
      updateUser(userId, user)
        .then(() => setEditing(false))
        .catch((err) => console.error('Update failed', err));
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-4 bg-black text-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">User Profile</h2>

      {['name', 'phone', 'email', 'age', 'gender', 'city', 'state', 'zip'].map(
        (field) => (
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
        )
      )}

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
      <ul>
        {userRatedMovies.length > 0 ? (
          userRatedMovies.map((item, index) =>
            // Ensure item.movie is not undefined and has a title
            item.movie && item.movie.title ? (
              <li key={index} className="mb-2">
                <strong>{item.movie.title}</strong>: {item.rating} stars
              </li>
            ) : (
              <li key={index} className="mb-2">
                Movie data is unavailable
              </li>
            )
          )
        ) : (
          <li>No rated movies found.</li>
        )}
      </ul>
    </div>
  );
};

export default ProfilePage;
