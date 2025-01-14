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
})

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/login", credentials)
    localStorage.setItem("access_token", response.data.access_token)
    localStorage.setItem("refresh_token", response.data.refresh_token)
    return response.data
  },

  async register(credentials: RegisterCredentials): Promise<void> {
    await api.post("/register", credentials)
  },

  async refreshToken(): Promise<AuthResponse> {
    const refreshToken = localStorage.getItem("refresh_token")
    const response = await api.post<AuthResponse>("/refresh-token", {
      refresh_token: refreshToken,
    })
    localStorage.setItem("access_token", response.data.access_token)
    localStorage.setItem("refresh_token", response.data.refresh_token)
    return response.data
  },

  async getMe(): Promise<User> {
    const response = await api.get<{ user: User }>("/me")
    return response.data.user
  },

  logout() {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
  },
}

// Add axios interceptors for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        await authService.refreshToken()
        const token = localStorage.getItem("access_token")
        originalRequest.headers.Authorization = `Bearer ${token}`
        return api(originalRequest)
      } catch (refreshError) {
        authService.logout()
        window.location.href = "/login"
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)
