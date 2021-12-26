const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const File = require('../models/file');
const { v4:uuid4 } = require('uuid');

let storage = multer.diskStorage({
    destination: (req,file,cb) => cb(null,'uploads/'),
    filename: (req,file,cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

let upload = multer({
    storage,
    limits: {fileSize: 1000000 * 100},
}).single('myfile');
//file upload
router.post('/',(req,res)=>{
    //store file
    upload(req,res,async(err)=>{
        // Validate request
        if(!req.file){
            return res.json({error : "All fields are required."});
        }
        // if any error occurs
        if(err) {
            return res.status(500).json({error:err.message});
        }
        // store into database
        const file = new File({
            filename:req.file.filename,
            fileSize: req.file.size,
            uuid: uuid4(),
            path: req.file.path,
            size: req.file.size
        });

        const response = await file.save();

        return res.json({file: `${process.env.APP_BASE_URL}/files/${response.uuid}`});
        // "http://localhost:3000/files/c4654a06-fa86-4a4b-a52c-276ccc8f2063"
    });

});
//email send
router.post("/send",async(req,res)=>{
    const {uuid, emailTo, emailFrom } = req.body;
    //Validate request
    if(!uuid || !emailTo || !emailFrom){
        return res.status(422).send({error: 'All Fields are required.'});
    }
    // get data from database
    const file = await File.findOne({uuid:uuid});
    
    if(file.sender){
        return res.status(422).send({error: "Email Already Sent."});
    }

    file.sender = emailFrom;
    file.receiver = emailTo;

    const response = await file.save();
    //send email
    const sendMail = require('../services/emailServices');
    sendMail({
        from: emailFrom,
        to: emailTo,
        subject: 'inShare file sharing',
        text: `${emailFrom} shared a file with you`,
        html: require('../services/emailTemplate')({
            emailFrom: emailFrom,
            downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}`,
            size: parseInt(file.size/1000) + ' KB',
            expires: '24 hours'
        })
    });
    return res.send({success: true});

})
// exports
module.exports = router;