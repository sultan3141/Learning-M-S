import { useEffect, useState } from 'react';
import axiosInstance from '../../lib/axios';
import { Trash2, BookOpen, Users, GraduationCap } from 'lucide-react';

export const AdminCoursesScreen = () => {
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchCourses = async () => {
        try {
            const r = await axiosInstance.get('/admin/courses');
            setCourses(r.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchCourses(); }, []);

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Delete course "${title}"? This removes all its content.`)) return;
        await axiosInstance.delete(`/admin/courses/${id}`);
        fetchCourses();
    };

    const filtered = courses.filter(c =>
        c.title?.toLowerCase().includes(search.toLowerCase()) ||
        c.teacher?.fullName?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div style={S.page}>
            <div style={S.pageHeader}>
                <div>
                    <h1 style={S.title}>Courses</h1>
                    <p style={S.sub}>All courses · {courses.length} total</p>
                </div>
                <input
                    type="text"
                    placeholder="Search by title or teacher…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={S.searchInput}
                />
            </div>

            {loading ? (
                <div style={S.loadWrap}><div style={S.spinner} /><p style={S.loadText}>Loading courses…</p></div>
            ) : filtered.length === 0 ? (
                <div style={S.emptyState}>
                    <BookOpen size={48} color="#d1d5db" />
                    <p style={{ fontSize: 15, color: '#9ca3af', fontWeight: 500 }}>No courses found</p>
                </div>
            ) : (
                <div style={S.grid}>
                    {filtered.map(c => (
                        <div key={c.id} style={S.card}>
                            {/* Card top bar color by published status */}
                            <div style={{ ...S.cardAccent, background: c.isPublished ? '#059669' : '#e5e7eb' }} />

                            <div style={S.cardBody}>
                                <div style={S.cardHeader}>
                                    <div style={S.courseIcon}>
                                        <BookOpen size={18} color="#7c3aed" strokeWidth={2} />
                                    </div>
                                    <button style={S.deleteBtn} onClick={() => handleDelete(c.id, c.title)} title="Delete">
                                        <Trash2 size={15} />
                                    </button>
                                </div>

                                <h3 style={S.cardTitle}>{c.title}</h3>
                                {c.description && <p style={S.cardDesc}>{c.description}</p>}

                                <div style={S.cardMeta}>
                                    <div style={S.metaRow}>
                                        <GraduationCap size={12} color="#9ca3af" />
                                        <span style={S.metaText}>{c.teacher?.fullName || c.teacher?.email || 'Unknown teacher'}</span>
                                    </div>
                                    <div style={S.metaRow}>
                                        <Users size={12} color="#9ca3af" />
                                        <span style={S.metaText}>{c.enrollments?.length ?? 0} students enrolled</span>
                                    </div>
                                    <div style={S.metaRow}>
                                        <BookOpen size={12} color="#9ca3af" />
                                        <span style={S.metaText}>{c.subjects?.length ?? 0} topics</span>
                                    </div>
                                </div>

                                <div style={S.cardFooter}>
                                    <span style={c.isPublished ? S.badgeGreen : S.badgeGray}>
                                        {c.isPublished ? 'Published' : 'Draft'}
                                    </span>
                                    <span style={S.dateText}>{new Date(c.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    ))}
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
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 16 },
    card: { background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column' },
    cardAccent: { height: 4 },
    cardBody: { padding: 20, display: 'flex', flexDirection: 'column', gap: 10, flex: 1 },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    courseIcon: { width: 38, height: 38, borderRadius: 9, background: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    deleteBtn: { background: '#fef2f2', border: 'none', color: '#ef4444', borderRadius: 7, padding: '6px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'all 0.15s' },
    cardTitle: { fontSize: 15, fontWeight: 700, color: '#111827', lineHeight: 1.4 },
    cardDesc: { fontSize: 13, color: '#9ca3af', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' },
    cardMeta: { display: 'flex', flexDirection: 'column', gap: 5, padding: '10px 0', borderTop: '1px solid #f3f4f6', borderBottom: '1px solid #f3f4f6' },
    metaRow: { display: 'flex', alignItems: 'center', gap: 7 },
    metaText: { fontSize: 12, color: '#6b7280' },
    cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
    badgeGreen: { padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 700, background: '#ecfdf5', color: '#059669', textTransform: 'uppercase', letterSpacing: '0.04em' },
    badgeGray: { padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 700, background: '#f3f4f6', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.04em' },
    dateText: { fontSize: 11, color: '#d1d5db' },
    emptyState: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: 80 },
    loadWrap: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: 80 },
    spinner: { width: 30, height: 30, border: '3px solid #e5e7eb', borderTopColor: '#7c3aed', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
    loadText: { color: '#9ca3af', fontSize: 14 },
};
