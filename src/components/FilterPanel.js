import React from 'react';

const getSpecialtyTestId = (specialty) => `filter-specialty-${specialty.replace(/[\s/]+/g, '-')}`;

function FilterPanel({
  availableSpecialties,
  selectedConsultationType,
  onConsultationTypeChange,
  selectedSpecialties,
  onSpecialtyChange,
}) {

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

  return (
    <div className="filter-panel">
      {/* Specialties Filter */}
      <div className="filter-section">
        <h3 data-testid="filter-header-speciality">Speciality</h3>
        <div className="filter-options specialty-filters">
          {availableSpecialties.map((specialty) => (
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
