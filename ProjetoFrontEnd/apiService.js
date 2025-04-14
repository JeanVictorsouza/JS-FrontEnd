const API_BASE_URL = 'http://localhost:3000';

export default {
  async get(resource) {
    const response = await fetch(`${API_BASE_URL}/${resource}`);
    return response.json();
  },

  async post(resource, data) {
    const response = await fetch(`${API_BASE_URL}/${resource}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  async put(resource, id, data) {
    const response = await fetch(`${API_BASE_URL}/${resource}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  async delete(resource, id) {
    const response = await fetch(`${API_BASE_URL}/${resource}/${id}`, {
      method: 'DELETE'
    });
    return response.json();
  },

  async login(email, senha) {
    const response = await fetch(`${API_BASE_URL}/usuarios?email=${email}&senha=${senha}`);
    const users = await response.json();
    return users[0] || null;
  }
};