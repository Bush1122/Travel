import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams, Link } from "react-router-dom";
import Commonform from "../../components/common/form";
import { createPost, fetchUserPosts } from "../../store/post-slice";
import { createUserPost } from "../../config/index";
import Header from "../../components/user-view/header";
import Footer from "../../components/user-view/footer";
import { Ticket, ArrowRight } from "lucide-react";

const UserCreate = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userId } = useParams();

  const { posts } = useSelector((state) => state.posts);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const storedUserId = localStorage.getItem("userId");
  const effectiveUserId = userId || storedUserId;

  useEffect(() => {
    if (effectiveUserId) {
      dispatch(fetchUserPosts(effectiveUserId));
    }
  }, [dispatch, effectiveUserId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setAlert(null);

    try {
      await dispatch(createPost(formData)).unwrap();
      setAlert({ type: "success", message: "Ticket booked successfully!" });
      setFormData({ title: "", content: "" }); // Reset form

      // Auto-redirect after 2 seconds
      setTimeout(() => navigate("../userPost"), 2000);
    } catch (err) {
      setAlert({
        type: "error",
        message: err.message || "Booking failed! Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen px-4 py-12 mt-10 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-md mx-auto"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8 text-center">
            <motion.div
              className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-yellow-500 rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Ticket className="w-8 h-8 text-gray-900" />
            </motion.div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-100">
              Welcome,{" "}
              <span className="text-yellow-400">
                {posts?.[0]?.user?.name || "Guest"}
              </span>
            </h1>
            <p className="mt-2 text-gray-400">
              Fill in the details to book your ticket
            </p>
          </div>

          <motion.div
            className="px-6 py-8 bg-gray-800 border border-gray-700 shadow-lg rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {alert && (
              <motion.div
                className={`${
                  alert.type === "success" ? "bg-green-600" : "bg-red-600"
                } p-3 rounded-md mb-6 text-white flex items-center`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {alert.type === "success" ? (
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                )}
                {alert.message}
              </motion.div>
            )}

            <Commonform
              formControls={createUserPost}
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              buttonText={
                isLoading ? (
                  "Processing..."
                ) : (
                  <span className="flex items-center justify-center">
                    Book Now <ArrowRight className="w-4 h-4 ml-2" />
                  </span>
                )
              }
              buttonClass={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-900 ${
                isLoading
                  ? "bg-yellow-700"
                  : "bg-yellow-500 hover:bg-yellow-600"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-all duration-200`}
              buttonDisabled={isLoading}
              inputClass="block w-full px-4 py-3 rounded-md bg-gray-700 border border-gray-600 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
              labelClass="block text-sm font-medium text-gray-300 mb-1"
            />

            <div className="pt-6 mt-6 border-t border-gray-700">
              <div className="flex items-center justify-center text-sm text-gray-400">
                <Link
                  to="../userPost"
                  className="text-yellow-500 hover:text-yellow-400"
                >
                  View your bookings
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
      <Footer />
    </>
  );
};

export default UserCreate;
