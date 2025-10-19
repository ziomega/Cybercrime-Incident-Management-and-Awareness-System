import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api/awareness";

// 🧠 Fetch all awareness resources (with optional flair filtering)
export async function fetchAwarenessResources(selectedFlair = null) {
  try {
    const url = selectedFlair
      ? `${API_BASE_URL}/resources/?flair=${encodeURIComponent(selectedFlair)}`
      : `${API_BASE_URL}/resources/`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching awareness resources:", error);
    throw error;
  }
}

// 🏷️ Fetch all available flairs
export async function fetchFlairs() {
  try {
    const response = await axios.get(`${API_BASE_URL}/flairs/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching flairs:", error);
    throw error;
  }
}

// 📄 Fetch a single awareness resource by ID
export async function fetchAwarenessDetail(id) {
  try {
    const response = await axios.get(`${API_BASE_URL}/resources/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching awareness resource ${id}:`, error);
    throw error;
  }
}

// 📝 Create a new awareness resource
export async function createAwarenessResource(formData) {
  try {
    const response = await axios.post(`${API_BASE_URL}/resources/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating awareness resource:", error);
    throw error;
  }
}
