import api from './index';

export const fetchPosts = () => api.get('/posts');

export const getPostsByCategory = () => api.get('/category/:category');

export const fetchCommentsByPostId = (postId) => api.get(`/comments/post/${postId}`);

export const createComment = (content, postId) => api.post('/comments', { content, postId });

export const deleteComment = (commentId) => api.delete(`/comments/${commentId}`);

export const togglePostLike = (postId) => api.post(`/posts/${postId}/like`);

export const togglePostPublication = (postId) => api.put(`/posts/${postId}/publication`);

export const editArticlePage = async (postId, pageId, data) => {
  try {
    const response = await api.put(`/posts/${postId}/pages/${pageId}`, data);
    return response;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const editArticleMeta = async (postId, data) => {
  try {
    const res = await api.put(`/posts/${postId}/meta`, data);
    return res;
  } catch ( err ) {
    console.error("API update post error", err );
    throw err;
  }
}

export const updatePostThumbnail = (postId, file) => {
  const formData = new FormData();
  formData.append('file', file);

  return api.put(`/posts/${postId}/thumbnail`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const updatePageImage = (pageImageId, file) => {
  const formData = new FormData();
  formData.append('file', file);

  return api.put(`/posts/page-images/${pageImageId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};
