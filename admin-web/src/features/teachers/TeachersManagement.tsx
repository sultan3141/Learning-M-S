import { useEffect, useState } from 'react';
import axiosInstance from '../../lib/axios';
import { GraduationCap, Search, Check, Ban, Trash2, Clock, User } from 'lucide-react';

export const TeachersManagement = () => {
    const [teachers, setTeachers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        fetchTeachers();
    }, []);

    const fetchTeachers = async () => {
        try {
            const response = await axiosInstance.get('/admin/teachers');
            setTeachers(response.data || []);
        } catch (err) {
            console.error('Failed to fetch teachers:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id: string, name: string) => {
        if (!confirm(`Approve teacher ${name}?`)) return;
        setActionLoading(id + '_approve');
        try {
            await axiosInstance.patch(`/admin/teachers/${id}/approve`);
            fetchTeachers();
        } catch (err) {
            alert('Failed to approve teacher');
        } finally {
            setActionLoading(null);
        }
    };

    const handleSuspend = async (id: string, name: string) => {
        if (!confirm(`Suspend teacher ${name}? They will lose access.`)) return;
        setActionLoading(id + '_suspend');
        try {
            await axiosInstance.patch(`/admin/teachers/${id}/suspend`);
            fetchTeachers();
        } catch (err) {
            alert('Failed to suspend teacher');
        } finally {
            setActionLoading(null);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Delete teacher ${name}? This cannot be undone.`)) return;
        setActionLoading(id + '_delete');
        try {
            await axiosInstance.delete(`/admin/teachers/${id}`);
            fetchTeachers();
        } catch (err) {
            alert('Failed to delete teacher');
        } finally {
            setActionLoading(null);
        }
    };

    const filtered = teachers.filter(t =>
        t.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusBadge = (status: string) => {
        const map: Record<string, { label: string; color: string; bg: string }> = {
            APPROVED: { label: 'Approved', color: '#059669', bg: '#ecfdf5' },
            PENDING: { label: 'Pending', color: '#d97706', bg: '#fffbeb' },
            SUSPENDED: { label: 'Suspended', color: '#dc2626', bg: '#fee2e2' },
        };
        const s = map[status] || { label: status, color: '#6b7280', bg: '#f3f4f6' };
        return (
            <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '4px',
                padding: '3px 10px', borderRadius: '99px', fontSize: '12px',
                fontWeight: 600, color: s.color, backgroundColor: s.bg,
            }}>
                {status === 'APPROVED' && <Check size={11} />}
                {status === 'PENDING' && <Clock size={11} />}
                {status === 'SUSPENDED' && <Ban size={11} />}
                {s.label}
            </span>
        );
    };

    return (
        <div className="screen-container">
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '22px', fontWeight: 700, margin: 0 }}>Teachers</h1>
                    <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>
                        Manage teacher accounts and approvals
                    </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '8px 14px' }}>
                    <Search size={16} color="var(--text-muted)" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder="Search teachers..."
                        style={{ border: 'none', outline: 'none', fontSize: '14px', background: 'transparent', width: '200px' }}
                    />
                </div>
            </div>

            {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '80px', color: 'var(--text-muted)' }}>
                    <div style={{ width: '36px', height: '36px', border: '3px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    <p>Loading teachers...</p>
                </div>
            ) : filtered.length === 0 ? (
                <div className="empty-state">
                    <GraduationCap size={48} strokeWidth={1.5} />
                    <p>{searchTerm ? 'No teachers match your search.' : 'No teachers found.'}</p>
                </div>
            ) : (
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table>
                            <thead>
                                <tr>
                                    <th>Teacher</th>
                                    <th>Status</th>
                                    <th>Students</th>
                                    <th>Courses</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(teacher => (
                                    <tr key={teacher.id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{
                                                    width: '36px', height: '36px', borderRadius: 'var(--radius-md)',
                                                    background: 'linear-gradient(135deg, var(--primary), var(--primary-hover))',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    color: 'white', fontWeight: 600, fontSize: '14px', flexShrink: 0,
                                                }}>
                                                    {(teacher.fullName || teacher.email || '?').charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '14px', margin: 0 }}>
                                                        {teacher.fullName || '—'}
                                                    </p>
                                                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
                                                        {teacher.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{getStatusBadge(teacher.status || 'PENDING')}</td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <User size={14} color="var(--text-muted)" />
                                                <span style={{ fontSize: '14px' }}>{teacher._count?.students ?? teacher.studentCount ?? '—'}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span style={{ fontSize: '14px' }}>{teacher._count?.courses ?? teacher.courseCount ?? '—'}</span>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                                                {teacher.status !== 'APPROVED' && (
                                                    <button
                                                        onClick={() => handleApprove(teacher.id, teacher.fullName || teacher.email)}
                                                        disabled={actionLoading === teacher.id + '_approve'}
                                                        title="Approve"
                                                        style={{ padding: '6px 12px', borderRadius: 'var(--radius-md)', fontSize: '13px', background: '#ecfdf5', color: '#059669', fontWeight: 600, border: '1px solid #d1fae5', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                                                    >
                                                        <Check size={14} /> Approve
                                                    </button>
                                                )}
                                                {teacher.status !== 'SUSPENDED' && (
                                                    <button
                                                        onClick={() => handleSuspend(teacher.id, teacher.fullName || teacher.email)}
                                                        disabled={actionLoading === teacher.id + '_suspend'}
                                                        title="Suspend"
                                                        style={{ padding: '6px 12px', borderRadius: 'var(--radius-md)', fontSize: '13px', background: '#fffbeb', color: '#d97706', fontWeight: 600, border: '1px solid #fde68a', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                                                    >
                                                        <Ban size={14} /> Suspend
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(teacher.id, teacher.fullName || teacher.email)}
                                                    disabled={actionLoading === teacher.id + '_delete'}
                                                    title="Delete"
                                                    style={{ padding: '6px', borderRadius: 'var(--radius-md)', background: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};
