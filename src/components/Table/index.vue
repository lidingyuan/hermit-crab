
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
    columns: {
      type: Array,
      default: () => []
    },
    data: {
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
    // renderType 1 不定高 2 定高 优化TODO
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
    },
    border: {
      type: Object,
      default: () => {
        return {
          row: 'transparent',
          col: 'transparent'
        }
      }
    }
  },
  data () {
    return {
      observer: null,
      scrollTop: 0,
      scrollLeft: 0,

      // tableData
      fixedHeadData: [],
      fixedRowsData: [],
      fixedBodyData: [],
      defaultHeadData: [],
      defaultRowsData: [],
      defaultBodyData: [],

      // TODO 系列化
      headSeries: [
        // 固定列
        {
          width: 0,
          type: 'static',
          dataProp: {},
          headData: []
        },
        // 滚动列
        {
          width: 0,
          type: 'scroll',
          dataProp: {},
          headData: []
        }
      ],
      bodySeries: [
        // 固定行
        {
          type: 'static',
          bodyData: []
        },
        // 滚动行
        {
          type: 'scroll',
          bodyData: []
        }
      ],

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
      },
      hoverRow: -1,
      selectRow: -1
    }
  },
  computed: {
    stickyDataList () {
      return this.data
        .slice(0, this.stickyRows)
        .map((item, index) => {
          return {
            rowIndex: index,
            rawData: item
          }
        })
    },
    defaultDataList () {
      const data = [...this.data]
      if (this.sortTag.key && this.orders[this.sortTag.type] !== null) {
        const type = this.orders[this.sortTag.type]
        data.sort((a, b) => {
          if (a[this.sortTag.key] > b[this.sortTag.key]) {
            return this.sortMap[type](1)
          }
          if (a[this.sortTag.key] < b[this.sortTag.key]) {
            return this.sortMap[type](-1)
          }
          return 0
        })
      }
      const list = data
        .slice(this.stickyRows)
        .map((item, index) => {
          return {
            rowIndex: index,
            rawRowIndex: index + this.stickyRows,
            rawData: item,
            transformY: index * this.baseRowHeight
          }
        })
      return list
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
        'min-height': this.baseRowHeight * this.defaultDataList.length + 'px',
        'min-width': this.defaultWidth + 'px'
      }
    },
    scopedSlots () {
      const scopedSlots = {}
      Object.keys(this.$scopedSlots).forEach(key => {
        const arr = key.split(':head')
        if (arr.length !== 2 || arr[1] !== '') {
          scopedSlots[arr[0]] = props => this.$scopedSlots[key](props)
        }
      })
      return scopedSlots
    },
    headScopedSlots () {
      const scopedSlots = {}
      Object.keys(this.$scopedSlots).forEach(key => {
        const arr = key.split(':head')
        if (arr.length === 2 && arr[1] === '') {
          scopedSlots[arr[0]] = props => this.$scopedSlots[key](props)
        }
      })
      return scopedSlots
    }
  },
  watch: {
    columns: {
      handler (val) {
        if (val) {
          this.fixedHeadData = []
          this.defaultHeadData = []

          this.fixedWidth = 0
          this.defaultWidth = 0

          this.dataProp = {}
          this.fixedDataProp = {}
          this.buildHead(val).forEach(head => {
            if (head.fixed === 'left') {
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
    // 创建一个观察器实例并传入回调函数
    this.observer = new MutationObserver(this.getViewSize)
    const config = {
      attributes: true
    }
    this.observer.observe(this.$el, config)
  },
  beforeDestroy () {
    this.observer.disconnect()
    window.removeEventListener('resize', this.getViewSize)
  },
  methods: {
    buildHead (columns, level = 1, length = { fixedDataPropLength: 0, dataPropLength: 0 }) {
      const columnData = []
      columns.forEach(column => {
        let transformX = Infinity
        let beginIndex = Infinity
        let endIndex = 0
        let children = []
        let width = parseInt(column.width) || 200
        let fixed = column.fixed || 'default'
        let index = 0
        if (column.children && column.children.length) {
          children = this.buildHead(column.children, level + 1, length)
          width = 0
          fixed = ''
          children.forEach(item => {
            width += item.width
            fixed = fixed || item.fixed
            transformX = Math.min(transformX, item.transformX)
            beginIndex = Math.min(beginIndex, item.beginIndex)
            endIndex = Math.max(endIndex, item.endIndex)
          })
        } else {
          if (fixed === 'left') {
            index = length.fixedDataPropLength
            beginIndex = index
            transformX = this.fixedWidth
            this.fixedDataProp[column.field] = {
              field: column.field,
              formatter: column.formatter,
              width: width,
              transformX: this.fixedWidth,
              colIndex: index,
              align: column.align
            }
            length.fixedDataPropLength++
            endIndex = length.fixedDataPropLength
            this.fixedWidth += width
          } else {
            index = length.dataPropLength
            beginIndex = index
            transformX = this.defaultWidth
            this.dataProp[column.field] = {
              field: column.field,
              formatter: column.formatter,
              width: width,
              transformX: this.defaultWidth,
              colIndex: index,
              align: column.align
            }
            length.dataPropLength++
            endIndex = length.dataPropLength
            this.defaultWidth += width
          }
        }
        const data = {
          name: column.name || column.title,
          field: column.field,
          index: index,
          fixed,
          width,
          level: level,
          beginIndex: beginIndex,
          endIndex: endIndex,
          transformX: transformX,
          rawData: column,
          align: column.headAlign,
          children
        }
        columnData.push(data)
      })
      return columnData
    },
    getViewSize () {
      this.viewHeight = this.$refs.table.clientHeight || this.viewHeight
      this.viewWidth = this.$refs.table.clientWidth || this.viewWidth
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
    },
    borderStyle (border) {
      let row = border.row || 'transparent'
      let col = border.col || 'transparent'
      row = [row].flat()
      col = [col].flat()
      if (row.length === 1) {
        row = row.concat(row)
      }
      if (col.length === 1) {
        col = col.concat(col)
      }
      row = row.reduce((a, b) => a + ',' + b, '').substr(1)
      col = col.reduce((a, b) => a + ',' + b, '').substr(1)
      return {
        padding: '1px',
        background: `linear-gradient(${row}) no-repeat,linear-gradient(${col}) no-repeat,linear-gradient(${row}) no-repeat,linear-gradient(${col}) no-repeat`,
        'background-size': '100% 1px,1px 100%,100% 1px,1px 100%',
        'background-position': '0 0,0 0,0 100%,100% 0'
      }
    }
  },
  render (h) {
    const style = this.borderStyle(this.border)
    return (
      <div
        ref="table"
        class="crab-table"
        style={style}
      >
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
