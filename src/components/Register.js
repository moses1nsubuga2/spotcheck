import React, { useState } from "react";
import { TextField, Button, Box, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useAuth } from "../contexts/AuthContext";

export default function Register() {
  const [form, setForm] = useState({ email: "", password: "", role: "customer" });
  const [error, setError] = useState("");
  const { setUserRole } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      await setUserRole(userCredential.user.uid, form.role);
      // Optionally redirect or show success
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2, maxWidth: 400, mx: "auto" }}>
      <TextField label="Email" name="email" value={form.email} onChange={handleChange} fullWidth margin="normal" />
      <TextField label="Password" name="password" type="password" value={form.password} onChange={handleChange} fullWidth margin="normal" />
      <FormControl fullWidth margin="normal">
        <InputLabel>Role</InputLabel>
        <Select name="role" value={form.role} label="Role" onChange={handleChange}>
          <MenuItem value="customer">Customer / General User</MenuItem>
          <MenuItem value="business">Business Owner / Organization</MenuItem>
        </Select>
      </FormControl>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <Button type="submit" variant="contained" sx={{ mt: 2 }}>Register</Button>
    </Box>
  );
}
