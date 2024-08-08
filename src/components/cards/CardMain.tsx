import React, { ChangeEvent, useCallback } from "react";

import { getTranslated } from "../../functions/getTranslated";
import { getById } from "../../functions/utilities";
import { InvestigatorItem } from "../../module/InvestigatorItem";
import { settings } from "../../settings/settings";
import { assertCardItem } from "../../v10Types";
import { absoluteCover } from "../absoluteCover";
import { Checkbox } from "../inputs/Checkbox";
import { GridField } from "../inputs/GridField";
import { InputGrid } from "../inputs/InputGrid";
import { NotesEditorWithControls } from "../inputs/NotesEditorWithControls";
import { TextInput } from "../inputs/TextInput";
import { TabContainer } from "../TabContainer";

interface CardMainProps {
  card: InvestigatorItem;
}

export const CardMain: React.FC<CardMainProps> = ({ card }) => {
  assertCardItem(card);

  const categories = settings.cardCategories.get();
  const categoryMetadata = getById(categories, card.system.category);
  const isRealCategory = categoryMetadata !== undefined;

  const onChangeCategory = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      void card.setCategory(e.currentTarget.value);
    },
    [card],
  );

  const selectedCat = isRealCategory ? card.system.category : "";

  return (
    <>
      <InputGrid>
        <GridField label="Item Name">
          <TextInput value={card.name ?? ""} onChange={card.setName} />
        </GridField>
        <GridField label="Supertitle">
          <TextInput
            value={card.system.supertitle}
            onChange={card.setSupertitle}
          />
        </GridField>
        <GridField label="Subtitle">
          <TextInput value={card.system.subtitle} onChange={card.setSubtitle} />
        </GridField>

        <GridField label="Category">
          <div
            css={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <div>
              <select
                value={selectedCat}
                onChange={onChangeCategory}
                css={{
                  lineHeight: "inherit",
                  height: "inherit",
                }}
              >
                {Object.entries(categories).map<JSX.Element>(([id, cat]) => (
                  <option key={id} value={id}>
                    {cat.name}
                  </option>
                ))}
                <option value="">{getTranslated("Uncategorized")}</option>
              </select>
            </div>
          </div>
        </GridField>

        <GridField label="Active">
          <Checkbox checked={card.system.active} onChange={card.setActive} />
        </GridField>
      </InputGrid>
      <div
        className="notes-container"
        css={{
          flex: 1,
          position: "relative",
          margin: "0.5em",
        }}
      >
        <TabContainer
          defaultTab="description"
          tabs={[
            {
              id: "description",
              label: "Description",
              content: (
                <InputGrid
                  css={{
                    ...absoluteCover,
                    gridTemplateRows: "1fr",
                    margin: "0.5em",
                  }}
                >
                  <NotesEditorWithControls
                    allowChangeFormat
                    format={card.system.description.format}
                    html={card.system.description.html}
                    source={card.system.description.source}
                    onSave={card.setDescription}
                    css={{
                      "&&": {
                        resize: "none",
                      },
                    }}
                  />
                </InputGrid>
              ),
            },
            {
              id: "effects",
              label: "Effects",
              content: (
                <InputGrid
                  css={{
                    ...absoluteCover,
                    gridTemplateRows: "1fr",
                    margin: "0.5em",
                  }}
                >
                  <NotesEditorWithControls
                    allowChangeFormat
                    format={card.system.effects.format}
                    html={card.system.effects.html}
                    source={card.system.effects.source}
                    onSave={card.setEffects}
                    css={{
                      height: "100%",
                      "&&": {
                        resize: "none",
                      },
                    }}
                  />
                </InputGrid>
              ),
            },
          ]}
        />
      </div>
    </>
  );
};
