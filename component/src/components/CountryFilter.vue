<script lang="tsx">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class CountryFilter extends Vue {
  @Prop() private countries!: string[];
  render() {
    return (
      <select>
        {this.countries.forEach((country) => `<option value="${country}">${country}</option>`)}
      </select>  
    );
  }
}
</script>
<style scoped>
select {
  color: green;
}
</style>
