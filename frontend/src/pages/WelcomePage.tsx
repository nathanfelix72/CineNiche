import React from "react";

export default function NetflixClone() {
  return (
    <div className="bg-black text-white font-sans min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center px-8 py-4">
        <h1 className="text-3xl font-bold text-red-600">NETFLIX</h1>
        <div className="flex items-center gap-4">
          <select className="bg-black border border-gray-500 rounded px-3 py-1 text-white">
            <option>English</option>
            <option>Spanish</option>
          </select>
          <button className="bg-red-600 hover:bg-red-700 px-4 py-1 rounded text-white">Sign In</button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative bg-cover bg-center min-h-[500px] flex items-center justify-center text-center px-4" style={{ backgroundImage: "url('https://assets.nflxext.com/ffe/siteui/vlv3/30b5b300-6b42-4123-a5a2-df9c93e439da/2fc8e180-54f9-4e04-b70f-68c3a413b91b/US-en-20240401-popsignuptwoweeks-perspective_alpha_website_small.jpg')" }}>
        <div className="bg-black bg-opacity-70 p-8 rounded-xl max-w-xl w-full">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Unlimited movies, TV shows, and more</h2>
          <p className="text-xl mb-6">Starts at $7.99. Cancel anytime.</p>
          <p className="mb-4">Ready to watch? Enter your email to create or restart your membership.</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <input type="email" placeholder="Email address" className="w-full px-4 py-2 text-black rounded" />
            <button className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded text-white font-semibold">Get Started</button>
          </div>
        </div>
      </div>

      {/* Price Info */}
      <div className="bg-zinc-900 text-center py-6 px-4">
        <p>The Netflix you love for just $7.99. Enjoy savings and Netflix with a few ad breaks.</p>
      </div>

      {/* Trending Now */}
      <div className="px-6 py-10">
        <h3 className="text-2xl font-bold mb-4">Trending Now</h3>
        <div className="flex gap-4 overflow-x-auto">
          {[1, 2, 3, 4, 5, 6, 7].map((num) => (
            <div key={num} className="relative w-[150px] h-[225px] bg-zinc-800 rounded overflow-hidden flex items-end p-2">
              <span className="absolute top-1 left-1 text-4xl font-extrabold drop-shadow">{num}</span>
              <div className="absolute bottom-2 left-2 font-semibold">Movie {num}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Reasons to Join */}
      <div className="px-6 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-zinc-900">
        {[
          {
            title: "Enjoy on your TV",
            desc: "Watch on Smart TVs, Playstation, Xbox, Chromecast, Apple TV, Blu-ray players, and more.",
          },
          {
            title: "Download to watch offline",
            desc: "Save your favorite shows and always have something to watch.",
          },
          {
            title: "Watch everywhere",
            desc: "Stream unlimited movies and TV shows on your phone, tablet, laptop, and TV.",
          },
          {
            title: "Create profiles for kids",
            desc: "Send kids on adventures with their favorite characters in a space just for them.",
          },
        ].map((item, i) => (
          <div key={i} className="bg-zinc-800 p-4 rounded-xl">
            <h4 className="font-bold text-lg mb-2">{item.title}</h4>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="px-6 py-10">
        <h3 className="text-2xl font-bold mb-6">Frequently Asked Questions</h3>
        <div className="space-y-4">
          {[
            "What is Netflix?",
            "How much does Netflix cost?",
            "Where can I watch?",
            "How do I cancel?",
            "What can I watch on Netflix?",
            "Is Netflix good for kids?",
          ].map((question, i) => (
            <details key={i} className="bg-zinc-800 rounded p-4 cursor-pointer">
              <summary className="font-semibold text-lg">{question}</summary>
              <p className="mt-2 text-gray-300">This is a placeholder answer for: {question}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
