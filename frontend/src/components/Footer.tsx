import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="w-full text-center p-4 border-t mt-10 text-sm">
      <p>
        © {new Date().getFullYear()} CineNiche ·{' '}
        <Link to="/privacy-policy" className="text-black hover:underline">
          Privacy Policy
        </Link>
      </p>
    </footer>
  );
};

export default Footer;