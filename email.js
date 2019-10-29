
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey("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");
const msg = {
  to: 'samyakjain40422@gmail.com',
  from: 'jainsanyamco@gmail.com',
  subject: 'Sending a test email',
  text: 'WhatsUP kiddo?',
  html: '<strong style="color:magenta;">Padh le kuch ...kahli na baith</strong>',
};
sgMail.send(msg);
