import AreaEditorialPage from "@/components/areas/area-editorial-page";
import { getAreaMetadata } from "@/data/area-editorial";

export const revalidate = 60;
export const metadata = getAreaMetadata("panchgani");

export default function PanchganiPage() {
  return <AreaEditorialPage slug="panchgani" />;
}
