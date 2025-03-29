import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AppUserDocument = HydratedDocument<AppUser>;

@Schema({ collection: 'app_user' })
export class AppUser {
  // id: string;

  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop([
    {
      type: { type: String, enum: ['email', 'phone'] },
      value: String,
    },
  ])
  contacts: { type: string; value: string }[];

  @Prop([
    {
      name: String,
      route: String,
      number: String,
      complement: String,
      zipcode: String,
      neighborhood: String,
      city: String,
      city_code: String,
      state: String,
      state_code: String,
      country: String,
      country_code: String,
      lat: Number,
      lng: Number,
    },
  ])
  addresses: {
    name: string;
    route: string;
    number: string;
    complement: string;
    zipcode: string;
    neighborhood: string;
    city: string;
    city_code: string;
    state: string;
    state_code: string;
    country: string;
    country_code: string;
    lat: number;
    lng: number;
  }[];
}

export const AppUserSchema = SchemaFactory.createForClass(AppUser);

AppUserSchema.pre('save', function (next) {
  this.addresses = this.addresses.map((address) => {
    const name: string[] = [];
    if (address.route) name.push(address.route);
    if (address.number) name.push(address.number);
    if (address.neighborhood) name.push(address.neighborhood);
    if (address.city) name.push(address.city);
    address.name = name.join(', ');
    return address;
  });
  next();
});
