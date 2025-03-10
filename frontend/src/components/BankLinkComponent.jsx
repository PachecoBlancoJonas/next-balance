import React, { useState } from "react";
import axios from "axios";

export const BankLinkComponent = () => {
  const [bankLink, setBankLink] = useState("");

  const fetchLink = async () => {
    const response = await axios.get("/api/bank-link/");

    setBankLink(response.data.link);
  };
  return (
    <>
      <button onClick={fetchLink}>Creaate bank link</button>
      {bankLink && (
        <a href={bankLink} target="_blank">
          Bank link
        </a>
      )}
    </>
  );
};
