import React, { useEffect, useState } from "react";
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";
import { Visibility } from "@mui/icons-material";
import axiosInstance from "../utils/axiosInstnace";
import PageHeader from "../components/common/PageHeader";
import DataTable from "../components/common/DataTable";
import ActionButton from "../components/common/ActionButton";

function ContactQuery() {
  const [contactQuery, setContactQuery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const response = await axiosInstance.get("/contact-us");
        setContactQuery(response.data);
      } catch (error) {
        console.error("Error fetching contact queries:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQueries();
  }, []);

  const handleViewQuery = (query) => {
    setSelectedQuery(query);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedQuery(null);
  };

  const columns = [
    {
      id: 'index',
      label: '#',
      render: (row, index) => index + 1,
      minWidth: 60,
    },
    {
      id: 'name',
      label: 'Name',
      sortable: true,
      minWidth: 150,
    },
    {
      id: 'email',
      label: 'Email',
      sortable: true,
      minWidth: 200,
    },
    {
      id: 'mobile',
      label: 'Mobile',
      sortable: true,
      minWidth: 150,
    },
    {
      id: 'actions',
      label: 'Actions',
      render: (row) => (
        <ActionButton
          icon={<Visibility />}
          onClick={() => handleViewQuery(row)}
          size="small"
        >
          View Query
        </ActionButton>
      ),
      minWidth: 150,
    },
  ];

  if (loading) {
    return <Box>Loading...</Box>;
  }

  return (
    <Box>
      <PageHeader
        title="Contact Queries"
        subtitle="Manage contact form queries"
      />

      <DataTable
        columns={columns}
        data={contactQuery}
        searchPlaceholder="Search contact queries..."
      />

      <Dialog open={showModal} onClose={handleCloseModal} maxWidth="md" fullWidth>
        <DialogTitle>Query Details</DialogTitle>
        <DialogContent>
          {selectedQuery && (
            <Box sx={{ pt: 1 }}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Name:</strong> {selectedQuery.name}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Email:</strong> {selectedQuery.email}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Mobile:</strong> {selectedQuery.mobile}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Message:</strong>
              </Typography>
              <Typography variant="body2" sx={{ 
                p: 2, 
                backgroundColor: 'grey.100', 
                borderRadius: 1,
                whiteSpace: 'pre-wrap'
              }}>
                {selectedQuery.message}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ContactQuery;