// WordSafeSingleLineText component.
// Extracted from page.tsx.

export function WordSafeSingleLineText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <div className={className} title={text}>
      <span className="block truncate">{text.replace(/\s+/g, ' ').trim()}</span>
    </div>
  );
}
