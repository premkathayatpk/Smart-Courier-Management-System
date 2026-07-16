import crypto from "crypto";

const generateTrackingNumber = () => {
  return `TRK-${Date.now()}-${crypto
    .randomBytes(3)
    .toString("hex")
    .toUpperCase()}`;
};

export default generateTrackingNumber;
