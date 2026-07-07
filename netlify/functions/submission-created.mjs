// Netlify event-triggered function.
//
// Netlify automatically invokes a function named `submission-created` after a
// form submission is verified and stored. This one emails the guest a booking
// confirmation for the launch party via the Resend REST API.
//
// Deliberately dependency-free: it uses the global `fetch` available on the
// Netlify Node runtime, so the site keeps its zero-dependency, static footprint.
//
// Required env var:  RESEND_API_KEY
// Optional env vars: EVENT_FROM_EMAIL (default below — must be a Resend-verified
//                    sender), EVENT_REPLY_TO
//
// Only the `launch-party-rsvp` form triggers an email; other forms (e.g. the
// site's `quote` form) are ignored.

const SITE_URL = 'https://hausofballoons.ca';

const EVENT = {
  when: 'Sunday, July 12, 2026 · 3:00 – 10:00 PM',
  address: '701-107 East 3rd Street, Vancouver',
  theme: 'All white — please come dressed head to toe in white',
  music: 'Music by DJ DAFO',
  rooftop: 'Drinks & Vancouver sunset views',
  catering: 'Catering by Velvet Spoon',
  mapUrl:
    'https://www.google.com/maps/search/?api=1&query=701-107+East+3rd+Street+Vancouver',
  icsUrl: `${SITE_URL}/events/launch-party/launch-party.ics`,
  googleCalUrl:
    'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Haus+of+Balloons+Launch+Party&dates=20260712T220000Z/20260713T050000Z&details=An+all-white+rooftop+party.+Music+by+DJ+DAFO%2C+drinks%2C+Vancouver+sunset+views%2C+catering+by+Velvet+Spoon.&location=701-107+East+3rd+Street%2C+Vancouver',
};

export function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function guestCountLine(totalAttending) {
  const n = Number.parseInt(totalAttending, 10);
  if (!Number.isFinite(n) || n < 1) return '';
  return `We&rsquo;ve got you down for <strong>${n}</strong> ${n === 1 ? 'guest' : 'guests'}.`;
}

