<template>
  <div class="crab-table">
    <!-- 表头 -->
    <div class="head">
      <div class="crab-table-fixed">
        <TableHead :headData="fixedHeadData"></TableHead>
      </div>
      <ScrollBox class="default-head" type="flex" :scrollLeft="scrollLeft" @scrollChange="(scrollTop,scrollLeft)=>{scrollChange(undefined,scrollLeft)}">
        <TableHead :headData="defaultHeadData"></TableHead>
      </ScrollBox>
    </div>
    <!-- 固定行表格 -->
    <div class="sticky-body" ref="sticky">
      <div class="crab-table-fixed" :style="{width:fixedWidth+'px'}">
        <TableBody
          :dataList="stickyDataList"
          :dataProp="fixedDataProp"
          :renderType="renderType"
          :baseRowHeight="baseRowHeight"
        >
          <template v-for="(propValue,propKey) in dataProp" #[propKey]="scope">
            <slot
              :rowIndex="scope.rowIndex"
              :colIndex="scope.colIndex"
              :row="scope.row"
              :propKey="scope.propKey"
              :dataProp="dataProp"
              :dataList="dataList"
              :name="scope.propKey"
            >
            </slot>
          </template>
        </TableBody>
      </div>
      <ScrollBox class="default-sticky-body" type="flex" :scrollLeft="scrollLeft" @scrollChange="(scrollTop,scrollLeft)=>{scrollChange(undefined,scrollLeft)}">
        <TableBody
          :dataList="stickyDataList"
          :dataProp="dataProp"
          :virtualBoxStyle="{width:virtualBoxStyle.width}"
          :renderType="renderType"
          :baseRowHeight="baseRowHeight"
        >
          <template v-for="(propValue,propKey) in dataProp" #[propKey]="scope">
            <slot
              :rowIndex="scope.rowIndex"
              :colIndex="scope.colIndex"
              :row="scope.row"
              :propKey="scope.propKey"
              :dataProp="dataProp"
              :dataList="dataList"
              :name="scope.propKey"
            >
            </slot>
          </template>
        </TableBody>
      </ScrollBox>
    </div>
    <!-- 表格 -->
    <div class="body" ref="main">
      <ScrollBox class="crab-table-fixed" type="flex" :scrollTop="scrollTop" @scrollChange="(scrollTop)=>{scrollChange(scrollTop)}" :style="{width:fixedWidth+'px'}">
        <TableBody
          :dataList="defaultDataList"
          :dataProp="fixedDataProp"
          :virtualBeginRow="virtualBeginRow"
          :virtualBoxStyle="{height:virtualBoxStyle.height}"
          :transformY="virtualBeginRow !== -1 ? scrollTop : 0"
          :virtualRowSize="virtualRowSize"
          :virtualColSize="virtualColSize"
          :renderType="renderType"
          :baseRowHeight="baseRowHeight"
        >
          <template v-for="(propValue,propKey) in dataProp" #[propKey]="scope">
            <slot
              :rowIndex="scope.rowIndex+stickyRows"
              :colIndex="scope.colIndex"
              :row="scope.row"
              :propKey="scope.propKey"
              :dataProp="dataProp"
              :dataList="dataList"
              :name="scope.propKey"
            >
            </slot>
          </template>
        </TableBody>
      </ScrollBox>
      <ScrollBox class="default-body" type="flex" :scrollTop="scrollTop" :scrollLeft="scrollLeft" @scrollChange="scrollChange">
        <TableBody
          :dataList="defaultDataList"
          :dataProp="dataProp"
          :virtualBeginCol="virtualBeginCol"
          :virtualBeginRow="virtualBeginRow"
          :virtualBoxStyle="virtualBoxStyle"
          :transformX="virtualBeginCol !== -1 ? scrollLeft : 0"
          :transformY="virtualBeginRow !== -1 ? scrollTop : 0"
          :virtualRowSize="virtualRowSize"
          :virtualColSize="virtualColSize"
          :renderType="renderType"
          :baseRowHeight="baseRowHeight"
        >
          <template v-for="(propValue,propKey) in dataProp" #[propKey]="scope">
            <slot
              :rowIndex="scope.rowIndex+stickyRows"
              :colIndex="scope.colIndex"
              :row="scope.row"
              :propKey="scope.propKey"
              :dataProp="dataProp"
              :dataList="dataList"
              :name="scope.propKey"
            >
            </slot>
          </template>
        </TableBody>
      </ScrollBox>
    </div>
  </div>
</template>

<script>
import TableHead from './TableHead'
import TableBody from './TableBody'
import ScrollBox from '../ScrollBox'
export default {
  name: 'ZlTable',
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
      return parseInt(this.viewHeight / this.baseRowHeight) + 1
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
      return colIndex - this.virtualBeginCol
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
    this.viewHeight = this.$refs.main.clientHeight + this.$refs.sticky.clientHeight
    this.viewWidth = this.$refs.main.clientWidth
    this.baseRowHeight = parseInt(window.getComputedStyle(this.$refs.main).lineHeight)
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
            this.fixedDataProp[column.field] = { field: column.field, width: width, transformX: this.fixedWidth, colIndex: parentIndex + index }
            this.fixedWidth += width
          } else {
            this.dataProp[column.field] = { field: column.field, width: width, transformX: this.defaultWidth, colIndex: parentIndex + index }
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
    }
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
}
</style>
