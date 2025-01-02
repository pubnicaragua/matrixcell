// src/pages/Profile.tsx
import React, { useState } from "react";

const Profile: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "Usuario",
    email: "usuario@ejemplo.com",
    phone: "",
    address: "",
  });

  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => setProfileImage(event.target?.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Perfil actualizado con éxito");
    console.log(formData);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Mi Perfil</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: "600px", margin: "0 auto" }}>
        <div style={{ marginBottom: "20px", textAlign: "center" }}>
          <img
            src={profileImage || "https://via.placeholder.com/150"}
            alt="Profile"
            style={{
              borderRadius: "50%",
              width: "150px",
              height: "150px",
              objectFit: "cover",
            }}
          />
          <div>
            <label htmlFor="profileImage">Cambiar foto:</label>
            <input type="file" id="profileImage" onChange={handleProfileImageChange} />
          </div>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>Nombre completo:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>Teléfono:</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>Dirección:</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <button type="submit" style={{ padding: "10px 20px" }}>
          Guardar cambios
        </button>
      </form>
    </div>
  );
};

export default Profile;
