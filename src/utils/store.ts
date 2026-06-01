import { CSFDFilmTypes, CSFDSiteDomain } from './interfaces';

export interface ExtensionStore {
  filmId: number;
  CSFDSiteDomain: CSFDSiteDomain | null;
  year: number | null;
  filmType: CSFDFilmTypes;
}

export const store: ExtensionStore = {
  filmId: 0,
  CSFDSiteDomain: null,
  year: null,
  filmType: 'film',
};
