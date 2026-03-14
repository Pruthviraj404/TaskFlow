import React, { useState } from "react";
import {
  Moon,
  Bell,
  Calendar,
  Lock,
  LogOut,
  ChevronRight,
  ArrowLeft,
  User as UserIcon,
  X,
  Mail,
  Loader2
} from "lucide-react";

import ChangePasswordModal from "../components/ChangePasswordModal";

const Toggle = ({ enabled, onChange }) => (
  <button
    onClick={(e) => {
      e.stopPropagation();
      onChange(!enabled);
    }}
    className={`w-11 h-6 rounded-full relative transition ${
      enabled ? "bg-blue-600" : "bg-gray-300"
    }`}
  >
    <div
      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition ${
        enabled ? "translate-x-6" : "translate-x-1"
      }`}
    />
  </button>
);

const SettingsRow = ({
  icon: Icon,
  label,
  description,
  control,
  onClick,
  isRed,
  dark
}) => (
  <div
    onClick={onClick}
    className={`flex items-center justify-between p-5 cursor-pointer ${
      dark ? "hover:bg-gray-800" : "hover:bg-gray-50"
    }`}
  >
    <div className="flex items-center gap-4">
      <div
        className={`p-2 rounded-xl ${
          isRed
            ? "bg-red-100 text-red-500"
            : dark
            ? "bg-gray-800 text-gray-300"
            : "bg-gray-100 text-gray-500"
        }`}
      >
        <Icon size={18} />
      </div>

      <div>
        <p
          className={`text-sm font-bold ${
            isRed ? "text-red-500" : dark ? "text-white" : "text-gray-800"
          }`}
        >
          {label}
        </p>

        {description && (
          <p className="text-xs text-gray-400">{description}</p>
        )}
      </div>
    </div>

    <div onClick={(e) => e.stopPropagation()}>
      {control ? control : <ChevronRight size={16} className="text-gray-400" />}
    </div>
  </div>
);

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
            className="w-full bg-gray-100 rounded-xl py-3 pl-12 pr-4"
          />
        </div>

        <div className="relative opacity-60">
          <Mail
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            value={user?.email}
            disabled
            className="w-full bg-gray-200 rounded-xl py-3 pl-12 pr-4"
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

export default function Settings({
  user,
  onLogout,
  setActiveScreen,
  onUpdateUser
}) {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [defaultDueDate, setDefaultDueDate] = useState("Tomorrow");

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [profilePhoto, setProfilePhoto] = useState(user?.avatar || null);

  const getInitials = (name) =>
    name?.split(" ").map((n) => n[0]).join("").toUpperCase() || "??";

  const handleDueDateChange = () => {
    const options = ["Today", "Tomorrow", "Next Week"];
    const index = options.indexOf(defaultDueDate);
    setDefaultDueDate(options[(index + 1) % options.length]);
  };

  const handleProfileUpdate = async (updatedData) => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/change-name",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ name: updatedData.name })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Update failed");
      }

      if (onUpdateUser) {
        onUpdateUser({
          ...user,
          name: data.name
        });
      }

      setShowEditModal(false);
    } catch (error) {
      alert(error.message);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/upload-avatar",
        {
          method: "POST",
          credentials: "include",
          body: formData
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setProfilePhoto(data.avatar);

      if (onUpdateUser) {
        onUpdateUser({
          ...user,
          avatar: data.avatar
        });
      }

    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div
      className={`${
        darkMode ? "bg-black text-white" : "bg-[#FAFBFF] text-black"
      } min-h-screen`}
    >
      <div className="max-w-xl mx-auto">

        <div className="sticky top-0 px-6 py-6 flex items-center gap-4">
          <button onClick={() => setActiveScreen("dashboard")}>
            <ArrowLeft size={20} />
          </button>

          <h1 className="text-2xl font-bold">Settings</h1>
        </div>

        <div className="px-6 pb-10">

          <div
            className={`${
              darkMode ? "bg-gray-900" : "bg-white"
            } p-5 rounded-2xl flex justify-between items-center mb-8`}
          >
            <div className="flex gap-4 items-center">

              <div className="relative">

                {profilePhoto ? (
                  <img
                    src={`http://localhost:5000${profilePhoto}`}
                    alt="avatar"
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-blue-600 text-white flex items-center justify-center rounded-xl font-bold">
                    {getInitials(user?.name)}
                  </div>
                )}

                <label className="absolute -bottom-1 -right-1 bg-blue-600 text-white w-5 h-5 flex items-center justify-center rounded-full cursor-pointer text-xs">
                  +
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                </label>

              </div>

              <div>
                <h2 className="font-bold">{user?.name}</h2>
                <p className="text-xs text-gray-400">{user?.email}</p>
              </div>

            </div>

            <button
              onClick={() => setShowEditModal(true)}
              className="text-sm bg-gray-200 px-3 py-1 rounded-lg"
            >
              Edit
            </button>
          </div>

          <h3 className="text-xs uppercase text-gray-400 mb-3">
            Preferences
          </h3>

          <div
            className={`${
              darkMode ? "bg-gray-900" : "bg-white"
            } rounded-xl mb-8`}
          >

            <SettingsRow
              icon={Moon}
              label="Dark Mode"
              description="Easier on the eyes"
              control={<Toggle enabled={darkMode} onChange={setDarkMode} />}
              onClick={() => setDarkMode(!darkMode)}
              dark={darkMode}
            />

            <SettingsRow
              icon={Bell}
              label="Notifications"
              description="Task reminders"
              control={
                <Toggle
                  enabled={notifications}
                  onChange={setNotifications}
                />
              }
              onClick={() => setNotifications(!notifications)}
              dark={darkMode}
            />


          </div>

          <h3 className="text-xs uppercase text-gray-400 mb-3">
            Account
          </h3>

          <div
            className={`${
              darkMode ? "bg-gray-900" : "bg-white"
            } rounded-xl`}
          >

            <SettingsRow
              icon={Lock}
              label="Change Password"
              description="Secure your account"
              onClick={() => setShowPasswordModal(true)}
              dark={darkMode}
            />

            <SettingsRow
              icon={LogOut}
              label="Log Out"
              description="Exit account"
              onClick={onLogout}
              isRed
              dark={darkMode}
            />

          </div>

        </div>
      </div>

      {(showPasswordModal || showEditModal) && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40">

          {showPasswordModal && (
            <ChangePasswordModal
              onClose={() => setShowPasswordModal(false)}
            />
          )}

          {showEditModal && (
            <EditProfileModal
              user={user}
              onClose={() => setShowEditModal(false)}
              onSave={handleProfileUpdate}
            />
          )}

        </div>
      )}
    </div>
  );
}