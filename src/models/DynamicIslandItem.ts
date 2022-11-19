export default interface DynamicIslandItem {
  componentPath: string;
  itemDialogGuid: string;
}

export interface DynamicIslandAudioItem extends DynamicIslandItem {
  audioElement: HTMLAudioElement;
}
