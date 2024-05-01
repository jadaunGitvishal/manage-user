import React, { useState, useEffect } from "react";
import axios from "axios";
import "./form.css";

function Form({ editingUser, setEditingUser, onFormSubmit, onClose }) {
  // State for holding chart data
  const [chartData, setChartData] = useState([]);
  const [userRegistrations, setUserRegistrations] = useState([]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [userListKey, setUserListKey] = useState(0);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");

  // Fetch chart data when component mounts
  useEffect(() => {
    fetchChartData();
    fetchCountries();
    fetchUserRegistrations();
  }, [formSubmitted]);

  useEffect(() => {
    if (editingUser) {
      setSelectedCountry(editingUser.country_id);
      setSelectedState(editingUser.state_id);
      setSelectedDistrict(editingUser.district_id);
      setFormData({
        name: editingUser.name,
        mobile: editingUser.mobile,
        email: editingUser.email,
        address: editingUser.address,
        pincode: editingUser.pincode,
        date: editingUser.date,
      });

      // Fetch states based on the selected country
      fetchStates(editingUser.country_id);
      fetchDistricts(editingUser.state_id);
    }
  }, [editingUser]);

  const fetchCountries = async () => {
    try {
      const response = await axios.get("http://localhost:5000/countries");
      setCountries(response.data);
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  const fetchStates = async (countryId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/countries/${countryId}/states`
      );
      setStates(response.data);
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };

  const fetchDistricts = async (stateId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/states/${stateId}/districts`
      );
      setDistricts(response.data);
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  const handleCountryChange = async (e) => {
    const countryId = e.target.value;
    setSelectedCountry(countryId);
    setSelectedState(""); // Reset selected state when country changes
    setSelectedDistrict(""); // Reset selected district when country changes
    await fetchStates(countryId);
    setDistricts([]); // Reset districts when country changes
  };

  const handleStateChange = async (e) => {
    const stateId = e.target.value;
    setSelectedState(stateId);
    setSelectedDistrict(""); // Reset selected district when state changes
    await fetchDistricts(stateId);
  };

  const handleDistrictChange = (e) => {
    const districtId = e.target.value;
    setSelectedDistrict(districtId);
  };
  const handleClose = () => {
    // Close the form
    onClose();
  };

  // Function to fetch chart data from backend
  const fetchChartData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/chart-data");
      setChartData(response.data);
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  };

  // Function to fetch user registrations from backend
  const fetchUserRegistrations = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/user-registrations"
      );
      setUserRegistrations(response.data);
    } catch (error) {
      console.error("Error fetching user registrations:", error);
    }
  };

  // State for holding form data
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    address: "",
    pincode: "",
    date: "",
  });

  useEffect(() => {
    if (editingUser) {
      // Extract relevant properties from editingUser
      const {
        name,
        mobile,
        email,
        address,
        pincode,
        date,
        country_id,
        state_id,
        district_id,
      } = editingUser;
      // Update formData with relevant properties
      setFormData({
        name,
        mobile,
        email,
        address,
        pincode,
        date,
      });
      setSelectedCountry(country_id);
      setSelectedState(state_id);
      setSelectedDistrict(district_id);
    }
  }, [editingUser]);

  const handleChange = (e) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        country_id: selectedCountry,
        state_id: selectedState,
        district_id: selectedDistrict,
        country: selectedCountry,
        state: selectedState,
        district: selectedDistrict,
      };
      console.log("Form data before submission:", dataToSend);

      if (editingUser) {
        // If editingUser exists, perform a PUT request to update the user
        await axios.put(
          `http://localhost:5000/users/${editingUser.id}`,
          dataToSend
        );
        console.log("User data updated successfully!");
      } else {
        // If editingUser doesn't exist, perform a POST request to add a new user
        await axios.post("http://localhost:5000/submit-form", dataToSend);
        console.log("Form submitted successfully!");
      }

      // Reset form data
      setFormData({
        name: "",
        mobile: "",
        email: "",
        address: "",
        country_id: "",
        state_id: "",
        district_id: "",
        pincode: "",
        date: "",
      });

      // Trigger any additional form submission logic
      onFormSubmit();

      // Set form submission status to true
      setFormSubmitted(true);

      // Update userListKey to trigger re-rendering of user list
      setUserListKey((prevKey) => prevKey + 1);
      onFormSubmit();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  //handle clear
  const handleClear = () => {
    setFormData({
      name: "",
      mobile: "",
      email: "",
      address: "",
      country_id: "",
      state_id: "",
      district_id: "",
      pincode: "",
      date: "",
    });
  };

  return (
    <div className="form-container">
      <div className="form-detail">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              placeholder="Name"
              onChange={handleChange}
            />
          </div>
          <div className="form-row">
            <label htmlFor="mobile">Mobile:</label>
            <input
              type="text"
              id="mobile"
              name="mobile"
              value={formData.mobile}
              placeholder="Mobile"
              onChange={handleChange}
              pattern="[0-9]{10}"
              inputMode="numeric"
              title="Please enter a 10-digit mobile number"
              required
            />
          </div>
          <div className="form-row">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              placeholder="Email"
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-row">
            <label htmlFor="address">Address:</label>
            <input
              type="text"
              id="address"
              value={formData.address}
              placeholder="Address"
              name="address"
              onChange={handleChange}
            />
          </div>
          <div className="form-row">
            <label htmlFor="country">Country:</label>
            <select
              id="country"
              value={selectedCountry}
              onChange={handleCountryChange}
              required
            >
              <option value="">Select Country</option>
              {countries.map((country) => (
                <option key={country.country_id} value={country.country_id}>
                  {country.country_name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <label htmlFor="state">State:</label>
            <select
              id="state"
              value={selectedState}
              onChange={handleStateChange}
              required
            >
              <option value="">Select State</option>
              {states.map((state) => (
                <option key={state.state_id} value={state.state_id}>
                  {state.state_name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <label htmlFor="district">District:</label>
            <select
              id="district"
              value={selectedDistrict}
              onChange={handleDistrictChange}
              required
            >
              <option value="">Select District</option>
              {districts.map((district) => (
                <option key={district.district_id} value={district.district_id}>
                  {district.district_name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <label htmlFor="pincode">Pincode:</label>
            <input
              type="text"
              id="pincode"
              value={formData.pincode}
              placeholder="Pincode"
              name="pincode"
              onChange={handleChange}
              required
            />
          </div>
          {/* <div className="form-row">
            <label htmlFor="date">Date:</label>
            <input
              type="text"
              id="date"
              name="date"
              value={formData.date}
              placeholder="Date"
              onChange={handleChange}
              pattern="\d{4}-\d{2}-\d{2}"
              title="Date must be in the format YYYY-MM-DD"
              required
            />
          </div> */}
          <div className="button">
            <button
              type="submit"
              className={editingUser ? "update-button" : "submit-button"}
            >
              {editingUser ? "Update" : "Submit"}
            </button>
            <button
              className="clear-button"
              type="button"
              onClick={handleClear}
            >
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Form;
