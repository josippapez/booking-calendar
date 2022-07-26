export default function isMobileView(): boolean {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  if (userAgent.includes("Mobile")) {
    return true;
  }
  return false;
}
