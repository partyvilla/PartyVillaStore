import { Label } from "@radix-ui/react-label"
import { Input } from "./input"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export function LabeledInput({ label, id, ...props }: InputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} {...props} />
    </div>
  )
}
