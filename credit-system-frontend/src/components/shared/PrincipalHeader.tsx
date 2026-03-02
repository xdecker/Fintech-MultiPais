interface PrincipalHeaderProps {
  title: string;
  subTitle?: string;
  icon?: React.ReactNode;
}

export const PrincipalHeader = ({
  title,
  subTitle,
  icon,
}: PrincipalHeaderProps) => {
  return (
    <div className="flex items-center gap-3">
      {icon && (
        <div className="shrink-0 h-10 w-10 flex items-center justify-center">
          {icon}
        </div>
      )}

      <div className="flex flex-col leading-tight">
        <h1 className="text-2xl font-bold text-blue-900">{title}</h1>

        {subTitle && (
          <p className="text-sm text-muted-foreground">{subTitle}</p>
        )}
      </div>
    </div>
  );
};
