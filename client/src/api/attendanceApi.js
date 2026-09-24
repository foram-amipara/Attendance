import axiosInstance from "./axiosInstance";

export const markAttendance = async (attendanceData) => {
  const response = await axiosInstance.post("/attendance", attendanceData);
  return response.data;
};

export const getAttendance = async (subjectId, startDate, endDate) => {
  let url = `/attendance/${subjectId}`;
  const params = [];
  if (startDate) params.push(`stDate=${startDate}`);
  if (endDate) params.push(`endDate=${endDate}`);
  if (params.length > 0) url += `?${params.join("&")}`;

  const response = await axiosInstance.get(url);
  return response.data;
};

export const updateAttendance = async (id, attendanceData) => {
  const response = await axiosInstance.put(`/attendance/${id}`, attendanceData);
  return response.data;
};

export const deleteAttendance = async (id) => {
  const response = await axiosInstance.delete(`/attendance/${id}`);
  return response.data;
};