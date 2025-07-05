import React, { useEffect, useState } from "react";
import { Box, Avatar } from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axiosInstance, { BASE_IMAGE_URL } from "../utils/axiosInstnace";
import PageHeader from "./common/PageHeader";
import DataTable from "./common/DataTable";
import ActionButton from "./common/ActionButton";
import StatusChip from "./common/StatusChip";
import ConfirmDialog from "./common/ConfirmDialog";

function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await axiosInstance.get("/testimonials");
        setTestimonials(response.data);
      } catch (err) {
        console.error("Error fetching testimonials:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/testimonials/${deleteDialog.id}`);
      setTestimonials((prev) => prev.filter((item) => item._id !== deleteDialog.id));
      setDeleteDialog({ open: false, id: null });
    } catch (err) {
      console.error("Error deleting testimonial:", err);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await axiosInstance.put(`/testimonials/${id}`, { isActive: !currentStatus });
      setTestimonials((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, isActive: !currentStatus } : item
        )
      );
    } catch (err) {
      console.error("Error toggling status:", err);
    }
  };

  const columns = [
    {
      id: 'index',
      label: '#',
      render: (row, index) => index + 1,
    },
    {
      id: 'logo',
      label: 'Logo',
      render: (row) => (
        <Avatar
          src={`${BASE_IMAGE_URL}${row.logo}`}
          alt={row.logoAltText}
          sx={{ width: 60, height: 60 }}
          variant="rounded"
        />
      ),
      minWidth: 100,
    },
    {
      id: 'content',
      label: 'Content',
      render: (row) => (
        <Box sx={{ maxWidth: 300 }}>
          {row.content.length > 100 ? `${row.content.substring(0, 100)}...` : row.content}
        </Box>
      ),
      sortable: true,
      minWidth: 300,
    },
    {
      id: 'status',
      label: 'Status',
      render: (row) => (
        <StatusChip
          status={row.isActive ? 'active' : 'inactive'}
          onClick={() => handleToggleStatus(row._id, row.isActive)}
        />
      ),
      minWidth: 120,
    },
    {
      id: 'actions',
      label: 'Actions',
      render: (row) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <ActionButton
            icon={<Edit />}
            tooltip="Edit"
            iconOnly
            size="small"
            color="primary"
            onClick={() => navigate(`/edit-testimonials/${row._id}`)}
          />
          <ActionButton
            icon={<Delete />}
            tooltip="Delete"
            iconOnly
            size="small"
            color="error"
            onClick={() => setDeleteDialog({ open: true, id: row._id })}
          />
        </Box>
      ),
      minWidth: 120,
    },
  ];

  const actions = [
    <ActionButton
      key="add"
      icon={<Add />}
      onClick={() => navigate("/add-testimonials")}
    >
      Add Testimonial
    </ActionButton>
  ];

  if (loading) {
    return <Box>Loading...</Box>;
  }

  return (
    <Box>
      <PageHeader
        title="Testimonials"
        subtitle="Manage customer testimonials"
        actions={actions}
      />

      <DataTable
        columns={columns}
        data={testimonials}
        searchPlaceholder="Search testimonials..."
      />

      <ConfirmDialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
        onConfirm={handleDelete}
        title="Delete Testimonial"
        message="Are you sure you want to delete this testimonial? This action cannot be undone."
        severity="error"
      />
    </Box>
  );
}

export default Testimonials;