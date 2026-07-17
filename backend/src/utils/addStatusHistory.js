const addStatusHistory = (parcel, status, updatedBy, note = "") => {
  parcel.status = status;

  parcel.statusHistory.push({
    status,
    updatedBy,
    note,
    timestamp: new Date(),
  });
};

export default addStatusHistory;
