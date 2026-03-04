import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import axiosInstance from '../../lib/axios';

// Helper function to decode JWT and extract role
const decodeToken = (token: string): { role: string; userId: string } | null => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        const payload = JSON.parse(jsonPayload);
        return { role: payload.role, userId: payload.sub };
    } catch (error) {
        console.error('Failed to decode token:', error);
        return null;
    }
};

export const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const login = useAuthStore((state) => state.login);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axiosInstance.post('/auth/login', {
                email,
                password,
            });

            const token = response.data.accessToken;
            const decoded = decodeToken(token);

            if (!decoded) {
                setError('Invalid token received. Please try again.');
                return;
            }

            // Accept both ADMIN and TEACHER roles
            if (decoded.role !== 'ADMIN' && decoded.role !== 'TEACHER') {
                setError('Access denied. This portal is for staff only.');
                return;
            }

            // Store user info with role
            login(token, { email, role: decoded.role, userId: decoded.userId });

            // Redirect based on role
            if (decoded.role === 'ADMIN') {
                navigate('/admin/dashboard');
            } else {
                navigate('/teacher/students');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container animate-fade-in">
                <div className="login-card card glass">
                    <div className="login-header">
                        <h1 className="login-title">Staff Portal</h1>
                        <p className="login-subtitle">Sign in for Admin & Teacher access</p>
                    </div>

                    {error && <div className="error-alert animate-shake">{error}</div>}

                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="input-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="staff@example.com"
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn-primary w-full"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="btn-loading">
                                    <div className="spinner-small"></div>
                                    <span>Signing in...</span>
                                </div>
                            ) : 'Sign In'}
                        </button>
                    </form>

                    <div className="login-footer">
                        <p>© 2026 Antigravity Learning Systems</p>
                    </div>
                </div>
            </div>

            <style>{`
                .login-page {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                    width: 100vw;
                    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%);
                    padding: 24px;
                }

                .login-container {
                    width: 100%;
                    max-width: 440px;
                }

                .login-card {
                    padding: 48px 40px;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                }

                .login-header {
                    text-align: center;
                    margin-bottom: 36px;
                }

                .login-title {
                    font-size: 32px;
                    font-weight: 800;
                    color: var(--text-main);
                    margin-bottom: 8px;
                    letter-spacing: -0.02em;
                }

                .login-subtitle {
                    color: var(--text-muted);
                    font-size: 15px;
                }

                .login-form {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                .input-group label {
                    display: block;
                    font-size: 14px;
                    font-weight: 600;
                    color: var(--text-secondary);
                    margin-bottom: 8px;
                }

                .input-group input {
                    width: 100%;
                    height: 48px;
                    padding: 0 16px;
                    background-color: var(--bg-main);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-md);
                    font-size: 15px;
                    transition: all 0.2s;
                }

                .input-group input:focus {
                    outline: none;
                    border-color: var(--primary);
                    background-color: white;
                    box-shadow: 0 0 0 4px var(--primary-alpha);
                }

                .error-alert {
                    background-color: #fee2e2;
                    border: 1px solid #fecaca;
                    color: #dc2626;
                    padding: 12px 16px;
                    border-radius: var(--radius-md);
                    font-size: 14px;
                    margin-bottom: 24px;
                    text-align: center;
                    font-weight: 500;
                }

                .btn-loading {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                }

                .spinner-small {
                    width: 18px;
                    height: 18px;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    border-top-color: white;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                }

                .login-footer {
                    margin-top: 36px;
                    text-align: center;
                    font-size: 13px;
                    color: var(--text-muted);
                }

                .w-full { width: 100%; }

                @media (max-width: 480px) {
                    .login-card {
                        padding: 32px 24px;
                    }
                    .login-title {
                        font-size: 26px;
                    }
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-4px); }
                    75% { transform: translateX(4px); }
                }

                .animate-shake {
                    animation: shake 0.4s ease-in-out;
                }
            `}</style>
        </div>
    );
};
