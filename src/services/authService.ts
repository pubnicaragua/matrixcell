import api from "../axiosConfig"

interface User {
  id: string
  email: string
  // Add other user properties as needed
}

interface AuthResponse {
  token: string
  user: User
  usuario: any // Replace 'any' with a more specific type if possible
  permissions: string[]
}

class AuthService {
  private static instance: AuthService
  private user: User | null = null

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  async login(email: string, password: string): Promise<void> {
    try {
      // First, clear any existing session
      this.clearSession()

      const response = await api.post<AuthResponse>("auth/login", { email, password })
      this.setSession(response.data)

      // Verify that the new session was set correctly
      this.verifySession()
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  logout(): void {
    this.clearSession()
  }

  private clearSession(): void {
    localStorage.clear()
    sessionStorage.clear()
    this.user = null
  }

  private setSession(authResponse: AuthResponse): void {
    localStorage.setItem("token", authResponse.token)
    localStorage.setItem("user", JSON.stringify(authResponse.user))
    localStorage.setItem("perfil", JSON.stringify(authResponse.usuario))
    localStorage.setItem("permisos", JSON.stringify(authResponse.permissions))
    this.user = authResponse.user
  }

  private verifySession(): void {
    console.log("Verifying session...")
    console.log("Token:", localStorage.getItem("token"))
    console.log("User:", localStorage.getItem("user"))
    console.log("Perfil:", localStorage.getItem("perfil"))
    console.log("Permisos:", localStorage.getItem("permisos"))
  }

  getUser(): User | null {
    if (!this.user) {
      const userStr = localStorage.getItem("user")
      if (userStr) {
        this.user = JSON.parse(userStr)
      }
    }
    return this.user
  }

  isAuthenticated(): boolean {
    return !!this.getUser()
  }
}

export default AuthService.getInstance()

