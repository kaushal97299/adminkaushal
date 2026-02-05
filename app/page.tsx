import Card from "./components/page";

export default function Dashboard() {
  return (
    <div>

      <h1 className="text-3xl font-bold text-cyan-400 mb-8">
        Dashboard
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

        <Card title="Total Users" value="1,245" />
        <Card title="Total Sellers" value="320" />
        <Card title="Bookings" value="2,451" />
        <Card title="Revenue" value="₹4.8L" />

      </div>

      {/* Activity */}
      <div className="mt-10 bg-white/5 border border-white/10 rounded-2xl p-6">

        <h2 className="text-lg font-semibold mb-4">
          Recent Activity
        </h2>

        <ul className="space-y-3 text-slate-300">

          <li>✔ New booking by Rahul</li>
          <li>✔ Seller added: CarZone</li>
          <li>✔ Payment received ₹4500</li>

        </ul>

      </div>

    </div>
  );
}
