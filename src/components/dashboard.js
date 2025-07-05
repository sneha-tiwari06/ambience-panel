import React, { useEffect, useState } from "react";
import { Grid, Box } from "@mui/material";
import { Work, People, QueryBuilder, ContactMail } from "@mui/icons-material";
import axiosInstance from "../utils/axiosInstnace";
import PageHeader from "./common/PageHeader";
import StatsCard from "./dashboard/StatsCard";

function Dashboard() {
  const [totalQueries, setTotalQueries] = useState(0);
  const [contactQueries, setContactQueries] = useState(0);

  useEffect(() => {
    const fetchTotalQueries = async () => {
      try {
        const response = await axiosInstance.get('/career-queries/count');
        setTotalQueries(response.data.count);
      } catch (error) {
        console.error('Error fetching total queries:', error);
      }
    };

    fetchTotalQueries();
  }, []);

  useEffect(() => {
    const TotalContactQueries = async () => {
      try {
        const response = await axiosInstance.get('/contact-us/count');
        setContactQueries(response.data.count);
      } catch (error) {
        console.error('Error fetching total queries:', error);
      }
    };

    TotalContactQueries();
  }, []);

  return (
    <Box>
      <PageHeader
        title="Dashboard"
        subtitle="Welcome to your admin dashboard"
      />
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Career Queries"
            value={totalQueries}
            icon={<QueryBuilder />}
            color="primary"
            trend="up"
            trendValue="+12%"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Contact Queries"
            value={contactQueries}
            icon={<ContactMail />}
            color="secondary"
            trend="up"
            trendValue="+8%"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Active Projects"
            value="24"
            icon={<Work />}
            color="success"
            trend="up"
            trendValue="+5%"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Clients"
            value="156"
            icon={<People />}
            color="warning"
            trend="down"
            trendValue="-2%"
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;