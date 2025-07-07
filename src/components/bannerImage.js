import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axiosInstance, { BASE_IMAGE_URL } from "../utils/axiosInstnace";

function BannerImage() {
  const [bannerImages, setBannerImages] = useState([]);
  const [image, setImage] = useState(null);
  const [mobileImage, setMobileImage] = useState(null);
  const [tabImage, setTabImage] = useState(null);
  const [altText, setAltText] = useState("");
  const [bannerText, setBannerText] = useState("");
  const [currentId, setCurrentId] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewMobileUrl, setPreviewMobileUrl] = useState(null);
  const [previewTabUrl, setPreviewTabUrl] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const fetchBannerImages = async () => {
    try {
      const response = await axiosInstance.get("/banner-images/");
      setBannerImages(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (type === "desktop") {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else if (type === "mobile") {
      setMobileImage(file);
      setPreviewMobileUrl(URL.createObjectURL(file));
    } else if (type === "tab") {
      setTabImage(file);
      setPreviewTabUrl(URL.createObjectURL(file));
    }
  };

  const handleTextChange = (e) => {
    const { id, value } = e.target;
    if (id === "alt-text") setAltText(value);
    else if (id === "banner-text") setBannerText(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", image);
    formData.append("mobileImage", mobileImage);
    formData.append("tabImage", tabImage);
    formData.append("altText", altText);
    formData.append("bannerText", bannerText);

    try {
      if (currentId) {
        await axiosInstance.put(`/banner-images/${currentId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Banner image updated successfully.");
      } else {
        await axiosInstance.post("/banner-images/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Banner image created successfully.");
      }
      navigate('/banner-image');
      resetForm();
      fetchBannerImages();
    } catch (error) {
      console.error(error);
      alert("Error uploading image.");
    }
  };

  const resetForm = () => {
    setImage(null);
    setMobileImage(null);
    setTabImage(null);
    setAltText("");
    setBannerText("");
    setCurrentId(null);
    setPreviewUrl(null);
    setPreviewMobileUrl(null);
    setPreviewTabUrl(null);
  };

  useEffect(() => {
    fetchBannerImages();
    if (location.state?.image) {
      const { image: editImage } = location.state;
      setAltText(editImage.altText);
      setBannerText(editImage.bannerText);
      setCurrentId(editImage._id);
      setPreviewUrl(`${BASE_IMAGE_URL}${editImage.imageUrl}`);
      setPreviewMobileUrl(`${BASE_IMAGE_URL}${editImage.mobileImageUrl}`);
      setPreviewTabUrl(`${BASE_IMAGE_URL}${editImage.tabImageUrl}`);
    }
  }, [location.state]);

  return (
    <div className="banner-image">
      <div className="section-heading">
        <h2 className="banner-heading">Add Banner Images</h2>
      </div>
      <div className="action-btn d-flex justify-content-between">
        <div className="add-btn">
          <Link to="/add-banner-pointers">
            <button type="button" className="w-auto btn btn-success">
              Add pointers
            </button>
          </Link>
        </div>
        <div className="back-btn">
          <Link to="/banner-image">
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
              <label htmlFor="formFile" className="form-label">Add Image</label>
              <input
                className="form-control"
                type="file"
                id="formFile"
                onChange={(e) => handleImageChange(e, "desktop")}
                required={!currentId}
              />
            </div>
            {previewUrl && (
              <div className="image-preview">
                <img
                  src={previewUrl}
                  alt="Preview"
                  style={{ width: '100px', height: 'auto', marginTop: '10px' }}
                />
              </div>
            )}
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="mobileFile" className="form-label">Add Mobile Image</label>
              <input
                className="form-control"
                type="file"
                id="mobileFile"
                onChange={(e) => handleImageChange(e, "mobile")}
                required={!currentId}
              />
            </div>
            {previewMobileUrl && (
              <div className="image-preview">
                <img
                  src={previewMobileUrl}
                  alt="Preview"
                  style={{ width: '100px', height: 'auto', marginTop: '10px' }}
                />
              </div>
            )}
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="tabFile" className="form-label">Add Tab Image</label>
              <input
                className="form-control"
                type="file"
                id="tabFile"
                onChange={(e) => handleImageChange(e, "tab")}
                required={!currentId}
              />
            </div>
            {previewTabUrl && (
              <div className="image-preview">
                <img
                  src={previewTabUrl}
                  alt="Preview"
                  style={{ width: '100px', height: 'auto', marginTop: '10px' }}
                />
              </div>
            )}
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="alt-text" className="form-label">Add Alternate Text</label>
              <input
                className="form-control"
                type="text"
                id="alt-text"
                value={altText}
                onChange={handleTextChange}
                required
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="banner-text" className="form-label">Add Banner Text</label>
              <input
                className="form-control"
                type="text"
                id="banner-text"
                value={bannerText}
                onChange={handleTextChange}
                required
              />
            </div>
          </div>
        </div>
        <button type="submit" className="w-auto btn btn-primary">
          {currentId ? 'Update' : 'Submit'}
        </button>
      </form>
    </div>
  );
}

export default BannerImage;
