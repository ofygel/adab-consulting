import { create } from 'zustand';

type StoreState = {
  activeSection: string;
  setActiveSection: (section: string) => void;
  isVideoPlaying: boolean;
  toggleVideoPlay: () => void;
};

export const useStore = create<StoreState>((set) => ({
  activeSection: 'home',
  setActiveSection: (section) => set({ activeSection: section }),
  isVideoPlaying: true,
  toggleVideoPlay: () => set((state) => ({ isVideoPlaying: !state.isVideoPlaying })),
}));