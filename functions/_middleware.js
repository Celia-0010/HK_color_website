export async function onRequest({ request, next }) {
  const username = "lixiaoyu"; // 设置用户名
  const password = "98591013"; // 设置密码
  const auth = request.headers.get("Authorization");

  if (!auth) {
    return new Response("Unauthorized", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Protected Area"',
      },
    });
  }

  const [inputUsername, inputPassword] = atob(auth.split(" ")[1]).split(":");

  if (inputUsername === username && inputPassword === password) {
    return next();
  }

  return new Response("Unauthorized", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Protected Area"',
    },
  });
}
