/**
 * Cliniko booking widget — iframe sizing and booking-funnel tracking.
 *
 * The widget is a cross-origin iframe, so nothing inside it can be listened
 * to directly; its buttons are unreachable by design, not by misconfiguration.
 * What it does do is broadcast its current step to the parent page. Observed
 * message vocabulary (Cliniko does not document this, so it was measured):
 *
 *   cliniko-bookings-resize:<px>     content height changed
 *   cliniko-bookings-page:schedule   choosing practitioner / time
 *   cliniko-bookings-page:patient    entering their details
 *   cliniko-bookings-page:confirmed  booking complete
 *
 * "confirmed" is a genuinely completed appointment, so booking_completed is a
 * real conversion rather than a proxy. The two earlier steps are reported as
 * well so drop-off between them is visible.
 *
 * Replaces the inline handler that was duplicated across book.njk and
 * book-practitioner.njk.
 */
(function () {
  var iframe = document.getElementById("cliniko-25867357");
  if (!iframe) return;

  var CLINIKO_ORIGIN = /^https:\/\/([a-z0-9-]+\.)*cliniko\.com$/i;

  var STEP_EVENTS = {
    schedule: "booking_step_schedule",
    patient: "booking_step_patient",
    confirmed: "booking_completed",
  };

  var lastStep = null;

  function track(eventName) {
    // GA4 only loads on production builds, so gtag is absent on previews.
    if (typeof window.gtag !== "function") return;
    window.gtag("event", eventName, {
      event_category: "booking",
      page_path: window.location.pathname,
    });
  }

  window.addEventListener("message", function (e) {
    var data = e.data;
    if (typeof data !== "string") return;

    if (data.indexOf("cliniko-bookings-resize") === 0) {
      var height = Number(data.split(":")[1]);
      if (height) iframe.style.height = height + "px";
      return;
    }

    if (data.indexOf("cliniko-bookings-page") !== 0) return;
    iframe.scrollIntoView();

    // Origin is enforced only for the tracking path. A spoofed resize is
    // harmless, but a spoofed "confirmed" would corrupt conversion data and
    // could be used to burn ad budget, so that path requires the message to
    // have genuinely come from the widget.
    if (!CLINIKO_ORIGIN.test(e.origin)) return;

    var step = data.split(":")[1];
    // The widget re-emits its current step on resize and scroll, so only
    // count real transitions — while still allowing a second booking made
    // in the same page session to register.
    if (!step || step === lastStep) return;
    lastStep = step;

    if (STEP_EVENTS[step]) track(STEP_EVENTS[step]);
  });
})();
