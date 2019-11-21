
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey("");



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
