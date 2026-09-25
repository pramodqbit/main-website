const script = `try{var t=localStorage.getItem("qbitlog-theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

/** Inline script for `<head>`: applies the stored theme before first paint. */
export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}

export default ThemeScript;
