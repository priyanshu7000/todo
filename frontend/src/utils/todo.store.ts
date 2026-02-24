import { create } from 'zustand';

export interface TodoStore {
  refreshTrigger: number;
  triggerRefresh: () => void;
}

export const useTodoStore = create<TodoStore>((set) => ({
  refreshTrigger: 0,
  triggerRefresh: () => {
    set((state) => ({ refreshTrigger: state.refreshTrigger + 1 }));
  },
}));
