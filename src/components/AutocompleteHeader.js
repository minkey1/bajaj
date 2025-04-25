import React, { useState, useEffect, useRef } from 'react';

// Assume you have a placeholder image in your public folder
const PLACEHOLDER_IMAGE = '/placeholder.png';

function AutocompleteHeader({ doctors, onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSuggestionBoxOpen, setIsSuggestionBoxOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (searchTerm.length > 0) {
      const filtered = doctors
        .filter(doc =>
          doc.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .slice(0, 3);
      setSuggestions(filtered);
      setIsSuggestionBoxOpen(filtered.length > 0);
    } else {
      setSuggestions([]);
      setIsSuggestionBoxOpen(false);
    }
  }, [searchTerm, doctors]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsSuggestionBoxOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSuggestionClick = (doctorName) => {
    setSearchTerm(doctorName);
    setSuggestions([]);
    setIsSuggestionBoxOpen(false);
    onSearch(doctorName);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      setIsSuggestionBoxOpen(false);
      onSearch(searchTerm);
    }
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = PLACEHOLDER_IMAGE;
  };

  return (
    <div className="autocomplete-header" ref={wrapperRef}>
      <input
        type="text"
        placeholder="Search for doctors by name..."
        value={searchTerm}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onClick={() => setIsSuggestionBoxOpen(suggestions.length > 0)}
        data-testid="autocomplete-input"
        aria-autocomplete="list"
        aria-controls="suggestions-list"
      />
      {isSuggestionBoxOpen && suggestions.length > 0 && (
        <ul id="suggestions-list" className="suggestions-list">
          {suggestions.map((doctor) => (
            <li
              key={doctor.id}
              onClick={() => handleSuggestionClick(doctor.name)}
              data-testid="suggestion-item"
              role="option"
              className="suggestion-item-layout" // Existing class for layout
            >
              <img
                src={doctor.photo || PLACEHOLDER_IMAGE}
                alt={doctor.name}
                className="suggestion-item-photo"
                onError={handleImageError}
              />
              <div>
              <span className="suggestion-item-name">{doctor.name}</span>
              <span className="suggestion-item-speciality">{doctor.specialities[0].name}</span>
              </div>
              {/* Added span for the arrow */}
              <span className="suggestion-item-arrow">{'>'}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AutocompleteHeader;