export function validation(values) {
  let error = {};
  const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const password_pattern = /^(?=.*\d)(?=.*[A-Z])[a-zA-Z0-9]{8,}$/;

  if (!values.name || values.name.trim() === "") {
    error.name = "Name should not be empty";
  } else {
    error.name = "";
  }

  if (!values.email || values.email.trim() === "") {
    error.email = "Email should not be empty";
  } else if (!email_pattern.test(values.email)) {
    error.email = "Email format is invalid";
  } else {
    error.email = "";
  }

  if (!values.password || values.password.trim() === "") {
    error.password = "Password should not be empty";
  } else if (!password_pattern.test(values.password)) {
    error.password = "Password must contain at least one uppercase letter, one number, and be at least 8 characters";
  } else {
    error.password = "";
  }

  return error;
}
