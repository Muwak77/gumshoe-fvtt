/** @jsx jsx */
import { jsx } from "@emotion/react";
import React, { useCallback, useContext, useState } from "react";
import { InvestigatorItem } from "../../module/InvestigatorItem";
import { ThemeContext } from "../../themes/ThemeContext";
import { MWDifficulty } from "../../types";
import { GridField } from "../inputs/GridField";
import { InputGrid } from "../inputs/InputGrid";
import { Translate } from "../Translate";

type AbilityTestMWProps = {
  ability: InvestigatorItem,
};

export const AbilityTestMW: React.FC<AbilityTestMWProps> = ({ ability }) => {
  const theme = useContext(ThemeContext);
  const [difficulty, setDifficulty] = useState<MWDifficulty>(0);
  const [boonLevy, setBoonLevy] = useState(0);

  const onTest = useCallback(() => {
    ability.mwTestAbility(difficulty, boonLevy);
  }, [ability, boonLevy, difficulty]);

  const onChangeDifficulty = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.currentTarget.value;
    const diff = val === "easy" ? "easy" : Number(val);
    setDifficulty(diff);
  };

  const onChangeBoonLevy = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.currentTarget.value;
    const newBoonLevy = Number(val);
    setBoonLevy(newBoonLevy);
  };

  return (
    <div
      css={{
        border: `1px solid ${theme.colors.text}`,
        padding: "1em",
        marginBottom: "1em",
        background: theme.colors.backgroundSecondary,
        display: "grid",
        gridTemplateColumns: "max-content 1fr",
        gridTemplateRows: "auto",
        gridTemplateAreas: `
          "inputs button"
        `,
        gap: "0.5em",
      }}
    >
      <InputGrid
        css={{
          gridArea: "inputs",
        }}
      >
        <GridField label="Difficulty">
          <select css={{ display: "block" }} value={difficulty} onChange={onChangeDifficulty}>
            <option value="easy">Easy</option>
            <option value={0}>Normal</option>
            <option value={-1}>Hard (-1)</option>
            <option value={-2}>Very Hard (-2)</option>
          </select>
        </GridField>
        <GridField label="Boon/levy">
          <div css={{ position: "relative" }}>
            <select css={{ display: "block" }} value={boonLevy} onChange={onChangeBoonLevy}>
              <option value={+2}>Boon +2</option>
              <option value={+1}>Boon +1</option>
              <option value={0}>0</option>
              <option value={-1}>Levy (-1)</option>
              <option value={-2}>Levy (-2)</option>
            </select>
          </div>
        </GridField>
      </InputGrid>
      <button css={{ gridArea: "button" }} onClick={onTest}>
        <Translate>Test</Translate>
      </button>
    </div>
  );
};
