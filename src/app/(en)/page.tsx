import { HomeScreen, homeMetadata } from "@/lib/locale-screens";

export const metadata = homeMetadata("en");

export default function HomePage() {
  return <HomeScreen locale="en" />;
}