export function buildEmailHtml({ name, totalAttending } = {}) {
  const safeName = escapeHtml(name).trim() || 'there';
  const countLine = guestCountLine(totalAttending);

  const detail = (label, value) => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #f0e6e6;font-family:Georgia,'Times New Roman',serif;color:#ef6149;font-size:12px;letter-spacing:.08em;text-transform:uppercase;width:120px;vertical-align:top;">${label}</td>
      <td style="padding:10px 0;border-bottom:1px solid #f0e6e6;font-family:Helvetica,Arial,sans-serif;color:#3a2a2a;font-size:15px;line-height:1.5;">${value}</td>
    </tr>`;

  return `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#faf5f2;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#faf5f2;padding:28px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 18px 50px rgba(141,11,11,.08);">
        <tr><td style="height:6px;background:linear-gradient(90deg,#ef6149,#e6a338,#5cb89a,#ef9fb1,#b1a1dd);"></td></tr>
        <tr><td style="padding:36px 36px 8px;text-align:center;">
          <p style="margin:0 0 6px;font-family:Georgia,'Times New Roman',serif;font-style:italic;color:#8d0b0b;font-size:16px;">You&rsquo;re on the list</p>
          <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;color:#8d0b0b;font-size:30px;line-height:1.1;letter-spacing:.02em;">HAUS OF BALLOONS</h1>
          <p style="margin:10px 0 0;font-family:Helvetica,Arial,sans-serif;color:#ef6149;font-size:12px;font-weight:bold;letter-spacing:.16em;text-transform:uppercase;">Launch Party</p>
        </td></tr>
        <tr><td style="padding:20px 36px 4px;">
          <p style="margin:0 0 12px;font-family:Helvetica,Arial,sans-serif;color:#3a2a2a;font-size:16px;line-height:1.6;">Hi ${safeName},</p>
          <p style="margin:0 0 8px;font-family:Helvetica,Arial,sans-serif;color:#3a2a2a;font-size:16px;line-height:1.6;">Thank you for your RSVP — we can&rsquo;t wait to celebrate with you at our all-white rooftop party. ${countLine}</p>
        </td></tr>
        <tr><td style="padding:12px 36px 8px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${detail('When', EVENT.when)}
            ${detail('Where', `<a href="${EVENT.mapUrl}" style="color:#8d0b0b;">${EVENT.address}</a>`)}
            ${detail('Theme', EVENT.theme)}
            ${detail('Music', EVENT.music)}
            ${detail('Rooftop', EVENT.rooftop)}
            ${detail('Catering', EVENT.catering)}
          </table>
        </td></tr>
        <tr><td style="padding:24px 36px 8px;text-align:center;">
          <a href="${EVENT.icsUrl}" style="display:inline-block;margin:0 6px 10px;padding:13px 26px;background:#8d0b0b;color:#ffffff;font-family:Helvetica,Arial,sans-serif;font-size:15px;font-weight:bold;text-decoration:none;border-radius:999px;">Add to calendar</a>
          <a href="${EVENT.googleCalUrl}" style="display:inline-block;margin:0 6px 10px;padding:12px 24px;border:2px solid #8d0b0b;color:#8d0b0b;font-family:Helvetica,Arial,sans-serif;font-size:15px;font-weight:bold;text-decoration:none;border-radius:999px;">Google Calendar</a>
        </td></tr>
        <tr><td style="padding:16px 36px 36px;text-align:center;">
          <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-style:italic;color:#ef6149;font-size:15px;">See you on the rooftop.</p>
        </td></tr>
      </table>
      <p style="margin:16px 0 0;font-family:Helvetica,Arial,sans-serif;color:#a08c8c;font-size:11px;">701-107 East 3rd Street, Vancouver</p>
    </td></tr>
  </table>
</body>
</html>`;
}

export function buildEmailText({ name, totalAttending } = {}) {
  const safeName = (name || '').trim() || 'there';
  const n = Number.parseInt(totalAttending, 10);
  const count = Number.isFinite(n) && n >= 1 ? `\nWe've got you down for ${n} ${n === 1 ? 'guest' : 'guests'}.` : '';
  return `You're on the list — Haus of Balloons Launch Party

Hi ${safeName},

Thank you for your RSVP — we can't wait to celebrate with you at our all-white rooftop party.${count}

When:    ${EVENT.when}
Where:   ${EVENT.address}
Theme:   ${EVENT.theme}
Music:   ${EVENT.music}
Rooftop: ${EVENT.rooftop}
Catering: ${EVENT.catering}

Add to calendar: ${EVENT.icsUrl}
Google Calendar: ${EVENT.googleCalUrl}
Directions:      ${EVENT.mapUrl}

See you on the rooftop.
Haus of Balloons`;
}

export const handler = async (event) => {
  let submission;
  try {
    submission = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, body: 'Invalid submission payload' };
  }

  const payload = submission.payload || {};

  // Only the launch-party RSVP form should trigger a confirmation email.
  if (payload.form_name !== 'launch-party-rsvp') {
    return { statusCode: 200, body: 'Ignored — not the launch-party RSVP form' };
  }

  const data = payload.data || {};
  const to = String(data.email || '').trim();
  if (!to) {
    return { statusCode: 200, body: 'Skipped — no email in submission' };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('RESEND_API_KEY is not set — cannot send RSVP confirmation email.');
    return { statusCode: 200, body: 'Skipped — email not configured' };
  }

  const from = process.env.EVENT_FROM_EMAIL || 'Haus of Balloons <hello@hausofballoons.ca>';
  const replyTo = process.env.EVENT_REPLY_TO;

  const body = {
    from,
    to,
    subject: 'You’re on the list — Haus of Balloons Launch Party',
    html: buildEmailHtml({ name: data.name, totalAttending: data['total-attending'] }),
    text: buildEmailText({ name: data.name, totalAttending: data['total-attending'] }),
  };
  if (replyTo) body.reply_to = replyTo;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'haus-of-balloons/1.0',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error(`Resend API error ${res.status}: ${detail}`);
      return { statusCode: 200, body: 'Email send failed (logged)' };
    }

    return { statusCode: 200, body: 'Confirmation email sent' };
  } catch (err) {
    console.error('Failed to send RSVP confirmation email:', err);
    return { statusCode: 200, body: 'Email send errored (logged)' };
  }
};
