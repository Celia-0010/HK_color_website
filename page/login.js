// pages/login.js
export default function LoginPage() {
  const handleSubmit = (event) => {
    event.preventDefault();
    const password = event.target.password.value;
    document.cookie = `site_password=${password}; path=/; max-age=31536000`; // 设置 cookie 有效期为一年
    window.location.reload(); // 刷新页面以应用新的 cookie
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="password" type="password" placeholder="请输入密码" required />
      <button type="submit">登录</button>
    </form>
  );
}
