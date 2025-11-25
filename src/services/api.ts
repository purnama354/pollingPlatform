import axios from "axios"
import {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  User,
} from "../interfaces/auth"

const API_URL = "http://localhost:8080/api"

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
})

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If the error status is 401 and we haven't already tried to refresh the token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem("refresh_token")
        if (!refreshToken) {
          throw new Error("No refresh token available")
        }

        // Try to refresh the token
        const response = await api.post<AuthResponse>("/refresh-token", {
          refresh_token: refreshToken,
        })

        // Store new tokens
        localStorage.setItem("access_token", response.data.access_token)
        localStorage.setItem("refresh_token", response.data.refresh_token)

        // Update the original request with new token
        originalRequest.headers.Authorization = `Bearer ${response.data.access_token}`

        // Retry the original request
        return api(originalRequest)
      } catch (refreshError) {
        // If refresh fails, logout the user
        localStorage.removeItem("access_token")
        localStorage.removeItem("refresh_token")
        window.location.href = "/login"
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export const authService = {
  async register(credentials: RegisterCredentials): Promise<void> {
    try {
      await api.post("/register", credentials)
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.error ||
          error.response?.data?.details ||
          "Registration failed"
        throw new Error(errorMessage)
      }
      throw error
    }
  },

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>("/login", credentials)
      localStorage.setItem("access_token", response.data.access_token)
      localStorage.setItem("refresh_token", response.data.refresh_token)
      return response.data
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || "Login failed"
        throw new Error(errorMessage)
      }
      throw error
    }
  },

  async refreshToken(): Promise<AuthResponse> {
    const refreshToken = localStorage.getItem("refresh_token")
    if (!refreshToken) {
      throw new Error("No refresh token available")
    }

    const response = await api.post<AuthResponse>("/refresh-token", {
      refresh_token: refreshToken,
    })

    localStorage.setItem("access_token", response.data.access_token)
    localStorage.setItem("refresh_token", response.data.refresh_token)
    return response.data
  },

  async getMe(): Promise<User> {
    try {
      const response = await api.get<{ user: User }>("/me")
      return response.data.user
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.error || "Failed to fetch user data"
        throw new Error(errorMessage)
      }
      throw error
    }
  },

  logout(): void {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    // Optional: Clear any other stored user data
    window.location.href = "/login"
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem("access_token")
  },

  getToken(): string | null {
    return localStorage.getItem("access_token")
  },
}

export default api
