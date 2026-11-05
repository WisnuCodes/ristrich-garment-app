import { create } from 'zustand';
import { calculateTotalPcs } from '../utils/formatters';

const initialSizes = {
  S: 0,
  M: 0,
  L: 0,
  XL: 0,
  XXL: 0,
};

export const usePesananStore = create((set, get) => ({
  draftSizes: { ...initialSizes },
  totalPcs: 0,

  setSize: (size, count) => {
    const val = Math.max(0, parseInt(count, 10) || 0);
    const updated = {
      ...get().draftSizes,
      [size]: val,
    };
    set({
      draftSizes: updated,
      totalPcs: calculateTotalPcs(updated),
    });
  },

  incrementSize: (size) => {
    const current = get().draftSizes[size] || 0;
    get().setSize(size, current + 1);
  },

  decrementSize: (size) => {
    const current = get().draftSizes[size] || 0;
    if (current > 0) {
      get().setSize(size, current - 1);
    }
  },

  resetDraft: () => {
    set({
      draftSizes: { ...initialSizes },
      totalPcs: 0,
    });
  },
}));

