"use client";

import React, { useState, useEffect } from "react";
import CustomContextMenu, { ContextMenuItem } from "./context-menu";

interface ContextMenuTriggerProps {
  menuItems: ContextMenuItem[];
  children: React.ReactNode;
}

const ContextMenuTrigger: React.FC<ContextMenuTriggerProps> = ({
  menuItems,
  children,
}) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuPosition({ x: e.pageX, y: e.pageY });
    setMenuVisible(true);
  };

  useEffect(() => {
    // Hide the menu when clicking anywhere

    const handleClick = () => {
      if (menuVisible) setMenuVisible(false);
    };
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [menuVisible]);

  if (!children) return null;

  let childWithContextMenu = children;
  if (React.isValidElement(children)) {
    // Cast the child element's props to accept onContextMenu
    const element = children as React.ReactElement<{
      onContextMenu?: (e: React.MouseEvent) => void;
    }>;
    const originalOnContextMenu = element.props.onContextMenu;
    const combinedOnContextMenu = (e: React.MouseEvent) => {
      if (originalOnContextMenu) originalOnContextMenu(e);
      handleContextMenu(e);
    };

    childWithContextMenu = React.cloneElement(element, {
      onContextMenu: combinedOnContextMenu,
    });
  } else {
    console.warn("ContextMenuTrigger: children is not a valid React element");
  }

  return (
    <>
      {childWithContextMenu}
      <CustomContextMenu
        visible={menuVisible}
        position={menuPosition}
        items={menuItems}
      />
    </>
  );
};

export default ContextMenuTrigger;
