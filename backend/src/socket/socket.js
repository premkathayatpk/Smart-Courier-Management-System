import { io } from "../server.js";

export const emitParcelLocation = (parcelId, location) => {
  io.to(parcelId).emit("parcel-location", location);
};
