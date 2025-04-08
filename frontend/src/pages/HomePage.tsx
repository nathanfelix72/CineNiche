import AuthorizeView, { AuthorizedUser } from '../components/AuthorizeView';
import Header from '../components/Header';
import Logout from '../components/Logout';

function HomePage() {
  return (
    <>
      <AuthorizeView>
        <span>
          <Logout>
            Logout <AuthorizedUser value="email" />
          </Logout>
          <br />
          <br />
          <Header />
        </span>
        <h1>You should only see this page if you are logged in</h1>
      </AuthorizeView>
    </>
  );
}

export default HomePage;
