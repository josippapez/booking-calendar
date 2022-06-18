export default function isMobileView() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  if (userAgent.includes('Mobile')) {
    return true;
  }
}
