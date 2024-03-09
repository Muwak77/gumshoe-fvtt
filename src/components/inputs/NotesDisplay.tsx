import React, { useLayoutEffect, useRef } from "react";

import { getTranslated } from "../../functions/getTranslated";
import { assertGame, systemLogger } from "../../functions/utilities";
import { useIsDocumentOwner } from "../../hooks/useIsDocumentOwner";

const secretToggleButtonClass = "investigator-secret-hide-reveal-button";

interface NotesDisplayProps {
  className?: string;
  html: string;
  toggleSecret?: (index: number) => void;
}

export const NotesDisplay: React.FC<NotesDisplayProps> = ({
  className,
  html,
  toggleSecret,
}) => {
  assertGame(game);

  const isOwner = useIsDocumentOwner();

  const ref = useRef<HTMLDivElement>(null);

  // this layout effect deals with injecting HTML and adding reveal/hide buttons
  // to secrets
  useLayoutEffect(() => {
    if (!ref.current) {
      return;
    }

    // equivalent of putting dangerouslySetInnerHTML={{ __html: html }} on the
    // div, but this way the effect hook is properly dependant on the value of
    // `html`
    ref.current.innerHTML = html;

    // we only continue if we're the owner and we have a toggleSecret function
    if (!isOwner || !toggleSecret) {
      return;
    }

    // add one hide or reveal button to each section.secret
    ref.current.querySelectorAll("section.secret").forEach((section, i) => {
      systemLogger.log("Adding reveal button", i);
      const toggleSecretButton = document.createElement("button");
      toggleSecretButton.textContent = getTranslated(
        section.classList.contains("revealed")
          ? "Hide secret"
          : "Reveal secret",
      );
      toggleSecretButton.classList.add(secretToggleButtonClass);
      toggleSecretButton.addEventListener("click", () => {
        toggleSecret(i);
      });
      section.append(toggleSecretButton);
    });
  }, [html, isOwner, toggleSecret]);

  return (
    <div
      ref={ref}
      className={className}
      css={{
        minHeight: "100%",
        "section.secret": {
          display: isOwner ? "block" : "none",
          "&.revealed": {
            display: "block",
          },
        },
      }}
    />
  );
};

NotesDisplay.displayName = "NotesDisplay";
