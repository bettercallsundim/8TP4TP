export function setDataToLocal(key, value) {
  if (localStorage.getItem(key)) {
    const prev = JSON.parse(localStorage.getItem(key));
    const newValue = {
      ...prev,
      ...value,
    };
    localStorage.setItem(key, JSON.stringify(newValue));
    return true;
  } else {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  }
  return false;
}
export function getDataFromLocal(key) {
  try {
    const data = JSON.parse(localStorage.getItem(key));
    return data;
  } catch (error) {
    localStorage.removeItem(key);
    return;
  }
}
export function removeDataFromLocal(key) {
  if (localStorage.getItem(key)) {
    localStorage.removeItem(key);
    return true;
  }


  return false;
}



