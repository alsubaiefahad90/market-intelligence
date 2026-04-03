"use client";

import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!input) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });

      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error?.message || "حدث خطأ في الاتصال بالسيرفر");

      const parsedData = JSON.parse(data.data);
      setResult(parsedData);
    } catch (err) {
      setError(err.message || "حدث خطأ أثناء معالجة البيانات، تأكد من استقرار الاتصال");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans" dir="rtl">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* قسم الإدخال */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">نظام الاستقراء والتحليل الاستراتيجي</h1>
          <textarea
            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none resize-none"
            rows="4"
            placeholder="أدخل القطاع أو السوق المستهدف للتحليل..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className={`mt-4 px-8 py-3 rounded-xl font-bold text-white transition-all ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-700 hover:bg-blue-800 shadow-md"
            }`}
          >
            {loading ? "جاري التحليل العميق واستخراج البيانات..." : "بدء التحليل واستخراج الفرص"}
          </button>
          
          {error && <div className="mt-4 p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl">{error}</div>}
        </div>

        {/* لوحة العرض (Dashboard) */}
        {result && (
          <div className="space-y-6 animate-fade-in-up">
            
            {/* بطاقة تحليل السوق */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-3 border-b pb-2">تحليل السوق</h2>
              <p className="text-gray-700 leading-relaxed text-justify">{result.market_analysis}</p>
            </div>

            {/* القطاعات والقرار */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h2 className="text-lg font-bold text-gray-800 mb-3">القطاعات المستهدفة</h2>
                <div className="flex flex-wrap gap-2">
                  {result.sectors.map((sector, i) => (
                    <span key={i} className="px-4 py-2 bg-blue-50 text-blue-800 border border-blue-100 rounded-lg text-sm font-semibold">
                      {sector}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h2 className="text-lg font-bold text-gray-800 mb-3">القرار الاستراتيجي</h2>
                <div className="flex flex-wrap gap-4">
                  <div className={`px-4 py-2 rounded-lg text-sm font-bold border ${result.decision.entry === 'yes' ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
                    توصية الدخول: {result.decision.entry === 'yes' ? 'إيجابية' : 'سلبية'}
                  </div>
                  <div className="px-4 py-2 bg-yellow-50 text-yellow-800 border border-yellow-200 rounded-lg text-sm font-bold">
                    مستوى المخاطرة: {result.decision.risk}
                  </div>
                  <div className="px-4 py-2 bg-purple-50 text-purple-800 border border-purple-200 rounded-lg text-sm font-bold">
                    المدى الزمني: {result.decision.term}
                  </div>
                </div>
              </div>
            </div>

            {/* شبكة الفرص */}
            <h2 className="text-xl font-bold text-gray-800 pt-4">الفرص الاستثمارية المكتشفة</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {result.opportunities.map((opp, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                  <h3 className="text-lg font-bold text-blue-800 mb-3">{opp.title}</h3>
                  <p className="text-gray-700 text-sm mb-4 leading-relaxed"><strong>مبررات الفرصة:</strong> {opp.reason}</p>
                  <div className="p-4 bg-slate-50 border-r-4 border-blue-700 rounded-l-lg">
                    <p className="text-sm text-slate-800"><strong>الميزة التنافسية الخفية:</strong> {opp.hidden_edge}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* خطة التنفيذ */}
            <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-md border border-slate-700">
              <h2 className="text-xl font-bold mb-3 border-b border-slate-700 pb-2">التوجيه التنفيذي</h2>
              <p className="leading-relaxed text-slate-200 text-justify">{result.execution}</p>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
