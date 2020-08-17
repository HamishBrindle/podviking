<template>
  <div class="users-list users-list__wrapper">
    <v-row>
      <v-col>
        <span class="display-1 font-weight-light">{{ title }}</span>
      </v-col>
    </v-row>
    <v-card
      class="users-list__card"
      elevation="0"
      outlined
    >
      <v-skeleton-loader
        v-show="loading.table"
        type="table-tbody"
        width="100%"
        height="100%"
      />
      <v-data-table
        v-show="!loading.table"
        :headers="headers"
        :items="data"
        disable-sort
        disable-pagination
        hide-default-footer
      />
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { Loading } from '@/lib/types';
import { User } from '@/models/internal';
import { UserService } from '@/services';
import { DataTableHeader } from 'vuetify';
import { ITableView } from '@/lib/interfaces';
import Logger from '@/tools/Logger';
import moment from 'moment';

@Component({
  name: 'UsersList',
})
export default class UsersList extends Vue implements ITableView<User> {
  /**
   * Title to be displayed at top of component/view
   */
  private readonly title = 'Users';

  /**
   * User Service
   */
  private readonly userService: UserService = UserService.getInstance();

  /**
   * Loading state handlers
   */
  private readonly loading: Loading = {
    table: false,
  }

  data: User[] = [];

  selected: User[] = [];

  headers: DataTableHeader[] = [
    { text: 'ID', value: 'id' },
    { text: 'Email', value: 'email' },
    { text: 'Created At', value: 'created_at' },
    { text: 'Updated At', value: 'updated_at' },
    { text: 'Name', value: 'name' },
  ];

  created() {
    this.init();
  }

  async fetchData() {
    const user = this.userService.getActive();
    if (!user) throw Error('Unable to find active User');
    return this.userService.api.find({
      authentication_token: user.authentication_token ?? '',
    });
  }

  async init() {
    this.loading.table = true;
    try {
      const { data: { order_form_users: users }} = await this.fetchData();
      await this.userService.insertOrUpdate({ data: users });
      this.data = this.userService
        .all()
        .sort((a: any, b: any) => a.id - b.id)
        .map((user: User) => ({
          id: user.id,
          email: user.email,
          name: user.name,
          created_at: moment(user.created_at).format('YYYY MMM DD'),
          updated_at: moment(user.updated_at).format('YYYY MMM DD'),
        } as User));
    } catch (error) {
      Logger.error(error);
    } finally {
      this.loading.table = false;
    }
  }
}
</script>

<style lang="scss">
.users-list {
  &__card {
    padding: 1rem;
  }
}
</style>
