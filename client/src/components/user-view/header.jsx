import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Menu,
  Bus,
  Ticket,
  X,
  Clock,
  Info,
  Phone,
  User,
  LogOut,
} from "lucide-react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { useMousePosition } from "../../components/hook/useMousePosition";
import { logout } from "../../store/auth-slice";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeHover, setActiveHover] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const { x, y } = useMousePosition();

  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isAuthenticated);
  const isInitialized = useSelector((state) => state.auth.isInitialized);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 10);
  });

  const handleLogin = () => {
    navigate("/auth/login"); // Navigate to login page
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  // Animation configurations (same as before)
  const navBackground = {
    initial: { y: -100, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      background: isScrolled
        ? "linear-gradient(135deg, rgba(15,23,42,0.98) 0%, rgba(30,41,59,0.98) 100%)"
        : "linear-gradient(135deg, rgba(15,23,42,0.85) 0%, rgba(30,41,59,0.85) 100%)",
      backdropFilter: isScrolled ? "blur(10px)" : "blur(6px)",
      boxShadow: isScrolled ? "0 10px 30px -10px rgba(0,0,0,0.3)" : "none",
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        background: { duration: 0.3 },
      },
    },
  };

  const navItem = {
    hidden: { y: -20, opacity: 0 },
    visible: (i) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        type: "spring",
        stiffness: 150,
      },
    }),
    hover: {
      y: -3,
      color: "#facc15",
      transition: { type: "spring", stiffness: 400 },
    },
  };

  const mobileMenu = {
    open: {
      height: "auto",
      opacity: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 200,
      },
    },
    closed: {
      height: 0,
      opacity: 0,
      transition: {
        type: "spring",
        damping: 30,
        stiffness: 200,
      },
    },
  };

  const floatingCircle = {
    initial: { scale: 0, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 0.3,
      x: x - 20,
      y: y - 20,
      transition: { type: "spring", stiffness: 100 },
    },
    exit: { scale: 0, opacity: 0 },
  };

  const navLinks = [
    { path: "/user/UserCreate", name: "Ticket", icon: <Ticket size={16} /> },
    { path: "/", name: "Schedule", icon: <Clock size={16} /> },
    { path: "/about", name: "About", icon: <Info size={16} /> },
  ];

  if (!isInitialized) {
    return null; // Or show a loading spinner
  }

  return (
    <>
      {/* Floating background circle effect */}
      <AnimatePresence>
        {activeHover && (
          <motion.div
            key="floating-circle"
            className="fixed w-10 h-10 bg-yellow-400 rounded-full pointer-events-none mix-blend-screen"
            variants={floatingCircle}
            initial="initial"
            animate="animate"
            exit="exit"
          />
        )}
      </AnimatePresence>

      {/* Main Navbar */}
      <motion.nav
        initial="initial"
        animate="animate"
        variants={navBackground}
        className="fixed top-0 z-50 w-full text-white border-b border-gray-800"
      >
        <div className="px-6 mx-auto max-w-7xl sm:px-8 lg:px-10">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <motion.div
              className="flex items-center"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              whileHover={{
                rotateY: [0, 10, -10, 0],
                transition: { duration: 0.8 },
              }}
            >
              <motion.div
                animate={{
                  rotate: [0, 5, -5, 0],
                  transition: { repeat: Infinity, duration: 8, ease: "linear" },
                }}
              >
                <Bus size={36} className="mr-3 text-yellow-400" />
              </motion.div>
              <motion.h1
                className="text-3xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600"
                whileHover={{
                  scale: 1.05,
                  textShadow: "0 0 10px rgba(250,204,21,0.5)",
                }}
              >
                BusVista
              </motion.h1>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="flex items-center">
              <motion.div
                className="hidden space-x-8 md:flex"
                initial="hidden"
                animate="visible"
              >
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.path}
                    custom={i}
                    variants={navItem}
                    onHoverStart={() => setActiveHover(link.name)}
                    onHoverEnd={() => setActiveHover(null)}
                    className="relative"
                  >
                    <Link
                      to={link.path}
                      className={`flex items-center px-1 py-2 text-sm font-medium uppercase tracking-wider transition-colors ${
                        location.pathname === link.path
                          ? "text-yellow-400"
                          : "text-gray-300 hover:text-yellow-400"
                      }`}
                    >
                      <span className="mr-2">{link.icon}</span>
                      {link.name}
                    </Link>
                    {location.pathname === link.path && (
                      <motion.div
                        className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-400"
                        layoutId="navIndicator"
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    )}
                  </motion.div>
                ))}
              </motion.div>

              {/* Auth Button - Desktop */}
              <motion.div
                className="hidden ml-8 md:block"
                variants={navItem}
                custom={navLinks.length + 1}
              >
                {isLoggedIn ? (
                  <motion.button
                    onClick={handleLogout}
                    className="flex items-center px-4 py-2 text-sm font-medium text-white uppercase bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </motion.button>
                ) : (
                  <motion.button
                    onClick={handleLogin}
                    className="flex items-center px-4 py-2 text-sm font-medium text-white uppercase bg-yellow-600 rounded-lg hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <User size={16} className="mr-2" />
                    Login
                  </motion.button>
                )}
              </motion.div>
            </div>

            {/* Mobile Menu Button */}
            <motion.div className="md:hidden" whileTap={{ scale: 0.9 }}>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50"
                aria-label="Toggle menu"
              >
                {isOpen ? (
                  <X size={28} className="text-yellow-400" />
                ) : (
                  <Menu size={28} />
                )}
              </button>
            </motion.div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                key="mobile-menu"
                initial="closed"
                animate="open"
                exit="closed"
                variants={mobileMenu}
                className="overflow-hidden md:hidden"
              >
                <div className="flex flex-col py-4 space-y-4">
                  {navLinks.map((link) => (
                    <motion.div
                      key={link.path}
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        to={link.path}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center px-4 py-3 text-lg font-medium rounded-lg transition-colors ${
                          location.pathname === link.path
                            ? "bg-gray-800 text-yellow-400"
                            : "text-gray-300 hover:bg-gray-800 hover:text-yellow-400"
                        }`}
                      >
                        <span className="mr-3">{link.icon}</span>
                        {link.name}
                      </Link>
                    </motion.div>
                  ))}
                  {/* Auth Button - Mobile */}
                  <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}>
                    {isLoggedIn ? (
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsOpen(false);
                        }}
                        className="flex items-center w-full px-4 py-3 text-lg font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                      >
                        <LogOut size={18} className="mr-3" />
                        Logout
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          handleLogin();
                          setIsOpen(false);
                        }}
                        className="flex items-center w-full px-4 py-3 text-lg font-medium text-white bg-yellow-600 rounded-lg hover:bg-yellow-700"
                      >
                        <User size={18} className="mr-3" />
                        Login
                      </button>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>
    </>
  );
};

export default Navbar;
