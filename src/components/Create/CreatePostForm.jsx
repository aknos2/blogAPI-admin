import "./create-post-form.css";
import { useState } from "react";
import { createPost, uploadThumbnailTemp, uploadPageImageTemp } from "../../../api/posts";
import { useAuth } from "../../context/useAuthContext";
import Button from "../Button";

function CreatePostForm() {
  const [title, setTitle] = useState("");
  const [published, setPublished] = useState(false);
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [pages, setPages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { isAuthenticated, user } = useAuth();
  const isAdmin = isAuthenticated && user?.role?.role === 'ADMIN';

  // Debug user object
  console.log('User object:', user);
  console.log('User ID:', user?.userId);

  // Layout options for pages
  const layoutOptions = [
    { value: "titlePage", label: "Title Page" },
    { value: "horizontalImage", label: "Horizontal Image" },
    // Add more layout options as needed
  ];

  const addTag = (e) => {
    e.preventDefault(); // Prevent form submission
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (index, e) => {
    e.preventDefault(); // Prevent form submission
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setThumbnailPreview(previewUrl);
    }
  };

  const addPage = (e) => {
    e.preventDefault(); // Prevent form submission
    setPages([
      ...pages,
      { 
        pageNum: pages.length + 1, 
        subtitle: "", 
        heading: "", 
        content: "", 
        layout: "titlePage", // default layout
        images: [] 
      },
    ]);
  };

  const removePage = (index, e) => {
    e.preventDefault(); // Prevent form submission
    const updatedPages = pages.filter((_, i) => i !== index);
    // Renumber pages
    const renumberedPages = updatedPages.map((page, i) => ({
      ...page,
      pageNum: i + 1
    }));
    setPages(renumberedPages);
  };

  const updatePage = (index, field, value) => {
    const updatedPages = [...pages];
    updatedPages[index][field] = value;
    setPages(updatedPages);
  };

  const addImageToPage = (pageIndex, e) => {
    e.preventDefault(); // Prevent form submission
    const updatedPages = [...pages];
    updatedPages[pageIndex].images.push({
      file: null,
      preview: "",
      caption: "",
      altText: "",
      order: updatedPages[pageIndex].images.length + 1,
    });
    setPages(updatedPages);
  };

  const removeImageFromPage = (pageIndex, imageIndex, e) => {
    e.preventDefault(); // Prevent form submission
    const updatedPages = [...pages];
    // Clean up preview URL if it exists
    if (updatedPages[pageIndex].images[imageIndex].preview) {
      URL.revokeObjectURL(updatedPages[pageIndex].images[imageIndex].preview);
    }
    updatedPages[pageIndex].images.splice(imageIndex, 1);
    // Renumber remaining images
    updatedPages[pageIndex].images.forEach((img, i) => {
      img.order = i + 1;
    });
    setPages(updatedPages);
  };

  const updateImage = (pageIndex, imageIndex, field, value) => {
    const updatedPages = [...pages];
    if (field === 'file') {
      const file = value;
      if (file) {
        // Clean up old preview URL
        if (updatedPages[pageIndex].images[imageIndex].preview) {
          URL.revokeObjectURL(updatedPages[pageIndex].images[imageIndex].preview);
        }
        // Set new file and create preview
        updatedPages[pageIndex].images[imageIndex].file = file;
        updatedPages[pageIndex].images[imageIndex].preview = URL.createObjectURL(file);
      }
    } else {
      updatedPages[pageIndex].images[imageIndex][field] = value;
    }
    setPages(updatedPages);
  };

  // We'll upload images to temporary endpoints first, then create the post with URLs

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAdmin) {
      alert("Must be an admin to create a post");
      return;
    }

    setIsSubmitting(true);

    try {
      let thumbnailUrl = "";
      
      // 1. Upload thumbnail if provided
      if (thumbnailFile) {
        thumbnailUrl = await uploadThumbnailTemp(thumbnailFile);
      }

      // 2. Upload all page images and prepare pages data
      const processedPages = await Promise.all(
        pages.map(async (page) => {
          const processedImages = await Promise.all(
            page.images.map(async (img) => {
              let imageUrl = "";
              if (img.file) {
                imageUrl = await uploadPageImageTemp(img.file);
              }
              return {
                url: imageUrl,
                caption: img.caption,
                altText: img.altText,
                order: img.order,
              };
            })
          );

          return {
            pageNum: page.pageNum,
            subtitle: page.subtitle,
            heading: page.heading,
            content: page.content,
            layout: page.layout,
            images: processedImages.filter(img => img.url), // Only include images that were successfully uploaded
          };
        })
      );

      // 3. Create the post
      const postData = {
        title,
        authorId: user?.userId, // Fixed: use userId instead of id
        published,
        content,
        tags,
        thumbnailUrl,
        pages: processedPages,
      };

      // Validate required data before sending
      if (!postData.authorId) {
        throw new Error('User ID is missing. Please try logging in again.');
      }

      console.log('Post data being sent:', postData);
      await createPost(postData);
      alert("Post created successfully!");
      
      // Reset form
      setTitle("");
      setPublished(false);
      setContent("");
      setTags([]);
      setTagInput("");
      setThumbnailFile(null);
      setThumbnailPreview("");
      setPages([]);
      
    } catch (err) {
      console.error('Error creating post:', err);
      alert("Error creating post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clean up preview URLs when component unmounts
  const cleanupPreviews = () => {
    if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
    pages.forEach(page => {
      page.images.forEach(img => {
        if (img.preview) URL.revokeObjectURL(img.preview);
      });
    });
  };

  // Clean up on unmount
  useState(() => {
    return cleanupPreviews;
  }, []);

  if (!isAdmin) {
    return (
      <div className="access-denied">
        <h2>Access Denied</h2>
        <p>Admin privileges required to create posts.</p>
        <p>Debug info:</p>
        <pre>{JSON.stringify({ isAuthenticated, user, isAdmin }, null, 2)}</pre>
      </div>
    );
  }

  return (
    <div className="create-form-container">
      <form onSubmit={handleSubmit}>
        <div className="title-post-form">
          <h2>Create New Post</h2>
          
          <div className="form-group">
            <label>Title *</label>
            <input 
              type="text"
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required 
              placeholder="Enter post title"
            />
          </div>

          <div className="form-group">
            <span>Author: {user?.username}</span>
          </div>

          <div className="form-group published-wrap">
            <label>
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
              />
              Published
            </label>
          </div>

          <div className="form-group">
            <label>Main Content (HTML)</label>
            <textarea 
              value={content} 
              onChange={(e) => setContent(e.target.value)}
              placeholder="Optional main content..."
              rows="4"
            />
          </div>

          <div className="form-group">
            <label>Tags</label>
            <div className="tags-input">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add tag and press Add"
                onKeyPress={(e) => e.key === 'Enter' && addTag(e)}
              />
              <Button type="button" onClick={addTag} text="Add" />
            </div>
            <div className="tags-list">
              {tags.map((tag, i) => (
                <span key={i} className="tag-chip">
                  {tag} 
                  <button type="button" onClick={(e) => removeTag(i, e)}>×</button>
                </span>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Thumbnail Image</label>
            <input 
              type="file"
              accept="image/*"
              onChange={handleThumbnailChange}
            />
            {thumbnailPreview && (
              <div className="image-preview">
                <img src={thumbnailPreview} alt="Thumbnail preview" />
              </div>
            )}
          </div>
        </div>
        
        <div className="pages-post-form">
          <div className="pages-header">
            <h3>Pages ({pages.length})</h3>
            <Button type="button" onClick={addPage} text="+ Add Page" />
          </div>
          
          {pages.map((page, pageIndex) => (
            <div key={pageIndex} className="page-section">
              <div className="page-header">
                <h4>Page {page.pageNum}</h4>
                <Button 
                  type="button" 
                  onClick={(e) => removePage(pageIndex, e)}
                  text="Remove Page"
                  className="remove-btn"
                />
              </div>

              <div className="form-group">
                <label>Layout</label>
                <select
                  value={page.layout}
                  onChange={(e) => updatePage(pageIndex, "layout", e.target.value)}
                >
                  {layoutOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Heading</label>
                <input
                  value={page.heading}
                  onChange={(e) => updatePage(pageIndex, "heading", e.target.value)}
                  placeholder="Page heading"
                />
              </div>

              <div className="form-group">
                <label>Subtitle</label>
                <input
                  value={page.subtitle}
                  onChange={(e) => updatePage(pageIndex, "subtitle", e.target.value)}
                  placeholder="Page subtitle"
                />
              </div>
              
              <div className="form-group">
                <label>Content</label>
                <textarea
                  value={page.content}
                  onChange={(e) => updatePage(pageIndex, "content", e.target.value)}
                  placeholder="Page content (HTML supported)"
                  rows="6"
                />
              </div>

              <div className="images-section">
                <div className="images-header">
                  <h5>Images ({page.images.length})</h5>
                  <Button 
                    type="button" 
                    onClick={(e) => addImageToPage(pageIndex, e)}
                    text="+ Add Image"
                  />
                </div>
                
                {page.images.map((img, imgIndex) => (
                  <div key={imgIndex} className="image-section">
                    <div className="image-header">
                      <span>Image {img.order}</span>
                      <Button
                        type="button"
                        onClick={(e) => removeImageFromPage(pageIndex, imgIndex, e)}
                        text="Remove"
                        className="remove-btn small"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Image File</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => updateImage(pageIndex, imgIndex, "file", e.target.files[0])}
                      />
                      {img.preview && (
                        <div className="image-preview small">
                          <img src={img.preview} alt="Preview" />
                        </div>
                      )}
                    </div>
                    
                    <div className="form-group">
                      <label>Caption</label>
                      <input
                        value={img.caption}
                        onChange={(e) => updateImage(pageIndex, imgIndex, "caption", e.target.value)}
                        placeholder="Image caption"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Alt Text</label>
                      <input
                        value={img.altText}
                        onChange={(e) => updateImage(pageIndex, imgIndex, "altText", e.target.value)}
                        placeholder="Alt text for accessibility"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Order</label>
                      <input
                        type="number"
                        value={img.order}
                        onChange={(e) => updateImage(pageIndex, imgIndex, "order", Number(e.target.value))}
                        min="1"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="form-actions">
          <Button 
            type="submit" 
            text={isSubmitting ? "Creating Post..." : "Create Post"}
            disabled={isSubmitting || !title.trim()}
          />
        </div>
      </form>
    </div>
  );
}

export default CreatePostForm;