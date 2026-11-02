export type WillowSelection = "A" | "B" | "C" | "AB" | "AC" | "BC" | "TWO" | "ALL";

export function willowCottages(selection: WillowSelection | undefined): ("A" | "B" | "C")[] {
  if (!selection || selection === "ALL") return ["A", "B", "C"];
  if (selection === "TWO") return [];
  return selection.split("") as ("A" | "B" | "C")[];
}

export function willowSelectionLabel(selection: WillowSelection): string {
  if (selection === "TWO") return "Choose a pair";
  if (selection === "ALL") return "All 3 cottages";
  const names = { A: "Breeze", B: "Crest", C: "Heaven" };
  return willowCottages(selection).map(letter => names[letter]).join(" + ");
}
