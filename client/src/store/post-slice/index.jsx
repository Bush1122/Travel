import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const API_URL = "https://travel-zeta-three.vercel.app";

const initialState = {
  posts: [], // Initialize as empty array
  isLoading: false,
  status: null,
  error: null,
};

export const createPost = createAsyncThunk(
  "post/create",
  async (formData, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        return thunkAPI.rejectWithValue("Authentication error");
      }

      const response = await axios.post(
        `${API_URL}/api/post/create`,
        { ...formData, userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const createdPost = response.data;
      return createdPost.post; // Return just the post object
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchUserPosts = createAsyncThunk(
  "post/postuser",
  async (userId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      if (!userId) {
        throw new Error("User ID is missing");
      }

      const response = await axios.get(
        `${API_URL}/api/post/postuser/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Fetched User Posts:", response.data);
      return response.data.posts; // Return the array of posts
    } catch (error) {
      console.error("❌ Error fetching user posts:", error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create Post
      .addCase(createPost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = [action.payload, ...state.posts]; // Add new post to beginning
        state.status = "Post created successfully";
      })
      .addCase(createPost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Post creation failed";
        state.status = "failed";
      })

      // Fetch User Posts
      .addCase(fetchUserPosts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        // Change this line to properly handle the response structure
        state.posts = action.payload.posts || action.payload || [];
        state.status = "Fetch successful";
      })
      .addCase(fetchUserPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : action.payload?.message || "Failed to fetch posts";
        state.status = "failed";
      });
  },
});

export default postSlice.reducer;
