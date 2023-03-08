export default interface ActionItem {
  icon?: string;
  materialIcon?: string;
  iconOnly?: boolean;
  groupName: string;
  horizontalGroup?: boolean;
  actionName: string;
  callback: Function;
  disabled: boolean;
  subActions?: ActionItem[];
}
