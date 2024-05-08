import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserContext = createContext({
  data: [],
  name: "",
  email: "",
  phone: "",
  setData: () => {},
  setName: () => {},
  setEmail: () => {},
  setPhone: () => {},
  AddtoTable: () => {},
  handleFormSubmit: () => {},
  handleUpdate: () => {},
  handleDelete: () => {},
});

const API = "https://jsonplaceholder.typicode.com/users";

export const useUserContext = () => useContext(UserContext);

export function UserContextProvider({ children }) {
  const [data, setData] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const AddtoTable = (newData) => {
    setData((prevData) => [...prevData, newData]);
  };
  let navigate = useNavigate();

  const handleFormSubmit = async (e, userData) => {
    e.preventDefault();
    try {
      const response = await axios.post(API, userData);
      console.log(response);
      AddtoTable(response.data);
      navigate("/ListPages");
      setName("");
      setEmail("");
      setPhone("");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleUpdate = async (id, updatedData) => {
    try {
      const response = await axios.put(`${API}/${id}`, updatedData);
      const updatedUser = response.data;
      setData((prevData) =>
        prevData.map((user) => (user.id === id ? updatedUser : user))
      );
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      setData((prevData) => prevData.filter((user) => user.id !== id));
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(API);
        console.log(response);
        setData(response.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchData();
  }, []);

  const value = {
    data,
    name,
    email,
    phone,
    setName,
    setData,
    AddtoTable,
    handleFormSubmit,
    setEmail,
    setPhone,
    handleUpdate,
    handleDelete,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
