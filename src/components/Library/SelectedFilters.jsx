import Button from '../Button';
import { CloseIcon } from '../Icons';
import './selectedFilters.css';

function SelectedFilters({
  selectedYear,
  setSelectedYear,
  selectedMonth,
  setSelectedMonth,
  selectedTags,
  setSelectedTags,
  searchQuery,
  setSearchQuery,
  className
}) {
  const hasFilters =
    selectedYear || selectedMonth || selectedTags.length > 0 || searchQuery;

  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  // Helper function to stop event propagation
  const handleFilterClick = (e, callback) => {
    e.stopPropagation();
    callback();
  };

  return (
    <div className={className} onClick={(e) => e.stopPropagation()}>
      <div className="filters-active">
        {selectedYear && (
          <Button
            onClick={(e) => handleFilterClick(e, () => setSelectedYear(null))}
            className="filter-item"
            text={
              <span className="items-center">
                {selectedYear}
                <CloseIcon />
              </span>
            }
          />
        )}

        {selectedMonth && (
          <Button
            onClick={(e) => handleFilterClick(e, () => setSelectedMonth(null))}
            className="filter-item"
            text={
              <span className="items-center">
                {capitalizeFirstLetter(selectedMonth)}
                <CloseIcon />
              </span>
            }
          />
        )}

        {selectedTags.map((tag) => (
          <Button
            key={tag}
            onClick={(e) => handleFilterClick(e, () =>
              setSelectedTags((prev) => prev.filter((t) => t !== tag))
            )}
            className="filter-item"
            text={
              <span className="items-center">
                {capitalizeFirstLetter(tag)}
                <CloseIcon />
              </span>
            }
          />
        ))}

        {searchQuery && (
          <Button
            onClick={(e) => handleFilterClick(e, () => setSearchQuery(''))}
            className="filter-item"
            text={
              <span className="items-center">
                Search: "{searchQuery}"
                <CloseIcon />
              </span>
            }
          />
        )}
      </div>

      {hasFilters && (
        <Button
          className="clear-all-btn"
          onClick={(e) => handleFilterClick(e, () => {
            setSelectedYear(null);
            setSelectedMonth(null);
            setSelectedTags([]);
            setSearchQuery('');
          })}
          text="Clear all"
        />
      )}
    </div>
  );
}

export default SelectedFilters;