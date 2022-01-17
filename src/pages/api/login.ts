import type { User } from './user';

import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '../../lib/session';
import { NextApiRequest, NextApiResponse } from 'next';

export default withIronSessionApiRoute(loginRoute, sessionOptions);

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
  const { username, password } = await req.body;

  const data = await fetch(process.env.NEXT_PUBLIC_BACKEND_SERVER + '/signin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });
  if (data.status != 200) {
    const error_message = await data.json();
    res.status(500).json({ message: error_message.error });
  }
  const user = { isLoggedIn: true } as User;
  req.session.user = user;
  await req.session.save();
  res.json(user);
}
