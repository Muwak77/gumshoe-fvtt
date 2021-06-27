/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { useMemo } from "react";
import Case from "case";
import { systemName } from "../constants";

type TranslateProps = {
  children: string,
  values?: {[key: string]: string},
};

export const Translate: React.FC<TranslateProps> = ({
  children,
  values,
}) => {
  const pascal = useMemo(() => Case.pascal(children), [children]);
  const prefixed = `${systemName}.${pascal}`;
  const local = useMemo(() => game.i18n.format(prefixed, values), [prefixed, values]);
  const has = useMemo(() => (game.i18n as any).has(prefixed, false), [prefixed]);

  return (
    <span
      style={{
        background: has ? "lightgreen" : "red",
      }}
    >
      {has ? local : children}
    </span>
  );
};
