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

export const defaultAvatar: Avatar = {
  isCircle: true,
  circleColor: 'rgb(189, 72, 72)',
  topType: 'LongHairDreads',
  accessoriesType: 'Blank',
  hairColor: 'Blonde',
  facialHairType: 'Blank',
  clotheType: 'ShirtCrewNeck',
  clotheColor: 'Black',
  graphicType: 'Hola',
  eyeType: 'Default',
  eyebrowType: 'Default',
  mouthType: 'Smile',
  skinColor: 'Light',
  facialHairColor: 'Blonde',
  topColor: 'Blue02'
};
