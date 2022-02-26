/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { useEffect, useState } from "react";
import { assertGame } from "../../functions";
import { MwInjuryStatus } from "../../types";

interface MwInjuryStatusWidgetProps {
  status: MwInjuryStatus;
  setStatus: (status: MwInjuryStatus) => Promise<void>;
}

export const MwInjuryStatusWidget: React.FC<MwInjuryStatusWidgetProps> = ({
  status,
  setStatus,
}: MwInjuryStatusWidgetProps) => {
  assertGame(game);

  const [display, setDisplay] = useState(status);

  useEffect(() => {
    setStatus(display);
  }, [display, setStatus]);

  return (
    <div>
      <select
        css={{
          width: "100%",
        }}
        value={display}
        onChange={(e) => {
          setDisplay(e.currentTarget.value as MwInjuryStatus);
        }}
      >
        <option value={MwInjuryStatus.uninjured}>
          {game.i18n.format("Uninjured")}
        </option>
        <option value={MwInjuryStatus.hurt}>
          {game.i18n.format("Hurt")}
        </option>
        <option value={MwInjuryStatus.down}>
          {game.i18n.format("Down")}
        </option>
        <option value={MwInjuryStatus.unconscious}>
          {game.i18n.format("Unconscious")}
        </option>
        <option value={MwInjuryStatus.dead}>
          {game.i18n.format("Dead")}
        </option>
      </select>
    </div>
  );
};
