import React, { useState, useCallback } from "react";
import {
  Moon, Bell, Lock, LogOut, ChevronRight, ArrowLeft,
  User as UserIcon, X, Mail, Loader2, Check
} from "lucide-react";
import Cropper from "react-easy-crop";
import getCroppedImg from "../utils/cropImage";
import ChangePasswordModal from "../components/ChangePasswordModal";

const Toggle = ({ enabled, onChange }) => (
  <button
    onClick={(e) => { e.stopPropagation(); onChange(!enabled); }}
    className={`w-11 h-6 rounded-full relative transition ${enabled ? "bg-blue-600" : "bg-gray-300"}`}
  >
    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition ${enabled ? "translate-x-6" : "translate-x-1"}`} />
  </button>
);

const SettingsRow = ({ icon: Icon, label, description, control, onClick, isRed, dark }) => (
  <div
    onClick={onClick}
    className={`flex items-center justify-between p-5 cursor-pointer ${dark ? "hover:bg-gray-800" : "hover:bg-gray-50"}`}
  >
    <div className="flex items-center gap-4">
      <div className={`p-2 rounded-xl ${isRed ? "bg-red-100 text-red-500" : dark ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-500"}`}>
        <Icon size={18} />
      </div>
      <div>
        <p className={`text-sm font-bold ${isRed ? "text-red-500" : dark ? "text-white" : "text-gray-800"}`}>{label}</p>
        {description && <p className="text-xs text-gray-400">{description}</p>}
      </div>
    </div>
    <div onClick={(e) => e.stopPropagation()}>
      {control ? control : <ChevronRight size={16} className="text-gray-400" />}
    </div>
  </div>
);

const AvatarCropper = ({ file, onCancel, onCropComplete }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropCompleteHandler = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleCrop = async () => {
    if (!croppedAreaPixels) return;
    try {
      const croppedFile = await getCroppedImg(file, croppedAreaPixels);
      onCropComplete(croppedFile);
    } catch (err) {
      console.error(err);
      alert("Failed to crop image");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/70 p-4">
      <div className="relative w-full max-w-md h-96 bg-gray-800 rounded-xl overflow-hidden">
        <Cropper
          image={URL.createObjectURL(file)}
          crop={crop}
          zoom={zoom}
          aspect={1}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropCompleteHandler}
        />
      </div>
      <input
        type="range"
        min={1}
        max={3}
        step={0.1}
        value={zoom}
        onChange={(e) => setZoom(Number(e.target.value))}
        className="mt-4 w-64 accent-blue-600"
      />
      <div className="flex gap-4 mt-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded-xl bg-red-600 text-white flex items-center gap-2"
        >
          <X size={16} /> Cancel
        </button>
        <button
          onClick={handleCrop}
          className="px-4 py-2 rounded-xl bg-blue-600 text-white flex items-center gap-2"
        >
          <Check size={16} /> Crop & Upload
        </button>
      </div>
    </div>
  );
};

const EditProfileModal = ({ user, onClose, onSave, dark }) => {
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
    <div className={`${dark ? "bg-gray-900 text-white" : "bg-white text-black"} w-full max-w-md rounded-3xl p-8 shadow-xl`}>
      <div className="flex justify-between mb-6">
        <h2 className="text-xl font-bold">Edit Profile</h2>
        <button onClick={onClose}><X size={20} /></button>
      </div>
      <div className="space-y-6">
        <div className="relative">
          <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full rounded-xl py-3 pl-12 pr-4 ${dark ? "bg-gray-800 text-white" : "bg-gray-100 text-black"}`}
          />
        </div>
        <div className="relative opacity-60">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            value={user?.email}
            disabled
            className={`w-full rounded-xl py-3 pl-12 pr-4 ${dark ? "bg-gray-800 text-gray-400" : "bg-gray-200"}`}
          />
        </div>
        <button
          onClick={handleSave}
          className="w-full bg-blue-600 text-white py-3 rounded-xl flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default function Settings({ user, onLogout, setActiveScreen, onUpdateUser, darkMode, setDarkMode }) {
  const [notifications, setNotifications] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(user?.avatar || null);
  const [cropFile, setCropFile] = useState(null);

  const getInitials = (name) => name?.split(" ").map(n => n[0]).join("").toUpperCase() || "??";

  const handleProfileUpdate = async (updatedData) => {
    try {
      const response = await fetch("/api/auth/change-name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: updatedData.name }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Update failed");
      if (onUpdateUser) onUpdateUser({ ...user, name: data.name });
      setShowEditModal(false);
    } catch (error) {
      alert(error.message);
    }
  };

  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCropFile(file);
  };

  const handleCroppedUpload = async (file) => {
    setCropFile(null);
    const formData = new FormData();
    formData.append("avatar", file);
    try {
      const response = await fetch("/api/auth/upload-avatar", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Upload failed");
      // ✅ data.avatar is already "/uploads/filename.jpg" — use directly
      setProfilePhoto(data.avatar);
      if (onUpdateUser) onUpdateUser({ ...user, avatar: data.avatar });
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className={`${darkMode ? "bg-gray-950 text-white" : "bg-[#FAFBFF] text-black"} min-h-screen`}>
      <div className="max-w-xl mx-auto">

        {/* Header */}
        <div className={`sticky top-0 px-6 py-6 flex items-center gap-4 ${darkMode ? "bg-gray-950" : "bg-[#FAFBFF]"}`}>
          <button onClick={() => setActiveScreen("dashboard")} className={darkMode ? "text-white" : "text-black"}>
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>

        <div className="px-6 pb-10">

          {/* Profile Card */}
          <div className={`${darkMode ? "bg-gray-900" : "bg-white"} p-5 rounded-2xl flex justify-between items-center mb-8`}>
            <div className="flex gap-4 items-center">
              <div className="relative">
                {/* ✅ use profilePhoto directly — no /uploads prefix */}
                {profilePhoto ? (
                  <img
                    src={profilePhoto}
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
                  <input type="file" accept="image/*" className="hidden" onChange={handlePhotoSelect} />
                </label>
              </div>
              <div>
                <h2 className={`font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>{user?.name}</h2>
                <p className="text-xs text-gray-400">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={() => setShowEditModal(true)}
              className={`text-sm px-3 py-1 rounded-lg ${darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-black"}`}
            >
              Edit
            </button>
          </div>

          {/* Preferences */}
          <h3 className="text-xs uppercase text-gray-400 mb-3">Preferences</h3>
          <div className={`${darkMode ? "bg-gray-900" : "bg-white"} rounded-xl mb-8`}>
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
              control={<Toggle enabled={notifications} onChange={setNotifications} />}
              onClick={() => setNotifications(!notifications)}
              dark={darkMode}
            />
          </div>

          {/* Account */}
          <h3 className="text-xs uppercase text-gray-400 mb-3">Account</h3>
          <div className={`${darkMode ? "bg-gray-900" : "bg-white"} rounded-xl`}>
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

      {/* Password & Edit Modals */}
      {(showPasswordModal || showEditModal) && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-40">
          {showPasswordModal && (
            <ChangePasswordModal onClose={() => setShowPasswordModal(false)} dark={darkMode} />
          )}
          {showEditModal && (
            <EditProfileModal
              user={user}
              onClose={() => setShowEditModal(false)}
              onSave={handleProfileUpdate}
              dark={darkMode}
            />
          )}
        </div>
      )}

      {/* Cropper at z-50 — always on top */}
      {cropFile && (
        <AvatarCropper
          file={cropFile}
          onCancel={() => setCropFile(null)}
          onCropComplete={handleCroppedUpload}
        />
      )}
    </div>
  );
}