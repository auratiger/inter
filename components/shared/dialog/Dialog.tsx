import { forwardRef } from "react";

type Props = {
  children: React.ReactNode;
  toggleDialog: () => void;
  className?: string;
};

const Dialog = forwardRef<HTMLDialogElement, Props>(
  ({ children, toggleDialog, className }, ref) => {
    return (
      <dialog
        ref={ref}
        onClick={(e) => {
          if (e.currentTarget === e.target) {
            toggleDialog();
          }
        }}
      >
        <div className={className}>{children}</div>
      </dialog>
    );
  },
);

Dialog.displayName = "Display";

export default Dialog;
