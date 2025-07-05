import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom"; 
import axiosInstance, { BASE_IMAGE_URL } from "../utils/axiosInstnace";

function AddClients() {
  const [image, setImage] = useState(null);
  const [altText, setAltText] = useState('');
  const [existingImage, setExistingImage] = useState('');
  const [errors, setErrors] = useState({ altText: '', image: '' });
  const navigate = useNavigate();
  const { id } = useParams(); 

  useEffect(() => {
    if (id) {
      const fetchClientData = async () => {
        try {
          const response = await axiosInstance.get(`/clients/${id}`);
          const clientData = response.data;
          setAltText(clientData.altText); 
          setExistingImage(`${BASE_IMAGE_URL}/${clientData.image}`); 
        } catch (error) {
          console.error("Error fetching client data:", error);
        }
      };
      fetchClientData();
    }
  }, [id]);

  // Handle input change and clear error messages on change
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "altText") {
      setAltText(value);
      if (value) {
        setErrors((prevErrors) => ({ ...prevErrors, altText: '' })); // Clear error when the user types
      }
    }
    if (name === "image") {
      setImage(e.target.files[0]);
      if (e.target.files.length > 0) {
        setErrors((prevErrors) => ({ ...prevErrors, image: '' })); // Clear error when an image is selected
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset errors before validating
    setErrors({ altText: '', image: '' });

    // Validation checks
    let formValid = true;

    if (!altText) {
      setErrors((prevErrors) => ({ ...prevErrors, altText: "Alternate text is required." }));
      formValid = false;
    }

    if (!image && !existingImage) {
      setErrors((prevErrors) => ({ ...prevErrors, image: "Image is required." }));
      formValid = false;
    }

    if (!formValid) return; // Stop submission if there are validation errors

    const formData = new FormData();
    formData.append("altText", altText);
    if (image) {
      formData.append("image", image);
    }

    try {
      let response;
      if (id) {
        // Update existing client
        response = await axiosInstance.put(`/clients/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data' // Ensure this header is set
          }
        });
      } else {
        // Create new client
        response = await axiosInstance.post('/clients', formData, {
          headers: {
            'Content-Type': 'multipart/form-data' // Ensure this header is set
          }
        });
      }
      
      if (response.status === 200 || response.status === 201) {
        navigate('/valuable-clients'); // Redirect after successful submission
      } else {
        console.error('Failed to add/update client');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="w-100 add-clients">
      <div className="section-heading">
        <h2>{id ? "Edit" : "Add"} Valuable Clients</h2> {/* Change heading based on context */}
      </div>
      <div className="action-btn d-grid gap-2 d-md-flex justify-content-md-end">
        <div className="back-btn">
          <Link to="/valuable-clients">
            <button type="button" className="w-auto btn btn-primary">Back</button>
          </Link>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        {existingImage && ( // Show image preview if editing
          <div className="mb-3">
            <img src={existingImage} alt="Current" style={{ width: '100px', height: 'auto'}} />
          </div>
        )}
        <div className="mb-3">
          <label htmlFor="formFile" className="form-label">Add Image</label>
          <input 
            className="form-control" 
            type="file" 
            id="formFile" 
            name="image" // Added name attribute
            onChange={handleChange} 
            accept="image/*" // Only allow image files
          />
          {errors.image && <small className="text-danger">{errors.image}</small>} {/* Display error if image is missing */}
        </div>
        <div className="mb-3">
          <label htmlFor="alt-text" className="form-label">Add Alternate Text</label>
          <input 
            type="text" 
            className="form-control" 
            id="alt-text" 
            name="altText" // Added name attribute
            value={altText} 
            onChange={handleChange} 
             
          />
          {errors.altText && <small className="text-danger">{errors.altText}</small>} {/* Display error if altText is missing */}
        </div>
        <button type="submit" className="w-auto btn btn-primary">
          {id ? "Update" : "Submit"} {/* Change button text based on context */}
        </button>
      </form>
    </div>
  );
}

export default AddClients;
