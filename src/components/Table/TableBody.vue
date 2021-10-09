
<script>
import TableCell from './TableCell'
import TablePickCell from './TablePickCell'
import TableInputCell from './TableInputCell'
export default {
  name: 'TableBody',
  components: { TableCell, TablePickCell, TableInputCell },
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
    focusBody: Number,
    renderRowHeight: Array,
    excelMode: Boolean,
    hoverRow: Number,
    selectRow: Number
  },
  data () {
    return {
      // pick
      pickStyle: {},
      start: null,
      end: null,

      // paste
      pasteHistory: [],
      pasteForwardHistory: [],
      pasteData: {},

      renderDataList: [],
      renderDataProp: {},
      rendering: false,

      picking: false,
      useRenderRowHeight: [],

      transformY: 0,
      transformX: 0,

      inputStyle: {},
      inputDefaultVal: ''
    }
  },
  computed: {
    useExcelMode () {
      return this.excelMode && !Object.keys(this.$scopedSlots).length
    }
  },
  watch: {
    virtualBeginRow () { this.renderByScroll() },
    virtualBeginCol () { this.renderByScroll() },
    dataList () { this.getRenderDataList('force') },
    renderRowHeight () {
      if (this.focusBody !== this._uid) {
        this.computeHeight()
      }
    },
    pasteData () {
      this.computeHeight('force')
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.getRenderDataList()
    })
  },
  methods: {
    pick (target) {
      if (!this.useExcelMode || !this.start) {
        return
      }
      this.inputStyle = {}
      const targetTransformY = parseInt(target.parentNode.style.transform.split(',')[1]) || ''
      const startTransformY = parseInt(this.start.parentNode.style.transform.split(',')[1]) || ''
      const targetTransformX = parseInt(target.style.transform.substr(10)) || ''
      const startTransformX = parseInt(this.start.style.transform.substr(10)) || ''
      const targetOffsetLeft = target.offsetLeft
      const startOffsetLeft = this.start.offsetLeft
      const targetOffsetTop = target.parentNode.offsetTop
      const startOffsetTop = this.start.parentNode.offsetTop
      const maxLeft = Math.max(targetOffsetLeft + target.clientWidth, startOffsetLeft + this.start.clientWidth)
      const maxTop = Math.max(targetOffsetTop + target.clientHeight, startOffsetTop + this.start.clientHeight)
      const minLeft = Math.min(targetOffsetLeft, startOffsetLeft)
      const minTop = Math.min(targetOffsetTop, startOffsetTop)
      const maxTransformY = Math.max(targetTransformY, startTransformY)
      const minTransformY = Math.min(targetTransformY, startTransformY)
      const maxTransformX = Math.max(targetTransformX, startTransformX)
      const minTransformX = Math.min(targetTransformX, startTransformX)
      this.pickStyle = {
        left: minLeft + minTransformX + 'px',
        top: minTop + minTransformY + 'px',
        width: maxLeft - minLeft + maxTransformX - minTransformX + 'px',
        height: maxTop - minTop + maxTransformY - minTransformY + 'px'
      }
    },
    mousedown (event) {
      if (this.picking) {
        return
      }
      this.pickStyle = {}
      this.picking = true
      this.$emit('update:focusBody', this._uid)
      // 生成对象，防止虚拟滚动删除节点
      const cell = this.findCell(event.target)
      if (!cell) {
        return
      }
      this.start = this.createTarget(cell)
      setTimeout(() => {
        this.pick(this.start)
      }, 0)
    },
    mousemove (event) {
      const rowIndex = parseInt(this.findRow(event.target).getAttribute('rowIndex'))
      if (this.hoverRow !== rowIndex) {
        this.$emit('update:hoverRow', rowIndex)
      }
      if (this.picking) {
        const cell = this.findCell(event.target)
        cell && this.pick(cell)
      }
    },
    mouseup (event) {
      if (this.useExcelMode) {
        const cell = this.findCell(event.target)
        if (!cell) {
          return
        }
        this.end = this.createTarget(cell)
        this.pick(this.end)
        this.picking = false
        this.$refs.copy && this.$refs.copy.select()
      } else {
        const rowIndex = parseInt(this.findRow(event.target).getAttribute('rowIndex'))
        if (this.selectRow !== rowIndex) {
          this.$emit('update:selectRow', rowIndex)
        }
      }
    },
    dblclick () {
      this.inputStyle = this.pickStyle
      this.inputDefaultVal = ''
      setTimeout(() => {
        this.picking = false
      }, 0)

      const row = Number(this.start.getAttribute('rowIndex'))
      const col = Number(this.start.getAttribute('colIndex'))
      const prop = this.dataProp[Object.keys(this.dataProp)[col]].field
      this.inputDefaultVal = this.pasteData?.[row]?.[col] || this.dataList[row].rawData[prop]
    },
    findCell (node) {
      if (!node) {
        return null
      }
      if (node.hasAttribute && node.hasAttribute('rowindex') && node.hasAttribute('colindex')) {
        return node
      } else {
        return this.findCell(node.parentNode)
      }
    },
    findRow (node) {
      if (!node) {
        return {
          getAttribute () {
            return -1
          }
        }
      }
      if (node.className && node.className.includes('table-body-row')) {
        return node
      } else {
        return this.findRow(node.parentNode)
      }
    },
    keydown (event) {
      // z
      if (this.useExcelMode && event.ctrlKey && (event.keyCode === 90)) {
        if (!this.pasteHistory.length) {
          return
        }
        this.pasteForwardHistory.push(this.pasteData)
        const pasteData = this.pasteHistory.pop()
        this.pasteData = pasteData
      }
      // y
      if (this.useExcelMode && event.ctrlKey && (event.keyCode === 89)) {
        if (!this.pasteForwardHistory.length) {
          return
        }
        this.pasteHistory.push(this.pasteData)
        const pasteData = this.pasteForwardHistory.pop()
        this.pasteData = pasteData
      }
    },
    createTarget (target) {
      return {
        ref: target,
        clientWidth: target.clientWidth,
        clientHeight: target.clientHeight,
        offsetLeft: target.offsetLeft,
        style: {
          transform: target.style.transform
        },
        parentNode: {
          offsetTop: target.parentNode.offsetTop,
          style: {
            transform: target.parentNode.style.transform
          }
        },
        getAttribute (key) {
          const map = {
            rowIndex: target.getAttribute('rowIndex'),
            colIndex: target.getAttribute('colIndex')
          }
          return map[key]
        },
        refresh () {
          const target = this.ref
          if (!target) {
            return
          }
          this.clientWidth = target.clientWidth
          this.clientHeight = target.clientHeight
          this.offsetLeft = target.offsetLeft
          this.style = {
            transform: target.style.transform
          }
          this.parentNode = {
            offsetTop: target.parentNode.offsetTop,
            style: {
              transform: target.parentNode.style.transform
            }
          }
        }
      }
    },
    getPickData (rowRange, colRange) {
      const propList = Object.keys(this.dataProp)
      let str = ''
      for (let i = rowRange[0]; i < rowRange[1] + 1; i++) {
        let rowStr = ''
        for (let j = colRange[0]; j < colRange[1] + 1; j++) {
          let val = this.dataList[i].rawData[propList[j]] || ''
          if (this.pasteData[i] && this.pasteData[i][j] !== undefined) {
            val = this.pasteData[i][j]
          }
          rowStr += '\t' + val
        }
        rowStr = rowStr.substr(1)
        str += rowStr + '\n'
      }
      return str
    },
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
    },
    paste (event) {
      event.preventDefault()
      const copyData = event.clipboardData.getData('text').split(/\n/g).map(row => row.split('\t'))
      if (!copyData[copyData.length]) {
        copyData.length--
      }
      const beginRow = Number(this.start.getAttribute('rowIndex'))
      const beginCol = Number(this.start.getAttribute('colIndex'))
      const pasteData = {}
      Object.keys(this.pasteData).forEach(key => {
        pasteData[key] = { ...this.pasteData[key] }
      })
      for (let i = 0; i < copyData.length; i++) {
        const row = i + beginRow
        if (pasteData[row] === undefined) {
          pasteData[row] = {}
        }
        for (let j = 0; j < copyData[i].length; j++) {
          const col = j + beginCol
          pasteData[row][col] = copyData[i][j]
        }
      }
      if (Object.keys(this.pasteData)) {
        this.pasteForwardHistory = []
        this.pasteHistory.push(this.pasteData)
      }
      this.pasteData = pasteData
    },
    copy (event) {
      event.preventDefault()
      const rowRange = [Number(this.start.getAttribute('rowIndex')), Number(this.end.getAttribute('rowIndex'))].sort((a, b) => a - b)
      const colRange = [Number(this.start.getAttribute('colIndex')), Number(this.end.getAttribute('colIndex'))].sort((a, b) => a - b)
      event.clipboardData.setData('text', this.getPickData(rowRange, colRange))
    }
  },
  render () {
    function getExcelMask () {
      if (this.useExcelMode) {
        return (
          <TablePickCell
            pick-style={this.focusBody === this._uid ? this.pickStyle : {}}
          />
        )
      }
    }
    function getExcelInput () {
      if (this.useExcelMode) {
        return (
          <TableInputCell
            ref="copy"
            pasteHistory={this.pasteHistory}
            pasteForwardHistory={this.pasteForwardHistory}
            pasteData={this.pasteData}
            inputStyle={this.inputStyle}
            inputDefaultVal={this.inputDefaultVal}
            node={this.start}
            {...{
              on: {
                'update:pasteHistory': (pasteHistory) => { this.pasteHistory = pasteHistory },
                'update:pasteForwardHistory': (pasteForwardHistory) => { this.pasteForwardHistory = pasteForwardHistory },
                'update:pasteData': (pasteData) => { this.pasteData = pasteData }
              }
            }}
          />
        )
      }
    }
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
        return this.pasteData[row.rowIndex] && this.pasteData[row.rowIndex][col.colIndex] !== undefined
          ? this.pasteData[row.rowIndex][col.colIndex] : row.rawData[propKey]
      }
    }
    function renderRow (row) {
      const classList = ['table-body-row']
      if (this.hoverRow === row.rowIndex) {
        classList.push('row-hover')
      }
      if (this.selectRow === row.rowIndex) {
        classList.push('row-select')
      }
      if (this.$scopedSlots['row:' + row.rowIndex]) {
        return (
          <div
            ref={`row-${row.rowIndex}`}
            key={row.rowIndex}
            rowIndex={row.rowIndex}
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
    return (
      <div
        class="table-body"
        style={this.virtualBoxStyle}
        {...{
          on: {
            paste: this.paste,
            copy: this.copy,
            mousedown: this.mousedown,
            mouseup: this.mouseup,
            mousemove: this.mousemove,
            dblclick: this.dblclick,
            keydown: this.keydown
          }
        }}
      >
        {getExcelMask.call(this)}
        {getExcelInput.call(this)}
        {
          this.renderDataList.map(row => {
            return renderRow.call(this, row)
          })
        }
      </div>
    )
  },
  debounces: {
    renderByScroll (finish) {
      finish(20).then(() => {
        this.getRenderDataList()
      })
    }
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
