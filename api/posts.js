import api from './index';

export const fetchPosts = () => api.get('/posts');

export const getPostsByCategory = () => api.get('/category/:category');

export const fetchCommentsByPostId = (postId) => api.get(`/comments/post/${postId}`);

export const createComment = (content, postId) => api.post('/comments', { content, postId });

export const deleteComment = (commentId) => api.delete(`/comments/${commentId}`);

export const togglePostLike = (postId) => api.post(`/posts/${postId}/like`);