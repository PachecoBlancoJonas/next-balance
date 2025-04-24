import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const GoCardlessCallback = () => {
    const [SearchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const requisitionId = SearchParams.get("ref");

        const fetchAccounts = async () => {
            try {
                const payload = {
                    requisitionId,
                };
                const { data } = await axios.post(
                    `${apiUrl}/gocardless/bankAccounts`,
                    payload,
                    {
                        withCredentials: true,
                    }
                );
                // TODO try fetching accounts, if ok -> go settings
                console.log(data);
                navigate("/settings");
            } catch (error) {
                console.log("Error fetching accounts", error);
            }
        };

        if (requisitionId) fetchAccounts();
    }, []);

    return <p>Proccessing bank authorization...</p>;
};

export default GoCardlessCallback;
