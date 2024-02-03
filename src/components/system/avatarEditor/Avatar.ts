export default interface Avatar {
  circleColor: string;
  isCircle: boolean;
  topType: string;
  accessoriesType: string;
  facialHairType: string;
  clotheType: string;
  eyeType: string;
  eyebrowType: string;
  mouthType: string;
  skinColor: string;
  graphicType: string;
  hairColor: string;
  facialHairColor: string;
  topColor: string;
  clotheColor: string;
}

export interface AvatarCategory {
  items: Record<string, string>;
  key: string;
  mdiIcon?: string;
  icon?: string;
  subCategories?: AvatarCategory[];
}
