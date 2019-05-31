<template>
<div>
  <data-table :main-data="getCustomers" msg="Hi Data table WEBC"></data-table>
</div>

</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
import { mapState, mapGetters } from 'vuex';
import { IDataTable } from '../../../component/src/models/data.model';

@Component({
   computed: {
     ...mapGetters([
       'getCustomers',
     ]),
  }
})
export default class Home extends Vue {}
</script>
