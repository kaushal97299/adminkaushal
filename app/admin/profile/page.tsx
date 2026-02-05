
export default function AdminProfilePage() {
  return (
    <div className="max-w-2xl">

      <h1 className="page-title">Admin Profile</h1>

      <div className="card-box space-y-4">

        <div>
          <p className="label">Name</p>
          <p>Admin User</p>
        </div>

        <div>
          <p className="label">Email</p>
          <p>admin@carpro.com</p>
        </div>

        <div>
          <p className="label">Role</p>
          <p>Super Admin</p>
        </div>

        <button className="btn-primary">
          Edit Profile
        </button>

      </div>

    </div>
  );
}
