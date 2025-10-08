// import { Router } from "express";
// import Survey from "../models/Survey.js";
// import Response from "../models/Response.js";
// import { requireAuth } from "../middlewares/auth.js";
// const router = Router();

// // Create
// router.post("/", requireAuth, async (req,res)=>{
//   const survey = await Survey.create({ ...req.body, creatorId:req.user._id });
//   res.status(201).json(survey);
// });

// // Public list (published)
// router.get("/", async (req,res)=>{
//   const surveys = await Survey.find({ status:"published" }).select("title description status creatorId");
//   res.json(surveys);
// });

// // Mine
// router.get("/mine", requireAuth, async (req,res)=>{
//   const mine = await Survey.find({ creatorId:req.user._id });
//   res.json(mine);
// });

// // Detail
// router.get("/:id", async (req,res)=>{
//   const s = await Survey.findById(req.params.id);
//   if(!s) return res.status(404).json({message:"Not found"});
//   res.json(s);
// });

// // Update
// router.put("/:id", requireAuth, async (req,res)=>{
//   const s = await Survey.findById(req.params.id);
//   if(!s) return res.status(404).json({message:"Not found"});
//   if(String(s.creatorId) !== String(req.user._id)) return res.status(403).json({message:"Forbidden"});
//   Object.assign(s, req.body);
//   await s.save();
//   res.json(s);
// });

// // Delete
// router.delete("/:id", requireAuth, async (req,res)=>{
//   const s = await Survey.findById(req.params.id);
//   if(!s) return res.status(404).json({message:"Not found"});
//   if(String(s.creatorId) !== String(req.user._id)) return res.status(403).json({message:"Forbidden"});
//   await s.deleteOne();
//   res.status(204).send();
// });

// // Submit responses
// router.post("/:id/responses", requireAuth, async (req,res)=>{
//   const survey = await Survey.findById(req.params.id);
//   if(!survey) return res.status(404).json({message:"Survey not found"});
//   const dup = await Response.findOne({ surveyId:survey._id, "participantInfo.userId": req.user._id });
//   if(dup) return res.status(400).json({message:"Already answered"});
//   const resp = await Response.create({
//     surveyId: survey._id,
//     participantInfo: { userId:req.user._id },
//     answers: req.body.answers || []
//   });
//   res.status(201).json(resp);
// });

// // Results (aggregate)
// router.get("/:id/results", requireAuth, async (req,res)=>{
//   const survey = await Survey.findById(req.params.id);
//   if(!survey) return res.status(404).json({message:"Survey not found"});
//   if(String(survey.creatorId) !== String(req.user._id)) return res.status(403).json({message:"Forbidden"});

//   const responses = await Response.find({ surveyId: survey._id }).lean();
//   const total = responses.length;

//   const summary = survey.questions.map(q=>{
//     if(q.questionType === "TEXT_INPUT"){
//       const texts = responses.flatMap(r =>
//         r.answers.filter(a=>String(a.questionId)==String(q._id) && a.value).map(a=>a.value)
//       );
//       return { questionId:q._id, text:q.text, questionType:q.questionType, texts };
//     } else {
//       const counts = {};
//       q.options.forEach(o=>counts[o.text]=0);
//       responses.forEach(r=>{
//         r.answers.forEach(a=>{
//           if(String(a.questionId)===String(q._id) && a.optionId){
//             const opt = q.options.find(o=>String(o._id)===String(a.optionId));
//             if(opt) counts[opt.text] = (counts[opt.text]||0)+1;
//           }
//         });
//       });
//       const results = Object.entries(counts).map(([optionText,count])=>({ optionText, count }));
//       return { questionId:q._id, text:q.text, questionType:q.questionType, results };
//     }
//   });

//   res.json({ surveyTitle: survey.title, totalResponses: total, summary });
// });

// export default router;
