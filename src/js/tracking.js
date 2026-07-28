/**
 * Conversion signals outside the booking widget.
 *
 * A clinic takes a lot of bookings by phone, and those are invisible to
 * analytics unless the tel: click is recorded — so phone_click is treated as
 * a conversion in its own right, not a soft signal.
 *
 * book_cta_click is funnel entry, not a conversion: it only means the patient
 * reached the booking widget, and cliniko-booking.js reports what happened
 * once they were there.
 */
(function () {
  function track(eventName, params) {
    if (typeof window.gtag !== "function") return;
    window.gtag("event", eventName, params || {});
  }

  document.addEventListener("click", function (e) {
    if (!e.target || typeof e.target.closest !== "function") return;

    var link = e.target.closest("a");
    if (!link) return;

    var href = link.getAttribute("href") || "";

    if (href.indexOf("tel:") === 0) {
      track("phone_click", { page_path: window.location.pathname });
      return;
    }

    // Matches /book/ and the per-practitioner pages beneath it, but not an
    // external URL that merely contains "/book/".
    if (/^\/book(\/|$)/.test(href)) {
      track("book_cta_click", {
        page_path: window.location.pathname,
        link_text: (link.textContent || "").trim().slice(0, 60),
      });
    }
  });
})();
