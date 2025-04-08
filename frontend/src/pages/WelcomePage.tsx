import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import './welcompage.css'

function WelcomePage() {
  const [email, setEmail] = useState('');  
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };
  
  const trendingContent = [
    { id: 1, title: "Beauty in Black", rank: 1 },
    { id: 2, title: "Love on the Spectrum", rank: 2 },
    { id: 3, title: "Den of Thieves 2", rank: 3 },
    { id: 4, title: "Black Mirror", rank: 4 },
    { id: 5, title: "The Life List", rank: 5 },
    { id: 6, title: "Despicable Me 4", rank: 6 },
    { id: 7, title: "Interstellar", rank: 7 },
  ];

  const faqItems = [
    { 
      question: "What is Streamflix?", 
      answer: "Streamflix is a streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries, and more on thousands of internet-connected devices. You can watch as much as you want, whenever you want without a single commercial – all for one low monthly price."
    },
    { 
      question: "How much does Streamflix cost?", 
      answer: "Watch Streamflix on your smartphone, tablet, Smart TV, laptop, or streaming device, all for one fixed monthly fee. Plans range from $7.99 to $15.99 a month. No extra costs, no contracts."
    },
    { 
      question: "Where can I watch?", 
      answer: "Watch anywhere, anytime. Sign in with your Streamflix account to watch instantly on the web at streamflix.com from your personal computer or on any internet-connected device that offers the Streamflix app, including smart TVs, smartphones, tablets, streaming media players and game consoles."
    },
    { 
      question: "How do I cancel?", 
      answer: "Streamflix is flexible. There are no pesky contracts and no commitments. You can easily cancel your account online in two clicks. There are no cancellation fees – start or stop your account anytime."
    },
    { 
      question: "What can I watch on Streamflix?", 
      answer: "Streamflix has an extensive library of feature films, documentaries, TV shows, anime, award-winning Streamflix originals, and more. Watch as much as you want, anytime you want."
    },
    { 
      question: "Is Streamflix good for kids?", 
      answer: "The Kids experience is included in your membership to give parents control while kids enjoy family-friendly TV shows and movies in their own space. Kids profiles come with PIN-protected parental controls that let you restrict the maturity rating of content kids can watch and block specific titles you don't want kids to see."
    }
  ];

  const features = [
    {
      title: "Enjoy on your TV",
      description: "Watch on Smart TVs, PlayStation, Xbox, Chromecast, Apple TV, Blu-ray players, and more.",
      image: "/api/placeholder/320/180"
    },
    {
      title: "Download your shows to watch offline",
      description: "Save your favorites easily and always have something to watch.",
      image: "/api/placeholder/320/180"
    },
    {
      title: "Watch everywhere",
      description: "Stream unlimited movies and TV shows on your phone, tablet, laptop, and TV.",
      image: "/api/placeholder/320/180"
    },
    {
      title: "Create profiles for kids",
      description: "Send kids on adventures with their favorite characters in a space made just for them — free with your membership.",
      image: "/api/placeholder/320/180"
    }
  ];

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Navigation Bar */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-6 absolute w-full z-10">
        <div className="flex items-center">
          <h1 className="text-red-600 font-bold text-4xl">STREAMFLIX</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <select className="bg-black text-white border border-white rounded px-2 py-1 appearance-none pr-8">
              <option>English</option>
              <option>Español</option>
              <option>Français</option>
            </select>
            <ChevronRight size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 rotate-90" />
          </div>
          <button className="bg-red-600 hover:bg-red-700 px-4 py-1 rounded">Sign In</button>
        </div>
      </nav>

      {/* Hero Section with Background */}
      <div className="relative pt-24 pb-8 md:min-h-screen flex flex-col items-center justify-center text-center">
        <div className="absolute inset-0 bg-black opacity-60 z-0"></div>
        <div className="absolute inset-0 bg-cover bg-center z-[-1]" style={{ backgroundImage: `url('/api/placeholder/1920/1080')` }}></div>
        
        <div className="relative z-10 px-4 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5">Unlimited movies, TV shows, and more</h1>
          <p className="text-xl md:text-2xl mb-5">Starts at $7.99. Cancel anytime.</p>
          <p className="text-lg mb-5">Ready to watch? Enter your email to create or restart your membership.</p>
          
          <div className="flex flex-col md:flex-row items-center justify-center w-full gap-2">
            <input
              type="email"
              placeholder="Email address"
              className="w-full md:w-96 px-4 py-3 rounded bg-black/60 border border-gray-600 text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded font-medium flex items-center whitespace-nowrap">
              Get Started <ChevronRight size={20} className="ml-2" />
            </button>
          </div>
        </div>
      </div>

      {/* Ad Banner */}
      <div className="bg-gradient-to-r from-gray-900 to-black py-5 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div>
            <p className="text-xl font-bold">The Streamflix you love for just $7.99.</p>
            <p className="text-gray-300">Enjoy savings and Streamflix with a few ad breaks.</p>
          </div>
          <button className="mt-4 md:mt-0 border border-white bg-black hover:bg-gray-800 px-4 py-2 rounded-md">
            Learn More
          </button>
        </div>
      </div>

      {/* Trending Now Section */}
      <div className="px-4 md:px-12 py-8">
        <h2 className="text-2xl font-bold mb-4">Trending Now</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 md:gap-4 relative overflow-hidden">
          {trendingContent.map((item) => (
            <div key={item.id} className="relative group">
              <div className="absolute top-0 left-0 text-6xl font-bold text-gray-800 z-10 group-hover:text-red-600 transition-colors">
                {item.rank}
              </div>
              <div className="relative bg-gray-800 aspect-[2/3] rounded overflow-hidden transform transition-transform group-hover:scale-105">
                <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('/api/placeholder/240/360')` }}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute bottom-0 left-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="font-bold text-sm">{item.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="border-t border-gray-800">
        {features.map((feature, index) => (
          <div key={index} className={`border-b border-gray-800 py-12`}>
            <div className="max-w-6xl mx-auto px-4 md:px-12 flex flex-col md:flex-row items-center justify-between">
              <div className={`md:w-1/2 ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">{feature.title}</h2>
                <p className="text-xl md:text-2xl">{feature.description}</p>
              </div>
              <div className={`md:w-1/2 mt-8 md:mt-0 ${index % 2 === 1 ? 'md:order-1' : ''}`}>
                <div className="relative">
                  <img src={feature.image} alt={feature.title} className="mx-auto" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="py-16 px-4 md:px-12 border-b border-gray-800">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          
          <div className="mb-8">
            {faqItems.map((item, index) => (
              <div key={index} className="mb-2">
                <button
                  className="w-full text-left p-4 bg-gray-800 hover:bg-gray-700 flex justify-between items-center"
                  onClick={() => toggleFaq(index)}
                >
                  <span className="text-lg md:text-xl">{item.question}</span>
                  <span className="text-2xl transform transition-transform">
                    {expandedFaq === index ? '×' : '+'}
                  </span>
                </button>
                {expandedFaq === index && (
                  <div className="p-4 bg-gray-800 mt-px">
                    <p className="text-lg md:text-xl">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <p className="text-lg mb-5">Ready to watch? Enter your email to create or restart your membership.</p>
            <div className="flex flex-col md:flex-row items-center justify-center w-full gap-2">
              <input
                type="email"
                placeholder="Email address"
                className="w-full md:w-96 px-4 py-3 rounded bg-black/60 border border-gray-600 text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded font-medium flex items-center whitespace-nowrap">
                Get Started <ChevronRight size={20} className="ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 px-4 md:px-12">
        <div className="max-w-6xl mx-auto">
          <p className="text-gray-500 mb-6">Questions? Call 1-844-505-2993</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <ul className="space-y-3 text-sm text-gray-500">
                <li className="hover:underline cursor-pointer">FAQ</li>
                <li className="hover:underline cursor-pointer">Investor Relations</li>
                <li className="hover:underline cursor-pointer">Privacy</li>
                <li className="hover:underline cursor-pointer">Speed Test</li>
              </ul>
            </div>
            <div>
              <ul className="space-y-3 text-sm text-gray-500">
                <li className="hover:underline cursor-pointer">Help Center</li>
                <li className="hover:underline cursor-pointer">Jobs</li>
                <li className="hover:underline cursor-pointer">Cookie Preferences</li>
                <li className="hover:underline cursor-pointer">Legal Notices</li>
              </ul>
            </div>
            <div>
              <ul className="space-y-3 text-sm text-gray-500">
                <li className="hover:underline cursor-pointer">Account</li>
                <li className="hover:underline cursor-pointer">Ways to Watch</li>
                <li className="hover:underline cursor-pointer">Corporate Information</li>
                <li className="hover:underline cursor-pointer">Only on Streamflix</li>
              </ul>
            </div>
            <div>
              <ul className="space-y-3 text-sm text-gray-500">
                <li className="hover:underline cursor-pointer">Media Center</li>
                <li className="hover:underline cursor-pointer">Terms of Use</li>
                <li className="hover:underline cursor-pointer">Contact Us</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8">
            <div className="relative inline-block">
              <select className="bg-black text-white border border-gray-600 rounded px-2 py-1 appearance-none pr-8 text-sm">
                <option>English</option>
                <option>Español</option>
                <option>Français</option>
              </select>
              <ChevronRight size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 rotate-90" />
            </div>
          </div>
          
          <p className="text-gray-500 text-sm mt-6">© 2025 Streamflix, Inc.</p>
        </div>
      </footer>
    </div>
  );
}

export default WelcomePage