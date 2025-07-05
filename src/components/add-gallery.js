import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axiosInstance, { BASE_IMAGE_URL } from "../utils/axiosInstnace";

function AddGallery() {
  const [projectName, setProjectName] = useState('');
  const [location, setLocation] = useState('');
  const [priority, setPriority] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaKeywords, setMetaKeywords] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  useEffect(() => {
    if (isEditMode) {
      axiosInstance.get(`/gallery/${id}`)
        .then(res => {
          const data = res.data.data;
          setProjectName(data.projectName || '');
          setLocation(data.location || '');
          setPriority(data.priority || '');
          setMetaTitle(data.metaTitle || '');
          setMetaKeywords(data.metaKeywords || '');
          setMetaDescription(data.metaDescription || '');
          setPreviewUrl(`${BASE_IMAGE_URL}${data.image}`);
        })
        .catch(err => {
          console.error("Failed to fetch gallery item", err);
          alert("Could not load gallery data");
        });
    }
  }, [id, isEditMode]);

  const validateFields = () => {
    const newErrors = {};
    if (!isEditMode && !image) {
      newErrors.image = "Please upload an image.";
    }
    if (!projectName.trim()) newErrors.projectName = "Project name is required.";
    if (!location.trim()) newErrors.location = "Location is required.";
    if (!priority) newErrors.priority = "Priority is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFields()) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('projectName', projectName);
    formData.append('location', location);
    formData.append('priority', priority);
    formData.append('metaTitle', metaTitle);
    formData.append('metaKeywords', metaKeywords);
    formData.append('metaDescription', metaDescription);
    if (image) formData.append('image', image);

    try {
      const response = isEditMode
        ? await axiosInstance.put(`/gallery/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          })
        : await axiosInstance.post('/gallery', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });

      alert(response.data.message || "Gallery updated!");
      navigate('/gallery');
    } catch (error) {
      console.error("Submit error:", error);
      alert("An error occurred while submitting. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
    switch (field) {
      case "projectName":
        setProjectName(value);
        break;
      case "location":
        setLocation(value);
        break;
      case "priority":
        setPriority(value);
        break;
      default:
        break;
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      if (errors.image) setErrors(prev => ({ ...prev, image: undefined }));
    }
  };

  return (
    <div className="w-100 add-gallery">
      <div className="section-heading">
        <h2>{isEditMode ? "Edit Gallery Image" : "Add Gallery Image"}</h2>
      </div>
      <div className="action-btn d-grid gap-2 d-md-flex justify-content-md-end">
        <div className="back-btn">
          <Link to="/gallery">
            <button type="button" className="w-auto btn btn-primary">Back</button>
          </Link>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="row">
          {/* Left */}
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Meta Title</label>
              <input type="text" className="form-control" value={metaTitle} onChange={e => setMetaTitle(e.target.value)} />
            </div>
            <div className="mb-3">
              <label className="form-label">Meta Description</label>
              <input type="text" className="form-control" value={metaDescription} onChange={e => setMetaDescription(e.target.value)} />
            </div>
            <div className="mb-3">
              <label className="form-label">Project Name</label>
              <input type="text" className="form-control" value={projectName} onChange={e => handleInputChange("projectName", e.target.value)} />
              {errors.projectName && <small className="text-danger">{errors.projectName}</small>}
            </div>
          </div>
          {/* Right */}
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Meta Keywords</label>
              <input type="text" className="form-control" value={metaKeywords} onChange={e => setMetaKeywords(e.target.value)} />
            </div>
            <div className="mb-3">
              <label className="form-label">Location</label>
              <input type="text" className="form-control" value={location} onChange={e => handleInputChange("location", e.target.value)} />
              {errors.location && <small className="text-danger">{errors.location}</small>}
            </div>
            
             <div className=" mb-3">
            <label className="form-label">Priority</label>
            <input type="number" className="form-control" value={priority} onChange={e => handleInputChange("priority", e.target.value)} />
            {errors.priority && <small className="text-danger">{errors.priority}</small>}
          </div>
          </div>
           <div className="col-md-6 mb-3">
              <label className="form-label">Add Project Thumb</label>
              <input type="file" className="form-control" onChange={handleFileChange} />
              {errors.image && <small className="text-danger">{errors.image}</small>}
              {previewUrl && <img src={previewUrl} alt="Preview" className="mt-2" style={{ height: "200px" }} />}
            </div>
         
        </div>
        <button type="submit" className="w-auto btn btn-primary" disabled={loading}>
          {loading ? (isEditMode ? "Updating..." : "Submitting...") : (isEditMode ? "Update" : "Submit")}
        </button>
      </form>
    </div>
  );
}

export default AddGallery;
