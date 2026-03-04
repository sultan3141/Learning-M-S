import React, { useEffect, useState } from 'react';
import axiosInstance from '../../lib/axios';
import { Plus, Play, Tag, CheckCircle2, Edit2, Trash2 } from 'lucide-react';



export const RecordingsScreen = () => {
    const [courses, setCourses] = useState<any[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<string>('');
    const [subjects, setSubjects] = useState<any[]>([]);
    const [selectedSubject, setSelectedSubject] = useState<string>('');
    const [recordings, setRecordings] = useState<any[]>([]);

    // Toggle between existing and new
    const [isNewCourse, setIsNewCourse] = useState(false);
    const [isNewSubject, setIsNewSubject] = useState(false);

    // New course/subject fields
    const [newCourseName, setNewCourseName] = useState('');
    const [newCourseDescription, setNewCourseDescription] = useState('');
    const [newSubjectName, setNewSubjectName] = useState('');
    const [newSubjectDescription, setNewSubjectDescription] = useState('');

    // Form state
    const [title, setTitle] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // Edit state
    const [editingRecording, setEditingRecording] = useState<any | null>(null);



    useEffect(() => {
        fetchCourses();
    }, []);

    useEffect(() => {
        if (selectedCourse) {
            fetchCourseTree();
            fetchRecordings();
        }
    }, [selectedCourse]);

    const fetchCourses = async () => {
        try {
            const response = await axiosInstance.get('/courses/teacher/me');
            setCourses(response.data || []);
        } catch (err) {
            console.error('Failed to fetch courses:', err);
        }
    };

    const fetchCourseTree = async () => {
        try {
            const response = await axiosInstance.get(`/courses/${selectedCourse}/tree`);
            setSubjects(response.data.subjects || []);
        } catch (err) {
            console.error('Failed to fetch course tree:', err);
        }
    };

    const fetchRecordings = async () => {
        try {
            const response = await axiosInstance.get(`/recordings?courseId=${selectedCourse}`);
            setRecordings(response.data || []);
        } catch (err) {
            console.error('Failed to fetch recordings:', err);
        }
    };

    const handleRelease = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);

        try {
            let courseId = selectedCourse;
            let subjectId = selectedSubject;

            // Create new course if needed
            if (isNewCourse && newCourseName.trim()) {
                const courseRes = await axiosInstance.post('/courses', {
                    title: newCourseName,
                    description: newCourseDescription,
                });
                courseId = courseRes.data.id;
                await fetchCourses(); // Refresh courses list
            }

            // Create new subject if needed
            if (isNewSubject && newSubjectName.trim() && courseId) {
                const subjectRes = await axiosInstance.post(`/courses/${courseId}/subjects`, {
                    title: newSubjectName,
                    description: newSubjectDescription,
                });
                subjectId = subjectRes.data.id;
            }

            if (editingRecording) {
                // Update existing recording
                await axiosInstance.patch(`/recordings/${editingRecording.id}`, {
                    title,
                    videoUrl,
                    description,
                });
                setEditingRecording(null);
            } else {
                // Create new recording
                await axiosInstance.post('/recordings', {
                    courseId,
                    subjectId,
                    title,
                    videoUrl,
                    description,
                });
            }

            setSuccess(true);
            setTitle('');
            setVideoUrl('');
            setDescription('');
            setNewCourseName('');
            setNewCourseDescription('');
            setNewSubjectName('');
            setNewSubjectDescription('');
            setSelectedCourse(courseId);
            fetchRecordings();
            setTimeout(() => setSuccess(false), 3000);
        } catch (err: any) {
            alert(err.response?.data?.message || `Failed to ${editingRecording ? 'update' : 'release'} recording`);
            console.error('Failed to release recording:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (recording: any) => {
        setEditingRecording(recording);
        setTitle(recording.title);
        setVideoUrl(recording.videoUrl || '');
        setDescription(recording.description || '');
        // Scroll to form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingRecording(null);
        setTitle('');
        setVideoUrl('');
        setDescription('');
    };

    const handleDelete = async (recordingId: string, title: string) => {
        if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) return;

        try {
            await axiosInstance.delete(`/recordings/${recordingId}`);
            fetchRecordings();
        } catch (err) {
            alert('Failed to delete recording');
        }
    };

    return (
        <div style={styles.container}>
            <style>{`
                .toggle-btn:hover:not(:disabled) {
                    background-color: var(--primary-light) !important;
                }
                .toggle-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
            `}</style>
            <div style={styles.grid} className="recordings-grid">
                {/* Release Form */}
                <div className="card recordings-form-card" style={styles.formCard}>
                    <div style={styles.formHeader}>
                        <div style={styles.iconWrapper}>
                            <Plus size={18} color="var(--primary)" />
                        </div>
                        <h3 style={styles.formTitle}>
                            {editingRecording ? 'Edit Recording' : 'Release New Content'}
                        </h3>
                    </div>

                    {editingRecording && (
                        <div style={styles.editBanner}>
                            <span>Editing: {editingRecording.title}</span>
                            <button type="button" onClick={handleCancelEdit} style={styles.cancelEditBtn}>
                                Cancel
                            </button>
                        </div>
                    )}

                    <form onSubmit={handleRelease} style={styles.form}>
                        {/* Course Selection */}
                        <div style={styles.field}>
                            <div style={styles.labelRow}>
                                <label style={styles.label}>Course</label>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsNewCourse(!isNewCourse);
                                        if (!isNewCourse) {
                                            setSelectedCourse('');
                                        } else {
                                            setNewCourseName('');
                                            setNewCourseDescription('');
                                        }
                                    }}
                                    style={styles.toggleBtn}
                                    className="toggle-btn"
                                >
                                    {isNewCourse ? 'Select Existing' : 'Create New'}
                                </button>
                            </div>

                            {isNewCourse ? (
                                <>
                                    <input
                                        type="text"
                                        placeholder="Enter new course name"
                                        value={newCourseName}
                                        onChange={(e) => setNewCourseName(e.target.value)}
                                        required
                                        style={styles.input}
                                    />
                                    <textarea
                                        placeholder="Course description (optional)"
                                        value={newCourseDescription}
                                        onChange={(e) => setNewCourseDescription(e.target.value)}
                                        style={styles.textarea}
                                        rows={2}
                                    />
                                </>
                            ) : (
                                <select
                                    style={styles.select}
                                    value={selectedCourse}
                                    onChange={(e) => {
                                        setSelectedCourse(e.target.value);
                                        setSelectedSubject('');
                                    }}
                                    required
                                >
                                    <option value="">Choose a course...</option>
                                    {courses.map((c) => (
                                        <option key={c.id} value={c.id}>{c.title}</option>
                                    ))}
                                </select>
                            )}
                        </div>

                        {/* Subject Selection */}
                        <div style={styles.field}>
                            <div style={styles.labelRow}>
                                <label style={styles.label}>Topic (Subject)</label>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsNewSubject(!isNewSubject);
                                        if (!isNewSubject) {
                                            setSelectedSubject('');
                                        } else {
                                            setNewSubjectName('');
                                            setNewSubjectDescription('');
                                        }
                                    }}
                                    style={styles.toggleBtn}
                                    className="toggle-btn"
                                    disabled={!isNewCourse && !selectedCourse}
                                >
                                    {isNewSubject ? 'Select Existing' : 'Create New'}
                                </button>
                            </div>

                            {isNewSubject ? (
                                <>
                                    <input
                                        type="text"
                                        placeholder="Enter new topic name"
                                        value={newSubjectName}
                                        onChange={(e) => setNewSubjectName(e.target.value)}
                                        required
                                        style={styles.input}
                                    />
                                    <textarea
                                        placeholder="Topic description (optional)"
                                        value={newSubjectDescription}
                                        onChange={(e) => setNewSubjectDescription(e.target.value)}
                                        style={styles.textarea}
                                        rows={2}
                                    />
                                </>
                            ) : (
                                <select
                                    style={styles.select}
                                    value={selectedSubject}
                                    onChange={(e) => setSelectedSubject(e.target.value)}
                                    disabled={!selectedCourse && !isNewCourse}
                                    required
                                >
                                    <option value="">Choose a topic...</option>
                                    {subjects.map((s) => (
                                        <option key={s.id} value={s.id}>{s.title}</option>
                                    ))}
                                </select>
                            )}
                        </div>

                        <div style={styles.field}>
                            <label style={styles.label}>Video Title</label>
                            <input
                                type="text"
                                placeholder="e.g. Introduction to Physics Part 1"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                style={styles.input}
                            />
                        </div>

                        <div style={styles.field}>
                            <label style={styles.label}>YouTube Video URL</label>
                            <input
                                type="url"
                                placeholder="https://youtube.com/watch?v=..."
                                value={videoUrl}
                                onChange={(e) => setVideoUrl(e.target.value)}
                                required
                                style={styles.input}
                            />
                        </div>

                        <button type="submit" className="btn-primary" disabled={loading} style={styles.submitBtn}>
                            {loading ? (editingRecording ? 'Updating...' : 'Releasing...') : (editingRecording ? 'Update Recording' : 'Release for Students')}
                        </button>

                        {success && (
                            <div style={styles.successMsg}>
                                <CheckCircle2 size={16} />
                                <span>Recording {editingRecording ? 'updated' : 'released'} successfully!</span>
                            </div>
                        )}
                    </form>
                </div>

                {/* Existing Content */}
                <div style={styles.listContainer}>
                    <div style={styles.listHeader}>
                        <h3 style={styles.listTitle}>Released Content</h3>
                        <p style={styles.listSubtitle}>Manage content visible to enrolled students</p>
                    </div>

                    {!selectedCourse ? (
                        <div style={styles.placeholder}>
                            <Tag size={48} color="var(--text-muted)" />
                            <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                                Select a course to view its released content
                            </p>
                        </div>
                    ) : recordings.length === 0 ? (
                        <div style={styles.placeholder}>
                            <Play size={48} color="var(--text-muted)" />
                            <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                                No recordings released for this course yet
                            </p>
                        </div>
                    ) : (
                        <div style={styles.recordingsList}>
                            {recordings.map((recording) => (
                                <div key={recording.id} className="card" style={styles.recordingCard}>
                                    <div style={styles.recordingIcon}>
                                        <Play size={18} color="var(--primary)" />
                                    </div>
                                    <div style={styles.recordingInfo}>
                                        <h4 style={styles.recordingTitle}>{recording.title}</h4>
                                        <div style={styles.recordingMeta}>
                                            <span style={styles.tag}>{recording.subject.title}</span>
                                            <span style={styles.date}>
                                                {new Date(recording.recordedAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                    <div style={styles.recordingActions}>
                                        <button
                                            onClick={() => handleEdit(recording)}
                                            style={styles.actionBtn}
                                            title="Edit recording"
                                        >
                                            <Edit2 size={16} color="var(--primary)" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(recording.id, recording.title)}
                                            style={styles.actionBtn}
                                            title="Delete recording"
                                        >
                                            <Trash2 size={16} color="var(--error)" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const styles: Record<string, React.CSSProperties> = {
    container: {
        padding: '0',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: '380px 1fr',
        gap: '24px',
        alignItems: 'start',
    },
    formCard: {
        position: 'sticky',
        top: '88px',
        padding: '24px',
    },
    formHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '20px',
        paddingBottom: '16px',
        borderBottom: '1px solid var(--border)',
    },
    iconWrapper: {
        width: '32px',
        height: '32px',
        backgroundColor: 'var(--primary-light)',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    formTitle: {
        fontSize: '16px',
        fontWeight: '600',
        color: 'var(--text-main)',
        margin: 0,
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    field: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    labelRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    label: {
        fontSize: '13px',
        fontWeight: '500',
        color: 'var(--text-secondary)',
    },
    toggleBtn: {
        fontSize: '12px',
        fontWeight: '500',
        color: 'var(--primary)',
        backgroundColor: 'transparent',
        border: 'none',
        padding: '4px 8px',
        cursor: 'pointer',
        borderRadius: 'var(--radius-sm)',
        transition: 'all 0.15s ease',
    },
    select: {
        padding: '10px 12px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border)',
        backgroundColor: 'white',
        width: '100%',
        cursor: 'pointer',
        fontSize: '14px',
        color: 'var(--text-main)',
    },
    input: {
        padding: '10px 12px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border)',
        backgroundColor: 'white',
        width: '100%',
        fontSize: '14px',
        color: 'var(--text-main)',
    },
    textarea: {
        padding: '10px 12px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border)',
        backgroundColor: 'white',
        width: '100%',
        fontSize: '14px',
        color: 'var(--text-main)',
        fontFamily: 'inherit',
        resize: 'vertical',
    },
    submitBtn: {
        marginTop: '8px',
    },
    successMsg: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        justifyContent: 'center',
        color: '#059669',
        fontSize: '13px',
        fontWeight: '500',
        backgroundColor: '#ecfdf5',
        padding: '10px 12px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid #d1fae5',
    },
    listContainer: {
        flex: 1,
    },
    listHeader: {
        marginBottom: '20px',
    },
    listTitle: {
        fontSize: '18px',
        fontWeight: '600',
        color: 'var(--text-main)',
        marginBottom: '4px',
        margin: 0,
    },
    listSubtitle: {
        fontSize: '14px',
        color: 'var(--text-muted)',
        margin: 0,
    },
    recordingsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    },
    recordingCard: {
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        padding: '16px',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        backgroundColor: 'white',
        transition: 'all 0.15s ease',
    },
    recordingIcon: {
        width: 36,
        height: 36,
        borderRadius: 'var(--radius-md)',
        backgroundColor: '#eff6ff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    recordingInfo: {
        flex: 1,
        minWidth: 0,
    },
    recordingActions: {
        display: 'flex',
        gap: '8px',
        flexShrink: 0,
    },
    actionBtn: {
        padding: '8px',
        borderRadius: 'var(--radius-md)',
        border: 'none',
        backgroundColor: 'transparent',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background-color 0.15s ease',
    },
    editBanner: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px',
        backgroundColor: '#eff6ff',
        borderRadius: 'var(--radius-md)',
        marginBottom: '16px',
        fontSize: '14px',
        color: 'var(--primary)',
        fontWeight: '500',
    },
    cancelEditBtn: {
        padding: '4px 12px',
        fontSize: '13px',
        color: 'var(--primary)',
        backgroundColor: 'white',
        border: '1px solid var(--primary)',
        borderRadius: 'var(--radius-sm)',
        cursor: 'pointer',
        fontWeight: '500',
    },
    recordingTitle: {
        fontSize: '14px',
        fontWeight: '600',
        color: 'var(--text-main)',
        marginBottom: '4px',
        margin: '0 0 4px 0',
    },
    recordingMeta: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        flexWrap: 'wrap',
    },
    tag: {
        fontSize: '12px',
        fontWeight: '500',
        color: 'var(--primary)',
        backgroundColor: 'var(--primary-light)',
        padding: '2px 8px',
        borderRadius: '4px',
    },
    date: {
        fontSize: '12px',
        color: 'var(--text-muted)',
    },
    placeholder: {
        textAlign: 'center' as const,
        padding: '60px 32px',
        backgroundColor: 'white',
        borderRadius: 'var(--radius-lg)',
        border: '1px dashed var(--border)',
        color: 'var(--text-muted)',
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        gap: '12px',
    },
};

// Add media query styles
const mediaQueryStyles = `
    @media (max-width: 1024px) {
        .recordings-grid {
            grid-template-columns: 320px 1fr !important;
            gap: 20px !important;
        }
    }

    @media (max-width: 768px) {
        .recordings-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
        }
        .recordings-form-card {
            position: static !important;
            top: auto !important;
        }
    }
`;

// Inject styles
if (typeof document !== 'undefined') {
    const styleId = 'recordings-responsive-styles';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = mediaQueryStyles;
        document.head.appendChild(style);
    }
}
