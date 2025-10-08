import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../utils/api.js";

const emptyQ = () => ({ text: "", questionType: "SINGLE_CHOICE", options: [{ text: "Lựa chọn 1" }] });

export default function Builder() {
  const { id } = useParams();
  const nav = useNavigate();
  const [form, setForm] = useState({ title: "", description: "", status: "draft", questions: [emptyQ()] });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => { if (id) api.get(`/surveys/${id}`).then(r => setForm(r.data)); }, [id]);

  const updateForm = (path, value) => {
    setForm(currentForm => {
      const f = structuredClone(currentForm);
      let ref = f;
      for (let i = 0; i < path.length - 1; i++) ref = ref[path[i]];
      ref[path[path.length - 1]] = value;
      return f;
    });
  };

  const addQ = () => setForm(f => ({ ...f, questions: [...f.questions, emptyQ()] }));
  const delQ = (i) => setForm(f => ({ ...f, questions: f.questions.filter((_, idx) => idx !== i) }));

  const addOption = (qIndex) => {
    const currentOptions = form.questions[qIndex].options || [];
    const newOptions = [...currentOptions, { text: `Lựa chọn ${currentOptions.length + 1}` }];
    updateForm(['questions', qIndex, 'options'], newOptions);
  };
  const removeOption = (qIndex, oIndex) =>
    updateForm(['questions', qIndex, 'options'], form.questions[qIndex].options.filter((_, i) => i !== oIndex));

  const save = async () => {
    setIsSaving(true);
    try {
      if (id) { await api.put(`/surveys/${id}`, form); alert("Đã lưu thay đổi."); }
      else { const r = await api.post("/surveys", form); nav(`/builder/${r.data._id}`); }
    } catch (err) { alert("Có lỗi xảy ra khi lưu."); console.error(err); }
    finally { setIsSaving(false); }
  };

  const inputStyles = "w-full bg-white/60 border border-white/80 p-3 rounded-xl2 placeholder-ink/50 focus:outline-none focus:ring-2 focus:ring-brand-mint";
  const subtleCard = "card p-6";

  return (
    <div className="min-h-[80vh]">
      <div className="max-w-4xl mx-auto">
        <header className="flex flex-wrap gap-4 justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold">{id ? "Chỉnh sửa" : "Tạo mới"} khảo sát</h1>
            <Link to="/dashboard" className="text-sm underline text-ink/70 hover:text-ink">&larr; Quay lại Bảng điều khiển</Link>
          </div>
          <button onClick={save} className="btn btn-primary" disabled={isSaving}>
            {isSaving ? "Đang lưu..." : "Lưu khảo sát"}
          </button>
        </header>

        <div className="space-y-8">
          {/* Survey Details */}
          <div className={subtleCard + " space-y-4"}>
            <input className={inputStyles} placeholder="Tiêu đề khảo sát" value={form.title} onChange={e => updateForm(['title'], e.target.value)} />
            <textarea className={inputStyles} rows={3} placeholder="Mô tả chi tiết về khảo sát" value={form.description} onChange={e => updateForm(['description'], e.target.value)} />
            <select className={inputStyles} value={form.status} onChange={e => updateForm(['status'], e.target.value)}>
              <option value="draft">Bản nháp (Draft)</option>
              <option value="published">Công khai (Published)</option>
              <option value="closed">Đã đóng (Closed)</option>
            </select>
          </div>

          {/* Questions */}
          <div className="space-y-6">
            {form.questions.map((q, i) => (
              <div className={subtleCard} key={i}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-xl text-brand-mint">Câu hỏi {i + 1}</h3>
                  <button className="btn" onClick={() => delQ(i)}>Xóa câu</button>
                </div>

                <div className="space-y-4">
                  <input className={inputStyles} placeholder="Nội dung câu hỏi" value={q.text} onChange={e => updateForm(['questions', i, 'text'], e.target.value)} />
                  <select className={inputStyles} value={q.questionType} onChange={e => updateForm(['questions', i, 'questionType'], e.target.value)}>
                    <option value="SINGLE_CHOICE">Trắc nghiệm (1 đáp án)</option>
                    <option value="MULTIPLE_CHOICE">Trắc nghiệm (nhiều đáp án)</option>
                    <option value="TEXT_INPUT">Tự luận</option>
                  </select>

                  {q.questionType !== "TEXT_INPUT" && (
                    <div className="border-t border-white/60 pt-4 mt-2 space-y-3">
                      {(q.options || []).map((opt, oi) => (
                        <div key={oi} className="flex gap-2 items-center">
                          <input className={`${inputStyles} flex-1`} placeholder={`Lựa chọn ${oi + 1}`} value={opt.text} onChange={e => updateForm(['questions', i, 'options', oi, 'text'], e.target.value)} />
                          <button className="btn" onClick={() => removeOption(i, oi)}>X</button>
                        </div>
                      ))}
                      <button className="btn btn-outline" onClick={() => addOption(i)}>+ Thêm lựa chọn</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <button className="btn btn-primary" onClick={addQ}>+ Thêm câu hỏi</button>
          </div>
        </div>
      </div>
    </div>
  );
}
