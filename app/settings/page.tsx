export default function SettingsPage() {
  return (
    <div>

      <h1 className="page-title">Settings</h1>

      <div className="space-y-6 max-w-xl">

        <div className="card-box">
          <p>Theme</p>
          <select className="input-box">
            <option>Dark</option>
            <option>Light</option>
          </select>
        </div>

        <div className="card-box">
          <p>Notifications</p>
          <input type="checkbox" />
        </div>

      </div>

    </div>
  );
}
