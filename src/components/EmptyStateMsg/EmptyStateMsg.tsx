interface EmptyStateMsgProps {
  title?: string;
  content?: string;
}
export default function EmptyStateMsg({ title, content }: EmptyStateMsgProps) {
  return (
    <div
      className={`flex h-[80%] flex-col items-center justify-center gap-y-2 p-4 text-gray-400 `}
    >
      <p className="text-lg font-semibold text-gray-500">{`${title ?? ""}`}</p>
      <p>{`${content ?? ""}`}</p>
    </div>
  );
}
