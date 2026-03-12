import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, Users, GraduationCap, BookOpen,
    LogOut, ShieldCheck, Menu, X,
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const NAV = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/teachers', icon: GraduationCap, label: 'Teachers' },
    { path: '/admin/students', icon: Users, label: 'Students' },
    { path: '/admin/courses', icon: BookOpen, label: 'Courses' },
];

export const AdminLayout = () => {
    const location = useLocation();
    const logout = useAuthStore((s) => s.logout);
    const user = useAuthStore((s) => s.user);
    const [open, setOpen] = useState(false);

    const active = NAV.find((n) => n.path === location.pathname);

    const handleLogout = () => { logout(); window.location.href = '/login'; };

    return (
        <div style={S.root}>
            {/* ── Overlay (mobile) ── */}
            {open && (
                <div style={S.overlay} onClick={() => setOpen(false)} />
            )}

            {/* ──────────── SIDEBAR ──────────── */}
            <aside style={{ ...S.sidebar, transform: open ? 'translateX(0)' : '' }}>
                {/* Logo */}
                <div style={S.logoRow}>
                    <div style={S.logoIcon}>
                        <ShieldCheck size={18} color="#fff" strokeWidth={2.5} />
                    </div>
                    <span style={S.logoText}>Admin Panel</span>
                </div>

                {/* Nav */}
                <nav style={S.nav}>
                    <p style={S.navLabel}>Management</p>
                    {NAV.map(({ path, icon: Icon, label }) => {
                        const isActive = location.pathname === path;
                        return (
                            <Link
                                key={path}
                                to={path}
                                onClick={() => setOpen(false)}
                                style={{
                                    ...S.navLink,
                                    ...(isActive ? S.navLinkActive : {}),
                                }}
                            >
                                <Icon size={17} strokeWidth={2} />
                                <span>{label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div style={S.sidebarFooter}>
                    <div style={S.userRow}>
                        <div style={S.userAvatar}>{(user?.email ?? 'A')[0].toUpperCase()}</div>
                        <div style={{ minWidth: 0 }}>
                            <p style={S.userName}>{user?.email ?? 'Admin'}</p>
                            <p style={S.userRole}>Administrator</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} style={S.signOutBtn}>
                        <LogOut size={16} strokeWidth={2} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* ──────────── MAIN ──────────── */}
            <div style={S.main}>
                {/* Header */}
                <header style={S.header}>
                    <div style={S.headerLeft}>
                        <button style={S.menuBtn} onClick={() => setOpen(!open)}>
                            {open ? <X size={22} /> : <Menu size={22} />}
                        </button>
                        <div style={S.headerPageId}>
                            {active && <active.icon size={16} color="#7c3aed" strokeWidth={2} />}
                            <span style={S.headerPageTitle}>{active?.label ?? 'Admin'}</span>
                        </div>
                    </div>
                    <div style={S.headerBadge}>
                        <ShieldCheck size={14} color="#7c3aed" />
                        <span style={{ fontSize: 12, fontWeight: 600, color: '#7c3aed' }}>Admin</span>
                    </div>
                </header>

                {/* Page content */}
                <main style={S.content}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

/* ── Styles ── */
const PURPLE = '#7c3aed';
const PURPLE_DARK = '#5b21b6';
const SIDEBAR_W = 220;

const S: Record<string, React.CSSProperties> = {
    root: {
        display: 'flex',
        minHeight: '100vh',
        background: '#f9fafb',
    },
    overlay: {
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.45)',
        zIndex: 98,
    },
    sidebar: {
        width: SIDEBAR_W,
        minWidth: SIDEBAR_W,
        background: '#fff',
        borderRight: '1px solid #ede9fe',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        transform: undefined,
    },
    logoRow: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '16px 16px',
        borderBottom: '1px solid #ede9fe',
        minHeight: 56,
    },
    logoIcon: {
        width: 32,
        height: 32,
        borderRadius: 8,
        background: `linear-gradient(135deg, ${PURPLE}, ${PURPLE_DARK})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    logoText: {
        fontSize: 14,
        fontWeight: 700,
        color: '#111827',
        whiteSpace: 'nowrap',
        letterSpacing: '-0.02em',
    },
    nav: {
        flex: 1,
        padding: '12px 10px',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        overflowY: 'auto',
    },
    navLabel: {
        fontSize: 10,
        fontWeight: 600,
        color: '#9ca3af',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        padding: '0 8px 6px',
        marginBottom: 2,
    },
    navLink: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '9px 10px',
        borderRadius: 8,
        color: '#6b7280',
        textDecoration: 'none',
        fontWeight: 500,
        fontSize: 14,
        transition: 'all 0.15s',
    },
    navLinkActive: {
        background: `linear-gradient(135deg, ${PURPLE}, ${PURPLE_DARK})`,
        color: '#fff',
        fontWeight: 600,
    },
    sidebarFooter: {
        padding: '12px 12px',
        borderTop: '1px solid #ede9fe',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
    },
    userRow: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '6px 4px',
        overflow: 'hidden',
    },
    userAvatar: {
        width: 32,
        height: 32,
        borderRadius: 8,
        background: `linear-gradient(135deg, ${PURPLE}, ${PURPLE_DARK})`,
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        fontSize: 13,
        flexShrink: 0,
    },
    userName: {
        fontSize: 12,
        fontWeight: 600,
        color: '#111827',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
    userRole: {
        fontSize: 11,
        color: '#9ca3af',
        marginTop: 1,
    },
    signOutBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 10px',
        borderRadius: 8,
        border: 'none',
        background: 'none',
        color: '#6b7280',
        fontSize: 13,
        fontWeight: 500,
        cursor: 'pointer',
        width: '100%',
        transition: 'all 0.15s',
    },
    main: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        minHeight: '100vh',
    },
    header: {
        height: 56,
        background: '#fff',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 40,
    },
    headerLeft: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
    },
    menuBtn: {
        display: 'none',
        alignItems: 'center',
        justifyContent: 'center',
        width: 36,
        height: 36,
        borderRadius: 8,
        border: 'none',
        background: 'none',
        cursor: 'pointer',
        color: '#6b7280',
    },
    headerPageId: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
    },
    headerPageTitle: {
        fontSize: 16,
        fontWeight: 600,
        color: '#111827',
    },
    headerBadge: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '5px 12px',
        borderRadius: 99,
        background: '#f5f3ff',
        border: '1px solid #ede9fe',
    },
    content: {
        padding: 24,
        flex: 1,
    },
};
