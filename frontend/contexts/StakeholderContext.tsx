'use client'
// contexts/StakeholderContext.tsx
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface StakeholderContextProps {
  stakeholderId: string | null;
  setStakeholderId: (id: string | null) => void;
}

const StakeholderContext = createContext<StakeholderContextProps | undefined>(undefined);

export const StakeholderProvider = ({ children }: { children: ReactNode }) => {
  const [stakeholderId, setStakeholderId] = useState<string | null>(localStorage.getItem('stakeholder_id'));

  useEffect(() => {
    if (stakeholderId) {
      localStorage.setItem('stakeholder_id', stakeholderId);
    } else {
      localStorage.removeItem('stakeholder_id');
    }
  }, [stakeholderId]);

  return (
    <StakeholderContext.Provider value={{ stakeholderId, setStakeholderId }}>
      {children}
    </StakeholderContext.Provider>
  );
};

export const useStakeholder = () => {
  const context = useContext<StakeholderContextProps | undefined>(StakeholderContext);
  if (context === undefined) {
    throw new Error('useStakeholder must be used within a StakeholderProvider');
  }
  return context;
};
