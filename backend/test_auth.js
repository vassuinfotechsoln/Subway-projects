const axios = require("axios");

const testAuth = async () => {
  try {
    console.log("Testing Registration...");
    const regRes = await axios.post("http://localhost:4000/api/auth/register", {
      name: "Test User",
      email: "test@example.com",
      password: "password123",
      role: "Admin",
    });
    console.log("Registration Success:", regRes.data.email);

    console.log("Testing Login...");
    const loginRes = await axios.post("http://localhost:4000/api/auth/login", {
      email: "test@example.com",
      password: "password123",
    });
    console.log(
      "Login Success:",
      loginRes.data.token ? "Token received" : "No token",
    );
  } catch (err) {
    console.error("Test Failed:", err.response?.data?.message || err.message);
  }
};

testAuth();
