import { FoundryAppContext } from "@lumphammer/shared-fvtt-bits/src/FoundryAppContext";
import React, { useCallback, useContext } from "react";

import { ThemeContext } from "../../themes/ThemeContext";
import { CardItem } from "../../v10Types";
import { CardDisplay } from "./CardDisplay";
import { CardsAreaSettingsContext } from "./contexts";

interface CardArrayCardProps {
  card: CardItem;
  className?: string;
}

export const CardArrayCard: React.FC<CardArrayCardProps> = ({
  card,
  className,
}) => {
  const theme = useContext(ThemeContext);
  const app = useContext(FoundryAppContext);

  const { category: categorySetting, viewMode } = useContext(
    CardsAreaSettingsContext,
  );

  const handleDragStart = useCallback(
    (e: React.DragEvent<HTMLElement>) => {
      if (app !== null) {
        (app as any)._onDragStart(e);
      }
    },
    [app],
  );

  const showCategory = !(categorySetting === "categorized");

  return (
    <CardDisplay
      key={card.id}
      draggable
      onDragStart={handleDragStart}
      className={className}
      card={card}
      css={{
        cursor: "pointer",
        marginBottom: theme.cardStyles.verticalSpacing,
        opacity: card.system.active ? 1 : 0.5,
        transition: "opacity 0.2s ease-in-out",
        ":hover": theme.cardStyles.hoverStyle,
      }}
      showCategory={showCategory}
      viewMode={viewMode}
    />
  );
};

CardArrayCard.displayName = "CardArrayCard";
