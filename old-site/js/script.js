/* ==========================================================================
   STEM Begins Here — shared site script

   No dependencies and no build step: every page loads this one file with a
   plain <script defer>. Each init() bails out early if its markup isn't on
   the current page, so the same file is safe everywhere.
   ========================================================================== */

(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.addEventListener("DOMContentLoaded", function () {
    initNav();
    initFaq();
    initReveal();
    initContactForm();
  });

  /* ------------------------------------------------------------------------
     Mobile navigation
     ------------------------------------------------------------------------ */

  function initNav() {
    var toggle = document.querySelector(".nav-toggle");
    var links = document.querySelector(".nav-links");
    if (!toggle || !links) return;

    function setOpen(open) {
      links.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    }

    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    // Escape closes the menu and returns focus to the button that opened it.
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });

    // A tap outside the open menu dismisses it.
    document.addEventListener("click", function (event) {
      if (toggle.getAttribute("aria-expanded") !== "true") return;
      if (links.contains(event.target) || toggle.contains(event.target)) return;
      setOpen(false);
    });

    // Reset state if the viewport grows past the mobile breakpoint while open.
    var desktop = window.matchMedia("(min-width: 761px)");
    addMediaListener(desktop, function (event) {
      if (event.matches) setOpen(false);
    });
  }

  /* ------------------------------------------------------------------------
     FAQ accordion

     Progressive enhancement: without JS every answer is already expanded and
     readable, so the content is never trapped behind a broken control.
     ------------------------------------------------------------------------ */

  function initFaq() {
    var triggers = document.querySelectorAll(".faq-trigger");
    if (!triggers.length) return;

    Array.prototype.forEach.call(triggers, function (trigger, index) {
      var panel = document.getElementById(trigger.getAttribute("aria-controls"));
      if (!panel) return;

      // Collapse everything but the first item now that JS is running.
      var startOpen = index === 0;
      trigger.setAttribute("aria-expanded", startOpen ? "true" : "false");
      panel.classList.toggle("is-open", startOpen);
      panel.hidden = false;

      trigger.addEventListener("click", function () {
        var isOpen = trigger.getAttribute("aria-expanded") === "true";
        trigger.setAttribute("aria-expanded", isOpen ? "false" : "true");
        panel.classList.toggle("is-open", !isOpen);
      });
    });
  }

  /* ------------------------------------------------------------------------
     Scroll reveal

     .reveal-ready is added by JS, so the hidden state only ever exists when
     we can guarantee something will remove it again.
     ------------------------------------------------------------------------ */

  function initReveal() {
    var targets = document.querySelectorAll(".js-reveal");
    if (!targets.length) return;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) return;

    Array.prototype.forEach.call(targets, function (el) {
      el.classList.add("reveal-ready");
    });

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );

    Array.prototype.forEach.call(targets, function (el) {
      observer.observe(el);
    });

    // Failsafe: if the observer never fires for any reason, reveal everything
    // rather than leaving sections permanently invisible.
    window.setTimeout(function () {
      Array.prototype.forEach.call(targets, function (el) {
        el.classList.add("is-visible");
      });
    }, 4000);

    // Printing mid-scroll would otherwise output blank sections.
    window.addEventListener("beforeprint", function () {
      Array.prototype.forEach.call(targets, function (el) {
        el.classList.add("is-visible");
      });
    });
  }

  /* ------------------------------------------------------------------------
     Contact form (Web3Forms)
     ------------------------------------------------------------------------ */

  function initContactForm() {
    var form = document.getElementById("contact-form");
    if (!form) return;

    var statusEl = document.getElementById("form-status");
    var submitBtn = form.querySelector('button[type="submit"]');
    var defaultLabel = submitBtn ? submitBtn.textContent : "Send message";

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      // Let the browser surface its own validation messages first.
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      setBusy(true);

      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form)
      })
        .then(function (response) {
          return response.json().then(function (data) {
            return { ok: response.ok, data: data };
          });
        })
        .then(function (result) {
          if (result.ok && result.data.success) {
            showStatus(
              true,
              "Thanks — your message is in. We read every one and usually reply within two school days."
            );
            form.reset();
          } else {
            showStatus(false, fallbackMessage());
          }
        })
        .catch(function () {
          showStatus(false, fallbackMessage());
        })
        .finally(function () {
          setBusy(false);
        });
    });

    function setBusy(busy) {
      if (!submitBtn) return;
      submitBtn.disabled = busy;
      submitBtn.textContent = busy ? "Sending…" : defaultLabel;
    }

    function fallbackMessage() {
      return (
        "That didn't send. Please try again, or email us directly at " +
        "stembeginshere@gmail.com and we'll pick it up from there."
      );
    }

    function showStatus(success, message) {
      if (!statusEl) return;
      statusEl.textContent = message;
      statusEl.classList.remove("is-success", "is-error");
      statusEl.classList.add("is-visible", success ? "is-success" : "is-error");
      statusEl.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "nearest"
      });
    }
  }

  /* ------------------------------------------------------------------------
     Helper: Safari < 14 only supports the deprecated addListener API.
     ------------------------------------------------------------------------ */

  function addMediaListener(query, handler) {
    if (typeof query.addEventListener === "function") {
      query.addEventListener("change", handler);
    } else if (typeof query.addListener === "function") {
      query.addListener(handler);
    }
  }
})();
