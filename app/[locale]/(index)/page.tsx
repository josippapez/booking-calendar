import { LoginPage } from '@modules/LoginPage/LoginPage';
import { countries } from '@modules/translations';

export default async function Login({
  searchParams,
  params: { locale },
}: {
  searchParams: Record<string, string>;
  params: {
    locale: keyof typeof countries;
  };
}) {
  return <LoginPage />;
}
