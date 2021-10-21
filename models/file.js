import mongoose from 'mongoose';

const { Schema } = mongoose;
const required = true;

const fileSchema = new Schema({
    originalname: { type: String, required },
    destination: { type: String , required },
    fieldname: { type: String, required },
    mimetype: { type: String, required },
    filename: { type: String, required },
    path: { type: String, required },
    size: { type: Number, required },
});

const File = mongoose.model('files', fileSchema);

export default File;

/*
copied from debugger (req.files[0]) --> right-click and copy value
{
  fieldname: "selectedFile",
  originalname: "FotoWasserturmSchlachthof.jpg",
  encoding: "7bit",
  mimetype: "image/jpeg",
  destination: "uploads/",
  filename: "c8f44ff6c3427cdd16fcab90e3ae1377",
  path: "uploads/c8f44ff6c3427cdd16fcab90e3ae1377",
  size: 126895,
}
*/