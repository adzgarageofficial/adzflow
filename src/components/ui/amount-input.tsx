import { useState, useEffect, useRef } from "react";

interface AmountInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "onChange" | "defaultValue"> {
  value?: number | string | null;
  onChange?: (value: number) => void;
  defaultValue?: number | string | null;
}

function toDisplay(n: number | string | null | undefined): string {
  if (n === null || n === undefined || n === "" || n === 0) return "";
  const num = typeof n === "string" ? parseFloat(n.replace(/,/g, "")) : n;
  if (!num || isNaN(num)) return "";
  const parts = num.toString().split(".");
  const intFormatted = parseInt(parts[0], 10).toLocaleString("en-PH");
  return parts.length > 1 ? `${intFormatted}.${parts[1]}` : intFormatted;
}

function toNumeric(n: number | string | null | undefined): number {
  if (!n) return 0;
  return typeof n === "string" ? parseFloat(n.replace(/,/g, "")) || 0 : n;
}

export function AmountInput({
  value,
  onChange,
  defaultValue,
  name,
  placeholder = "0",
  className,
  ...props
}: AmountInputProps) {
  const isControlled = value !== undefined;
  const initVal = isControlled ? value : defaultValue;
  const [display, setDisplay] = useState(() => toDisplay(initVal));
  const [numeric, setNumeric] = useState(() => toNumeric(initVal));
  const prevValue = useRef(value);

  useEffect(() => {
    if (!isControlled) return;
    const prev = toNumeric(prevValue.current);
    const next = toNumeric(value);
    if (next !== prev) {
      prevValue.current = value;
      setDisplay(toDisplay(value));
      setNumeric(next);
    }
  }, [value, isControlled]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9.]/g, "");
    const parts = raw.split(".");
    if (parts.length > 2) return;

    const intPart = parts[0];
    const decPart = parts[1];
    const intFormatted = intPart === "" ? "" : parseInt(intPart, 10).toLocaleString("en-PH");
    const formatted = decPart !== undefined ? `${intFormatted}.${decPart}` : intFormatted;
    const n = raw ? parseFloat(raw) : 0;

    setDisplay(formatted);
    setNumeric(n);
    onChange?.(n);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (display) {
      const n = parseFloat(display.replace(/,/g, "")) || 0;
      setDisplay(toDisplay(n));
      setNumeric(n);
    }
    props.onBlur?.(e);
  };

  return (
    <>
      <input
        {...props}
        type="text"
        inputMode="decimal"
        value={display}
        placeholder={placeholder}
        onChange={handleChange}
        onBlur={handleBlur}
        className={className}
      />
      {name && <input type="hidden" name={name} value={numeric || ""} />}
    </>
  );
}
