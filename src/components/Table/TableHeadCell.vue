
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
              this.head.children.map((child, index) => {
                return (<TableHeadCell
                  key={child.field + index}
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
        return this.head.name || this.head.title
      }
    },
    renderSlotTitleSort () {
      if (this.sortTag.key === this.head.field) {
        return ['↑', '↓'][this.sortTag.type]
      }
    }
  },
  render () {
    const style = { 'flex-grow': 1 }
    const alignMap = {
      left: ['flex-start', 'left'],
      right: ['flex-end', 'right'],
      center: ['center', 'center'],
      undefined: ['center', 'center']
    }
    style['justify-content'] = alignMap[this.head.align][0]
    style['text-align'] = alignMap[this.head.align][1]
    return (
      <div class="table-head-cell">
        <TableCell
          style={style}
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
  background:linear-gradient(#ccc,#ccc) no-repeat;
  background-size:100% 1px;
  background-position:0 100%;
}
</style>
