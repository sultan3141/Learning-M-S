import { useEffect, useState } from 'react';
import axiosInstance from '../../lib/axios';
import { Phone, BookOpen, Users } from 'lucide-react';

export const AdminStudentsScreen = () => {
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        axiosInstance.get('/admin/students')
            .then(r => setStudents(r.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const filtered = students.filter(s =>
        s.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        s.email?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div style={S.page}>
            <div style={S.pageHeader}>
                <div>
                    <h1 style={S.title}>Students</h1>
                    <p style={S.sub}>All registered students · {students.length} total</p>
                </div>
                <input
                    type="text"
                    placeholder="Search by name or email…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={S.searchInput}
                />
            </div>

            {loading ? (
                <div style={S.loadWrap}><div style={S.spinner} /><p style={S.loadText}>Loading students…</p></div>
            ) : (
                <div style={S.card}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={S.table}>
                            <thead>
                                <tr>
                                    {['Student', 'Contact', 'Interest', 'Enrolled In', 'Joined'].map(h => (
                                        <th key={h} style={S.th}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length === 0 ? (
                                    <tr><td colSpan={5} style={S.emptyCell}>
                                        <Users size={40} color="#d1d5db" style={{ display: 'block', margin: '0 auto 10px' }} />
                                        No students found
                                    </td></tr>
                                ) : filtered.map(s => (
                                    <tr key={s.id} style={S.tr}>
                                        <td style={S.td}>
                                            <div style={S.profileCell}>
                                                <div style={S.avatar}>{(s.fullName || s.email).charAt(0).toUpperCase()}</div>
                                                <div>
                                                    <p style={S.name}>{s.fullName || '—'}</p>
                                                    <p style={S.emailText}>{s.email}</p>
                                                    {s.age && <p style={S.ageText}>Age {s.age}</p>}
                                                </div>
                                            </div>
                                        </td>
                                        <td style={S.td}>
                                            {s.phoneNumber ? (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#6b7280' }}>
                                                    <Phone size={12} color="#9ca3af" />{s.phoneNumber}
                                                </div>
                                            ) : <span style={S.muted}>—</span>}
                                        </td>
                                        <td style={{ ...S.td, fontSize: 13, color: '#6b7280' }}>{s.interest || '—'}</td>
                                        <td style={S.td}>
                                            {s.enrollments?.length > 0 ? (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                                    {s.enrollments.map((e: any, i: number) => (
                                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12 }}>
                                                            <BookOpen size={11} color="#7c3aed" />
                                                            <span style={{ color: '#6b7280' }}>{e.course?.title}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : <span style={S.muted}>Not enrolled</span>}
                                        </td>
                                        <td style={{ ...S.td, fontSize: 13, color: '#9ca3af' }}>
                                            {new Date(s.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
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
    searchInput: { padding: '9px 14px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 14, color: '#111827', outline: 'none', minWidth: 240, boxSizing: 'border-box' },
    card: { background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { padding: '12px 20px', fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', background: '#f9fafb', borderBottom: '1px solid #e5e7eb', textAlign: 'left' },
    tr: { borderBottom: '1px solid #f3f4f6' },
    td: { padding: '14px 20px', verticalAlign: 'middle' },
    emptyCell: { padding: 56, textAlign: 'center', color: '#9ca3af', fontSize: 14 },
    profileCell: { display: 'flex', alignItems: 'center', gap: 12 },
    avatar: {
        width: 36, height: 36, borderRadius: 8, flexShrink: 0,
        background: 'linear-gradient(135deg,#2563eb,#1d4ed8)', color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14,
    },
    name: { fontWeight: 600, fontSize: 14, color: '#111827', marginBottom: 2 },
    emailText: { fontSize: 12, color: '#9ca3af' },
    ageText: { fontSize: 11, color: '#d1d5db', marginTop: 1 },
    muted: { fontSize: 13, color: '#d1d5db' },
    loadWrap: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 80 },
    spinner: { width: 30, height: 30, border: '3px solid #e5e7eb', borderTopColor: '#7c3aed', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
    loadText: { color: '#9ca3af', fontSize: 14 },
};
