"use client";

import { memo, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SignInButton, UserAvatar, UserButton, useClerk, useUser } from "@clerk/nextjs";
import { ArrowRight, ChevronDown, Heart, LogOut, Menu, Phone, User, X } from "lucide-react";
import styles from "./navigation.module.css";

const villas = [
  { label: "All Luxury Villas", href: "/villas" },
  { label: "The Angle House (Lonavala)", href: "/villa/the-angle-house" },
  { label: "Canopy Crest (Khopoli)", href: "/villa/canopy-crest" },
  { label: "Willow Peak (Lonavala)", href: "/villa/willow-peak" },
  { label: "Casa De Reva (Panchgani)", href: "/villa/casa-de-reva" },
];
const destinations = [
  { label: "Destinations Hub", href: "/destinations" },
  { label: "Lonavala Villas", href: "/areas/lonavala" },
  { label: "Khopoli Villas", href: "/areas/khopoli" },
  { label: "Panchgani Villas", href: "/areas/panchgani" },
  { label: "All Destination Areas", href: "/areas" },
];
const company = [
  { label: "About Us", href: "/about" },
  { label: "Partner / List Property", href: "/partner" },
  { label: "Contact Concierge", href: "/contact" },
  { label: "Saved Wishlist", href: "/wishlist" },
];
const explore = [
  { label: "Experiences", href: "/experiences" },
  { label: "Stories", href: "/stories" },
  { label: "Blog", href: "/blog" },
];

function Brand({ light = false }: { light?: boolean }) {
  return <span className={`${styles.brand} ${light ? styles.lightBrand : ""}`}><Image src="/images/stay-willas-emblem.webp" alt="" width={44} height={44} className={styles.logo} /><span className={styles.brandWords}><strong>STAY WILLAS</strong><small>STAY · RELAX · REPEAT</small></span></span>;
}

function WhatsAppIcon() {
  return <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M12.031 2c-5.524 0-10 4.48-10 10 0 1.956.563 3.784 1.536 5.33l-1.567 5.733 5.86-1.537c1.47.886 3.193 1.404 5.171 1.404 5.524 0 10-4.48 10-10s-4.476-10-10-10zm5.823 14.18c-.227.64-1.303 1.235-1.8 1.297-.453.057-.9-.153-2.9-.947-2.55-1.01-4.18-3.61-4.307-3.78-.127-.17-1.026-1.365-1.026-2.6 0-1.238.647-1.848.878-2.102.23-.254.5-.32.667-.32.167 0 .334.003.48.01.147.007.347-.057.543.418.2.485.687 1.67.747 1.797.06.126.1.273.017.44-.083.167-.123.273-.247.417-.123.143-.26.32-.37.43-.12.12-.247.25-.107.493.14.24.623 1.028 1.337 1.663.918.816 1.69 1.07 1.93 1.19.24.12.38.1.523-.067.143-.167.62-.72.787-.963.167-.243.333-.2.563-.117.23.083 1.46.688 1.71.813.25.127.417.19.477.3.06.11.06.64-.167 1.28z" /></svg>;
}

