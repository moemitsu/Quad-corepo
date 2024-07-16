// src/components/ShareButton.tsx
"use client";
import React from "react";
import axios from "axios";

const ShareButton: React.FC = () => {
  const generateLink = async () => {
    try {
      const response = await axios.post("/api/generate-share-link");
      alert(`Share this link: ${response.data.share_link}`);
    } catch (error) {
      console.error("Error generating share link", error);
    }
  };

  return <button onClick={generateLink}>共有リンクを生成します</button>;
};

export default ShareButton;
