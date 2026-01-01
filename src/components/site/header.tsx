import { getSiteSettings } from "@/lib/site";
import HeaderClient from "@/components/site/header-client";

export default async function Header() {
  const settings = await getSiteSettings();
  return <HeaderClient settings={settings} />;
}
