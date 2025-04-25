import React, { useState, useEffect, useMemo } from 'react';
import AutocompleteHeader from './components/AutocompleteHeader';
import FilterPanel from './components/FilterPanel';
import DoctorList from './components/DoctorList';
import useQueryParamState from './hooks/useQueryParamState';
import SortPanel from './components/SortPanel';
import { extractNumber, extractFee } from './components/DoctorCard'; // Import helpers
import './App.css';

const API_URL = 'https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json';

function App() {
  const [allDoctors, setAllDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [availableSpecialties, setAvailableSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Manage state using custom hook synced with URL query params
  const [searchTerm, setSearchTerm] = useQueryParamState('search', '');
  const [consultationType, setConsultationType] = useQueryParamState('consult', ''); // 'video', 'in-clinic', ''
  const [selectedSpecialties, setSelectedSpecialties] = useQueryParamState('specialties', []); // Array of strings
  const [sortBy, setSortBy] = useQueryParamState('sort', ''); // 'fees', 'experience', ''

  // Fetch data on initial mount
  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAllDoctors(data);

        // Extract unique specialties
        const specialties = new Set();
        data.forEach(doc => {
          doc.specialities?.forEach(spec => specialties.add(spec.name));
        });
        setAvailableSpecialties(Array.from(specialties).sort()); // Sort alphabetically

      } catch (e) {
        console.error("Failed to fetch doctors:", e);
        setError(e);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []); // Empty dependency array ensures this runs only once on mount

  // Memoized filtering and sorting logic
  const processedDoctors = useMemo(() => {
    if (!allDoctors) return [];

    let doctors = [...allDoctors];

    // 1. Search Filter (by name)
    if (searchTerm) {
      doctors = doctors.filter(doc =>
        doc.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 2. Consultation Type Filter
    if (consultationType === 'video') {
      doctors = doctors.filter(doc => doc.video_consult === true);
    } else if (consultationType === 'in-clinic') {
      doctors = doctors.filter(doc => doc.in_clinic === true);
    }

    // 3. Specialties Filter (multi-select)
    if (selectedSpecialties && selectedSpecialties.length > 0) {
      doctors = doctors.filter(doc =>
        doc.specialities?.some(spec => selectedSpecialties.includes(spec.name))
      );
    }

    // 4. Sorting
    if (sortBy === 'fees') {
      // Sort by fees ascending (use helper to parse)
       doctors.sort((a, b) => extractFee(a.fees) - extractFee(b.fees));
    } else if (sortBy === 'experience') {
      // Sort by experience descending (use helper to parse)
      doctors.sort((a, b) => extractNumber(b.experience) - extractNumber(a.experience));
    }

    return doctors;
  }, [allDoctors, searchTerm, consultationType, selectedSpecialties, sortBy]);

  // Update filteredDoctors whenever processedDoctors changes
  useEffect(() => {
    setFilteredDoctors(processedDoctors);
  }, [processedDoctors]);


  // Handler for search triggered by AutocompleteHeader
  const handleSearch = (term) => {
    setSearchTerm(term); // This will trigger the useMemo calculation via the hook
  };


  return (
    <>
      <AutocompleteHeader
        doctors={allDoctors}
        onSearch={handleSearch}
       />

      <div className="main-content">
        <div className="side-panel">
        <SortPanel
          selectedSort={sortBy}
          onSortChange={setSortBy}
        />
        <FilterPanel
          availableSpecialties={availableSpecialties}
          selectedConsultationType={consultationType}
          onConsultationTypeChange={setConsultationType}
          selectedSpecialties={selectedSpecialties}
          onSpecialtyChange={setSelectedSpecialties}
        />
        
        </div>
        <div className="doctor-list-container">
          <DoctorList
            doctors={filteredDoctors}
            loading={loading}
            error={error}
          />
        </div>
      </div>
    </>
  );
}

export default App;