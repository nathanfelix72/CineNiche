import { useNavigate } from 'react-router-dom';

function Logout(props: { children: React.ReactNode }) {
  const navigate = useNavigate();

  const handleLogout = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(
        'https://cineniche-backend-eshedfdkc8c4amft.westus2-01.azurewebsites.net/logout',
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        navigate('/login');
      } else {
        console.error('Logout failed:', response.status);
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <a className="logout" href="#" onClick={handleLogout}>
      <span style={{ marginRight: '2rem', color: 'white', fontWeight: 'bold', textDecoration: 'none' }}>
          {props.children}
      </span>
    </a>
  );
}

export default Logout;
