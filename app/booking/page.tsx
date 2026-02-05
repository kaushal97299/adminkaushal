export default function BookingsPage() {
  return (
    <div>

      <h1 className="page-title">Bookings</h1>

      <div className="table-box">

        <table className="w-full">

          <tr>
            <th>Client</th>
            <th>Car</th>
            <th>Date</th>
            <th>Status</th>
          </tr>

          <tr>
            <td>Rahul</td>
            <td>Swift</td>
            <td>02 Feb</td>
            <td className="text-yellow-400">
              Pending
            </td>
          </tr>

          <tr>
            <td>Amit</td>
            <td>Creta</td>
            <td>01 Feb</td>
            <td className="text-green-400">
              Completed
            </td>
          </tr>

        </table>

      </div>

    </div>
  );
}
