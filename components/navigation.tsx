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
        className="text-gray-700 font-medium"
        onClick={() => setMenuOpen(true)}
      >
        {/* <Menu className="h-5 w-5 mr-1 inline-block" /> */}
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
              : "bg-white text-gray-700 "
          } px-4 py-2 rounded-full flex items-center text-sm`}
        >
          <div
            className={`${
              isActive("/price-offer")
                ? "" //bg-white bg-opacity-20
                : "" //</Link>bg-gray-100
            } p-1 rounded mr-2`}
          >
            <Info className="h-4 w-4" />
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
                  : "bg-white text-gray-700 "
              } px-4 py-2 rounded-full flex items-center text-sm`}
            >
              <div
                className={`${
                  isActive("/add-user")
                    ? "" //bg-white bg-opacity-20
                    : "" //bg-gray-100
                } p-1 rounded mr-2`}
              >
                <UserPlus className="h-4 w-4" />
              </div>
              Opprett bruker
            </Link>

            <Link
              href="/marke-model"
              className={`${
                isActive("/marke-model")
                  ? "bg-[#1E7B8C] text-white"
                  : "bg-white text-gray-700 "
              } px-4 py-2 rounded-full flex items-center text-sm`}
            >
              <div
                className={`${
                  isActive("/marke-model")
                    ? "" //bg-white bg-opacity-20
                    : "" //bg-gray-100
                } p-1 rounded mr-2`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect width="18" height="12" x="3" y="6" rx="2" />
                  <path d="M3 10h18" />
                </svg>
              </div>
              Merke & Modell
            </Link>

            <Link
              href="/products"
              className={`${
                isActive("/products")
                  ? "bg-[#1E7B8C] text-white"
                  : "bg-white text-gray-700 "
              } px-4 py-2 rounded-full flex items-center text-sm`}
            >
              <div
                className={`${
                  isActive("/products")
                    ? "" //bg-white bg-opacity-20
                    : "" //bg-gray-100
                } p-1 rounded mr-2`}
              >
                <Package className="h-4 w-4" />
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
              : "bg-white text-gray-700 "
          } px-4 py-2 rounded-full flex items-center text-sm`}
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
          Oversikt over tilbud
        </Link>
      </div>

      <div className="flex items-center bg-white rounded-full px-4 ">
        <span className="text-black mr-2 ">{user?.name || "Guest"}</span>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center"
          >
            <ChevronDown className="h-4 w-4 text-black cursor-pointer" />
          </button>
          <div
            className={`absolute right-0 mt-2 w-48 bg-white rounded-full shadow-lg py-1 z-10 ${
              dropdownOpen ? "block" : "hidden"
            }`}
          >
            <div className="px-4 py-2 text-sm text-gray-700">
              <div className="font-medium">{user?.name}</div>
              <div className="text-xs text-gray-500">{user?.email}</div>
            </div>
            <button
              onClick={() => {
                logout();
                setDropdownOpen(false);
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
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
