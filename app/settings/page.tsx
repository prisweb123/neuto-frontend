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

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function SettingPage() {
  const { user, logout } = useAuth();

  const [profile, setProfile] = useState<UserProfile>({
    name: "",
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
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
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
        fetchUserProfile(); // Refresh profile data
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    try {
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
    }
  };

  return (
    <AdminLayout title="Instillinger">
      {user?.role === "admin" ? (
        <>
          <form onSubmit={handleProfileSubmit}>
            <div className="grid grid-cols-2 gap-4 mb-6 border rounded-lg p-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bedriftsnavn
                </label>
                <input
                  name="companyName"
                  value={profile.companyName}
                  onChange={handleProfileChange}
                  className="text-[#1C1C1C80] rounded-md px-2 hover:text-black border focus:bg-[#C7DEE2] bg-white focus:ring-0 focus:border-0 focus:outline-none py-1 w-full"
                  type="text"
                  placeholder="Merhebia Finest AS"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse
                </label>
                <input
                  name="address"
                  value={profile.address}
                  onChange={handleProfileChange}
                  className="text-[#1C1C1C80] rounded-md px-2 hover:text-black border focus:bg-[#C7DEE2] bg-white focus:ring-0 focus:border-0 focus:outline-none py-1 w-full"
                  type="text"
                  placeholder="Vintergata 19"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Post nr & By
                </label>
                <input
                  name="postalCode"
                  value={profile.postalCode}
                  onChange={handleProfileChange}
                  className="text-[#1C1C1C80] rounded-md px-2 hover:text-black border focus:bg-[#C7DEE2] bg-white focus:ring-0 focus:border-0 focus:outline-none py-1 w-full"
                  type="text"
                  placeholder="3048 Drammen"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Land
                </label>
                <input
                  name="country"
                  value={profile.country}
                  onChange={handleProfileChange}
                  className="text-[#1C1C1C80] rounded-md px-2 hover:text-black border focus:bg-[#C7DEE2] bg-white focus:ring-0 focus:border-0 focus:outline-none py-1 w-full"
                  type="text"
                  placeholder="Norge"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-post
                </label>
                <input
                  name="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                  className="text-[#1C1C1C80] rounded-md px-2 hover:text-black border focus:bg-[#C7DEE2] bg-white focus:ring-0 focus:border-0 focus:outline-none py-1 w-full"
                  type="email"
                  placeholder="valon@aneainvest.no"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefon nr
                </label>
                <input
                  name="mobile"
                  value={profile.mobile}
                  onChange={handleProfileChange}
                  className="text-[#1C1C1C80] rounded-md px-2 hover:text-black border focus:bg-[#C7DEE2] bg-white focus:ring-0 focus:border-0 focus:outline-none py-1 w-full"
                  type="text"
                  placeholder="293851"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Organisasjonsnummer
                </label>
                <input
                  name="organizationNumber"
                  value={profile.organizationNumber}
                  onChange={handleProfileChange}
                  className="text-[#1C1C1C80] rounded-md px-2 hover:text-black border focus:bg-[#C7DEE2] bg-white focus:ring-0 focus:border-0 focus:outline-none py-1 w-full"
                  type="text"
                  placeholder="920 922 013 MVA"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Navn
                </label>
                <input
                  name="name"
                  value={profile.name}
                  onChange={handleProfileChange}
                  className="text-[#1C1C1C80] rounded-md px-2 hover:text-black border focus:bg-[#C7DEE2] bg-white focus:ring-0 focus:border-0 focus:outline-none py-1 w-full"
                  type="text"
                  placeholder="Valon Selimi"
                />
              </div>
            </div>
            <h1 className="text-lg font-bold mb-2">Logo</h1>

            <div className="grid grid-cols-2 gap-4 mb-6 border rounded-lg p-6">
              <div className="flex flex-col gap-2">
                Logo*
                <div className="flex gap-4">
                  <div className="border rounded-lg flex justify-center items-center w-full h-full">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="hidden"
                      id="logo-upload"
                    />
                    <label
                      htmlFor="logo-upload"
                      className="cursor-pointer font-bold rounded-full px-3 py-1 text-white bg-[#C7DEE2]"
                    >
                      +
                    </label>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="bg-[#1E7B8C] text-white px-2 py-0.5 rounded-md text-sm mr-auto">
                      Format: JPG, GIF or PNG
                    </div>

                    <div className="flex items-start gap-2">
                      <svg
                        width="50"
                        height="50"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9.375 9.375L9.40957 9.35771C9.88717 9.11891 10.4249 9.55029 10.2954 10.0683L9.70458 12.4317C9.57507 12.9497 10.1128 13.3811 10.5904 13.1423L10.625 13.125M17.5 10C17.5 14.1421 14.1421 17.5 10 17.5C5.85786 17.5 2.5 14.1421 2.5 10C2.5 5.85786 5.85786 2.5 10 2.5C14.1421 2.5 17.5 5.85786 17.5 10ZM10 6.875H10.0063V6.88125H10V6.875Z"
                          stroke="#1C1C1C"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>

                      <div className="text-[#1E7B8C] text-[14px]">
                        For best placement on offer page, it is recommended to
                        upload the file in 500x210 pixels. the uploaded file
                        will be scaled up/down to fit within the above-mentioned
                        frames
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center items-center">
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Logo preview"
                    className="max-w-full max-h-32"
                  />
                )}
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="mt-4 bg-[#1E7B8C] text-white px-4 py-2 rounded-full text-sm"
              >
                Lagre
              </button>
            </div>
          </form>

          <h1 className="text-lg font-bold mb-2">Endre passord</h1>

          <form onSubmit={handlePasswordSubmit}>
            <div className="grid md:grid-cols-3 grid-cols-2 gap-4 border rounded-lg p-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gammel passord
                </label>
                <input
                  name="oldPassword"
                  value={passwordData.oldPassword}
                  onChange={handlePasswordChange}
                  className="text-[#1C1C1C80] rounded-md px-2 hover:text-black border focus:bg-[#C7DEE2] bg-white focus:ring-0 focus:border-0 focus:outline-none py-1 w-full"
                  type="password"
                  placeholder="Skriv din gamle passord"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nytt passord
                </label>
                <input
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="text-[#1C1C1C80] rounded-md px-2 hover:text-black border focus:bg-[#C7DEE2] bg-white focus:ring-0 focus:border-0 focus:outline-none py-1 w-full"
                  type="password"
                  placeholder="Skriv ny passord"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bekreft ny passord
                </label>
                <input
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="text-[#1C1C1C80] rounded-md px-2 hover:text-black border focus:bg-[#C7DEE2] bg-white focus:ring-0 focus:border-0 focus:outline-none py-1 w-full"
                  type="password"
                  placeholder="Gjenta passord"
                />
              </div>
              <div></div>
              <div></div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="mt-4 bg-[#1E7B8C] text-white px-4 py-2 rounded-full text-sm"
                >
                  Endre
                </button>
              </div>
            </div>
          </form>
        </>
      ) : (
        <>
          <form onSubmit={handleProfileSubmit}>
            <div className="grid md:grid-cols-3 grid-cols-2 gap-4 mb-6 border rounded-lg p-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Navn
                </label>
                <input
                  name="name"
                  value={profile.name}
                  onChange={handleProfileChange}
                  className="text-[#1C1C1C80] rounded-full px-2 hover:text-black border focus:bg-[#C7DEE2] bg-white focus:ring-0 focus:border-0 focus:outline-none py-1 w-full"
                  type="text"
                  placeholder="Valon Selimi"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-post
                </label>
                <input
                  name="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                  className="text-[#1C1C1C80] rounded-full px-2 hover:text-black border focus:bg-[#C7DEE2] bg-white focus:ring-0 focus:border-0 focus:outline-none py-1 w-full"
                  type="email"
                  placeholder="valon@aneainvest.no"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefon nr
                </label>
                <input
                  name="mobile"
                  value={profile.mobile}
                  onChange={handleProfileChange}
                  className="text-[#1C1C1C80] rounded-full px-2 hover:text-black border focus:bg-[#C7DEE2] bg-white focus:ring-0 focus:border-0 focus:outline-none py-1 w-full"
                  type="text"
                  placeholder="293851"
                />
              </div>
              <div></div>
              <div></div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="mt-4 bg-[#1E7B8C] text-white px-4 py-2 rounded-full text-sm"
                >
                  Lagre
                </button>
              </div>
            </div>
          </form>

          <h1 className="text-lg font-bold mb-2">Endre passord</h1>

          <form onSubmit={handlePasswordSubmit}>
            <div className="grid md:grid-cols-3 grid-cols-2 gap-4 border rounded-lg p-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gammel passord
                </label>
                <input
                  name="oldPassword"
                  value={passwordData.oldPassword}
                  onChange={handlePasswordChange}
                  className="text-[#1C1C1C80] rounded-full px-2 hover:text-black border focus:bg-[#C7DEE2] bg-white focus:ring-0 focus:border-0 focus:outline-none py-1 w-full"
                  type="password"
                  placeholder="Skriv din gamle passord"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nytt passord
                </label>
                <input
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="text-[#1C1C1C80] rounded-full px-2 hover:text-black border focus:bg-[#C7DEE2] bg-white focus:ring-0 focus:border-0 focus:outline-none py-1 w-full"
                  type="password"
                  placeholder="Skriv ny passord"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bekreft ny passord
                </label>
                <input
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="text-[#1C1C1C80] rounded-full px-2 hover:text-black border focus:bg-[#C7DEE2] bg-white focus:ring-0 focus:border-0 focus:outline-none py-1 w-full"
                  type="password"
                  placeholder="Gjenta passord"
                />
              </div>
              <div></div>
              <div></div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="mt-4 bg-[#1E7B8C] text-white px-4 py-2 rounded-full text-sm"
                >
                  Endre
                </button>
              </div>
            </div>
          </form>
        </>
      )}
    </AdminLayout>
  );
}
