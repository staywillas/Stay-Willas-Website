import AreaEditorialPage from "@/components/areas/area-editorial-page";
import { getAreaMetadata } from "@/data/area-editorial";

export const revalidate = 86400; // 24 hours edge cache
export const metadata = getAreaMetadata("khopoli");

export default function KhopoliPage() {
  return <AreaEditorialPage slug="khopoli" />;
}
