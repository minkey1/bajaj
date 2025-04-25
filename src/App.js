import React, { useState, useEffect, useMemo } from 'react';
import AutocompleteHeader from './components/AutocompleteHeader';
import FilterPanel from './components/FilterPanel';
import DoctorList from './components/DoctorList';
import useQueryParamState from './hooks/useQueryParamState';
import SortPanel from './components/SortPanel';
import { extractNumber, extractFee } from './components/DoctorCard';
import './App.css';

const API_URL = 'https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json';

function App() {
  const [allDoctors, setAllDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [availableSpecialties, setAvailableSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const [searchTerm, setSearchTerm] = useQueryParamState('search', '');
  const [consultationType, setConsultationType] = useQueryParamState('consult', ''); // 'video', 'in-clinic', ''
  const [selectedSpecialties, setSelectedSpecialties] = useQueryParamState('specialties', []);
  const [sortBy, setSortBy] = useQueryParamState('sort', ''); // 'fees', 'experience', ''

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


        const specialties = new Set();
        data.forEach(doc => {
          doc.specialities?.forEach(spec => specialties.add(spec.name));
        });
        setAvailableSpecialties(Array.from(specialties).sort());

      } catch (e) {
        console.error("Failed to fetch doctors:", e);
        setError(e);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const processedDoctors = useMemo(() => {
    if (!allDoctors) return [];

    let doctors = [...allDoctors];

    if (searchTerm) {
      doctors = doctors.filter(doc =>
        doc.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (consultationType === 'video') {
      doctors = doctors.filter(doc => doc.video_consult === true);
    } else if (consultationType === 'in-clinic') {
      doctors = doctors.filter(doc => doc.in_clinic === true);
    }

    if (selectedSpecialties && selectedSpecialties.length > 0) {
      doctors = doctors.filter(doc =>
        doc.specialities?.some(spec => selectedSpecialties.includes(spec.name))
      );
    }

    if (sortBy === 'fees') {
       doctors.sort((a, b) => extractFee(a.fees) - extractFee(b.fees));
    } else if (sortBy === 'experience') {
      doctors.sort((a, b) => extractNumber(b.experience) - extractNumber(a.experience));
    }

    return doctors;
  }, [allDoctors, searchTerm, consultationType, selectedSpecialties, sortBy]);


  useEffect(() => {
    setFilteredDoctors(processedDoctors);
  }, [processedDoctors]);



  const handleSearch = (term) => {
    setSearchTerm(term);
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