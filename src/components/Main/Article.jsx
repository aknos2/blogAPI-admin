import { useState, useEffect } from 'react';
import { ArrowLeftIcon, ArrowRightIcon, ChatIcon, HeartIcon } from '../Icons';
import Button from '../Button';
import './article.css';
import { fetchPosts, togglePostLike } from '../../../api/posts';
import { useParams } from 'react-router-dom';

function Article({ onToggleChat, onPostChange, isAuthenticated, user, onAuthChange }) {
  const { articleId } = useParams();
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [likeCounts, setLikeCounts] = useState({});
  const [isLiking, setIsLiking] = useState(false);

  useEffect(() => {
    async function loadPosts() {
      try {
        const res = await fetchPosts();
        setPosts(res.data);
        
        // Initialize like counts and user's liked posts
        const counts = {};
        const userLiked = new Set();
        
        res.data.forEach(post => {
          counts[post.id] = post.Like?.length || 0;
          
          // Check if current user has liked this post
          if (isAuthenticated && user && post.Like) {
            const hasLiked = post.Like.some(like => like.userId === user.id);
            if (hasLiked) {
              userLiked.add(post.id);
            }
          }
        });
        
        setLikeCounts(counts);
        setLikedPosts(userLiked);
      } catch (err) {
        console.error('Failed to fetch posts:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPosts();
  }, [isAuthenticated, user]);

  // Select article based on ID from URL, or default to latest
  const currentArticle = articleId 
    ? posts.find(post => post.id === articleId) 
    : posts[posts.length - 1];

  // Notify parent component when current article changes
  useEffect(() => {
    if (currentArticle && currentArticle.id && onPostChange) {
      onPostChange(currentArticle.id);
    }
  }, [currentArticle, onPostChange]);

  const handleLike = async () => {
    if (!isAuthenticated) return; 
    if (!currentArticle || isLiking) return;

    setIsLiking(true);
    const postId = currentArticle.id;

    try {
      const response = await togglePostLike(postId);
      const { liked, totalLikes } = response.data;
      
      // Update liked posts set
      if (liked) {
        setLikedPosts(prev => new Set([...prev, postId]));
      } else {
        setLikedPosts(prev => {
          const newSet = new Set(prev);
          newSet.delete(postId);
          return newSet;
        });
      }
      
      // Update like count with server response
      setLikeCounts(prev => ({
        ...prev,
        [postId]: totalLikes
      }));
      
    } catch (err) {
      console.error('Failed to update like:', err);
    } finally {
      setIsLiking(false);
    }
  };

  // Show loading state
  if (loading) return <div>Loading...</div>;
  
  // Handle case where article with specific ID is not found
  if (articleId && !currentArticle) {
    return <div>Article not found.</div>;
  }
  
  // Additional safety check for postPage
  if (!currentArticle || !currentArticle.postPage || currentArticle.postPage.length === 0) {
    return <div>No article content available.</div>;
  }

  const totalPages = currentArticle.postPage.length;
  const currentPageData = currentArticle.postPage[currentPage];
  const isCurrentlyLiked = likedPosts.has(currentArticle.id);
  const likeCount = likeCounts[currentArticle.id] || 0;

  const renderLayout = (pageData) => {
    // Get the first image from PageImage array
    const pageImage = pageData.PageImage?.[0]?.image;

    switch (pageData.layout) {
      case "titlePage":
        return (
          <>
            <div className="title">
              <h2>{currentArticle.title}</h2>
              <div className='sub-title'>
                <p>{currentArticle.createdAt.slice(0, 10)}</p>
                <div className='tags'>
                  {currentArticle.tags?.map((tag, index) => (
                    <a key={index}>{tag.name}</a>
                  )) || []}
                </div>
              </div>
            </div>

            <div className={`page-content ${isSliding ? 'sliding' : ''}`}>
              <div className="content-grid-titlePage">
                <div className="img-content no-select">
                   {pageImage && (
                  <img 
                    src={pageImage.url} 
                    alt={pageImage.altText || pageData.PageImage?.[0]?.caption || 'image'} 
                  />
                )}
                </div>
                <div className="text-content">
                  <h4>{pageData.heading}</h4>
                  <p>{pageData.subtitle}</p>
                  <div className="article-content">
                    <p>{pageData.content}</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        );

      case "horizontalImage":
        return (
          <div className="content-grid-horizontalImage">
            <div className="img-content no-select">
               {pageImage && (
                  <img 
                    src={pageImage.url} 
                    alt={pageImage.altText || pageData.PageImage?.[0]?.caption || 'image'} 
                  />
                )}
            </div>
            <div className="text-content">
              <p>{pageData.subtitle}</p>
              <div className="article-content">
                <p>{pageData.content}</p>
              </div>
            </div>
          </div>
        );
      default:
        return <div>Unsupported layout</div>;
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setIsSliding(true);
      setTimeout(() => {
        setCurrentPage(prev => prev + 1);
        setIsSliding(false);
      }, 150);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 0) {
      setIsSliding(true);
      setTimeout(() => {
        setCurrentPage(prev => prev - 1);
        setIsSliding(false);
      }, 150);
    }
  };

  return (
    <div className={`article-container page-content ${isSliding ? 'sliding' : ''}`}>
      {renderLayout(currentPageData)}

      <div className='content-bottom'>
        <div className='page-indicator'>
          <span>Page {currentPage + 1} of {totalPages}</span>
        </div>

        <div className='right-wrap no-select'>
          <div className='like-section'>
            <button 
              className={`heart-btn ${isCurrentlyLiked ? 'liked' : ''}`}
              onClick={handleLike}
            >
              <span>{likeCount} {likeCount === 1 ? 'Like' : 'Likes'}</span>
              <HeartIcon className="heart-icon" />
            </button>
          </div>
          <div className='comment-chat-wrap' onClick={onToggleChat}>
            <span>{currentArticle.comments?.length || 0} Comments</span>
            <ChatIcon className='chat-icon' />
          </div>
        </div>
      </div>

      {currentPage > 0 && (
        <Button
          className="arrow-left-btn"
          text={<ArrowLeftIcon className='arrow-left-icon' />}
          onClick={goToPrevPage}
        />
      )}
      {currentPage < totalPages - 1 && (
        <Button
          className="arrow-right-btn"
          text={<ArrowRightIcon className='arrow-right-icon' />}
          onClick={goToNextPage}
        />
      )}
    </div>
  );
}

export default Article;