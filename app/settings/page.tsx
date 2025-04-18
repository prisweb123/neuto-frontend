"use client";
import AdminLayout from "@/components/layout/admin-layout";
import { useAuth } from "@/contexts/auth-context";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

interface UserProfile {
  name: string;
  email: string;
  mobile: string;
  companyName?: string;
  address?: string;
  postalCode?: string;
  city?: string;
  country?: string;
  organizationNumber?: string;
  logo?: string;
}

interface PasswordData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function SettingPage() {
  const { user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const [profile, setProfile] = useState<UserProfile>({
    name: user?.name || "",
    email: "",
    mobile: "",
    companyName: "",
    address: "",
    postalCode: "",
    city: "",
    country: "",
    organizationNumber: "",
    logo: "",
  });

  const [passwordData, setPasswordData] = useState<PasswordData>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  useEffect(() => {
    if (user?.name) {
      fetchUserProfile();
    }
  }, [user?.name]);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${BASE_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setProfile(data.data);
        if (data.data.logo) {
          setPreviewUrl(data.data.logo);
        }
      }
    } catch (error) {
      toast.error("Failed to fetch profile data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const formData = new FormData();
      Object.entries(profile).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });
      if (logoFile) {
        formData.append("logo", logoFile);
      }

      const response = await fetch(`${BASE_URL}/users/${user?.name}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Profile updated successfully");
        fetchUserProfile();
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${BASE_URL}/users/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Password changed successfully");
        setPasswordData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        toast.error(data.message || "Failed to change password");
      }
    } catch (error) {
      toast.error("Failed to change password");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title="Settings">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Settings">
      {user?.role === "admin" ? (
        <>
          <form onSubmit={handleProfileSubmit}>
            <div className="grid grid-cols-2 gap-4 mb-6 border rounded-lg p-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name
                </label>
                <input
                  name="companyName"
                  value={profile.companyName}
                  onChange={handleProfileChange}
                  className="text-[#1C1C1C80] rounded-md px-2 hover:text-black border focus:bg-[#C7DEE2] bg-white focus:ring-0 focus:border-0 focus:outline-none py-1 w-full"
                  type="text"
                  placeholder="Enter company name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  name="address"
                  value={profile.address}
                  onChange={handleProfileChange}
                  className="text-[#1C1C1C80] rounded-md px-2 hover:text-black border focus:bg-[#C7DEE2] bg-white focus:ring-0 focus:border-0 focus:outline-none py-1 w-full"
                  type="text"
                  placeholder="Enter address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Postal Code & City
                </label>
                <input
                  name="postalCode"
                  value={profile.postalCode}
                  onChange={handleProfileChange}
                  className="text-[#1C1C1C80] rounded-md px-2 hover:text-black border focus:bg-[#C7DEE2] bg-white focus:ring-0 focus:border-0 focus:outline-none py-1 w-full"
                  type="text"
                  placeholder="Enter postal code and city"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <input
                  name="country"
                  value={profile.country}
                  onChange={handleProfileChange}
                  className="text-[#1C1C1C80] rounded-md px-2 hover:text-black border focus:bg-[#C7DEE2] bg-white focus:ring-0 focus:border-0 focus:outline-none py-1 w-full"
                  type="text"
                  placeholder="Enter country"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  name="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                  className="text-[#1C1C1C80] rounded-md px-2 hover:text-black border focus:bg-[#C7DEE2] bg-white focus:ring-0 focus:border-0 focus:outline-none py-1 w-full"
                  type="email"
                  placeholder="Enter email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  name="mobile"
                  value={profile.mobile}
                  onChange={handleProfileChange}
                  className="text-[#1C1C1C80] rounded-md px-2 hover:text-black border focus:bg-[#C7DEE2] bg-white focus:ring-0 focus:border-0 focus:outline-none py-1 w-full"
                  type="text"
                  placeholder="Enter phone number"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Organization Number
                </label>
                <input
                  name="organizationNumber"
                  value={profile.organizationNumber}
                  onChange={handleProfileChange}
                  className="text-[#1C1C1C80] rounded-md px-2 hover:text-black border focus:bg-[#C7DEE2] bg-white focus:ring-0 focus:border-0 focus:outline-none py-1 w-full"
                  type="text"
                  placeholder="Enter organization number"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  name="name"
                  value={profile.name}
                  onChange={handleProfileChange}
                  className="text-[#1C1C1C80] rounded-md px-2 hover:text-black border focus:bg-[#C7DEE2] bg-white focus:ring-0 focus:border-0 focus:outline-none py-1 w-full"
                  type="text"
                  placeholder="Enter name"
                />
              </div>
            </div>

            <div className="mb-6 border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Company Logo</h2>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label
                    htmlFor="logo-upload"
                    className="cursor-pointer inline-block bg-[#1E7B8C] text-white px-4 py-2 rounded-md"
                  >
                    Upload Logo
                  </label>
                  <p className="text-sm text-gray-500 mt-2">
                    Recommended size: 500x210 pixels
                  </p>
                </div>
                {previewUrl && (
                  <div className="w-32 h-32 border rounded-lg overflow-hidden">
                    <img
                      src={previewUrl}
                      alt="Logo preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-[#1E7B8C] text-white px-6 py-2 rounded-md hover:bg-[#1a6b7a] transition-colors"
              >
                Save Profile
              </button>
            </div>
          </form>

          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">Change Password</h2>
            <form onSubmit={handlePasswordSubmit}>
              <div className="grid grid-cols-2 gap-4 border rounded-lg p-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <input
                    name="oldPassword"
                    value={passwordData.oldPassword}
                    onChange={handlePasswordChange}
                    className="text-[#1C1C1C80] rounded-md px-2 hover:text-black border focus:bg-[#C7DEE2] bg-white focus:ring-0 focus:border-0 focus:outline-none py-1 w-full"
                    type="password"
                    placeholder="Enter current password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="text-[#1C1C1C80] rounded-md px-2 hover:text-black border focus:bg-[#C7DEE2] bg-white focus:ring-0 focus:border-0 focus:outline-none py-1 w-full"
                    type="password"
                    placeholder="Enter new password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="text-[#1C1C1C80] rounded-md px-2 hover:text-black border focus:bg-[#C7DEE2] bg-white focus:ring-0 focus:border-0 focus:outline-none py-1 w-full"
                    type="password"
                    placeholder="Confirm new password"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-[#1E7B8C] text-white px-6 py-2 rounded-md hover:bg-[#1a6b7a] transition-colors"
                  >
                    Change Password
                  </button>
                </div>
              </div>
            </form>
          </div>
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      )}
    </AdminLayout>
  );
}
