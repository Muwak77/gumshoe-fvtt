import "./startup/setWebkitPublicPath";
import { systemName } from "./constants";
import { registerSettings } from "./startup/registerSettings";
import { preloadTemplates } from "./startup/preloadTemplates";
import { initializePackGenerators } from "./compendiumFactory/generatePacks";
import { installCompendiumExportButton } from "./startup/installCompendiumExportButton";
import { installShowThemeFarmHack } from "./startup/installShowThemeFarmHack";
import { installAbilityCardChatWrangler } from "./startup/installAbilityCardChatWrangler";
import { installFathom } from "./startup/installFathom";
import { migrateWorldIfNeeded } from "./startup/migrateWorldIfNeeded";
import { installAbilityCategoryHookHandler } from "./startup/installAbilityCategoryHookHandler";
import { installItemImageHookHandler } from "./startup/installItemImageHookHandler";
import { installDSNFix } from "./startup/installDSNFix";
import { registerSheetsAndClasses } from "./startup/registerSheetsAndClasses";
import { registerBabele } from "./startup/registerBabele";
import { installRenderSettingsHandler } from "./startup/installRenderSettingsHandler";
import { installDropActorSheetDataHandler } from "./startup/installDropActorSheetDataHandler";
import { registerDevModeDebugFlag } from "./startup/registerDevModeDebugFlag";
import { installActorImageHookHandler } from "./startup/installActorImageHookHandler";
import { injectGlobalHelper } from "./startup/injectGlobalHelper";
import { loadCustomThemes } from "./startup/loadCustomThemes";
import { handleMwItemType } from "./startup/disableMwItemType";

injectGlobalHelper();

// Initialize system
Hooks.once("init", async function () {
  logger.log(`${systemName} | Initializing system`);
  registerSettings();
  await preloadTemplates();
  registerSheetsAndClasses();
  registerBabele();
});

// Setup system
Hooks.once("setup", function () {
  installShowThemeFarmHack();
});

Hooks.once("ready", () => {
  migrateWorldIfNeeded();
  installDSNFix();
});

installAbilityCategoryHookHandler();
installItemImageHookHandler();
installRenderSettingsHandler();
installDropActorSheetDataHandler();
registerDevModeDebugFlag();
installActorImageHookHandler();
installCompendiumExportButton();
initializePackGenerators();
installAbilityCardChatWrangler();
installFathom();
loadCustomThemes();
handleMwItemType();
