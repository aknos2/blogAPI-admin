import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // Add useOutletContext
import { ArrowLeftIcon, ArrowRightIcon, ChatIcon, HeartIcon } from '../Icons';
import Button from '../Button';
import './article.css';
import { editArticleMeta, editArticlePage, fetchPosts, togglePostLike, togglePostPublication, updatePageImage, updatePostThumbnail } from '../../../api/posts';
import TinyMCEEditor from '../TinyMCE';
import parse from 'html-react-parser';
import { useAuth } from '../../context/useAuthContext';

function Article({ onToggleChat, onPostChange }) { 
  const { articleId } = useParams();

  const { isAuthenticated, user, authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [likeCounts, setLikeCounts] = useState({});
  const [isLiking, setIsLiking] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [combinedContent, setCombinedContent] = useState('');
  const [editedTitle, setEditedTitle] = useState('');
  const [editedCreatedAt, setEditedCreatedAt] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [loginMessage, setLoginMessage] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [newThumbnail, setNewThumbnail] = useState('');
  const [newPageImage, setNewPageImage] = useState('');

  // Fix the admin check
  const isAdmin = isAuthenticated && user?.role?.role === 'ADMIN';

  // Add debugging
  useEffect(() => {
    console.log('=== Article Auth Debug ===');
    console.log('isAuthenticated:', isAuthenticated);
    console.log('user:', user);
    console.log('user?.role:', user?.role);
    console.log('isAdmin:', isAdmin);
  }, [isAuthenticated, user, isAdmin]);

  useEffect(() => {
    async function loadPosts() {
      try {
        const res = await fetchPosts(); // backend decides what to send
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
  }, [isAuthenticated, user, isAdmin]);

  // Select article based on ID from URL, or default to latest
  const currentArticle = posts?.find(post => post.id === articleId) || posts?.[0] || null;

  // Notify parent component when current article changes
  useEffect(() => {
    if (currentArticle && currentArticle.id && onPostChange) {
      onPostChange(currentArticle.id);
    }
  }, [currentArticle, onPostChange]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      setLoginMessage(true);
      setTimeout(() => {
        setLoginMessage(false)
      }, 3000)
      return;
    }; 
  
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

  const handlePostPublication = async () => {
      if (!isAuthenticated) {
        setLoginMessage(true);
        setTimeout(() => {
          setLoginMessage(false)
        }, 3000)
        return;
      }; 

    if (!currentArticle || isPublishing) return;

    setIsPublishing(true);
    setLoading(true);
    const postId = currentArticle.id;

    try {
      const response = await togglePostPublication(postId);
      const { published } = response.data;

      setPosts(prevPosts => {
        prevPosts.map(post => {
          post.id === postId ? {...post, published } : post
        })
      })
    } catch (err) {
      console.error("Failed to handle publication", err);
    } finally {
      setIsPublishing(false);
      setLoading(false);
      navigate('/library');
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

  useEffect(() => {
    if (isEditing && currentArticle) {
      setEditedTitle(currentArticle.title || '');
      setEditedCreatedAt(currentArticle.createdAt?.slice(0, 10) || '');
      setTagInput(currentArticle.tags?.map(tag => tag.name).join(', ') || '');
    }
  }, [isEditing, currentArticle]);


 const handleSave = async () => {
    try {
      if (!currentArticle?.id || !currentPageData?.id) {
        throw new Error("Missing article or page data");
      }

      const postId = currentArticle.id;
      const pageId = currentPageData.id;
      const pageImageId = currentPageData.PageImage?.[0]?.id;

      let newThumbnailUrl = null;
      let newPageImageUrl = null;

      // 1️⃣ Upload thumbnail first if selected
      if (newThumbnail) {
        const res = await updatePostThumbnail(postId, newThumbnail);
        newThumbnailUrl = res.data.thumbnail?.url || res.data.thumbnail; // adjust based on backend return
      }

      // 2️⃣ Upload page image if selected
      if (newPageImage && pageImageId) {
        const res = await updatePageImage(pageImageId, newPageImage);
        newPageImageUrl = res.data.image?.url || res.data.image; // adjust based on backend return
      }

      // 3️⃣ Parse TinyMCE content
      const parser = new DOMParser();
      const doc = parser.parseFromString(combinedContent, 'text/html');
      const newHeading = doc.querySelector('h2')?.innerHTML || '';
      const newSubtitle = doc.querySelector('h4')?.innerHTML || '';
      const paragraphs = [...doc.body.children].filter(
        (el) => !['H2', 'H4'].includes(el.tagName)
      );
      const newContent = paragraphs.map((el) => el.outerHTML).join('\n');

      // 4️⃣ Prepare tag array
      const tags = tagInput.split(',').map((tag) => tag.trim()).filter(Boolean);

      // 5️⃣ Update text/meta content
      await Promise.all([
        editArticlePage(postId, pageId, {
          heading: newHeading,
          subtitle: newSubtitle,
          content: newContent,
        }),
        editArticleMeta(postId, {
          title: editedTitle,
          createdAt: editedCreatedAt,
          tags,
        }),
      ]);

      // 6️⃣ Update local state immediately with new images + text
      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post.id !== postId) return post;

          const updatedPost = {
            ...post,
            title: editedTitle,
            createdAt: editedCreatedAt,
            tags: tags.map((name) => ({ name })),
            thumbnail: newThumbnailUrl
              ? { ...post.thumbnail, url: newThumbnailUrl }
              : post.thumbnail,
            postPage: post.postPage.map((page) => {
              if (page.id !== pageId) return page;

              return {
                ...page,
                heading: newHeading,
                subtitle: newSubtitle,
                content: newContent,
                PageImage:
                  newPageImageUrl && page.PageImage?.[0]
                    ? [{ ...page.PageImage[0], image: { url: newPageImageUrl } }]
                    : page.PageImage
              };
            }),
          };

          return updatedPost;
        })
      );

      setIsEditing(false);
      console.log('Save complete!');
    } catch (err) {
      console.error('Failed to save article:', err);
    }
  };


  // Show loading state for both post loading and auth loading
  if (loading || authLoading || !posts) return <div>Loading...</div>;
  
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
          <div className='title-container'>
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
              { isAdmin && (
                <div className='edit-btn'>
                  <Button onClick={() => setIsEditing(true)} text="EDIT"/>
                </div>
              )}
            </div>

            <div className={`page-content ${isSliding ? 'sliding' : ''}`}>
              <div className="content-grid-titlePage">
                <div className="img-content no-select">
                 {currentArticle.thumbnail?.url && (
                    <img 
                      src={currentArticle.thumbnail.url} 
                      alt="Post thumbnail" 
                    />
                  )}
                </div>
               <div className="text-content">
                  {!isEditing && (
                    <>
                      {parse(pageData.heading || '')}
                      <div>{parse(pageData.subtitle || '')}</div>
                      <div className="article-content">{parse(pageData.content || '')}</div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="editor-wrapper">
                <TinyMCEEditor
                  value={combinedContent}
                  onEditorChange={(html) => setCombinedContent(html)}
                />
                <div className='editor-wrapper-labels'>
                  <label>Title:</label>
                  <input type="text"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        placeholder='Post title'   
                        />
                  <label>Date:</label>
                  <input type="date"
                        value={editedCreatedAt}
                        onChange={(e) => setEditedCreatedAt(e.target.value)}
                        />
                  <label>Tags:</label>
                  <input type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        placeholder='omma-separated, e.g. activities, friends, city' 
                        />
                </div>
                <div className="editor-wrapper-btns" style={{ marginTop: '10px' }}>
                  <label>Thumbnail:</label>
                  <input type="file" accept="image/*" onChange={(e) => setNewThumbnail(e.target.files[0])} />
                  <Button text="Save" onClick={handleSave} />
                  <Button text="Cancel" onClick={() => setIsEditing(false)} />
                </div>
              </div>
            )}
          </div>
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
              {!isEditing && (
                 <div className="text-content">
                     {parse(pageData.subtitle || '')}  
                   <div className="article-content">
                     {parse(pageData.content || '')}
                   </div>
                </div>
              )}
              { isAdmin && (
                 <div className='edit-btn'>
                  <Button onClick={() => setIsEditing(true)} text="EDIT"/>
                </div>
              )}

              {isEditing && (
                  <div className="editor-wrapper">
                    <TinyMCEEditor
                      value={combinedContent}
                      onEditorChange={(html) => setCombinedContent(html)}
                    />
                    <div className='page-img-upload'>
                      <label>Page Image:</label>
                      <input type="file" accept="image/*" onChange={(e) => setNewPageImage(e.target.files[0])} />
                    </div>
                    <div className="editor-wrapper-btns-float" style={{ marginTop: '10px' }}>
                      <Button text="Save" onClick={handleSave} />
                      <Button text="Cancel" onClick={() => setIsEditing(false)} />
                    </div>
                  </div>
                )}
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
      {renderLayout(totalPages > 0 ? currentPageData : currentArticle)}

      <div className='content-bottom'>
        <div className='page-indicator'>
          <span>Page {currentPage + 1} of {totalPages}</span>
        </div>

        {isAdmin && (
          <div className='publish-btn'>
            <Button text={currentArticle?.published ? 'UNPUBLISH' : 'PUBLISH'} 
                    onClick={handlePostPublication}
                    disabled={isPublishing}
                    />
          </div>
        )}

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