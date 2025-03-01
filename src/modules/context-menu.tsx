"use client";

import React from "react";

export interface ContextMenuItem {
  label: string;
  onClick: (() => void) | (() => Promise<void>);
  icon?: React.ReactNode;
}

interface CustomContextMenuProps {
  visible: boolean;
  position: { x: number; y: number };
  items: ContextMenuItem[];
}

const CustomContextMenu: React.FC<CustomContextMenuProps> = ({
  visible,
  position,
  items,
}) => {
  if (!visible) return null;

  const style: React.CSSProperties = {
    position: "absolute",
    top: position.y,
    left: position.x,
    zIndex: 1000,
  };

  return (
    <ul
      style={style}
      className="rounded-md flex flex-col gap-1 bg-neutral-900 w-44 p-1"
    >
      {items.map((item, index) => (
        <li
          key={index}
          onClick={item.onClick}
          className="cursor-pointer p-2 flex justify-between hover:bg-neutral-900 bg-neutral-800 rounded-sm"
        >
          <span>{item.label}</span>

          {item.icon && <span className="ml-2">{item.icon}</span>}
        </li>
      ))}
    </ul>
  );
};

export default CustomContextMenu;
