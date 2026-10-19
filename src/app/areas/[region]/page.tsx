import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AreaEditorialPage from "@/components/areas/area-editorial-page";
import {
  areaEditorial,
  getAreaMetadata,
  type AreaSlug,
} from "@/data/area-editorial";

export const revalidate = 86400; // 24 hours edge cache
type Props = { params: Promise<{ region: string }> };

async function getAreaSlug(params: Props["params"]): Promise<AreaSlug> {
  const { region } = await params;
  const regionKey = region.toLowerCase();
  if (!Object.hasOwn(areaEditorial, regionKey)) notFound();
  return regionKey as AreaSlug;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return getAreaMetadata(await getAreaSlug(params));
}

export default async function AreaPage({ params }: Props) {
  return <AreaEditorialPage slug={await getAreaSlug(params)} />;
}
