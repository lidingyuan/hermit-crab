
<script>
import TableCell from './TableCell'
export default {
  name: 'TableBody',
  components: { TableCell },
  props: {
    dataList: Array,
    dataProp: Object,
    virtualBeginCol: Number,
    virtualBeginRow: Number,
    virtualBoxStyle: Object,
    virtualRowSize: Number,
    virtualColSize: Number,
    renderType: Number,
    baseRowHeight: Number,
    renderRowHeight: Array,
    excelMode: Boolean,
    hoverRow: Number,
    selectRow: Number,
    mixRender: Object
  },
  data () {
    return {

      renderDataList: [],
      renderDataProp: {},
      rendering: false,

      useRenderRowHeight: [],

      transformY: 0,
      transformX: 0,

      virtualBoxDirty: false
    }
  },
  computed: {
    useExcelMode () {
      return this.excelMode && !Object.keys(this.$scopedSlots).length
    },
    pasteData () {
      return this.mixRender?.data?.pasteData || {}
    }
  },
  watch: {
    virtualBeginRow () { this.getRenderDataList() },
    virtualBeginCol () { this.getRenderDataList() },
    virtualRowSize () { this.getRenderDataList() },
    virtualColSize () { this.getRenderDataList() },
    dataList () { this.getRenderDataList('force') },
    renderRowHeight () {
      this.computeHeight()
    },
    pasteData () {
      this.computeHeight('force')
    },
    virtualBoxStyle () {
      this.virtualBoxDirty = true
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.getRenderDataList()
    })
  },
  methods: {
    getRenderDataList (force) {
      if (this.rendering) {
        return
      }
      this.rendering = true
      if (this.virtualBeginRow === undefined || this.virtualBeginRow === -1) {
        this.renderDataList = this.dataList
      } else {
        let begin = this.virtualBeginRow - parseInt(0.5 * this.virtualRowSize)
        if (begin < 0) {
          begin = 0
        }
        const end = this.virtualBeginRow + parseInt(1.5 * this.virtualRowSize)
        this.renderDataList = this.dataList.slice(begin, end)
        this.transformY = this.dataList[begin]?.transformY
      }
      if (this.virtualBeginCol === undefined || this.virtualBeginCol === -1) {
        this.renderDataProp = this.dataProp
      } else {
        const renderDataProp = {}
        Object.keys(this.dataProp).slice(this.virtualBeginCol, this.virtualBeginCol + this.virtualColSize).forEach(key => {
          renderDataProp[key] = this.dataProp[key]
        })
        this.renderDataProp = renderDataProp
        this.transformX = Object.values(this.dataProp)[this.virtualBeginCol]?.transformX
      }
      this.$nextTick(() => {
        this.renderType === 1 && this.computeHeight(force)
        this.rendering = false
      })
    },
    computeHeight (force) {
      this.useRenderRowHeight = new Array(this.renderDataList.length).fill('auto')
      this.$nextTick(() => {
        // 渲染完成后计算高度
        const renderRowHeight = force ? [] : [...this.renderRowHeight]
        let change = false
        this.renderDataList.forEach(row => {
          const clientHeight = this.$refs['row-' + row.rowIndex].clientHeight
          const height = renderRowHeight[row.rowIndex] || 0
          if (height < clientHeight) {
            renderRowHeight[row.rowIndex] = clientHeight
            change = true
          }
        })
        this.useRenderRowHeight = renderRowHeight.map(num => num + 'px')
        change && this.$emit('update:renderRowHeight', renderRowHeight)
        if (force) {
          this.start?.refresh && this.start.refresh()
          this.end?.refresh && this.end.refresh()
          this.start?.refresh && this.end?.refresh && this.pick(this.end)
        }
      })
    }
  },
  render () {
    const virtualBoxStyle = { ...this.virtualBoxStyle }
    if (this.$el && !this.virtualBoxDirty) {
      virtualBoxStyle['min-height'] = Math.max(parseInt(virtualBoxStyle['min-height']), this.$el.clientHeight) + 'px'
      virtualBoxStyle['min-width'] = Math.max(parseInt(virtualBoxStyle['min-width']), this.$el.clientWidth) + 'px'
    }
    this.virtualBoxDirty = false
    function getRowStyle (row) {
      const style = this.virtualBeginRow === undefined || this.virtualBeginRow === -1
        ? { height: this.useRenderRowHeight[row.rowIndex] }
        : this.renderType === 1
          ? { height: this.useRenderRowHeight[row.rowIndex], transform: `translate(0,${this.transformY}px)` }
          : { transform: `translate(0,${row.transformY}px)`, position: 'absolute', top: 0 }
      return style
    }
    function getCellStyle (col) {
      const style = this.virtualBeginCol === undefined || this.virtualBeginCol === -1
        ? { width: col.width + 'px' }
        : this.renderType === 1
          ? { width: col.width + 'px', transform: `translate(${this.transformX}px,0)` }
          : { width: col.width + 'px', transform: `translate(${col.transformX}px,0)`, position: 'absolute', top: 0, height: this.baseRowHeight + 'px' }
      const alignMap = {
        left: ['flex-start', 'left'],
        right: ['flex-end', 'right'],
        center: ['center', 'center'],
        undefined: ['center', 'center']
      }
      style['justify-content'] = alignMap[col.align][0]
      style['text-align'] = alignMap[col.align][1]
      return style
    }
    function getScopedSlots (propKey, row, col) {
      if (this.$scopedSlots[propKey]) {
        return this.$scopedSlots[propKey]({
          rowIndex: row.rowIndex,
          colIndex: col.colIndex,
          row: row.rawData,
          propKey: propKey
        })
      } else {
        return this.pasteData[row.rawRowIndex] && this.pasteData[row.rawRowIndex][col.rawColIndex] !== undefined
          ? this.pasteData[row.rawRowIndex][col.rawColIndex]
          : col.formatter
            ? col.formatter({ cellValue: row.rawData[propKey] })
            : row.rawData[propKey]
      }
    }
    function renderRow (row) {
      const classList = ['table-body-row']
      if (this.hoverRow === row.rawRowIndex) {
        classList.push('row-hover')
      }
      if (this.selectRow === row.rawRowIndex) {
        classList.push('row-select')
      }
      if (this.$scopedSlots['row:' + row.rowIndex]) {
        return (
          <div
            ref={`row-${row.rowIndex}`}
            key={row.rowIndex}
            rowIndex={row.rowIndex}
            rawRowIndex={row.rawRowIndex}
            class={classList}
            style={getRowStyle.call(this, row)}
          >
            {
              this.$scopedSlots['row:' + row.rowIndex]({
                rowIndex: row.rowIndex,
                row: row.rawData
              })
            }
          </div>
        )
      } else {
        return (
          <div
            ref={`row-${row.rowIndex}`}
            key={row.rowIndex}
            rowIndex={row.rowIndex}
            rawRowIndex={row.rawRowIndex}
            class={classList}
            style={getRowStyle.call(this, row)}
          >
            {
              Object.keys(this.renderDataProp).map(propKey => {
                const col = this.renderDataProp[propKey]
                return (
                  <TableCell
                    key={propKey}
                    style={getCellStyle.call(this, col)}
                    row-index={row.rowIndex}
                    raw-row-index={row.rawRowIndex}
                    raw-col-index={col.rawColIndex}
                    col-index={col.colIndex}
                  >
                    {getScopedSlots.call(this, propKey, row, col)}
                  </TableCell>
                )
              })
            }
          </div>
        )
      }
    }
    const listener = {}
    this.mixRender && Object.keys(this.mixRender.listener).forEach(key => {
      const that = this
      listener[key] = function (e) {
        that.mixRender.listener[key](e, that)
      }
    })
    return (
      <div
        class="table-body"
        style={virtualBoxStyle}
        {...{
          on: listener
        }}
      >
        {
          this.mixRender && Object.values(this.mixRender.render).map(fun => {
            return fun(this)
          })
        }
        {
          this.renderDataList.map(row => {
            return renderRow.call(this, row)
          })
        }
      </div>
    )
  }
}
</script>

<style lang='scss' scoped>
.table-body-row{
  display: flex;
  background:linear-gradient(#ccc,#ccc) no-repeat,linear-gradient(#ccc,#ccc) no-repeat;
  background-size:100% 1px,1px 100%;
  background-position:0 100%,100% 0;
  &.row-hover{
    background-color: #eee;
  }
  &.row-select{
    background-color: #eee;
  }
}
.table-body{
  position: relative;
}
</style>
