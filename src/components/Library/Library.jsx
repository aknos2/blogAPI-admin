import { useEffect, useState } from 'react';
import { CommentsIcon, HeartIcon } from '../Icons';
import './library.css';
import './search-articles.css';
import SearchDate from './SearchArticles';
import Button from '../Button';
import { getLatestDates, currentYear, currentMonth } from '../../utils/getLatestDates';
import SelectedFilters from './SelectedFilters';
import { fetchPosts } from '../../../api/posts';
import { useNavigate } from 'react-router-dom';

function Library() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Get latest dates from current articles
  const { latestYear, latestMonth } = getLatestDates(articles);
  
  // Use current date as fallback if no articles
  const displayLatestYear = latestYear || currentYear;
  const displayLatestMonth = latestMonth || currentMonth;
  
  // Process articles to extract all unique tag names
  const allTags = [...new Set(articles.flatMap(article => 
    article.tags?.map(tag => tag.name) || []
  ))];

  useEffect(() => {
    async function loadPosts() {
      try {
        const res = await fetchPosts();
        console.log('Library posts response:', res.data); // Debug log
        setArticles(res.data);
      } catch (err) {
        console.error('Failed to fetch posts:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPosts();
  }, []);

  // Show loading state
  if (loading) return <div>Loading...</div>;
  
  // Show no posts message if empty
  if (!articles || articles.length === 0) {
    return <div>No posts available.</div>;
  }

  const filteredArticles = articles.filter(article => {
    // Extract year and month from createdAt
    const articleDate = new Date(article.createdAt);
    const articleYear = articleDate.getFullYear();
    const articleMonth = articleDate.toLocaleString('default', { month: 'long' });
    
    // Get tag names for comparison
    const articleTagNames = article.tags?.map(tag => tag.name) || [];
    
    const matchesYear = !selectedYear || articleYear === selectedYear;
    const matchesMonth = !selectedMonth || articleMonth.toLowerCase() === selectedMonth.toLowerCase();
    const matchesTags = selectedTags.length === 0 || selectedTags.every(tag => articleTagNames.includes(tag));
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.trim().toLowerCase());

    return matchesYear && matchesMonth && matchesTags && matchesSearch;
  });

  const handleArticleClick = (articleId) => {
    navigate(`/post/${articleId}`);
  }

  const handleMonthSelect = (year, month) => {
    setSelectedYear(year);
    setSelectedMonth(month);
  };

  const handleNewPostsClick = () => {
    setSelectedYear(displayLatestYear);
    setSelectedMonth(displayLatestMonth);
  };

  const handleTagsSelect = (tag) => {
    setSelectedTags(prevTags =>
      prevTags.includes(tag)
        ? prevTags.filter(t => t !== tag) // remove if already selected (toggle off)
        : [...prevTags, tag]              // add if not selected
    );
  };

  const handleSearchTool = (e) => {
    setSearchQuery(e.target.value);
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className='library-container'>
      <div className='library-content'>
        <div className='search-menu'>
          <div className="search">
            <label htmlFor="category">Search</label>
            <input type="search" 
                   id="category" 
                   name="category" 
                   placeholder="Search by title..." 
                   value={searchQuery}
                   onChange={handleSearchTool}
                   />
          </div>
          <nav className="search-nav-links">
            <Button onClick={handleNewPostsClick} 
                    text="THIS MONTH"
                    className={`new-posts-btn ${selectedYear === displayLatestYear && selectedMonth === displayLatestMonth ? 'active-underline' : ''}`}
                    />
            <div className='date-wrap'>
              <p className='search-title'>DATE</p>
              <SearchDate 
                onMonthSelect={handleMonthSelect}
                selectedYear={selectedYear}
                selectedMonth={selectedMonth}
              />
            </div>
            <div className='category-wrap'>
              <p className='search-title'>CATEGORIES</p>
              <div className='category-tags'>
                {allTags.map((tagName, index) => (
                  <Button text={tagName} 
                          key={index} 
                          onClick={() => handleTagsSelect(tagName)}
                          className={selectedTags.includes(tagName) ? 'active-tag' : ''}
                          />
                ))}
              </div>
            </div>
          </nav>
        </div>
        
        <div className='articles-compilation'>
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article, index) => (
              <figure className="article-card" key={article.id || index} onClick={() => handleArticleClick(article.id)}>
                <img 
                  src={article.thumbnail?.url} 
                  alt={article.thumbnail?.altText || 'Article thumbnail'} 
                />
                <figcaption>
                  <h3 className='card-date'>{formatDate(article.createdAt)}</h3>
                  <div className='card-stats'>
                    <div className='stats-wrap'>
                      <HeartIcon/> 
                      <p>{article.Like?.length || 0}</p>
                    </div>
                    <div className='stats-wrap'>
                      <CommentsIcon/> 
                      <p>{article.comments?.length || 0}</p>
                    </div>
                  </div>
                  {/* Only show this extra text on the first article */}
                  {index === 0 &&  
                    <SelectedFilters
                      className="month-title"
                      selectedYear={selectedYear}
                      setSelectedYear={setSelectedYear}
                      selectedMonth={selectedMonth}
                      setSelectedMonth={setSelectedMonth}
                      selectedTags={selectedTags}
                      setSelectedTags={setSelectedTags}
                      searchQuery={searchQuery}
                      setSearchQuery={setSearchQuery}
                    />
                  }
                </figcaption>
              </figure>
            ))
          ) : (
            <p className='not-found'>No articles found</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Library;