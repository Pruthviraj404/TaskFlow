import React, { useState } from 'react';
import { X, User, Loader2 } from 'lucide-react';

const EditProfileModal = ({ user, onClose, onSave }) => {

  const [name, setName] = useState(user?.name || "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {

    if (!name.trim()) return;

    setLoading(true);

    try {

      await onSave({ name });

      setLoading(false);

    } catch (err) {

      alert(err.message);
      setLoading(false);

    }
  };

  return (
    <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-xl">

      <div className="flex justify-between mb-6">

        <h2 className="text-xl font-bold">Edit Profile</h2>

        <button onClick={onClose}>
          <X size={20} />
        </button>

      </div>

      <div className="space-y-6">

        <div className="relative">

          <UserIcon
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
            className="w-full bg-gray-100 rounded-xl py-3 pl-12 pr-4"
          />

        </div>

        <button
          onClick={handleSave}
          className="w-full bg-blue-600 text-white py-3 rounded-xl flex items-center justify-center gap-2"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            "Save Changes"
          )}
        </button>

      </div>

    </div>
  );
};