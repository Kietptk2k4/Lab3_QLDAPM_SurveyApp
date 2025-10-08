import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../utils/api";

export default function TakeSurvey() {
  const { id } = useParams();
  const [survey, setSurvey] = useState(null);
  const [answers, setAnswers] = useState({});
  const [done, setDone] = useState(false);

  useEffect(() => { api.get(`/surveys/${id}`).then(r => setSurvey(r.data)); }, [id]);

  const submit = async () => {
    const payload = { answers: [] };
    survey.questions.forEach(q => {
      const answer = answers[q._id];
      if (q.questionType === "TEXT_INPUT") {
        if (answer) payload.answers.push({ questionId: q._id, value: answer });
      } else {
        if (Array.isArray(answer)) answer.forEach(optId => payload.answers.push({ questionId: q._id, optionId: optId }));
        else if (answer) payload.answers.push({ questionId: q._id, optionId: answer });
      }
    });
    await api.post(`/surveys/${id}/responses`, payload);
    setDone(true);
  };

  const handleOptionChange = (q, o, e) => {
    if (q.questionType === "SINGLE_CHOICE") setAnswers({ ...answers, [q._id]: o._id });
    else {
      const currentAnswers = new Set(answers[q._id] || []);
      e.target.checked ? currentAnswers.add(o._id) : currentAnswers.delete(o._id);
      setAnswers({ ...answers, [q._id]: Array.from(currentAnswers) });
    }
  };

  if (!survey) return <div className="min-h-[60vh] flex items-center justify-center">Loading survey...</div>;

  if (done) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="card w-full max-w-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-brand-mint mb-3">Cảm ơn bạn!</h2>
          <p className="text-ink/80 mb-6">Bạn đã hoàn thành khảo sát.</p>
          <Link to="/" className="btn btn-primary">Về trang chủ</Link>
        </div>
      </div>
    );
  }

  const inputStyles = "w-full bg-white/60 border border-white/80 p-3 rounded-xl2 placeholder-ink/50 focus:outline-none focus:ring-2 focus:ring-brand-mint";

  return (
    <div className="max-w-2xl mx-auto">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-extrabold">{survey.title}</h1>
        <p className="text-ink/70">{survey.description}</p>
      </header>

      <div className="space-y-6">
        {survey.questions.map(q => (
          <div key={q._id} className="card p-6">
            <div className="font-semibold text-xl text-brand-mint mb-4">{q.text}</div>
            {q.questionType === "TEXT_INPUT" ? (
              <textarea className={inputStyles} rows={4} value={answers[q._id] || ""} onChange={e => setAnswers({ ...answers, [q._id]: e.target.value })} />
            ) : (
              <div className="space-y-3">
                {q.options.map(o => (
                  <label key={o._id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/70 cursor-pointer transition-colors">
                    <input
                      type={q.questionType === "SINGLE_CHOICE" ? "radio" : "checkbox"}
                      name={q._id}
                      value={o._id}
                      checked={q.questionType === 'SINGLE_CHOICE' ? answers[q._id] === o._id : (answers[q._id] || []).includes(o._id)}
                      onChange={e => handleOptionChange(q, o, e)}
                      className="h-5 w-5 border border-ink/20 rounded-md checked:bg-brand-mint checked:border-transparent focus:outline-none"
                    />
                    <span className="flex-1">{o.text}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <button className="btn btn-primary px-12 text-lg" onClick={submit}>
          Nộp câu trả lời
        </button>
      </div>
    </div>
  );
}
