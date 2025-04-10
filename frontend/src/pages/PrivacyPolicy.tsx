import { Film } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Accordion } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function PrivacyPolicy() {
  const navigate = useNavigate();

  const handlePrivacyClick = () => {
    // Navigate to the Privacy Policy page
    navigate('/privacy-policy');
  };

  const handleAdminClick = () => {
    // Navigate to the Privacy Policy page
    navigate('/adminmovies');
  };

  const handleClick = (link: string) => {
    if (link === 'Privacy') {
      handlePrivacyClick();
    } else if (link === 'Admin Login') {
      handleAdminClick();
    }
  };

  const faqItems = [
    {
      question: '1. Information We Collect',
      answer: (
        <div style={{ textAlign: 'left' }}>
          <p>
            We collect several types of information to provide and improve our
            services:
          </p>
          <ul className="list-disc ml-6">
            <li>
              <strong>Personal Data:</strong> When you register for an account,
              sign up for our newsletter, or make a purchase, we may collect
              personal information such as your name, email address, phone
              number, billing address, and payment details.
            </li>
            <li>
              <strong>Usage Data:</strong> We automatically collect data on how
              you access and use our website. This includes your IP address,
              browser type, the pages you visit, and the time spent on each
              page.
            </li>
            <li>
              <strong>Cookies:</strong> We use cookies and similar tracking
              technologies to track activity on our website and store certain
              information, such as preferences or browsing history.
            </li>
          </ul>
        </div>
      ),
    },
    {
      question: '2. How We Use Your Information',
      answer: (
        <div style={{ textAlign: 'left' }}>
          <p>We use your personal information to:</p>
          <ul className="list-disc ml-6">
            <li>Provide and maintain our services.</li>
            <li>Process payments and fulfill your orders.</li>
            <li>
              Communicate with you regarding your account, products, and
              services.
            </li>
            <li>Send promotional content, if you have opted in.</li>
            <li>Improve the functionality and performance of our website.</li>
            <li>Comply with legal obligations.</li>
          </ul>
        </div>
      ),
    },
    {
      question: '3. Legal Basis for Processing Your Data',
      answer: (
        <div style={{ textAlign: 'left' }}>
          <p>We process your data based on the following legal grounds:</p>
          <ul className="list-disc ml-6">
            <li>
              <strong>Consent:</strong> We process your data when you have given
              us consent, such as subscribing to our newsletter or accepting
              cookies.
            </li>
            <li>
              <strong>Contract:</strong> We process your data when necessary to
              fulfill a contract with you, such as processing orders or
              providing customer support.
            </li>
            <li>
              <strong>Legitimate Interests:</strong> We process your data to
              pursue our legitimate business interests, such as improving our
              website and services.
            </li>
          </ul>
        </div>
      ),
    },
    {
      question: '4. Data Retention',
      answer: (
        <div style={{ textAlign: 'left' }}>
          We will retain your personal information only for as long as is
          necessary for the purposes set out in this Privacy Policy, or as
          required by law.
        </div>
      ),
    },
    {
      question: '5. Your Data Protection Rights',
      answer: (
        <div style={{ textAlign: 'left' }}>
          <p>
            As a data subject, you have the following rights under the GDPR:
          </p>
          <ul className="list-disc ml-6">
            <li>
              <strong>Right to Access:</strong> You can request copies of your
              personal data.
            </li>
            <li>
              <strong>Right to Rectification:</strong> You can request
              corrections to inaccurate or incomplete data.
            </li>
            <li>
              <strong>Right to Erasure:</strong> You can request the deletion of
              your personal data, under certain conditions.
            </li>
            <li>
              <strong>Right to Restrict Processing:</strong> You can request the
              restriction of processing your personal data, under certain
              conditions.
            </li>
            <li>
              <strong>Right to Data Portability:</strong> You can request the
              transfer of your personal data to another organization, under
              certain conditions.
            </li>
            <li>
              <strong>Right to Object:</strong> You can object to processing
              based on legitimate interests, direct marketing, or automated
              decision-making.
            </li>
          </ul>
          <p>
            To exercise any of these rights, please contact us at{' '}
            <strong>privacy@cineniche.com</strong>.
          </p>
        </div>
      ),
    },
    {
      question: '6. Data Security',
      answer: (
        <div style={{ textAlign: 'left' }}>
          We implement appropriate technical and organizational measures to
          protect your personal data from unauthorized access, use, or
          disclosure. However, please note that no method of transmission over
          the internet is 100% secure.
        </div>
      ),
    },
    {
      question: '7. Sharing Your Data',
      answer: (
        <div style={{ textAlign: 'left' }}>
          <p>
            We do not share your personal data with third parties, except in the
            following cases:
          </p>
          <ul className="list-disc ml-6">
            <li>
              <strong>Service Providers:</strong> We may share your data with
              trusted third-party service providers who assist us in operating
              our website and services, such as payment processors, hosting
              providers, or email service providers.
            </li>
            <li>
              <strong>Legal Requirements:</strong> We may disclose your
              information if required to do so by law or to protect our legal
              rights.
            </li>
          </ul>
        </div>
      ),
    },
    {
      question: '8. International Transfers',
      answer: (
        <div style={{ textAlign: 'left' }}>
          Your data may be transferred to and maintained on computers located
          outside your state, province, or country where data protection laws
          may differ. By using our services, you consent to the transfer of your
          data to countries outside your country of residence.
        </div>
      ),
    },
    {
      question: '9. Children’s Privacy',
      answer: (
        <div style={{ textAlign: 'left' }}>
          Our website and services are not intended for individuals under the
          age of 16. We do not knowingly collect personal data from children
          under 16. If we learn that we have collected personal data from a
          child under 16, we will take steps to delete that information.
        </div>
      ),
    },
    {
      question: '10. Changes to This Privacy Policy',
      answer: (
        <div style={{ textAlign: 'left' }}>
          We may update our Privacy Policy from time to time. Any changes will
          be posted on this page with an updated effective date. Please review
          this Privacy Policy periodically for any updates.
        </div>
      ),
    },
    {
      question: '11. Contact Us',
      answer: (
        <div style={{ textAlign: 'left' }}>
          <p>
            If you have any questions about this Privacy Policy or our data
            practices, please contact us at:
          </p>
          <p>
            <strong>CineNiche</strong>
          </p>
          <p>
            Email: <strong>privacy@cineniche.com</strong>
          </p>
          <p>
            Website: <strong>www.cineniche.com</strong>
          </p>
        </div>
      ),
    },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#f5e9d9',
        overflowY: 'auto',
        zIndex: 9999,
      }}
    >
      <div className="position-relative" style={{ zIndex: 1 }}>
        {/* Navbar with Film Camera Icons */}
        <nav
          className="navbar navbar-expand-lg navbar-dark px-4 py-3"
          style={{
            background: 'linear-gradient(90deg, #d13e4a 0%, #f5e9d9  100%)',
            borderBottom: '3px double rgba(255, 255, 255, 0.15)',
          }}
        >
          <div className="container-fluid justify-content-between">
            <div className="d-flex align-items-center">
              <h1
                className="navbar-brand fs-2 fw-bold mb-0"
                style={{
                  fontFamily: 'Monoton, cursive',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  cursor: 'pointer', // Change cursor to pointer on hover
                }}
                onClick={() => navigate('/')} // Handle click to navigate
              >
                CINENICHE
              </h1>
            </div>
            <div className="d-flex align-items-center gap-3">
              <select
                className="form-select bg-transparent text-black border-secondary"
                style={{
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                }}
              >
                <option>English</option>
                <option>Español</option>
                <option>Français</option>
              </select>
              <button
                className="btn text-white"
                style={{
                  backgroundColor: '#d13e4a',
                  borderColor: '#d13e4a',
                  width: '100%',
                }}
                onClick={() => navigate('/login')}
              >
                SIGN IN
              </button>
            </div>
          </div>
        </nav>

        {/* FAQ in Theater Marquee Style */}
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="text-center mb-5">
                <div
                  style={{
                    maxWidth: '500px',
                    margin: '0 auto',
                    padding: '25px 10px 20px',
                    backgroundImage:
                      'linear-gradient(180deg, #d13e4a 0%, #d13e4a 100%)',
                    position: 'relative',
                    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
                  }}
                >
                  <h2
                    className="fw-bold text-white mb-0"
                    style={{
                      fontFamily: '"Bebas Neue", sans-serif',
                      letterSpacing: '0.2em',
                      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    PRIVACY POLICY
                  </h2>
                </div>
              </div>
              <div>
                <p style={{ color: 'black' }}>
                  At CineNiche, we are committed to protecting and respecting
                  your privacy. This Privacy Policy explains how we collect,
                  use, disclose, and safeguard your personal information when
                  you visit our website (www.cineniche.com), use our services,
                  or interact with us in other ways. By accessing or using our
                  website, you agree to the terms outlined in this Privacy
                  Policy.
                </p>

                <br />
              </div>

              <Accordion defaultActiveKey={null} className="mb-4">
                {faqItems.map((item, index) => (
                  <Accordion.Item
                    eventKey={index.toString()}
                    key={index}
                    className="mb-3"
                    style={{
                      backgroundColor: '#d13e4a',
                      border: '1px solid rgba(215, 65, 103, 0.3)',
                      borderRadius: '4px',
                      overflow: 'hidden',
                    }}
                  >
                    <Accordion.Header
                      style={{
                        fontFamily: '"Courier Prime", monospace',
                      }}
                    >
                      {item.question}
                    </Accordion.Header>
                    <Accordion.Body className="text-light">
                      {item.answer}
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            </div>
          </div>
        </div>

        {/* Footer with Classic Cinema Credits Style */}
        <footer
          className="py-5"
          style={{
            backgroundColor: '#f5e9d9',
            borderTop: '3px double rgba(255, 255, 255, 0.1)',
            color: '#999',
            position: 'relative',
          }}
        >
          {/* Film style perforation at top of footer */}
          <div
            className="position-absolute"
            style={{
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              backgroundImage:
                'repeating-linear-gradient(90deg, rgba(215, 65, 103, 0.2) 0px, rgba(215, 65, 103, 0.2) 6px, transparent 6px, transparent 12px)',
            }}
          ></div>

          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <div className="d-flex align-items-center justify-content-center mb-3">
                  <Film size={16} className="me-2" />
                  <p
                    className="mb-0"
                    style={{ fontFamily: '"Courier Prime", monospace' }}
                  >
                    Questions? Call 1-123-456-7890
                  </p>
                </div>

                <div className="row row-cols-2 row-cols-md-4 g-4 mb-4">
                  {[
                    ['FAQ', 'Help Center', 'Account', 'Media Center'],
                    [
                      'Investor Relations',
                      'Jobs',
                      'Ways to Watch',
                      'Corporate Information',
                    ],
                    [
                      'Buy Gift Cards',
                      'Cookie Preferences',
                      'Legal Notices',
                      'Terms of Use',
                    ],
                    ['Privacy', 'Admin Login', 'Ad Choices', 'Contact Us'],
                  ].map((group, idx) => (
                    <div className="col" key={idx}>
                      <ul className="list-unstyled small">
                        {group.map((link, i) => (
                          <li key={i} className="mb-2">
                            <a
                              href="#"
                              className="text-decoration-none"
                              style={{
                                color: '#a9a9a9',
                                fontFamily: '"Courier Prime", monospace',
                              }}
                              onClick={() => handleClick(link)}
                            >
                              {link}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
