import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";

export default function PinForm({ onSubmit, initialData }) {
  const [form, setForm] = useState({
    title: initialData?.title || "",
    activity: initialData?.activity || "",
    date: initialData?.date || "",
    time: initialData?.time || "",
    lat: initialData?.lat || initialData?.lat || "",
    lng: initialData?.lng || initialData?.lng || "",
    description: initialData?.description || "",
    id: initialData?.id || undefined,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ensure lat/lng are numbers
    const data = { ...form, lat: Number(form.lat), lng: Number(form.lng) };
    onSubmit(data);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2, maxWidth: 400, mx: "auto", bgcolor: "background.paper", borderRadius: 2, boxShadow: 2 }}>
      <TextField label="Title" name="title" value={form.title} onChange={handleChange} fullWidth margin="normal" required />
      <TextField label="Activity Type" name="activity" value={form.activity} onChange={handleChange} fullWidth margin="normal" required />
      <TextField label="Date" name="date" type="date" value={form.date} onChange={handleChange} fullWidth margin="normal" InputLabelProps={{ shrink: true }} required />
      <TextField label="Time" name="time" type="time" value={form.time} onChange={handleChange} fullWidth margin="normal" InputLabelProps={{ shrink: true }} required />
      <TextField label="Latitude" name="lat" value={form.lat} onChange={handleChange} fullWidth margin="normal" required />
      <TextField label="Longitude" name="lng" value={form.lng} onChange={handleChange} fullWidth margin="normal" required />
      <TextField label="Description" name="description" value={form.description} onChange={handleChange} fullWidth margin="normal" multiline rows={3} required />
      <Button type="submit" variant="contained" sx={{ mt: 2, width: "100%" }}>Save</Button>
    </Box>
  );
}
