<template>
<div>
  <data-table :main-data='test' msg='Hi Data table WEBC'></data-table>
  <pre>
    {{test}}
  </pre>
  
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
export default class Home extends Vue {
  private data() {
    return {
      test: [
        {
          DT_RowId: 'row_36',
          users: {
            first_name: 'Stewart',
            last_name: 'Chan',
            phone: '1-781-793-2340',
            site: 6,
          },
          sites: {
            name: 'Los Angeles',
          },
        },
      ]
    };
  }
  private created() {
    /* tslint:disable */
    console.log(this);
    debugger;
    /* tslint:enable */
  }
}
</script>
