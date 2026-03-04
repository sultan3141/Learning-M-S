import { useEffect, useState } from 'react';
import axiosInstance from '../../lib/axios';
import { useUserRole, isAdmin } from '../../lib/roleHelper';
import { Search, UserPlus, X, Trash2, Copy, Check, Phone, HelpCircle, User as UserIcon, Edit2, Key } from 'lucide-react';



export const StudentsScreen = () => {
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [generatedCredentials, setGeneratedCredentials] = useState<any | null>(null);
    const [copied, setCopied] = useState(false);
    const [editingStudent, setEditingStudent] = useState<any | null>(null);
    const userRole = useUserRole();


    const [formData, setFormData] = useState({
        fullName: '',
        age: '',
        phoneNumber: '',
        interest: '',
    });

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const endpoint = isAdmin(userRole) ? '/admin/students' : '/courses/teacher/students';
            const response = await axiosInstance.get(endpoint);
            setStudents(response.data);
        } catch (err) {
            console.error('Failed to fetch students:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (editingStudent) {
                // Update existing student
                await axiosInstance.patch(`/auth/teacher/student/${editingStudent.id}`, {
                    fullName: formData.fullName,
                    age: parseInt(formData.age),
                    phoneNumber: formData.phoneNumber,
                    interest: formData.interest
                });
                setIsModalOpen(false);
                setEditingStudent(null);
            } else {
                // Register new student
                const res = await axiosInstance.post('/auth/teacher/register-student', {
                    fullName: formData.fullName,
                    age: parseInt(formData.age),
                    phoneNumber: formData.phoneNumber,
                    interest: formData.interest
                });
                setGeneratedCredentials(res.data);
            }

            setFormData({ fullName: '', age: '', phoneNumber: '', interest: '' });
            fetchStudents();
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || `Failed to ${editingStudent ? 'update' : 'register'} student`;
            alert(errorMessage);
            console.error('Registration error:', err.response?.data || err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (student: any) => {
        setEditingStudent(student);
        setFormData({
            fullName: student.fullName,
            age: student.age?.toString() || '',
            phoneNumber: student.phoneNumber || '',
            interest: student.interest || '',
        });
        setGeneratedCredentials(null);
        setIsModalOpen(true);
    };

    const handleDelete = async (studentId: string, fullName: string) => {
        if (!confirm(`Are you sure you want to delete ${fullName}? This action cannot be undone.`)) return;

        try {
            await axiosInstance.delete(`/auth/teacher/student/${studentId}`);
            fetchStudents();
        } catch (err) {
            alert('Failed to delete student');
        }
    };

    const handleResetPassword = async (studentId: string, fullName: string) => {
        if (!confirm(`Reset password for ${fullName}? A new password will be generated.`)) return;

        try {
            const res = await axiosInstance.post(`/auth/teacher/student/${studentId}/reset-password`);
            setGeneratedCredentials(res.data);
            setIsModalOpen(true);
        } catch (err) {
            alert('Failed to reset password');
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingStudent(null);
        setGeneratedCredentials(null);
        setFormData({ fullName: '', age: '', phoneNumber: '', interest: '' });
    };

    const handleCopy = () => {
        if (!generatedCredentials) return;
        const text = `Student: ${generatedCredentials.fullName}\nUsername: ${generatedCredentials.username}\nPassword: ${generatedCredentials.password}`;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };



    const filteredStudents = students.filter(
        (s) =>
            s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="students-page">
            <div className="page-header">
                <div className="search-bar-wrapper">
                    <Search className="search-icon" size={20} />
                    <input
                        className="search-input"
                        type="text"
                        placeholder="Search students by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button
                    onClick={() => {
                        setIsModalOpen(true);
                        setGeneratedCredentials(null);
                        setEditingStudent(null);
                        setFormData({ fullName: '', age: '', phoneNumber: '', interest: '' });
                    }}
                    className="btn-primary"
                >
                    <UserPlus size={18} />
                    <span>Register New Student</span>
                </button>
            </div>

            {loading ? (
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Fetching student records...</p>
                </div>
            ) : (
                <div className="card table-card animate-fade-in">
                    <div className="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th>Student Details</th>
                                    <th>Contact & Info</th>
                                    <th>Enrolled Courses</th>
                                    <th className="text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.length > 0 ? (
                                    filteredStudents.map((student) => {
                                        // Handle both admin and teacher data structures
                                        const studentId = student.id || student.studentId;
                                        const courses = student.enrollments || student.courses || [];
                                        
                                        return (
                                            <tr key={studentId}>
                                                <td>
                                                    <div className="user-profile-cell">
                                                        <div className="user-avatar-small">
                                                            {student.fullName.charAt(0)}
                                                        </div>
                                                        <div className="user-meta">
                                                            <p className="user-fullname">{student.fullName}</p>
                                                            <p className="user-email">{student.email}</p>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                                                                <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '500' }}>
                                                                    User:
                                                                </span>
                                                                <code style={{
                                                                    fontSize: '10px',
                                                                    padding: '1px 4px',
                                                                    backgroundColor: 'var(--bg-main)',
                                                                    borderRadius: '3px',
                                                                    color: 'var(--text-secondary)',
                                                                    fontWeight: '500'
                                                                }}>
                                                                    {student.email}
                                                                </code>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="contact-info">
                                                        {student.age && (
                                                            <div className="info-item">
                                                                <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)' }}>Age:</span>
                                                                <span>{student.age}</span>
                                                            </div>
                                                        )}
                                                        {student.phoneNumber && (
                                                            <div className="info-item">
                                                                <Phone size={14} className="text-muted" />
                                                                <span>{student.phoneNumber}</span>
                                                            </div>
                                                        )}
                                                        {student.interest && (
                                                            <div className="info-item">
                                                                <HelpCircle size={14} className="text-muted" />
                                                                <span className="truncate">{student.interest}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td>
                                                    {courses.length > 0 ? (
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                            {courses.map((item: any, idx: number) => {
                                                                const courseTitle = item.course?.title || item.courseTitle;
                                                                const courseId = item.course?.id || item.courseId || idx;
                                                                return (
                                                                    <span key={courseId} className="badge">
                                                                        {courseTitle}
                                                                    </span>
                                                                );
                                                            })}
                                                        </div>
                                                    ) : (
                                                        <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                                                            Not enrolled
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="text-right">
                                                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                        <button
                                                            onClick={() => handleResetPassword(studentId, student.fullName)}
                                                            className="btn-ghost btn-icon"
                                                            title="Reset password"
                                                        >
                                                            <Key size={16} style={{ color: 'var(--warning)' }} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleEdit(student)}
                                                            className="btn-ghost btn-icon"
                                                            title="Edit student"
                                                        >
                                                            <Edit2 size={16} style={{ color: 'var(--primary)' }} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(studentId, student.fullName)}
                                                            className="btn-ghost btn-icon"
                                                            title="Delete student"
                                                        >
                                                            <Trash2 size={16} className="text-error" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="empty-row">
                                            <div className="empty-content">
                                                <UserIcon size={48} className="text-muted" />
                                                <p>No students found matching your search.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content card animate-fade-in">
                        <div className="modal-header">
                            <h3 className="modal-title">
                                {generatedCredentials ? 'New Password Generated' : editingStudent ? 'Edit Student' : 'Register Student'}
                            </h3>
                            <button onClick={handleCloseModal} className="close-button">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="modal-body">
                            {generatedCredentials ? (
                                <div className="success-layout">
                                    <div className="success-banner">
                                        <div className="success-icon">
                                            <Check size={24} />
                                        </div>
                                        <div className="success-text">
                                            <p className="success-title">
                                                {editingStudent ? 'Password Reset!' : 'Successfully Registered!'}
                                            </p>
                                            <p className="success-desc">Share these credentials with the student.</p>
                                        </div>
                                    </div>

                                    <div className="credentials-list">
                                        <div className="credential-item">
                                            <label>Username</label>
                                            <div className="value-row">
                                                <code>{generatedCredentials.username}</code>
                                            </div>
                                        </div>
                                        <div className="credential-item">
                                            <label>Temporary Password</label>
                                            <div className="value-row">
                                                <code>{generatedCredentials.password}</code>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="modal-actions">
                                        <button onClick={handleCopy} className="btn-secondary w-full">
                                            {copied ? <Check size={16} /> : <Copy size={16} />}
                                            {copied ? 'Copied to Clipboard' : 'Copy All Info'}
                                        </button>
                                        <button onClick={handleCloseModal} className="btn-primary w-full">
                                            Done
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleRegister} className="registration-form">
                                    <div className="input-group">
                                        <label>Full Name</label>
                                        <input
                                            required
                                            type="text"
                                            value={formData.fullName}
                                            onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                            placeholder="Student's complete name"
                                        />
                                    </div>

                                    <div className="form-row">
                                        <div className="input-group flex-1">
                                            <label>Age</label>
                                            <input
                                                required
                                                type="number"
                                                min="1"
                                                max="120"
                                                value={formData.age}
                                                onChange={e => setFormData({ ...formData, age: e.target.value })}
                                                placeholder="Age"
                                            />
                                        </div>
                                        <div className="input-group flex-2">
                                            <label>Phone Number</label>
                                            <input
                                                required
                                                type="tel"
                                                value={formData.phoneNumber}
                                                onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
                                                placeholder="+251 9... or Email"
                                            />
                                        </div>
                                    </div>

                                    <div className="input-group">
                                        <label>Course Interest</label>
                                        <input
                                            required
                                            type="text"
                                            value={formData.interest}
                                            onChange={e => setFormData({ ...formData, interest: e.target.value })}
                                            placeholder="Mathematics, Art, etc..."
                                        />
                                    </div>

                                    <div className="form-info-box">
                                        <HelpCircle size={16} />
                                        <span>{editingStudent ? 'Update student information.' : 'Credentials will be auto-generated securely.'}</span>
                                    </div>

                                    <div className="modal-actions">
                                        <button
                                            type="button"
                                            onClick={handleCloseModal}
                                            className="btn-ghost"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="btn-primary"
                                        >
                                            {submitting ? (editingStudent ? 'Updating...' : 'Registering...') : (editingStudent ? 'Update Student' : 'Register Student')}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .students-page {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                .page-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 16px;
                    margin-bottom: 4px;
                }

                .search-bar-wrapper {
                    position: relative;
                    flex: 1;
                    max-width: 400px;
                }

                .search-icon {
                    position: absolute;
                    left: 14px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: var(--text-muted);
                }

                .search-input {
                    padding-left: 42px;
                    background-color: white;
                    border: 1px solid var(--border);
                    height: 40px;
                    font-size: 14px;
                }

                .search-input:focus {
                    border-color: var(--primary);
                    box-shadow: 0 0 0 3px var(--primary-alpha);
                }

                .table-card {
                    padding: 0;
                    overflow: hidden;
                }

                .table-responsive {
                    overflow-x: auto;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                }

                thead {
                    background-color: var(--bg-main);
                    border-bottom: 1px solid var(--border);
                }

                th {
                    padding: 12px 20px;
                    text-align: left;
                    font-size: 11px;
                    font-weight: 600;
                    color: var(--text-muted);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                td {
                    padding: 16px 20px;
                    border-bottom: 1px solid var(--border-light);
                }

                tbody tr:last-child td {
                    border-bottom: none;
                }

                tbody tr:hover {
                    background-color: var(--bg-main);
                }

                .user-profile-cell {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .user-avatar-small {
                    width: 36px;
                    height: 36px;
                    background-color: var(--primary-light);
                    color: var(--primary);
                    border-radius: var(--radius-md);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 600;
                    font-size: 13px;
                    flex-shrink: 0;
                }

                .user-meta {
                    min-width: 0;
                }

                .user-fullname {
                    font-weight: 600;
                    color: var(--text-main);
                    font-size: 14px;
                    margin-bottom: 2px;
                }

                .user-email {
                    font-size: 13px;
                    color: var(--text-muted);
                }

                .contact-info {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }

                .info-item {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 13px;
                    color: var(--text-secondary);
                }

                .badge {
                    display: inline-flex;
                    align-items: center;
                    padding: 4px 10px;
                    background-color: #ecfdf5;
                    color: #059669;
                    border-radius: 99px;
                    font-size: 12px;
                    font-weight: 500;
                    white-space: nowrap;
                }

                .text-right { text-align: right; }
                .text-error { color: var(--error); }
                .text-muted { color: var(--text-muted); }
                .w-full { width: 100%; }
                .flex-1 { flex: 1; }
                .flex-2 { flex: 2; }
                .truncate {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    max-width: 180px;
                }

                .btn-icon {
                    padding: 8px;
                    border-radius: var(--radius-md);
                }

                .btn-icon:hover {
                    background-color: #fef2f2;
                }

                .empty-row {
                    padding: 60px 0;
                    text-align: center;
                }

                .empty-content {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 12px;
                    color: var(--text-muted);
                }

                .empty-content p {
                    font-size: 14px;
                }

                .modal-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.4);
                    backdrop-filter: blur(4px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 100;
                    padding: 20px;
                    animation: fadeIn 0.2s ease;
                }

                .modal-content {
                    width: 100%;
                    max-width: 500px;
                    padding: 0;
                    overflow: hidden;
                    box-shadow: var(--shadow-xl);
                    animation: slideUp 0.3s ease;
                }

                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .modal-header {
                    padding: 20px 24px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid var(--border);
                }

                .modal-title {
                    font-size: 18px;
                    font-weight: 600;
                    color: var(--text-main);
                }

                .close-button {
                    color: var(--text-muted);
                    padding: 4px;
                    border-radius: var(--radius-sm);
                }

                .close-button:hover {
                    background-color: var(--bg-main);
                    color: var(--text-main);
                }

                .modal-body {
                    padding: 24px;
                }

                .registration-form {
                    display: flex;
                    flex-direction: column;
                }

                .form-row {
                    display: flex;
                    gap: 12px;
                }

                .input-group {
                    margin-bottom: 16px;
                }

                .input-group label {
                    display: block;
                    font-size: 13px;
                    font-weight: 500;
                    color: var(--text-secondary);
                    margin-bottom: 6px;
                }

                .input-group input {
                    width: 100%;
                    padding: 10px 12px;
                    border: 1px solid var(--border);
                    border-radius: var(--radius-md);
                    font-size: 14px;
                }

                .input-group input:focus {
                    outline: none;
                    border-color: var(--primary);
                    box-shadow: 0 0 0 3px var(--primary-alpha);
                }

                .form-info-box {
                    padding: 12px;
                    background-color: #eff6ff;
                    border-radius: var(--radius-md);
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    color: #1e40af;
                    font-size: 13px;
                    margin-bottom: 20px;
                    border: 1px solid #dbeafe;
                }

                .modal-actions {
                    display: flex;
                    gap: 10px;
                    justify-content: flex-end;
                    margin-top: 20px;
                }

                .success-layout {
                    display: flex;
                    flex-direction: column;
                }

                .success-banner {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    padding: 16px;
                    background-color: #ecfdf5;
                    border-radius: var(--radius-md);
                    margin-bottom: 20px;
                    border: 1px solid #d1fae5;
                }

                .success-icon {
                    width: 40px;
                    height: 40px;
                    background-color: var(--success);
                    color: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }

                .success-text {
                    flex: 1;
                }

                .success-title {
                    font-weight: 600;
                    color: #065f46;
                    font-size: 15px;
                    margin-bottom: 2px;
                }

                .success-desc {
                    font-size: 13px;
                    color: #059669;
                }

                .credentials-list {
                    background-color: var(--bg-main);
                    border-radius: var(--radius-md);
                    padding: 20px;
                    margin-bottom: 20px;
                    border: 1px solid var(--border);
                }

                .credential-item {
                    margin-bottom: 16px;
                }

                .credential-item:last-child { 
                    margin-bottom: 0; 
                }

                .credential-item label {
                    display: block;
                    font-size: 11px;
                    font-weight: 600;
                    color: var(--text-muted);
                    text-transform: uppercase;
                    margin-bottom: 6px;
                    letter-spacing: 0.05em;
                }

                code {
                    font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace;
                    background-color: white;
                    padding: 10px 12px;
                    border-radius: var(--radius-md);
                    border: 1px solid var(--border);
                    display: block;
                    font-size: 14px;
                    color: var(--text-main);
                    font-weight: 500;
                }

                .loading-state {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 16px;
                    padding: 80px 0;
                    color: var(--text-muted);
                }

                .loading-state p {
                    font-size: 14px;
                }

                .spinner {
                    width: 36px;
                    height: 36px;
                    border: 3px solid var(--border);
                    border-top-color: var(--primary);
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @media(max-width: 768px) {
                    .page-header { 
                        flex-direction: column; 
                        align-items: stretch; 
                        gap: 12px;
                    }
                    .search-bar-wrapper {
                        max-width: 100%;
                    }
                    .form-row { 
                        flex-direction: column; 
                        gap: 0; 
                    }
                    .modal-actions { 
                        flex-direction: column-reverse; 
                    }
                    .modal-actions button {
                        width: 100%;
                    }
                    .modal-content {
                        max-width: 100%;
                        margin: 0 16px;
                    }
                    .table-card {
                        overflow-x: auto;
                    }
                    table {
                        min-width: 600px;
                    }
                    th, td {
                        padding: 12px 16px;
                        font-size: 13px;
                    }
                    .user-avatar-small {
                        width: 32px;
                        height: 32px;
                        font-size: 12px;
                    }
                    .user-fullname {
                        font-size: 13px;
                    }
                    .user-email {
                        font-size: 12px;
                    }
                    .info-item {
                        font-size: 12px;
                    }
                    .badge {
                        font-size: 11px;
                        padding: 3px 8px;
                    }
                }

                @media(max-width: 480px) {
                    .students-page {
                        gap: 16px;
                    }
                    .page-header button span {
                        display: none;
                    }
                    .modal-header {
                        padding: 16px 20px;
                    }
                    .modal-body {
                        padding: 20px;
                    }
                    .modal-title {
                        font-size: 16px;
                    }
                    .input-group label {
                        font-size: 12px;
                    }
                    .input-group input,
                    .input-group textarea {
                        font-size: 14px;
                        padding: 10px;
                    }
                }
            `}</style>
        </div>
    );
};
