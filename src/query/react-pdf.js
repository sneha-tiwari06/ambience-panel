import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstnace";
function ContactQuery() {
  const [contactQuery, setContactQuery] = useState([]);
  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const response = await axiosInstance.get("/contact-us");
        console.log(response.data);
        setContactQuery(response.data);
      } catch (error) {
        console.error("Error fetching career queries:", error);
      }
    };
    fetchQueries();
  }, []);

  return (
    <div className="query-section">
      <div className="heading-query">
        <h2 className="section-heading">Contact Query</h2>
      </div>
      <div className="main-section">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Index</th>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {contactQuery.length > 0 ? (
              contactQuery.map((query, index) => (
                <tr key={query._id}>
                  <th scope="row">{index + 1}</th>
                  <td>{query.name}</td>
                  <td>{query.email}</td>
                  <td>
                    <button className="w-auto btn btn-primary">
                      View Full Query
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No queries available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default ContactQuery;
