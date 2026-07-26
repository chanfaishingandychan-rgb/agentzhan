export function BrandMark({ size = 34 }: { size?: number }) {
  return (
    <span className="brand-symbol" style={{ width: size, height: size }} aria-hidden="true">
      <svg viewBox="0 0 36 36" role="img">
        <path d="M18 7.5 28.5 28h-5.9l-2.2-4.6h-8.2L10 28H4.4L15.1 7.5H18Z" fill="currentColor" />
        <path d="M14.2 19.2h4.2l-2-4.6-2.2 4.6Z" fill="#0B1020" />
        <circle cx="27.9" cy="8.3" r="2.1" fill="#48D7E8" />
        <path d="M23.6 11.3 26.2 9.5" stroke="#48D7E8" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    </span>
  );
}
