import { API_CONFIG } from '../config/api';

export interface ApiError {
  error: string;
  details?: any;
  status?: number;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export interface RequestConfig extends RequestInit {
  timeout?: number;
}

export class HttpClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_CONFIG.BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private createUrl(endpoint: string): string {
    return `${this.baseUrl}${endpoint}`;
  }

  private createConfig(options: RequestConfig = {}): RequestInit {
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    return config;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      let errorDetails: any = undefined;

      try {
        const errorData = await response.json();
        errorMessage = errorData?.error || errorMessage;
        errorDetails = errorData;
      } catch {
        errorMessage = `Erro ${response.status}: ${response.statusText}`;
      }

      throw new ApiError(errorMessage, response.status, errorDetails);
    }

    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');

    if (response.status === 204) {
      return {} as T;
    }

    if (!isJson || response.headers.get('Content-Length') === '0') {
      return {} as T;
    }

    try {
      return await response.json();
    } catch (parseError) {
      console.warn('Falha no parse JSON para resposta bem-sucedida:', parseError);
      throw new ApiError('Formato de resposta inválido do servidor');
    }
  }

  private async requestWithTimeout<T>(
    url: string,
    config: RequestInit,
    timeout: number = API_CONFIG.TIMEOUT
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });
      return await this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new ApiError(`Requisição expirou após ${timeout}ms`);
        }
        if (error instanceof ApiError) {
          throw error;
        }
        throw new ApiError(`Erro de rede: ${error.message}`);
      }
      throw new ApiError('Erro desconhecido ocorreu');
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async get<T>(endpoint: string, options: RequestConfig = {}): Promise<T> {
    const url = this.createUrl(endpoint);
    const config = this.createConfig({ ...options, method: 'GET' });
    return this.requestWithTimeout<T>(url, config, options.timeout);
  }

  async post<T>(endpoint: string, data?: any, options: RequestConfig = {}): Promise<T> {
    const url = this.createUrl(endpoint);
    const config = this.createConfig({
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
    return this.requestWithTimeout<T>(url, config, options.timeout);
  }

  async put<T>(endpoint: string, data?: any, options: RequestConfig = {}): Promise<T> {
    const url = this.createUrl(endpoint);
    const config = this.createConfig({
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
    return this.requestWithTimeout<T>(url, config, options.timeout);
  }

  async delete<T>(endpoint: string, options: RequestConfig = {}): Promise<T> {
    const url = this.createUrl(endpoint);
    const config = this.createConfig({ ...options, method: 'DELETE' });
    return this.requestWithTimeout<T>(url, config, options.timeout);
  }
}

export const httpClient = new HttpClient();
