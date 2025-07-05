import React, { useEffect, useState } from "react";
import axiosInstance, { BASE_IMAGE_URL } from "../utils/axiosInstnace";
import { Link, useLocation, useNavigate } from "react-router-dom";

const AddProjects = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [projectData, setProjectData] = useState({
    projectName: "",
    altText: "",
    workBy: "",
    image: null,
    category: "",
  });

  const [areas, setAreas] = useState([{ value: "" }]); 
  const [locations, setLocations] = useState([{ value: "" }]); 
  const [errors, setErrors] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (location.state && location.state.image) {
      const { image } = location.state;
      setProjectData({
        projectName: image.projectName || "",
        altText: image.altText || "",
        workBy: image.workBy || "",
        image: null,
        category: image.category || "",
      });
      setImagePreview(`${BASE_IMAGE_URL}/${image.imagePath}`);
    setEditId(image._id);
    setEditMode(true);
    if (image.areas) {
      setAreas(image.areas.map((area) => ({ value: area }))); // Set areas properly
    }
    if (image.locations) {
      setLocations(image.locations.map((location) => ({ value: location }))); // Set locations properly
    }
    
  }
}, [location.state]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProjectData({ ...projectData, [name]: value });
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleAreaChange = (index, value) => {
    const updatedAreas = [...areas];
    const numericValue = value === "" ? "" : parseFloat(value);
    updatedAreas[index].value = isNaN(numericValue) ? "" : numericValue;
    setAreas(updatedAreas);
  };
  const addAreaField = () => {
    setAreas([...areas, { value: "" }]);
  };

  const removeAreaField = (index) => {
    const updatedAreas = areas.filter((_, i) => i !== index);
    setAreas(updatedAreas);
  };
  const handleLocationChange = (index, value) => {
    const updatedLocations = [...locations];
    updatedLocations[index].value = value;
    setLocations(updatedLocations); // Fix here
  };
  
  const addLocationField = () => {
    setLocations([...locations, { value: "" }]);
  };

  const removeLocationField = (index) => {
    const updatedLocation = locations.filter((_, i) => i !== index);
    setLocations(updatedLocation);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProjectData({ ...projectData, image: file });
    setImagePreview(URL.createObjectURL(file));
    setErrors((prevErrors) => ({
      ...prevErrors,
      image: "",
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!projectData.projectName) newErrors.projectName = "Project Name is required.";
    if (areas.some((area) => area.value === "" || isNaN(area.value))) {
      newErrors.area = "All area fields must have valid numeric values.";
    }
    if (!projectData.altText) newErrors.altText = "Alt Text is required.";
    if (!projectData.workBy) newErrors.workBy = "Work By is required.";
    if (locations.some((location) => location.value.trim() === "")) {
      newErrors.location = "All location fields must have valid values.";
    }    
    if (!projectData.category) newErrors.category = "Category is required.";
    if (!projectData.image && !editMode) newErrors.image = "Image is required.";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
  
    const formData = new FormData();
    Object.keys(projectData).forEach((key) => {
      formData.append(key, projectData[key]);
    });
    const formattedLocations = locations.map((location) => location.value.trim());
    formData.append("locations", JSON.stringify(formattedLocations));
    const numericAreas = areas.map((area) => parseFloat(area.value || 0)); 
    formData.append("areas", JSON.stringify(numericAreas)); 
  
    try {
      if (editMode) {
        await axiosInstance.put(`/projects/${editId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axiosInstance.post("/projects/add", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      navigate("/projects");
    } catch (error) {
      console.error("Error saving project:", error);
    }
  };
  

  return (
    <div className="mt-4">
      <div className="section-heading">
        <h2>{editMode ? "Edit Project" : "Add Project"}</h2>
      </div>

      <div className="action-btn d-grid gap-2 d-md-flex justify-content-md-end">
        <div className="back-btn">
          <Link to="/projects">
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
              <label htmlFor="projectName" className="form-label">Project Name</label>
              <input
                type="text"
                name="projectName"
                className="form-control"
                placeholder="Project Name"
                value={projectData.projectName}
                onChange={handleInputChange}
              />
              {errors.projectName && <small className="text-danger">{errors.projectName}</small>}
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="image" className="form-label">Add Project Image</label>
              <input
                type="file"
                name="image"
                className="form-control"
                onChange={handleFileChange}
              />
              {errors.image && <small className="text-danger">{errors.image}</small>}
            </div>
            {imagePreview && (
              <div className="image-preview">
                <img
                  src={imagePreview}
                  alt="Project Preview"
                  style={{ width: "100px", maxWidth: "200px", marginBottom: "20px" }}
                />
              </div>
            )}
          </div>
          <div className="col-md-6">
            <label htmlFor="category" className="form-label">Category</label>
            <select
              name="category"
              className="form-control category"
              value={projectData.category}
              onChange={handleInputChange}
            >
              <option value="">Select Category</option>
              <option value="ongoing">Ongoing Projects</option>
              <option value="completed">Completed Projects</option>
            </select>
            {errors.category && <small className="text-danger">{errors.category}</small>}
          </div>
          <div className="col-md-12">
             <label htmlFor="area" className="form-label">Add Area</label>
            {areas.map((area, index) => (
              <div className="mb-3 d-flex align-items-center" key={index}>
                <input
                  type="number"
                  name={`area-${index}`}
                  className="form-control"
                  placeholder={`Area ${index + 1} (sq.ft)`}
                  value={area.value}
                  onChange={(e) => handleAreaChange(index, e.target.value)}
                />
                <button
                  type="button"
                  className="w-auto btn btn-danger ms-2"
                  onClick={() => removeAreaField(index)}
                >
                  X
                </button>
              </div>
            ))}
            <button type="button" className="w-auto btn btn-primary m-0" onClick={addAreaField}>
              +
            </button>
            {errors.area && <small className="text-danger d-block">{errors.area}</small>}
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="workBy" className="form-label">Work By</label>
              <input
                type="text"
                name="workBy"
                className="form-control"
                placeholder="Work By"
                value={projectData.workBy}
                onChange={handleInputChange}
              />
              {errors.workBy && <small className="text-danger">{errors.workBy}</small>}
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="altText" className="form-label">Alternate Text</label>
              <input
                type="text"
                name="altText"
                className="form-control"
                placeholder="Alt Text"
                value={projectData.altText}
                onChange={handleInputChange}
              />
              {errors.altText && <small className="text-danger">{errors.altText}</small>}
            </div>
          </div>
          <div className="col-md-12">
             <label htmlFor="location" className="form-label">Add Locations</label>
            {locations.map((location, index) => (
              <div className="mb-3 d-flex align-items-center" key={index}>
                <input
                  type="text"
                  name={`location-${index}`}
                  className="form-control"
                  placeholder={`Location ${index + 1}`}
                  value={location.value}
                  onChange={(e) => handleLocationChange(index, e.target.value)}
                />
                <button
                  type="button"
                  className="w-auto btn btn-danger ms-2"
                  onClick={() => removeLocationField(index)}
                >
                  X
                </button>
              </div>
            ))}
            <button type="button" className="w-auto btn btn-primary m-0" onClick={addLocationField}>
              +
            </button>
            {errors.location && <small className="text-danger d-block">{errors.location}</small>}
          </div>
        </div>
        <button type="submit" className="w-auto btn btn-primary">
          {editMode ? "Update Project" : "Add Project"}
        </button>
      </form>
    </div>
  );
};

export default AddProjects;
