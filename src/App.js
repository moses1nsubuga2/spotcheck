import React, { useEffect, useState } from "react";
import './App.css';
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import MapView from "./components/MapView";
import PinForm from "./components/PinForm";
import SearchBar from "./components/SearchBar";

import Register from "./components/Register";
import { getPins, createPin, updatePin, deletePin, searchPinsByActivity } from "./services/pinService";
import Button from "@mui/material/Button";

function MainApp() {
  const { currentUser, role } = useAuth();
  const [pins, setPins] = useState([]);
  const [selectedPin, setSelectedPin] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    getPins().then(setPins);
  }, []);


  // Only business owners/orgs can create pins
  const handleMapClick = (e) => {
    if (currentUser && role === "business") {
      setShowForm(true);
      setSelectedPin({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    }
  };

  // Only business owners/orgs can edit/delete their own pins
  const handleMarkerClick = (pin) => {
    if (currentUser && role === "business" && pin.ownerId === currentUser.uid) {
      setSelectedPin(pin);
      setShowForm(true);
    }
  };

  const handleFormSubmit = async (form) => {
    if (form.id) {
      await updatePin(form.id, form);
    } else {
      await createPin({ ...form, lat: Number(form.lat), lng: Number(form.lng), ownerId: currentUser.uid });
    }
    setShowForm(false);
    setSelectedPin(null);
    getPins().then(setPins);
  };

  const handleDeletePin = async (id) => {
    await deletePin(id);
    setShowForm(false);
    setSelectedPin(null);
    getPins().then(setPins);
  };

  const handleSearch = async (query) => {
    if (query) {
      const results = await searchPinsByActivity(query);
      setPins(results);
    } else {
      getPins().then(setPins);
    }
  };

  return (
    <div className="App" style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <header style={{ background: "#1976d2", color: "white", padding: "1rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h2 style={{ margin: 0 }}>SpotCheck</h2>
        {currentUser && <span>Role: {role}</span>}
      </header>
      <div style={{ display: "flex", flex: 1 }}>
        <aside style={{ width: 350, background: "#f5f5f5", padding: "1rem", boxSizing: "border-box", overflowY: "auto" }}>
          <SearchBar onSearch={handleSearch} />
          {/* Only business owners/orgs can add/edit/delete pins */}
          {showForm && role === "business" && (
            <PinForm
              initialData={selectedPin}
              onSubmit={handleFormSubmit}
            />
          )}
          {showForm && role === "business" && selectedPin && selectedPin.id && (
            <Button variant="outlined" color="error" onClick={() => handleDeletePin(selectedPin.id)} sx={{ mt: 2, width: "100%" }}>Delete Pin</Button>
          )}
        </aside>
        <main style={{ flex: 1, position: "relative" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}>
            <MapView pins={pins} onMapClick={handleMapClick} onMarkerClick={handleMarkerClick} />
          </div>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const { currentUser } = useAuth();
  if (!currentUser) {
    return <Register />;
  }
  return <MainApp />;
}

export default App;
