/**
 * ─────────────────────────────────────────────────────────────
 *  EVENT CONFIG
 *  Edit everything in this file to turn the template into your
 *  own invitation. Nothing else needs to change for basic use.
 * ─────────────────────────────────────────────────────────────
 */
window.EVENT = {

  // "single"  -> one name (birthday, graduation, solo event…)
  // "double"  -> two names joined by an ampersand (wedding, engagement…)
  mode: "single",

  eyebrow: "it's my birthday for turning two",
  names: {
    single: "Zayn Elhaziq Agatra",
    first: "Zayn",
    second: "Elhaziq"
  },

  // Shown under the name(s) on the cover panel.
  tagline: "Join me for a special day!",

  // ISO 8601, include timezone offset so the countdown is correct
  // for guests in other timezones.
  dateTimeISO: "2026-07-24T16:00:00+07:00",

  // Human-readable strings shown near the countdown (kept separate
  // from dateTimeISO so wording can differ from the raw date).
  dateLabel: "Saturday, 24 July 2026",
  timeLabel: "4:00 PM – Reception to follow",

  location: {
    venueName: "The Garden Pavilion",
    address: "Jl. Contoh Raya No. 88, Jakarta",
    // Google Maps -> Share -> Embed a map -> copy the src="" URL here.
    mapEmbedSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.99!2d106.8272!3d-6.1754!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMTAnMzEuNCJTIDEwNsKwNDknMzguMSJF!5e0!3m2!1sen!2sid!4v0",
    directionsUrl: "https://maps.google.com/?q=The+Garden+Pavilion+Jakarta"
  },

  // RSVP submissions are posted to a Google Apps Script Web App,
  // which appends each response as a row in a Google Sheet.
  // See /other/README.md + /other/apps-script.gs for setup.
  rsvpEndpoint: "https://script.google.com/macros/s/AKfycbziKVAZO-LRzPGpFcyEL-LGLD_6WsHqappu-TQrB6YEqANrHAqFcF16Xum1HvHo6JH5/exec",

  // 1–4 entries. The layout adapts automatically to however many
  // you provide (1 spans full width, 4 sit in a tidy row on desktop
  // and stack on mobile).
  gifts: [
    {
      type: "bank",
      label: "Bank Transfer",
      name: "Zayn Elhaziq Agatra",
      detail: "BCA · 123 456 7890",
      note: "Please include your name in the transfer note."
    },
    {
      type: "paypal",
      label: "PayPal",
      name: "Zayn Elhaziq Agatra",
      detail: "paypal.me/zaynelhaziq",
      note: ""
    },
    {
      type: "qr",
      label: "QRIS",
      name: "Scan to send a gift",
      detail: "img/gift-qr-placeholder.svg",
      note: "Works with any QRIS-supported e-wallet or banking app."
    },
    {
      type: "custom",
      label: "Registry",
      name: "Our wishlist",
      detail: "example.com/registry/zaynelhaziq",
      note: ""
    }
  ],

  thankYou: {
    heading: "Thank you",
    body: "Your presence means more to us than any gift. We can't wait to celebrate this day with you."
  },

  // Background music. Provide your own audio file in /img or a new
  // /audio folder — keep it short and loop-friendly, and please only
  // use music you have the rights to use.
  music: {
    src: "img/background-music.mp3",
    title: "Background music"
  },

  // Path to the video or photo that replaces the illustrated
  // character on the cover panel. Set kind to "video" or "image".
  feature: {
    kind: "image",
    src: "img/Ptr Junior.webp",
    alt: "Photo of the celebrating couple"
  },

  theme: {
    // "system" respects the guest's device setting on first visit;
    // they can still override it with the toggle.
    default: "system"
  }
};
