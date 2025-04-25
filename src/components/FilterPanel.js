import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';


const getSpecialtyTestId = (specialty) => `filter-specialty-${specialty.replace(/[\s/]+/g, '-')}`;

function FilterPanel({
  availableSpecialties,
  selectedConsultationType,
  onConsultationTypeChange,
  selectedSpecialties,
  onSpecialtyChange,
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSpecialtyCheckboxChange = (event) => {
    const { value, checked } = event.target;
    const currentSpecialties = new Set(selectedSpecialties);
    if (checked) {
      currentSpecialties.add(value);
    } else {
      currentSpecialties.delete(value);
    }
    onSpecialtyChange(Array.from(currentSpecialties));
  };

  const [searchParams, setSearchParams] = useSearchParams();

  const handleClearAll = () => {
    onSpecialtyChange([]);
    onConsultationTypeChange('');
    setSearchTerm('');
  
    // Clone the current params and remove relevant ones
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete('specialties');
    newParams.delete('consultationType');
  
    // Update the URL without losing other params
    setSearchParams(newParams);
  };
  

  const filteredSpecialties = availableSpecialties.filter((specialty) =>
    specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="filter-panel">
      {/* Filter Header */}
      <div className="filter-header">
        <h2>Filters</h2>
        <button onClick={handleClearAll} className="clear-all-button">
          Clear All
        </button>
      </div>

      {/* Specialties Filter */}
      <div className="filter-section">
        <h3 data-testid="filter-header-speciality">Speciality</h3>
        <input
          type="text"
          placeholder="Search Specialties..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="specialty-search-input"
          data-testid="specialty-search-input"
        />
        <div className="filter-options specialty-filters">
          {filteredSpecialties.map((specialty) => (
            <label key={specialty}>
              <input
                type="checkbox"
                value={specialty}
                checked={selectedSpecialties.includes(specialty)}
                onChange={handleSpecialtyCheckboxChange}
                data-testid={getSpecialtyTestId(specialty)}
              />
              {specialty}
            </label>
          ))}
          {filteredSpecialties.length === 0 && (
            <p className="no-specialties-found">No specialties found</p>
          )}
        </div>
      </div>

      {/* Consultation Type Filter */}
      <div className="filter-section">
        <h3 data-testid="filter-header-moc">Consultation Mode</h3>
        <div className="filter-options">
          <label>
            <input
              type="radio"
              name="consultationType"
              value="video"
              checked={selectedConsultationType === 'video'}
              onChange={(e) => onConsultationTypeChange(e.target.value)}
              data-testid="filter-video-consult"
            />
            Video Consult
          </label>
          <label>
            <input
              type="radio"
              name="consultationType"
              value="in-clinic"
              checked={selectedConsultationType === 'in-clinic'}
              onChange={(e) => onConsultationTypeChange(e.target.value)}
              data-testid="filter-in-clinic"
            />
            In Clinic
          </label>
          <label>
            <input
              type="radio"
              name="consultationType"
              value=""
              checked={!selectedConsultationType}
              onChange={(e) => onConsultationTypeChange(e.target.value)}
            />
            Any
          </label>
        </div>
      </div>
    </div>
  );
}

export default FilterPanel;
