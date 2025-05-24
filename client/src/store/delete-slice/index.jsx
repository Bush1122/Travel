import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://travel-iota-neon.vercel.app/";

export const deleteFunction = createAsyncThunk(
  "posts/deletePost",
  async (postId, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.delete(
        `${API_URL}/api/post/deletepost/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data; // Should contain deletedPost: { id: ... }
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const deleteSlice = createSlice({
  name: "delete", // Changed from "posts" to avoid confusion
  initialState: {
    status: "idle",
    error: null,
    deletedId: null, // Track the deleted ID separately
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(deleteFunction.pending, (state) => {
        // Changed to deleteFunction
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteFunction.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.deletedId = action.payload.deletedPost?.id;
      })
      .addCase(deleteFunction.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default deleteSlice.reducer;
