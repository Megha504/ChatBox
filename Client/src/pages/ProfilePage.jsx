import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import assets from '../assets/assets';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { FiTrash2 } from 'react-icons/fi';


const ProfilePage = () => {
  const { authUser, updateProfile, removeProfilePic } = useContext(AuthContext);
  const [selectedImg, setSelectedImg] = useState(null);
  const [name, setName] = useState(authUser.fullName || '');
  const [bio, setBio] = useState(authUser.bio || '');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updates = {
      fullName: name,
      bio,
    };

    if (selectedImg) {
      const reader = new FileReader();
      reader.readAsDataURL(selectedImg);
      reader.onload = async () => {
        updates.profilePic = reader.result;
        await updateProfile(updates);
        toast.success("Profile Image updated");
        navigate('/');
      };
    } else {
      await updateProfile(updates);
      toast.success("Profile updated successfully!");
      navigate('/');
    }
  };

  const handleremoveProfilePic = async () => {
    if (!confirm("Are you sure you want to remove your profile picture?")) return;

    try {
      await removeProfilePic();
      toast.success("Profile picture removed");
      navigate('/');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className='min-h-screen bg-[#1C1B2F] flex items-center justify-center px-4 py-10'>
      <div className='w-full max-w-3xl bg-[#23203F] text-white border border-white/10 rounded-xl flex items-center justify-between max-sm:flex-col-reverse overflow-hidden'>

        {/* Form */}
        <form onSubmit={handleSubmit} className='flex flex-col gap-5 p-8 flex-1'>
          <h3 className='text-xl font-semibold'>Edit Profile</h3>

          {/* Upload */}
          <label htmlFor='avatar' className='flex items-center gap-3 cursor-pointer text-sm text-gray-300'>
            <input
              onChange={(e) => setSelectedImg(e.target.files[0])}
              type="file"
              id='avatar'
              accept='.png, .jpg, .jpeg'
              hidden
            />
            <img
              src={
                selectedImg
                  ? URL.createObjectURL(selectedImg)
                  : authUser?.profilePic || assets.avatar_icon
              }
              alt="avatar"
              className={`w-12 h-12 object-cover ${selectedImg || authUser?.profilePic ? 'rounded-full' : 'grayscale opacity-60'}`}
            />
            Upload Profile Image
          </label>

          {/* Remove profile image button */}
              {authUser?.profilePic && !selectedImg && (
  <button
    type="button"
    onClick={handleremoveProfilePic}
    className="flex items-center gap-2 text-sm text-red-400 hover:text-red-500 hover:bg-red-500/10 px-3 py-[6px] rounded-md transition duration-200 w-fit"
  >
    <FiTrash2 size={16} />
    Remove Photo
  </button>
)}





          {/* Name Input */}
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            required
            placeholder='Your name'
            className='p-2 bg-transparent border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-400 text-white placeholder:text-white/60'
          />

          {/* Bio Input */}
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            placeholder='Write profile bio...'
            required
            rows={4}
            className='p-2 bg-transparent border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-400 text-white placeholder:text-white/60'
          ></textarea>

          {/* Save Button */}
          <button
            type="submit"
            className="bg-gradient-to-r from-indigo-400 to-purple-300 hover:opacity-90 transition-opacity duration-300 text-white p-2 rounded-full text-lg cursor-pointer"
          >
            Save
          </button>
        </form>

        {/* Preview */}
        <img
          className={`aspect-square mx-10 max-sm:mt-8 object-cover ${
            authUser?.profilePic
              ? 'max-w-[180px] rounded-full'
              : 'max-w-[180px] rounded-md icon-white grayscale opacity-70'
          }`}
          src={authUser?.profilePic || assets.sidebar_icon}
          alt="profile"
        />
      </div>
    </div>
  );
};

export default ProfilePage;
