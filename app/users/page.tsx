export default function UsersPage() {
  return (
    <div>

      <h1 className="page-title">Users</h1>

      <div className="table-box">

        <table className="w-full">

          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Rahul</td>
              <td>rahul@gmail.com</td>
              <td className="text-green-400">Active</td>
            </tr>
            <tr>
              <td>Amit</td>
              <td>amit@gmail.com</td>
              <td className="text-red-400">Blocked</td>
            </tr>
          </tbody>

        </table>

      </div>

    </div>
  );
}
