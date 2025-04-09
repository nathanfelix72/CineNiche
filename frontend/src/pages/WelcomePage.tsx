import { useState, useRef, useEffect } from 'react';
import {
  ChevronRight,
  Film,
  Camera,
  Download,
  Tv,
  Users,
  PlayCircle,
  ChevronLeft,
} from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { InputGroup, Form, Button, Accordion } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function WelcomePage() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const carouselRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const handlePrivacyClick = () => {
    // Navigate to the Privacy Policy page
    navigate('/privacy-policy');
  };
  const handleClick = (link: string) => {
    if (link === 'Privacy') {
      handlePrivacyClick();
    }
  };

  const trendingContent = [
    { id: 1, title: 'Indiana Jones and the Temple of Doom', rank: 1 },
    { id: 2, title: 'A Cinderella Story', rank: 2 },
    { id: 3, title: 'Grease', rank: 3 },
    { id: 4, title: 'Fiddler on the Roof', rank: 4 },
    { id: 5, title: 'Hunt for the Wilderpeople', rank: 5 },
    { id: 6, title: 'Kung Fu Panda', rank: 6 },
    { id: 7, title: 'Godzilla', rank: 7 },
    { id: 8, title: 'Godzilla', rank: 8 },
    { id: 9, title: 'Godzilla', rank: 9 },
  ];

  const faqItems = [
    {
      question: 'What is CineNiche?',
      answer: (
        <div style={{ textAlign: 'left' }}>
          CineNiche is like a vintage drive-in, but right on your screen. <br />{' '}
          <br />
          Stream a mix of movies, shows, anime, and documentaries anytime,
          anywhere—no tickets needed.
          <br /> <br />
          New titles added weekly, all for one low monthly price. Your cozy,
          retro movie night starts here.
        </div>
      ),
    },
    {
      question: 'How much does CineNiche cost?',
      answer: (
        <div style={{ textAlign: 'left' }}>
          What CineNiche on your smartphone, tablet, Smart TV, laptop, or
          streaming device, all for one fixed monthly fee.
          <br /> <br />
          Plans range from $7.99 to $24.99 a month (pre-tax).
          <br /> <br />
          No extra costs, no contracts.
        </div>
      ),
    },
    {
      question: 'Where can I watch?',
      answer: (
        <div style={{ textAlign: 'left' }}>
          You can watch Cineniche anywhere you want! The beauty of it is that
          you get all the charm of a drive-in movie, but without needing to
          leave your home. <br />
          <br />
          Whether you’re relaxing in your living room, in your car, or even on a
          cozy blanket outside, Cineniche gives you the same magical movie
          experience—comfortable, immersive, and at your own pace. <br />
          <br />
          All you need to do is log into Cineniche on any device, and you're
          good to go! We’re fully web and mobile friendly, so you can enjoy the
          experience however and wherever you like. <br />
          <br />
          It's like having a drive-in theater wherever you go! So, sit back,
          grab some snacks, and enjoy the show, wherever feels most relaxing for
          you.
        </div>
      ),
    },
    {
      question: 'How do I cancel?',
      answer: (
        <div style={{ textAlign: 'left' }}>
          CineNiche is flexible. There are no pesky contracts and no
          commitments. You can easily cancel you account online in two clicks{' '}
          <br /> <br />
          There are no cancellation fees - start or stop you account whenever
          and wherever
        </div>
      ),
    },
    {
      question: 'What can I watch on CineNiche?',
      answer: (
        <div style={{ textAlign: 'left' }}>
          Netflix has an extensive library of feature films, documentaries, TV
          shows, anime, award-winning CineNiche originals, and more.
          <br /> <br />
          Watch as much as you want, anytime you want.
        </div>
      ),
    },
    {
      question: 'Is CineNiche good for kids?',
      answer: (
        <div style={{ textAlign: 'left' }}>
          The CineNiche Kids experience is included in your membership to give
          parent control while kids enjoy family-friendly TV shows and movies in
          their own space.
          <br /> <br />
          Kids profiles come with PIN-protected parental controls that let you
          restrict the maturity rating of content kids can watch and block
          specific titles you don't want kids to see.
        </div>
      ),
    },
  ];

  const features = [
    {
      title: 'Enjoy on your TV',
      description:
        'Watch on Smart TVs, PlayStation, Xbox, Chromecast, Apple TV, Blu-ray players, and more.',
      icon: <Tv size={36} className="text-white" />,
    },
    {
      title: 'Download your shows',
      description:
        'Save your favorites easily and always have something to watch.',
      icon: <Download size={36} className="text-white" />,
    },
    {
      title: 'Watch everywhere',
      description:
        'Stream unlimited movies and TV shows on your phone, tablet, laptop, and TV.',
      icon: <Film size={36} className="text-white" />,
    },
    {
      title: 'Create profiles for kids',
      description:
        'Send kids on adventures with their favorite characters in a space made just for them—free with your membership.',
      icon: <Users size={36} className="text-white" />,
    },
  ];

  // Number of items to show in the carousel depending on screen width
  const getVisibleItems = () => {
    if (window.innerWidth < 768) {
      return 2; // Show 2 items on mobile
    } else if (window.innerWidth < 992) {
      return 3; // Show 3 items on tablets
    } else {
      return 5; // Show 5 items on desktop
    }
  };

  const [visibleItems, setVisibleItems] = useState(5);

  useEffect(() => {
    const handleResize = () => {
      setVisibleItems(getVisibleItems());
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxItems = trendingContent.length;

  const nextSlide = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    const nextIndex = (currentIndex + 1) % maxItems;
    setCurrentIndex(nextIndex);

    setTimeout(() => {
      setIsAnimating(false);
    }, 100);
  };

  const prevSlide = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    const prevIndex = currentIndex === 0 ? maxItems - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);

    setTimeout(() => {
      setIsAnimating(false);
    }, 100);
  };
  // Dynamically fetch image based on movie title
  const getMovieImage = (title: string) => {
    const imagePath = encodeURIComponent(title); // Proper URL encoding
    return `https://intextmovieposter.blob.core.windows.net/intextmovieposters/Movie%20Posters/${imagePath}.jpg?sp=r&st=2025-04-08T23:11:33Z&se=2025-04-30T07:11:33Z&spr=https&sv=2024-11-04&sr=c&sig=wXjBom%2BbH%2B0mdM%2FfkTY1l4mbOxjB3ELq6Y8BBoOItNI%3D`;
  };

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
            background: 'linear-gradient(90deg, #f5e9d9 0%, #d13e4a 100%)',
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
                  color: '#d13e4a',
                }}
                onClick={() => navigate('/')} // Handle click to navigate
              >
                CINENICHE
              </h1>
            </div>
            <div className="d-flex align-items-center gap-3">
              <select
                className="form-select bg-transparent text-white border-secondary"
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

        {/* Hero Section with Film Projector Style */}
        <div
          className="container-fluid py-5"
          style={{
            backgroundImage: `url('/images/niche_movie.png')`,
            position: 'relative',
            overflow: 'hidden',
            height: '600px',
          }}
        >
          <div
            className="position-absolute top-0 start-0 w-100 h-100"
            style={{
              backgroundColor: 'rgba(158, 86, 86, 0.69)',
              zIndex: 1,
            }}
          ></div>
          <div
            className="row align-items-center justify-content-center position-relative"
            style={{
              zIndex: 1,
              height: '100%', // Ensures the row takes the full height
            }}
          >
            <div className="col-lg-6 text-center text-white">
              {/* Film Reel Decoration */}
              <div className="mb-4 d-inline-block">
                <div className="position-relative">
                  <h1
                    className="display-4 fw-bold px-4 bg-transparent d-inline-block"
                    style={{
                      fontFamily: '"Bebas Neue", sans-serif',
                      letterSpacing: '0.15em',
                      color: '#fff',
                      textShadow: '0 0 10px #d13e4a',
                      textTransform: 'uppercase',
                    }}
                  >
                    DISCOVER CINEMA
                  </h1>
                </div>

                <p
                  className="lead mt-4 mb-3"
                  style={{
                    fontFamily: '"Playfair Display", serif',
                    fontWeight: '700', // or 'bold'
                    fontSize: '1.75rem', // adjust as needed
                  }}
                >
                  Drive-In Feeling, Anytime, Anywhere
                </p>
                <p
                  className="mb-4"
                  style={{ fontSize: '1.1rem', fontWeight: '500' }}
                >
                  Starting at $7.99/month. Cancel anytime.
                </p>
              </div>

              <div className="row justify-content-center">
                <div className="col-lg-10">
                  <InputGroup
                    className="mb-3"
                    style={{
                      border: '3px solid rgba(215, 65, 103, 0.3)',
                      borderRadius: '10px',
                      overflow: 'hidden',
                    }}
                  >
                    <Form.Control
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="py-3"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        border: 'none',
                      }}
                    />
                    <Button
                      style={{
                        backgroundColor: '#d13e4a',
                        borderColor: '#d13e4a',
                        color: '#fff',
                        padding: '0 25px',
                      }}
                      onClick={() =>
                        navigate(`/register?email=${encodeURIComponent(email)}`)
                      }
                    >
                      Get Started <ChevronRight size={20} className="ms-2" />
                    </Button>
                  </InputGroup>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vintage Movie Tickets Banner */}
        <div
          className="py-4"
          style={{
            borderTop: '1px dashed #d13e4a',
            borderBottom: '1px dashed #d13e4a',
          }}
        >
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <div
                  className="row align-items-center py-2 px-4"
                  style={{
                    background: 'rgba(215, 65, 103, 0.05)',
                    borderRadius: '4px',
                    border: '1px solid #d13e4a',
                  }}
                >
                  <div className="col-auto d-none d-md-block">
                    <div
                      style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        backgroundColor: '#d13e4a',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <PlayCircle size={24} className="text-white" />
                    </div>
                  </div>
                  <div className="col-md-8">
                    <h5 className="mb-1 text-black">
                      The CineNiche you love for just $7.99.
                    </h5>
                    <p className="mb-0 text-black small">
                      Enjoy savings and CineNiche with a few ad breaks.
                    </p>
                  </div>
                  <div className="col-md-3 text-md-end mt-2 mt-md-0">
                    <button
                      className="btn"
                      style={{
                        backgroundColor: 'transparent',
                        border: '1px solid #d13e4a',
                        color: '#d13e4a',
                      }}
                    >
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Trending Now Carousel */}
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-11">
              <div className="d-flex align-items-center mb-4 justify-content-between">
                <div className="d-flex align-items-center">
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: '#d13e4a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '12px',
                    }}
                  >
                    <Film size={20} className="text-white" />
                  </div>
                  <h2
                    className="text-black fw-bold mb-0"
                    style={{
                      fontFamily: '"Bebas Neue", sans-serif',
                      letterSpacing: '0.1em',
                    }}
                  >
                    TRENDING NOW
                  </h2>
                </div>
                {/* Carousel Navigation */}
                <div className="d-flex">
                  <button
                    className="btn btn-sm me-2"
                    onClick={prevSlide}
                    style={{
                      backgroundColor: '#d13e4a',
                      borderColor: '#d13e4a',
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <ChevronLeft size={20} className="text-white" />
                  </button>
                  <button
                    className="btn btn-sm"
                    onClick={nextSlide}
                    style={{
                      backgroundColor: '#d13e4a',
                      borderColor: '#d13e4a',
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <ChevronRight size={20} className="text-white" />
                  </button>
                </div>
              </div>
              {/* Film Strip Container with Carousel */}
              <div
                style={{
                  position: 'relative',
                  padding: '30px 0',
                  marginBottom: '40px',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '15px',
                    backgroundImage:
                      'repeating-linear-gradient(90deg, #d13e4a, #d13e4a 15px, #333 15px, #333 30px)',
                  }}
                ></div>
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '15px',
                    backgroundImage:
                      'repeating-linear-gradient(90deg, #d13e4a, #d13e4a 15px, #333 15px, #333 30px)',
                  }}
                ></div>
                <div
                  ref={carouselRef}
                  style={{
                    overflow: 'hidden',
                    paddingTop: '15px',
                    paddingBottom: '15px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      transition: 'transform 0.5s ease',
                      transform: `translateX(-${currentIndex * (100 / maxItems)}%)`,
                    }}
                  >
                    {trendingContent.map((item) => (
                      <div
                        key={item.id}
                        style={{
                          flex: `0 0 ${100 / visibleItems}%`,
                          padding: '0 8px',
                          transition: 'transform 0.3s',
                          cursor: 'pointer',
                        }}
                      >
                        <div className="position-relative">
                          <div
                            className="position-absolute top-0 start-0 p-2 z-1"
                            style={{
                              background: '#d13e4a',
                              color: '#fff',
                              fontWeight: 'bold',
                              clipPath:
                                'polygon(0 0, 100% 0, 80% 100%, 0 100%)',
                              paddingRight: '15px',
                            }}
                          >
                            {item.rank}
                          </div>
                          <img
                            src={getMovieImage(item.title)}
                            className="img-fluid"
                            alt={item.title}
                            style={{
                              width: '100%', // Make images take up the full width of their container
                              height: '325px', // Fixed height to make images uniform
                              objectFit: 'cover', // Crop images to fit within the specified dimensions
                              border: '4px solid #000',
                              boxShadow: '0 5px 15px #d13e4a',
                            }}
                          />
                          <div className="text-center mt-2 text-black">
                            {item.title}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features in Vintage Camera Style Layout */}
        <div
          className="py-5"
          style={{
            backgroundImage:
              'radial-gradient(circle at 30% 50%, #d13e4a 0%, #f5e9d9 70%)',
            position: 'relative',
          }}
        >
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <div className="d-flex align-items-center mb-4">
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: '#d13e4a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '12px',
                    }}
                  >
                    <Camera size={20} className="text-white" />
                  </div>
                  <h2
                    className="text-white fw-bold mb-0"
                    style={{
                      fontFamily: '"Bebas Neue", sans-serif',
                      letterSpacing: '0.1em',
                    }}
                  >
                    MORE REASONS TO JOIN
                  </h2>
                </div>

                <div className="row g-4">
                  {features.map((feature, idx) => (
                    <div className="col-md-6 col-lg-3" key={idx}>
                      <div
                        className="h-100"
                        style={{
                          backgroundColor: 'rgba(209, 62, 74, 0.5)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          padding: '20px',
                          boxShadow: '0 10px 20px rgba(0, 0, 0, 0.3)',
                        }}
                      >
                        <div className="mb-3 d-flex justify-content-center">
                          <div
                            style={{
                              width: '70px',
                              height: '70px',
                              borderRadius: '50%',
                              backgroundColor: '#d13e4a',
                              border: '1px solid rgb(215, 65, 102)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            {feature.icon}
                          </div>
                        </div>
                        <h5
                          className="text-white mb-2"
                          style={{ fontFamily: '"Courier Prime", monospace' }}
                        >
                          {feature.title}
                        </h5>
                        <p className="text-light small mb-0">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

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
                    borderTopLeftRadius: '10px',
                    borderTopRightRadius: '10px',
                    backgroundImage:
                      'linear-gradient(180deg, #d13e4a 0%, #d13e4a 100%)',
                    position: 'relative',
                    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
                  }}
                >
                  {/* Light bulbs */}
                  <div
                    className="d-flex justify-content-between position-absolute"
                    style={{
                      top: '10px',
                      left: '20px',
                      right: '20px',
                    }}
                  >
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(255, 255, 255, 0.8)',
                          boxShadow: '0 0 5px rgba(255, 255, 255, 0.8)',
                        }}
                      ></div>
                    ))}
                  </div>

                  <h2
                    className="fw-bold text-white mb-0"
                    style={{
                      fontFamily: '"Bebas Neue", sans-serif',
                      letterSpacing: '0.2em',
                      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    FREQUENTLY ASKED QUESTIONS
                  </h2>
                </div>
              </div>

              <Accordion defaultActiveKey={null} className="mb-4">
                {faqItems.map((item, index) => (
                  <Accordion.Item
                    eventKey={index.toString()}
                    key={index}
                    className="mb-3"
                    style={{
                      backgroundColor: 'rgba(35, 35, 35, 0.5)',
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

              <div className="text-center">
                <p className="mb-4 text-black">
                  Ready to watch? Enter your email to create or restart your
                  membership.
                </p>
                <div className="row justify-content-center">
                  <div className="col-lg-8">
                    <InputGroup
                      className="mb-3"
                      style={{
                        border: '2px solid rgba(215, 65, 103, 0.3)',
                        borderRadius: '4px',
                        overflow: 'hidden',
                      }}
                    >
                      <Form.Control
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="py-3"
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          border: 'none',
                        }}
                      />
                      <Button
                        style={{
                          backgroundColor: '#d13e4a',
                          borderColor: '#d13e4a',
                          color: '#fff',
                          padding: '0 25px',
                        }}
                        onClick={() =>
                          navigate(
                            `/register?email=${encodeURIComponent(email)}`
                          )
                        }
                      >
                        Get Started <ChevronRight size={20} className="ms-2" />
                      </Button>
                    </InputGroup>
                  </div>
                </div>
              </div>
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
                    ['Privacy', 'Speed Test', 'Ad Choices', 'Contact Us'],
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

export default WelcomePage;
