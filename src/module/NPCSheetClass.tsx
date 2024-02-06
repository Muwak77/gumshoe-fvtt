import React from "react";

import { ReactApplicationMixin } from "../../subtrees/shared-fvtt-bits/src/ReactApplicationMixin";
import { Suspense } from "../components/Suspense";
import { reactTemplatePath, systemId } from "../constants";

const NPCSheet = React.lazy(() =>
  import("../components/characters/NPCSheet").then(({ NPCSheet }) => ({
    default: NPCSheet,
  })),
);

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
class NPCSheetClassBase extends ActorSheet {
  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: [systemId, "sheet", "actor"],
      template: reactTemplatePath,
      width: 700,
      height: 660,
    });
  }
}

const render = (sheet: NPCSheetClassBase) => {
  return (
    <Suspense>
      <NPCSheet actor={sheet.document} foundryApplication={sheet} />
    </Suspense>
  );
};

export const NPCSheetClass = ReactApplicationMixin(
  "NPCSheetClass",
  NPCSheetClassBase,
  render,
);
