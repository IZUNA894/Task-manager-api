
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(api_key);
const msg = {
  to: 'samyakjain40422@gmail.com',
  from: 'jainsanyamco@gmail.com',
  subject: 'Sending a test email',
  text: 'WhatsUP kiddo?',
  html: '<strong style="color:magenta;">Padh le kuch ...kahli na baith</strong>',
};
sgMail.send(msg);
