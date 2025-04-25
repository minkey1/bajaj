import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const getSpecialtyTestId = (specialty) =>
  `filter-specialty-${specialty.replace(/[\s/]+/g, '-')}`;

function FilterPanel({
  availableSpecialties,
  selectedConsultationType,
  onConsultationTypeChange,
  selectedSpecialties,
  onSpecialtyChange,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSpecialtyOpen, setIsSpecialtyOpen] = useState(true);
  const [isConsultationOpen, setIsConsultationOpen] = useState(true);

  const [searchParams, setSearchParams] = useSearchParams();

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

  const handleClearAll = () => {
    onSpecialtyChange([]);
    onConsultationTypeChange('');
    setSearchTerm('');
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete('specialties');
    newParams.delete('consultationType');
    setSearchParams(newParams);
  };

  const filteredSpecialties = availableSpecialties.filter((specialty) =>
    specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="filter-panel">
      <div className="filter-header">
        <h2>Filters</h2>
        <button onClick={handleClearAll} className="clear-all-button">
          Clear All
        </button>
      </div>

      {/* Specialties Filter */}
      <div className="filter-section">
        <div
          className="filter-header"
          style={{ cursor: 'pointer' }}
          onClick={() => setIsSpecialtyOpen((prev) => !prev)}
        >
          <h3 data-testid="filter-header-speciality">Speciality</h3>
          <span>{isSpecialtyOpen ? '▲' : '▼'}</span>
        </div>
        {isSpecialtyOpen && (
          <>
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
          </>
        )}
      </div>

      {/* Consultation Type Filter */}
      <div className="filter-section">
        <div
          className="filter-header"
          style={{ cursor: 'pointer' }}
          onClick={() => setIsConsultationOpen((prev) => !prev)}
        >
          <h3 data-testid="filter-header-moc">Consultation Mode</h3>
          <span>{isConsultationOpen ? '▲' : '▼'}</span>
        </div>
        {isConsultationOpen && (
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
              All
            </label>
          </div>
        )}
      </div>
    </div>
  );
}

export default FilterPanel;
