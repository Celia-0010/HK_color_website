export async function onRequest(context) {
  const { request, next } = context;
  const auth = request.headers.get('Authorization');
  const [username, password] = ['lixiaoyu', '98591013'];

  if (!auth) {
    return new Response('Authentication required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Area"',
      },
    });
  }

  const [scheme, encoded] = auth.split(' ');
  if (scheme !== 'Basic') {
    return new Response('Invalid authentication', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Area"',
      },
    });
  }

  const decoded = atob(encoded);
  const [inputUsername, inputPassword] = decoded.split(':');

  if (inputUsername !== username || inputPassword !== password) {
    return new Response('Invalid credentials', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Area"',
      },
    });
  }

  return await next();
}
