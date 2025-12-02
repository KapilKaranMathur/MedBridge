"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DoctorSettingsPage() {
  const router = useRouter();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    specialization: "",
    qualification: "",
    experienceYears: "",
    city: "",
    availabilityInfo: "",
    avatarUrl: "",
  });

  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/doctor/profile");
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          router.push("/");
          return;
        }
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to load");
      }
      const json = await res.json();
      setDoctor(json.doctor || null);
      setForm({
        specialization: json.doctor?.specialization || "",
        qualification: json.doctor?.qualification || "",
        experienceYears: json.doctor?.experienceYears ? String(json.doctor.experienceYears) : "",
        city: json.doctor?.city || "",
        availabilityInfo: json.doctor?.availabilityInfo || "",
        avatarUrl: json.doctor?.avatarUrl || "",
      });
    } catch (err) {
      setError(err.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = {
        specialization: form.specialization,
        qualification: form.qualification,
        experienceYears: form.experienceYears ? Number(form.experienceYears) : undefined,
        city: form.city,
        availabilityInfo: form.availabilityInfo,
        avatarUrl: form.avatarUrl,
      };

      const res = await fetch("/api/doctor/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          router.push("/");
          return;
        }
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to save");
      }

      const json = await res.json();
      setDoctor(json.doctor);
      alert("Profile updated");
    } catch (err) {
      setError(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  function updateField(k, v) {
    setForm((s) => ({ ...s, [k]: v }));
  }

  async function handleDelete() {
    if (deleteConfirmText !== "DELETE") {
      alert("Type DELETE in the confirmation box to proceed.");
      return;
    }

    if (!confirm("This will permanently delete your doctor account and all related data. This action cannot be undone. Are you sure?")) {
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch("/api/doctor/profile", { method: "DELETE" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Delete failed");
      }

      await fetch("/api/auth/logout", { method: "POST", credentials: "include" }).catch(() => {});
      router.push("/");
    } catch (err) {
      alert(err.message || "Failed to delete account");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Doctor Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="p-6">Loading…</div>
          ) : (
            <form onSubmit={handleSave} className="space-y-4">
              {error && <div className="text-sm text-red-500">{error}</div>}

              <div className="grid grid-cols-1 gap-3">
                <label className="text-sm font-medium">Specialization</label>
                <Input value={form.specialization} onChange={(e) => updateField("specialization", e.target.value)} placeholder="Cardiology, Dermatology..." />

                <label className="text-sm font-medium">Qualification</label>
                <Input value={form.qualification} onChange={(e) => updateField("qualification", e.target.value)} placeholder="MBBS, MD..." />

                <label className="text-sm font-medium">Experience (years)</label>
                <Input type="number" value={form.experienceYears} onChange={(e) => updateField("experienceYears", e.target.value)} placeholder="10" />

                <label className="text-sm font-medium">City / Clinic</label>
                <Input value={form.city} onChange={(e) => updateField("city", e.target.value)} placeholder="Mumbai" />

                <label className="text-sm font-medium">Availability / Notes</label>
                <Textarea value={form.availabilityInfo} onChange={(e) => updateField("availabilityInfo", e.target.value)} placeholder="Times available, appointment instructions..." rows={4} />

                <label className="text-sm font-medium">Avatar URL (optional)</label>
                <Input value={form.avatarUrl} onChange={(e) => updateField("avatarUrl", e.target.value)} placeholder="https://..." />

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="ghost" onClick={load}>Reset</Button>
                  <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save Changes"}</Button>
                </div>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Deleting your account will permanently remove your doctor profile, appointments, and medical records from the platform.
            </p>

            <label className="text-xs font-medium">Type <span className="font-semibold">DELETE</span> to confirm</label>
            <Input value={deleteConfirmText} onChange={(e) => setDeleteConfirmText(e.target.value)} placeholder="Type DELETE to confirm" className="mb-3" />

            <div className="flex gap-2">
              <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
                {deleting ? "Deleting…" : "Delete Account"}
              </Button>
              <Button variant="ghost" onClick={() => { setDeleteConfirmText(""); }}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
