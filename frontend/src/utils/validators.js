// frontend/src/utils/validators.js

export function validateEmail(e) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(e).toLowerCase());
}

// Password: 8-16 chars, at least one uppercase and one special character
export function validatePassword(pwd) {
  const re = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;
  return re.test(pwd);
}

// Name: min 20, max 60
export function validateName(name) {
  if (!name) return false;
  const len = name.trim().length;
  return len >= 20 && len <= 60;
}

// Address max 400
export function validateAddress(address) {
  if (address == null) return true;
  return address.length <= 400;
}
