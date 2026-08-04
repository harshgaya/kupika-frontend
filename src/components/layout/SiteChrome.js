"use client";
import { usePathname } from "next/navigation";
import Header from "@/src/components/home/navigation/header";
import Footer from "@/src/components/home/navigation/footer";
import FloatingContactButtons from "@/src/components/home/navigation/floating-button";
import TopMostHeader from "@/src/components/home/navigation/top-most-header";
import ClientTracker from "@/src/components/home/navigation/client-track";
export default function SiteChrome({children}) { const pathname=usePathname(); if(pathname?.startsWith('/admin')) return <>{children}</>; return <><TopMostHeader/><Header/><ClientTracker/>{children}<FloatingContactButtons/><Footer/></>; }
