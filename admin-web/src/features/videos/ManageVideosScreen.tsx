import { useEffect, useState } from 'react';
import axiosInstance from '../../lib/axios';
import { useUserRole, isAdmin } from '../../lib/roleHelper';
import { Search, Edit2, Trash2, Play, X } from 'lucide-react';

export const ManageVideosScreen = () => {
    const [recordings, setRecordings] = useState<any[]>([]);
    const [filteredRecordings, setFilteredRecordings] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [editingRecording, setEditingRecording] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const userRole = useUserRole();

    const [formData, setFormData] = useState({
        title: '',
        videoUrl: '',
        description: '',
    });

    useEffect(() => {
        fetchRecordings();
    }, []);

    useEffect(() => {
        if (searchTerm) {
            const filtered = recordings.filter((r) =>
                r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                r.subject?.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredRecordings(filtered);
        } else {
            setFilteredRecordings(recordings);
        }
    }, [searchTerm, recordings]);

    const fetchRecordings = async () => {
        setLoading(true);
        try {
            const endpoint = isAdmin(userRole) ? '/admin/recordings' : '/recordings';
            const response = await axiosInstance.get(endpoint);
            setRecordings(response.data || []);
            setFilteredRecordings(response.data || []);
        } catch (err) {
            console.error('Failed to fetch recordings:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (recording: any) => {
        setEditingRecording(recording);
        setFormData({
            title: recording.title,
            videoUrl: recording.videoUrl || '',
            description: recording.description || '',
        });
        setIsModalOpen(true);
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingRecording) return;

        try {
            await axiosInstance.patch(`/recordings/${editingRecording.id}`, formData);
            setIsModalOpen(false);
            setEditingRecording(null);
            setFormData({ title: '', videoUrl: '', description: '' });
            fetchRecordings();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to update recording');
        }
    };

    const handleDelete = async (recordingId: string, title: string) => {
        if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) return;

        try {
            const endpoint = isAdmin(userRole) ? `/admin/recordings/${recordingId}` : `/recordings/${recordingId}`;
            await axiosInstance.delete(endpoint);
            fetchRecordings();
        } catch (err) {
            alert('Failed to delete recording');
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingRecording(null);
        setFormData({ title: '', videoUrl: '', description: '' });
    };

    return (
        <div className="manage-videos-page">
            {/* Header / Filter Toolbar */}
            <div className="toolbar card animate-fade-in">
                <div className="search-wrapper">
                    <Search size={18} className="text-muted" />
                    <input
                        type="text"
                        placeholder="Search videos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>
            </div>

            {/* Videos List / Grid */}
            {loading ? (
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading videos...</p>
                </div>
            ) : filteredRecordings.length === 0 ? (
                <div className="empty-state animate-fade-in">
                    <div className="empty-icon-wrapper">
                        <Play size={48} />
                    </div>
                    <h3>No Videos Found</h3>
                    <p>{searchTerm ? 'No recordings match your search criteria.' : 'No recordings available yet.'}</p>
                </div>
            ) : (
                <div className="video-grid">
                    {filteredRecordings.map((recording) => (
                        <div key={recording.id} className="card video-card animate-scale-in">
                            <div className="video-thumbnail">
                                <div className="play-overlay">
                                    <Play size={32} fill="currentColor" />
                                </div>
                                <span className="subject-tag">{recording.subject?.title}</span>
                            </div>

                            <div className="video-info">
                                <h4 className="video-title" title={recording.title}>{recording.title}</h4>
                                <p className="video-date">
                                    {new Date(recording.recordedAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                                {recording.description && (
                                    <p className="video-desc">{recording.description}</p>
                                )}
                                {recording.subject?.course && (
                                    <p className="video-course">
                                        Course: {recording.subject.course.title}
                                    </p>
                                )}
                            </div>

                            <div className="video-footer">
                                <button
                                    onClick={() => handleEdit(recording)}
                                    className="btn-ghost btn-sm"
                                    title="Edit details"
                                >
                                    <Edit2 size={16} />
                                    <span>Edit</span>
                                </button>
                                <button
                                    onClick={() => handleDelete(recording.id, recording.title)}
                                    className="btn-ghost btn-sm text-error"
                                    title="Delete video"
                                >
                                    <Trash2 size={16} />
                                    <span>Delete</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Edit Modal */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content card animate-fade-in">
                        <div className="modal-header">
                            <h3 className="modal-title">Edit Video Details</h3>
                            <button onClick={handleCloseModal} className="close-button">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleUpdate} className="modal-body p-0">
                            <div className="form-content">
                                <div className="input-group">
                                    <label>Video Title</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                        placeholder="Enter descriptive title"
                                    />
                                </div>

                                <div className="input-group">
                                    <label>Video URL / Path</label>
                                    <input
                                        type="text"
                                        value={formData.videoUrl}
                                        onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                                        required
                                        placeholder="e.g. https://youtube.com/..."
                                    />
                                </div>

                                <div className="input-group">
                                    <label>Description (Optional)</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={4}
                                        placeholder="Brief summary of the video content..."
                                    />
                                </div>
                            </div>

                            <div className="modal-actions-footer">
                                <button type="button" onClick={handleCloseModal} className="btn-ghost">
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary">
                                    Update Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
                .manage-videos-page {
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                }

                .toolbar {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 20px;
                    padding: 16px 24px;
                    flex-wrap: wrap;
                }

                .filter-group {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    flex: 1;
                    min-width: 280px;
                }

                .course-select {
                    flex: 1;
                    height: 42px;
                    padding: 0 12px;
                    background-color: var(--bg-main);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-md);
                    font-size: 14px;
                    color: var(--text-main);
                    cursor: pointer;
                    transition: border-color 0.2s;
                }

                .course-select:focus {
                    outline: none;
                    border-color: var(--primary);
                }

                .search-wrapper {
                    position: relative;
                    flex: 1;
                    max-width: 360px;
                }

                .search-wrapper svg {
                    position: absolute;
                    left: 12px;
                    top: 50%;
                    transform: translateY(-50%);
                    pointer-events: none;
                }

                .search-wrapper input {
                    width: 100%;
                    height: 42px;
                    padding: 0 12px 0 40px;
                    background-color: var(--bg-main);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-md);
                    font-size: 14px;
                }

                .video-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 24px;
                }

                .video-card {
                    padding: 0;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    height: 100%;
                }

                .video-card:hover {
                    transform: translateY(-4px);
                    box-shadow: var(--shadow-lg);
                }

                .video-thumbnail {
                    width: 100%;
                    padding-bottom: 56.25%; /* 16:9 Aspect Ratio */
                    background: linear-gradient(135deg, var(--primary), var(--primary-hover));
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .play-overlay {
                    position: absolute;
                    inset: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: rgba(255, 255, 255, 0.9);
                    transition: transform 0.3s ease;
                }

                .video-card:hover .play-overlay {
                    transform: scale(1.1);
                }

                .subject-tag {
                    position: absolute;
                    top: 12px;
                    left: 12px;
                    background: rgba(0, 0, 0, 0.4);
                    backdrop-filter: blur(4px);
                    color: white;
                    padding: 4px 10px;
                    border-radius: 99px;
                    font-size: 11px;
                    font-weight: 500;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .video-info {
                    padding: 20px;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .video-title {
                    font-size: 16px;
                    font-weight: 600;
                    color: var(--text-main);
                    margin: 0;
                    line-height: 1.4;
                    display: -webkit-box;
                    WebkitLineClamp: 2;
                    WebkitBoxOrient: vertical;
                    overflow: hidden;
                }

                .video-date {
                    font-size: 12px;
                    color: var(--text-muted);
                    font-weight: 500;
                }

                .video-desc {
                    font-size: 13px;
                    color: var(--text-secondary);
                    line-height: 1.5;
                    margin-top: 4px;
                    display: -webkit-box;
                    WebkitLineClamp: 2;
                    WebkitBoxOrient: vertical;
                    overflow: hidden;
                }

                .video-course {
                    font-size: 12px;
                    color: var(--primary);
                    font-weight: 500;
                    margin-top: 8px;
                }

                .video-footer {
                    padding: 12px 20px;
                    display: flex;
                    gap: 12px;
                    background-color: var(--bg-main);
                    border-top: 1px solid var(--border-light);
                }

                .btn-sm {
                    padding: 6px 12px;
                    font-size: 13px;
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
                }

                .modal-content {
                    width: 100%;
                    max-width: 520px;
                    padding: 0;
                    overflow: hidden;
                }

                .modal-header {
                    padding: 20px 24px;
                    border-bottom: 1px solid var(--border);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .modal-title {
                    font-size: 18px;
                    font-weight: 600;
                }

                .form-content {
                    padding: 24px;
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                .input-group label {
                    display: block;
                    font-size: 13px;
                    font-weight: 500;
                    color: var(--text-secondary);
                    margin-bottom: 6px;
                }

                .input-group input, .input-group textarea {
                    width: 100%;
                    padding: 10px 14px;
                    border: 1px solid var(--border);
                    border-radius: var(--radius-md);
                    font-size: 14px;
                    transition: all 0.2s;
                    font-family: inherit;
                }

                .input-group input:focus, .input-group textarea:focus {
                    outline: none;
                    border-color: var(--primary);
                    box-shadow: 0 0 0 3px var(--primary-alpha);
                }

                .modal-actions-footer {
                    padding: 16px 24px;
                    background-color: var(--bg-main);
                    border-top: 1px solid var(--border);
                    display: flex;
                    justify-content: flex-end;
                    gap: 12px;
                }

                .p-0 { padding: 0; }
                .text-error { color: var(--error); }
                .text-muted { color: var(--text-muted); }

                @media (max-width: 640px) {
                    .toolbar {
                        padding: 16px;
                    }
                    .filter-group, .search-wrapper {
                        max-width: none;
                        width: 100%;
                    }
                }
            `}</style>
        </div>
    );
};
