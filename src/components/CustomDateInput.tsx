import { forwardRef } from "react";
import { Input } from "@chakra-ui/react";
import type { InputProps } from "@chakra-ui/react";

type CustomDateInputProps = {
  value?: string;
  onClick?: () => void;
} & InputProps;

const CustomDateInput = forwardRef<HTMLInputElement, CustomDateInputProps>(
  ({ value, onClick, ...rest }, ref) => (
    <Input
      onClick={onClick}
      ref={ref}
      value={value}
      readOnly
      w={"100%"}
      bg="surface"
      borderColor="border"
      cursor="pointer"
      {...rest}
    />
  )
);

CustomDateInput.displayName = "CustomDateInput";

export default CustomDateInput;
