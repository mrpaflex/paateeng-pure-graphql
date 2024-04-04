import * as crypto from 'crypto';

// Function to generate random token
const generateRandomToken = () => {
  return crypto.randomBytes(8).toString('hex');
};

// Function to generate expiration time
const generateTokenExpirationTime = () => {
  const expirationTime = new Date();
  expirationTime.setDate(expirationTime.getDate() + 1);
  return expirationTime;
};

export const sendOtp = {
  token: generateRandomToken(),
  tokenExpirationTime: generateTokenExpirationTime(),
};

export const resetPasswordOtp = async (user) => {
  const generateResetToken = crypto.randomBytes(7).toString('hex');
  const resetTokenExpiration = new Date();
  resetTokenExpiration.setHours(resetTokenExpiration.getHours() + 1);

  user.resetPasswordToken = generateResetToken;
  user.resetTokenExpiration = resetTokenExpiration;
  return user;
};
