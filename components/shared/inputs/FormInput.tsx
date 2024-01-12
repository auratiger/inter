type Props = {
  lable: string;
  id: string;
  type?: string;
  placeholder?: string;
  errorMessage?: string;
  innerRef: any;
  other?: [];
};

export default function FormInput({
  lable,
  id,
  type = "text",
  placeholder,
  errorMessage,
  innerRef,
  ...other
}: Props) {
  const errorDescriptionId: string = id + "-error";

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between">
        <label
          htmlFor={id}
          className="block text-sm font-medium leading-4 text-gray-900"
        >
          {lable}
        </label>

        {errorMessage && (
          <small
            id={errorDescriptionId}
            className="text-secondary-strawberry font-bold"
          >
            {errorMessage}
          </small>
        )}
      </div>

      <div className="mt-2">
        <input
          id={id}
          name="email"
          type={type}
          autoComplete="email"
          required
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          aria-describedby={errorDescriptionId}
          placeholder={placeholder}
          ref={innerRef}
          {...other}
        />
      </div>
    </div>
  );
}
