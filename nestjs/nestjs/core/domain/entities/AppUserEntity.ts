export class AppUserEntity {
  public id: string;
  public name: string;
  public email: string;

  constructor(data: object = { id: null, name: null, email: null }) {
    for (const attr in data) this[attr] = data[attr];
  }
}
