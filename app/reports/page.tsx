export default function ReportsPage() {
  return (
    <div>

      <h1 className="page-title">Reports</h1>

      <div className="grid md:grid-cols-2 gap-6">

        <div className="card-box">
          <h3>Monthly Revenue</h3>
          <p className="text-cyan-400 text-xl">
            ₹1.2L
          </p>
        </div>

        <div className="card-box">
          <h3>Total Growth</h3>
          <p className="text-green-400 text-xl">
            +18%
          </p>
        </div>

      </div>

    </div>
  );
}
