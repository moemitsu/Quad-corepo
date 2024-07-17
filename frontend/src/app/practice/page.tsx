"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../../_components/layout/Header";
import Footer from "../../_components/layout/Footer";
import SearchCondition from "@/_components/analysis/SearchCondition";
import OpenaiAnalysis from "@/_components/analysis/OpenaiAnalysis";
import UnifyChart from "@/_components/analysis/UnifyChart";
import RecordList from "@/_components/analysis/RecordList";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import CheckEmpty from "@/_components/analysis/CheckEmpty";

const Practice: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [selectedMonth, setSelectedMonth] = useState<number>(6);
  const [selectedChild, setSelectedChild] = useState<string>("");
  const [authToken, setAuthToken] = useState<string>("");

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        user.getIdToken(/* forceRefresh */ true).then((token) => {
          setAuthToken(token);
        });
      }
    });
  }, []);

  return (
    <div>
      <Header />
      <div className="p-6 min-h-screen flex flex-col">
      <CheckEmpty
          isEmpty={true} // Example of passing isEmpty prop
        />
      <div className="p-6 min-h-screen flex flex-col">
        <SearchCondition
          setSelectedYear={setSelectedYear}
          setSelectedMonth={setSelectedMonth}
          setSelectedChild={setSelectedChild}
        />
        <div className="mt-4 bg-white bg-opacity-50 p-6 rounded-lg shadow-md">
          <OpenaiAnalysis
            year={selectedYear}
            month={selectedMonth}
            selectedChildName={selectedChild}
          />
        </div>
        <UnifyChart
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          selectedChildName={selectedChild}
          authToken={authToken}
        />
        <div className="mt-4 bg-white bg-opacity-50 p-6 rounded-lg shadow-md">
          <RecordList
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            selectedChildName={selectedChild}
            bearerToken={authToken}
          />
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
};

export default Practice;
