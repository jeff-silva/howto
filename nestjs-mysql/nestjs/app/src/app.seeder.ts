/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { AppUserService } from './app_user/app_user.service';
import { AppUserGroupService } from './app_user_group/app_user_group.service';

type SeedService = {
  create(data: Record<string, any>): Promise<any>;
  update(_id: string, data: Record<string, any>): Promise<any>;
  findOne(query: { [key: string]: any }): Promise<any | null>;
  create(data: { [key: string]: any }): Promise<any>;
};

interface SeedItem {
  find?: Record<string, any>;
  create?: Record<string, any>;
  update?: Record<string, any>;
}

@Injectable()
export class AppSeeder implements OnApplicationBootstrap {
  constructor(
    private readonly appUserService: AppUserService,
    private readonly appUserGroupService: AppUserGroupService,
  ) {}

  async onApplicationBootstrap() {
    const appUserGroupList = await this.seedData(this.appUserGroupService, [
      {
        find: { slug: 'main' },
        create: {
          slug: 'main',
          name: 'Main User Group',
        },
      },
    ]);

    const appUserGroupMain = appUserGroupList.at(0);

    const appUserList = await this.seedData(this.appUserService, [
      {
        find: { email: 'main@grr.la' },
        create: {
          name: 'Main User',
          email: 'main@grr.la',
          password: 'main@grr.la',
        },
        update: { group_id: appUserGroupMain.id },
      },
    ]);

    console.log({ appUserGroupList, appUserList });
  }

  async seedData(service: any, items: SeedItem[]) {
    return Promise.all(
      items.map(async (item) => {
        let find: null | Record<string, any> = null;
        if (item.find) {
          find = await service.findOne(item.find);
        }
        if (find) {
          find = await service.update(find._id, item.update || {});
        } else {
          find = await service.create(item.create || {});
        }
        return JSON.parse(JSON.stringify(find));
      }),
    );
  }
}
