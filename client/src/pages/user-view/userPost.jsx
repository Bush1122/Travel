import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fetchUserPosts } from "../../store/post-slice/index";
import { deleteFunction } from "../../store/delete-slice/index";
import { useParams } from "react-router-dom";
import Header from "../../components/user-view/header";
import Footer from "../../components/user-view/footer";
import { Edit, Trash2, RefreshCw, Search } from "lucide-react";
import { Link } from "react-router-dom";

function UserPost() {
  const dispatch = useDispatch();
  const { userId } = useParams();

  const {
    posts,
    isLoading: postsLoading,
    error: postsError,
  } = useSelector((state) => state.posts);

  const { status: deleteStatus, error: deleteError } = useSelector(
    (state) => state.delete
  );

  const [searchQuery, setSearchQuery] = useState("");

  const storedUserId = localStorage.getItem("userId");
  const effectiveUserId = userId || storedUserId;

  useEffect(() => {
    if (effectiveUserId) {
      dispatch(fetchUserPosts(effectiveUserId));
    }
  }, [dispatch, effectiveUserId]);

  const handleDelete = (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      dispatch(deleteFunction(postId))
        .unwrap()
        .then(() => {
          // Refetch posts after successful deletion
          dispatch(fetchUserPosts(effectiveUserId));
        })
        .catch((error) => {
          console.error("Delete failed:", error);
        });
    }
  };

  const handleRefresh = () => {
    if (effectiveUserId) {
      dispatch(fetchUserPosts(effectiveUserId));
    }
  };

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (postsLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (postsError) {
    return (
      <div className="py-10 text-center text-red-500">Error: {postsError}</div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen px-4 py-8 lg:px-8">
        <motion.div
          className="max-w-6xl mx-auto mt-2 overflow-hidden bg-white shadow-md rounded-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header Section */}
          <div className="p-6 mt-10 text-white bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 sm:px-6 ">
            <h2 className="text-2xl font-bold">User Posts Dashboard</h2>
            <div className="flex items-center justify-between mt-4">
              <div>
                <p className="text-indigo-100">User ID: {effectiveUserId}</p>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="w-5 h-5 text-indigo-200" />
                </div>
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="py-2 pl-10 pr-4 text-white placeholder-indigo-200 bg-indigo-400 rounded-lg bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
              </div>
            </div>
          </div>

          {/* User Info Section */}
          <div className="p-6 border-b border-gray-200">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  User Information
                </h3>
                <div className="mt-2 space-y-2">
                  <p className="text-gray-600">
                    Username: {posts?.[0]?.user?.name || "N/A"}
                  </p>
                  <p className="text-gray-600">
                    UserEmail: {posts?.[0]?.user?.email || "N/A"}
                  </p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Statistics
                </h3>
                <div className="mt-2 space-y-2">
                  <p className="text-gray-600">
                    <span className="font-medium">Total Posts:</span>{" "}
                    {Array.isArray(posts) ? posts.length : posts ? 1 : 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Posts Section */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Posts</h3>
              <div className="flex space-x-3">
                <button
                  onClick={handleRefresh}
                  className="flex items-center px-4 py-2 text-white transition bg-indigo-600 rounded-lg hover:bg-indigo-700"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </button>
              </div>
            </div>

            {/* Status messages */}
            {deleteStatus === "loading" && (
              <div className="p-4 mb-4 text-center text-blue-600">
                Deleting post...
              </div>
            )}

            {deleteError && (
              <div className="p-4 mb-4 text-center text-red-600">
                Error: {deleteError.message || "Failed to delete post"}
              </div>
            )}

            {!filteredPosts.length === 0 ? (
              <p className="py-10 text-center text-gray-500">
                {searchQuery ? "No matching posts found" : "No posts found"}
              </p>
            ) : (
              <div className="space-y-6">
                {filteredPosts.map((post) => (
                  <motion.div
                    key={post._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="p-5 transition border border-gray-200 rounded-lg hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">
                          {post.title}
                        </h3>
                        <p className="mt-2 text-gray-600">{post.content}</p>
                        <p>Date: {new Date(post.date).toLocaleDateString()}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Link
                          to={`/edit/${post._id}`}
                          className="p-2 text-indigo-600 rounded-full hover:bg-indigo-50"
                        >
                          <Edit className="w-5 h-5" />
                        </Link>

                        <button
                          onClick={() => handleDelete(post._id)}
                          disabled={deleteStatus === "loading"}
                          className={`p-2 rounded-full ${
                            deleteStatus === "loading"
                              ? "bg-gray-200 cursor-not-allowed"
                              : "text-red-600 hover:bg-red-50"
                          }`}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
      <Footer />
    </>
  );
}

export default UserPost;
