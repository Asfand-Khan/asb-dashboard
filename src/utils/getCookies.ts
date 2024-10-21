export const getCookieValue = (name: string) => {
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
      const [key, value] = cookie.split('=');
      if (key === name) {
        return decodeURIComponent(value); // Decode the cookie value
      }
    }
    return null; // Return null if cookie is not found
  };