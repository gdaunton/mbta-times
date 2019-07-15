const BASE_URL = 'http://localhost:8000';
export const get = (path, params) => {
  return fetch(`${BASE_URL}${path}`, {
    method: 'GET',
  }).then(res => res.json());
};
