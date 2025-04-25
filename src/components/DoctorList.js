import React from 'react';
import DoctorCard from './DoctorCard';

function DoctorList({ doctors, loading, error }) {
  if (loading) {
    return <div className="loading">Loading doctors...</div>;
  }

  if (error) {
    return <div className="error">Error fetching doctors: {error.message}</div>;
  }

  if (doctors.length === 0) {
    return <div className="no-results">No doctors found matching your criteria.</div>;
  }

  return (
    <div className="doctor-list">
      {doctors.map((doctor) => (
        <DoctorCard key={doctor.id} doctor={doctor} />
      ))}
    </div>
  );
}

export default DoctorList;