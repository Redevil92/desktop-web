export default interface SnackBar {
  show: boolean;
  text: string;
  severity: { type: string; color: string };
}
