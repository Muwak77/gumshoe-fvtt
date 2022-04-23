/** @jsx jsx */
import { Fragment, ReactNode } from "react";
import { InvestigatorActor } from "../../module/InvestigatorActor";
import { jsx } from "@emotion/react";
import { CSSReset, CSSResetMode } from "../CSSReset";
import { TabContainer } from "../TabContainer";
import { LogoEditable } from "./LogoEditable";
import { AbilitiesAreaEdit } from "./AbilitiesAreaEdit";
import { AbilitiesAreaPlay } from "./AbilitiesAreaPlay";
import { WeaponsArea } from "./WeaponsArea";
import { WeaponsAreaEdit } from "./WeaponsAreaEdit";
import { ActorSheetAppContext } from "../FoundryAppContext";
import { TrackersArea } from "./TrackersArea";
import { Translate } from "../Translate";
import { assertNPCDataSource } from "../../types";
import { ImagePickle } from "../ImagePickle";
import { CombatAbilityDropDown } from "../inputs/CombatAbilityDropDown";
import { NotesEditorWithControls } from "../inputs/NotesEditorWithControls";
import { InputGrid } from "../inputs/InputGrid";
import { absoluteCover } from "../absoluteCover";
import { MwInjuryStatusWidget } from "./MoribundWorld/MwInjuryStatusWidget";
import { settings } from "../../settings";
import { StatField } from "./StatField";

type InvestigatorNPCSheetProps = {
  actor: InvestigatorActor,
  foundryApplication: ActorSheet,
}

export const InvestigatorNPCSheet = ({
  actor,
  foundryApplication,
}: InvestigatorNPCSheetProps) => {
  assertNPCDataSource(actor.data);

  const theme = actor.getSheetTheme();
  const stats = settings.npcStats.get();

  return (
    <ActorSheetAppContext.Provider value={foundryApplication}>
      <CSSReset
        theme={theme}
        mode={CSSResetMode.large}
        css={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          display: "grid",
          gridTemplateRows: "min-content minmax(10em, 1fr) 1.5fr",
          gridTemplateColumns: "max-content 1fr 10em",
          gap: "0.5em",
          gridTemplateAreas:
            "\"title title image\" " +
            "\"notes notes image\" " +
            "\"sidebar body  body\" ",
        }}
      >
        <div
          css={{
            gridArea: "title",
            textAlign: "center",
            position: "relative",
          }}
        >
          <LogoEditable
            mainText={actor.data.name}
            onChangeMainText={actor.setName}
            css={{
              fontSize: "0.66em",
            }}
          />
        </div>
        <div
          className={theme.panelClass}
          css={{
            gridArea: "notes",
            position: "relative",
            ...theme.panelStyleSecondary,
            // height: "12em",
          }}
        >
          <InputGrid
            css={{
              ...absoluteCover,
              gridTemplateRows: "1fr",
              padding: "0.5em",
            }}
          >
            <NotesEditorWithControls
              allowChangeFormat
              format={actor.getNotes().format}
              html={actor.getNotes().html}
              source={actor.getNotes().source}
              onSave={actor.setNotes}
              css={{
                height: "100%",
                "&&": {
                  resize: "none",
                },
              }}
            />
          </InputGrid>
        </div>

        <ImagePickle
          subject={actor}
          application={foundryApplication}
          css={{
            gridArea: "image",
            transform: "rotateZ(2deg)",
          }}
        />

        {/* SIDEBAR */}
        <div
          className={theme.panelClass}
          css={{
            gridArea: "sidebar",
            position: "relative",
            padding: "0.5em",
            overflowX: "visible",
            overflowY: "auto",
            ...theme.panelStylePrimary,
          }}
        >
          <button
            onClick={actor.confirmRefresh}
            css={{ marginBottom: "0.5em" }}
          >
            <Translate>Full Refresh</Translate>
          </button>

          {settings.useMwInjuryStatus.get() &&
            <div css={{ marginBottom: "0.5em" }}>
              <MwInjuryStatusWidget
                status={actor.getMwInjuryStatus()}
                setStatus={actor.setMwInjuryStatus}
                />
            </div>
          }

          {/* Stats */}
          <hr/>
            {
              Object.keys(stats).map<ReactNode>((key) => {
                return (<StatField key={key} id={key} actor={actor} stat={stats[key]} />);
              })
            }

          <hr/>
          <TrackersArea actor={actor} />
          <hr/>
          <h4 css={{ width: "8em" }}>
            <Translate>Combat Order</Translate>
          </h4>
          <CombatAbilityDropDown
            value={actor.getInitiativeAbility()}
            onChange={actor.setInitiativeAbility}
          />
        </div>

        <div
          css={{
            gridArea: "body",
            position: "relative",
            padding: "0.5em",
            overflow: "auto",
          }}
        >
          <TabContainer
            defaultTab="play"
            tabs={[
              {
                id: "play",
                label: "Play",
                content:
                  <Fragment>
                    <WeaponsArea actor={actor} />
                    <div css={{ height: "1em" }}/>
                    <AbilitiesAreaPlay
                      actor={actor}
                      flipLeftRight={true}
                    />
                  </Fragment>,
              },
              {
                id: "edit",
                label: "Edit",
                content:
                  <Fragment>
                    <WeaponsAreaEdit actor={actor} />
                    <div css={{ height: "1em" }}/>
                    <AbilitiesAreaEdit
                      actor={actor}
                      flipLeftRight={true}
                      showOcc={false}
                    />
                  </Fragment>,
              },
            ]}
          />
        </div>
      </CSSReset>
    </ActorSheetAppContext.Provider>
  );
};
