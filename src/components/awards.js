// src/components/Awards.js
import React, { useEffect, useState } from "react";
import { Box, Avatar } from "@mui/material";
import { Add, Edit, Delete, Star } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axiosInstance, { BASE_IMAGE_URL } from "../utils/axiosInstnace";
import PageHeader from "./common/PageHeader";
import DataTable from "./common/DataTable";
import ActionButton from "./common/ActionButton";
import StatusChip from "./common/StatusChip";
import ConfirmDialog from "./common/ConfirmDialog";

function Awards() {
  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAwards = async () => {
      try {
        const response = await axiosInstance.get("/awards");
        setAwards(response.data);
      } catch (error) {
        console.error("Error fetching awards:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAwards();
  }, []);

  const toggleStatus = async (id) => {
    try {
      const response = await axiosInstance.patch(`/awards/${id}/toggle-status`);
      if (response.status === 200) {
        setAwards((prevAwards) =>
          prevAwards.map((award) =>
            award._id === id ? { ...award, isActive: !award.isActive } : award
          )
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/awards/${deleteDialog.id}`);
      setAwards((prevAwards) => prevAwards.filter((award) => award._id !== deleteDialog.id));
      setDeleteDialog({ open: false, id: null });
    } catch (error) {
      console.error("Error deleting award:", error);
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
          src={`${BASE_IMAGE_URL}/${row.image}`}
          alt={row.altText}
          sx={{ width: 60, height: 60 }}
          variant="rounded"
        />
      ),
      minWidth: 100,
    },
    {
      id: 'altText',
      label: 'Name',
      sortable: true,
      minWidth: 200,
    },
    {
      id: 'status',
      label: 'Status',
      render: (row) => (
        <StatusChip
          status={row.isActive ? 'active' : 'inactive'}
          onClick={() => toggleStatus(row._id)}
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
            onClick={() => navigate(`/edit-awards/${row._id}`)}
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
      onClick={() => navigate("/add-awards")}
    >
      Add Award
    </ActionButton>
  ];

  if (loading) {
    return <Box>Loading...</Box>;
  }

  return (
    <Box>
      <PageHeader
        title="Awards & Certifications"
        subtitle="Manage your awards and certifications"
        actions={actions}
      />

      <DataTable
        columns={columns}
        data={awards}
        searchPlaceholder="Search awards..."
      />

      <ConfirmDialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
        onConfirm={handleDelete}
        title="Delete Award"
        message="Are you sure you want to delete this award? This action cannot be undone."
        severity="error"
      />
    </Box>
  );
}

export default Awards;