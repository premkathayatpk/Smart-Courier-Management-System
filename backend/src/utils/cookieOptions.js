export const cookieOptions = {
  httpOnly: true,
  secure: false,
  // secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};
