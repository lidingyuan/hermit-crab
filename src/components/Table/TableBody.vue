<template>
  <div class="table-body" :style="virtualBoxStyle" @mousedown="mousedown" @mouseup="mouseup" @mousemove="mousemove" @keydown="keydown">

    <!-- 选中部分 -->
    <TablePickCell :pickStyle="pickStyle"></TablePickCell>
    <textarea
      ref="copy"
      style="position: fixed;z-index: -1;padding: 0;border: none;top:-99999px;left:-99999px;"
    />

    <!-- 内容 -->
    <div
      class="table-body-row"
      :ref="`row-${row.rowIndex}`"
      :style="
        virtualBeginRow === undefined || virtualBeginRow === -1
        ?{}
        :renderType ===1
          ?{transform:`translate(0,${renderDataList[0].transformY}px)`}
          :{transform:`translate(0,${row.transformY}px)`,position:'absolute',top:0}
      "
      v-for="row in renderDataList"
      :key="row.rowIndex"
    >
      <TableCell
        v-for="(col,propKey) in renderDataProp"
        :key="propKey"
        :style="
          virtualBeginCol === undefined || virtualBeginCol === -1
          ?{width:col.width+'px',...col.style}
          :renderType ===1
            ?{width:col.width+'px',transform:`translate(${Object.values(renderDataProp)[0].transformX}px,0)`,...col.style}
            :{width:col.width+'px',transform:`translate(${col.transformX}px,0)`,position:'absolute',top:0,height:baseRowHeight+'px',...col.style}
        "
        :rowIndex="row.rowIndex"
        :colIndex="col.colIndex"
      >
        <slot
          :rowIndex="row.rowIndex"
          :colIndex="col.colIndex"
          :row="row.rawData"
          :propKey="propKey"
          :name="propKey"
        >
          {{
            pasteData[row.rowIndex] && pasteData[row.rowIndex][col.colIndex] !== undefined ?
            pasteData[row.rowIndex][col.colIndex] : row.rawData[propKey]
          }}
        </slot>
      </TableCell>
    </div>
  </div>
</template>

<script>
import TableCell from './TableCell'
import TablePickCell from './TablePickCell'
export default {
  name: 'TableBody',
  components: { TableCell, TablePickCell },
  props: {
    dataList: Array,
    dataProp: Object,
    virtualBeginCol: Number,
    virtualBeginRow: Number,
    virtualBoxStyle: Object,
    virtualRowSize: Number,
    virtualColSize: Number,
    renderType: Number,
    baseRowHeight: Number
  },
  data () {
    return {
      // pick
      pickStyle: {},
      picking: false,
      start: null,
      end: null,

      // paste
      copyStr: '',
      pasteHistory: [],
      pasteForwardHistory: [],
      pasteData: {},

      renderDataList: [],
      renderDataProp: {},
      rendering: false
    }
  },
  watch: {
    virtualBeginRow () { this.render() },
    virtualBeginCol () { this.render() }
  },
  mounted () {
    this.$nextTick(() => {
      this.render()
    })
  },
  methods: {
    pick (target) {
      if (this.picking) {
        const targetTransformY = parseInt(target.parentNode.style.transform.split(',')[1])
        const startTransformY = parseInt(this.start.parentNode.style.transform.split(',')[1])
        const targetTransformX = parseInt(target.style.transform.substr(10))
        const startTransformX = parseInt(this.start.style.transform.substr(10))
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
      }
    },
    mousedown (event) {
      if (this.picking) {
        return
      }
      this.picking = true
      this.start = event.target
    },
    mousemove (event) {
      this.pick(event.target)
    },
    mouseup (event) {
      this.end = event.target
      this.pick(this.end)
      this.picking = false
      // this.$refs.copy.focus()
      this.$refs.copy.select()
    },
    keydown (event) {
      // v
      if (event.ctrlKey && (event.keyCode === 86)) {
        setTimeout(() => {
          const value = this.$refs.copy.value
          const copyData = value.split(/\n/g).map(row => row.split('\t'))
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
            this.pasteHistory.push(this.pasteData)
          }
          this.pasteData = pasteData
        }, 0)
        return
      }
      // x c
      if (event.ctrlKey && (event.keyCode === 88 || event.keyCode === 67)) {
        this.getPickData()
        this.$refs.copy.value = this.copyStr
        // this.$refs.copy.focus()
        this.$refs.copy.select()
        document.execCommand('Copy')
      }
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
      this.$refs.copy.value = ''
    },
    getPickData () {
      const propList = Object.keys(this.dataProp)
      const rowRange = [Number(this.start.getAttribute('rowIndex')), Number(this.end.getAttribute('rowIndex'))].sort((a, b) => a - b)
      const colRange = [Number(this.start.getAttribute('colIndex')), Number(this.end.getAttribute('colIndex'))].sort((a, b) => a - b)
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
      this.copyStr = str
    },
    render () {
      if (this.rendering) {
        return
      }
      this.rendering = true
      if (this.virtualBeginRow === undefined || this.virtualBeginRow === -1) {
        this.renderDataList = this.dataList
      } else {
        this.renderDataList = this.dataList.slice(this.virtualBeginRow, this.virtualBeginRow + this.virtualRowSize)
      }
      if (this.virtualBeginCol === undefined || this.virtualBeginCol === -1) {
        this.renderDataProp = this.dataProp
      } else {
        const renderDataProp = {}
        Object.keys(this.dataProp).slice(this.virtualBeginCol, this.virtualBeginCol + this.virtualColSize).forEach(key => {
          renderDataProp[key] = this.dataProp[key]
        })
        this.renderDataProp = renderDataProp
      }
      this.$nextTick(() => {
        this.rendering = false

        // 计算高度
        this.renderType === 1 && this.renderDataList.forEach(row => {
          const clientHeight = this.$refs['row-' + row.rowIndex][0].clientHeight
          row.maxHeight = Math.max(row.maxHeight, clientHeight)
          if (row.maxHeight > clientHeight || this.$refs['row-' + row.rowIndex][0].style.height === '') {
            this.$refs['row-' + row.rowIndex][0].style.height = row.maxHeight + 'px'
          }
        })
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.table-body-row{
  display: flex;
}
.table-body{
  position: relative;
  // overflow: hidden;
}
</style>
