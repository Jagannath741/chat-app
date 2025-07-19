import jwt from "jsonwebtoken";
import crypto from "crypto";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // MS
    httpOnly: true, // prevent XSS attacks cross-site scripting attacks
    sameSite: "strict", // CSRF attacks cross-site request forgery attacks
    secure: process.env.NODE_ENV !== "development",
  });

  return token;
};

/**
 * Generates a base64 encoded random string of the given byte size.
 * @param {number} size - Number of random bytes to generate.
 * @returns {string} Base64 encoded random string.
 */
export const generateRandomBase64String = (size) => {
  return crypto.randomBytes(size).toString('base64');
};
