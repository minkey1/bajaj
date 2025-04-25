import React from 'react';

const extractNumber = (str) => {
  const match = str?.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
};

const extractFee = (str) => {
  const match = str?.match(/[\d,]+/);
  return match ? parseInt(match[0].replace(/,/g, ''), 10) : 0;
};

function DoctorCard({ doctor }) {
  const specialties = doctor.specialities?.map(s => s.name).join(', ') || 'N/A';
  const consultModes = [];
  if (doctor.video_consult) consultModes.push("Video Consult");
  if (doctor.in_clinic) consultModes.push("In-Clinic");

  return (
    <div className="doctor-card" data-testid="doctor-card">
      <div className="doctor-card-left">
        <img
          src={doctor.photo || 'placeholder.png'}
          alt={`Dr. ${doctor.name}`}
          className="doctor-card-photo"
          onError={(e) => { e.target.onerror = null; e.target.src = 'placeholder.png'; }}
        />
      </div>

      <div className="doctor-card-center">
        <h3 data-testid="doctor-name">{doctor.name}</h3>
        <p className="doctor-card-specialty" data-testid="doctor-specialty">
          {specialties}
        </p>
        <p className="doctor-card-degree">{doctor.degree || 'MBBS'}</p>
        <p className="doctor-card-experience" data-testid="doctor-experience">
          {doctor.experience ? `${doctor.experience} yrs exp.` : 'N/A'}
        </p>
        <div className="doctor-card-clinic">
          <span>🏥 {doctor.clinic_name || 'Clinic Name'}</span>
          <span>📍 {doctor.location || 'Location'}</span>
        </div>
      </div>

      <div className="doctor-card-right">
        <p className="doctor-card-fee" data-testid="doctor-fee">
          ₹ {extractFee(doctor.fees) || 'N/A'}
        </p>
        <button className="book-appointment-btn">
          Book Appointment
        </button>
      </div>
    </div>
  );
}

export { extractNumber, extractFee };
export default DoctorCard;
