import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { Visibility } from "@mui/icons-material";
import axiosInstance, { BASE_IMAGE_URL } from "../utils/axiosInstnace";
import PageHeader from "../components/common/PageHeader";
import DataTable from "../components/common/DataTable";
import ActionButton from "../components/common/ActionButton";

function CareerQuery() {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const response = await axiosInstance.get('/career-queries');
        const validQueries = response.data.filter(query => query.car_name && query.car_email && query.car_resume);
        setQueries(validQueries);
      } catch (error) {
        console.error('Error fetching career queries:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchQueries();
  }, []);

  const handleViewResume = (resumeUrl) => {
    window.open(resumeUrl, '_blank');
  };

  const columns = [
    {
      id: 'index',
      label: '#',
      render: (row, index) => index + 1,
      minWidth: 60,
    },
    {
      id: 'car_name',
      label: 'Name',
      sortable: true,
      minWidth: 150,
    },
    {
      id: 'car_email',
      label: 'Email',
      sortable: true,
      minWidth: 200,
    },
    {
      id: 'car_location',
      label: 'Job Location',
      sortable: true,
      minWidth: 150,
    },
    {
      id: 'actions',
      label: 'Actions',
      render: (row) => (
        <ActionButton
          icon={<Visibility />}
          onClick={() => handleViewResume(`${BASE_IMAGE_URL}/${row.car_resume}`)}
          size="small"
        >
          View Resume
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
        title="Career Queries"
        subtitle="Manage career application queries"
      />

      <DataTable
        columns={columns}
        data={queries}
        searchPlaceholder="Search career queries..."
      />
    </Box>
  );
}

export default CareerQuery;