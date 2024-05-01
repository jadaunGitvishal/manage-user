// import React, { useState } from "react";
// import "../src/App.css";
// import Form from "./component/form";
// import BarChart from "./component/BarChart";
// import UserCount from "./component/userCount";
// import SearchBar from "./component/SearchBar";
// import UserList from "./component/UserList";
// import Dialog from "@material-ui/core/Dialog";
// import DialogContent from "@material-ui/core/DialogContent";
// import Button from "@material-ui/core/Button";
// import "bootstrap/dist/css/bootstrap.min.css";

// function App() {
//   const [activeTab, setActiveTab] = useState("userList");
//   const [editingUser, setEditingUser] = useState(null);
//   const [openDialog, setOpenDialog] = useState(false);

//   const handleTabChange = (tab) => {
//     setActiveTab(tab);
//     setOpenDialog(true);
//   };

//   const handleEditUser = (user) => {
//     setEditingUser(user);
//     setActiveTab("form");
//   };

//   const handleFormClose = () => {
//     setActiveTab("userList");
//     setOpenDialog(false); // Close dialog when form is closed
//   };

//   return (
//     <div className="App">
//       {/* Buttons to switch between tabs */}
//       <div className="mt-3">
//         <button
//           className="btn btn-primary me-2"
//           onClick={() => handleTabChange("form")}
//         >
//           Register Form
//         </button>
//         <button
//           className="btn btn-primary me-2"
//           onClick={() => handleTabChange("chart")}
//         >
//           BarChart
//         </button>
//         <button
//           className="btn btn-primary me-2"
//           onClick={() => handleTabChange("userCount")}
//         >
//           User Count
//         </button>
//       </div>
//       <UserList setEditingUser={handleEditUser} />
//       {/* Dialog for showing other components as popups */}
//       <Dialog
//         open={openDialog}
//         onClose={() => setOpenDialog(false)}
//         fullWidth
//         maxWidth="md"
//       >
//         <DialogContent>
//           {activeTab === "form" && (
//             <Form editingUser={editingUser} onClose={handleFormClose} />
//           )}
//           {activeTab === "chart" && <BarChart />}
//           {activeTab === "userCount" && <UserCount />}
//           {activeTab === "searchBar" && <SearchBar />}
//         </DialogContent>
//         <Button onClick={handleFormClose} color="primary">
//           Close
//         </Button>
//       </Dialog>
//     </div>
//   );
// }

// export default App;

import React, { useState } from "react";
import "../src/App.css";
import Form from "./component/form";
import BarChart from "./component/BarChart";
import UserCount from "./component/userCount";
import SearchBar from "./component/SearchBar";
import UserList from "./component/UserList";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "@material-ui/core/Button";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [activeTab, setActiveTab] = useState("userList");
  const [editingUser, setEditingUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [userListKey, setUserListKey] = useState(0); // State variable to trigger re-render of UserList

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setOpenDialog(true); // Open dialog when changing tabs
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setActiveTab("form");
  };

  const handleFormClose = () => {
    setActiveTab("userList");
    setOpenDialog(false); // Close dialog when form is closed
  };

  const handleFormSubmit = () => {
    // Update userListKey to trigger re-render of UserList
    setUserListKey((prevKey) => prevKey + 1);
  };
  // Define styles for different components
  const formDialogStyle = {
    borderRadius: 20,
    display: "flex",
    height: 600,
    padding: 15,
    width: 600,
    justifyContent: "center",
    boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.2)",
  };

  const chartDialogStyle = {
    borderRadius: 20,
    display: "flex",
    height: 450,
    padding: 15,
    width: 700,
    justifyContent: "center",
    boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.2)",
  };

  const userCountDialogStyle = {
    borderRadius: 20,
    display: "flex",
    height: 400,
    padding: 15,
    width: 400,
    justifyContent: "center",
    boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.2)",
  };

  return (
    <div className="App">
      {/* Buttons to switch between tabs */}
      <div className="mt-3">
        <button
          className="btn btn-primary me-2"
          onClick={() => handleTabChange("form")}
        >
          Register Form
        </button>
        <button
          className="btn btn-primary me-2"
          onClick={() => handleTabChange("chart")}
        >
          BarChart
        </button>
        <button
          className="btn btn-primary me-2"
          onClick={() => handleTabChange("userCount")}
        >
          User Count
        </button>
      </div>
      <UserList setEditingUser={handleEditUser} key={userListKey} />
      {/* Dialog for showing other components as popups */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        fullWidth
        maxWidth="md"
        // Apply custom styles to the dialog
        PaperProps={{
          style:
            activeTab === "form"
              ? formDialogStyle
              : activeTab === "chart"
              ? chartDialogStyle
              : userCountDialogStyle,
        }}
      >
        <DialogContent>
          {activeTab === "form" && (
            <Form
              editingUser={editingUser}
              onClose={handleFormClose}
              onFormSubmit={handleFormSubmit}
            />
          )}
          {activeTab === "chart" && <BarChart />}
          {activeTab === "userCount" && <UserCount />}
          {activeTab === "searchBar" && <SearchBar />}
        </DialogContent>
        {/* Close button */}
        <Button onClick={handleFormClose} color="primary">
          Close
        </Button>
      </Dialog>
    </div>
  );
}

export default App;
