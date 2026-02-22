import { useEffect, useState } from "react";

function App() {
  // --- State ---
  const [water, setWater] = useState(0);
  const [electrolytes, setElectrolytes] = useState(0);
  const [resetHour, setResetHour] = useState(6);
  const [goal, setGoal] = useState(3000);
  const [dayKey, setDayKey] = useState("");
  const [showSheet, setShowSheet] = useState(false);
  // --- Derived ---
  const total = water + electrolytes;
  const progress = Math.min(total / goal, 1);
  const circumference = 2 * Math.PI * 100;

  const electrolyteRatio = total > 0 ? electrolytes / total : 0;
  const electrolyteLow = total > 1000 && electrolyteRatio < 0.25;

  // --- Helpers ---
  const calculateDayKey = (hour: number) => {
    const now = new Date();
    const adjusted = new Date(now);
    adjusted.setHours(adjusted.getHours() - hour);
    return adjusted.toISOString().split("T")[0];
  };

  // --- Load reset hour ---
  useEffect(() => {
    const savedReset = localStorage.getItem("aquamelis-reset-hour");
    if (savedReset) setResetHour(parseInt(savedReset));
  }, []);

  // --- When reset hour changes ---
  useEffect(() => {
    const key = calculateDayKey(resetHour);
    setDayKey(key);
    localStorage.setItem("aquamelis-reset-hour", resetHour.toString());
  }, [resetHour]);

  // --- When day changes, load values ---
  useEffect(() => {
    if (!dayKey) return;

    const saved = localStorage.getItem(`aquamelis-${dayKey}`);

    if (saved) {
      const parsed = JSON.parse(saved);
      setWater(parsed.water || 0);
      setElectrolytes(parsed.electrolytes || 0);
    } else {
      setWater(0);
      setElectrolytes(0);
    }

  }, [dayKey]);

  // --- Save values ---
  useEffect(() => {
    if (!dayKey) return;

    localStorage.setItem(
      `aquamelis-${dayKey}`,
      JSON.stringify({ water, electrolytes })
    );

  }, [water, electrolytes, dayKey]);

  // --- Actions ---
  const addWater = (amount: number) => {
    setWater(prev => prev + amount);
  };

  const addElectrolyte = (amount: number) => {
    setElectrolytes(prev => prev + amount);
  };

  const resetDay = () => {
    setWater(0);
    setElectrolytes(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#AAE2DF] via-[#88CACC] to-[#66B2B7] text-[#0B2E33]">

      {/* Header */}
      <header className="px-6 pt-10 pb-6 text-center">
        <h1 className="text-5xl font-semibold tracking-wide">
          Aquamelis
        </h1>
        <p className="mt-3 text-sm opacity-70 tracking-widest">
          steady under load
        </p>
      </header>

      <main className="px-6 pb-12 space-y-10">

        {/* Progress Ring */}
        <section className="flex justify-center">
          <div className="relative w-56 h-56">

            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="112"
                cy="112"
                r="100"
                stroke="rgba(0,0,0,0.1)"
                strokeWidth="12"
                fill="none"
              />
              <circle
                cx="112"
                cy="112"
                r="100"
                stroke={electrolyteLow ? "#F4B860" : "#0B3E63"}
                strokeWidth="12"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - progress * circumference}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-medium">
                {total} ml
              </span>
              <span className="text-xs opacity-70 mt-1">
                goal {goal} ml
              </span>
              <span className="text-xs opacity-60 mt-2">
                Water: {water} ml
              </span>
              <span className="text-xs opacity-60">
                Electrolytes: {electrolytes} ml
              </span>
            </div>

          </div>
        </section>

        {/* Add Buttons */}
        <section className="space-y-4">

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => addWater(150)}
              className="py-4 rounded-2xl bg-white/40 active:scale-95 transition"
            >
              +150 ml Water
            </button>

            <button
              onClick={() => addWater(250)}
              className="py-4 rounded-2xl bg-white/40 active:scale-95 transition"
            >
              +250 ml Water
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => addElectrolyte(150)}
              className="py-4 rounded-2xl bg-[#0B3E63]/20 active:scale-95 transition"
            >
              +150 ml Electrolyte
            </button>

            <button
              onClick={() => addElectrolyte(250)}
              className="py-4 rounded-2xl bg-[#0B3E63]/20 active:scale-95 transition"
            >
              +250 ml Electrolyte
            </button>
          </div>
          <div className="flex justify-center">
           <button
                onClick={() => setShowSheet(true)}
                className="mt-4 text-sm opacity-70 hover:opacity-100 transition"
        >
                 + Other Drink
         </button>
      </div>

        </section>

        {/* Goal Selector */}
        <section className="flex justify-center">
          <div className="text-sm">
            Goal:
            <select
              value={goal}
              onChange={(e) => setGoal(parseInt(e.target.value))}
              className="ml-2 bg-white/40 rounded px-2 py-1"
            >
              <option value={2500}>2500 ml</option>
              <option value={3000}>3000 ml</option>
              <option value={3500}>3500 ml</option>
            </select>
          </div>
        </section>

        {/* Reset Hour */}
        <section className="flex justify-center">
          <div className="text-sm">
            Reset at:
            <select
              value={resetHour}
              onChange={(e) => setResetHour(parseInt(e.target.value))}
              className="ml-2 bg-white/40 rounded px-2 py-1"
            >
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={i}>
                  {i}:00
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* Manual Reset */}
        <section className="flex justify-center">
          <button
            onClick={resetDay}
            className="text-xs opacity-60 hover:opacity-90 transition"
          >
            reset day
          </button>
        </section>

      </main>
      {/* Bottom Sheet Overlay */}
{showSheet && (
  <>
    {/* Background Dim */}
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
      onClick={() => setShowSheet(false)}
    />

    {/* Bottom Sheet */}
    <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 z-50 animate-slideUp">

      <h2 className="text-lg font-semibold mb-4 text-[#0B2E33]">
        Other Drinks
      </h2>

      <div className="grid grid-cols-2 gap-4">

        {["Tea", "Coffee", "Diluted Juice", "Soup / Miso", "Coconut Water", "Soft Drink"].map((drink) => (
          <button
            key={drink}
            className="py-3 rounded-xl bg-[#AAE2DF] text-[#0B2E33]"
            onClick={() => {
              addWater(250); // temporary — we'll refine logic next
              setShowSheet(false);
            }}
          >
            {drink}
          </button>
        ))}

      </div>

    </div>
  </>
)}
    </div>
  );
}

export default App;