import axios from "axios";
import { useState, useEffect } from "react";
const apiUrl = import.meta.env.VITE_API_URL;
import { FiExternalLink } from "react-icons/fi";

const BankForm = (props) => {
    const { isOpenBank, setIsOpenBank } = props;
    const [countries, setCountries] = useState([]);
    const [banks, setBanks] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState("");
    const [institutionId, setInstitutionId] = useState("");

    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCountries = async () => {
            const cachedCountries = localStorage.getItem("countries");
            if (cachedCountries) {
                setCountries(JSON.parse(cachedCountries));
            } else {
                const { data } = await axios.get(
                    `${apiUrl}/gocardless/countries`,
                    { withCredentials: true }
                );
                setCountries(data);
                localStorage.setItem("countries", JSON.stringify(data));
            }
        };

        fetchCountries();
    }, []);

    const handleCountryChange = async (event) => {
        const countryCode = event.target.value;
        setSelectedCountry(countryCode);

        if (!countryCode) {
            setBanks([]);
            return;
        }

        try {
            const { data } = await axios.get(
                `${apiUrl}/gocardless/banks?country=${countryCode}`,
                { withCredentials: true }
            );
            setBanks(data);
        } catch (error) {
            setError(
                error.response?.data?.error ||
                    "Error selecting babnks in country in GoCardless process"
            );
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // create requisition
            const { data } = await axios.post(
                `${apiUrl}/gocardless/create-requisition`,
                {
                    institution_id: institutionId,
                },
                { withCredentials: true }
            );

            // Redirigir al usuario
            window.location.href = data.bank_link;

        } catch (error) {
            setError(
                error.response?.data?.error || "Error in GoCardless process"
            );
        }
    };

    return (
        <dialog className="modal" open={isOpenBank}>
            <button onClick={() => setIsOpenBank(false)}>Cerrar</button>
            <h3>New Bank</h3>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Country</label>
                    <select
                        id="country"
                        type="select"
                        name="country"
                        placeholder="Country"
                        required
                        onChange={handleCountryChange}
                        value={selectedCountry}
                    >
                        {countries.map((country) => (
                            <option key={country.id} value={country.iso_code}>
                                {country.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Bank</label>
                    <select
                        autoFocus
                        autoComplete="off"
                        id="bank"
                        type="select"
                        name="bank"
                        placeholder="bank"
                        required
                        disabled={!selectedCountry}
                        onChange={(e) => setInstitutionId(e.target.value)}
                    >
                        <option value="">Select a bank:</option>
                        {banks.map((bank) => (
                            <option key={bank.id} value={bank.id}>
                                {bank.name}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit">Create</button>
                {error && <p style={{ color: "#c92020" }}>{error}</p>}
            </form>
        </dialog>
    );
};

export default BankForm;
