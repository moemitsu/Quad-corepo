// app/family-registration/page.tsx

"use client";

import React from "react";
import FamilyRegistrationForm from "../../_components/forms/FamilyRegistrationForm";
import Header from "../../_components/layout/header";
import Footer from "../../_components/layout/footer";

const FamilyRegistrationPage: React.FC = () => {
  return (
    <div>
      <Header />
      <div className="p-6 bg-custom-green min-h-screen flex flex-col justify-center items-center">
        <FamilyRegistrationForm />
      </div>
      <Footer />
    </div>
  );
};

export default FamilyRegistrationPage;
