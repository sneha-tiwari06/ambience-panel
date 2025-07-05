import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstnace";
import PageHeader from "./common/PageHeader";
import DataTable from "./common/DataTable";
import ActionButton from "./common/ActionButton";
import ConfirmDialog from "./common/ConfirmDialog";

function Spotlights() {
  const [spotlight, setSpotlight] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSpotlights = async () => {
      try {
        const response = await axiosInstance.get("/spotlights");
        setSpotlight(response.data);
      } catch (error) {
        console.error("Error fetching spotlight data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSpotlights();
  }, []);

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/spotlights/${deleteDialog.id}`);
      setSpotlight((prevSpotlights) => prevSpotlights.filter((spotlight) => spotlight._id !== deleteDialog.id));
      setDeleteDialog({ open: false, id: null });
    } catch (error) {
      console.error("Error deleting Spotlight:", error);
    }
  };

  const columns = [
    {
      id: 'index',
      label: '#',
      render: (row, index) => index + 1,
    },
    {
      id: 'spotlightheading',
      label: 'Heading',
      sortable: true,
      minWidth: 200,
    },
    {
      id: 'spotlightcontent',
      label: 'Content',
      render: (row) => (
        <Box sx={{ maxWidth: 300 }}>
          {row.spotlightcontent.length > 100 ? `${row.spotlightcontent.substring(0, 100)}...` : row.spotlightcontent}
        </Box>
      ),
      sortable: true,
      minWidth: 300,
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
            onClick={() => navigate(`/edit-spotlights/${row._id}`)}
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
      onClick={() => navigate("/add-spotlight")}
    >
      Add Spotlight
    </ActionButton>
  ];

  if (loading) {
    return <Box>Loading...</Box>;
  }

  return (
    <Box>
      <PageHeader
        title="Spotlights"
        subtitle="Manage spotlight content"
        actions={actions}
      />

      <DataTable
        columns={columns}
        data={spotlight}
        searchPlaceholder="Search spotlights..."
      />

      <ConfirmDialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
        onConfirm={handleDelete}
        title="Delete Spotlight"
        message="Are you sure you want to delete this spotlight? This action cannot be undone."
        severity="error"
      />
    </Box>
  );
}

export default Spotlights;