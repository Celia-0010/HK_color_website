export default function Login() {
  const handleSubmit = (event) => {
    event.preventDefault();
    const password = event.target.password.value;
    document.cookie = `site_password=${password}; path=/; max-age=${60 * 60 * 24 * 365}`;
    window.location.href = '/'; // 登录成功后重定向到主页
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="password"
        type="password"
        placeholder="请输入密码"
        required
      />
      <button type="submit">登录</button>
    </form>
  );
}
