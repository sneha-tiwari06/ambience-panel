import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axiosInstance, { BASE_IMAGE_URL } from "../utils/axiosInstnace";

const AddTestimonials = () => {
  const [logo, setLogo] = useState(null);
  const [image, setImage] = useState(null);
  const [logoAltText, setLogoAltText] = useState("");
  const [imageAltText, setImageAltText] = useState("");
  const [content, setContent] = useState("");
  const [existingTestimonial, setExistingTestimonial] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    logo: "",
    image: "",
    logoAltText: "",
    imageAltText: "",
    content: "",
  });
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const fetchTestimonial = async () => {
        try {
          const response = await axiosInstance.get(`/testimonials/${id}`);
          const testimonial = response.data;
          setExistingTestimonial(testimonial);
          setLogoAltText(testimonial.logoAltText);
          setImageAltText(testimonial.imageAltText);
          setContent(testimonial.content);
        } catch (error) {
          console.error("Error fetching testimonial:", error);
        }
      };

      fetchTestimonial();
    }
  }, [id]);

  const handleChange = (e, field) => {
    const value = e.target.value;
    if (field === "logoAltText") {
      setLogoAltText(value);
      setErrors((prevErrors) => ({ ...prevErrors, logoAltText: "" }));
    } else if (field === "imageAltText") {
      setImageAltText(value);
      setErrors((prevErrors) => ({ ...prevErrors, imageAltText: "" }));
    } else if (field === "content") {
      setContent(value);
      setErrors((prevErrors) => ({ ...prevErrors, content: "" }));
    }
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (field === "logo") {
      setLogo(file);
      setErrors((prevErrors) => ({ ...prevErrors, logo: "" }));
    } else if (field === "image") {
      setImage(file);
      setErrors((prevErrors) => ({ ...prevErrors, image: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let formErrors = {};
    if (!logo && !existingTestimonial) {
      formErrors.logo = "Logo is required";
    }
    if (!image && !existingTestimonial) {
      formErrors.image = "Image is required";
    }
    if (!logoAltText) {
      formErrors.logoAltText = "Logo Alt Text is required";
    }
    if (!imageAltText) {
      formErrors.imageAltText = "Image Alt Text is required";
    }
    if (!content) {
      formErrors.content = "Content is required";
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    const formData = new FormData();
    formData.append("logo", logo);
    formData.append("image", image);
    formData.append("logoAltText", logoAltText);
    formData.append("imageAltText", imageAltText);
    formData.append("content", content);

    try {
      if (id) {
        await axiosInstance.put(`/testimonials/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        await axiosInstance.post("/testimonials", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }
      navigate("/testimonials");
    } catch (error) {
      console.error("Error submitting testimonial:", error);
    }finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-100 add-testimonials">
      <div className="section-heading">
        <h2>{id ? "Edit Testimonials" : "Add Testimonials"}</h2>
      </div>
      <div className="action-btn d-grid gap-2 d-md-flex justify-content-md-end">
        <div className="back-btn">
          <Link to="/testimonials">
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
              <label htmlFor="logo" className="form-label">
                Add Logo
              </label>
              <input
                className="form-control"
                type="file"
                id="logo"
                onChange={(e) => handleFileChange(e, "logo")}
              />
              {existingTestimonial && (
                <img
                  src={`${BASE_IMAGE_URL}${existingTestimonial.logo}`}
                  alt={existingTestimonial.logoAltText}
                  style={{ width: "100px", marginTop: "10px" }}
                />
              )}
              {errors.logo && <small className="text-danger">{errors.logo}</small>}
            </div>
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
              {existingTestimonial && (
                <img
                  src={`${BASE_IMAGE_URL}${existingTestimonial.image}`}
                  alt={existingTestimonial.imageAltText}
                  style={{ width: "100px", marginTop: "10px" }}
                />
              )}
              {errors.image && <small className="text-danger">{errors.image}</small>}
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="alt-text-logo" className="form-label">
                Add Alternate Text for Logo
              </label>
              <input
                type="text"
                className="form-control"
                id="alt-text-logo"
                value={logoAltText}
                onChange={(e) => handleChange(e, "logoAltText")}
              />
              {errors.logoAltText && (
                <small className="text-danger">{errors.logoAltText}</small>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="alt-text-image" className="form-label">
                Add Alternate Text for Image
              </label>
              <input
                type="text"
                className="form-control"
                id="alt-text-image"
                value={imageAltText}
                onChange={(e) => handleChange(e, "imageAltText")}
              />
              {errors.imageAltText && (
                <small className="text-danger">{errors.imageAltText}</small>
              )}
            </div>
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="add-content" className="form-label">
            Add Content
          </label>
          <textarea
            className="form-control"
            id="add-content"
            value={content}
            onChange={(e) => handleChange(e, "content")}
          />
          {errors.content && <small className="text-danger">{errors.content}</small>}
        </div>
        <button type="submit" className="w-auto btn btn-primary" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default AddTestimonials;
