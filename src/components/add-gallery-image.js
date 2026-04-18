// components/AddGalleryImage.js
import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../utils/axiosInstnace";

function AddGalleryImage() {
  const { id } = useParams();
  // const [altText, setAltText] = useState('');
  // const [projectName, setProjectName] = useState('');
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateFields = () => {
    const newErrors = {};
    if (images.length === 0) {
      newErrors.images = "Please upload at least one image.";
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFields()) {
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append('projectId', id);

    Array.from(images).forEach((file) => {
      formData.append('images', file);
    });

    try {
      await axiosInstance.post(`/gallery-image/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert("Images uploaded successfully!");
      navigate(`/project-image/${id}`);
    } catch (error) {
      console.error("Error uploading images:", error);
    } finally {
      setLoading(false);
    }
  };



  const handleFileChange = (e) => {
    setImages(e.target.files);
    if (errors.images) {
      setErrors((prevErrors) => ({ ...prevErrors, images: undefined }));
    }
  };

  return (
    <div className="w-100 add-gallery-image" style={{
      maxWidth: '100%',
      margin: "40px auto",
      background: "#fff",
      borderRadius: 16,
      boxShadow: "0 2px 16px #e0e0e0",
      padding: 32
    }}>
      <div className="section-heading" style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontWeight: 600, fontSize: 28, color: "#222" }}>Add Images of the Projects</h2>
        <span style={{ color: "#888", fontSize: 16 }}>
          Upload project gallery images and info
        </span>
      </div>
      <div className="action-btn d-grid gap-2 d-md-flex justify-content-md-end" style={{ marginBottom: 24 }}>
        <div className="back-btn">
          <Link to="/gallery">
            <button type="button" className="w-auto btn btn-primary" style={{
              borderRadius: 8,
              padding: "6px 24px",
              fontWeight: 500,
              fontSize: 16
            }}>
              Back
            </button>
          </Link>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
       
        <div className="mb-3">
          <label htmlFor="formFileMultiple" className="form-label" style={{ fontWeight: 500, color: "#444" }}>
            Project Images
          </label>
          <input
            className="form-control"
            type="file"
            id="formFileMultiple"
            multiple
            onChange={handleFileChange}
            style={{
              borderRadius: 8,
              border: "1px solid #ccc",
              padding: 12,
              fontSize: 16,
              background: "#fafbfc"
            }}
          />
          {errors.images && <small className="text-danger">{errors.images}</small>}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 32 }}>
          <button
            type="submit"
            className="w-auto btn btn-primary"
            disabled={loading}
            style={{
              borderRadius: 8,
              padding: "8px 32px",
              fontWeight: 600,
              fontSize: 18,
              background: "#1976d2",
              border: "none",
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddGalleryImage;
