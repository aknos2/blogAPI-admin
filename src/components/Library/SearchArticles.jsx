import Button from "../Button";
import { ArrowDownIcon } from "../Icons";
import { useEffect, useState } from "react";
import { fetchPosts } from "../../../api/posts";

function SearchMonth({ year, className, onMonthClick, selectedYear, selectedMonth, articles }) {
  // Count articles by month for the given year
  const monthMap = articles.reduce((acc, article) => {
    const articleDate = new Date(article.createdAt);
    const articleYear = articleDate.getFullYear();
    const articleMonth = articleDate.toLocaleString('default', { month: 'long' });
    
    if (articleYear === parseInt(year)) {
      acc[articleMonth] = (acc[articleMonth] || 0) + 1;
    }
    return acc;
  }, {});

  // Convert to a sorted array by month order
  const monthOrder = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const sortedMonths = Object.entries(monthMap).sort(([a], [b]) =>
    monthOrder.indexOf(a) - monthOrder.indexOf(b)
  );

  return (
    <div className="search-month-wrap">
      <ul className={className}>
        {sortedMonths.map(([month, count]) => {
          const isSelected = selectedYear === parseInt(year) && selectedMonth === month;
          return (
            <li 
              key={month} 
              onClick={() => onMonthClick(month)}
              className={isSelected ? 'selected-month' : ''}
            >
              {month} <span>({count})</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function SearchDate({ onMonthSelect, selectedYear, selectedMonth }) {
  const [openYear, setOpenYear] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPosts() {
      try {
        const res = await fetchPosts();
        setArticles(res.data);
      } catch (err) {
        console.error('Failed to fetch posts for search:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPosts();
  }, []);

  const toggleMonthList = (year) => {
    setOpenYear(prev => (prev === year ? null : year));
  };

  // Get available years from articles
  const availableYears = [...new Set(
    articles.map(article => new Date(article.createdAt).getFullYear())
  )].sort((a, b) => b - a); // Sort years descending (newest first)

  if (loading) return <div className="loading-dates">loading dates...</div>;

  return (
    <div className="search-date">
      <div className="year-buttons">
        {availableYears.map((year) => (
          <div className="search-year" key={year} onClick={() => toggleMonthList(year.toString())}>
            <Button text={year} className={`${openYear === year ? 'active-underline' : ''}`} />
            <ArrowDownIcon />
          </div>
        ))}
      </div>
      
      {openYear && (
        <SearchMonth
          year={openYear}
          className={`search-month ${openYear ? 'open-list' : ''}`}
          onMonthClick={(month) => onMonthSelect(parseInt(openYear), month)}
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          articles={articles}
        />
      )}
    </div>
  );
}

export default SearchDate;