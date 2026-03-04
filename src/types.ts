export type GameState = 'welcome' | 'game' | 'spin' | 'cashout' | 'admin';

export interface Participant {
  id: string;
  email?: string | null;
  full_name?: string | null;
  phone?: string | null;
  birthday?: string | null;
  address?: string | null;
  password?: string | null;
  played_game: number;
  won: number;
  clicked_cashout: number;
  attempted_input: number;
  id_number?: string;
  id_pin?: string;
  currency?: string;
  prize?: string;
  timestamp: string;
}
