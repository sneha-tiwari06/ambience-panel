import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../utils/axiosInstnace";

function AddCareers() {
  const [formData, setFormData] = useState({
    role: "",
    position: "",
    experience: "",
    location: "",
    description: ""
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { id } = useParams(); 

  useEffect(() => {
    if (id) {
      const fetchCareer = async () => {
        try {
          const response = await axiosInstance.get(`/careers/${id}`);
          setFormData(response.data);
        } catch (error) {
          console.error("Error fetching the career data", error);
        }
      };
      fetchCareer();
    }
  }, [id]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));

    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: undefined }));
    }
  };

  const validateFields = () => {
    const newErrors = {};
    if (!formData.role.trim()) newErrors.role = "Please add a role.";
    if (!formData.position.trim()) newErrors.position = "Please add a position.";
    if (!formData.experience.trim()) newErrors.experience = "Please add experience.";
    if (!formData.location.trim()) newErrors.location = "Please add a location.";
    if (!formData.description.trim()) newErrors.description = "Please add a description.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFields()) {
      return;
    }

    try {
      if (id) {
        await axiosInstance.put(`/careers/${id}`, formData);
      } else {
        await axiosInstance.post("/careers", formData);
      }
      navigate("/careers");
    } catch (error) {
      console.error("Error submitting the form", error);
    }
  };

  return (
    <div className="w-100 add-careers">
      <div className="section-heading">
        <h2>{id ? "Edit Career" : "Add Career"}</h2>
      </div>
      <div className="action-btn d-grid gap-2 d-md-flex justify-content-md-end">
        <div className="back-btn">
          <Link to="/careers">
            <button type="button" className="w-auto btn btn-primary">
              Back
            </button>
          </Link>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="role" className="form-label">Role</label>
              <input
                type="text"
                className="form-control"
                id="role"
                value={formData.role}
                onChange={handleChange}
              />
              {errors.role && <small className="text-danger">{errors.role}</small>}
            </div>
            <div className="mb-3">
              <label htmlFor="position" className="form-label">Position</label>
              <input
                type="text"
                className="form-control"
                id="position"
                value={formData.position}
                onChange={handleChange}
              />
              {errors.position && <small className="text-danger">{errors.position}</small>}
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="experience" className="form-label">Experience</label>
              <input
                type="text"
                className="form-control"
                id="experience"
                value={formData.experience}
                onChange={handleChange}
              />
              {errors.experience && <small className="text-danger">{errors.experience}</small>}
            </div>
            <div className="mb-3">
              <label htmlFor="location" className="form-label">Location</label>
              <input
                type="text"
                className="form-control"
                id="location"
                value={formData.location}
                onChange={handleChange}
              />
              {errors.location && <small className="text-danger">{errors.location}</small>}
            </div>
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Role Description</label>
          <textarea
            className="form-control"
            id="description"
            value={formData.description}
            onChange={handleChange}
          />
          {errors.description && <small className="text-danger">{errors.description}</small>}
        </div>
        <button type="submit" className="w-auto btn btn-primary">
          {id ? "Update" : "Submit"}
        </button>
      </form>
    </div>
  );
}

export default AddCareers;
