/**
 * @class Store
 *
 * Tiny Simple Store
 *
 * @namespace CsfdMagnets
 * @author Bartholomej
 * @see https://github.com/bartholomej/csfd-magnets
 */

export default class Store {
  private id: number;

  public get filmId(): number {
    return this.id;
  }

  public set filmId(filmId: number) {
    this.id = filmId;
  }
}
