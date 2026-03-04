import React, { useEffect, useState } from 'react';
import axiosInstance from '../../lib/axios';
import { Users, GraduationCap, BookOpen, Video, TrendingUp, AlertCircle } from 'lucide-react';

export const AdminDashboard = () => {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await axiosInstance.get('/admin/dashboard/stats');
            setStats(response.data);
        } catch (err) {
            console.error('Failed to fetch stats:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={styles.loadingState}>
                <div style={styles.spinner}></div>
                <p>Loading dashboard...</p>
            </div>
        );
    }

    const statCards = [
        {
            title: 'Total Teachers',
            value: stats?.teachers?.total || 0,
            subtitle: `${stats?.teachers?.approved || 0} approved, ${stats?.teachers?.pending || 0} pending`,
            icon: GraduationCap,
            color: '#2563eb',
            bgColor: '#eff6ff',
        },
        {
            title: 'Total Students',
            value: stats?.students || 0,
            subtitle: 'Active students',
            icon: Users,
            color: '#10b981',
            bgColor: '#ecfdf5',
        },
        {
            title: 'Total Courses',
            value: stats?.courses?.total || 0,
            subtitle: `${stats?.courses?.published || 0} published`,
            icon: BookOpen,
            color: '#f59e0b',
            bgColor: '#fef3c7',
        },
        {
            title: 'Total Videos',
            value: stats?.recordings || 0,
            subtitle: 'Uploaded recordings',
            icon: Video,
            color: '#8b5cf6',
            bgColor: '#f3e8ff',
        },
    ];

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>Admin Dashboard</h1>
                    <p style={styles.subtitle}>Overview of your learning management system</p>
                </div>
            </div>

            {stats?.teachers?.pending > 0 && (
                <div style={styles.alertBanner}>
                    <AlertCircle size={20} />
                    <span>
                        You have {stats.teachers.pending} pending teacher approval{stats.teachers.pending > 1 ? 's' : ''}
                    </span>
                </div>
            )}

            <div style={styles.statsGrid}>
                {statCards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                        <div key={index} className="card" style={styles.statCard}>
                            <div style={styles.statHeader}>
                                <div style={{ ...styles.iconWrapper, backgroundColor: card.bgColor }}>
                                    <Icon size={24} color={card.color} />
                                </div>
                                <TrendingUp size={16} color="var(--success)" />
                            </div>
                            <h3 style={styles.statValue}>{card.value}</h3>
                            <p style={styles.statTitle}>{card.title}</p>
                            <p style={styles.statSubtitle}>{card.subtitle}</p>
                        </div>
                    );
                })}
            </div>

            <div style={styles.quickActions}>
                <h2 style={styles.sectionTitle}>Quick Actions</h2>
                <div style={styles.actionsGrid}>
                    <a href="/admin/teachers" className="card" style={styles.actionCard}>
                        <GraduationCap size={32} color="var(--primary)" />
                        <h3 style={styles.actionTitle}>Manage Teachers</h3>
                        <p style={styles.actionDesc}>Approve, suspend, or remove teachers</p>
                    </a>
                    <a href="/admin/students" className="card" style={styles.actionCard}>
                        <Users size={32} color="var(--success)" />
                        <h3 style={styles.actionTitle}>View Students</h3>
                        <p style={styles.actionDesc}>Monitor student enrollments</p>
                    </a>
                    <a href="/admin/courses" className="card" style={styles.actionCard}>
                        <BookOpen size={32} color="var(--warning)" />
                        <h3 style={styles.actionTitle}>Manage Courses</h3>
                        <p style={styles.actionDesc}>Oversee all courses and content</p>
                    </a>
                    <a href="/admin/videos" className="card" style={styles.actionCard}>
                        <Video size={32} color="#8b5cf6" />
                        <h3 style={styles.actionTitle}>Manage Videos</h3>
                        <p style={styles.actionDesc}>Review and moderate video content</p>
                    </a>
                </div>
            </div>
        </div>
    );
};

const styles: Record<string, React.CSSProperties> = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    title: {
        fontSize: '24px',
        fontWeight: '700',
        color: 'var(--text-main)',
        margin: 0,
    },
    subtitle: {
        fontSize: '14px',
        color: 'var(--text-muted)',
        marginTop: '4px',
    },
    alertBanner: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        backgroundColor: '#fef3c7',
        border: '1px solid #fbbf24',
        borderRadius: 'var(--radius-md)',
        color: '#92400e',
        fontSize: '14px',
        fontWeight: '500',
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
    },
    statCard: {
        padding: '20px',
    },
    statHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
    },
    iconWrapper: {
        width: '48px',
        height: '48px',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    statValue: {
        fontSize: '32px',
        fontWeight: '700',
        color: 'var(--text-main)',
        margin: '0 0 4px 0',
    },
    statTitle: {
        fontSize: '14px',
        fontWeight: '500',
        color: 'var(--text-secondary)',
        margin: '0 0 4px 0',
    },
    statSubtitle: {
        fontSize: '12px',
        color: 'var(--text-muted)',
        margin: 0,
    },
    quickActions: {
        marginTop: '16px',
    },
    sectionTitle: {
        fontSize: '18px',
        fontWeight: '600',
        color: 'var(--text-main)',
        marginBottom: '16px',
    },
    actionsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '16px',
    },
    actionCard: {
        padding: '24px',
        textAlign: 'center',
        textDecoration: 'none',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'pointer',
    },
    actionTitle: {
        fontSize: '16px',
        fontWeight: '600',
        color: 'var(--text-main)',
        margin: '12px 0 8px 0',
    },
    actionDesc: {
        fontSize: '13px',
        color: 'var(--text-muted)',
        margin: 0,
    },
    loadingState: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        padding: '80px 20px',
        color: 'var(--text-muted)',
    },
    spinner: {
        width: '36px',
        height: '36px',
        border: '3px solid var(--border)',
        borderTopColor: 'var(--primary)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
    },
};
