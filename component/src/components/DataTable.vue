<script lang="tsx">
import { Component, Prop, Vue } from "vue-property-decorator";
import { IDataTable } from "./../models/data.model";

@Component
export default class DataTable extends Vue {
  @Prop() private mainData!: string;
  @Prop () private msg!: string;
  
  private getParsedCustomer(data: string): IDataTable[] {
    const myData: {customers: IDataTable[]} = JSON.parse(data);
    return myData.customers;
  }
  
  private render() {
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
        <tbody v-if="mainData">{this.getParsedCustomer(this.mainData).map((element) => (
          <tr>
            <td>{element.users.first_name}</td>
            <td>{element.users.last_name}</td>
            <td>{element.sites.name}</td>
          </tr>
        ))}</tbody>
      </table>
    </div>
    );
  }
}
</script>

<style scoped></style>