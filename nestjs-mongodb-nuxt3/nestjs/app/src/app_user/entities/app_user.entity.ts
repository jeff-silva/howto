/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcrypt';

export type AppUserDocument = HydratedDocument<AppUser>;

@Schema({
  collection: 'app_user',
  versionKey: false,
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class AppUser {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop({
    select: false,
    required: false,
    validate: {
      message: 'Password is required for new users',
      validator(value: string) {
        return this.isNew ? !!value : true;
      },
    },
  })
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

  @Prop({ type: Date, default: null })
  deleted_at: Date | null;
}

export const AppUserSchema = SchemaFactory.createForClass(AppUser);

const appUserDataValidate = async (appUser: Record<string, any>) => {
  if (appUser.password && !appUser.password.startsWith('$2b$')) {
    appUser.password = await bcrypt.hash(appUser.password, 10);
  }

  appUser.contacts = (appUser.contacts || []).map((contact) => {
    return { type: 'email', value: '', ...contact };
  });

  appUser.addresses = (appUser.addresses || []).map((address) => {
    const name: string[] = [];
    if (address.route) name.push(address.route);
    if (address.number) name.push(address.number);
    if (address.neighborhood) name.push(address.neighborhood);
    if (address.city) name.push(address.city);
    address.name = name.join(', ');
    return address;
  });

  return appUser;
};

AppUserSchema.pre('save', async function (next) {
  await appUserDataValidate(this);
  next();
});

AppUserSchema.pre('findOneAndUpdate', async function () {
  const update = this.getUpdate();
  if (update && typeof update === 'object' && '$set' in update) {
    if (update.$set) {
      this.set(await appUserDataValidate(update.$set));
    }
  }
});

AppUserSchema.pre('find', function () {
  this.where({ deleted_at: null });
});

AppUserSchema.pre('findOne', function () {
  this.where({ deleted_at: null });
});
