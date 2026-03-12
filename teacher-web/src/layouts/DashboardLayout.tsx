import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Users, Video, LogOut, GraduationCap, Layout, Menu, X } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export const DashboardLayout = () => {
    const location = useLocation();
    const logout = useAuthStore((state) => state.logout);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const menuItems = [
        { path: '/students', icon: Users, label: 'Students' },
        { path: '/recordings', icon: Video, label: 'Upload Videos' },
        { path: '/manage-videos', icon: Layout, label: 'Manage Videos' },
    ];

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <div className="dashboard-container">
            {/* Mobile Overlay */}
            <div
                className={`mobile-overlay ${isMobileMenuOpen ? 'active' : ''}`}
                onClick={closeMobileMenu}
            />

            {/* Sidebar */}
            <aside className={`sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
                <div className="logo-section">
                    <div className="logo-icon">
                        <GraduationCap size={20} strokeWidth={2.5} />
                    </div>
                    <span className="logo-text">TeacherHub</span>
                </div>

                <nav className="sidebar-nav">
                    <div className="nav-group">
                        <p className="nav-group-title">Menu</p>
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`nav-link ${isActive ? 'active' : ''}`}
                                    onClick={closeMobileMenu}
                                >
                                    <Icon size={18} strokeWidth={2} />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                </nav>

                <div className="sidebar-footer">
                    <button onClick={() => logout()} className="logout-button">
                        <LogOut size={18} strokeWidth={2} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="main-wrapper">
                <header className="dashboard-header glass">
                    <div className="header-left">
                        <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                        <Layout size={18} className="text-muted" />
                        <h2 className="page-heading">
                            {menuItems.find((m) => m.path === location.pathname)?.label || 'Dashboard'}
                        </h2>
                    </div>

                    <div className="header-right">
                        <div className="user-info">
                            <div className="user-details">
                                <p className="user-name">Teacher Account</p>
                                <p className="user-role">Administrator</p>
                            </div>
                            <div className="user-avatar">T</div>
                        </div>
                    </div>
                </header>

                <main className="dashboard-content animate-fade-in">
                    <Outlet />
                </main>
            </div>

            <style>{`
                .sidebar {
                    width: var(--sidebar-w);
                    background-color: var(--bg-sidebar);
                    border-right: 1px solid var(--border);
                    display: flex;
                    flex-direction: column;
                    height: 100vh;
                    position: sticky;
                    top: 0;
                    z-index: 50;
                }

                .logo-section {
                    padding: 16px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    border-bottom: 1px solid var(--border);
                    min-height: 56px;
                }

                .logo-icon {
                    width: 32px;
                    height: 32px;
                    background: linear-gradient(135deg, var(--primary), var(--primary-hover));
                    border-radius: var(--radius-md);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    flex-shrink: 0;
                }

                .logo-text {
                    font-size: 15px;
                    font-weight: 700;
                    color: var(--text-main);
                    letter-spacing: -0.02em;
                }

                .sidebar-nav {
                    flex: 1;
                    padding: 12px 10px;
                    overflow-y: auto;
                }

                .nav-group {
                    display: flex;
                    flex-direction: column;
                }

                .nav-group-title {
                    font-size: 10px;
                    font-weight: 600;
                    color: var(--text-muted);
                    padding: 0 10px 6px 10px;
                    letter-spacing: 0.05em;
                    text-transform: uppercase;
                    margin-bottom: 2px;
                }

                .nav-link {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 10px;
                    border-radius: var(--radius-md);
                    color: var(--text-secondary);
                    text-decoration: none;
                    font-weight: 500;
                    font-size: 14px;
                    transition: all 0.15s ease;
                    margin-bottom: 2px;
                }

                .nav-link:hover {
                    background-color: var(--bg-main);
                    color: var(--text-main);
                }

                .nav-link.active {
                    background-color: var(--primary);
                    color: white;
                    font-weight: 600;
                }

                .nav-link svg {
                    flex-shrink: 0;
                }

                .sidebar-footer {
                    padding: 12px 10px;
                    border-top: 1px solid var(--border);
                }

                .logout-button {
                    width: 100%;
                    color: var(--text-secondary);
                    justify-content: flex-start;
                    padding: 10px;
                    border-radius: var(--radius-md);
                    font-weight: 500;
                    font-size: 14px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .logout-button:hover {
                    background-color: #fef2f2;
                    color: var(--error);
                }

                .logout-button svg {
                    flex-shrink: 0;
                }

                .main-wrapper {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    min-width: 0;
                    background-color: var(--bg-main);
                }

                .dashboard-header {
                    height: var(--header-h);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 24px;
                    position: sticky;
                    top: 0;
                    z-index: 40;
                    background-color: white;
                    border-bottom: 1px solid var(--border);
                }

                .header-left {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .page-heading {
                    font-size: 17px;
                    font-weight: 600;
                    color: var(--text-main);
                }

                .user-info {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .user-details {
                    text-align: right;
                }

                .user-name {
                    font-size: 13px;
                    font-weight: 600;
                    color: var(--text-main);
                }

                .user-role {
                    font-size: 11px;
                    color: var(--text-muted);
                    font-weight: 400;
                }

                .user-avatar {
                    width: 32px;
                    height: 32px;
                    background: linear-gradient(135deg, var(--primary), var(--primary-hover));
                    color: white;
                    border-radius: var(--radius-md);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 600;
                    font-size: 13px;
                }

                .dashboard-content {
                    padding: 24px;
                    max-width: 1400px;
                    margin: 0 auto;
                    width: 100%;
                }

                @media (max-width: 900px) {
                    .sidebar { 
                        width: 64px; 
                    }
                    .logo-text, 
                    .nav-group-title, 
                    .nav-link span, 
                    .user-details, 
                    .logout-button span { 
                        display: none; 
                    }
                    .logo-section { 
                        padding: 12px; 
                        justify-content: center;
                    }
                    .sidebar-nav { 
                        padding: 12px 8px; 
                    }
                    .sidebar-footer { 
                        padding: 10px 8px; 
                    }
                    .nav-link { 
                        justify-content: center; 
                        padding: 12px; 
                    }
                    .logout-button {
                        justify-content: center;
                        padding: 12px;
                    }
                    .dashboard-header { 
                        padding: 0 16px; 
                    }
                    .dashboard-content { 
                        padding: 16px; 
                    }
                    .page-heading {
                        font-size: 15px;
                    }
                }

                @media (max-width: 768px) {
                    .sidebar {
                        position: fixed;
                        left: 0;
                        top: 0;
                        height: 100vh;
                        z-index: 100;
                        transform: translateX(-100%);
                        transition: transform 0.3s ease;
                        width: var(--sidebar-w);
                        box-shadow: var(--shadow-xl);
                    }

                    .sidebar.mobile-open {
                        transform: translateX(0);
                    }

                    .logo-text, 
                    .nav-group-title, 
                    .nav-link span, 
                    .logout-button span { 
                        display: block; 
                    }

                    .logo-section { 
                        padding: 20px; 
                        justify-content: flex-start;
                    }

                    .nav-link { 
                        justify-content: flex-start; 
                        padding: 12px; 
                    }

                    .logout-button {
                        justify-content: flex-start;
                        padding: 12px;
                    }

                    .main-wrapper {
                        width: 100%;
                    }

                    .dashboard-header {
                        padding: 0 16px;
                    }

                    .dashboard-content {
                        padding: 16px;
                    }

                    .user-name {
                        display: none;
                    }

                    .user-role {
                        display: none;
                    }

                    .mobile-menu-btn {
                        display: flex !important;
                    }
                }

                .mobile-menu-btn {
                    display: none;
                    align-items: center;
                    justify-content: center;
                    width: 40px;
                    height: 40px;
                    border-radius: var(--radius-md);
                    background-color: transparent;
                    border: none;
                    cursor: pointer;
                    color: var(--text-secondary);
                }

                .mobile-menu-btn:hover {
                    background-color: var(--bg-main);
                }

                .mobile-overlay {
                    display: none;
                    position: fixed;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.5);
                    z-index: 99;
                }

                @media (max-width: 768px) {
                    .mobile-overlay.active {
                        display: block;
                    }
                }
            `}</style>
        </div>
    );
};
