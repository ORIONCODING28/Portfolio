import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of, BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: User;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = environment.apiUrl;
  private readonly TOKEN_KEY = 'portfolio_token';
  private readonly REFRESH_TOKEN_KEY = 'portfolio_refresh_token';
  private readonly USER_KEY = 'portfolio_user';

  // Signals for reactive state
  private _user = signal<User | null>(null);
  private _token = signal<string | null>(null);
  private _isLoading = signal<boolean>(false);

  // Computed signals
  readonly user = this._user.asReadonly();
  readonly token = this._token.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly isAuthenticated = computed(() => !!this._token() && !!this._user());
  readonly isAdmin = computed(() => this._user()?.role === 'admin');

  // Observable for components that need it
  private authState$ = new BehaviorSubject<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true
  });

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.initializeAuth();
  }

  /**
   * Initialize authentication state from localStorage
   */
  private initializeAuth(): void {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const userJson = localStorage.getItem(this.USER_KEY);

    if (token && userJson) {
      try {
        const user = JSON.parse(userJson);
        this._token.set(token);
        this._user.set(user);
        this.updateAuthState();
        
        // Verify token is still valid
        this.verifyToken().subscribe();
      } catch {
        this.clearAuth();
      }
    }

    this._isLoading.set(false);
    this.updateAuthState();
  }

  /**
   * Update the BehaviorSubject with current state
   */
  private updateAuthState(): void {
    this.authState$.next({
      user: this._user(),
      token: this._token(),
      isAuthenticated: this.isAuthenticated(),
      isLoading: this._isLoading()
    });
  }

  /**
   * Login with email and password
   */
  login(email: string, password: string): Observable<LoginResponse> {
    this._isLoading.set(true);
    this.updateAuthState();

    return this.http.post<LoginResponse>(`${this.API_URL}/auth/login`, { email, password }).pipe(
      tap(response => {
        this.setAuth(response);
        this._isLoading.set(false);
        this.updateAuthState();
      }),
      catchError(error => {
        this._isLoading.set(false);
        this.updateAuthState();
        throw error;
      })
    );
  }

  /**
   * Logout and clear all auth data
   */
  logout(): Observable<void> {
    const token = this._token();
    
    // Clear local state immediately
    this.clearAuth();
    this.router.navigate(['/admin/login']);

    // Notify server (fire and forget)
    if (token) {
      return this.http.post<void>(`${this.API_URL}/auth/logout`, {}).pipe(
        catchError(() => of(undefined))
      );
    }

    return of(undefined);
  }

  /**
   * Verify current token is valid
   */
  verifyToken(): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/auth/me`).pipe(
      tap(user => {
        this._user.set(user);
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
        this.updateAuthState();
      }),
      catchError(error => {
        if (error.status === 401) {
          this.clearAuth();
        }
        throw error;
      })
    );
  }

  /**
   * Refresh the access token
   */
  refreshToken(): Observable<{ token: string }> {
    const refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);
    
    if (!refreshToken) {
      this.clearAuth();
      throw new Error('No refresh token available');
    }

    return this.http.post<{ token: string }>(`${this.API_URL}/auth/refresh`, { refreshToken }).pipe(
      tap(response => {
        this._token.set(response.token);
        localStorage.setItem(this.TOKEN_KEY, response.token);
        this.updateAuthState();
      }),
      catchError(error => {
        this.clearAuth();
        throw error;
      })
    );
  }

  /**
   * Set authentication data
   */
  private setAuth(response: LoginResponse): void {
    this._token.set(response.token);
    this._user.set(response.user);
    
    localStorage.setItem(this.TOKEN_KEY, response.token);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, response.refreshToken);
    localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
  }

  /**
   * Clear all authentication data
   */
  private clearAuth(): void {
    this._token.set(null);
    this._user.set(null);
    
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    
    this.updateAuthState();
  }

  /**
   * Get the current token for HTTP interceptor
   */
  getToken(): string | null {
    return this._token();
  }

  /**
   * Get auth state as observable
   */
  getAuthState(): Observable<AuthState> {
    return this.authState$.asObservable();
  }
}
