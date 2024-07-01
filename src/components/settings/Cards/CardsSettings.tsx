import { Router } from "@lumphammer/minirouter";
import { SlideInOutlet } from "@lumphammer/minirouter/animated";
import { Outlet } from "@lumphammer/minirouter/outlets";
import React, { useCallback, useContext } from "react";

import { absoluteCover } from "../../absoluteCover";
import { Checkbox } from "../../inputs/Checkbox";
import { GridField } from "../../inputs/GridField";
import { InputGrid } from "../../inputs/InputGrid";
import { Translate } from "../../Translate";
import { StateContext } from "../contexts";
// import { store } from "../store";
import { Setters } from "../types";
import { Categories } from "./Categories";

interface CardsSettingsProps {
  setters: Setters;
}

export const CardsSettings: React.FC<CardsSettingsProps> = ({ setters }) => {
  const { settings } = useContext(StateContext);

  const handleChangeUseCards = useCallback(
    (checked: boolean) => {
      setters.useCards(checked);
    },
    [setters],
  );

  return (
    <Router>
      <SlideInOutlet after>
        <div
          data-testid="cards-settings"
          css={{
            ...absoluteCover,
            display: "flex",
            flexDirection: "column",
            padding: "0.5em",
            pointerEvents: "auto",
          }}
        >
          <div>
            <InputGrid css={{}}>
              <GridField label="Use cards?">
                <Checkbox
                  checked={settings.useCards}
                  onChange={handleChangeUseCards}
                />
              </GridField>
            </InputGrid>
          </div>
          {settings.useCards && (
            <>
              <div>
                <hr />
                <h2>
                  <Translate>Card categories</Translate>
                </h2>
              </div>
              <div css={{ flex: 1, position: "relative", overflow: "auto" }}>
                <Categories />
              </div>
            </>
          )}
          {/* <DevTools /> */}
        </div>
      </SlideInOutlet>
    </Router>
    // <div>
    //   {settings.cardCategories.map(({ name }) => (
    //     <div key={name}>{name}</div>
    //   ))}
    // </div>
  );
};

CardsSettings.displayName = "CardsSettings";
