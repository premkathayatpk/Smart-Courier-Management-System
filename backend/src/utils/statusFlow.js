const statusFlow = {
  Pending: "Assigned",
  Assigned: "Picked Up",
  "Picked Up": "In Transit",
  "In Transit": "Delivered",
};

export default statusFlow;
