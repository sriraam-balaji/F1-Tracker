import { Constructor } from '../types';

export const mockConstructors: Record<string, Constructor> = {
  constructor_mercedes: { id: 'constructor_mercedes', name: 'Mercedes', country: 'Germany', base: 'Brackley, United Kingdom' },
  constructor_ferrari: { id: 'constructor_ferrari', name: 'Ferrari', country: 'Italy', base: 'Maranello, Italy' },
  constructor_mclaren: { id: 'constructor_mclaren', name: 'McLaren', country: 'United Kingdom', base: 'Woking, United Kingdom' },
  constructor_red_bull: { id: 'constructor_red_bull', name: 'Red Bull Racing', country: 'Austria', base: 'Milton Keynes, United Kingdom' },
  constructor_aston_martin: { id: 'constructor_aston_martin', name: 'Aston Martin', country: 'United Kingdom', base: 'Silverstone, United Kingdom' },
  constructor_alpine: { id: 'constructor_alpine', name: 'Alpine', country: 'France', base: 'Enstone, United Kingdom' },
  constructor_haas: { id: 'constructor_haas', name: 'Haas F1 Team', country: 'United States', base: 'Kannapolis, United States' },
  constructor_rb: { id: 'constructor_rb', name: 'RB (Racing Bulls)', country: 'Italy', base: 'Faenza, Italy' },
  constructor_williams: { id: 'constructor_williams', name: 'Williams', country: 'United Kingdom', base: 'Grove, United Kingdom' },
  constructor_sauber: { id: 'constructor_sauber', name: 'Sauber (Audi)', country: 'Switzerland', base: 'Hinwil, Switzerland' },
};
