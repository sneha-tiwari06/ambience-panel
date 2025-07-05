import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axiosInstance from "../utils/axiosInstnace";

function AddOverview() {
  const [formData, setFormData] = useState({
    area: "",
    deliveredProjects: "",
    happyCustomers: "",
    content: "",
  });
  const [errors, setErrors] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const response = await axiosInstance.get(`/overview/${id}`);
        setFormData(response.data);
      } catch (error) {
        console.error("Error fetching overview:", error);
      }
    };

    if (id) {
      fetchOverview();
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
    if (!formData.area.trim()) newErrors.area = "Please add a area.";
    if (!formData.deliveredProjects.trim()) newErrors.deliveredProjects = "Please add a delivered Projects.";
    if (!formData.happyCustomers.trim()) newErrors.happyCustomers = "Please add happy Customers.";
    if (!formData.content.trim()) newErrors.content = "Please add a content.";

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
        await axiosInstance.put(`/overview/${id}`, formData);
      } else {
        await axiosInstance.post("/overview", formData);
      }
      navigate("/overview");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  const handleQuillChange = (value) => {
    setFormData({ ...formData, content: value });
  
    if (errors.content) {
      setErrors((prev) => ({ ...prev, content: undefined }));
    }
  };
  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        const imgTag = `<img src="${reader.result}" alt="Dropped Image" />`;
        setFormData((prev) => ({ ...prev, content: prev.content + imgTag }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragStart = (event, data) => {
    event.dataTransfer.setData('text/plain', data);
  };

  const handleDragOver = event => {
    event.preventDefault();
  };

  const modules = {
    toolbar: [
      [{ size: ["small", false, "large", "huge"] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "link",
    "image",
    "size",
  ];
  return (
    <div className="w-100 add-overview">
      <div className="section-heading">
        <h2>{id ? "Edit Overview" : "Add Overview"}</h2>
      </div>
      <div className="action-btn d-grid gap-2 d-md-flex justify-content-md-end">
        <div className="back-btn">
          <Link to="/overview">
            <button type="button" className="w-auto btn btn-primary">
              Back
            </button>
          </Link>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-4">
            <div className="mb-3">
              <label htmlFor="area" className="form-label">
                Area Square Ft.
              </label>
              <input
                type="text"
                className="form-control"
                id="area"
                value={formData.area}
                onChange={handleChange}
              />
              {errors.area && <small className="text-danger">{errors.area}</small>}

            </div>
          </div>
          <div className="col-md-4">
            <div className="mb-3">
              <label htmlFor="deliveredProjects" className="form-label">
                Delivered Projects
              </label>
              <input
                type="text"
                className="form-control"
                id="deliveredProjects"
                value={formData.deliveredProjects}
                onChange={handleChange}
              />
              {errors.deliveredProjects && <small className="text-danger">{errors.deliveredProjects}</small>}

            </div>
          </div>
          <div className="col-md-4">
            <div className="mb-3">
              <label htmlFor="happyCustomers" className="form-label">
                Happy Customers
              </label>
              <input
                type="text"
                className="form-control"
                id="happyCustomers"
                value={formData.happyCustomers}
                onChange={handleChange}
              />
              {errors.happyCustomers && <small className="text-danger">{errors.happyCustomers}</small>}
            </div>
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="content" className="form-label">
            Add Content
          </label>
          <div onDrop={handleDrop} onDragOver={handleDragOver}
          >
            <ReactQuill
              className="form-control"
              placeholder="Start writing..."
              modules={modules}
              formats={formats}
              value={formData.content}
              onChange={handleQuillChange}
              onDrop={handleDrop}

              style={{ height: "300px", border: "1px solid #ccc", borderRadius: "4px", overflow: "hidden" }}
            />
            {errors.content && <small className="text-danger">{errors.content}</small>}
          </div>
        </div>

        <button type="submit" className="w-auto btn btn-primary">
          {id ? "Update" : "Submit"}
        </button>
      </form>
    </div>
  );
}

export default AddOverview;
