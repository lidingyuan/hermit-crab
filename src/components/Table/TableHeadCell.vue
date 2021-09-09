
<script>
import TableCell from './TableCell.vue'
export default {
  name: 'TableHeadCell',
  components: { TableCell },
  props: { head: Object, sortTag: Object },
  methods: {
    sortData (head) {
      this.$emit('sortData', head)
    },
    renderChildren () {
      if (this.head.children.length) {
        return (
          <div
            class="table-head-row"
          >
            {
              this.head.children.map(child => {
                return (<TableHeadCell
                  key={child.field}
                  style={`width:${child.width}px`}
                  head={child}
                  sortTag={this.sortTag}
                  {...{
                    on: {
                      sortData: this.sortData
                    }
                  }}
                  scopedSlots={{ ...this.$scopedSlots }}
                />)
              })
            }
          </div>
        )
      }
    },
    renderSlotTitle () {
      if (this.$scopedSlots[this.head.field]) {
        return (
          this.$scopedSlots[this.head.field](this.head)
        )
      } else {
        return (
          <div style={{ width: '100%', ...this.head.style }}>{this.head.name}</div>
        )
      }
    },
    renderSlotTitleSort () {
      if (this.sortTag.key === this.head.field) {
        return ['↑', '↓'][this.sortTag.type]
      }
    }
  },
  render () {
    return (
      <div class="table-head-cell">
        <TableCell
          style={{ 'flex-grow': 1 }}
          {...{
            on: {
              click: () => { this.$emit('sortData', this.head) }
            }
          }}
        >
          {this.renderSlotTitle()}
          {this.renderSlotTitleSort()}
        </TableCell>
        {this.renderChildren()}
      </div>
    )
  }
}
</script>

<style lang='scss' scoped>
.table-head-cell{
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  height: 100%;
  background: #999;
}
.table-head-row{
  display: flex;
  flex-grow: 1;
}
</style>
