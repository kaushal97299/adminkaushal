export default function SellersPage() {
  return (
    <div>

      <h1 className="page-title">Sellers</h1>

      <div className="grid md:grid-cols-3 gap-6">

        {["CarZone", "FastRide", "DriveX"].map(
          (s) => (
            <div
              key={s}
              className="card-box"
            >
              <h3 className="font-semibold">{s}</h3>
              <p className="text-slate-400">
                Verified Seller
              </p>
            </div>
          )
        )}

      </div>

    </div>
  );
}
