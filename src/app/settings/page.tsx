"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

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
  const [loading, setLoading] = useState(true);

  // Load contacts from Supabase
  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    // For now using a simple user ID. Later we'll add real auth.
    const userId = "default-user";

    const { data: safe } = await supabase
      .from('contacts')
      .select('*')
      .eq('type', 'safe')
      .eq('user_id', userId)
      .order('created_at');

    const { data: emergency } = await supabase
      .from('contacts')
      .select('*')
      .eq('type', 'emergency')
      .eq('user_id', userId)
      .order('created_at');

    setSafeContacts(safe || []);
    setEmergencyContacts(emergency || []);
    setLoading(false);
  };

  const saveContact = async (type: 'safe' | 'emergency', name: string, phone: string) => {
    const userId = "default-user";

    await supabase
      .from('contacts')
      .insert([{ user_id: userId, type, name, phone }]);
  };

  const deleteContact = async (id: string) => {
    await supabase.from('contacts').delete().eq('id', id);
  };

  const addSafe = async () => {
    if (!newSafeName.trim() || !newSafePhone.trim()) return;
    await saveContact('safe', newSafeName.trim(), newSafePhone.trim());
    setNewSafeName("");
    setNewSafePhone("");
    loadContacts(); // refresh
  };

  const addEmergency = async () => {
    if (!newEmergencyName.trim() || !newEmergencyPhone.trim()) return;
    await saveContact('emergency', newEmergencyName.trim(), newEmergencyPhone.trim());
    setNewEmergencyName("");
    setNewEmergencyPhone("");
    loadContacts();
  };

  const removeSafe = async (id: string) => {
    await deleteContact(id);
    loadContacts();
  };

  const removeEmergency = async (id: string) => {
    await deleteContact(id);
    loadContacts();
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-12">
      <h1 className="text-4xl font-bold text-center">Settings</h1>

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

      <p className="text-center text-green-600 font-medium">Contacts are now saved in the cloud</p>
    </div>
  );
}


