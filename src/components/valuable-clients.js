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

function ValuableClients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const navigate = useNavigate();

  const fetchClients = async () => {
    try {
      const response = await axiosInstance.get("/clients");
      setClients(response.data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/clients/${deleteDialog.id}`);
      setClients(clients.filter((client) => client._id !== deleteDialog.id));
      setDeleteDialog({ open: false, id: null });
    } catch (error) {
      console.error("Error deleting client:", error);
    }
  };

  const handleToggleActive = async (id) => {
    const clientToUpdate = clients.find((client) => client._id === id);
    if (!clientToUpdate) return;

    try {
      const updatedClient = {
        ...clientToUpdate,
        active: !clientToUpdate.active,
      };
      await axiosInstance.put(`/clients/${id}`, updatedClient);
      setClients(
        clients.map((client) => (client._id === id ? updatedClient : client))
      );
    } catch (error) {
      console.error("Error updating client status:", error);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

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
      id: 'createdAt',
      label: 'Created At',
      render: (row) => new Date(row.createdAt).toLocaleDateString(),
      sortable: true,
      minWidth: 120,
    },
    {
      id: 'status',
      label: 'Status',
      render: (row) => (
        <StatusChip
          status={row.active ? 'active' : 'inactive'}
          onClick={() => handleToggleActive(row._id)}
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
            onClick={() => navigate(`/edit-clients/${row._id}`)}
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
      onClick={() => navigate("/add-clients")}
    >
      Add Client
    </ActionButton>
  ];

  if (loading) {
    return <Box>Loading...</Box>;
  }

  return (
    <Box>
      <PageHeader
        title="Valuable Clients"
        subtitle="Manage your valuable clients"
        actions={actions}
      />

      <DataTable
        columns={columns}
        data={clients}
        searchPlaceholder="Search clients..."
      />

      <ConfirmDialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
        onConfirm={handleDelete}
        title="Delete Client"
        message="Are you sure you want to delete this client? This action cannot be undone."
        severity="error"
      />
    </Box>
  );
}

export default ValuableClients;