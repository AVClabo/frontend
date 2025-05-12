export const checkAuthStatus = async () => {
  try {
    const response = await fetch("http://localhost:8000/api/verify-token/", {
      method: "GET",
      credentials: "include",
    });
    
    return response.ok;
  } catch (error) {
    console.error("Auth check error:", error);
    return false;
  }
};