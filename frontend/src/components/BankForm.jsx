import axios from "axios";
import { useState, useEffect } from "react";
import { X } from "lucide-react";

const apiUrl = import.meta.env.VITE_API_URL;

const selectClass =
    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

const BankForm = ({ isOpenBank, setIsOpenBank }) => {
    const [countries, setCountries] = useState([]);
    const [banks, setBanks] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState("");
    const [institutionId, setInstitutionId] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCountries = async () => {
            const cached = localStorage.getItem("countries");
            if (cached) {
                setCountries(JSON.parse(cached));
            } else {
                try {
                    const { data } = await axios.get(
                        `${apiUrl}/gocardless/countries`,
                        { withCredentials: true }
                    );
                    setCountries(data);
                    localStorage.setItem("countries", JSON.stringify(data));
                } catch {
                    setError("Failed to load countries.");
                }
            }
        };
        fetchCountries();
    }, []);

    const handleCountryChange = async (e) => {
        const code = e.target.value;
        setSelectedCountry(code);
        setBanks([]);
        setInstitutionId("");

        if (!code) return;

        try {
            const { data } = await axios.get(
                `${apiUrl}/gocardless/banks?country=${code}`,
                { withCredentials: true }
            );
            setBanks(data);
        } catch (error) {
            setError(error.response?.data?.error || "Failed to load banks.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(
                `${apiUrl}/gocardless/create-requisition`,
                { institution_id: institutionId },
                { withCredentials: true }
            );
            window.location.href = data.bank_link;
        } catch (error) {
            setError(error.response?.data?.error || "Error connecting bank.");
        }
    };

    if (!isOpenBank) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/50"
                onClick={() => setIsOpenBank(false)}
            />
            <div className="relative z-10 w-full max-w-md rounded-xl border border-border bg-background p-6 shadow-lg space-y-5 mx-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold">Connect a Bank Account</h3>
                    <button
                        onClick={() => setIsOpenBank(false)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium">Country</label>
                        <select
                            name="country"
                            required
                            onChange={handleCountryChange}
                            value={selectedCountry}
                            className={selectClass}
                        >
                            <option value="">Select a country</option>
                            {countries.map((c) => (
                                <option key={c.id} value={c.iso_code}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium">Bank</label>
                        <select
                            name="bank"
                            required
                            disabled={!selectedCountry || banks.length === 0}
                            onChange={(e) => setInstitutionId(e.target.value)}
                            value={institutionId}
                            className={selectClass}
                        >
                            <option value="">
                                {selectedCountry && banks.length === 0
                                    ? "Loading banks..."
                                    : "Select a bank"}
                            </option>
                            {banks.map((bank) => (
                                <option key={bank.id} value={bank.id}>
                                    {bank.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {error && <p className="text-sm text-destructive">{error}</p>}

                    <div className="flex justify-end pt-1">
                        <button
                            type="submit"
                            disabled={!institutionId}
                            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Connect bank
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BankForm;
