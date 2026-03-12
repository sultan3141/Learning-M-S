import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../lib/axios';
import {
    Users, GraduationCap, BookOpen, Video,
    TrendingUp, CheckCircle, Clock, AlertCircle,
    ArrowRight,
} from 'lucide-react';

interface Stats {
    teachers: { total: number; approved: number; pending: number };
    students: number;
    courses: { total: number; published: number };
    recordings: number;
}

export const AdminDashboardScreen = () => {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axiosInstance.get('/admin/dashboard/stats')
            .then((r) => setStats(r.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div style={S.loadWrap}>
                <div style={S.spinner} />
                <p style={{ color: '#9ca3af', fontSize: 14 }}>Loading dashboard…</p>
            </div>
        );
    }

    const statCards = [
        {
            label: 'Teachers',
            value: stats?.teachers.total ?? 0,
            detail: `${stats?.teachers.approved ?? 0} approved`,
            icon: GraduationCap,
            color: '#7c3aed',
            light: '#f5f3ff',
            to: '/admin/teachers',
        },
        {
            label: 'Students',
            value: stats?.students ?? 0,
            detail: 'Platform-wide',
            icon: Users,
            color: '#2563eb',
            light: '#eff6ff',
            to: '/admin/students',
        },
        {
            label: 'Courses',
            value: stats?.courses.total ?? 0,
            detail: `${stats?.courses.published ?? 0} published`,
            icon: BookOpen,
            color: '#059669',
            light: '#ecfdf5',
            to: '/admin/courses',
        },
        {
            label: 'Recordings',
            value: stats?.recordings ?? 0,
            detail: 'All videos',
            icon: Video,
            color: '#d97706',
            light: '#fffbeb',
            to: '/admin/courses',
        },
    ];

    const alertCards = [
        {
            label: 'Approved Teachers',
            value: stats?.teachers.approved ?? 0,
            icon: CheckCircle,
            color: '#059669',
            bg: '#ecfdf5',
            border: '#a7f3d0',
        },
        {
            label: 'Pending Approval',
            value: stats?.teachers.pending ?? 0,
            icon: Clock,
            color: '#d97706',
            bg: '#fffbeb',
            border: '#fde68a',
        },
        {
            label: 'Published Courses',
            value: stats?.courses.published ?? 0,
            icon: TrendingUp,
            color: '#2563eb',
            bg: '#eff6ff',
            border: '#bfdbfe',
        },
        {
            label: 'Draft Courses',
            value: (stats?.courses.total ?? 0) - (stats?.courses.published ?? 0),
            icon: AlertCircle,
            color: '#7c3aed',
            bg: '#f5f3ff',
            border: '#ddd6fe',
        },
    ];

    return (
        <div style={S.page}>
            {/* Hero banner */}
            <div style={S.hero}>
                <div>
                    <h1 style={S.heroTitle}>Platform Overview</h1>
                    <p style={S.heroSub}>Welcome back, Administrator. Here's what's happening today.</p>
                </div>
                <div style={S.heroBadge}>
                    <span style={S.heroBadgeText}>Live</span>
                </div>
            </div>

            {/* Main stat cards */}
            <div style={S.grid4}>
                {statCards.map((c) => {
                    const Icon = c.icon;
                    return (
                        <Link key={c.label} to={c.to} style={{ textDecoration: 'none' }}>
                            <div style={S.statCard}>
                                <div style={{ ...S.statIcon, background: c.light }}>
                                    <Icon size={22} color={c.color} strokeWidth={2} />
                                </div>
                                <div style={S.statBody}>
                                    <p style={S.statLabel}>{c.label}</p>
                                    <p style={{ ...S.statValue, color: c.color }}>{c.value}</p>
                                    <p style={S.statDetail}>{c.detail}</p>
                                </div>
                                <ArrowRight size={16} color="#d1d5db" style={{ alignSelf: 'center', flexShrink: 0 }} />
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Quick stats row */}
            <div style={S.sectionLabel}>Quick Status</div>
            <div style={S.grid4}>
                {alertCards.map((c) => {
                    const Icon = c.icon;
                    return (
                        <div key={c.label} style={{ ...S.alertCard, background: c.bg, border: `1px solid ${c.border}` }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                                <Icon size={16} color={c.color} strokeWidth={2} />
                                <span style={{ fontSize: 13, fontWeight: 600, color: c.color }}>{c.label}</span>
                            </div>
                            <p style={{ fontSize: 30, fontWeight: 800, color: '#111827', lineHeight: 1 }}>{c.value}</p>
                        </div>
                    );
                })}
            </div>

            {/* Quick links */}
            <div style={S.sectionLabel}>Quick Actions</div>
            <div style={S.quickLinks}>
                <Link to="/admin/teachers" style={S.quickLink}>
                    <GraduationCap size={18} color="#7c3aed" />
                    <span style={{ fontWeight: 600, color: '#111827', fontSize: 14 }}>Manage Teachers</span>
                    <ArrowRight size={14} color="#9ca3af" style={{ marginLeft: 'auto' }} />
                </Link>
                <Link to="/admin/students" style={S.quickLink}>
                    <Users size={18} color="#2563eb" />
                    <span style={{ fontWeight: 600, color: '#111827', fontSize: 14 }}>View All Students</span>
                    <ArrowRight size={14} color="#9ca3af" style={{ marginLeft: 'auto' }} />
                </Link>
                <Link to="/admin/courses" style={S.quickLink}>
                    <BookOpen size={18} color="#059669" />
                    <span style={{ fontWeight: 600, color: '#111827', fontSize: 14 }}>Browse Courses</span>
                    <ArrowRight size={14} color="#9ca3af" style={{ marginLeft: 'auto' }} />
                </Link>
            </div>
        </div>
    );
};

const S: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 20 },
    loadWrap: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 80 },
    spinner: { width: 32, height: 32, border: '3px solid #e5e7eb', borderTopColor: '#7c3aed', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
    hero: {
        background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 60%, #2563eb 100%)',
        borderRadius: 16,
        padding: '28px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: '#fff',
    },
    heroTitle: { fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 6, letterSpacing: '-0.02em' },
    heroSub: { fontSize: 14, color: 'rgba(255,255,255,0.75)', fontWeight: 400 },
    heroBadge: {
        background: 'rgba(255,255,255,0.2)',
        border: '1px solid rgba(255,255,255,0.35)',
        borderRadius: 99,
        padding: '6px 14px',
        backdropFilter: 'blur(8px)',
    },
    heroBadgeText: { fontSize: 12, fontWeight: 700, color: '#fff', letterSpacing: '0.06em', textTransform: 'uppercase' },
    sectionLabel: { fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.07em' },
    grid4: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 },
    statCard: {
        background: '#fff',
        borderRadius: 12,
        border: '1px solid #e5e7eb',
        padding: '18px 20px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 14,
        cursor: 'pointer',
        transition: 'box-shadow 0.15s, transform 0.15s',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    },
    statIcon: { width: 44, height: 44, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    statBody: { flex: 1, minWidth: 0 },
    statLabel: { fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 },
    statValue: { fontSize: 28, fontWeight: 800, lineHeight: 1, marginBottom: 3 },
    statDetail: { fontSize: 12, color: '#9ca3af' },
    alertCard: { borderRadius: 12, padding: '16px 18px' },
    quickLinks: { display: 'flex', flexDirection: 'column', gap: 2, background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', overflow: 'hidden' },
    quickLink: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '14px 18px',
        textDecoration: 'none',
        borderBottom: '1px solid #f3f4f6',
        transition: 'background 0.15s',
    },
};
