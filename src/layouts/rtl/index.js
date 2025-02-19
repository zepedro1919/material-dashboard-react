import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Typography, Card } from "@mui/material";
import maintenanceStepsData from "./maintenanceSteps.json";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Material Dashboard 2 React contexts
import { useMaterialUIController, setDirection } from "context";

function MaintenanceTracker() {
  const [, dispatch] = useMaterialUIController();
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { alertId, machineId, machineName, maintenanceType, machinePhotoUrl } = location.state || {};
  const [step, setStep] = useState(0);
  const [steps, setSteps] = useState([]);
  const [startTime, setStartTime] = useState(0);

  useEffect(() => {
    if (!alertId || !machineId) {
      console.error("Missing state data, redirecting...");
      navigate("/notifications");
    }
  }, [alertId, machineId, navigate]);

  useEffect(() => {
    if (maintenanceStepsData[machineName] && maintenanceStepsData[machineName][maintenanceType]) {
      setSteps(maintenanceStepsData[machineName][maintenanceType]);
    }
  }, [machineName, maintenanceType]);

  const isLastStep = step === steps.length - 1;

  const handleNextStep = () => {
    if (!isLastStep) {
      setStep(step + 1);
    } else {
      completeMaintenance();
    }
  };

  // Changing the direction to rtl
  useEffect(() => {
    setDirection(dispatch, "rtl");

    return () => {
      setDirection(dispatch, "ltr");
    };
  }, []);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const handleStart = () => {
    setStartTime(Math.floor(Date.now() / 1000));
    setIsRunning(true);
  };

  const resolveAlert = async (alertId) => {
    try {
      console.log(`🔍 Attempting to resolve alert with ID: ${alertId}`);

      const response = await fetch(`https://nautilustech.onrender.com/resolve-alert/${alertId}`, { method: "PUT" });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log(`✅ Alert resolved successfully in DB:`, data);
      
      window.dispatchEvent(new CustomEvent("alertResolved", { detail: alertId }));
      console.log(`📢 Event alertResolved dispatched for alert ID: ${alertId}`);

    } catch (error) {
      console.error("❌ Failed to resolve alert:", error);
    }
  };

  const completeMaintenance = async () => {
    setIsRunning(false);
    const userId = JSON.parse(localStorage.getItem("user")).id;

    resolveAlert(alertId);

    const maintenanceData = {
      machineId,
      userId,
      alertId,
      maintenanceType,
      startTime,
      endTime: Math.floor(Date.now() / 1000),
      duration: elapsedTime,
    };

    await fetch("https://nautilustech.onrender.com/log-maintenance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(maintenanceData),
    });

    navigate("/notifications");
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Card sx={{ p: 4, textAlign: "center", maxWidth: 500, margin: "auto" }}>
          <Typography variant="h5">Maintenance in Progress</Typography>
          <MDBox
            component="img"
            src={machinePhotoUrl}
            alt={machineName}
            width="100%"
            height= "auto"
            sx={{ objectFit: "cover", borderRadius: "10px" }}
          />
          <Typography variant="h6">{machineName}</Typography>
          <Typography variant="h6">Maintenance Type: {maintenanceType}</Typography>
          <Typography variant="h6">Elapsed Time: {elapsedTime} seconds</Typography>

          <Button variant="contained" color="success" onClick={handleStart} disabled={isRunning}>
            Start Maintenance
          </Button>
          <Button variant="contained" color="error" onClick={handleNextStep} disabled={!isRunning}>
            {isLastStep ? "Complete Maintenance" : "Next Step"}
          </Button>
        </Card>
      </MDBox>
      {steps.length > 0 && (
        <MDBox py={3}>
          <Card sx={{ p: 4, textAlign: "center", maxWidth: 500, margin: "auto" }}>
            <Typography variant="h6">{steps[step].description}</Typography>
            <MDBox
              component="img"
              src={steps[step].image}
              alt={steps[step].description}
              width="100%"
              height= "auto"
              sx={{ objectFit: "cover", borderRadius: "10px" }}
            />
          </Card>
        </MDBox>
      )}
      <Footer />
    </DashboardLayout>
  );
}

export default MaintenanceTracker;
