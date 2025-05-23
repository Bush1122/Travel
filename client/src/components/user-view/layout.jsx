import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { fetchUserPosts } from "../../store/post-slice";
import { useParams } from "react-router-dom";

function AdminLayout() {
  const dispatch = useDispatch();
  const { userId } = useParams(); // Get userId from URL params
  const { posts, isLoading, error } = useSelector((state) => state.posts);
  const storedUserId = localStorage.getItem("userId"); // Get userId from localStorage as fallback

  // Use the userId from URL params or fallback to localStorage
  const effectiveUserId = userId || storedUserId;

  console.log("🚀 User ID before dispatch:", effectiveUserId);

  useEffect(() => {
    if (effectiveUserId) {
      dispatch(fetchUserPosts(effectiveUserId));
    }
  }, [dispatch, effectiveUserId]);

  console.log("📌 Posts in Component:", posts, effectiveUserId);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <>
      <motion.div
        className="w-1/2 p-10 overflow-auto bg-gray-100"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="mb-4 text-2xl font-bold text-center text-gray-900">
          User Posts
        </h2>

        {/* Safe posts rendering */}
        {!posts ? (
          <p>No post data available</p>
        ) : Array.isArray(posts) ? (
          posts.length > 0 ? (
            posts.map((post) => (
              <div key={post._id} className="p-4 mb-4 bg-white rounded shadow">
                <h3 className="text-lg font-semibold">{post.title}</h3>
                <p className="text-gray-700">{post.content}</p>
              </div>
            ))
          ) : (
            <p>No posts found</p>
          )
        ) : (
          <div className="p-4 mb-4 bg-white rounded shadow">
            <h3 className="text-lg font-semibold">{posts.title}</h3>
            <p className="text-gray-700">{posts.content}</p>
          </div>
        )}
      </motion.div>
    </>
  );
}

export default AdminLayout;
