export const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    if (token) {
      return true;
    } else if (!token) {
      return false;
    }
    else {
      console.log("error with authentication");
    }
  };
 