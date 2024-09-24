import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import React, { useContext, useMemo } from "react";
import { FaGripLines } from "react-icons/fa6";

import { irid } from "../../../irid/irid";
import { ThemeContext } from "../../../themes/ThemeContext";

type DragHandleProps = {
  setActivatorNodeRef?: (node: HTMLDivElement) => void;
  listeners?: SyntheticListenerMap | undefined;
};

export const DragHandle = ({
  setActivatorNodeRef,
  listeners,
}: DragHandleProps) => {
  const theme = useContext(ThemeContext);

  const gripColor = useMemo(
    () =>
      irid(theme.colors.accent)
        .blend(theme.colors.bgOpaquePrimary, 0.4)
        .toString(),
    [theme.colors.accent, theme.colors.bgOpaquePrimary],
  );

  return (
    <div
      tabIndex={0}
      css={{
        height: "100%",
        width: "3em",
        cursor: "n-resize",
        borderRadius: "0.35em",
        color: gripColor,
        textAlign: "center",
        backgroundColor: theme.colors.bgOpaquePrimary,
        opacity: 0.7,
        gridColumn: "1",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ":hover": {
          opacity: 1,
          transform: "scale(1.1)",
          color: theme.colors.accent,
        },
      }}
      ref={setActivatorNodeRef}
      {...listeners}
    >
      <FaGripLines />
    </div>
  );
};
