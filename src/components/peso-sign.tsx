import { forwardRef, type SVGProps } from "react";

export interface PesoSignProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
}

// Lucide-compatible Peso (₱) sign icon
export const PesoSign = forwardRef<SVGSVGElement, PesoSignProps>(
  ({ size = 24, strokeWidth = 2, className, ...props }, ref) => (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M7 21V4h6a5 5 0 0 1 0 10H7" />
      <path d="M4 9h12" />
      <path d="M4 13h12" />
    </svg>
  ),
);
PesoSign.displayName = "PesoSign";

export default PesoSign;