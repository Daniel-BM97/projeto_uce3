import bcrypt from "bcrypt";

export function convertHashPassword(password) {
  return bcrypt.hashSync(password, 10);
}

export function comparePassword(password, hashPassword) {
  return bcrypt.compareSync(password, hashPassword);
}