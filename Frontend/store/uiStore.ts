import { create } from "zustand";
import { persist } from "zustand/middleware";

type UiState = {
	isSidebarOpen: boolean;
	openSidebar: () => void;
	closeSidebar: () => void;
	toggleSidebar: () => void;
	currentRole: string;
	setCurrentRole: (role: string) => void;
	isBottomNavVisible: boolean;
	setBottomNavVisible: (visible: boolean) => void;
};

export const useUiStore = create<UiState>()(
	persist(
		(set) => ({
			isSidebarOpen: false,
			openSidebar: () => set({ isSidebarOpen: true }),
			closeSidebar: () => set({ isSidebarOpen: false }),
			toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),
			currentRole: 'Employee',
			setCurrentRole: (role: string) => set({ currentRole: role }),
			isBottomNavVisible: true,
			setBottomNavVisible: (visible: boolean) => set({ isBottomNavVisible: visible }),
		}),
		{
			name: 'ui-storage',
			partialize: (state) => ({
				currentRole: state.currentRole,
			}),
		}
	)
);


