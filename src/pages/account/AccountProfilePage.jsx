import { useState } from 'react';
import { User, Mail, Phone, Lock, Camera, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';
import { setMockUser } from '../../features/auth/authSlice';
import AccountLayout from '../../components/account/AccountLayout';
import Input from '../../components/forms/Input';
import Button from '../../components/common/Button';

export const AccountProfilePage = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();

  // Profile fields
  const [name, setName] = useState(user?.name || 'Sarah Jenkins');
  const [email, setEmail] = useState(user?.email || 'sarah.jenkins@example.com');
  const [phone, setPhone] = useState('+1 (555) 019-2834');
  const [avatar, setAvatar] = useState(
    user?.avatar ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop'
  );
  const [bio, setBio] = useState('Patron of high jewelry and haute horology masterworks.');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Password strength check
  const passwordChecks = {
    length: newPassword.length >= 8,
    hasUpper: /[A-Z]/.test(newPassword),
    hasNumber: /[0-9]/.test(newPassword),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
  };

  const handleAvatarChange = () => {
    // Demo avatar rotation
    const samples = [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=300&auto=format&fit=crop',
    ];
    const nextIdx = (samples.indexOf(avatar) + 1) % samples.length;
    setAvatar(samples[nextIdx]);
    toast.success('Avatar updated.');
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSavingProfile(true);
    await new Promise((res) => setTimeout(res, 500));

    dispatch(
      setMockUser({
        ...user,
        name: name.trim(),
        email: email.trim(),
        avatar,
      })
    );

    setIsSavingProfile(false);
    toast.success('Patron profile credentials saved.');
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');

    if (!currentPassword) {
      setPasswordError('Current security password is required.');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setIsSavingPassword(true);
    await new Promise((res) => setTimeout(res, 600));

    setIsSavingPassword(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    toast.success('Password successfully updated.');
  };

  return (
    <AccountLayout>
      <div className="space-y-8">
        {/* Profile Information Form Card */}
        <div className="bg-surface rounded-2xl border border-border p-6 sm:p-8 space-y-6 shadow-subtle">
          <div className="pb-4 border-b border-border">
            <h2 className="font-serif font-bold text-lg text-text-main">
              Personal Information & Registry Profile
            </h2>
            <p className="text-xs text-text-muted">
              Manage your patron name, contact coordinates, and concierge profile.
            </p>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-6">
            {/* Avatar Uploader UI */}
            <div className="flex items-center gap-5">
              <div className="relative">
                <img
                  src={avatar}
                  alt={name}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-accent shadow-xs"
                />
                <button
                  type="button"
                  onClick={handleAvatarChange}
                  className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-primary text-white hover:bg-accent border-2 border-surface shadow-xs transition-colors cursor-pointer"
                  title="Change avatar photo"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <span className="text-xs font-bold text-text-main block">Patron Portrait</span>
                <p className="text-[11px] text-text-muted">
                  Click the camera icon to select a sovereign avatar.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                id="profile-name"
                label="Full Name"
                placeholder="Sarah Jenkins"
                value={name}
                onChange={(e) => setName(e.target.value)}
                icon={User}
                required
              />

              <div className="space-y-1">
                <Input
                  id="profile-email"
                  type="email"
                  label="Registered Email Address"
                  placeholder="sarah.jenkins@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon={Mail}
                  required
                />
                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  Cryptographically Verified
                </span>
              </div>
            </div>

            <Input
              id="profile-phone"
              type="tel"
              label="Contact Telephone"
              placeholder="+1 (555) 019-2834"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              icon={Phone}
              required
            />

            <div>
              <label className="text-xs font-semibold text-text-main block mb-1">
                Concierge Preferences & Notes
              </label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Specific sizing, delivery notes, or artisan preferences..."
                className="w-full px-3.5 py-2.5 text-xs bg-surface border border-border rounded-xl focus:outline-none focus:border-text-main text-text-main resize-none"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <Button type="submit" variant="primary" size="md" loading={isSavingProfile}>
                Save Profile Changes
              </Button>
            </div>
          </form>
        </div>

        {/* Password Security Form Card */}
        <div className="bg-surface rounded-2xl border border-border p-6 sm:p-8 space-y-6 shadow-subtle">
          <div className="pb-4 border-b border-border">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-accent" />
              <h2 className="font-serif font-bold text-lg text-text-main">
                Security & Password Update
              </h2>
            </div>
            <p className="text-xs text-text-muted">
              Ensure your sovereign credentials remain guarded with robust encryption standards.
            </p>
          </div>

          {passwordError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{passwordError}</span>
            </div>
          )}

          <form onSubmit={handleSavePassword} className="space-y-4">
            <Input
              id="current-password"
              type="password"
              label="Current Password"
              placeholder="••••••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              icon={Lock}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                id="new-password"
                type="password"
                label="New Password"
                placeholder="••••••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                icon={Lock}
                required
              />

              <Input
                id="confirm-new-password"
                type="password"
                label="Confirm New Password"
                placeholder="••••••••••••"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                icon={Lock}
                required
              />
            </div>

            {/* Password checklist */}
            {newPassword && (
              <div className="p-3 bg-surface-muted rounded-xl border border-border grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-text-muted">
                <div className={`flex items-center gap-1 ${passwordChecks.length ? 'text-emerald-600 font-semibold' : ''}`}>
                  <CheckCircle2 className={`w-3.5 h-3.5 ${passwordChecks.length ? 'text-emerald-500' : 'text-text-subtle'}`} />
                  <span>8+ Chars</span>
                </div>
                <div className={`flex items-center gap-1 ${passwordChecks.hasUpper ? 'text-emerald-600 font-semibold' : ''}`}>
                  <CheckCircle2 className={`w-3.5 h-3.5 ${passwordChecks.hasUpper ? 'text-emerald-500' : 'text-text-subtle'}`} />
                  <span>Uppercase</span>
                </div>
                <div className={`flex items-center gap-1 ${passwordChecks.hasNumber ? 'text-emerald-600 font-semibold' : ''}`}>
                  <CheckCircle2 className={`w-3.5 h-3.5 ${passwordChecks.hasNumber ? 'text-emerald-500' : 'text-text-subtle'}`} />
                  <span>Number</span>
                </div>
                <div className={`flex items-center gap-1 ${passwordChecks.hasSpecial ? 'text-emerald-600 font-semibold' : ''}`}>
                  <CheckCircle2 className={`w-3.5 h-3.5 ${passwordChecks.hasSpecial ? 'text-emerald-500' : 'text-text-subtle'}`} />
                  <span>Symbol</span>
                </div>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <Button type="submit" variant="secondary" size="md" loading={isSavingPassword}>
                Update Security Password
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AccountLayout>
  );
};

export default AccountProfilePage;
