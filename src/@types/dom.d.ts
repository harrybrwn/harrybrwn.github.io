interface Window {
  // Add theme to the window object
  theme: number;
  themeToggle: (btn: HTMLInputElement) => void;
  setTheme: (theme: number, btn: HTMLInputElement) => void;
}
