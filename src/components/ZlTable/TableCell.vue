<template functional>
  <div
    class="table-cell"
    :style="{...data.style,...data.staticStyle}"
    :rowIndex="props.rowIndex"
    :colIndex="props.colIndex"
    :rawRowIndex="props.rawRowIndex"
    :rawColIndex="props.rawColIndex"
    @click="listeners && listeners.click?listeners.click():''"
  >
    <slot />
  </div>
</template>

<style lang='scss' scoped>
.table-cell{
  flex-shrink: 0;
  box-sizing: border-box;
  padding: 0 0.5em;
  display: flex;
  justify-content: center;
  align-items: center;
  background:linear-gradient(#ccc,#ccc) no-repeat,linear-gradient(#ccc,#ccc) no-repeat;
  background-size:100% 1px,1px 100%;
  background-position:0 100%,100% 0;
  user-select: none;
}
</style>
