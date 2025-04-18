"use client";

import {
  ChevronDown,
  Menu,
  Info,
  UserPlus,
  Package,
  MessageSquare,
  LogOut,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SidebarMenu from "./layout/sidebar-menu";
import { useAuth } from "@/contexts/auth-context";

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <header className="bg-[#f3f4f4] p-4  flex items-center justify-between relative">
      <button
        className="text-gray-700 font-medium text-sm font-['Onest']"
        onClick={() => setMenuOpen(true)}
      >
        MENU
      </button>

      {/* Sidebar Menu */}
      <SidebarMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      <div className="flex items-center gap-2 overflow-x-auto flex-1 justify-center px-4">
        <Link
          href="/price-offer"
          className={`${
            isActive("/price-offer")
              ? "bg-[#1E7B8C] text-white"
              : "bg-white text-gray-700"
          } px-4 py-2 rounded-full flex items-center text-sm font-['Onest'] font-medium`}
        >
          <div className="p-1 rounded mr-2">
            <svg width="23" height="22" viewBox="0 0 23 22" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
              <path 
                d="M11.5 5.5V16.5M8.75 13.9167L9.55563 14.5209C10.6295 15.3264 12.3707 15.3264 13.4446 14.5209C14.5185 13.7155 14.5185 12.4095 13.4446 11.6041C12.9076 11.2013 12.2037 11 11.4999 11C10.8354 11 10.171 10.7987 9.664 10.3959C8.65008 9.59048 8.65008 8.28457 9.664 7.47912C10.6779 6.67366 12.3218 6.67366 13.3357 7.47912L13.7161 7.78124M19.75 11C19.75 15.5563 16.0563 19.25 11.5 19.25C6.94365 19.25 3.25 15.5563 3.25 11C3.25 6.44365 6.94365 2.75 11.5 2.75C16.0563 2.75 19.75 6.44365 19.75 11Z" 
                stroke={isActive("/price-offer") ? "white" : "#1E7B8C"}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          Nytt Tilbud
        </Link>

        {user?.role === "admin" && (
          <>
            <Link
              href="/add-user"
              className={`${
                isActive("/add-user")
                  ? "bg-[#1E7B8C] text-white"
                  : "bg-white text-gray-700"
              } px-4 py-2 rounded-full flex items-center text-sm font-['Onest'] font-medium text-base`}
            >
              <div className="p-1 rounded mr-2">
                <svg width="23" height="22" viewBox="0 0 23 22" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                  <path 
                    d="M17 17.1592C17.2269 17.1779 17.4564 17.1875 17.6881 17.1875C18.6491 17.1875 19.5717 17.0232 20.4293 16.7212C20.4351 16.6482 20.4381 16.5744 20.4381 16.5C20.4381 14.9812 19.2069 13.75 17.6881 13.75C17.1128 13.75 16.5787 13.9267 16.1372 14.2287M17 17.1592C17.0001 17.1686 17.0001 17.1781 17.0001 17.1875C17.0001 17.3937 16.9887 17.5973 16.9666 17.7977C15.3562 18.7217 13.4898 19.25 11.5001 19.25C9.51028 19.25 7.64389 18.7217 6.03353 17.7977C6.01141 17.5973 6.00006 17.3937 6.00006 17.1875C6.00006 17.1781 6.00008 17.1687 6.00013 17.1593M17 17.1592C16.9946 16.0807 16.6787 15.0756 16.1372 14.2287M16.1372 14.2287C15.1601 12.7006 13.4484 11.6875 11.5001 11.6875C9.55196 11.6875 7.84041 12.7003 6.86328 14.2281M6.86328 14.2281C6.42194 13.9264 5.88819 13.75 5.31323 13.75C3.79445 13.75 2.56323 14.9812 2.56323 16.5C2.56323 16.5744 2.56619 16.6482 2.572 16.7212C3.42966 17.0232 4.35226 17.1875 5.31323 17.1875C5.54455 17.1875 5.77364 17.178 6.00013 17.1593M6.86328 14.2281C6.32154 15.0752 6.00555 16.0805 6.00013 17.1593M14.2501 6.1875C14.2501 7.70628 13.0188 8.9375 11.5001 8.9375C9.98128 8.9375 8.75006 7.70628 8.75006 6.1875C8.75006 4.66872 9.98128 3.4375 11.5001 3.4375C13.0188 3.4375 14.2501 4.66872 14.2501 6.1875ZM19.7501 8.9375C19.7501 10.0766 18.8266 11 17.6876 11C16.5485 11 15.6251 10.0766 15.6251 8.9375C15.6251 7.79841 16.5485 6.875 17.6876 6.875C18.8266 6.875 19.7501 7.79841 19.7501 8.9375ZM7.37506 8.9375C7.37506 10.0766 6.45165 11 5.31256 11C4.17347 11 3.25006 10.0766 3.25006 8.9375C3.25006 7.79841 4.17347 6.875 5.31256 6.875C6.45165 6.875 7.37506 7.79841 7.37506 8.9375Z" 
                    stroke={isActive("/add-user") ? "white" : "#1E7B8C"}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              Brukere


            </Link>

            <Link
              href="/marke-model"
              className={`${
                isActive("/marke-model")
                  ? "bg-[#1E7B8C] text-white"
                  : "bg-white text-gray-700"
              } px-4 py-2 rounded-full flex items-center text-sm font-['Onest'] font-medium text-base`}
            >
              <div className="p-1 rounded mr-2">
              <svg width="23" height="22" viewBox="0 0 23 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path 
                  d="M8.0625 17.1875C8.0625 17.9469 7.44689 18.5625 6.6875 18.5625C5.92811 18.5625 5.3125 17.9469 5.3125 17.1875M8.0625 17.1875C8.0625 16.4281 7.44689 15.8125 6.6875 15.8125C5.92811 15.8125 5.3125 16.4281 5.3125 17.1875M8.0625 17.1875H13.5625M5.3125 17.1875H3.59375C3.02421 17.1875 2.5625 16.7258 2.5625 16.1563V13.0629M18.375 17.1875C18.375 17.9469 17.7594 18.5625 17 18.5625C16.2406 18.5625 15.625 17.9469 15.625 17.1875M18.375 17.1875C18.375 16.4281 17.7594 15.8125 17 15.8125C16.2406 15.8125 15.625 16.4281 15.625 17.1875M18.375 17.1875L19.4062 17.1875C19.9758 17.1875 20.4409 16.7252 20.4058 16.1568C20.2133 13.0331 19.1517 10.1446 17.4598 7.7301C17.1278 7.25626 16.5902 6.97376 16.0124 6.94206H13.5625M15.625 17.1875H13.5625M13.5625 6.94206V6.06356C13.5625 5.54336 13.1752 5.10327 12.6578 5.04958C11.1474 4.89284 9.61433 4.8125 8.0625 4.8125C6.51067 4.8125 4.9776 4.89284 3.46723 5.04958C2.94981 5.10327 2.5625 5.54336 2.5625 6.06356V13.0629M13.5625 6.94206V13.0629M13.5625 17.1875V13.0629M13.5625 13.0629H2.5625"
                  stroke={isActive("/marke-model") ? "white" : "#1E7B8C"}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>


</div>
              Merke & Modell
            </Link>

            <Link
              href="/products"
              className={`${
                isActive("/products")
                  ? "bg-[#1E7B8C] text-white"
                  : "bg-white text-gray-700"
              } px-4 py-2 rounded-full flex items-center text-sm font-['Onest'] font-medium text-base`}
            >
            <div className="p-1 rounded mr-2">
              <svg width="23" height="22" viewBox="0 0 23 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.93749 8.96135C4.04019 8.94566 4.14557 8.9375 4.25307 8.9375H18.7469C18.8544 8.9375 18.9598 8.94566 19.0625 8.96135M3.93749 8.96135C2.84115 9.1289 2.049 10.1556 2.2113 11.2917L2.99702 16.7917C3.14217 17.8078 4.01238 18.5625 5.03879 18.5625H17.9612C18.9876 18.5625 19.8578 17.8078 20.003 16.7917L20.7887 11.2917C20.951 10.1556 20.1588 9.1289 19.0625 8.96135M3.93749 8.96135V5.5C3.93749 4.36091 4.8609 3.4375 5.99999 3.4375H9.55545C9.92012 3.4375 10.2699 3.58237 10.5277 3.84023L12.4723 5.78477C12.7301 6.04263 13.0799 6.1875 13.4445 6.1875H17C18.1391 6.1875 19.0625 7.11091 19.0625 8.25V8.96135"
                  stroke={isActive("/products") ? "white" : "#1E7B8C"}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>


</div>
              Tjenester
            </Link>
          </>
        )}
        <Link
          href="/offer"
          className={`${
            isActive("/offer")
              ? "bg-[#1E7B8C] text-white"
              : "bg-white text-gray-700"
          } px-4 py-2 rounded-full flex items-center text-sm font-['Onest'] font-medium text-base`}
        >
          <div
            className={`${
              isActive("/offer")
                ? "" //bg-white bg-opacity-20
                : "" //bg-gray-100
            } p-1 rounded mr-2`}
          >
            <MessageSquare className="h-4 w-4" />
          </div>
          Tilbudsoversikt        </Link>
      </div>
      <div className="w-[1px] h-9 bg-[#1C1C1C] bg-opacity-20 mr-4"></div>
      <div className="flex items-center bg-white rounded-full px-4 py-2">
        <span className="text-black mr-2 font-['Onest'] text-sm font-medium">{user?.name || "Guest"}</span>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center"
          >
            <ChevronDown className="h-4 w-4 text-black cursor-pointer" />
          </button>
          <div
            className={`absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10 ${
              dropdownOpen ? "block" : "hidden"
            }`}
          >
            <div className="px-4 py-2 text-sm text-gray-700 font-['Onest']">
              <div className="font-medium">{user?.name}</div>
              <div className="text-xs text-gray-500">{user?.email}</div>
            </div>
            <button
              onClick={() => {
                logout();
                setDropdownOpen(false);
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-['Onest']"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logg ut
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}