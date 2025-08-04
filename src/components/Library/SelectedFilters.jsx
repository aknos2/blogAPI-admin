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

  return (
    <div className={className}>
      <div className="filters-active">
        {selectedYear && (
          <Button
            onClick={() => setSelectedYear(null)}
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
            onClick={() => setSelectedMonth(null)}
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
            onClick={() =>
              setSelectedTags((prev) => prev.filter((t) => t !== tag))
            }
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
            onClick={() => setSearchQuery('')}
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
          onClick={() => {
            setSelectedYear(null);
            setSelectedMonth(null);
            setSelectedTags([]);
            setSearchQuery('');
          }}
          text="Clear all"
        />
      )}
    </div>
  );
}

export default SelectedFilters;
