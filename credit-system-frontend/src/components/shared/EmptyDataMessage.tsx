interface EmptyDataMessageProps {
  description: string;
  classNameDescription?: string;
  icon: React.ReactNode;
}
export const EmptyDataMessage = ({
  icon,
  description,
  classNameDescription = "text-md",
}: EmptyDataMessageProps) => {
  return (
    <div className="flex flex-col items-center justify-items-center">
      {icon}
      <p className={`text-center pt-2 ${classNameDescription}`}>{description}</p>
    </div>
  );
};
