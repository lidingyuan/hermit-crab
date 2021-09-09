
<script>
import TableHeadCell from './TableHeadCell'
export default {
  name: 'TableHead',
  components: { TableHeadCell },
  props: {
    headData: Array,
    sortTag: Object
  },
  methods: {
    sortData (head) {
      this.$emit('sortData', head)
    },
    renderCell () {
      return this.headData.map(head => {
        return (
          <TableHeadCell
            key={head.field}
            style={{ width: head.width + 'px' }}
            head={head}
            sortTag={this.sortTag}
            {...{
              on: {
                sortData: this.sortData
              }
            }}
            scopedSlots={this.$scopedSlots}
          >
          </TableHeadCell>
        )
      })
    }
  },
  render () {
    return (
      <div class="table-head">
        {this.renderCell()}
      </div>
    )
  }
}
</script>

<style lang='scss' scoped>
@import '~@/assets/style/default.scss';
.table-head{
  display: flex;
  align-items: center;
  height: 100%;
}
</style>
