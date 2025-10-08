import Survey from '../models/Survey.js';
import mongoose from 'mongoose';

export async function createSurvey(req, res, next) {
  try {
    const { title, description, questions, status } = req.body || {};
    if (!title) return res.status(400).json({ message: 'Thiếu tiêu đề' });

    const safeQuestions = (questions || []).map(q => ({
      text: q.text,
      questionType: q.questionType,
      options: (q.options || []).map(o => ({ text: o.text }))
    }));

    const doc = await Survey.create({
      title, description, status: status || 'published',
      creatorId: req.user.sub,
      questions: safeQuestions
    });
    res.status(201).json(doc);
  } catch (e) { next(e); }
}

export async function listPublicSurveys(req, res, next) {
  try {
    const list = await Survey.find({ status: 'published' })
      .select('title description status creatorId createdAt');
    res.json(list);
  } catch (e) { next(e); }
}

export async function listMySurveys(req, res, next) {
  try {
    const list = await Survey.find({ creatorId: req.user.sub })
      .select('title description status createdAt');
    res.json(list);
  } catch (e) { next(e); }
}

export async function getSurvey(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(404).json({ message: 'Not found' });
    const doc = await Survey.findById(id);
    if (!doc) return res.status(404).json({ message: 'Not found' });
    res.json(doc);
  } catch (e) { next(e); }
}

export async function updateSurvey(req, res, next) {
  try {
    const { id } = req.params;
    const doc = await Survey.findById(id);
    if (!doc) return res.status(404).json({ message: 'Not found' });
    if (doc.creatorId.toString() !== req.user.sub) return res.status(403).json({ message: 'Forbidden' });

    const patch = {};
    ['title','description','status'].forEach(k => {
      if (req.body?.[k] !== undefined) patch[k] = req.body[k];
    });
    if (Array.isArray(req.body?.questions)) {
      patch.questions = req.body.questions.map(q => ({
        text: q.text,
        questionType: q.questionType,
        options: (q.options || []).map(o => ({ text: o.text }))
      }));
    }

    const updated = await Survey.findByIdAndUpdate(id, patch, { new: true });
    res.json(updated);
  } catch (e) { next(e); }
}

export async function deleteSurvey(req, res, next) {
  try {
    const { id } = req.params;
    const doc = await Survey.findById(id);
    if (!doc) return res.status(404).json({ message: 'Not found' });
    if (doc.creatorId.toString() !== req.user.sub) return res.status(403).json({ message: 'Forbidden' });

    await doc.deleteOne();
    res.status(204).end();
  } catch (e) { next(e); }
}
