import API from "./axios";

// 🔹 Get all users (Admin only)
export const getAllUsers = async () => {
  const res = await API.get("/admin/users");
  return res.data;
};

// 🔹 Create new user (Admin only)
export const createUser = async (data) => {
  const res = await API.post("/admin/create-user", data);
  return res.data;
};

// 🔹 Update user info (Admin only)
export const updateUser = async (id, data) => {
  const res = await API.put(`/admin/user/${id}`, data);
  return res.data;
};

// 🔹 Delete user (Admin only)
export const deleteUser = async (id) => {
  const res = await API.delete(`/admin/user/${id}`);
  return res.data;
};
