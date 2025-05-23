import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "../../components/user-view/footer";
import travel1 from "../../asset/images/travel1.jpg";
import travel2 from "../../asset/images/travel2.jpg";
import travel3 from "../../asset/images/travel3.jpg";
import travel4 from "../../asset/images/travel4.jpg";
import travel6 from "../../asset/images/travel6.png";
import {
  Bus,
  Ticket,
  Clock,
  MapPin,
  Star,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../../components/user-view/header";

// Mock data
const routes = [
  {
    id: 1,
    name: "Lahore to Islamabad",
    departure: "08:00 AM",
    arrival: "12:00 PM",
    duration: "4h",
    price: "Rs. 1200",
    rating: 4.5,
    amenities: ["AC", "WiFi", "TV", "USB Charging"],
    image: travel6,
  },
  {
    id: 2,
    name: "Karachi to Lahore",
    departure: "10:00 PM",
    arrival: "08:00 AM",
    duration: "10h",
    price: "Rs. 2500",
    rating: 4.2,
    amenities: ["AC", "Reclining Seats", "Blanket", "Water"],
    image: travel2,
  },
  {
    id: 3,
    name: "Multan to Faisalabad",
    departure: "02:00 PM",
    arrival: "05:30 PM",
    duration: "3.5h",
    price: "Rs. 900",
    rating: 4.0,
    amenities: ["AC", "Charging Ports", "Magazine"],
    image: travel3,
  },
  {
    id: 4,
    name: "Peshawar to Islamabad",
    departure: "07:30 AM",
    arrival: "11:00 AM",
    duration: "3.5h",
    price: "Rs. 1000",
    rating: 4.3,
    amenities: ["AC", "WiFi", "Snacks"],
    image: travel4,
  },
];

const testimonials = [
  {
    id: 1,
    name: "Ali Khan",
    comment:
      "The most comfortable bus journey I've ever had. Will definitely book again!",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 2,
    name: "Fatima Ahmed",
    comment:
      "Great service, on-time departure, and friendly staff. Highly recommended.",
    rating: 4,
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: 3,
    name: "Usman Malik",
    comment: "Affordable prices with premium amenities. Worth every penny.",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/men/75.jpg",
  },
];

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);

  // Auto-rotate hero images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const heroImages = [travel1, travel2, travel3];

  const filteredRoutes = routes.filter((route) => {
    const matchesSearch = route.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "premium" && route.price > "Rs. 1500") ||
      (activeTab === "standard" && route.price <= "Rs. 1500");
    return matchesSearch && matchesTab;
  });

  const openBookingModal = (route) => {
    setSelectedRoute(route);
    setIsBookingModalOpen(true);
  };

  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardItem = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="bg-gray-50">
      <Header />

      {/* Hero Section with Slider */}
      <section className="relative h-[100vh] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <img
              src={heroImages[currentSlide]}
              alt="Bus"
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40" />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 flex flex-col items-center justify-center mt-2 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <Bus size={60} className="mx-auto mt-8 text-yellow-400" />
            <h1 className="mt-4 font-serif text-5xl font-bold md:text-6xl">
              Travel in Comfort
            </h1>
            <p className="max-w-2xl mx-auto mt-4 text-xl">
              Book your bus tickets online and enjoy premium travel experiences
              across Pakistan
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="w-full max-w-3xl p-2 mx-4 bg-white rounded-lg shadow-xl md:p-4 bg-opacity-20 backdrop-blur-sm"
          >
            <div className="flex flex-col gap-2 md:flex-row">
              <div className="flex-1">
                <label className="block mb-1 text-sm font-medium text-left text-yellow-200">
                  From
                </label>
                <input
                  type="text"
                  placeholder="Departure City"
                  className="w-full p-3 text-gray-900 rounded-lg focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              <div className="flex-1">
                <label className="block mb-1 text-sm font-medium text-left text-yellow-200">
                  To
                </label>
                <input
                  type="text"
                  placeholder="Destination City"
                  className="w-full p-3 text-gray-900 rounded-lg focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              <div className="flex-1">
                <label className="block mb-1 text-sm font-medium text-left text-yellow-200">
                  Date
                </label>
                <input
                  type="date"
                  className="w-full p-3 text-gray-900 rounded-lg focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              <div className="flex items-end">
                <button className="flex items-center justify-center w-full p-3 font-semibold text-white transition-all duration-300 bg-yellow-500 rounded-lg hover:bg-yellow-600 hover:shadow-lg">
                  <Ticket className="w-5 h-5 mr-2" />
                  Search Buses
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Slider Controls */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-center mb-8 space-x-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                currentSlide === index
                  ? "bg-yellow-400 w-6"
                  : "bg-white bg-opacity-50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Popular Routes */}
      <section className="py-16 bg-white">
        <div className="container px-4 mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
              Popular Bus Routes
            </h2>
            <p className="max-w-2xl mx-auto mt-4 text-gray-600">
              Choose from our most traveled routes with premium comfort
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 gap-8 mt-12 md:grid-cols-2 lg:grid-cols-4"
          >
            {[
              { from: "Lahore", to: "Islamabad", price: "Rs. 1200" },
              { from: "Karachi", to: "Lahore", price: "Rs. 2500" },
              { from: "Multan", to: "Faisalabad", price: "Rs. 900" },
              { from: "Peshawar", to: "Islamabad", price: "Rs. 1000" },
            ].map((route, index) => (
              <motion.div
                key={index}
                variants={cardItem}
                whileHover={{
                  y: -10,
                  boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
                }}
                className="overflow-hidden transition-all duration-300 bg-white border border-gray-200 rounded-xl hover:border-yellow-400"
              >
                <div className="p-6">
                  <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-yellow-50">
                    <Bus className="text-yellow-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {route.from} to {route.to}
                  </h3>
                  <p className="mt-2 text-gray-600">Starting from</p>
                  <p className="mt-1 text-2xl font-bold text-yellow-600">
                    {route.price}
                  </p>
                  <Link
                    to="/user/UserCreate"
                    className="inline-flex items-center mt-6 text-sm font-medium text-yellow-600 hover:text-yellow-700"
                  >
                    Book Now <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Bus Schedule Section */}
      <section className="py-16 bg-gray-50">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col justify-between mb-12 md:flex-row md:items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
                Available Bus Schedules
              </h2>
              <p className="mt-2 text-gray-600">
                Find the perfect bus for your journey
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="flex flex-col mt-4 space-y-4 md:mt-0 md:flex-row md:space-y-0 md:space-x-4"
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search routes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 md:w-64"
                />
                <svg
                  className="absolute w-5 h-5 text-gray-400 left-3 top-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>

              <div className="inline-flex rounded-md shadow-sm">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                    activeTab === "all"
                      ? "bg-yellow-500 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setActiveTab("premium")}
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === "premium"
                      ? "bg-yellow-500 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Premium
                </button>
                <button
                  onClick={() => setActiveTab("standard")}
                  className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                    activeTab === "standard"
                      ? "bg-yellow-500 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Standard
                </button>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 gap-8"
          >
            {filteredRoutes.map((route) => (
              <motion.div
                key={route.id}
                variants={cardItem}
                whileHover={{ scale: 1.02 }}
                className="overflow-hidden transition-all duration-300 bg-white border border-gray-200 rounded-xl hover:shadow-lg"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/4">
                    <img
                      src={route.image}
                      alt={route.name}
                      className="object-cover w-full h-full min-h-[200px]"
                    />
                  </div>
                  <div className="p-6 md:w-3/4">
                    <div className="flex flex-col justify-between md:flex-row">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">
                          {route.name}
                        </h3>
                        <div className="flex items-center mt-2 space-x-4">
                          <div className="flex items-center text-gray-600">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>{route.duration}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span>Direct</span>
                          </div>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 mr-1 text-yellow-400 fill-yellow-400" />
                            <span className="font-medium">{route.rating}</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0 md:text-right">
                        <p className="text-sm text-gray-500">Starting from</p>
                        <p className="text-3xl font-bold text-yellow-600">
                          {route.price}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h4 className="font-medium text-gray-900">Amenities</h4>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {route.amenities.map((amenity, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 text-sm bg-gray-100 rounded-full"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col mt-8 space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                      <button
                        onClick={() => openBookingModal(route)}
                        className="px-6 py-3 font-semibold text-white transition-all duration-300 bg-yellow-500 rounded-lg hover:bg-yellow-600 hover:shadow-md"
                      >
                        <Link to="/user/UserCreate">
                          <Ticket className="inline-block w-5 h-5 mr-2" />
                          Book Now
                        </Link>
                      </button>
                      <button className="px-6 py-3 font-semibold text-yellow-600 transition-all duration-300 rounded-lg bg-yellow-50 hover:bg-yellow-100">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container px-4 mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
              What Our Customers Say
            </h2>
            <p className="max-w-2xl mx-auto mt-4 text-gray-600">
              Hear from travelers who've experienced our service
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 gap-8 mt-12 md:grid-cols-3"
          >
            {testimonials.map((testimonial) => (
              <motion.div
                key={testimonial.id}
                variants={cardItem}
                whileHover={{ y: -5 }}
                className="p-8 transition-all duration-300 bg-gray-50 rounded-xl hover:shadow-md"
              >
                <div className="flex items-center">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="ml-4">
                    <h4 className="font-medium text-gray-900">
                      {testimonial.name}
                    </h4>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < testimonial.rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="mt-6 text-gray-600">"{testimonial.comment}"</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-yellow-500 to-yellow-600">
        <div className="container px-4 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center justify-between text-center md:text-left md:flex-row"
          >
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold text-white md:text-4xl">
                Ready for Your Next Journey?
              </h2>
              <p className="mt-4 text-yellow-100">
                Book your bus tickets now and enjoy a comfortable travel
                experience with premium amenities.
              </p>
            </div>
            <Link
              to="/user/UserCreate"
              className="px-8 py-4 mt-8 font-semibold text-yellow-600 transition-all duration-300 bg-white rounded-lg shadow-lg md:mt-0 hover:bg-gray-100 hover:shadow-xl"
            >
              <Ticket className="inline-block w-6 h-6 mr-2" />
              Book Your Ticket Now
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Booking Modal */}
      <AnimatePresence>
        {isBookingModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
            onClick={closeBookingModal}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="relative w-full max-w-2xl overflow-hidden bg-white rounded-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeBookingModal}
                className="absolute p-1 rounded-full top-4 right-4 hover:bg-gray-100"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>

              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900">
                  Book Your Ticket
                </h3>
                <p className="mt-2 text-gray-600">{selectedRoute?.name}</p>

                <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Departure Date
                    </label>
                    <input
                      type="date"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Number of Passengers
                    </label>
                    <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? "Passenger" : "Passengers"}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="Your full name"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Contact Number
                    </label>
                    <input
                      type="tel"
                      placeholder="Phone number"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                    />
                  </div>
                </div>

                <div className="mt-8">
                  <h4 className="font-medium text-gray-900">Seat Selection</h4>
                  <div className="grid grid-cols-4 gap-4 mt-4">
                    {[...Array(12)].map((_, index) => (
                      <button
                        key={index}
                        className="p-3 text-center transition-all duration-200 border border-gray-200 rounded-lg hover:border-yellow-400 hover:bg-yellow-50"
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between p-4 mt-8 rounded-lg bg-gray-50">
                  <div>
                    <p className="text-gray-600">Total Price</p>
                    <p className="text-xl font-bold text-yellow-600">
                      {selectedRoute?.price}
                    </p>
                  </div>
                  <button className="px-6 py-3 font-semibold text-white transition-all duration-300 bg-yellow-500 rounded-lg hover:bg-yellow-600">
                    Confirm Booking
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <Footer />
    </div>
  );
};

export default Home;
