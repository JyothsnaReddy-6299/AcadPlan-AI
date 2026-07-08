export const COS = ["CO1", "CO2", "CO3", "CO4", "CO5", "CO6"];
export const POS = Array.from({ length: 12 }, (_, i) => `PO${i + 1}`);
export const OPTIONS = ["-", "1", "2", "3"];

// Builds the initial 6x12 mapping matrix with a handful of realistic
// academic defaults, leaving everything else unmapped ("-").
export function createDefaultMatrix() {
  const matrix = COS.map(() => POS.map(() => "-"));
  matrix[0][0] = "3"; // CO1 -> PO1 : substantially mapped
  matrix[1][1] = "2"; // CO2 -> PO2 : moderately mapped
  matrix[2][2] = "1"; // CO3 -> PO3 : slightly mapped
  matrix[3][0] = "2"; // CO4 -> PO1 : moderately mapped
  matrix[4][3] = "3"; // CO5 -> PO4 : substantially mapped
  matrix[5][1] = "1"; // CO6 -> PO2 : slightly mapped
  return matrix;
}

// Visual styling per mapping weight — used by both the cell button and
// the options inside its dropdown so the whole thing stays consistent.
export function getCellStyles(value) {
  switch (value) {
    case "1":
      return "text-emerald-700 border-emerald-200 bg-emerald-100/80";
    case "2":
      return "text-sky-700 border-sky-300 bg-sky-100/80";
    case "3":
      return "text-white border-indigo-600 bg-indigo-600";
    default:
      return "text-slate-400 border-slate-200 border-dashed bg-white/40";
  }
}