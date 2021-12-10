
<script>
import TableHeadCell from './TableHeadCell'
export default {
  name: 'TableHead',
  components: { TableHeadCell },
  props: {
    headData: Array,
    sortTag: Object,
    virtualBeginCol: Number,
    virtualColSize: Number,
    virtualBoxStyle: Object
  },
  computed: {
    virtualHeadData () {
      return this.headData.filter(head => {
        return (head.endIndex >= this.virtualBeginCol) && (head.beginIndex <= (this.virtualBeginCol + this.virtualColSize))
      })
    }
  },
  methods: {
    sortData (head) {
      this.$emit('sortData', head)
    },
    renderCell (headData) {
      let style = {}
      if (this.virtualBeginCol > -1) {
        style = { transform: `translate(${headData[0].transformX}px, 0px)` }
      }
      return headData.map((head, index) => {
        return (
          <TableHeadCell
            key={head.field + index}
            style={{ width: head.width + 'px', ...style }}
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
    let headData = this.headData
    let style = {}
    if (this.virtualBeginCol > -1) {
      headData = this.virtualHeadData
      style = {
        ...this.virtualBoxStyle
      }
    }
    return (
      <div class="table-head" style={style}>
        {this.renderCell(headData)}
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
