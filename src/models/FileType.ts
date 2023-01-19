import { ActionItem } from "./ActionMenu";
import Dimension from "./Dimension";

export interface FileType {
  allowResizing: boolean;
  background: string;
  defaultSize: Dimension;
  minSize: Dimension;
  icon: string;
  title: string;
  singleton: boolean;
  application: string;
  canOpenWithoutFile: boolean;
  canRepeatInAppList?: boolean;
  additionalActions?: ActionItem[];
}
