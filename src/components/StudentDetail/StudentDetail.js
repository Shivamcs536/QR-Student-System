import React, { useEffect, useState } from "react";
import { API_BASE_URL } from '../../config';
import { useParams } from "react-router-dom";
import axios from "axios";

const StudentDetail = () => {
  const { registerNumber } = useParams();
  const [student, setStudent] = useState(null);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/students/${registerNumber}`)
      .then((response) => setStudent(response.data))
      .catch((error) => console.error("Error fetching student details:", error));
  }, [registerNumber]);

  if (!student) return <p>Loading...</p>;

  return (
    <div>
      <h2>{student.name}</h2>
      <p>Register No: {student.registerNumber}</p>
      <p>Email: {student.email}</p>
      <p>Phone: {student.phone}</p>
    </div>
  );
};

export default StudentDetail;
