"use client";

import React from "react";
import FamilyRegistrationForm from "../../_components/forms/FamilyRegistrationForm";
import Header from "../../_components/layout/Header";
import Footer from "../../_components/layout/Footer";

const FamilyRegistrationPage: React.FC = () => {
  return (
    <div>
      <Header />
      <div className="p-6 min-h-screen flex flex-col justify-center items-center">
        <FamilyRegistrationForm />
      </div>
      <Footer />
    </div>
  );
};

export default FamilyRegistrationPage;
