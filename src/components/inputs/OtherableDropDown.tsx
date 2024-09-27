import { useContext } from "react";

import { useOtherable } from "../../hooks/useOtherable";
import { ThemeContext } from "../../themes/ThemeContext";
import { Translate } from "../Translate";
import { AsyncTextInput } from "./AsyncTextInput";

type OtherableDropDownProps = {
  value: string;
  onChange: (newValue: string) => void;
  className?: string;
  pickerValues: string[];
  validValues?: string[];
};

export const OtherableDropDown = ({
  value: selectedValue,
  onChange,
  className,
  pickerValues,
  validValues,
}: OtherableDropDownProps) => {
  const theme = useContext(ThemeContext);

  const {
    customValueToken,
    effectiveValue,
    handleChange,
    showCustomValue,
    notFound,
  } = useOtherable({
    value: selectedValue,
    onChange,
    pickerValues,
    validValues,
  });

  return (
    <div
      css={{ display: "flex", flexDirection: "column", gap: "0.2em" }}
      className={className}
    >
      <select value={effectiveValue} onChange={handleChange}>
        {pickerValues.map((value) => (
          <option key={value}>{value}</option>
        ))}
        <option value={customValueToken}>
          <Translate>Other</Translate>
        </option>
      </select>
      {showCustomValue && (
        <AsyncTextInput value={selectedValue} onChange={onChange} />
      )}
      {notFound && (
        <span
          css={{
            background: theme.colors.danger,
            color: theme.colors.accentContrast,
            display: "inline-block",
            padding: "0 0.2em",
            borderRadius: "0.2em",
          }}
        >
          <Translate>NotFound!</Translate>
        </span>
      )}
    </div>
  );
};

OtherableDropDown.displayName = "OtherableDropDown";
