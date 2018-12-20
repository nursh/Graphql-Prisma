const getFirstName = fullName => fullName.split(" ")[0];

const isValidPassword = password =>
  password.length >= 8 && !password.toLowerCase().includes("password");

export { getFirstName, isValidPassword };
