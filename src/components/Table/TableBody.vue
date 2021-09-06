<template>
  <div
    class="table-body"
    :style="virtualBoxStyle"
    @paste="paste"
    @copy="copy"
    @mousedown="mousedown"
    @mouseup="mouseup"
    @mousemove="mousemove"
    @keydown="keydown"
  >
    <!-- 选中部分 -->
    <TablePickCell
      v-if="useExcelMode"
      :pick-style="focusBody===_uid?pickStyle:{}"
    />
    <input
      v-if="useExcelMode"
      ref="copy"
      readonly
      style="position: fixed;z-index: -1;top:-99999px;left:-99999px;"
    >

    <!-- 内容 -->
    <div
      v-for="row in renderDataList"
      :ref="`row-${row.rowIndex}`"
      :key="row.rowIndex"
      class="table-body-row"
      :style="
        virtualBeginRow === undefined || virtualBeginRow === -1
          ?{height:useRenderRowHeight[row.rowIndex]}
          :renderType ===1
            ?{height:useRenderRowHeight[row.rowIndex],transform:`translate(0,${transformY}px)`}
            :{transform:`translate(0,${row.transformY}px)`,position:'absolute',top:0}
      "
    >
      <TableCell
        v-for="(col,propKey) in renderDataProp"
        :key="propKey"
        :style="
          virtualBeginCol === undefined || virtualBeginCol === -1
            ?{width:col.width+'px',...col.style}
            :renderType ===1
              ?{width:col.width+'px',transform:`translate(${transformX}px,0)`,...col.style}
              :{width:col.width+'px',transform:`translate(${col.transformX}px,0)`,position:'absolute',top:0,height:baseRowHeight+'px',...col.style}
        "
        :row-index="row.rowIndex"
        :col-index="col.colIndex"
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
    baseRowHeight: Number,
    focusBody: Number,
    renderRowHeight: Array,
    excelMode: Boolean
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
      transformX: 0
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
    dataList () { this.render('force') },
    renderRowHeight () {
      if (this.focusBody !== this._uid) {
        this.computeHeight()
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.render()
    })
  },
  methods: {
    pick (target) {
      if (!this.useExcelMode) {
        return
      }
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
      this.start = this.createTarget(event.target)
    },
    mousemove (event) {
      if (this.picking) {
        this.pick(event.target)
      }
    },
    mouseup (event) {
      this.end = this.createTarget(event.target)
      this.pick(this.end)
      this.picking = false
      this.$refs.copy && this.$refs.copy.select()
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
        this.computeHeight('force')
      }
      // y
      if (this.useExcelMode && event.ctrlKey && (event.keyCode === 89)) {
        if (!this.pasteForwardHistory.length) {
          return
        }
        this.pasteHistory.push(this.pasteData)
        const pasteData = this.pasteForwardHistory.pop()
        this.pasteData = pasteData
        this.computeHeight('force')
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
      return str
    },
    render (force) {
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
        this.computeHeight(force)
        this.rendering = false
      })
    },
    computeHeight (force) {
      this.useRenderRowHeight = new Array(this.renderDataList.length).fill('auto')
      this.$nextTick(() => {
        // 渲染完成后计算高度
        const renderRowHeight = force ? [] : [...this.renderRowHeight]
        let change = false
        this.renderType === 1 && this.renderDataList.forEach(row => {
          const clientHeight = this.$refs['row-' + row.rowIndex][0].clientHeight
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
    pickClear () {
      this.pickStyle = {}
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

      this.computeHeight('force')
    },
    copy (event) {
      event.preventDefault()
      event.clipboardData.setData('text', this.getPickData())
    }
  },
  debounces: {
    renderByScroll (finish) {
      finish(20).then(() => {
        this.render()
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
}
</style>
