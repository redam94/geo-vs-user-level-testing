/*
 * Geo-Level vs User-Level Testing: site behaviour. No dependencies.
 * Load in <head> WITHOUT defer: it tags <html class="js"> immediately (so the
 * mobile menu starts collapsed without a flash) and runs the rest on DOM ready.
 *
 * - Mobile nav toggle (aria-expanded, Escape to close, closes on link click)
 * - Marks the current nav link with aria-current="page"
 * - Builds an in-page TOC from main h2[id] into any [data-toc] element
 * - Optional reveal-on-scroll for .reveal elements (skipped for reduced motion)
 */
(function () {
  "use strict";

  var root = document.documentElement;
  root.classList.remove("no-js");
  root.classList.add("js");

  var reduceMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function currentPage() {
    var path = window.location.pathname;
    var file = path.substring(path.lastIndexOf("/") + 1);
    return file === "" ? "index.html" : file;
  }

  function initNav() {
    var nav = document.querySelector(".nav");
    if (!nav) return;
    var toggle = nav.querySelector(".nav-toggle");
    var menu = nav.querySelector(".nav-menu");

    // Current page
    var here = currentPage();
    var links = nav.querySelectorAll(".nav-links a[href]");
    for (var i = 0; i < links.length; i++) {
      var href = links[i].getAttribute("href").split("#")[0].split("?")[0];
      var file = href.substring(href.lastIndexOf("/") + 1) || "index.html";
      if (file === here) {
        links[i].setAttribute("aria-current", "page");
      } else if (links[i].getAttribute("aria-current") === "page") {
        links[i].removeAttribute("aria-current");
      }
    }

    if (!toggle || !menu) return;

    function setOpen(open, returnFocus) {
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      if (!open && returnFocus) toggle.focus();
    }

    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true", false);
    });

    document.addEventListener("keydown", function (e) {
      if ((e.key === "Escape" || e.key === "Esc") && nav.classList.contains("is-open")) {
        setOpen(false, true);
      }
    });

    menu.addEventListener("click", function (e) {
      if (e.target.closest && e.target.closest("a")) setOpen(false, false);
    });

    document.addEventListener("click", function (e) {
      if (nav.classList.contains("is-open") && !nav.contains(e.target)) setOpen(false, false);
    });

    // Reset when the viewport grows past the mobile breakpoint
    if (window.matchMedia) {
      var mq = window.matchMedia("(min-width: 901px)");
      var onChange = function (ev) { if (ev.matches) setOpen(false, false); };
      if (mq.addEventListener) mq.addEventListener("change", onChange);
      else if (mq.addListener) mq.addListener(onChange);
    }
  }

  function initToc() {
    var targets = document.querySelectorAll("[data-toc]");
    if (!targets.length) return;
    var scope = document.querySelector("main") || document.body;
    var heads = scope.querySelectorAll("h2[id]");
    for (var t = 0; t < targets.length; t++) {
      var box = targets[t];
      if (!heads.length) {
        box.hidden = true;
        var band = box.closest && box.closest(".toc-band");
        if (band) band.hidden = true;
        continue;
      }
      if (!box.getAttribute("aria-label") && box.tagName === "NAV") {
        box.setAttribute("aria-label", "On this page");
      }
      var title = document.createElement("p");
      title.className = "toc-title";
      title.textContent = box.getAttribute("data-toc-title") || "On this page";
      var list = document.createElement("ol");
      for (var h = 0; h < heads.length; h++) {
        if (heads[h].hasAttribute("data-toc-skip")) continue;
        var li = document.createElement("li");
        var a = document.createElement("a");
        a.href = "#" + heads[h].id;
        a.textContent = heads[h].getAttribute("data-toc-label") || heads[h].textContent.trim().replace(/\.$/, "");
        li.appendChild(a);
        list.appendChild(li);
      }
      box.textContent = "";
      box.appendChild(title);
      box.appendChild(list);
    }

    // Highlight the section in view
    if (!("IntersectionObserver" in window)) return;
    var tocLinks = document.querySelectorAll("[data-toc] a");
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var id = entry.target.id;
          for (var k = 0; k < tocLinks.length; k++) {
            if (tocLinks[k].getAttribute("href") === "#" + id) {
              tocLinks[k].setAttribute("aria-current", "true");
            } else {
              tocLinks[k].removeAttribute("aria-current");
            }
          }
        });
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );
    for (var j = 0; j < heads.length; j++) io.observe(heads[j]);
  }

  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      for (var i = 0; i < items.length; i++) items[i].classList.add("is-visible");
      return;
    }
    var io = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );
    for (var j = 0; j < items.length; j++) io.observe(items[j]);
    // Safety net: never leave content hidden when printing
    window.addEventListener("beforeprint", function () {
      for (var k = 0; k < items.length; k++) items[k].classList.add("is-visible");
    });
  }

  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  ready(function () {
    initNav();
    initToc();
    initReveal();
  });
})();
