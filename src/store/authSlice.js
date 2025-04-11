import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Récupérer les données d'authentification depuis localStorage
const getAuthFromStorage = () => {
  try {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    return {
      token,
      user: user ? JSON.parse(user) : null,
      isAuthenticated: !!user,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des données d'authentification:", error);
    return {
      token: null,
      user: null,
      isAuthenticated: false,
    };
  }
};

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const user = await authService.login(email, password);
      return { user };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const initialState = {
  user: null,
  isAuthenticated: localStorage.getItem('isAuthenticated') === 'true',
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
      
      // Sauvegarder dans localStorage
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      
      // Supprimer du localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      });
  }
});

export const { loginStart, loginSuccess, loginFailure, logout, clearError } = authSlice.actions;
export default authSlice.reducer;