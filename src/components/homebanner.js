import React, { useEffect, useState } from "react";
import { Box, Avatar } from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axiosInstance, { BASE_IMAGE_URL } from "../utils/axiosInstnace";
import PageHeader from "./common/PageHeader";
import DataTable from "./common/DataTable";
import ActionButton from "./common/ActionButton";
import ConfirmDialog from "./common/ConfirmDialog";

function HomeBanner() {
  const [bannerImages, setBannerImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const navigate = useNavigate();

  const fetchBannerImages = async () => {
    try {
      const response = await axiosInstance.get("/banner-images/");
      setBannerImages(response.data);
    } catch (error) {
      console.error("Error fetching banner images:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/banner-images/${deleteDialog.id}`);
      setDeleteDialog({ open: false, id: null });
      fetchBannerImages();
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const handleEdit = (image) => {
    navigate("/add-banner-image", { state: { image } });
  };

  useEffect(() => {
    fetchBannerImages();
  }, []);

  const columns = [
    {
      id: 'index',
      label: '#',
      render: (row, index) => index + 1,
    },
    {
      id: 'image',
      label: 'Banner Image',
      render: (row) => (
        <Avatar
          src={`${BASE_IMAGE_URL}${row.imageUrl}`}
          alt={row.altText}
          sx={{ width: 80, height: 60 }}
          variant="rounded"
        />
      ),
    },
    {
      id: 'altText',
      label: 'Alt Text',
      sortable: true,
    },
    {
      id: 'bannerText',
      label: 'Banner Text',
      sortable: true,
    },
    {
      id: 'createdAt',
      label: 'Created At',
      render: (row) => new Date(row.createdAt).toLocaleDateString(),
      sortable: true,
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
            onClick={() => handleEdit(row)}
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
    },
  ];

  const actions = [
    <ActionButton
      key="add"
      icon={<Add />}
      onClick={() => navigate("/add-banner-image")}
    >
      Add Banner
    </ActionButton>
  ];

  if (loading) {
    return <Box>Loading...</Box>;
  }

  return (
    <Box>
      <PageHeader
        title="Banner Images"
        subtitle="Manage homepage banner images"
        actions={actions}
      />

      <DataTable
        columns={columns}
        data={bannerImages}
        searchPlaceholder="Search banners..."
      />

      <ConfirmDialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
        onConfirm={handleDelete}
        title="Delete Banner"
        message="Are you sure you want to delete this banner image? This action cannot be undone."
        severity="error"
      />
    </Box>
  );
}

export default HomeBanner;