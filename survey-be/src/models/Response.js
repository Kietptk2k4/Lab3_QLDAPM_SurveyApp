import mongoose from "mongoose";
const AnswerSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, required:true },
  optionId:   { type: mongoose.Schema.Types.ObjectId }, // cho choice
  value:      { type:String } // cho TEXT_INPUT
}, { _id:false });

const ResponseSchema = new mongoose.Schema({
  surveyId: { type: mongoose.Schema.Types.ObjectId, ref:"Survey", required:true },
  participantInfo: {
    userId: { type: mongoose.Schema.Types.ObjectId, ref:"User" },
    ipAddress: String
  },
  answers: [AnswerSchema]
},{ timestamps: { createdAt: "submittedAt" } });

export default mongoose.model("Response", ResponseSchema);
