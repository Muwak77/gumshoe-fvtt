import { ConfiguredDocumentClass } from "@league-of-foundry-developers/foundry-vtt-types/src/types/helperTypes";
import * as constants from "../constants";
import { settings } from "../settings";
import { isGeneralAbilityDataSource, isActiveCharacterDataSource } from "../types";
import { InvestigatorItem } from "./InvestigatorItem";

/**
 * Override base Combat so we can do custom GUMSHOE-style initiative
 */
export class InvestigatorCombat extends Combat {
  override _onCreate (data: this["data"]["_source"], options:any, userId:string) {
    super._onCreate(data, options, userId);
    if (settings.useTurnPassingInitiative.get()) {
      this.update({
        round: 1,
      });
    }
  }

  override get started () {
    return true;
  }

  protected _sortCombatants = (
    a: InstanceType<ConfiguredDocumentClass<typeof Combatant>>,
    b: InstanceType<ConfiguredDocumentClass<typeof Combatant>>,
  ): number => {
    if (settings.useTurnPassingInitiative.get()) {
      return this._sortCombatantsPassing(a, b);
    } else {
      return this._sortCombatantsStandard(a, b);
    }
  }

  protected _sortCombatantsPassing (
    a: InstanceType<ConfiguredDocumentClass<typeof Combatant>>,
    b: InstanceType<ConfiguredDocumentClass<typeof Combatant>>,
  ): number {
    const active = this.activeTurnPassingCombatant;
    if (a.id === active) {
      return -1;
    } else if (b.id === active) {
      return 1;
    } else if (a.passingTurnsRemaining < b.passingTurnsRemaining) {
      return -1;
    } else if (a.passingTurnsRemaining > b.passingTurnsRemaining) {
      return 1;
    } else if (a.name < b.name) {
      return -1;
    } else if (a.name > b.name) {
      return 1;
    }
    return 0;
  }

  protected _sortCombatantsStandard (
    a: InstanceType<ConfiguredDocumentClass<typeof Combatant>>,
    b: InstanceType<ConfiguredDocumentClass<typeof Combatant>>,
  ): number {
    if (!(a.actor !== null && b.actor !== null && isActiveCharacterDataSource(a.actor?.data) && isActiveCharacterDataSource(b.actor?.data))) {
      return 0;
    }
    const aAbilityName = a.actor.data.data.initiativeAbility;
    const aAbility = a.actor.items.find(
      (item: InvestigatorItem) => item.type === constants.generalAbility && item.name === aAbilityName,
    );
    const bAbilityName = b.actor.data.data.initiativeAbility;
    const bAbility = b.actor.items.find(
      (item: InvestigatorItem) => item.type === constants.generalAbility && item.name === bAbilityName,
    );
    // working out initiative - "goes first" beats non-"goes first"; then
    // compare ratings, then compare pools.
    if (!(aAbility !== undefined && bAbility !== undefined && isGeneralAbilityDataSource(aAbility.data) && isGeneralAbilityDataSource(bAbility.data))) {
      return 0;
    }
    if (aAbility.data.data.goesFirstInCombat && !bAbility.data.data.goesFirstInCombat) {
      return -1;
    } else if (!aAbility.data.data.goesFirstInCombat && bAbility.data.data.goesFirstInCombat) {
      return 1;
    } else {
      const aRating = aAbility.data.data.rating;
      const bRating = bAbility.data.data.rating;
      const aPool = aAbility.data.data.pool;
      const bPool = bAbility.data.data.pool;
      if (aRating < bRating) {
        return 1;
      } else if (aRating > bRating) {
        return -1;
      } else if (aPool < bPool) {
        return 1;
      } else if (aPool > bPool) {
        return -1;
      } else {
        return 0;
      }
    }
  }

  get activeTurnPassingCombatant () {
    return this.getFlag(
      constants.systemName,
      "activeTurnPassingCombatant",
    ) as string|null;
  }

  set activeTurnPassingCombatant (id: string|null) {
    this.setFlag(
      constants.systemName,
      "activeTurnPassingCombatant",
      id,
    );
  }
}

declare global {
  interface DocumentClassConfig {
    Combat: typeof InvestigatorCombat;
  }
}
