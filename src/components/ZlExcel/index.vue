<script>
import TablePickCell from './TablePickCell'
import TableInputCell from './TableInputCell'
export default {
  name: 'Excel',
  components: { TablePickCell, TableInputCell },
  inheritAttrs: false,
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

      picking: false,

      inputStyle: {},
      inputDefaultVal: '',

      active: null
    }
  },
  computed: {
    mixRender () {
      return {
        TableBody: {
          data: {
            active: this.active,
            pasteData: this.pasteData
          },
          listener: {
            paste: this.paste,
            copy: this.copy,
            mousedown: this.mousedown,
            mouseup: this.mouseup,
            mousemove: this.mousemove,
            dblclick: this.dblclick,
            keydown: this.keydown
          },
          render: {
            getExcelMask: this.getExcelMask,
            getExcelInput: this.getExcelInput
          },
          scopedSlots: ({ rawRowIndex, rawColIndex, row, propKey }, that) => {
            return this.pasteData?.[rawRowIndex]?.[rawColIndex] || row[propKey]
          }
        }
      }
    }
  },
  watch: {
    pasteData () {
      if (this.active) {
        this.active.computeHeight('force')
      }
    }
  },
  methods: {
    pick (target) {
      if (!this.start) {
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
    mousedown (event, that) {
      this.active = that
      if (this.picking) {
        return
      }
      this.pickStyle = {}
      this.picking = true
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
      if (this.picking) {
        const cell = this.findCell(event.target)
        cell && this.pick(cell)
      }
    },
    mouseup (event) {
      const cell = this.findCell(event.target)
      if (!cell) {
        return
      }
      this.end = this.createTarget(cell)
      this.pick(this.end)
      this.picking = false
      this.$refs.copy && this.$refs.copy.select()
    },
    dblclick (e, that) {
      this.active = that
      this.inputStyle = this.pickStyle
      this.inputDefaultVal = ''
      setTimeout(() => {
        this.picking = false
      }, 0)

      const row = Number(this.start.getAttribute('rowindex'))
      const col = Number(this.start.getAttribute('colindex'))
      const rawrow = Number(this.start.getAttribute('rawrowindex'))
      const rawcol = Number(this.start.getAttribute('rawcolindex'))
      const prop = that.dataProp[Object.keys(that.dataProp)[col]].field
      this.inputDefaultVal = this.pasteData?.[rawrow]?.[rawcol] || that.dataList[row].rawData[prop]
    },
    findCell (node) {
      if (!node) {
        return null
      }
      if (node.hasAttribute && node.hasAttribute('rawrowindex') && node.hasAttribute('rawcolIndex')) {
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
      if (event.ctrlKey && (event.keyCode === 90)) {
        if (!this.pasteHistory.length) {
          return
        }
        this.pasteForwardHistory.push(this.pasteData)
        const pasteData = this.pasteHistory.pop()
        this.pasteData = pasteData
      }
      // y
      if (event.ctrlKey && (event.keyCode === 89)) {
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
            rowindex: target.getAttribute('rowindex'),
            colindex: target.getAttribute('colindex'),
            rawrowindex: target.getAttribute('rawrowindex'),
            rawcolindex: target.getAttribute('rawcolindex')
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
    getPickData (rowRange, colRange, rawRow, rawCol, that) {
      const propList = Object.keys(that.dataProp)
      let str = ''
      for (let i = rowRange[0]; i < rowRange[1] + 1; i++) {
        let rowStr = ''
        for (let j = colRange[0]; j < colRange[1] + 1; j++) {
          let val = that.dataList[i].rawData[propList[j]] || ''
          if (this.pasteData[i + rawRow] && this.pasteData[i + rawRow][j + rawCol] !== undefined) {
            val = this.pasteData[i + rawRow][j + rawCol]
          }
          rowStr += '\t' + val
        }
        rowStr = rowStr.substr(1)
        str += rowStr + '\n'
      }
      return str
    },
    paste (event) {
      event.preventDefault()
      const copyData = event.clipboardData.getData('text').split(/\n/g).map(row => row.split('\t'))
      if (!copyData[copyData.length]) {
        copyData.length--
      }
      const beginRow = Number(this.start.getAttribute('rawrowindex'))
      const beginCol = Number(this.start.getAttribute('rawcolindex'))
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
    copy (event, that) {
      event.preventDefault()
      const rowRange = [Number(this.start.getAttribute('rowindex')), Number(this.end.getAttribute('rowindex'))].sort((a, b) => a - b)
      const colRange = [Number(this.start.getAttribute('colindex')), Number(this.end.getAttribute('colindex'))].sort((a, b) => a - b)
      const rawrow = Number(this.start.getAttribute('rawrowindex')) - Number(this.start.getAttribute('rowindex'))
      const rawCol = Number(this.start.getAttribute('rawcolindex')) - Number(this.start.getAttribute('colindex'))
      event.clipboardData.setData('text', this.getPickData(rowRange, colRange, rawrow, rawCol, that))
    },
    getExcelMask (that) {
      if (this.active !== that) {
        return
      }
      return (
        <TablePickCell
          pick-style={this.pickStyle}
        />
      )
    },
    getExcelInput (that) {
      if (this.active !== that) {
        return
      }
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
  },
  render () {
    return (
      <ZlTable
        mixRender={this.mixRender}
        props={this.$attrs}
      />
    )
  }
}
</script>

<style lang='scss' scoped>

</style>
