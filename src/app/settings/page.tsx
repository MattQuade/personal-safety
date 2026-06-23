"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

type Contact = {
  id?: string;
  name: string;
  phone: string;
};

export default function SettingsPage() {
  const [safeContacts, setSafeContacts] = useState<Contact[]>([]);
  const [emergencyContacts, setEmergencyContacts] = useState<Contact[]>([]);
  const [newSafeName, setNewSafeName] = useState("");
  const [newSafePhone, setNewSafePhone] = useState("");
  const [newEmergencyName, setNewEmergencyName] = useState("");
  const [newEmergencyPhone, setNewEmergencyPhone] = useState("");
  const [status, setStatus] = useState("");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check auth and load contacts
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth");
        return;
      }
      setUser(user);
      loadContacts(user.id);
    };

    checkUser();
  }, []);

  const loadContacts = async (userId: string) => {
    const { data: safe } = await supabase
      .from('contacts')
      .select('*')
      .eq('user_id', userId)
      .eq('type', 'safe')
      .order('created_at', { ascending: true });

    const { data: emergency } = await supabase
      .from('contacts')
      .select('*')
      .eq('user_id', userId)
      .eq('type', 'emergency')
      .order('created_at', { ascending: true });

    setSafeContacts(safe || []);
    setEmergencyContacts(emergency || []);
    setLoading(false);
  };

  const saveContact = async (type: 'safe' | 'emergency', name: string, phone: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('contacts')
      .insert([{ user_id: user.id, type, name, phone }]);

    if (error) console.error(error);
  };

  const deleteContact = async (id: string) => {
    await supabase.from('contacts').delete().eq('id', id);
  };

  const addSafe = async () => {
    if (!newSafeName.trim() || !newSafePhone.trim()) return;
    await saveContact('safe', newSafeName.trim(), newSafePhone.trim());
    setNewSafeName("");
    setNewSafePhone("");
    loadContacts(user.id);
  };

  const addEmergency = async () => {
    if (!newEmergencyName.trim() || !newEmergencyPhone.trim()) return;
    await saveContact('emergency', newEmergencyName.trim(), newEmergencyPhone.trim());
    setNewEmergencyName("");
    setNewEmergencyPhone("");
    loadContacts(user.id);
  };

  const removeSafe = async (id: string) => {
    await deleteContact(id);
    loadContacts(user.id);
  };

  const removeEmergency = async (id: string) => {
    await deleteContact(id);
    loadContacts(user.id);
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-12">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Settings</h1>
        <button onClick={() => supabase.auth.signOut()} className="text-red-600">Sign Out</button>
      </div>

      {/* SAFE Contacts */}
      <div className="border rounded-3xl p-8 bg-white shadow">
        <h2 className="text-2xl font-semibold mb-6">SAFE Contacts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <input type="text" placeholder="Name" value={newSafeName} onChange={(e) => setNewSafeName(e.target.value)} className="border p-4 rounded-2xl" />
          <input type="tel" placeholder="Phone Number" value={newSafePhone} onChange={(e) => setNewSafePhone(e.target.value)} className="border p-4 rounded-2xl" />
        </div>
        <button onClick={addSafe} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-medium mb-8">Add SAFE Contact</button>

        {safeContacts.map((c) => (
          <div key={c.id} className="flex justify-between bg-gray-50 p-5 rounded-2xl mb-3 border">
            <div><strong>{c.name}</strong><br />{c.phone}</div>
            <button onClick={() => removeSafe(c.id!)} className="text-red-600">Remove</button>
          </div>
        ))}
      </div>

      {/* Emergency Contacts */}
      <div className="border rounded-3xl p-8 bg-white shadow">
        <h2 className="text-2xl font-semibold mb-6">Emergency Contacts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <input type="text" placeholder="Name" value={newEmergencyName} onChange={(e) => setNewEmergencyName(e.target.value)} className="border p-4 rounded-2xl" />
          <input type="tel" placeholder="Phone Number" value={newEmergencyPhone} onChange={(e) => setNewEmergencyPhone(e.target.value)} className="border p-4 rounded-2xl" />
        </div>
        <button onClick={addEmergency} className="w-full bg-red-600 text-white py-4 rounded-2xl font-medium mb-8">Add Emergency Contact</button>

        {emergencyContacts.map((c) => (
          <div key={c.id} className="flex justify-between bg-gray-50 p-5 rounded-2xl mb-3 border">
            <div><strong>{c.name}</strong><br />{c.phone}</div>
            <button onClick={() => removeEmergency(c.id!)} className="text-red-600">Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
}