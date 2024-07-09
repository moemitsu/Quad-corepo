// src/app/record-activity/page.tsx

'use client';

import React from 'react';
import RecordForm from '../../_components/forms/RecordForm';
import Header from "../../_components/layout/Header";
import Footer from "../../_components/layout/Footer";

const RecordActivityPage: React.FC = () => {
  return (
    <div>
      <Header />
      <RecordForm />
      <Footer />
    </div>
  );
};

export default RecordActivityPage;
