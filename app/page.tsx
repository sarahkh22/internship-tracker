"use client";

import { useState, useEffect } from "react";

type Status = "Applied" | "Interview" | "Offer" | "Rejected";

type Application = {
  id: string;
  company: string;
  role: string;
  status: Status;
  dateApplied: string;
  notes: string;
};

const STATUS_COLORS: Record<Status, string> = {
  Applied: "bg-blue-100 text-blue-800",
  Interview: "bg-yellow-100 text-yellow-800",
  Offer: "bg-green-100 text-green-800",
  Rejected: "bg-red-100 text-red-800",
};

export default function Home() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [dateApplied, setDateApplied] = useState("");
  const [notes, setNotes] = useState("");
  const [loaded, setLoaded] = useState(false);

  // Load saved data when the page opens
  useEffect(() => {
    const saved = localStorage.getItem("applications");
    if (saved) setApplications(JSON.parse(saved));
    setLoaded(true);
  }, []);

  // Save data whenever it changes
  useEffect(() => {
    if (loaded) {
      localStorage.setItem("applications", JSON.stringify(applications));
    }
  }, [applications, loaded]);

  function addApplication(e: React.FormEvent) {
    e.preventDefault();
    if (!company || !role) return;

    const newApp: Application = {
      id: crypto.randomUUID(),
      company,
      role,
      status: "Applied",
      dateApplied: dateApplied || new Date().toISOString().split("T")[0],
      notes,
    };

    setApplications([newApp, ...applications]);
    setCompany("");
    setRole("");
    setDateApplied("");
    setNotes("");
  }

  function updateStatus(id: string, status: Status) {
    setApplications(
      applications.map((app) => (app.id === id ? { ...app, status } : app))
    );
  }

  function deleteApplication(id: string) {
    setApplications(applications.filter((app) => app.id !== id));
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Internship Tracker</h1>

      {/* Add form */}
      <form
        onSubmit={addApplication}
        className="bg-white border rounded-lg p-4 mb-8 grid gap-3"
      >
        <div className="grid grid-cols-2 gap-3">
          <input
            className="border rounded px-3 py-2"
            placeholder="Company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
          <input
            className="border rounded px-3 py-2"
            placeholder="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
        </div>
        <input
          type="date"
          className="border rounded px-3 py-2"
          value={dateApplied}
          onChange={(e) => setDateApplied(e.target.value)}
        />
        <textarea
          className="border rounded px-3 py-2"
          placeholder="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <button
          type="submit"
          className="bg-black text-white rounded px-4 py-2 font-medium"
        >
          Add Application
        </button>
      </form>

      {/* List */}
      <div className="grid gap-3">
        {applications.length === 0 && (
          <p className="text-gray-500">No applications yet. Add one above.</p>
        )}
        {applications.map((app) => (
          <div key={app.id} className="border rounded-lg p-4 flex justify-between items-start">
            <div>
              <p className="font-semibold">
                {app.role} @ {app.company}
              </p>
              <p className="text-sm text-gray-500">Applied: {app.dateApplied}</p>
              {app.notes && <p className="text-sm mt-1">{app.notes}</p>}
            </div>
            <div className="flex flex-col items-end gap-2">
              <select
                value={app.status}
                onChange={(e) => updateStatus(app.id, e.target.value as Status)}
                className={`text-sm rounded px-2 py-1 ${STATUS_COLORS[app.status]}`}
              >
                <option value="Applied">Applied</option>
                <option value="Interview">Interview</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
              </select>
              <button
                onClick={() => deleteApplication(app.id)}
                className="text-xs text-red-500 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}