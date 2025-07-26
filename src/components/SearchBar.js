import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearch = () => {
    onSearch(query);
  };

  return (
    <Box sx={{ display: "flex", gap: 2, p: 2 }}>
      <TextField label="Search Activity or Business" value={query} onChange={handleChange} fullWidth />
      <Button variant="contained" onClick={handleSearch}>Search</Button>
    </Box>
  );
}
