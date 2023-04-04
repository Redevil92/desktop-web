import { units } from "@/enums/Units";
import DutyFreeAllowance from "@/models/DutyFreeAllowance";

export const dutyFreeAllowances: DutyFreeAllowance[] = [
  {
    name: "Meat and meat products",
    description:
      "Meat and meat products derived from all animal species, excluding wild animals, fish, crustaceans, molluscs and other aquatic invertebrates.",
    category: "Animal products",
    note: `Included are:
      all parts of animal carcasses fit for consumption (with or without bones)
      sausages containing meat or blood
      other meat products
      food preparations with sausage, meat or blood content of over 20 percent by weight
      This does not include bone marrow, bones for stock, and dog and cat food in individual packets marked as animal feed.`,
    units: [units.KG],
    allowedQuantityPerPerson: 1,
    dutyUptoPerUnit: [{ upTo: 10, duty: 17 }],
    dutyPerUnit: 23,
  },
  {
    name: "Butter and cream",
    description: "with a fat content of 15 % or more",
    category: "Animal products",
    units: [units.LITRE, units.KG],
    allowedQuantityPerPerson: 1,
    dutyPerUnit: 16,
  },
  {
    name: "Oils, fats, margarine ",
    description: "for human consumption",
    category: "Animal products",
    units: [units.LITRE, units.KG],
    allowedQuantityPerPerson: 5,
    dutyPerUnit: 2,
  },
  {
    name: "Alcoholic beverages > 18%",
    description: "with an alcohol content by volume of over 18%",
    category: "Alcoholic beverages",
    units: [units.LITRE],
    allowedQuantityPerPerson: 1,
    dutyPerUnit: 15,
  },
  {
    name: "Alcoholic beverages < 18%",
    description: "with an alcohol content by volume of under 18%",
    category: "Alcoholic beverages",
    units: [units.LITRE],
    allowedQuantityPerPerson: 5,
    dutyPerUnit: 2,
  },
  {
    name: "cigarettesIcigars",
    category: "Tabacco products",
    units: [units.UNIT],
    allowedQuantityPerPerson: 250,
    dutyPerUnit: 0.25,
  },
  {
    name: "other tabacco products",
    category: "Tabacco products",
    units: [units.GRAMME],
    allowedQuantityPerPerson: 250,
    dutyPerUnit: 0.1,
  },
];
