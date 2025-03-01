"use client";

import React, { createContext, useContext, useState } from "react";

const CreatePlaylistModal = createContext<{
  isOpened: boolean;
  open: (component: React.ReactNode) => void;
  close: () => void;
}>({
  isOpened: false,
  open: () => {},
  close: () => {},
});

CreatePlaylistModal.displayName = "CreatePlaylistModal";

export function useCreatePlaylistModalContext() {
  const context = useContext(CreatePlaylistModal);
  // if context is undefined this means it was used outside of its provider
  // you can throw an error telling that to your fellow developers
  if (!context) {
    throw new Error(
      "useModalContext must be used under <ModalContextProvider/>"
    );
  }
  return context;
}

export default function CreatePlaylistModalContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpened, setIsOpened] = useState(false);
  const [component, setComponent] = useState<React.ReactNode | null>(null);

  function open(component: React.ReactNode) {
    setComponent(component);
    setIsOpened(true);
  }

  function close() {
    setIsOpened(false);
  }

  return (
    <CreatePlaylistModal.Provider value={{ isOpened, open, close }}>
      <div className="relative">
        {isOpened && (
          <div
            className="absolute inset-0 z-50 bg-neutral-950/50 bg-opacity-50 flex items-center justify-center h-screen w-screen"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                close();
              }
            }}
          >
            {component}
          </div>
        )}
        {children}
      </div>
    </CreatePlaylistModal.Provider>
  );
}
