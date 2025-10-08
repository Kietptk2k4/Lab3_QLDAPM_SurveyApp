import mongoose from "mongoose";
const OptionSchema = new mongoose.Schema({
  text: String
},{ _id:true });

const QuestionSchema = new mongoose.Schema({
  text: String,
  questionType: { type:String, enum:["SINGLE_CHOICE","MULTIPLE_CHOICE","TEXT_INPUT"], required:true },
  options: [OptionSchema]
},{ _id:true });

const SurveySchema = new mongoose.Schema({
  title: String,
  description: String,
  status: { type:String, enum:["draft","published","closed"], default:"draft" },
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref:"User" },
  questions: [QuestionSchema],
},{ timestamps:true });

export default mongoose.model("Survey", SurveySchema);
