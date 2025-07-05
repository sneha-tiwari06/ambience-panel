import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom"; 
import axiosInstance, { BASE_IMAGE_URL } from "../utils/axiosInstnace";

function AddAwards() {
  const [image, setImage] = useState(null);
  const [certificateImage, setCertificateImage] = useState(null);  
  const [altText, setAltText] = useState('');
  const [existingImage, setExistingImage] = useState(null);
  const [existingCertificateImage, setExistingCertificateImage] = useState(null); // State for existing certificate image
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams(); 

  useEffect(() => {
    const fetchAwardData = async () => {
      if (id) {
        try {
          const response = await axiosInstance.get(`/awards/${id}`);
          const award = response.data;
          setExistingImage(`${BASE_IMAGE_URL}/${award.image}`);
          setExistingCertificateImage(`${BASE_IMAGE_URL}/${award.certificateImage}`); // Fetch certificate image
          setAltText(award.altText);
        } catch (error) {
          console.error('Error fetching award data:', error);
        }
      }
    };

    fetchAwardData();
  }, [id]);

  const validateFields = () => {
    const newErrors = {};
    if (!image && !id) {
      newErrors.image = "Please upload an image.";
    }
   
    if (!altText.trim()) {
      newErrors.altText = "Alternate text is required.";
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
    if (image) formData.append("image", image); 
    if (certificateImage) formData.append("certificateImage", certificateImage); // Append the certificate image
    formData.append("altText", altText); 
    // console.log("Form Data being sent:");
    // console.log("Alt Text:", altText);
    // console.log("Image:", image ? image.name : "No image selected");
    // console.log("Certificate Image:", certificateImage ? certificateImage.name : "No certificate image selected");
  
    try {
      const response = id 
        ? await axiosInstance.put(`/awards/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
        : await axiosInstance.post('/awards', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });

      if (response.status === 200 || response.status === 201) {
        navigate('/awards'); 
      } else {
        console.error('Failed to save award');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0]; // Get the first file
    if (file) {
      if (field === "image") {
        setImage(file);
      } else if (field === "certificateImage") {
        setCertificateImage(file);
      }
      if (errors[field]) {
        setErrors((prevErrors) => ({ ...prevErrors, [field]: undefined })); // Clear specific error
      }
    }
  };

  const handleTextChange = (e) => {
    const { value } = e.target;
    setAltText(value);
    if (errors.altText) {
      setErrors((prevErrors) => ({ ...prevErrors, altText: undefined })); // Clear text error
    }
  };

  return (
    <div className="w-100 add-awards">
      <div className="section-heading">
        <h2>{id ? 'Edit' : 'Add'} Awards & Certifications</h2>
      </div>
      <div className="action-btn d-grid gap-2 d-md-flex justify-content-md-end">
        <div className="back-btn">
          <Link to="/awards">
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
              <label htmlFor="formFile" className="form-label">
                Add Image
              </label>
              <input 
                className="form-control" 
                type="file" 
                id="formFile" 
                onChange={(e) => handleFileChange(e, "image")} 
              />
              {errors.image && <small className="text-danger">{errors.image}</small>}
              {id && existingImage && (
                <div className="image-preview mt-2">
                  <img src={existingImage} alt={altText} className="img-fluid" style={{height: "100px"}} />
                </div>
              )}
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="certificate" className="form-label">
                Add Certificate Image
              </label>
              <input 
                className="form-control" 
                type="file" 
                id="certificate" 
                onChange={(e) => handleFileChange(e, "certificateImage")} 
              />
              {id && existingCertificateImage && (
                <div className="image-preview mt-2">
                  <img src={existingCertificateImage} alt={altText} className="img-fluid" style={{ height: "100px" }} />
                </div>
              )}
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="alt-text" className="form-label">
                Alternate text
              </label>
              <input 
                type="text" 
                className="form-control" 
                id="alt-text" 
                value={altText} 
                onChange={handleTextChange} 
              />
              {errors.altText && <small className="text-danger">{errors.altText}</small>}
            </div>
          </div>
        </div>
        <button type="submit" className="w-auto btn btn-primary" disabled={loading}>
          {loading ? "Submitting..." : id ? "Update" : "Submit"}
        </button>
      </form>
    </div>
  );
}

export default AddAwards;
