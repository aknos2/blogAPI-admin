// Helper function to get latest dates from articles array
export const getLatestDates = (articles) => {
  if (!articles || articles.length === 0) {
    return {
      latestYear: null,
      latestMonth: null,
      sortedArticles: []
    };
  }

  // Sort articles by createdAt date descending to get the latest one
  const sortedArticles = [...articles].sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return dateB - dateA;
  });

  // Get latest year/month from the first article
  const latestArticle = sortedArticles[0];
  const latestDate = new Date(latestArticle.createdAt);
  const latestYear = latestDate.getFullYear();
  const latestMonth = latestDate.toLocaleString('default', { month: 'long' });

  return {
    latestYear,
    latestMonth,
    sortedArticles
  };
};

// Get current date as fallback
const currentDate = new Date();
export const currentYear = currentDate.getFullYear();
export const currentMonth = currentDate.toLocaleString('default', { month: 'long' });