import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updatePost, resetUpdateStatus } from "../../store/update-slice";
import { fetchUserPosts } from "../../store/post-slice/index";
import { useParams } from "react-router-dom";
import Header from "../../components/user-view/header";
import Footer from "../../components/user-view/footer";
import { Edit, Trash2, RefreshCw, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function UpdateUser() {
  const dispatch = useDispatch();
  const { userId } = useParams();

  const [editingPostId, setEditingPostId] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const { posts = [], loading: postsLoading } = useSelector(
    (state) => state.posts
  );
  const { status: updateStatus = "idle", error: updateError = null } =
    useSelector((state) => state.updatePost || {});

  const currentUserId = userId || localStorage.getItem("userId");

  useEffect(() => {
    if (currentUserId) {
      dispatch(fetchUserPosts(currentUserId));
    }
  }, [dispatch, currentUserId]);

  useEffect(() => {
    if (updateStatus === "succeeded") {
      const timer = setTimeout(() => {
        dispatch(resetUpdateStatus());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [updateStatus, dispatch]);

  const handleRefresh = () => {
    if (currentUserId) {
      dispatch(fetchUserPosts(currentUserId));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingPostId) {
      dispatch(
        updatePost({
          postId: editingPostId,
          updatedData: { title, content },
        })
      ).then(() => {
        dispatch(fetchUserPosts(currentUserId));
        setEditingPostId(null);
      });
    }
  };

  const startEditing = (post) => {
    setEditingPostId(post._id);
    setTitle(post.title);
    setContent(post.content);
  };

  const cancelEditing = () => {
    setEditingPostId(null);
  };

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Header />
      <div className="min-h-screen px-4 py-8 bg-gray-50 lg:px-8">
        <motion.div
          className="max-w-6xl mx-auto mt-2 overflow-hidden bg-white shadow-md rounded-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header Section */}
          <div className="p-6 mt-10 text-white bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 sm:px-6">
            <h2 className="text-2xl font-bold">User Update Dashboard</h2>
            <div className="flex flex-col items-center justify-between mt-4 space-y-4 sm:flex-row sm:space-y-0">
              <div>
                <p className="text-indigo-100">User ID: {currentUserId}</p>
              </div>
              <div className="relative w-full sm:w-64">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="w-5 h-5 text-indigo-200" />
                </div>
                <input
                  type="text"
                  placeholder="Search posts..."
                  className="w-full py-2 pl-10 pr-4 text-white placeholder-indigo-200 bg-indigo-400 rounded-lg bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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
            <div className="flex flex-col items-start justify-between mb-6 space-y-4 sm:flex-row sm:space-y-0">
              <h3 className="text-lg font-medium text-gray-900">Posts</h3>
              <div className="flex space-x-3">
                <button
                  onClick={handleRefresh}
                  className="flex items-center px-4 py-2 text-white transition bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={postsLoading}
                >
                  <RefreshCw
                    className={`w-4 h-4 mr-2 ${
                      postsLoading ? "animate-spin" : ""
                    }`}
                  />
                  {postsLoading ? "Loading..." : "Refresh"}
                </button>
              </div>
            </div>

            {/* Status Messages */}
            {updateStatus === "loading" && (
              <div className="p-3 mb-4 text-blue-700 bg-blue-100 rounded-lg">
                Updating post...
              </div>
            )}
            {updateError && (
              <div className="p-3 mb-4 text-red-700 bg-red-100 rounded-lg">
                Error: {updateError}
              </div>
            )}
            {updateStatus === "succeeded" && (
              <div className="p-3 mb-4 text-green-700 bg-green-100 rounded-lg">
                Post updated successfully!
              </div>
            )}

            {postsLoading ? (
              <div className="flex justify-center py-10">
                <div className="w-8 h-8 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
              </div>
            ) : !filteredPosts || filteredPosts.length === 0 ? (
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
                    {editingPostId === post._id ? (
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          required
                        />
                        <textarea
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          rows="4"
                          required
                        />
                        <div className="flex space-x-2">
                          <button
                            type="submit"
                            className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={cancelEditing}
                            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">
                          {post.title}
                        </h3>
                        <p className="mt-2 text-gray-600">{post.content}</p>
                        <div className="flex mt-4 space-x-3">
                          <button
                            onClick={() => startEditing(post)}
                            className="flex items-center px-3 py-1 text-white bg-yellow-500 rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={cancelEditing}
                            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
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

export default UpdateUser;
