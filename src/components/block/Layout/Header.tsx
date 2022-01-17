import type { NextPage } from 'next';
import Link from 'next/link';
import useUser from '../../../lib/useUser';
import { useRouter } from 'next/router';
import fetchJson from '../../../lib/fetchJson';

const Header: NextPage = () => {
  const { user, mutateUser } = useUser();
  const router = useRouter();
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <div className="flex justify-between items-center border-b-2 border-gray-100 py-6 md:justify-start md:space-x-10">
        <div className="flex justify-start lg:w-0 lg:flex-1">
          <span className="block text-slate-50 text-4xl">Motion</span>
        </div>
        <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
          {user?.isLoggedIn === false && (
            <Link href="/">
              <a className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-emerald-900 hover:bg-cyan-900">
                Sign in
              </a>
            </Link>
          )}
          {user?.isLoggedIn === true && (
            <Link href="/api/logout">
              <a
                className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-emerald-900 hover:bg-cyan-900"
                onClick={async (e) => {
                  e.preventDefault();
                  mutateUser(
                    await fetchJson('/api/logout', { method: 'POST' }),
                    false
                  );
                  router.push('/');
                }}
              >
                Sign out
              </a>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
export default Header;
