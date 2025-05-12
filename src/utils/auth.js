// src/utils/auth.js
export const refreshToken = async () => {
  try {
    const response = await fetch('http://localhost:8000/api/token/refresh/', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      return true;
    }
    return false;
  } catch (error) {
    console.error('Token refresh failed:', error);
    return false;
  }
};