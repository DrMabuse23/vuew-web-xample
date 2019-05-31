import Vue from 'vue';
import Vuex from 'vuex';
import { IDataTable } from './models/data.model';
import data from './data.json';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    data: data,
    countrys: data.customers.filter((entry: any) => entry.sites.name),
  },
  getters: {
    getCustomers: (state) => state.data.customers
  },
  mutations: {
    filterByName(state, name) {
      state.data.customers = state.data.customers.filter((entry: any) => entry.sites.name === name);
    },
  },
  actions: {
    filterByName({ commit }, name) {
      commit('filterByName', name);
    },
  },
});
