import "dotenv/config";
import { prisma } from "../src/lib/db";
import { SLATEWOOD_SLUG, slatewoodVillaData } from "../src/data/slatewood-villa";

async function main() {
  const { iCalUrl, ...propertyData } = slatewoodVillaData;
  const createData =
    iCalUrl === null ? propertyData : { ...propertyData, iCalUrl };
  const villa = await prisma.villa.upsert({
    where: { slug: SLATEWOOD_SLUG },
    create: createData,
    update: propertyData,
  });

  console.log(
    JSON.stringify(
      {
        id: villa.id,
        slug: villa.slug,
        name: villa.name,
        price: villa.price,
        guests: villa.guests,
        baseGuests: villa.baseGuests,
        extraGuestFee: villa.extraGuestFee,
      },
      null,
      2,
    ),
  );
}

main()
  .catch((error) => {
    console.error("Failed to add or update Slatewood:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
