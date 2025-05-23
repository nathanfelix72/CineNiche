import { MoviesTitle } from '../types/MoviesTitle';
import { MoviesUser } from '../types/MoviesUser';

interface FetchMoviesResponse {
  movies: MoviesTitle[];
  totalNumMovies: number;
}

//const API_URL = 'https://localhost:5000/movie';
//const USER_API_URL = 'https://localhost:5000/user';
//const ROLE_URL = 'https://localhost:5000/Role';
const API_URL =
  'https://cineniche-backend-eshedfdkc8c4amft.westus2-01.azurewebsites.net/Movie';
const USER_API_URL =
  'https://cineniche-backend-eshedfdkc8c4amft.westus2-01.azurewebsites.net/User';
const ROLE_URL =
  'https://cineniche-backend-eshedfdkc8c4amft.westus2-01.azurewebsites.net/Role';

const RECOMMENDER_API = import.meta.env.VITE_RECOMMENDER_API;

export const fetchMovies = async (
  pageSize: number,
  pageNum: number,
  selectedCategories: string[],
  searchQuery: string = '' // Add searchQuery as a parameter
): Promise<FetchMoviesResponse> => {
  try {
    const categoryParams = selectedCategories
      .map((cat) => `movieTypes=${encodeURIComponent(cat)}`)
      .join('&');

    const query = searchQuery
      ? `&searchQuery=${encodeURIComponent(searchQuery)}`
      : '';
    const response = await fetch(
      `${API_URL}/AllMovies?pageSize=${pageSize}&pageNum=${pageNum}${selectedCategories.length ? `&${categoryParams}` : ''}${query}`,
      {
        credentials: 'include',
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch movies');
    }

    const rawData = await response.json();

    // Flatten the movie/avgStarRating structure
    const flattenedMovies: MoviesTitle[] = rawData.movies.map(
      (item: { movie: MoviesTitle; avgStarRating: number }) => ({
        ...item.movie,
        avgStarRating: item.avgStarRating,
      })
    );

    return {
      movies: flattenedMovies,
      totalNumMovies: rawData.totalNumMovies,
    };
  } catch (error) {
    console.error('Error fetching movies: ', error);
    throw error;
  }
};

export const addMovie = async (newMovie: MoviesTitle): Promise<MoviesTitle> => {
  try {
    const response = await fetch(`${API_URL}/AddMovie`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newMovie),
    });

    if (!response.ok) {
      throw new Error('Failed to add movie');
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding movie', error);
    throw error;
  }
};

export const updateMovie = async (
  showId: number,
  updatedMovie: MoviesTitle
): Promise<MoviesTitle> => {
  try {
    const response = await fetch(`${API_URL}/UpdateMovie/${showId}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedMovie),
    });

    return await response.json();
  } catch (error) {
    console.error('Error updated movie:', error);
    throw error;
  }
};

export const deleteMovie = async (showId: number): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/DeleteMovie/${showId}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to delete movie');
    }
  } catch (error) {
    console.error('Error deleting movie:', error);
    throw error;
  }
};

export const fetchMovieById = async (id: number): Promise<MoviesTitle> => {
  const response = await fetch(`${API_URL}/${id}`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch movie by ID');
  }

  const raw = await response.json();
  return {
    ...raw.movie,
    avgStarRating: raw.avgStarRating,
  };
};

export const fetchUser = async (userId: number): Promise<MoviesUser> => {
  try {
    const response = await fetch(`${USER_API_URL}/${userId}`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user: ', error);
    throw error;
  }
};

export const updateUser = async (id: number, user: MoviesUser) => {
  const response = await fetch(`${USER_API_URL}/UpdateUser/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    throw new Error('Failed to update user');
  }

  return response.json();
};

export const fetchUserRatings = async () => {
  try {
    const response = await fetch(`${API_URL}/GetUserRatings`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user ratings');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user ratings: ', error);
    throw error;
  }
};

export const fetchCurrentUser = async (): Promise<{
  userId: number;
  email: string;
}> => {
  try {
    const response = await fetch(`${USER_API_URL}/current`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch current user');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching current user:', error);
    throw error;
  }
};

export const rateMovie = async (
  showId: number,
  rating: number
): Promise<void> => {
  try {
    // Fetch current user to get the userId
    const currentUser = await fetchCurrentUser();

    // Send the userId along with the rating in the request body
    const response = await fetch(`${API_URL}/${showId}/rate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // Ensure user is authenticated
      body: JSON.stringify({
        rating,
        userId: currentUser.userId, // UserId from the current authenticated user
        showId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to submit rating');
    }
  } catch (error) {
    console.error('Error rating movie:', error);
    throw error;
  }
};

// Role Management API
export const addRole = async (roleName: string): Promise<string> => {
  try {
    const response = await fetch(
      `${ROLE_URL}/AddRole?roleName=` + encodeURIComponent(roleName),
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to add role');
    }

    return await response.text(); // Response from the API (like success or error message)
  } catch (error) {
    console.error('Error adding role:', error);
    throw error;
  }
};

export const assignRoleToUser = async (
  userEmail: string,
  roleName: string
): Promise<string> => {
  try {
    const response = await fetch(
      `${ROLE_URL}/AssignRoleToUser?userEmail=${encodeURIComponent(userEmail)}&roleName=${encodeURIComponent(roleName)}`,
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to assign role');
    }

    return await response.text(); // Response from the API (like success or error message)
  } catch (error) {
    console.error('Error assigning role to user:', error);
    throw error;
  }
};

// Fetch all roles
export const fetchRoles = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${ROLE_URL}/GetAllRoles`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch roles');
    }

    const roles = await response.json();
    return roles.map((role: { name: string }) => role.name); // Assuming roles have a 'name' field
  } catch (error) {
    console.error('Error fetching roles: ', error);
    throw error;
  }
};

// Fetch users in a specific role
export const fetchUsersInRole = async (
  roleName: string
): Promise<MoviesUser[]> => {
  try {
    const response = await fetch(
      `${ROLE_URL}/GetUsersInRole?roleName=${encodeURIComponent(roleName)}`,
      {
        credentials: 'include',
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch users in role');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching users in role: ', error);
    throw error;
  }
};



export const fetchRelatedMovies = async (title: string) => {
  const res = await fetch(
    `${RECOMMENDER_API}/recommend?title=${encodeURIComponent(title)}&count=6`
  );

  if (!res.ok) throw new Error("Failed to fetch related movies");

  const data = await res.json();
  console.log('fetchRelatedMovies response:', data);

  return data.recommended || data;
};

export const fetchUserRecommendations = async (userId: number) => {
  const res = await fetch(`${RECOMMENDER_API}/user-recs?user_id=${userId}`);

  if (!res.ok) throw new Error("Failed to fetch user recommendations");

  return await res.json(); // This will return an object with categories and recs
};