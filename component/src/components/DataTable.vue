<script lang="tsx">
import { Component, Prop, Vue } from "vue-property-decorator";
import { IDataTable } from './../models/data.model';

@Component
export default class DataTable extends Vue {
  @Prop() private mainData!: string;
  @Prop () private msg!: string;

  created() {
    /* tslint:disable */
    console.log(this.mainData);
    /* tslint:enable */
  }
  render() {
    return (
    <div>
      <h1>{this.msg}</h1>
      <table>
      <colgroup span="3" class="columns"></colgroup>
        <thead>
          <tr>
            <th>First name</th>
            <th>Last name</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody v-if="mainData">
        {JSON.parse(this.mainData).forEach((element: IDataTable) => {
          `
          ${JSON.stringify(element, null, 2)}
          <tr>
            <td>${element.users.first_name}</td>
            <td>${element.users.last_name}</td>
            <td>${element.sites.name}</td>
          </tr>
          `
        })}
        </tbody>
      </table>
    </div>
    );
  }
}
</script>

<style scoped></style>