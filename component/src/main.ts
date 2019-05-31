import Vue from "vue";
import wrap from '@vue/web-component-wrapper';
import DataTable from './components/DataTable.vue';


Vue.config.productionTip = false;
const DataTableElement = wrap(Vue, DataTable);
window.customElements.define('data-table', DataTableElement);
