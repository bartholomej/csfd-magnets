/**
 * @class Store
 *
 * Tiny Simple Store
 *
 * @namespace CsfdMagnets
 * @author Bartholomej
 * @see https://github.com/bartholomej/csfd-magnets
 */

import { CSFDFilmTypes } from '@interfaces/interfaces';

export default class Store {
  private id: number;
  private _year: number;
  private _filmType: CSFDFilmTypes;

  public get filmId(): number {
    return this.id;
  }

  public set filmId(filmId: number) {
    this.id = filmId;
  }

  public get year(): number {
    return this._year;
  }

  public set year(year: number) {
    this._year = year;
  }

  public get filmType(): CSFDFilmTypes {
    return this._filmType;
  }

  public set filmType(filmType: CSFDFilmTypes) {
    this._filmType = filmType;
  }
}
