// app/family-registration/page.tsx

'use client';

import React from 'react';
import FamilyRegistrationForm from '../../_components/forms/FamilyRegistrationForm';

const FamilyRegistrationPage: React.FC = () => {
  return (
    <div className="p-6 bg-custom-green min-h-screen flex flex-col justify-center items-center">
      <FamilyRegistrationForm />
    </div>
  );
};

export default FamilyRegistrationPage;
