import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots } from '@fortawesome/free-regular-svg-icons';
import {
    fetchCommentsByLeadId,
    postCommentForMe
} from '@/utils/commentApi'; // adjust the path as needed

export default function CommentModal({ leadId, leadName, open, onClose }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        if (leadId && open) {
            fetchCommentsByLeadId(leadId)
                .then(setComments)
                .catch(console.error);
        }
    }, [leadId, open]);

    const handlePost = async () => {
        try {
            await postCommentForMe({ lead_id: leadId, leads_comment: newComment });
            setNewComment('');
            const updated = await fetchCommentsByLeadId(leadId);
            setComments(updated);
        } catch (err) {
            console.error('Post error:', err);
        }
    };

    if (!open) return null;


    return (
        <div className="z-50 flex h-full items-center justify-center">
            <div className="rounded-2xl shadow-2xl w-full max-w-lg bg-white">
                <div className="rounded-t-2xl px-8 py-6 flex items-center" style={{ background: 'var(--comment-header-bg)' }}>
                    <span className="mr-3 text-xl text-primary">
                        <FontAwesomeIcon icon={faCommentDots} />
                    </span>
                    <h2 className="font-semibold text-lg" style={{color : 'var(--color-black)'}}>💬 Commenting on: {leadName}</h2>
                </div>
                <div className="px-8 py-6 max-h-[70vh] overflow-y-auto">
                    {/* Existing Comments */}
                    <section className="mb-6">
                        {comments.map((c, i) => (
                            <div key={i} className="flex items-start space-x-4 py-3 border-b border-gray-100">
                                {c.user_id?.logo ? (
                                    <img
                                        src={c.user_id.logo}
                                        alt="Avatar"
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-10 h-10 bg-primary bg-opacity-10 font-bold flex items-center justify-center rounded-full"
                                    style={{color : 'var(--color-black'}} >
                                        {c.comment_type?.charAt(0) || 'U'}
                                    </div>
                                )}

                                <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-1">
                                        <span className="font-semibold text-sm" style={{color : 'var(--color-black'}}>{c.comment_type || 'User'}</span>
                                        <span className="text-xs text-secondary" >| {new Date(c.createdAt).toLocaleString()}</span>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl px-4 py-3 text-sm shadow-soft" style={{ color: 'var(--text-secondry-black)' }}>
                                        {c.leads_comment}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {comments.length === 0 && <div className="text-sm" style={{color : 'var(--color-black'}}>No comments yet.</div>}
                    </section>

                    {/* Add Comment */}
                    <div className="mt-4">
                        <label for="comment-input" class="block font-medium text-base mb-2" style={{color : 'var(--color-black'}}>Add Comment</label>            <textarea
                            rows={3}
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm mb-3 resize-none focus:outline-none focus:ring-primary focus:border-primary"
                            placeholder="Write an internal note or tag a teammate…"
                            value={newComment}
                            style={{ color: 'var(--text-secondry-black)' }}
                            onChange={(e) => setNewComment(e.target.value)}
                        />
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 cursor-pointer text-sm rounded-lg border border-gray-200 bg-white"
                                style={{ color: 'var(--color-black)' }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handlePost}
                                className="px-4 cursor-pointer py-2 text-sm rounded-lg text-white font-semibold hover:bg-[#0090b6]"
                                style={{ background: 'var(--color-primary)' }}
                            >
                                Post
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

