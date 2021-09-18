<template>
  <input
    ref="input"
    v-model="inputVal"
    class="table-input-cell"
    :style="style"
    @mousedown.stop="mousedown"
  >
</template>

<script>
export default {
  name: 'TableInputCell',
  props: {
    inputStyle: Object,
    inputDefaultVal: [String, Number],
    pasteHistory: Array,
    pasteForwardHistory: Array,
    pasteData: Object,
    node: Object
  },
  data () {
    return {
      inputVal: '',
      row: 0,
      col: 0
    }
  },
  computed: {
    style () {
      return {
        'z-index': 2,
        ...this.inputStyle
      }
    }
  },
  watch: {
    inputStyle (newVal, oldVal) {
      if (!Object.keys(newVal).length && Object.keys(oldVal).length) {
        if (Object.keys(this.pasteData)) {
          this.$emit('update:pasteForwardHistory', [])
          this.$emit('update:pasteHistory', this.pasteHistory.concat(this.pasteData))
        }
        const pasteData = {}
        Object.keys(this.pasteData).forEach(key => {
          pasteData[key] = { ...this.pasteData[key] }
        })
        if (!pasteData[this.row]) {
          pasteData[this.row] = {}
        }
        pasteData[this.row][this.col] = this.inputVal
        this.$emit('update:pasteData', pasteData)
      }

      if (Object.keys(newVal).length && !Object.keys(oldVal).length) {
        this.row = Number(this.node.getAttribute('rowIndex'))
        this.col = Number(this.node.getAttribute('colIndex'))
        this.inputVal = this.inputDefaultVal
      }
    }
  },
  created () {

  },
  methods: {
    select () {
      this.$refs.input.select()
    },
    mousedown () {
    }
  }
}
</script>

<style lang='scss' scoped>
.table-input-cell{
  position: absolute;
  z-index: -1;
  background: #fff;
  top:-99999px;
  left:-99999px;
  outline:none;
  border:none;
}
</style>
