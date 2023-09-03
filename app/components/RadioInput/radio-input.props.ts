export interface RadioInputOption {
  id: number;
  value: string;
  label: string;
  data: any;
}
export default interface RadioInputProps {
  options: RadioInputOption[];
  onChange: (option: RadioInputOption) => void;
  defaultOption?: RadioInputOption;
  accent?: string;
  direction?: 'row' | 'column';
}
