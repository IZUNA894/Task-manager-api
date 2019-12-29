
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);



module.exports.sendmail=function(reciever,subject,body){
const msg = {
  to: reciever,
  from: 'jainsanyamco@gmail.com',
  subject: subject,
  text: 'WhatsUP kiddo?',
  html: '<strong style="color:magenta;">' + body + '</strong>',
};
sgMail.send(msg);
//console.log(reciever);
};
