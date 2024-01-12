import { AriaAttributes, InputHTMLAttributes } from "react";

interface GroupFilterProps
  extends AriaAttributes,
    InputHTMLAttributes<HTMLInputElement> {}

export default function GroupFilter({
  type,
  placeholder,
  value,
  onChange,
}: GroupFilterProps) {
  return (
    <div className="border-b-2 px-2 py-4">
      <input
        type={type}
        placeholder={placeholder}
        className="w-full rounded-2xl border-2 border-gray-200 px-2 py-2"
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
