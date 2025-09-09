import { create } from "zustand";

type SidebarState = {
  collapsed: boolean;
  toggle: () => void;
  set: (value: boolean) => void;
};

export const useSidebarStore = create<SidebarState>((set) => ({
  collapsed: false,
  toggle: () => set((s) => ({ collapsed: !s.collapsed })),
  set: (value) => set({ collapsed: value }),
}));

type SelectionState = {
  selectedLeadId: string | null;
  selectedCampaignId: string | null;
  selectLead: (id: string | null) => void;
  selectCampaign: (id: string | null) => void;
};

export const useSelectionStore = create<SelectionState>((set) => ({
  selectedLeadId: null,
  selectedCampaignId: null,
  selectLead: (id) => set({ selectedLeadId: id }),
  selectCampaign: (id) => set({ selectedCampaignId: id }),
}));

type UIState = {
  filtersOpen: boolean;
  setFiltersOpen: (open: boolean) => void;
};

export const useUIStore = create<UIState>((set) => ({
  filtersOpen: false,
  setFiltersOpen: (open) => set({ filtersOpen: open }),
}));


