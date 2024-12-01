// utils.jsx
export function getTheme() {
    // Logic to get theme from state or localStorage
    return "light"; // Placeholder value
  }
  
  export function isIos() {
    // Basic iOS detection, may not be very reliable
    const userAgent = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(userAgent);
  }
  
  export function setTheme(theme) {
    // Logic to set theme to state or localStorage
    console.log("Setting theme to:", theme);
  }
  