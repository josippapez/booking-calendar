export const Routes = {
  LOGIN: '/',
  GOOGLE_LOGIN: `${process.env.NEXT_PUBLIC_BE_API_URL}/authentication/google/login`,
  APARTMENTS: '/apartments',
  APARTMENT: '/apartments/[id]',
  INVOICE: '/invoice',
  GUESTS: '/guests',
  PUBLIC_APARTMENT: '/public/[id]',
};
