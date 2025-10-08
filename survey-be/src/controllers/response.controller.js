import mongoose from 'mongoose';
import Survey from '../models/Survey.js';
import Response from '../models/Response.js';

export async function submitResponses(req, res, next) {
  try {
    const { id } = req.params; // surveyId
    if (!mongoose.isValidObjectId(id)) return res.status(404).json({ message: 'Not found' });

    const survey = await Survey.findById(id);
    if (!survey) return res.status(404).json({ message: 'Survey không tồn tại' });
    if (survey.status !== 'published') return res.status(400).json({ message: 'Survey không mở' });

    // check duplicate
    const exists = await Response.findOne({ surveyId: id, userId: req.user.sub });
    if (exists) return res.status(400).json({ message: 'Bạn đã trả lời khảo sát này rồi' });

    // validate answers
    const answers = Array.isArray(req.body?.answers) ? req.body.answers : [];
    const validQIds = new Set(survey.questions.map(q => q.questionId.toString()));

    for (const a of answers) {
      if (!a?.questionId || !validQIds.has(a.questionId)) {
        return res.status(400).json({ message: 'Câu trả lời không hợp lệ' });
      }
      const q = survey.questions.find(q => q.questionId.toString() === a.questionId);
      if (q.questionType === 'SINGLE_CHOICE') {
        const has = q.options.some(o => o.optionId.toString() === a.optionId);
        if (!has) return res.status(400).json({ message: 'Option không hợp lệ' });
      } else if (q.questionType === 'TEXT_INPUT') {
        if (typeof a.value !== 'string') return res.status(400).json({ message: 'Giá trị text không hợp lệ' });
      }
    }

    const doc = await Response.create({
      surveyId: id,
      userId: req.user.sub,
      answers,
      participantInfo: { ipAddress: req.ip }
    });

    res.status(201).json(doc);
  } catch (e) { next(e); }
}

export async function getResults(req, res, next) {
  try {
    const { id } = req.params;
    const survey = await Survey.findById(id);
    if (!survey) return res.status(404).json({ message: 'Not found' });

    // chỉ chủ sở hữu xem
    if (survey.creatorId.toString() !== req.user.sub) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // tổng hợp cho SINGLE_CHOICE
    const summary = [];
    const totalResponses = await Response.countDocuments({ surveyId: id });

    for (const q of survey.questions) {
      if (q.questionType === 'SINGLE_CHOICE') {
        // đếm mỗi option
        const counts = await Response.aggregate([
          { $match: { surveyId: survey._id } },
          { $unwind: '$answers' },
          { $match: { 'answers.questionId': q.questionId } },
          { $group: { _id: '$answers.optionId', count: { $sum: 1 } } }
        ]);

        const map = new Map(counts.map(c => [c._id?.toString(), c.count]));
        const results = q.options.map(opt => ({
          optionText: opt.text,
          count: map.get(opt.optionId.toString()) || 0
        }));

        summary.push({
          questionId: q.questionId,
          text: q.text,
          questionType: q.questionType,
          results
        });
      } else {
        // TEXT_INPUT: liệt kê
        const texts = await Response.aggregate([
          { $match: { surveyId: survey._id } },
          { $unwind: '$answers' },
          { $match: { 'answers.questionId': q.questionId, 'answers.value': { $exists: true } } },
          { $project: { _id: 0, value: '$answers.value' } },
          { $limit: 500 } // tránh trả quá lớn
        ]);
        summary.push({
          questionId: q.questionId,
          text: q.text,
          questionType: q.questionType,
          results: texts // [{ value }]
        });
      }
    }

    res.json({
      surveyTitle: survey.title,
      totalResponses,
      summary
    });
  } catch (e) { next(e); }
}
