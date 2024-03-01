import React, { useEffect, useState } from "react";
import UserData from "./components/UserData.jsx";

const API = "http://localhost:3000/api/customer-data";

const App = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(20);
  const [sortBy, setSortBy] = useState({ column: "", order: "" });

  const fetchUsers = async (url) => {
    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        setUsers(data);
      } else {
        const responseText = await res.text();
        console.error("Response is not in JSON format. Response content:", responseText);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchUsers(API);
  }, []);

  useEffect(() => {
    // Filter users based on search term
    const filteredData = users.filter(
      (user) =>
        user.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filteredData);

    // Sort users based on the selected column and order
    if (sortBy.column && sortBy.order) {
      const sortedData = filteredData.sort((a, b) => {
        const valueA = sortBy.column === "date" ? new Date(a.created_at) : a[sortBy.column];
        const valueB = sortBy.column === "date" ? new Date(b.created_at) : b[sortBy.column];

        if (sortBy.order === "asc") {
          return valueA > valueB ? 1 : -1;
        } else {
          return valueA < valueB ? 1 : -1;
        }
      });
      setFilteredUsers(sortedData);
    }
  }, [searchTerm, sortBy, users]);

  // Pagination
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredUsers.slice(indexOfFirstRecord, indexOfLastRecord);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <h1>Customer Data</h1>
      <div>
        <input
          type="text"
          placeholder="Search by name or location"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          onChange={(e) =>
            setSortBy({
              column: e.target.value,
              order: sortBy.column === e.target.value && sortBy.order === "asc" ? "desc" : "asc",
            })
          }
        >
          <option value="">Sort by</option>
          <option value="date">Date</option>
          <option value="time">Time</option>
        </select>
      </div>
      <table>
        <thead>
          <tr>
            <th>sno</th>
            <th>Customer_name</th>
            <th>age</th>
            <th>phone</th>
            <th>location</th>
            <th>date</th>
            <th>time</th>
          </tr>
        </thead>
        <tbody>
          <UserData users={currentRecords} />
        </tbody>
      </table>
      <div>
        <Pagination
          recordsPerPage={recordsPerPage}
          totalRecords={filteredUsers.length}
          paginate={paginate}
        />
      </div>
    </div>
  );
};

const Pagination = ({ recordsPerPage, totalRecords, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalRecords / recordsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul>
        {pageNumbers.map((number) => (
          <li key={number}>
            <button onClick={() => paginate(number)}>{number}</button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default App;
