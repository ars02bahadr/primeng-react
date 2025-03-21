import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { api } from '../constant';
import authService from './AuthService';
import errorService from './ErrorService';

interface HttpResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
}

class HttpService {
  private auth = authService;
  private errorService = errorService;
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: api,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Add request interceptor for auth token
    this.axiosInstance.interceptors.request.use(
      (config: any) => {
        const token = this.auth.getToken();
        if (token) {
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${token}`
          };
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        this.errorService.errorHandler(error);
        return Promise.reject(error);
      }
    );
  }

  async get<T = any>(apiUrl: string, config?: AxiosRequestConfig): Promise<HttpResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.get(apiUrl, config);
      return {
        data: response.data,
        status: response.status,
        statusText: response.statusText
      };
    } catch (error) {
      throw error;
    }
  }

  async post<T = any>(apiUrl: string, body?: any, config?: AxiosRequestConfig): Promise<HttpResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.post(apiUrl, body, config);
      return {
        data: response.data,
        status: response.status,
        statusText: response.statusText
      };
    } catch (error) {
      throw error;
    }
  }

  async put<T = any>(apiUrl: string, body?: any, config?: AxiosRequestConfig): Promise<HttpResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.put(apiUrl, body, config);
      return {
        data: response.data,
        status: response.status,
        statusText: response.statusText
      };
    } catch (error) {
      throw error;
    }
  }

  async delete<T = any>(apiUrl: string, config?: AxiosRequestConfig): Promise<HttpResponse<T>> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.delete(apiUrl, config);
      return {
        data: response.data,
        status: response.status,
        statusText: response.statusText
      };
    } catch (error) {
      throw error;
    }
  }
}

// Create a singleton instance
const httpService = new HttpService();
export default httpService;
