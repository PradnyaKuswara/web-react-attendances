type TextInputProps = {
  props: {
    field: any;
    fieldState?: any;
    type?: string;
    placeHolder?: string;
    label?: string;
    isLabel?: boolean;
    icon?: React.ReactNode;
    rightElement?: React.ReactNode;
  };
};

export default function TextInput({ props }: TextInputProps) {
  const {
    field,
    fieldState,
    type = 'text',
    placeHolder,
    label,
    isLabel,
    icon,
    rightElement,
  } = props;

  return (
    <label className="form-control w-full">
      {isLabel && (
        <div className="label pb-2">
          <span className="label-text font-medium">{label}</span>
        </div>
      )}

      <label className="input input-bordered flex h-14 items-center gap-3 rounded-2xl w-full">
        {icon}
        <input
          {...field}
          type={type}
          className="grow"
          placeholder={placeHolder}
        />
        {rightElement}
      </label>

      {fieldState?.error && (
        <span className="mt-1 text-sm text-error">
          {fieldState.error.message}
        </span>
      )}
    </label>
  );
}