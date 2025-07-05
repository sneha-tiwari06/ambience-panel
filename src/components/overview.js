import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstnace";
import PageHeader from "./common/PageHeader";
import DataTable from "./common/DataTable";
import ActionButton from "./common/ActionButton";
import ConfirmDialog from "./common/ConfirmDialog";

function Overview() {
  const [overviews, setOverviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOverviews = async () => {
      try {
        const response = await axiosInstance.get("/overview");
        setOverviews(response.data);
      } catch (err) {
        console.error("Error fetching overviews:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOverviews();
  }, []);

  const handleDelete = async () => {
    try {
      const response = await axiosInstance.delete(`/overview/${deleteDialog.id}`);
      if (response.status === 200) {
        setOverviews(overviews.filter((overview) => overview._id !== deleteDialog.id));
      }
      setDeleteDialog({ open: false, id: null });
    } catch (err) {
      console.error("Error deleting overview:", err);
    }
  };

  const columns = [
    {
      id: 'index',
      label: '#',
      render: (row, index) => index + 1,
    },
    {
      id: 'area',
      label: 'Area (sq ft)',
      sortable: true,
      minWidth: 120,
    },
    {
      id: 'deliveredProjects',
      label: 'Delivered Projects',
      sortable: true,
      minWidth: 150,
    },
    {
      id: 'happyCustomers',
      label: 'Happy Customers',
      sortable: true,
      minWidth: 150,
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
            onClick={() => navigate(`/edit-overview/${row._id}`)}
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
      onClick={() => navigate("/add-overview")}
    >
      Add Overview
    </ActionButton>
  ];

  if (loading) {
    return <Box>Loading...</Box>;
  }

  return (
    <Box>
      <PageHeader
        title="Overview"
        subtitle="Manage company overview statistics"
        actions={actions}
      />

      <DataTable
        columns={columns}
        data={overviews}
        searchPlaceholder="Search overviews..."
      />

      <ConfirmDialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
        onConfirm={handleDelete}
        title="Delete Overview"
        message="Are you sure you want to delete this overview? This action cannot be undone."
        severity="error"
      />
    </Box>
  );
}

export default Overview;