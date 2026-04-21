/*!
 * Bark & Fly × Derby Digital — Survey embed loader
 *
 * Creates a responsive, auto-resizing iframe for the Bark & Fly brand survey.
 * Drop-in safe for WordPress Custom HTML blocks (no jQuery, no deps).
 *
 * Usage:
 *   <div id="barknfly-survey"></div>
 *   <script src="https://YOUR-DEPLOY-URL/embed.js" defer></script>
 *
 * Or with options:
 *   <div id="my-survey"></div>
 *   <script
 *     src="https://YOUR-DEPLOY-URL/embed.js"
 *     data-target="#my-survey"
 *     data-src="https://YOUR-DEPLOY-URL/embed"
 *     data-min-height="900"
 *     defer
 *   ></script>
 */
(function () {
  "use strict";

  var current = document.currentScript;
  var defaultTarget = "#barknfly-survey";
  var defaultPath = "/embed";

  // Detect origin from this script's src so the iframe points back at the same host.
  var scriptSrc = current && current.src ? current.src : "";
  var origin = "";
  try {
    origin = new URL(scriptSrc).origin;
  } catch (e) {
    origin = "";
  }

  var targetSel = (current && current.dataset.target) || defaultTarget;
  var iframeSrc =
    (current && current.dataset.src) || (origin ? origin + defaultPath : defaultPath);
  var minHeight = parseInt(
    (current && current.dataset.minHeight) || "720",
    10
  );

  function mount() {
    var host = document.querySelector(targetSel);
    if (!host) {
      console.warn(
        "[barknfly] target not found:",
        targetSel,
        "— add <div id=\"barknfly-survey\"></div> above this script."
      );
      return;
    }

    // Clean up any previous iframe if this script re-runs (WP live preview etc.)
    host.innerHTML = "";
    host.style.position = host.style.position || "relative";
    host.style.width = "100%";
    host.style.maxWidth = host.style.maxWidth || "1100px";
    host.style.margin = host.style.margin || "0 auto";

    var iframe = document.createElement("iframe");
    iframe.src = iframeSrc;
    iframe.title = "Bark & Fly brand survey";
    iframe.loading = "lazy";
    iframe.allow = "clipboard-read; clipboard-write";
    iframe.setAttribute("scrolling", "no");
    iframe.style.cssText = [
      "width:100%",
      "border:0",
      "display:block",
      "background:transparent",
      "min-height:" + minHeight + "px",
      "transition:height .25s ease",
    ].join(";");
    iframe.height = String(minHeight);

    host.appendChild(iframe);

    var expectedOrigin = origin; // only trust messages from the iframe origin

    function onMessage(e) {
      if (expectedOrigin && e.origin !== expectedOrigin) return;
      var data = e.data || {};
      if (data && data.type === "barknfly:resize" && typeof data.height === "number") {
        var h = Math.max(minHeight, Math.ceil(data.height));
        iframe.style.height = h + "px";
        iframe.height = String(h);
      }
    }
    window.addEventListener("message", onMessage);

    // Nudge the iframe once it loads — covers the case where the resize
    // observer fires before the parent listener is attached.
    iframe.addEventListener("load", function () {
      try {
        iframe.contentWindow &&
          iframe.contentWindow.postMessage({ type: "barknfly:ping" }, "*");
      } catch (err) {
        /* cross-origin — ignored */
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
