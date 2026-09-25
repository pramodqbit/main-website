/**
 * Inline `<head>` script, runs before first paint:
 * - adds `html.rv` so content can start hidden and be revealed (skipped for reduced motion and draft/preview)
 * - adds `html.qb-intro` on the home page for the first visit of the session (the intro overlay reads it)
 * - safety net: if MotionRuntime hasn't started within 6s (JS error, blocked bundle, very slow device), show everything
 */
const script = `(function(){try{var d=document.documentElement;
if(d.hasAttribute("data-draft"))return;
if(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches)return;
d.classList.add("rv");
var seen=null;try{seen=sessionStorage.getItem("qb-intro")}catch(e){}
if(location.pathname==="/"&&!seen)d.classList.add("qb-intro");
setTimeout(function(){if(!window.__qbMotion){d.classList.remove("rv","qb-intro")}},6000);
}catch(e){}})();`;

export function MotionScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}

export default MotionScript;
