
<script>
import TableHead from './TableHead'
import TableBody from './TableBody'
import ScrollBox from '../ScrollBox'
import * as renderFun from './render'
export default {
  name: 'CrabTable',
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
    },
    excelMode: {
      type: Boolean,
      default: true
    },
    orders: {
      type: Array,
      default: () => ['asc', 'desc', null]
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
      viewWidth: 0,

      focusBody: 0,
      renderRowHeight: {
        sticky: [],
        default: []
      },

      sortTag: {
        key: '',
        type: -1
      },
      sortMap: {
        asc: (num) => {
          return num
        },
        desc: (num) => {
          return num * -1
        }
      }
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
      const dataList = this.dataList.slice(this.stickyRows)
      if (!this.sortTag.key || this.orders[this.sortTag.type] === null) {
        // return dataList
      } else {
        const type = this.orders[this.sortTag.type]
        dataList.sort((a, b) => {
          if (a[this.sortTag.key] > b[this.sortTag.key]) {
            return this.sortMap[type](1)
          }
          if (a[this.sortTag.key] < b[this.sortTag.key]) {
            return this.sortMap[type](-1)
          }
          return 0
        })
      }
      return dataList.map((item, index) => {
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
      if (this.virtualRowSize + rowIndex >= this.defaultDataList.length) {
        return this.defaultDataList.length - this.virtualRowSize
      }
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
      if (this.virtualColSize + colIndex >= propList.length) {
        return propList.length - this.virtualColSize
      }
      return colIndex
    },
    virtualColSize () {
      const propList = Object.values(this.dataProp)
      if (this.virtualCol > propList.length) {
        return -1
      }
      let colIndex = propList.length
      let beginIndex = -1
      propList.find((prop, index) => {
        if ((prop.transformX + prop.width > this.scrollLeft) && beginIndex === -1) {
          beginIndex = index - 1
          return false
        }
        if (prop.transformX + prop.width > this.scrollLeft + this.viewWidth) {
          colIndex = index
          return true
        }
        return false
      })
      return (colIndex - beginIndex) + 1
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
  beforeDestroy () {
    window.removeEventListener('resize', this.getViewSize)
  },
  methods: {
    buildHead (columnList, level = 1) {
      const columnData = []
      let transformX = 0
      columnList.forEach(column => {
        let children = []
        let width = column.width || 200
        let fixed = column.fixed || false
        let maxLevel = level
        let index = 0
        if (column.children && column.children.length) {
          children = this.buildHead(column.children, level + 1)
          width = 0
          fixed = false
          children.forEach(item => {
            width += item.width
            fixed = fixed || item.fixed
            maxLevel = Math.max(item.level, level)
          })
        } else {
          if (fixed) {
            index = Object.keys(this.fixedDataProp).length
            this.fixedDataProp[column.field] = { field: column.field, width: width, transformX: this.fixedWidth, colIndex: index, style: column.style }
            this.fixedWidth += width
          } else {
            index = Object.keys(this.dataProp).length
            this.dataProp[column.field] = { field: column.field, width: width, transformX: this.defaultWidth, colIndex: index, style: column.style }
            this.defaultWidth += width
          }
        }
        const data = {
          name: column.name,
          field: column.field,
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
    // 排序
    sortData (head) {
      if (this.sortTag.key === head.field) {
        this.sortTag.type = (this.sortTag.type + 1) % this.orders.length
      } else {
        this.sortTag.key = head.field
        this.sortTag.type = 0
      }
    },
    scrollChange (scrollTop, scrollLeft) {
      if (scrollTop !== undefined) {
        this.scrollTop = scrollTop
      }
      if (scrollLeft !== undefined) {
        this.scrollLeft = scrollLeft
      }
    }
  },
  render (h) {
    return (
      <div ref="table" class="crab-table">
        {renderFun.renderHead.call(this, h)}
        {renderFun.renderStickyBody.call(this, h)}
        {renderFun.renderDefaultBody.call(this, h)}
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
