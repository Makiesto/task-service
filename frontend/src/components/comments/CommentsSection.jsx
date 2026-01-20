import React, {useState, useEffect} from 'react';
import {Trash2, MessageSquare} from 'lucide-react';
import {api} from '../../api/api';

const CommentsSection = ({taskId, currentUserId}) => {
    const [comments, setComments] = useState([]);
    const [content, setContent] = useState("");
    const [error, setError] = useState(null);
    const [userNames, setUserNames] = useState({});

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const data = await api.getCommentsByTaskId(taskId);
                setComments(data);

                const uniqueUserIds = [...new Set(data.map(c => c.userId))];
                const names = {};

                await Promise.all(
                    uniqueUserIds.map(async (userId) => {
                        try {
                            const user = await api.getUserById(userId);
                            names[userId] = `${user.firstName} ${user.lastName}`;
                        } catch (err) {
                            names[userId] = 'Unknown User';
                        }
                    })
                );

                setUserNames(names);
            } catch (err) {
                setError("Failed to load comments.");
                console.error('Error fetching comments:', err);
            }
        };
        if (taskId) fetchComments();
    }, [taskId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;

        try {
            const newComment = await api.createComment({
                content: content,
                userId: currentUserId,
                taskId: taskId
            });

            try {
                const user = await api.getUserById(currentUserId);
                setUserNames(prev => ({
                    ...prev,
                    [currentUserId]: `${user.firstName} ${user.lastName}`
                }));
            } catch (err) {
                setUserNames(prev => ({
                    ...prev,
                    [currentUserId]: 'You'
                }));
            }

            setComments([newComment, ...comments]);
            setContent("");
            setError(null);
        } catch (err) {
            setError("Could not post comment.");
            console.error('Error posting comment:', err);
        }
    };

    const handleDelete = async (commentId) => {
        if (!window.confirm("Delete this comment?")) return;

        try {
            await api.deleteComment(commentId);
            setComments(comments.filter(c => c.id !== commentId));
            setError(null);
        } catch (err) {
            setError("Error deleting comment.");
            console.error('Error deleting comment:', err);
        }
    };

    return (
        <div className="space-y-4">
            <h4 className="text-lg font-semibold border-b pb-2 text-gray-800">
                Comments ({comments.length})
            </h4>

            {error && (
                <div className="text-red-500 text-sm bg-red-50 p-2 rounded border border-red-100">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-2">
                <textarea
                    className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write a comment..."
                    rows="3"
                    required
                />
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
                >
                    Post Comment
                </button>
            </form>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                {comments.length === 0 ? (
                    <p className="text-gray-500 text-sm italic py-4 text-center">
                        No comments yet. Be the first to comment!
                    </p>
                ) : (
                    comments.map(comment => (
                        <div key={comment.id} className="bg-gray-50 p-3 rounded-lg border border-gray-100 group">
                            <div className="flex justify-between items-start mb-1">
                                <div className="flex flex-col">
                                    <span className="font-bold text-xs text-blue-600">
                                        {userNames[comment.userId] || 'Loading...'}
                                    </span>
                                    <span className="text-[10px] text-gray-400">
                                        {new Date(comment.createdAt).toLocaleString()}
                                    </span>
                                </div>

                                {comment.userId === currentUserId && (
                                    <button
                                        onClick={() => handleDelete(comment.id)}
                                        className="text-gray-400 hover:text-red-600 p-1 rounded-full hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                                        title="Delete comment"
                                    >
                                        <Trash2 size={14}/>
                                    </button>
                                )}
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed">
                                {comment.content}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CommentsSection;