function ColorTheoryNavigation() {
  const { isSignedIn, isLoaded } = useUser();
  const clerk = useClerk();
  const [isOpen, setIsOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const animationRef = useRef<Animation | null>(null);
  const previousOverflow = useRef("");

  useEffect(() => {
    const update = () => {
      try { const saved = JSON.parse(localStorage.getItem("wishlist") || "[]"); setWishlistCount(Array.isArray(saved) ? saved.length : 0); }
      catch { setWishlistCount(0); }
    };
    const frame = requestAnimationFrame(update);
    window.addEventListener("wishlist-updated", update);
    window.addEventListener("storage", update);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("wishlist-updated", update); window.removeEventListener("storage", update); };
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    return () => {
      animationRef.current?.cancel();
      if (dialog?.open) document.body.style.overflow = previousOverflow.current;
    };
  }, []);

  function openMenu() {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    animationRef.current?.cancel();
    previousOverflow.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    setIsOpen(true);
  }

  function dismissMenu() {
    animationRef.current?.cancel();
    animationRef.current = null;
    dialogRef.current?.close();
    document.body.style.overflow = previousOverflow.current;
    setIsOpen(false);
  }

  function closeMenu() {
    const panel = panelRef.current;
    if (!panel || !dialogRef.current?.open) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { dismissMenu(); return; }
    if (animationRef.current?.playState === "running") return;
    const animation = panel.animate([{ transform: getComputedStyle(panel).transform }, { transform: "translateX(100%)" }], { duration: 160, easing: "cubic-bezier(.4,0,1,1)", fill: "forwards" });
    animationRef.current = animation;
    animation.finished.then(() => { if (animationRef.current === animation) dismissMenu(); }, () => {});
  }

  const drawerLinks = (items: { label: string; href: string }[]) => items.map(item => <Link key={item.href} href={item.href} prefetch={false} onClick={dismissMenu}>{item.label}</Link>);

  return <>
    <nav className={styles.navbar} aria-label="Main navigation" data-colortheory-nav>
      <Link href="/" prefetch={false} className={styles.homeBrand} aria-label="Stay Willas home"><Brand /></Link>
      <div className={styles.desktopLinks}><Link href="/" prefetch={false}>Home</Link><Link href="/villas" prefetch={false}>Villas</Link><details name="colortheory-desktop-links" className={styles.dropdown}><summary>Areas <ChevronDown size={13} /></summary><div>{drawerLinks(destinations)}</div></details>{explore.map(link => <Link key={link.href} href={link.href} prefetch={false}>{link.label}</Link>)}<details name="colortheory-desktop-links" className={styles.dropdown}><summary>More <ChevronDown size={13} /></summary><div>{drawerLinks([...company.filter(link => link.href !== "/wishlist"), { label: "Destinations", href: "/destinations" }, { label: "Group Stays in Lonavala", href: "/escape" }])}</div></details></div>
      <div className={styles.actions}>
        <a className={`${styles.desktopIcon} ${styles.whatsappLink}`} href="https://wa.me/919619042310" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp"><WhatsAppIcon /><span className={styles.whatsappWord}>WhatsApp</span></a>
        <Link className={styles.desktopIcon} href="/wishlist" prefetch={false} aria-label="View Wishlist"><Heart size={20} />{wishlistCount > 0 && <span className={styles.badge}>{wishlistCount}</span>}</Link>
        <div className={styles.desktopAccount}>{isSignedIn ? <UserButton /> : <SignInButton mode="modal"><button className={styles.loginButton} disabled={!isLoaded}>Login / Register</button></SignInButton>}</div>
        <Link className={styles.bookButton} href="/villas" prefetch={false}>Book Direct</Link>
        <button ref={triggerRef} className={styles.menuButton} onClick={openMenu} aria-label="Open Navigation Menu" aria-expanded={isOpen} aria-controls="colortheory-menu" aria-haspopup="dialog"><Menu size={21} /></button>
      </div>
    </nav>

    <dialog ref={dialogRef} id="colortheory-menu" className={styles.drawer} aria-label="Stay Willas navigation" data-lenis-prevent onCancel={event => { event.preventDefault(); closeMenu(); }} onClick={event => { if (event.target === event.currentTarget) closeMenu(); }}>
      <div ref={panelRef} className={styles.panel}>
        <div className={styles.panelHeader}><Link href="/" prefetch={false} onClick={dismissMenu} aria-label="Stay Willas home"><Brand light /></Link><button onClick={closeMenu} className={styles.closeButton} aria-label="Close Navigation Menu"><X size={21} /></button></div>
        <div className={styles.account}>{isSignedIn ? <div className={styles.signedAccount}><button onClick={() => { dismissMenu(); clerk.openUserProfile(); }} aria-label="Open account settings"><UserAvatar appearance={{ elements: { avatarBox: "w-8 h-8" } }} /><span><strong>My Account</strong><small>Profile & account settings</small></span></button><button className={styles.signOutButton} onClick={() => { dismissMenu(); void clerk.signOut({ redirectUrl: "/colortheory" }); }} aria-label="Sign out"><LogOut size={19} /></button></div> : <SignInButton mode="modal"><button onClick={dismissMenu} disabled={!isLoaded} aria-label="Login or Register"><User size={23} /><span><strong>Login / Register</strong><small>Your Stay Willas guest account</small></span><ArrowRight size={17} /></button></SignInButton>}</div>
        <div className={styles.panelLinks}>
          <span className={styles.groupLabel}>EXPLORE</span>
          <Link href="/" prefetch={false} onClick={dismissMenu}>Home</Link>
          <details className={styles.menuGroup}><summary>Villas <ChevronDown size={16} /></summary><div>{drawerLinks(villas)}</div></details>
          <details className={styles.menuGroup}><summary>Destinations <ChevronDown size={16} /></summary><div>{drawerLinks(destinations)}</div></details>
          {explore.map(({ label, href }) => <Link href={href} prefetch={false} onClick={dismissMenu} key={href}>{label}</Link>)}
          <details className={`${styles.menuGroup} ${styles.offers}`} open><summary>26% OFF WEEKDAY STAYS <ChevronDown size={16} /></summary><div>{[{ label: "Lonavala Villas", href: "/areas/lonavala" }, { label: "Khopoli Villas", href: "/areas/khopoli" }, { label: "Panchgani Villas", href: "/areas/panchgani" }, { label: "Group Villas in Lonavala", href: "/escape" }].map(offer => <Link key={offer.href} href={offer.href} prefetch={false} onClick={dismissMenu}>{offer.label}<span>26% OFF</span></Link>)}</div></details>
          <span className={styles.groupLabel}>COMPANY & MORE</span>
          {company.map(({ label, href }) => <Link key={href} href={href} prefetch={false} onClick={dismissMenu}>{label}{href === "/wishlist" && wishlistCount > 0 && <span className={styles.wishlistCount}>{wishlistCount}</span>}</Link>)}
        </div>
        <div className={styles.panelFooter}><Link href="/villas" prefetch={false} className={styles.reserveButton} onClick={dismissMenu}>Reserve your villa <ArrowRight size={16} /></Link><div><a href="tel:+919619042310"><Phone size={15} /> Call Us</a><a href="https://wa.me/919619042310" target="_blank" rel="noopener noreferrer"><WhatsAppIcon /> WhatsApp</a></div></div>
      </div>
    </dialog>
  </>;
}

export default memo(ColorTheoryNavigation);
