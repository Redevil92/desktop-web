import { units } from "@/enums/Units";

export default interface DutyFreeAllowance {
  name: string;
  description?: string;
  category: string;
  note?: string;
  units: units[];
  allowedQuantityPerPerson: number;
  dutyUptoPerUnit: { upTo: number; duty: number }[];
  dutyPerUnit: number;
}
