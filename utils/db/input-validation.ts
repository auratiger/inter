const isNotEmpty = (value: string) => value.trim() !== "";
const isEmail = (value: string) => value.includes("@");
const isString = (value: string) => typeof value === "string";

export function emailIsValid(email: string) {
  return isString(email) && isNotEmpty(email) && isEmail(email);
}

export function nameIsValid(name: string) {
  return isString(name) && isNotEmpty(name);
}
//TODO: should be a type
export function userDataIsValid(userData: { username: string; email: string }) {
  if (!userData) {
    // if the user object does not exists
    return "No user data entered";
  }
  if (!nameIsValid(userData.username)) {
    //names are invalid
    return "Invalid name entered";
  }
  if (!emailIsValid(userData.email)) {
    // email is invalid
    return "Invalid email entered";
  }
  // User data has valid inputs therefore an empty error string.
  return "";
}

export function passwordIsValid(password: string) {
  return isString(password) && isNotEmpty(password) && password.length > 6;
}
