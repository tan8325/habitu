import { create } from "zustand";

type ModalStore = {
  openModal: string | null; 
  open: (modalName: string) => void; 
  close: () => void; 
};

export const useModalStore = create<ModalStore>((set) => ({
  openModal: null,
  open: (modalName) => set({ openModal: modalName }), 
  close: () => set({ openModal: null }), 
}));
