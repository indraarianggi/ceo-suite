export type NavItem = { label: string; href: string };

export const mainNav: NavItem[] = [
  { label: "Workspaces", href: "/#browse-spaces" },
  { label: "Services", href: "/#why-ceo-suite" },
  { label: "Package", href: "/#meeting-room-package" },
  { label: "Promotions & Deals!", href: "/#promotions" },
  { label: "News", href: "/#news" },
];

export const footerNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Workspaces", href: "/#browse-spaces" },
  { label: "Services", href: "/#why-ceo-suite" },
  { label: "Promotion & Deals!", href: "/#promotions" },
  { label: "News", href: "/#news" },
];

export const authLinks = {
  signIn: { label: "Sign In", href: "/login" },
  signUp: { label: "Sign Up", href: "/sign-up" },
  forgotPassword: { label: "Forgot Password", href: "/forgot-password" },
} as const;
