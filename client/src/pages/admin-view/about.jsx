import { useState } from "react";
import Footer from "../../components/user-view/footer";
import Header from "../../components/user-view/header";

const About = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen py-12 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Hero Section */}
          <div className="py-5 mb-16 text-center">
            <h1 className="mt-5 mb-6 text-5xl font-bold text-white">
              Discover the World's Wonders
            </h1>
            <p className="max-w-3xl mx-auto text-xl text-gray-300">
              Immerse yourself in breathtaking landscapes, rich cultures, and
              unforgettable experiences
            </p>
          </div>

          {/* Travel Inspiration Section */}
          <div className="mt-20 text-center">
            <h2 className="mb-6 text-3xl font-bold text-white">
              Travel Inspiration
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="p-6 border border-gray-700 bg-gray-800/50 rounded-xl">
                <div className="mb-4 text-yellow-400">
                  <svg
                    className="w-10 h-10 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                    />
                  </svg>
                </div>
                <h3 className="mb-3 text-xl font-semibold text-white">
                  Off-the-Beaten Path
                </h3>
                <p className="text-gray-300">
                  Discover hidden gems and secret spots that most tourists never
                  see.
                </p>
              </div>

              <div className="p-6 border border-gray-700 bg-gray-800/50 rounded-xl">
                <div className="mb-4 text-yellow-400">
                  <svg
                    className="w-10 h-10 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="mb-3 text-xl font-semibold text-white">
                  Seasonal Guides
                </h3>
                <p className="text-gray-300">
                  The best times to visit each destination for ideal weather and
                  local festivals.
                </p>
              </div>

              <div className="p-6 border border-gray-700 bg-gray-800/50 rounded-xl">
                <div className="mb-4 text-yellow-400">
                  <svg
                    className="w-10 h-10 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="mb-3 text-xl font-semibold text-white">
                  Local Experiences
                </h3>
                <p className="text-gray-300">
                  Connect with local cultures through authentic activities and
                  homestays.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default About;
