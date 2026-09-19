import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  // Set JWT as HTTP-only cookie if we wanted to, but we will send it in JSON response for standard REST.
  return token;
};

export default generateToken;
