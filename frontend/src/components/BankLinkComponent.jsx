import React, { useState } from "react";
import axios from "axios";

export const BankLinkComponent = () => {
  const [bankLink, setBankLink] = useState("");

  const fetchLink = async () => {
    const response = await axios.get("/api/bank-link/");

    // console.log(response.data);
    setBankLink(response.data.link);
  };
  return (
    <>
      <button onClick={fetchLink}>Crear link santander</button>
      {bankLink && (
        <a href={bankLink} target="_blank">
          Enlace banco Santander
        </a>
      )}
    </>
  );
};
