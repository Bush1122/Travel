import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://travel-olive-iota.vercel.app/";

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  isLoading: false,
  user: null,
  token: localStorage.getItem("token") || null,
  error: null,
};

// ✅ Register User
export const registerUser = createAsyncThunk(
  "auth/register",
  async (formData, thunkAPI) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/auth/register`,
        formData,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ✅ Login User
export const loginUser = createAsyncThunk(
  "auth/login",
  async (formData, thunkAPI) => {
    try {
      console.log("Login Form Data:", formData);
      const response = await axios.post(`${API_URL}/api/auth/login`, formData, {
        withCredentials: true,
      });
      console.log("Login successful:", response.data);
      return response.data;
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ✅ Verify User
export const verifyUser = createAsyncThunk(
  "auth/verify",
  async (formData, thunkAPI) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/auth/verify`,
        formData,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const checkAuthStatus = () => (dispatch) => {
  const token = localStorage.getItem("token"); // Example: Check token
  if (token) {
    dispatch(
      setUser({
        /* user data */
      })
    );
  }
  dispatch(setInitialized()); // Mark auth as initialized
};

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/auth/logout`,
        {},
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      return null;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    setUser: (state, action) => {
      console.log("Redux Store Update:", action.payload);
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      state.isInitialized = true;
    },
    setInitialized(state) {
      state.isInitialized = true;
    },
  },

  extraReducers: (builder) => {
    builder
      // ✅ Register User
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload || "Registration failed";
        console.error("Registration failed:", action.payload);
      })

      // ✅ Verify User
      .addCase(verifyUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(verifyUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })

      // ✅ Login User
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.token = action.payload.token;

        console.log("Stored User:", action.payload.user);

        localStorage.setItem("token", action.payload.token);
        localStorage.setItem(
          "userId",
          action.payload.user._id || action.payload.user.id
        );
        console.log("Stored User:", action.payload.user);
        console.log("Stored Token:", action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload || "Login failed";
        console.error("Login failed:", action.payload);
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
        localStorage.removeItem("token");
      })
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setUser, logout, setInitialized } = authSlice.actions;

export default authSlice.reducer;
