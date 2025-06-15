document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("theme-toggle");
  const applyTheme = (theme) => {
    document.body.dataset.theme = theme;
    if (themeToggle) {
      themeToggle.checked = theme === "dark";
    }
    window.dispatchEvent(
      new CustomEvent("themeChanged", { detail: { theme } })
    );
  };
  const currentTheme = localStorage.getItem("theme");
  if (currentTheme) {
    applyTheme(currentTheme);
  } else {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    applyTheme(prefersDark ? "dark" : "light");
  }
  if (themeToggle) {
    themeToggle.addEventListener("change", (e) => {
      const newTheme = e.target.checked ? "dark" : "light";
      localStorage.setItem("theme", newTheme);
      applyTheme(newTheme);
    });
  }
});
