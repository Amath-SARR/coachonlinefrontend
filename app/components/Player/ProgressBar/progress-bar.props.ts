export default interface ProgressBarProps {
  onBarClick: (position: number) => void;
  currentPosition: number;
  duration: number;
}
