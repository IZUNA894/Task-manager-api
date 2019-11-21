
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey("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");



module.exports.sendmail=function(reciever,subject,body){
const msg = {
  to: reciever,
  from: 'jainsanyamco@gmail.com',
  subject: subject,
  text: 'WhatsUP kiddo?',
  html: '<strong style="color:magenta;">' + body + '</strong>',
};
sgMail.send(msg);
console.log("sended");
};
