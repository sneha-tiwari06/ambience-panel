import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstnace';

function BannerPointers() {
    const [formData, setFormdata] = useState({
        pointer1: "",
        pointer2: "",
        pointer3: "",
        pointer4: "",
    });
    const [errors, setErrors] = useState({});
    const { id } = useParams();
    const navigate = useNavigate();
    useEffect(() => {
        if (id) {
            const fetchPointers = async () => {
                try {
                    const response = await axiosInstance.get(`/pointers/${id}`);
                    setFormdata(response.data);
                } catch (error) {
                    console.error("Error fetching the pointers data", error);
                }
            };
            fetchPointers();
        }
    }, [id]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormdata((prev) => ({ ...prev, [id]: value }));

        if (errors[id]) {
            setErrors((prev) => ({ ...prev, [id]: undefined }));
        }
    };

    const validateFields = () => {
        const newErrors = {};
        if (!formData.pointer1.trim()) newErrors.pointer1 = "Please add pointer.";
        if (!formData.pointer2.trim()) newErrors.pointer2 = "Please add a pointer 2.";
        if (!formData.pointer3.trim()) newErrors.pointer3 = "Please add pointer 3.";
        if (!formData.pointer4.trim()) newErrors.pointer4 = "Please add a pointer 4.";

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
                await axiosInstance.put(`/pointers/${id}`, formData);
            } else {
                await axiosInstance.post("/pointers", formData);
            }
            navigate("/banner-pointers");
        } catch (error) {
            console.error("Error submitting the form", error);
        }
    };
    return (
        <div className='w-100 add-pointers'>
            <div className='section-heading'>
                <h2>Banner Pointers</h2>
            </div>
            <div className="action-btn">
                <div className="add-btn">
                    <Link to="/banner-pointers">
                        <button type="button" className="w-auto btn btn-success">
                            Show Pointers
                        </button>
                    </Link>
                </div>
                <div className="back-btn">
                    <Link to="/banner-pointers">
                        <button type="button" className="w-auto btn btn-primary">
                            Back
                        </button>
                    </Link>
                </div>
            </div>
            <form onSubmit={handleSubmit}>
                <div className='row'>
                    <div className='col-md-6'>
                        <div className="mb-3">
                            <label htmlFor="pointer1" className="form-label">Add Pointer 1</label>
                            <input
                                className="form-control"
                                type="text"
                                id="pointer1"
                                value={formData.pointer1}
                                onChange={handleChange}
                            />
                            {errors.pointer1 && <small className="text-danger">{errors.pointer1}</small>}

                        </div>
                    </div>
                    <div className='col-md-6'>
                        <div className="mb-3">
                            <label htmlFor="pointer2" className="form-label">Add Pointer 2</label>
                            <input
                                className="form-control"
                                type="text"
                                id="pointer2"
                                value={formData.pointer2}
                                onChange={handleChange}
                            />
                            {errors.pointer2 && <small className="text-danger">{errors.pointer2}</small>}
                        </div>
                    </div>
                    <div className='col-md-6'>
                        <div className="mb-3">
                            <label htmlFor="pointer3" className="form-label">Add Pointer 3</label>
                            <input
                                className="form-control"
                                type="text"
                                id="pointer3"
                                value={formData.pointer3}
                                onChange={handleChange}
                            />
                            {errors.pointer3 && <small className="text-danger">{errors.pointer3}</small>}
                        </div>
                    </div>
                    <div className='col-md-6'>
                        <div className="mb-3">
                            <label htmlFor="pointer4" className="form-label">Add Pointer 4</label>
                            <input
                                className="form-control"
                                type="text"
                                id="pointer4"
                                value={formData.pointer4}
                                onChange={handleChange}
                            />
                            {errors.pointer4 && <small className="text-danger">{errors.pointer4}</small>}
                        </div>
                    </div>
                </div>
                <button type="submit" className="w-auto btn btn-primary">
                    {id ? "Update" : "Submit"}
                </button>
            </form>
        </div>
    )
}

export default BannerPointers