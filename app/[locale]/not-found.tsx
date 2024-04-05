import { Link } from '@/components/Link';

export default function NotFound() {
  return (
    <div>
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
      <Link href='/' variation='primary' size='small' className='w-fit'>
        Return Home
      </Link>
    </div>
  );
}
