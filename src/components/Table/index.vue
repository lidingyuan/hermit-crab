
<script>
import TableHead from './TableHead'
import TableBody from './TableBody'
import ScrollBox from '../ScrollBox'
export default {
  name: 'Table',
  components: { TableHead, TableBody, ScrollBox },
  props: {
    // data
    columnList: {
      type: Array,
      default: () => []
    },
    dataList: {
      type: Array,
      default: () => []
    },
    stickyRows: {
      type: Number,
      default: 0
    },
    // virtual-scroll
    virtualRow: {
      type: Number,
      default: 60
    },
    virtualCol: {
      type: Number,
      default: 60
    },
    // renderType 1 不定高方向 2 定高方向还可优化（不渲染已有内容）
    renderType: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      scrollTop: 0,
      scrollLeft: 0,

      // tableData
      fixedHeadData: [],
      fixedRowsData: [],
      fixedBodyData: [],
      defaultHeadData: [],
      defaultRowsData: [],
      defaultBodyData: [],

      // tableProp
      fixedWidth: 0,
      defaultWidth: 0,
      dataProp: {},
      fixedDataProp: {},

      baseRowHeight: 0,
      viewHeight: 0,
      viewWidth: 0
    }
  },
  computed: {
    stickyDataList () {
      return this.dataList.slice(0, this.stickyRows).map((item, index) => {
        const row = {
          rowIndex: index,
          maxHeight: 0,
          rawData: item
        }
        return row
      })
    },
    defaultDataList () {
      return this.dataList.slice(this.stickyRows).map((item, index) => {
        const row = {
          rowIndex: index,
          maxHeight: 0,
          rawData: item
        }
        if (this.virtualRow <= this.dataList.length) {
          row.transformY = index * this.baseRowHeight
        }
        return row
      })
    },
    virtualBeginRow () {
      if (this.virtualRow > this.defaultDataList.length) {
        return -1
      }
      const rowIndex = parseInt(this.scrollTop / this.baseRowHeight) || 0
      return rowIndex
    },
    virtualRowSize () {
      return parseInt(this.viewHeight / this.baseRowHeight)
    },
    virtualBeginCol () {
      const propList = Object.values(this.dataProp)
      if (this.virtualCol > propList.length) {
        return -1
      }
      let colIndex = 0
      propList.find((prop, index) => {
        if (prop.transformX + prop.width > this.scrollLeft) {
          colIndex = index
          return true
        }
        return false
      })
      return colIndex
    },
    virtualColSize () {
      const propList = Object.values(this.dataProp)
      if (this.virtualCol > propList.length) {
        return -1
      }
      let colIndex = propList.length
      propList.find((prop, index) => {
        if (prop.transformX + prop.width > this.scrollLeft + this.viewWidth) {
          colIndex = index
          return true
        }
        return false
      })
      return colIndex - this.virtualBeginCol + 1
    },
    virtualBoxStyle () {
      return {
        height: this.baseRowHeight * this.defaultDataList.length + 'px',
        width: this.defaultWidth + 'px'
      }
    }
  },
  watch: {
    columnList: {
      handler (val) {
        if (val) {
          this.buildHead(val).forEach(head => {
            if (head.fixed) {
              this.fixedHeadData.push(head)
            } else {
              this.defaultHeadData.push(head)
            }
          })
        }
      },
      immediate: true
    }
  },
  mounted () {
    this.getViewSize()
    this.baseRowHeight = parseInt(window.getComputedStyle(this.$refs.main).lineHeight)
    window.addEventListener('resize', this.getViewSize, false)
  },
  methods: {
    scrollChange (scrollTop, scrollLeft) {
      if (scrollTop !== undefined) {
        this.scrollTop = scrollTop
      }
      if (scrollLeft !== undefined) {
        this.scrollLeft = scrollLeft
      }
    },
    buildHead (columnList, level = 1, parentIndex = 0) {
      const columnData = []
      let transformX = 0
      columnList.forEach((column, index) => {
        let children = []
        let width = column.width || 200
        let fixed = column.fixed || false
        let maxLevel = level
        if (column.children && column.children.length) {
          children = this.buildHead(column.children, level + 1, index)
          width = 0
          fixed = false
          children.forEach(item => {
            width += item.width
            fixed = fixed || item.fixed
            maxLevel = Math.max(item.level, level)
          })
        } else {
          if (fixed) {
            this.fixedDataProp[column.field] = { field: column.field, width: width, transformX: this.fixedWidth, colIndex: parentIndex + index, style: column.style }
            this.fixedWidth += width
          } else {
            this.dataProp[column.field] = { field: column.field, width: width, transformX: this.defaultWidth, colIndex: parentIndex + index, style: column.style }
            this.defaultWidth += width
          }
        }
        const data = {
          name: column.name,
          index: index,
          fixed,
          width,
          level: level,
          maxLevel: maxLevel,
          rawData: column,
          children
        }
        if (this.virtualCol <= this.columnList.length) {
          data.transformX = transformX
          transformX += width
        }
        columnData.push(data)
      })
      return columnData
    },
    getViewSize () {
      this.viewHeight = this.$refs.table.clientHeight
      this.viewWidth = this.$refs.table.clientWidth
    },
    renderHead () {
      return (
        <div class="head">
          <div class="crab-table-fixed">
            <TableHead headData={this.fixedHeadData}></TableHead>
          </div>
          {this.renderScrollBox(false, true, 'default-head', '', <TableHead headData={this.defaultHeadData}></TableHead>)}
        </div>
      )
    },
    renderStickyBody () {
      return (
        <div class="sticky-body">
          <div class="crab-table-fixed" style={{ width: this.fixedWidth + 'px' }}>
            {this.renderBody({
              dataList: this.stickyDataList,
              dataProp: this.fixedDataProp,
              virtualBoxStyle: {}
            })}
          </div>
          {this.renderScrollBox(false, true, 'crab-table-default', '', this.renderBody({
            dataList: this.stickyDataList,
            dataProp: this.dataProp,
            virtualBoxStyle: { width: this.virtualBoxStyle.width }
          }))}
        </div>
      )
    },
    renderDefaultBody () {
      return (
        <div class="body" ref="main">
          {this.renderScrollBox(true, false, 'crab-table-fixed', { width: this.fixedWidth + 'px' }, this.renderBody({
            dataList: this.defaultDataList,
            dataProp: this.fixedDataProp,
            virtualBeginRow: this.virtualBeginRow,
            virtualBoxStyle: { height: this.virtualBoxStyle.height },
            transformY: this.virtualBeginRow !== -1 ? this.scrollTop : 0,
            virtualRowSize: this.virtualRowSize,
            virtualColSize: this.virtualColSize
          }))}
          {this.renderScrollBox(true, true, 'crab-table-default', '', this.renderBody({
            dataList: this.defaultDataList,
            dataProp: this.dataProp,
            virtualBeginCol: this.virtualBeginCol,
            virtualBeginRow: this.virtualBeginRow,
            virtualBoxStyle: this.virtualBoxStyle,
            transformX: this.virtualBeginCol !== -1 ? this.scrollLeft : 0,
            transformY: this.virtualBeginRow !== -1 ? this.scrollTop : 0,
            virtualRowSize: this.virtualRowSize,
            virtualColSize: this.virtualColSize
          }))}
        </div>
      )
    },
    renderScrollBox (top, left, clazz, style, slot) {
      return (
        <ScrollBox
          class={clazz}
          type="flex"
          style={style}
          scrollLeft={left ? this.scrollLeft : 0}
          scrollTop={top ? this.scrollTop : 0}
          {
            ...{
              on:
              { scrollChange: (scrollTop, scrollLeft) => { this.scrollChange(top ? scrollTop : undefined, left ? scrollLeft : undefined) } }
            }
          }
        >
          {slot}
        </ScrollBox>
      )
    },
    renderBody (prop) {
      return (
        <TableBody
          dataList={prop.dataList}
          dataProp={prop.dataProp}
          renderType={this.renderType}
          virtualBeginCol={prop.virtualBeginCol}
          virtualBeginRow={prop.virtualBeginRow}
          virtualBoxStyle={prop.virtualBoxStyle}
          transformX={prop.transformX}
          transformY={prop.transformY}
          virtualRowSize={prop.virtualRowSize}
          virtualColSize={prop.virtualColSize}
          baseRowHeight={this.baseRowHeight}
        >
          {
            Object.keys(this.dataProp).map(key => {
              return (
                <template scopedSlots={
                  {
                    [key]: props => {
                      return (
                        <slot
                          rowIndex={props.rowIndex}
                          colIndex={props.colIndex}
                          row={props.row}
                          propKey={props.propKey}
                          dataProp={this.dataProp}
                          dataList={this.dataList}
                          name={props.propKey}
                        >
                        </slot>
                      )
                    }
                  }
                }>
                </template>
              )
            })
          }
        </TableBody>
      )
    }
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.getViewSize)
  },
  render () {
    return (
      <div ref="table" class="crab-table">
        {this.renderHead()}
        {this.renderStickyBody()}
        {this.renderDefaultBody()}
      </div>
    )
  }
}
</script>

<style lang='scss' scoped>
.crab-table{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  line-height: 2em;
  >div{
    display: flex;
  }
  .head{
    flex-shrink: 0;
  }
  .sticky-body{
    flex-shrink: 0;
  }
  .body{
    height: 0;
    flex-grow: 1;
  }
  .crab-table-fixed{
    flex-shrink: 0;
  }
  .crab-table-default{
    width: 0;
    flex-grow: 1;
  }
}
</style>
