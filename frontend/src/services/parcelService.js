import api from "./api";

export const getAllParcels = () => api.get("/parcel");

export const getParcelById = (id) => api.get(`/parcel/${id}`);

export const getDrivers = () => api.get("/admin/drivers");

export const createParcel = (data) => api.post("/parcel", data);

export const updateParcel = (id, data) => api.patch(`/parcel/${id}`, data);

export const deleteParcel = (id) => api.delete(`/parcel/${id}`);

export const assignDriver = (id, driverId) =>
  api.patch(`/parcel/${id}/assign-driver`, {
    driverId,
  });

export const updateParcelStatus = (id, status) =>
  api.patch(`/parcel/${id}/status`, {
    status,
  });
