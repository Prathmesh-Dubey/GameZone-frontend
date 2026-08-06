import React, { useState, useEffect } from "react";
import { User, ProfileResponse, userApi } from "../../api/api";
import { MapPin, Globe, Calendar, LogOut, Camera, Trash2, Pencil, Check, Cpu, Save } from "lucide-react";

interface UnifiedProfileProps {
  user: User;
  profile: ProfileResponse | null;
  theme: 'social' | 'gaming';
  onLogout?: () => void;
  onUserChanged: (newUser: User) => void;
  updateProfile: (updates: Partial<ProfileResponse>) => Promise<ProfileResponse>;
}

export default function UnifiedProfile({
  user,
  profile,
  theme,
  onLogout,
  onUserChanged,
  updateProfile
}: UnifiedProfileProps) {
  // Mode state
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [infoError, setInfoError] = useState("");

  // Form State
  const [editUsername, setEditUsername] = useState(user.username || "");
  const [editEmail, setEditEmail] = useState(user.email || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [location, setLocation] = useState(profile?.location || "");
  const [website, setWebsite] = useState(profile?.website || "");
  const [dob, setDob] = useState(profile?.dateOfBirth || "");
  const [accentColor, setAccentColor] = useState(profile?.accentColor || user.accentColor || "");
  const [avatarSeed, setAvatarSeed] = useState(profile?.avatarSeed || user.avatarSeed || "");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatarUrl || user.avatarUrl || "");

  // Update local state if profile prop changes
  useEffect(() => {
    if (!isEditing) {
      setEditUsername(user.username || "");
      setEditEmail(user.email || "");
      setBio(profile?.bio || "");
      setLocation(profile?.location || "");
      setWebsite(profile?.website || "");
      setDob(profile?.dateOfBirth || "");
      setAccentColor(profile?.accentColor || user.accentColor || "");
      setAvatarSeed(profile?.avatarSeed || user.avatarSeed || "");
      setAvatarUrl(profile?.avatarUrl || user.avatarUrl || "");
    }
  }, [profile, user, isEditing]);

  const handleSave = async () => {
    if (editUsername.includes(" ")) {
      setInfoError("Username cannot contain spaces.");
      return;
    }
    
    setInfoError("");
    setSaving(true);
    
    try {
      const updatedUser = await userApi.update(user.id, { username: editUsername, email: editEmail });
      
      const updatedProfile = await updateProfile({
        bio,
        location,
        website,
        dateOfBirth: dob || null,
        avatarUrl,
        accentColor,
        avatarSeed,
      });

      onUserChanged({
        ...updatedUser,
        avatarUrl: updatedProfile.avatarUrl,
        accentColor: updatedProfile.accentColor,
        avatarSeed: updatedProfile.avatarSeed
      });
      
      setIsEditing(false);
    } catch (err: any) {
      console.error("Save failed:", err);
      setInfoError(err.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setInfoError("");
    setIsEditing(false);
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete your account and all associated data? This action cannot be undone."
    );
    if (!confirmed) return;

    try {
      setDeleting(true);
      await userApi.deleteAccount(user.id);
      localStorage.removeItem("gamezone_user");
      alert("Your account and all associated data have been permanently deleted.");
      if (onLogout) {
        onLogout();
      }
    } catch (err: any) {
      console.error("Account deletion failed:", err);
      alert(err.message || "Failed to delete account. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const handleAvatarChangeClick = () => {
    const newUrl = window.prompt("Enter new avatar image URL (or leave blank to use character seed):", avatarUrl || "");
    if (newUrl !== null) {
      setAvatarUrl(newUrl);
      if (newUrl) setAvatarSeed(""); 
    }
  };

  const activeAvatarSeed = avatarSeed || user.username || "guest";
  const displayAvatarUrl = avatarUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${activeAvatarSeed}`;
  const displayAccent = accentColor || "#3b82f6";

  // --------------- SOCIAL MEDIA THEME ---------------
  if (theme === 'social') {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden flex flex-col md:flex-row relative animate-fade-in">
        
        {/* Social - Left Column (Avatar & Visuals) */}
        <div className="w-full md:w-1/3 p-5 md:p-8 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 flex flex-col items-center text-center bg-slate-50/50 dark:bg-slate-950/20">
          <div className="relative group mb-6">
            <img
              src={displayAvatarUrl}
              alt={editUsername}
              className="w-28 h-28 md:w-40 md:h-40 rounded-full bg-white dark:bg-slate-800 object-cover border-4 transition-transform group-hover:scale-105"
              style={{ borderColor: displayAccent }}
            />
            {isEditing && (
              <button
                type="button"
                onClick={handleAvatarChangeClick}
                className="absolute bottom-0 right-2 w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center hover:bg-slate-800 shadow-xl border-2 border-white dark:border-slate-800 transition-colors"
                title="Change Avatar URL"
              >
                <Camera className="w-5 h-5" />
              </button>
            )}
          </div>

          {isEditing ? (
            <div className="w-full space-y-6">
              {/* Accent Color Selection */}
              <div className="flex flex-col gap-2 items-center">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Accent Color</label>
                <div className="flex items-center justify-center gap-3 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <input
                    type="color"
                    value={displayAccent}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-10 h-10 rounded-full cursor-pointer border-0 p-0"
                  />
                  <button type="button" onClick={() => setAccentColor("")} className="text-[10px] uppercase font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white">Reset Default</button>
                </div>
              </div>

              {/* Avatar Seed Selection */}
              <div className="flex flex-col gap-3 items-center w-full">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avatar Seeds</label>
                <div className="grid grid-cols-3 gap-3 w-full justify-items-center">
                  {["Felix", "Aneka", "Jasper", "Bandit", "Luna", "Oliver"].map((seed) => (
                    <div
                      key={seed}
                      onClick={() => { setAvatarSeed(seed); setAvatarUrl(""); }}
                      className={`cursor-pointer w-12 h-12 rounded-full overflow-hidden border-2 transition-all ${avatarSeed === seed ? "border-blue-500 scale-110 shadow-md" : "border-transparent opacity-60 hover:opacity-100"}`}
                      style={avatarSeed === seed ? { borderColor: displayAccent } : {}}
                    >
                      <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}`} alt={seed} className="w-full h-full object-cover bg-slate-100" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full mt-4 space-y-3">
              
              <div className="w-full h-px bg-slate-200 dark:bg-slate-800 my-4" />
              
              {onLogout && (
                <button onClick={onLogout} className="w-full py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-center gap-2">
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              )}
              <button onClick={handleDeleteAccount} disabled={deleting} className="w-full py-2 rounded-xl text-xs font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition flex items-center justify-center gap-2">
                <Trash2 className="w-4 h-4" /> {deleting ? "Deleting..." : "Delete Account"}
              </button>
            </div>
          )}
        </div>

        {/* Social - Right Column (All Text Details) */}
        <div className="w-full md:w-2/3 p-5 md:p-8 flex flex-col">
          {!isEditing ? (
            <div className="flex flex-col gap-6">
              <div className="flex items-start justify-between">
                <div className="min-w-0 pr-2">
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white truncate">
                    {editUsername}
                  </h2>
                  <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-mono mt-1 truncate">{editEmail}</p>
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 md:px-4 md:py-1.5 rounded-full border-2 font-bold text-xs transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 shrink-0 flex items-center justify-center"
                  style={{ borderColor: displayAccent, color: displayAccent }}
                  title="Edit Profile"
                >
                  <Pencil className="w-4 h-4 md:w-3 md:h-3 md:hidden" />
                  <span className="hidden md:inline">Edit Profile</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-300">
                {location && (
                  <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-100 dark:border-slate-800">
                    <MapPin className="w-4 h-4 text-slate-400" /> {location}
                  </div>
                )}
                {dob && (
                  <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-100 dark:border-slate-800">
                    <Calendar className="w-4 h-4 text-slate-400" /> Born {dob}
                  </div>
                )}
                {website && (
                  <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-100 dark:border-slate-800">
                    <Globe className="w-4 h-4 text-slate-400" /> 
                    <a href={website} target="_blank" rel="noreferrer" className="hover:underline text-blue-500">{website.replace(/^https?:\/\//, '')}</a>
                  </div>
                )}
              </div>

              <div className="mt-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 uppercase tracking-wider text-slate-500">About Me</h3>
                {bio ? (
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">{bio}</p>
                ) : (
                  <p className="text-slate-400 dark:text-slate-500 italic p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 border-dashed">No bio provided yet.</p>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col gap-5 animate-fade-in">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3">Edit Details</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-500">Username</label>
                  <input type="text" value={editUsername} onChange={(e) => setEditUsername(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-bold focus:outline-none focus:border-blue-500 transition-colors" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-500">Email Address (Cannot be changed)</label>
                  <input type="email" value={editEmail} disabled className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-500 dark:text-slate-400 focus:outline-none cursor-not-allowed transition-colors" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-500">Location</label>
                  <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-500">Date of Birth</label>
                  <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500">Website URL</label>
                <input type="text" value={website} onChange={(e) => setWebsite(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors" placeholder="https://" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors resize-none h-28"
                  placeholder="Tell us about yourself..."
                />
              </div>

              {infoError && <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm mt-2 font-semibold">{infoError}</div>}

              <div className="mt-auto pt-6 flex justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
                <button type="button" onClick={handleCancel} disabled={saving} className="px-6 py-2.5 rounded-full font-bold text-sm bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition">Cancel</button>
                <button type="button" onClick={handleSave} disabled={saving} className="px-8 py-2.5 rounded-full font-bold text-sm text-white shadow-lg transition hover:brightness-110 flex items-center gap-2" style={{ backgroundColor: displayAccent }}>
                  {saving ? <Cpu className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --------------- GAMING THEME ---------------
  return (
    <div className="bg-slate-50 dark:bg-[#0f111a] border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden relative animate-fade-in text-slate-900 dark:text-slate-200 font-mono transition-colors">
      {/* Banner / Cover */}
      <div 
        className="h-24 md:h-32 w-full relative border-b border-slate-200 dark:border-white/10 transition-colors duration-500"
        style={{ backgroundColor: displayAccent }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-[#0f111a] via-slate-50/50 dark:via-[#0f111a]/50 to-transparent opacity-80" />
      </div>

      <div className="px-4 pb-8 md:px-10 flex flex-col md:flex-row relative z-10 -mt-12 gap-6 md:gap-8">
        
        {/* Gaming - Left Sidebar (Visuals & Actions) */}
        <div className="w-full md:w-1/4 flex flex-col items-center md:items-start shrink-0">
          <div className="relative group w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40">
            <div className="w-full h-full rounded-xl bg-white dark:bg-black border-4 object-cover overflow-hidden relative z-10" style={{ borderColor: displayAccent, boxShadow: `0 0 20px ${displayAccent}40` }}>
              <img src={displayAvatarUrl} alt={editUsername} className="w-full h-full object-cover" />
            </div>
            {isEditing && (
              <button
                type="button"
                onClick={handleAvatarChangeClick}
                className="absolute inset-0 m-auto w-10 h-10 bg-black/60 dark:bg-black/80 backdrop-blur-sm text-white rounded-lg flex items-center justify-center hover:bg-black/80 dark:hover:bg-white/20 transition-colors z-20"
                title="Change Avatar URL"
              >
                <Camera className="w-5 h-5" />
              </button>
            )}
          </div>

          {isEditing ? (
            <div className="w-full space-y-6 mt-8">
              {/* Accent Color Selection */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-slate-500 dark:text-white/40 uppercase tracking-widest">Accent Core</label>
                <div className="flex items-center gap-3 bg-slate-200 dark:bg-white/5 border border-slate-300 dark:border-white/10 p-2 rounded">
                  <input
                    type="color"
                    value={displayAccent}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border-0 p-0 bg-transparent"
                  />
                  <button type="button" onClick={() => setAccentColor("")} className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-white/40 hover:text-slate-900 dark:hover:text-white transition">Reset Default</button>
                </div>
              </div>

              {/* Avatar Seed Selection */}
              <div className="flex flex-col gap-2 w-full">
                <label className="text-[10px] font-bold text-slate-500 dark:text-white/40 uppercase tracking-widest">Avatar Seed</label>
                <div className="grid grid-cols-3 gap-2 w-full">
                  {["Felix", "Aneka", "Jasper", "Bandit", "Luna", "Oliver"].map((seed) => (
                    <div
                      key={seed}
                      onClick={() => { setAvatarSeed(seed); setAvatarUrl(""); }}
                      className={`cursor-pointer aspect-square rounded overflow-hidden border-2 transition-all ${avatarSeed === seed ? "scale-105 shadow-md dark:shadow-[0_0_15px_rgba(255,255,255,0.3)]" : "border-transparent opacity-50 hover:opacity-100"}`}
                      style={avatarSeed === seed ? { borderColor: displayAccent } : {}}
                    >
                      <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}`} alt={seed} className="w-full h-full object-cover bg-white" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full mt-6 space-y-4">
              <div className="w-full h-px bg-slate-200 dark:bg-white/10 mb-6" />

              <div className="w-full space-y-2">
                {onLogout && (
                  <button onClick={onLogout} className="w-full py-2 rounded text-[10px] font-bold tracking-widest uppercase text-slate-500 dark:text-white/40 hover:bg-slate-200 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition flex justify-center items-center gap-2">
                    <LogOut className="w-3 h-3" /> Disconnect
                  </button>
                )}
                <button onClick={handleDeleteAccount} disabled={deleting} className="w-full py-2 rounded text-[10px] font-bold tracking-widest uppercase text-red-500 hover:bg-red-100 dark:hover:bg-red-950/40 hover:text-red-600 dark:hover:text-red-500 transition flex justify-center items-center gap-2">
                  <Trash2 className="w-3 h-3" /> Delete Data
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Gaming - Right Main Area (All Text Details) */}
        <div className="w-full md:w-3/4 pt-2 md:pt-12 flex flex-col min-w-0">
          {!isEditing ? (
            <div className="flex flex-col gap-6 md:gap-8 h-full">
              <div className="flex items-start justify-between">
                <div className="min-w-0 pr-2">
                  <h2 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-wider drop-shadow-md truncate">
                    {editUsername}
                  </h2>
                  <div className="flex flex-wrap items-center gap-2 md:gap-4 mt-1 md:mt-2">
                    <p className="text-xs md:text-sm text-slate-600 dark:text-white/50 truncate max-w-full">{editEmail}</p>
                    <div className="inline-flex items-center px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest shrink-0" style={{ backgroundColor: `${displayAccent}20`, color: displayAccent, border: `1px solid ${displayAccent}50` }}>
                      LVL. 99
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 md:px-4 md:py-2 rounded bg-slate-200 dark:bg-white/5 hover:bg-slate-300 dark:hover:bg-white/10 border border-slate-300 dark:border-white/20 font-bold text-[10px] uppercase tracking-widest transition-colors flex justify-center items-center gap-2 text-slate-700 dark:text-white shrink-0 md:mt-2"
                  title="Edit Profile"
                >
                  <Pencil className="w-4 h-4 md:w-3 md:h-3" /> 
                  <span className="hidden md:inline">Edit Profile</span>
                </button>
              </div>

              {/* Quick Stats / Info Row */}
              <div className="flex flex-wrap gap-x-4 md:gap-x-8 gap-y-4 bg-slate-100 dark:bg-black/30 border border-slate-200 dark:border-white/5 p-4 rounded-xl">
                {location && (
                  <div className="flex flex-col">
                    <span className="text-slate-400 dark:text-white/30 uppercase font-black tracking-widest text-[9px] mb-1">Location</span>
                    <span className="text-slate-700 dark:text-white/90 text-xs font-semibold">{location}</span>
                  </div>
                )}
                {dob && (
                  <div className="flex flex-col">
                    <span className="text-slate-400 dark:text-white/30 uppercase font-black tracking-widest text-[9px] mb-1">DOB</span>
                    <span className="text-slate-700 dark:text-white/90 text-xs font-semibold">{dob}</span>
                  </div>
                )}
                {website && (
                  <div className="flex flex-col">
                    <span className="text-slate-400 dark:text-white/30 uppercase font-black tracking-widest text-[9px] mb-1">Website</span>
                    <a href={website} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline text-xs">{website.replace(/^https?:\/\//, '')}</a>
                  </div>
                )}
              </div>

              {/* Bio Section */}
              <div className="flex-1">
                <h3 className="text-[10px] font-black text-slate-500 dark:text-white/40 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: displayAccent }} />
                  Bio Data
                </h3>
                {bio ? (
                  <p className="text-slate-700 dark:text-white/80 leading-relaxed font-sans text-sm p-5 bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl">{bio}</p>
                ) : (
                  <div className="flex items-center justify-center p-8 border-2 border-dashed border-slate-300 dark:border-white/10 rounded-xl bg-slate-100 dark:bg-black/20">
                    <p className="text-slate-400 dark:text-white/30 text-xs uppercase tracking-widest font-black">No Bio Data Available</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl p-6 h-full flex flex-col gap-6 animate-fade-in shadow-lg dark:shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-300 dark:border-white/10 pb-4">
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-blue-500" style={{ color: displayAccent }} /> System Config
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-white/40 uppercase tracking-widest">Username</label>
                  <input type="text" value={editUsername} onChange={(e) => setEditUsername(e.target.value)} className="w-full bg-white dark:bg-black/50 border border-slate-300 dark:border-white/20 rounded px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-slate-500 dark:focus:border-white transition-colors uppercase font-bold tracking-wider" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-white/40 uppercase tracking-widest">Email Address (Locked)</label>
                  <input type="email" value={editEmail} disabled className="w-full bg-slate-100 dark:bg-black/30 border border-slate-300 dark:border-white/10 rounded px-4 py-2.5 text-sm text-slate-500 dark:text-white/30 focus:outline-none cursor-not-allowed transition-colors" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-white/40 uppercase tracking-widest">Location</label>
                  <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full bg-white dark:bg-black/50 border border-slate-300 dark:border-white/20 rounded px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-slate-500 dark:focus:border-white transition-colors" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-white/40 uppercase tracking-widest">Date of Birth</label>
                  <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="w-full bg-white dark:bg-black/50 border border-slate-300 dark:border-white/20 rounded px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-slate-500 dark:focus:border-white transition-colors" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 dark:text-white/40 uppercase tracking-widest">Website URL</label>
                <input type="text" value={website} onChange={(e) => setWebsite(e.target.value)} className="w-full bg-white dark:bg-black/50 border border-slate-300 dark:border-white/20 rounded px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-slate-500 dark:focus:border-white transition-colors" placeholder="https://" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 dark:text-white/40 uppercase tracking-widest">Bio Data Input</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-white dark:bg-black/50 border border-slate-300 dark:border-white/20 rounded px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-slate-500 dark:focus:border-white resize-none h-28 font-sans transition-colors"
                  placeholder="Enter biography..."
                />
              </div>

              {infoError && <div className="p-3 bg-red-100 dark:bg-red-950/50 border border-red-200 dark:border-red-500/50 text-red-600 dark:text-red-500 rounded text-xs mt-2 uppercase tracking-wide font-bold">{infoError}</div>}

              <div className="mt-auto pt-4 flex justify-end gap-4 border-t border-slate-300 dark:border-white/10 mt-6">
                <button type="button" onClick={handleCancel} disabled={saving} className="px-6 py-2.5 rounded text-[10px] font-bold uppercase tracking-widest text-slate-600 dark:text-white/50 hover:text-slate-900 hover:bg-slate-200 dark:hover:text-white dark:hover:bg-white/10 transition">Abort</button>
                <button type="button" onClick={handleSave} disabled={saving} className="px-8 py-2.5 rounded text-xs font-black uppercase tracking-widest text-white dark:text-black transition shadow-md dark:shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:shadow-lg dark:hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] flex items-center gap-2" style={{ backgroundColor: displayAccent }}>
                  {saving ? <Cpu className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} {saving ? "Applying..." : "Initialize"}
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
