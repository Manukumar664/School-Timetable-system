import API from "./axios";
// 🔹 Get all students (for admin or teacher)
export const getAllStudents = async () => {
  const res = await API.get("/students");
  return res.data;
};
// 🔹 Get single student details by ID
export const getStudentById = async (id) => {
  const res = await API.get(`/students/${id}`);
  return res.data;
};
// 🔹 Create a new student (admin/teacher only)
export const createStudent = async (data) => {
  const res = await API.post("/students", data);
  return res.data;
};
// 🔹 Update student info (admin/teacher only)
export const updateStudent = async (id, data) => {
  const res = await API.put(`/students/${id}`, data);
  return res.data;
};
// 🔹 Delete student (admin only)
export const deleteStudent = async (id) => {
  const res = await API.delete(`/students/${id}`);
  return res.data;
};
