import React, { useState, useEffect } from "react";
import axios from "axios";
import "./UserList.css"; // Import the CSS file
import Form from "../../src/component/form";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import moment from "moment";

function UserList(props) {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/users");
      const formattedUsers = response.data.map((user) => {
        // console.log("Original date:", user.date);
        // Parse the date using moment and then format it
        const formattedDate = moment(user.date).format("YYYY-MM-DD");
        // console.log("Formatted date:", formattedDate);
        return {
          ...user,
          date: formattedDate,
        };
      });
      setUsers(formattedUsers);
      setFilteredUsers(formattedUsers);
      props.setUserList(formattedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleEditUser = (user) => {
    // Fetch additional user details including country, state, and district
    axios
      .get(`http://localhost:5000/users/${user.id}`)
      .then((response) => {
        // Combine the user data with additional details
        const editedUser = { ...user, ...response.data };
        setEditingUser(editedUser); // Set the editing user
        setIsEditFormOpen(true); // Open the edit form popup
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
      });
  };

  const handleFormClose = () => {
    setIsEditFormOpen(false); // Close the edit form popup
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/users/${userId}`);
      fetchUsers(); // Refresh the user list after deletion
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };
  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchTerm(searchTerm);
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm) ||
        user.mobile.includes(searchTerm) ||
        user.address.includes(searchTerm) ||
        user.email.includes(searchTerm)
    );
    setFilteredUsers(filtered);
  };

  // Function to filter users within the last 7 days
  const filterLast7DaysData = () => {
    const today = moment(); // Today's date
    const last7Days = moment().subtract(7, "days"); // Date 7 days ago
    return filteredUsers.filter((user) =>
      moment(user.date, "YYYY-MM-DD").isBetween(last7Days, today, null, "[]")
    );
  };

  const last7DaysUsers = filterLast7DaysData();

  return (
    <div className="user-list-container">
      <h2 className="user-list-header">User List</h2>
      <input
        type="text"
        placeholder="Search by name"
        value={searchTerm}
        onChange={handleSearch}
      />
      <div className="user-list">
        {/* Header */}
        <div className="user-row user-header">
          <div className="user-column">Name</div>
          <div className="user-column">Email</div>
          <div className="user-column">Mobile</div>
          <div className="user-column">Address</div>
          <div className="user-column">District</div>
          <div className="user-column">State</div>
          <div className="user-column">Country</div>
          <div className="user-column">Date</div>
          <div className="user-column">Actions</div>
        </div>
        {/* User Data */}
        {filteredUsers.map((user) => (
          <div className="user-row" key={user.id}>
            <div className="user-column" title={user.name}>
              {user.name}
            </div>
            <div className="user-column" title={user.email}>
              {user.email}
            </div>
            <div className="user-column" title={user.mobile}>
              {user.mobile}
            </div>
            <div className="user-column" title={user.address}>
              {user.address}
            </div>
            <div className="user-column" title={user.district_name}>
              {user.district_name}
            </div>
            <div className="user-column" title={user.state_name}>
              {user.state_name}
            </div>
            <div className="user-column" title={user.country_name}>
              {user.country_name}
            </div>
            <div className="user-column" title={user.date}>
              {user.date}
            </div>
            <div className="user-column">
              <button
                className="edit-button"
                onClick={() => handleEditUser(user)}
              >
                Edit
              </button>
              <button
                className="delete-button"
                onClick={() => handleDeleteUser(user.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Popup Form for Editing User */}
      <Dialog
        open={isEditFormOpen}
        onClose={handleFormClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          style: {
            borderRadius: 20,
            display: "flex",
            height: 630,
            padding: 15,
            width: 600,
            justifyContent: "center",
            boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.2)",
          },
        }}
      >
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <Form editingUser={editingUser} onClose={handleFormClose} />
        </DialogContent>
        <Button onClick={handleFormClose} color="primary">
          Close
        </Button>
      </Dialog>
    </div>
  );
}

export default UserList;
