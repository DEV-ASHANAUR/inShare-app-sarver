const nodemailer = require("nodemailer");

async function sendMail ({from,to,subject,text,html}){
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_USER, // generated ethereal user
            pass: process.env.MAIL_PASSWORD, // generated ethereal password
        },
    });

    let info = await transporter.sendMail({
                from : `inShare <${from}>`,
                to,
                subject,
                text,
                html
    });
    console.log(info);
}

module.exports = sendMail;