export async function onRequest(context) {
  const { request, next } = context;
  const auth = request.headers.get('Authorization');
  const password = '98591013';  // Set your password here

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
  if (decoded !== password) {
    return new Response('Invalid password', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Area"',
      },
    });
  }

  return await next();
}
