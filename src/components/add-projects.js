import React, { useEffect, useState } from "react";
import axiosInstance, { BASE_IMAGE_URL } from "../utils/axiosInstnace";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Box, Button } from "@mui/material";

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
  

  const addAreaLocationField = () => {
    setAreas([...areas, { value: "" }]);
    setLocations([...locations, { value: "" }]);
  };

  const removeAreaLocationField = (index) => {
    setAreas(areas.filter((_, i) => i !== index));
    setLocations(locations.filter((_, i) => i !== index));
  };

  return (
    <Box sx={{ mt: 4, maxWidth: '100%', mx: "auto", background: "#fff", p: 3, borderRadius: 3, boxShadow: 2 }}>
      <Box sx={{ mb: 3, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box>
          <h2 style={{ margin: 0 }}>{editMode ? "Edit Project" : "Add Project"}</h2>
          <span style={{ color: "#888" }}>
            {editMode ? "Update your project details" : "Fill in the details to add a new project"}
          </span>
        </Box>
        <Link to="/projects">
          <Button variant="contained" color="primary" sx={{ borderRadius: 2, px: 3 }}>
            Back
          </Button>
        </Link>
      </Box>
      <form onSubmit={handleSubmit}>
        <Box className="row" sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          <Box className="col-md-6" sx={{ flex: 1, minWidth: 280 }}>
            <div className="mb-3">
              <label htmlFor="projectName" className="form-label" style={{ fontWeight: 500 }}>Project Name</label>
              <input
                type="text"
                name="projectName"
                className="form-control"
                placeholder="Project Name"
                value={projectData.projectName}
                onChange={handleInputChange}
                style={{ borderRadius: 8, border: "1px solid #ccc", padding: 10 }}
              />
              {errors.projectName && <small className="text-danger">{errors.projectName}</small>}
            </div>
          </Box>
          <Box className="col-md-6" sx={{ flex: 1, minWidth: 280 }}>
            <div className="mb-3">
              <label htmlFor="image" className="form-label" style={{ fontWeight: 500 }}>Add Project Image</label>
              <input
                type="file"
                name="image"
                className="form-control"
                onChange={handleFileChange}
                style={{ borderRadius: 8, border: "1px solid #ccc", padding: 10 }}
              />
              {errors.image && <small className="text-danger">{errors.image}</small>}
            </div>
            {imagePreview && (
              <Box className="image-preview" sx={{ mt: 1, mb: 2 }}>
                <img
                  src={imagePreview}
                  alt="Project Preview"
                  style={{ width: "120px", borderRadius: 8, border: "1px solid #eee" }}
                />
              </Box>
            )}
          </Box>
           <Box className="col-md-6" sx={{ flex: 1, minWidth: 280 }}>
            <div className="mb-3">
              <label htmlFor="altText" className="form-label" style={{ fontWeight: 500 }}>Alternate Text</label>
              <input
                type="text"
                name="altText"
                className="form-control"
                placeholder="Alt Text"
                value={projectData.altText}
                onChange={handleInputChange}
                style={{ borderRadius: 8, border: "1px solid #ccc", padding: 10 }}
              />
              {errors.altText && <small className="text-danger">{errors.altText}</small>}
            </div>
          </Box>
          <Box className="col-md-6" sx={{ flex: 1, minWidth: 280 }}>
            <div className="mb-3">
              <label htmlFor="workBy" className="form-label" style={{ fontWeight: 500 }}>Work By</label>
              <input
                type="text"
                name="workBy"
                className="form-control"
                placeholder="Work By"
                value={projectData.workBy}
                onChange={handleInputChange}
                style={{ borderRadius: 8, border: "1px solid #ccc", padding: 10 }}
              />
              {errors.workBy && <small className="text-danger">{errors.workBy}</small>}
            </div>
          </Box>
         
          <Box className="col-md-6" sx={{ flex: 1, minWidth: 280 }}>
            <label htmlFor="category" className="form-label" style={{ fontWeight: 500 }}>Category</label>
            <select
              name="category"
              className="form-select category"
              value={projectData.category}
              onChange={handleInputChange}
              style={{ borderRadius: 8, border: "1px solid #ccc", padding: 10 }}
            >
              <option value="">Select Category</option>
              <option value="ongoing">Ongoing Projects</option>
              <option value="completed">Completed Projects</option>
            </select>
            {errors.category && <small className="text-danger">{errors.category}</small>}
          </Box>
          <Box className="col-md-12" sx={{ width: "100%" }}>
            <label className="form-label" style={{ fontWeight: 500 }}>Area(s) & Location(s)</label>
            {areas.map((area, index) => (
              <Box key={index} sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
                <input
                  type="number"
                  name={`area-${index}`}
                  className="form-control"
                  placeholder={`Area ${index + 1} (sq.ft)`}
                  value={area.value}
                  onChange={(e) => handleAreaChange(index, e.target.value)}
                  style={{ borderRadius: 8, border: "1px solid #ccc", padding: 10, maxWidth: 180 }}
                />
                <input
                  type="text"
                  name={`location-${index}`}
                  className="form-control"
                  placeholder={`Location ${index + 1}`}
                  value={locations[index]?.value || ""}
                  onChange={(e) => handleLocationChange(index, e.target.value)}
                  style={{ borderRadius: 8, border: "1px solid #ccc", padding: 10, maxWidth: 220 }}
                />
                {areas.length > 1 && (
                  <Button
                    type="button"
                    color="error"
                    variant="outlined"
                    sx={{ minWidth: 36, height: 36, borderRadius: 2 }}
                    onClick={() => removeAreaLocationField(index)}
                  >
                    X
                  </Button>
                )}
              </Box>
            ))}
            <Button
              type="button"
              variant="contained"
              color="primary"
              sx={{ borderRadius: 2, px: 3, mt: 1 }}
              onClick={addAreaLocationField}
            >
              + Add Area & Location
            </Button>
            {(errors.area || errors.location) && (
              <small className="text-danger d-block">
                {errors.area || errors.location}
              </small>
            )}
          </Box>
        </Box>
        <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ borderRadius: 2, px: 4, fontWeight: 600, fontSize: 16 }}
          >
            {editMode ? "Update Project" : "Add Project"}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default AddProjects;
