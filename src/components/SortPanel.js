import React from 'react';

function SortPanel({ selectedSort, onSortChange }) {
  return (
    <div className="filter-panel filter-section">
      <h3 data-testid="filter-header-sort">Sort By</h3>
      <div className="filter-options">
        <label>
          <input
            type="radio"
            name="sort"
            value="fees"
            checked={selectedSort === 'fees'}
            onChange={(e) => onSortChange(e.target.value)}
            data-testid="sort-fees"
          />
          Price: Low-High
        </label>
        <label>
          <input
            type="radio"
            name="sort"
            value="experience"
            checked={selectedSort === 'experience'}
            onChange={(e) => onSortChange(e.target.value)}
            data-testid="sort-experience"
          />
          Experience (Descending)
        </label>
        <label>
          <input
            type="radio"
            name="sort"
            value=""
            checked={!selectedSort}
            onChange={(e) => onSortChange(e.target.value)}
          />
          Default
        </label>
      </div>
    </div>
  );
}

export default SortPanel;
