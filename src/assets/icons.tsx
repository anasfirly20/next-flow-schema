const OvalIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <ellipse cx="12" cy="12" rx="9" ry="6" />
    </svg>
  );
};

const ParallelogramIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polygon points="6,4 20,4 18,20 4,20" />
    </svg>
  );
};

export { OvalIcon, ParallelogramIcon };
