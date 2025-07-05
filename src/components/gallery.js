import React, { useEffect, useState } from "react";
import { Box, Avatar } from "@mui/material";
import { Add, Edit, Delete, Visibility, AddPhotoAlternate } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axiosInstance, { BASE_IMAGE_URL } from "../utils/axiosInstnace";
import PageHeader from "./common/PageHeader";
import DataTable from "./common/DataTable";
import ActionButton from "./common/ActionButton";
import ConfirmDialog from "./common/ConfirmDialog";

function Gallery() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGalleryItems = async () => {
      try {
        const response = await axiosInstance.get("/gallery");
        setGalleryItems(response.data);
      } catch (err) {
        console.error("Error fetching gallery items:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryItems();
  }, []);

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/gallery/${deleteDialog.id}`);
      setGalleryItems((prevItems) =>
        prevItems.filter((item) => item._id !== deleteDialog.id)
      );
      setDeleteDialog({ open: false, id: null });
    } catch (err) {
      console.error("Error deleting gallery item:", err);
    }
  };

  const columns = [
    {
      id: 'index',
      label: '#',
      render: (row, index) => index + 1,
    },
    {
      id: 'image',
      label: 'Image',
      render: (row) => (
        <Avatar
          src={`${BASE_IMAGE_URL}${row.image}`}
          alt="Gallery thumbnail"
          sx={{ width: 60, height: 60 }}
          variant="rounded"
        />
      ),
      minWidth: 100,
    },
    {
      id: 'projectName',
      label: 'Project Name',
      sortable: true,
      minWidth: 200,
    },
    {
      id: 'location',
      label: 'Location',
      sortable: true,
      minWidth: 150,
    },
    {
      id: 'priority',
      label: 'Priority',
      sortable: true,
      minWidth: 100,
    },
    {
      id: 'actions',
      label: 'Actions',
      render: (row) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <ActionButton
            icon={<AddPhotoAlternate />}
            tooltip="Add Images"
            iconOnly
            size="small"
            color="success"
            onClick={() => navigate(`/add-gallery-image/${row._id}`)}
          />
          <ActionButton
            icon={<Visibility />}
            tooltip="View Images"
            iconOnly
            size="small"
            color="info"
            onClick={() => navigate(`/project-image/${row._id}`)}
          />
          <ActionButton
            icon={<Edit />}
            tooltip="Edit"
            iconOnly
            size="small"
            color="primary"
            onClick={() => navigate(`/edit-gallery-image/${row._id}`)}
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
      minWidth: 200,
    },
  ];

  const actions = [
    <ActionButton
      key="add"
      icon={<Add />}
      onClick={() => navigate("/add-gallery")}
    >
      Add Gallery
    </ActionButton>
  ];

  if (loading) {
    return <Box>Loading...</Box>;
  }

  return (
    <Box>
      <PageHeader
        title="Gallery"
        subtitle="Manage project gallery"
        actions={actions}
      />

      <DataTable
        columns={columns}
        data={galleryItems}
        searchPlaceholder="Search gallery items..."
      />

      <ConfirmDialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
        onConfirm={handleDelete}
        title="Delete Gallery Item"
        message="Are you sure you want to delete this gallery item? This action cannot be undone."
        severity="error"
      />
    </Box>
  );
}

export default Gallery;