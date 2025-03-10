import React, { useState } from "react";
import axios from "axios";

export const BanksComponent = () => {
  const [country, setCountry] = useState("es");
  const [banks, setBanks] = useState([]);

  const fetchToken = async () => {
    const response = await axios.get(`/api/banks/?country=${country}`);

    setBanks(response.data);
  };
  return (
    <>
      <button onClick={fetchToken}>Search banks</button>
      <ul>
        {banks.map((bank, index) => (
          <li key={index}>
            {bank.name} {bank.id}
          </li>
        ))}
      </ul>
    </>
  );
};
