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

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const navigate = useNavigate();

  const fetchProjects = async () => {
    try {
      const response = await axiosInstance.get("/projects/");
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/projects/${deleteDialog.id}`);
      setProjects(projects.filter((project) => project._id !== deleteDialog.id));
      setDeleteDialog({ open: false, id: null });
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const handleEdit = (project) => {
    navigate("/add-projects", { state: { image: project, editMode: true } });
  };

  const toggleActiveStatus = async (project) => {
    try {
      await axiosInstance.put(`/projects/${project._id}`, {
        ...project,
        isActive: !project.isActive,
      });
      fetchProjects();
    } catch (error) {
      console.error("Error updating active status:", error);
    }
  };

  const toggleShowOnHomePage = async (project) => {
    try {
      await axiosInstance.put(`/projects/${project._id}`, {
        ...project,
        showOnHomePage: !project.showOnHomePage,
      });
      fetchProjects();
    } catch (error) {
      console.error("Error updating show on home status:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
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
          src={`${BASE_IMAGE_URL}/${row.imagePath}`}
          alt={row.altText}
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
      id: 'category',
      label: 'Category',
      sortable: true,
      minWidth: 150,
    },
    {
      id: 'locations',
      label: 'Location',
      render: (row) => row.locations.join(", "),
      sortable: true,
      minWidth: 150,
    },
    {
      id: 'status',
      label: 'Status',
      render: (row) => (
        <StatusChip
          status={row.isActive ? 'active' : 'inactive'}
          onClick={() => toggleActiveStatus(row)}
        />
      ),
      minWidth: 120,
    },
    {
      id: 'showOnHome',
      label: 'Show on Home',
      render: (row) => (
        <StatusChip
          status={row.showOnHomePage ? 'shown' : 'hidden'}
          label={row.showOnHomePage ? 'Shown' : 'Hidden'}
          onClick={() => toggleShowOnHomePage(row)}
        />
      ),
      minWidth: 140,
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
      minWidth: 120,
    },
  ];

  const actions = [
    <ActionButton
      key="add"
      icon={<Add />}
      onClick={() => navigate("/add-projects")}
    >
      Add Project
    </ActionButton>
  ];

  if (loading) {
    return <Box>Loading...</Box>;
  }

  return (
    <Box>
      <PageHeader
        title="Projects"
        subtitle="Manage your projects"
        actions={actions}
      />

      <DataTable
        columns={columns}
        data={projects}
        searchPlaceholder="Search projects..."
      />

      <ConfirmDialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
        onConfirm={handleDelete}
        title="Delete Project"
        message="Are you sure you want to delete this project? This action cannot be undone."
        severity="error"
      />
    </Box>
  );
}

export default Projects;