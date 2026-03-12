import { useEffect, useState } from 'react';
import axiosInstance from '../../lib/axios';
import { CheckCircle, XCircle, Trash2, UserPlus, X, BookOpen } from 'lucide-react';

export const AdminTeachersScreen = () => {
    const [teachers, setTeachers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({ fullName: '', email: '', password: '' });

    const fetchTeachers = async () => {
        try {
            const r = await axiosInstance.get('/admin/teachers');
            setTeachers(r.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchTeachers(); }, []);

    const handleApprove = async (id: string) => {
        await axiosInstance.patch(`/admin/teachers/${id}/approve`);
        fetchTeachers();
    };
    const handleSuspend = async (id: string) => {
        await axiosInstance.patch(`/admin/teachers/${id}/suspend`);
        fetchTeachers();
    };
    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Delete teacher "${name}"? This cannot be undone.`)) return;
        await axiosInstance.delete(`/admin/teachers/${id}`);
        fetchTeachers();
    };
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await axiosInstance.post('/admin/teachers', form);
            setIsModalOpen(false);
            setForm({ fullName: '', email: '', password: '' });
            fetchTeachers();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to register teacher');
        } finally { setSubmitting(false); }
    };

    return (
        <div style={S.page}>
            {/* Header */}
            <div style={S.pageHeader}>
                <div>
                    <h1 style={S.title}>Teachers</h1>
                    <p style={S.sub}>Manage teacher accounts and approvals</p>
                </div>
                <button style={S.addBtn} onClick={() => setIsModalOpen(true)}>
                    <UserPlus size={16} strokeWidth={2} />
                    Add Teacher
                </button>
            </div>

            {/* Table card */}
            {loading ? (
                <div style={S.loadWrap}><div style={S.spinner} /><p style={S.loadText}>Loading teachers…</p></div>
            ) : (
                <div style={S.card}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={S.table}>
                            <thead>
                                <tr>
                                    {['Teacher', 'Courses', 'Status', 'Joined', 'Actions'].map((h) => (
                                        <th key={h} style={{ ...S.th, textAlign: h === 'Actions' ? 'right' : 'left' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {teachers.length === 0 ? (
                                    <tr><td colSpan={5} style={S.emptyCell}>No teachers registered yet</td></tr>
                                ) : teachers.map((t) => (
                                    <tr key={t.id} style={S.tr}>
                                        <td style={S.td}>
                                            <div style={S.profileCell}>
                                                <div style={S.avatar}>{(t.fullName || t.email).charAt(0).toUpperCase()}</div>
                                                <div>
                                                    <p style={S.name}>{t.fullName || '—'}</p>
                                                    <p style={S.email}>{t.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={S.td}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#6b7280' }}>
                                                <BookOpen size={13} color="#9ca3af" />
                                                {t.coursesCount} course{t.coursesCount !== 1 ? 's' : ''}
                                            </div>
                                        </td>
                                        <td style={S.td}>
                                            <span style={t.isTeacherApproved ? S.badgeGreen : S.badgeAmber}>
                                                {t.isTeacherApproved ? 'Approved' : 'Pending'}
                                            </span>
                                        </td>
                                        <td style={{ ...S.td, fontSize: 13, color: '#9ca3af' }}>
                                            {new Date(t.createdAt).toLocaleDateString()}
                                        </td>
                                        <td style={{ ...S.td, textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', alignItems: 'center' }}>
                                                {t.isTeacherApproved ? (
                                                    <button style={S.btnAmber} onClick={() => handleSuspend(t.id)}>
                                                        <XCircle size={14} /> Suspend
                                                    </button>
                                                ) : (
                                                    <button style={S.btnGreen} onClick={() => handleApprove(t.id)}>
                                                        <CheckCircle size={14} /> Approve
                                                    </button>
                                                )}
                                                <button style={S.btnRed} onClick={() => handleDelete(t.id, t.fullName || t.email)}>
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

            {/* Add teacher modal */}
            {isModalOpen && (
                <div style={S.overlay}>
                    <div style={S.modal}>
                        <div style={S.modalHead}>
                            <h3 style={S.modalTitle}>Register New Teacher</h3>
                            <button style={S.closeBtn} onClick={() => setIsModalOpen(false)}><X size={18} /></button>
                        </div>
                        <form onSubmit={handleRegister} style={S.modalBody}>
                            {[
                                { label: 'Full Name', key: 'fullName', type: 'text', placeholder: "Teacher's full name" },
                                { label: 'Email Address', key: 'email', type: 'email', placeholder: 'teacher@example.com' },
                                { label: 'Password', key: 'password', type: 'password', placeholder: 'Min. 6 characters' },
                            ].map(({ label, key, type, placeholder }) => (
                                <div key={key} style={S.field}>
                                    <label style={S.fieldLabel}>{label}</label>
                                    <input
                                        required
                                        type={type}
                                        placeholder={placeholder}
                                        value={(form as any)[key]}
                                        onChange={e => setForm({ ...form, [key]: e.target.value })}
                                        style={S.input}
                                    />
                                </div>
                            ))}
                            <div style={S.modalFooter}>
                                <button type="button" style={S.btnGhost} onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" style={S.btnPrimary} disabled={submitting}>
                                    {submitting ? 'Registering…' : 'Register Teacher'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const S: Record<string, React.CSSProperties> = {
    page: { display: 'flex', flexDirection: 'column', gap: 20 },
    pageHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 },
    title: { fontSize: 22, fontWeight: 800, color: '#111827', marginBottom: 4, letterSpacing: '-0.02em' },
    sub: { fontSize: 14, color: '#9ca3af' },
    addBtn: {
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '9px 18px', borderRadius: 8, border: 'none', cursor: 'pointer',
        background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', color: '#fff',
        fontWeight: 600, fontSize: 14, transition: 'opacity 0.15s',
    },
    card: { background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { padding: '12px 20px', fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', background: '#f9fafb', borderBottom: '1px solid #e5e7eb' },
    tr: { borderBottom: '1px solid #f3f4f6' },
    td: { padding: '14px 20px', verticalAlign: 'middle' },
    emptyCell: { padding: 48, textAlign: 'center', color: '#9ca3af', fontSize: 14 },
    profileCell: { display: 'flex', alignItems: 'center', gap: 12 },
    avatar: {
        width: 36, height: 36, borderRadius: 8, flexShrink: 0,
        background: 'linear-gradient(135deg,#7c3aed,#5b21b6)', color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14,
    },
    name: { fontWeight: 600, fontSize: 14, color: '#111827', marginBottom: 2 },
    email: { fontSize: 12, color: '#9ca3af' },
    badgeGreen: { padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', background: '#ecfdf5', color: '#059669' },
    badgeAmber: { padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', background: '#fffbeb', color: '#d97706' },
    btnGreen: { display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 7, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, background: '#ecfdf5', color: '#059669', transition: 'all 0.15s' },
    btnAmber: { display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 7, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, background: '#fffbeb', color: '#d97706', transition: 'all 0.15s' },
    btnRed: { display: 'inline-flex', alignItems: 'center', gap: 5, padding: '7px 9px', borderRadius: 7, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, background: '#fef2f2', color: '#ef4444', transition: 'all 0.15s' },
    loadWrap: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 80 },
    spinner: { width: 30, height: 30, border: '3px solid #e5e7eb', borderTopColor: '#7c3aed', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
    loadText: { color: '#9ca3af', fontSize: 14 },
    // Modal
    overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 20 },
    modal: { width: '100%', maxWidth: 460, background: '#fff', borderRadius: 14, overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' },
    modalHead: { padding: '18px 24px', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    modalTitle: { fontSize: 17, fontWeight: 700, color: '#111827' },
    closeBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 4, borderRadius: 6 },
    modalBody: { padding: '22px 24px' },
    field: { marginBottom: 16 },
    fieldLabel: { display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 },
    input: { width: '100%', padding: '10px 13px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14, color: '#111827', outline: 'none', boxSizing: 'border-box' },
    modalFooter: { display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 },
    btnGhost: { padding: '9px 18px', borderRadius: 8, border: '1px solid #e5e7eb', background: '#fff', color: '#6b7280', fontWeight: 600, fontSize: 14, cursor: 'pointer' },
    btnPrimary: { padding: '9px 18px', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer' },
};
