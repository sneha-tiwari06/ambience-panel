import React, { useEffect, useState } from "react";
import { Box, Avatar, Button } from "@mui/material";
import { Add, Delete, PhotoLibrary } from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance, { BASE_IMAGE_URL } from "../utils/axiosInstnace";
import PageHeader from "./common/PageHeader";
import DataTable from "./common/DataTable";
import ActionButton from "./common/ActionButton";
import StatusChip from "./common/StatusChip";
import ConfirmDialog from "./common/ConfirmDialog";

function ProjectImage() {
  const { id } = useParams();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const [thumbnailId, setThumbnailId] = useState(null);
  const [captionDialog, setCaptionDialog] = useState({ open: false, image: null, caption: '' });
  const [priorityLoading, setPriorityLoading] = useState(false);
  const [altText, setAltText] = useState('');
  const [altTextLoading, setAltTextLoading] = useState(false);
  const navigate = useNavigate();

  const fetchImages = async () => {
    try {
      const response = await axiosInstance.get(`/gallery-image/${id}`);
      setImages(response.data);
      const existingThumbnail = response.data.find((image) => image.isThumbnail);
      if (existingThumbnail) {
        setThumbnailId(existingThumbnail._id);
      }
    } catch (error) {
      console.error("Error fetching project images:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [id]);

  // Set altText when images load
  useEffect(() => {
    if (images.length > 0) {
      setAltText(images[0].altText || '');
    }
  }, [images]);

  const handleThumbnailToggle = async (imageId) => {
    try {
      const response = await axiosInstance.put(`/gallery-image/${imageId}/toggle-thumbnail`);
      if (response.data.image) {
        setThumbnailId(response.data.image._id);
      }
      fetchImages();
    } catch (error) {
      console.error("Error updating thumbnail status:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/gallery-image/${deleteDialog.id}`);
      setDeleteDialog({ open: false, id: null });
      fetchImages();
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const handlePriorityChange = async (imageId, newPriority) => {
    setPriorityLoading(true);
    try {
      await axiosInstance.put(`/gallery-image/${imageId}/priority`, {
        priority: Number(newPriority),
      });
      fetchImages();
    } catch (error) {
      console.error("Error updating priority:", error);
    } finally {
      setPriorityLoading(false);
    }
  };

  const openCaptionDialog = (image) => {
    setCaptionDialog({ open: true, image, caption: image.caption || '' });
  };

  const closeCaptionDialog = () => {
    setCaptionDialog({ open: false, image: null, caption: '' });
  };

  const handleCaptionChange = (e) => {
    setCaptionDialog((prev) => ({ ...prev, caption: e.target.value }));
  };

  const handleCaptionSubmit = async (e) => {
    e.preventDefault();
    if (!captionDialog.image) return;
    try {
      await axiosInstance.put(`/gallery-image/${captionDialog.image._id}`, {
        caption: captionDialog.caption,
      });
      closeCaptionDialog();
      fetchImages();
    } catch (error) {
      console.error("Error updating caption:", error);
    }
  };

  // Handler to update altText in DB
  const handleAltTextSave = async () => {
    if (!images[0]) return;
    setAltTextLoading(true);
    try {
      await axiosInstance.put(`/gallery-image/${images[0]._id}`, {
        altText,
      });
      fetchImages();
    } catch (error) {
      console.error("Error updating alt text:", error);
    } finally {
      setAltTextLoading(false);
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
          src={`${BASE_IMAGE_URL}/${row.originalImagePath}`}
          alt={row.altText}
          sx={{ width: 80, height: 60 }}
          variant="rounded"
        />
      ),
      minWidth: 120,
    },
    {
      id: 'caption',
      label: 'Caption',
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <span style={{ color: '#888' }}>{row.caption || 'No caption'}</span>
          <ActionButton
            icon={<Add />}
            tooltip={row.caption ? "Edit Caption" : "Add Caption"}
            iconOnly
            size="small"
            color="primary"
            onClick={() => openCaptionDialog(row)}
          />
        </Box>
      ),
      minWidth: 200,
    },
   {
  id: 'priority',
  label: 'Priority',
  render: (row) => (
    <input
      type="number"
      value={row.priority}
      min={1}
      style={{ width: 60 }}
      disabled={priorityLoading}
      onKeyDown={(e) => {
        if (e.key === '-' || e.key === 'e') {
          e.preventDefault(); // prevent negative sign and exponential input
        }
      }}
      onChange={(e) => {
        const value = parseInt(e.target.value, 10);
        if (value >= 1) {
          handlePriorityChange(row._id, value);
        }
      }}
    />
  ),
  minWidth: 100,
},

    // {
    //   id: 'thumbnail',
    //   label: 'Thumbnail Status',
    //   render: (row) => (
    //     <StatusChip
    //       status={thumbnailId === row._id ? 'active' : 'inactive'}
    //       label={thumbnailId === row._id ? 'Thumbnail' : 'Set as Thumbnail'}
    //       onClick={() => handleThumbnailToggle(row._id)}
    //     />
    //   ),
    //   minWidth: 150,
    // },
    {
      id: 'actions',
      label: 'Actions',
      render: (row) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
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
      onClick={() => navigate(`/add-gallery-image/${id}`)}
    >
      Add Images
    </ActionButton>
  ];

  const breadcrumbs = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Project Images', href: `/project-image/${id}` }
  ];

  if (loading) {
    return <Box>Loading...</Box>;
  }

  return (
    <Box>
      <PageHeader
        title="Project Images"
        subtitle="Manage project gallery images"
        breadcrumbs={breadcrumbs}
        actions={actions}
      />
      <DataTable
        columns={columns}
        data={images}
        searchPlaceholder="Search images..."
      />

      <ConfirmDialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
        onConfirm={handleDelete}
        title="Delete Image"
        message="Are you sure you want to delete this image? This action cannot be undone."
        severity="error"
      />

      {captionDialog.open && (
        <ConfirmDialog
          open={captionDialog.open}
          onClose={closeCaptionDialog}
          onConfirm={handleCaptionSubmit}
          title={captionDialog.image?.caption ? "Edit Caption" : "Add Caption"}
          message={
            <form onSubmit={handleCaptionSubmit}>
              <input
                type="text"
                value={captionDialog.caption}
                onChange={handleCaptionChange}
                placeholder="Enter caption for this image..."
                style={{ width: '100%', padding: 8, marginBottom: 8 }}
                required
              />
            </form>
          }
          severity="info"
          hideActions
        />
      )}
    </Box>
  );
}

export default ProjectImage;