interface TagProps {
  content: string;
}

export default function Tag({ content }: TagProps) {
  return (
    <span className="rounded-full border border-sky-300 px-3 py-1">
      {content}
    </span>
  );
}
