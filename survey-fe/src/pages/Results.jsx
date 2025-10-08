import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../utils/api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const themeColors = { lightCyan: '#CCFFFF', turquoiseMint: '#33FFCC', ink:'#0D2438', cyan:'#99FFFF' };

export default function Results() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => { api.get(`/surveys/${id}/results`).then(r => setData(r.data)); }, [id]);
  if (!data) return <div className="min-h-[60vh] flex items-center justify-center">Loading results...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold mb-2">{data.surveyTitle}</h1>
        <div className="flex justify-between items-center">
          <p className="text-ink/70">Tổng lượt trả lời: {data.totalResponses}</p>
          <Link to="/dashboard" className="underline">&larr; Quay lại Bảng điều khiển</Link>
        </div>
      </header>

      <div className="space-y-6">
        {data.summary.map(block => (
          <div key={block.questionId} className="card p-6">
            <h3 className="font-bold text-xl text-brand-mint mb-4">{block.text}</h3>
            {block.questionType !== "TEXT_INPUT" ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={(block.results || []).map(r => ({ name: r.optionText, count: r.count }))} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={themeColors.lightCyan} strokeOpacity={0.2} />
                    <XAxis dataKey="name" stroke={themeColors.ink} tick={{ fill: themeColors.ink, fontSize: 12 }} />
                    <YAxis allowDecimals={false} stroke={themeColors.ink} tick={{ fill: themeColors.ink }} />
                    <Tooltip
                      cursor={{ fill: 'rgba(204,255,255,0.2)' }}
                      contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #e4b73cff', color: themeColors.ink }}
                      labelStyle={{ color: themeColors.cyan }}
                    />
                    <Bar dataKey="count" fill={themeColors.turquoiseMint} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <ul className="space-y-3 pl-2 max-h-96 overflow-y-auto">
                {(block.texts || []).map((t, idx) => (
                  <li key={idx} className="bg-white/70 p-3 rounded-lg border-l-4 border-brand-cyan/60 text-ink/90">
                    {t}
                  </li>
                ))}
                {(block.texts || []).length === 0 && <p className="text-ink/60">Không có câu trả lời nào.</p>}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
