import { handleResponse } from '@/helpers/response';
import { KEY } from '../shared/constants/constantStorage';

export class ApiClient {
  private static instance: ApiClient;
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  private constructor() {
    this.baseURL = import.meta.env.PUBLIC_API_URL;
    console.log(this.baseURL);
    this.defaultHeaders = {
      Role: 'user',
    };
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  private async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    url: string,
    data?: object | FormData,
    withAuth = true,
  ): Promise<T> {
    const headers: Record<string, string> = { ...this.defaultHeaders };

    if (withAuth) {
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith(`${KEY.cookie.auth.name}=`))
        ?.split('=')[1];
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    const isFormData = data instanceof FormData;

    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
      headers['Accept'] = 'application/json';
    }

    const options: RequestInit = {
      method,
      headers: headers,
      body: data ? (isFormData ? data : JSON.stringify(data)) : undefined,
    };

    const response = await fetch(`${this.baseURL}${url}`, options);
    return await handleResponse(response);
  }

  public async get<T>(url: string, withAuth = true): Promise<T> {
    return this.request<T>('GET', url, undefined, withAuth);
  }

  public async post<T>(
    url: string,
    data: object | FormData,
    withAuth = true,
  ): Promise<T> {
    return this.request<T>('POST', url, data, withAuth);
  }

  public async put<T>(
    url: string,
    data: object | FormData,
    withAuth = true,
  ): Promise<T> {
    return this.request<T>('PUT', url, data, withAuth);
  }

  public async patch<T>(
    url: string,
    data: object | FormData,
    withAuth = true,
  ): Promise<T> {
    let requestData: FormData | object;

    if (data instanceof FormData) {
      data.append('_method', 'PATCH');
      requestData = data;
    } else {
      requestData = { _method: 'PATCH', ...data };
    }

    return this.request<T>('POST', url, requestData, withAuth);
  }

  public async delete<T>(
    url: string,
    data: object | FormData,
    withAuth = true,
  ): Promise<T> {
    return this.request<T>('DELETE', url, data, withAuth);
  }
}
