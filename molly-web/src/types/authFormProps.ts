import { FormEvent } from "react";

export interface AuthFormProps extends React.ComponentProps<"div"> {
  onSubmit: (evt: FormEvent) => void;
}
