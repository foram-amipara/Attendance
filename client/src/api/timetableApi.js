import axiosInstance from "./axiosInstance";

export const getTimetable = async () => {
  const response = await axiosInstance.get("/timetable");
  return response.data;
};

export const updateTimetable = async (timetableData) => {
  const response = await axiosInstance.put("/timetable", timetableData);
  return response.data;
};

export const getOverrides = async (startDate, endDate) => {
  let url = "/timetable/override";
  const params = [];
  if (startDate) params.push(`stDate=${startDate}`);
  if (endDate) params.push(`endDate=${endDate}`);
  if (params.length > 0) url += `?${params.join("&")}`;

  const response = await axiosInstance.get(url);
  return response.data;
};

export const setOverride = async (overrideData) => {
  const response = await axiosInstance.post("/timetable/override", overrideData);
  return response.data;
};
