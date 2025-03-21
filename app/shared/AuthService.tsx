import { jwtDecode } from 'jwt-decode';
import { redirect } from 'next/navigation';
import UserModel from '../models/UserModel';

interface JwtPayload {
  Id: number;
  Name: string;
  Email: string;
  UserName: string;
  exp: number;
}

class AuthService {
  private token: string;
  private user: UserModel;

  constructor() {
    this.token = '';
    this.user = new UserModel();
  }

  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    
    this.token = localStorage.getItem('token') ?? '';
    
    if (!this.token) {
      redirect('/login');
      return false;
    }

    try {
      const decoded = jwtDecode<JwtPayload>(this.token);
      const now = Math.floor(Date.now() / 1000);

      if (now > decoded.exp) {
        this.logout();
        return false;
      }

      this.user = {
        id: decoded.Id,
        name: decoded.Name,
        email: decoded.Email,
        userName: decoded.UserName
      };

      return true;
    } catch (error) {
      console.error('Token decode error:', error);
      this.logout();
      return false;
    }
  }

  getToken(): string {
    let token = localStorage.getItem('token') ?? '';
    return token;
  }

  getUser(): UserModel {
    return this.user;
  }

  logout(): void {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem('token');
    this.token = '';
    this.user = new UserModel();
    redirect('/login');
  }
}

// Create a singleton instance
const authService = new AuthService();
export default authService;