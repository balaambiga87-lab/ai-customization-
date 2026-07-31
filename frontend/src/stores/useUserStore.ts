import { create } from 'zustand';

interface UserState {
  userId: string | null;
  email: string | null;
  name: string | null;
  role: string | null;
  isLoggedIn: boolean;
  setUser: (user: { id: string; email: string; name: string | null; role: string }) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  userId: null,
  email: null,
  name: null,
  role: null,
  isLoggedIn: false,
  setUser: (user) =>
    set({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isLoggedIn: true,
    }),
  clearUser: () =>
    set({
      userId: null,
      email: null,
      name: null,
      role: null,
      isLoggedIn: false,
    }),
}));
