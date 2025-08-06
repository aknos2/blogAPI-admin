import { useState, useEffect } from 'react';
import { ArrowLeftIcon, ArrowRightIcon, ChatIcon, HeartIcon } from '../Icons';
import Button from '../Button';
import './article.css';
import { editArticle, fetchPosts, togglePostLike } from '../../../api/posts';
import { useParams } from 'react-router-dom';
import TinyMCEEditor from '../TinyMCE';
import parse from 'html-react-parser';

function Article({ onToggleChat, onPostChange, isAuthenticated, user}) {
  const { articleId } = useParams();
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [likeCounts, setLikeCounts] = useState({});
  const [isLiking, setIsLiking] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [combinedContent, setCombinedContent] = useState('');

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

  const totalPages = currentArticle?.postPage.length;
  const currentPageData = currentArticle?.postPage[currentPage];
  

  useEffect(() => {
    if (isEditing && currentPageData) {
        const heading = currentPageData?.heading || '';
        const subtitle = currentPageData?.subtitle || '';
        const content = currentPageData?.content || '';

        setCombinedContent(`
          <h2>${heading}</h2>
          <h4>${subtitle}</h4>
          ${content}
        `);
      }
  }, [isEditing, currentPageData]);

  // Replace your handleSave function in Article.jsx with this improved version

  const handleSave = async () => {
    try {
      // Validate required data
      if (!currentPageData || !currentPageData.id) {
        throw new Error('Current page data is missing');
      }
      
      if (!currentArticle || !currentArticle.id) {
        throw new Error('Current article data is missing');
      }

      const pageId = currentPageData.id;
      const postId = currentArticle.id;

      // Parse the HTML content
      const parser = new DOMParser();
      const doc = parser.parseFromString(combinedContent, 'text/html');

      const newHeading = doc.querySelector('h2')?.innerHTML || '';
      const newSubtitle = doc.querySelector('h4')?.innerHTML || '';

      // Get everything else after subtitle
      const paragraphs = [...doc.body.children].filter(
        (el) => !['H2', 'H4'].includes(el.tagName)
      );
      const newContent = paragraphs.map((el) => el.outerHTML).join('\n');

      const updateData = {
        heading: newHeading,
        subtitle: newSubtitle,
        content: newContent,
      };

      // Make the API call
      const response = await editArticle(postId, pageId, updateData);
      
      // Check if the response is successful
      if (response && (response.status === 200 || response.data)) {
        // Update the local state with new content
        setPosts(prevPosts => 
          prevPosts.map(post => {
            if (post.id === postId) {
              return {
                ...post,
                postPage: post.postPage.map(page => {
                  if (page.id === pageId) {
                    return {
                      ...page,
                      heading: newHeading,
                      subtitle: newSubtitle,
                      content: newContent
                    };
                  }
                  return page;
                })
              };
            }
            return post;
          })
        );
        
        setIsEditing(false);
        console.log('Save successful!');
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (error) {
      console.error('Error saving article:', error);
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
              <div className='edit-btn'>
                <Button onClick={() => setIsEditing(true)} text="EDIT"/>
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
                  {isEditing ? (
                    <div className='editing-tool'> 
                      <TinyMCEEditor
                        value={combinedContent}
                        onEditorChange={(html) => setCombinedContent(html)}
                      />
                      <div style={{ marginTop: '10px' }}>
                        <Button text="Save" onClick={handleSave} />
                        <Button text="Cancel" onClick={() => setIsEditing(false)} />
                      </div>
                    </div>
                  ) : (
                    <>
                      {parse(pageData.heading || '')}
                      <div>
                        {parse(pageData.subtitle || '')}  
                      </div>
                      <div className="article-content">
                        {parse(pageData.content || '')}
                      </div>
                    </>
                  )}
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
              {isEditing ? (
                    <div className='editing-tool'> 
                      <TinyMCEEditor
                        value={combinedContent}
                        onEditorChange={(html) => setCombinedContent(html)}
                      />
                      <div style={{ marginTop: '10px' }}>
                        <Button text="Save" onClick={handleSave} />
                        <Button text="Cancel" onClick={() => setIsEditing(false)} />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div>
                        {parse(pageData.subtitle || '')}  
                      </div>
                      <div className="article-content">
                        {parse(pageData.content || '')}
                      </div>
                    </>
                  )}
            </div>
                 <div className='edit-btn'>
                  <Button onClick={() => setIsEditing(true)} text="EDIT"/>
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

        <div className='publish-btn'>
          <Button text="PUBLISH"/>
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