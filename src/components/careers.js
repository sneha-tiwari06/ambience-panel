import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstnace";
import PageHeader from "./common/PageHeader";
import DataTable from "./common/DataTable";
import ActionButton from "./common/ActionButton";
import ConfirmDialog from "./common/ConfirmDialog";

function Careers() {
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        const response = await axiosInstance.get("/careers");
        setCareers(response.data);
      } catch (error) {
        console.error("Error fetching careers data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCareers();
  }, []);

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/careers/${deleteDialog.id}`);
      setCareers((prevCareers) => prevCareers.filter((career) => career._id !== deleteDialog.id));
      setDeleteDialog({ open: false, id: null });
    } catch (error) {
      console.error("Error deleting career:", error);
    }
  };

  const columns = [
    {
      id: 'index',
      label: '#',
      render: (row, index) => index + 1,
    },
    {
      id: 'role',
      label: 'Role',
      sortable: true,
      minWidth: 150,
    },
    {
      id: 'position',
      label: 'Position',
      sortable: true,
      minWidth: 150,
    },
    {
      id: 'experience',
      label: 'Experience',
      sortable: true,
      minWidth: 120,
    },
    {
      id: 'location',
      label: 'Location',
      sortable: true,
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
            onClick={() => navigate(`/edit-career/${row._id}`)}
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
      onClick={() => navigate("/add-careers")}
    >
      Add Career
    </ActionButton>
  ];

  if (loading) {
    return <Box>Loading...</Box>;
  }

  return (
    <Box>
      <PageHeader
        title="Careers"
        subtitle="Manage career opportunities"
        actions={actions}
      />

      <DataTable
        columns={columns}
        data={careers}
        searchPlaceholder="Search careers..."
      />

      <ConfirmDialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
        onConfirm={handleDelete}
        title="Delete Career"
        message="Are you sure you want to delete this career posting? This action cannot be undone."
        severity="error"
      />
    </Box>
  );
}

export default Careers;