import { useEffect, useState } from "react";

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    // Only runs in the browser
    const savedTheme = typeof window !== "undefined" ? localStorage.getItem("theme") || "light" : "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const changeTheme = (e) => {
    setTheme(e.target.value);
    document.documentElement.setAttribute("data-theme", e.target.value);
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", e.target.value);
    }
  };

  return (
    <select
      onChange={changeTheme}
      className="select select-bordered w-full max-w-xs bg-[var(--sidebar-bg)]"
      value={theme}
    >
      <option value="light">Light</option>
      <option value="dark">Dark</option>
      <option value="cupcake">Cupcake</option>
      <option value="corporate">Corporate</option>
      <option value="synthwave">Synthwave</option>
      <option value="dracula">Dracula</option>
    </select>
  );
}