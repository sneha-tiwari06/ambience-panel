// components/AddGalleryImage.js
import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom"; // Import useParams to get project ID
import axiosInstance from "../utils/axiosInstnace"; // Make sure this points to your axios instance setup

function AddGalleryImage() {
  const { id } = useParams();
  const [altText, setAltText] = useState('');
  const [projectName, setProjectName] = useState('');
  const [images, setImages] = useState([]);  // Make sure images is an array
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateFields = () => {
    const newErrors = {};
    if (images.length === 0) {  // Check if there are no images
      newErrors.images = "Please upload at least one image.";
    }
    if (!altText.trim()) {
      newErrors.altText = "Alternate text is required.";
    }
    if (!projectName.trim()) {
      newErrors.projectName = "Project Name is required.";
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
    formData.append('altText', altText);
    formData.append('projectName', projectName);

    // Append multiple files to FormData
    Array.from(images).forEach((file) => {
      formData.append('images', file);
    });

    try {
      const response = await axiosInstance.post(`/gallery-image/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log(formData);
      alert("Images uploaded successfully!");
      navigate(`/project-image/${id}`);
    } catch (error) {
      console.error("Error uploading images:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    if (errors[field]) {
      setErrors((prevErrors) => ({ ...prevErrors, [field]: undefined }));
    }
    if (field === "altText") {
      setAltText(value);
    }
    if (field === "projectName") {
      setProjectName(value);
    }
  };

  const handleFileChange = (e) => {
    setImages(e.target.files);  // Update to handle multiple files
    if (errors.images) {
      setErrors((prevErrors) => ({ ...prevErrors, images: undefined }));
    }
  };

  return (
    <div className="w-100 add-gallery-image">
      <div className="section-heading">
        <h2>Add Images of the Projects</h2>
      </div>
      <div className="action-btn d-grid gap-2 d-md-flex justify-content-md-end">
        <div className="back-btn">
          <Link to="/gallery">
            <button type="button" className="w-auto btn btn-primary">
              Back
            </button>
          </Link>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="text-alt" className="form-label">
            Alternate text
          </label>
          <input
            type="text"
            className="form-control"
            id="text-alt"
            value={altText}
            onChange={(e) => handleInputChange("altText", e.target.value)}
          />
          {errors.altText && <small className="text-danger">{errors.altText}</small>}
        </div>
        <div className="mb-3">
          <label htmlFor="projectName" className="form-label">
            Project Name
          </label>
          <input
            type="text"
            className="form-control"
            id="projectName"
            value={projectName}
            onChange={(e) => handleInputChange("projectName", e.target.value)}
          />
          {errors.projectName && <small className="text-danger">{errors.projectName}</small>}
        </div>
        <div className="mb-3">
          <label htmlFor="formFileMultiple" className="form-label">
            Multiple files input
          </label>
          <input
            className="form-control"
            type="file"
            id="formFileMultiple"
            multiple
            onChange={handleFileChange}  // Update images state
          />
          {errors.images && <small className="text-danger">{errors.images}</small>}
        </div>
        <button type="submit" className="w-auto btn btn-primary" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}

export default AddGalleryImage;
