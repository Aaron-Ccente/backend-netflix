export function validation(values) {
  let error = {};
  const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const password_pattern = /^(?=.*\d)(?=.*[A-Z])[a-zA-Z0-9]{8,}$/;

  if (!values.name || values.name.trim() === "") {
    error.name = "El nombre no debe estar vacio";
  } else {
    error.name = "";
  }

  if (!values.email || values.email.trim() === "") {
    error.email = "El correo electrónico no debe estar vacio";
  } else if (!email_pattern.test(values.email)) {
    error.email = "El formato del correo es invalido";
  } else {
    error.email = "";
  }

  if (!values.password || values.password.trim() === "") {
    error.password = "La contraseña no debe estar vacia";
  } else if (!password_pattern.test(values.password)) {
    // Password must contain at least one uppercase letter, one number, and be at least 8 characters
    error.password = "La contraseña debe contener al menos una letra, un numero y tener como mínimo 8 caracteres";
  } else {
    error.password = "";
  }

  return error;
}
