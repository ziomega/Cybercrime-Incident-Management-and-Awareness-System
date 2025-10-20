// frontend/src/api/awareness.js
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/awareness";

// 🧠 Fetch all awareness resources (with optional flair filtering)
export async function fetchAwarenessResources(selectedFlair) {
  try {
    const url = selectedFlair
      ? `${API_URL}/resources/?flair=${encodeURIComponent(selectedFlair)}`
      : `${API_URL}/resources/`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching awareness resources:", error);
    throw error;
  }
}

// 📄 Fetch a single awareness resource by ID
export async function fetchAwarenessDetail(id) {
  try {
    const response = await axios.get(`${API_URL}/resources/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching awareness detail:", error);
    throw error;
  }
}
// frontend/src/api/awareness.js


// ✅ Handles both JSON and FormData automatically
export async function createAwarenessResource(formData, token) {
  try {
    const response = await axios.post(`${API_URL}/resources/`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type":
          formData instanceof FormData ? "multipart/form-data" : "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating awareness resource:", error.response?.data || error);
    throw error;
  }
}

// ✅ Flair fetching
export async function fetchFlairs() {
  try {
    const response = await axios.get(`${API_URL}/flairs/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching flairs:", error);
    throw error;
  }
}
