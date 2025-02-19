import React, { createContext, useState, useEffect, useContext, useReducer, useMemo } from "react";

export const MaintenanceContext = createContext();

export const MaintenanceProvider = ({ children }) => {
    const [alerts, setAlerts] = useState([]);
    let storedUser = JSON.parse(localStorage.getItem("user")) || {};
    let userId = storedUser?.id || null;

    const fetchMaintenanceAlerts = () => {
        if userId !== null {
            fetch(`https://nautilustech.onrender.com/maintenance-alerts?userId=${userId}`)
            .then((res) => res.json())
            .then((data) => {
                setAlerts(data);
            })
            .catch((err) => console.error("Error fetching maintenance alerts:", err))
        } else {
            let storedUser = JSON.parse(localStorage.getItem("user")) || {};
            let userId = storedUser?.id || null;
        }
    };

    useEffect(() => {
        fetchMaintenanceAlerts();
        const interval = setInterval(fetchMaintenanceAlerts, 10000); // Fetch maintenanceAlerts every 10 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <MaintenanceContext.Provider value={{ alerts }}>
            {children}
        </MaintenanceContext.Provider>
    );
};
