// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme/theme";
import Login from "./auth/login";
import Register from "./auth/register";
import Dashboard from "./components/dashboard";
import ProtectedRoute from "./auth/protectedRoute";
import BannerImage from "./components/bannerImage";
import HomeBanner from "./components/homebanner";
import Projects from "./components/projects";
import AddProjects from "./components/add-projects";
import ValuableClients from "./components/valuable-clients";
import AddClients from "./components/add-clients";
import Overview from "./components/overview";
import AddOverview from "./components/add-overview";
import Awards from "./components/awards";
import AddAwards from "./components/add-awards";
import Testimonials from "./components/testimonials";
import AddTestimonials from "./components/add-testimonials";
import Careers from "./components/careers";
import AddCarrers from "./components/add-careers";
import Gallery from "./components/gallery";
import AddGallery from "./components/add-gallery";
import AddGalleryImage from "./components/add-gallery-image";
import ProjectImage from "./components/project-images";
import Spotlights from "./components/spotlight";
import AddSpotlight from "./components/add-spotlight";
import BannerPointers from "./components/bannerPointers";
import BannerPointerPage from "./components/banner-pointers";
import CareerQuery from "./query/career-query";
import ContactQuery from "./query/contact-query";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router basename="/admin-panel-new">
        <div className="App">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/banner-image" element={<HomeBanner />} />
              <Route path="/add-banner-image" element={<BannerImage />} />
              <Route path="/add-banner-pointers" element={<BannerPointers />} />
              <Route path="/banner-pointers" element={<BannerPointerPage />} />
              <Route path="/edit-pointers/:id" element={<BannerPointers />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/add-projects" element={<AddProjects />} />
              <Route path="/valuable-clients" element={<ValuableClients />} />
              <Route path="/add-clients" element={<AddClients />} />
              <Route path="/edit-clients/:id" element={<AddClients />} />
              <Route path="/overview" element={<Overview />} />
              <Route path="/add-overview" element={<AddOverview />} />
              <Route path="/edit-overview/:id" element={<AddOverview />} />
              <Route path="/awards" element={<Awards />} />
              <Route path="/add-awards" element={<AddAwards />} />
              <Route path="/edit-awards/:id" element={<AddAwards />} />
              <Route path="/testimonials" element={<Testimonials />} />
              <Route path="/add-testimonials" element={<AddTestimonials />} />
              <Route path="/edit-testimonials/:id" element={<AddTestimonials />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/add-careers" element={<AddCarrers />} />
              <Route path="/edit-career/:id" element={<AddCarrers />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/edit-gallery-image/:id" element={<AddGallery />} />
              <Route path="/add-gallery" element={<AddGallery />} />
              <Route path="/add-gallery-image/:id" element={<AddGalleryImage />} />
              <Route path="/edit-gallery/:id" element={<AddGallery />} />
              <Route path="/project-image/:id" element={<ProjectImage />} />
              <Route path="/spotlights" element={<Spotlights />} />
              <Route path="/add-spotlight" element={<AddSpotlight />} />
              <Route path="/edit-spotlights/:id" element={<AddSpotlight />} />
              <Route path="/career-query" element={<CareerQuery />} />
              <Route path="/contact-query" element={<ContactQuery />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;