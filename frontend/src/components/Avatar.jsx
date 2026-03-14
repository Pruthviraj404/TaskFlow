import { useRef } from "react";

export default function Avatar({ user, setUser }) {

  const fileInput = useRef();

  const upload = async (file) => {

    const formData = new FormData();
    formData.append("avatar", file);

    const res = await fetch(
      "http://localhost:5000/api/auth/upload-avatar",
      {
        method: "POST",
        credentials: "include",
        body: formData
      }
    );

    const data = await res.json();

    setUser(prev => ({
      ...prev,
      avatar: data.avatar
    }));
  };

  return (
    <div
      onClick={() => fileInput.current.click()}
      className="w-14 h-14 rounded-2xl overflow-hidden cursor-pointer"
    >

      {user.avatar ? (
        <img
          src={`http://localhost:5000${user.avatar}`}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white font-bold">
          {user.name.charAt(0)}
        </div>
      )}

      <input
        type="file"
        hidden
        ref={fileInput}
        onChange={(e) => upload(e.target.files[0])}
      />

    </div>
  );
}