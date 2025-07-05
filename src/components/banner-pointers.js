import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstnace";
import PageHeader from "./common/PageHeader";
import DataTable from "./common/DataTable";
import ActionButton from "./common/ActionButton";
import ConfirmDialog from "./common/ConfirmDialog";

function BannerPointerPage() {
  const [pointers, setPointers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPointers = async () => {
      try {
        const response = await axiosInstance.get("/pointers");
        setPointers(response.data);
      } catch (error) {
        console.error("Error fetching pointers data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPointers();
  }, []);

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/pointers/${deleteDialog.id}`);
      setPointers((prevPointers) => prevPointers.filter((pointer) => pointer._id !== deleteDialog.id));
      setDeleteDialog({ open: false, id: null });
    } catch (error) {
      console.error("Error deleting pointer:", error);
    }
  };

  const columns = [
    {
      id: 'index',
      label: '#',
      render: (row, index) => index + 1,
    },
    {
      id: 'pointer1',
      label: 'Pointer 1',
      sortable: true,
      minWidth: 150,
    },
    {
      id: 'pointer2',
      label: 'Pointer 2',
      sortable: true,
      minWidth: 150,
    },
    {
      id: 'pointer3',
      label: 'Pointer 3',
      sortable: true,
      minWidth: 150,
    },
    {
      id: 'pointer4',
      label: 'Pointer 4',
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
            onClick={() => navigate(`/edit-pointers/${row._id}`)}
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
      onClick={() => navigate("/add-banner-pointers")}
    >
      Add Pointers
    </ActionButton>
  ];

  const breadcrumbs = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Banner Images', href: '/banner-image' },
    { label: 'Banner Pointers', href: '/banner-pointers' }
  ];

  if (loading) {
    return <Box>Loading...</Box>;
  }

  return (
    <Box>
      <PageHeader
        title="Banner Pointers"
        subtitle="Manage banner pointer content"
        breadcrumbs={breadcrumbs}
        actions={actions}
      />

      <DataTable
        columns={columns}
        data={pointers}
        searchPlaceholder="Search pointers..."
      />

      <ConfirmDialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
        onConfirm={handleDelete}
        title="Delete Pointer"
        message="Are you sure you want to delete this pointer? This action cannot be undone."
        severity="error"
      />
    </Box>
  );
}

export default BannerPointerPage;