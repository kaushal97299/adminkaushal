export default function Card({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl hover:border-cyan-400/40 transition">

      <p className="text-slate-400 text-sm">{title}</p>

      <h2 className="text-2xl font-bold text-white mt-2">
        {value}
      </h2>

    </div>
  );
}
