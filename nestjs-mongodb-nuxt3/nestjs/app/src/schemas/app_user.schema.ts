import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AppUserDocument = HydratedDocument<AppUser>;

@Schema()
export class AppUser {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  password: string;
}

export const AppUserSchema = SchemaFactory.createForClass(AppUser);
