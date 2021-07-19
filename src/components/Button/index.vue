<template functional>
  <div class="button" :class="{plain:props.plain}" v-active @click="listeners.click">
    <slot></slot>
  </div>
</template>

<style lang='scss' scoped>
@import '~@/assets/style/default.scss';
.button{
  user-select: none;
  min-width: 80px;
  min-height: 32px;
  border-radius: 4px;
  margin: 8px 16px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  background: $base-color;
  color: $base-font-color;
  border: $base-color 1px solid;
  cursor: pointer;
  transition: all 0.3s;
  &:hover{
    background: $base-light-color;
    color: $base-light-font-color;
  }
}
.button.plain{
  border: $base-light-font-color 1px solid;
  background: $base-light-color;
  color: $base-light-font-color;
  &:hover{
    background: $base-color;
    color: $base-font-color;
  }
}

.button.active{
  background: $base-dark-color;
  color: $base-dark-font-color;
}
.button.plain.active{
  background: $base-dark-color;
  color: $base-dark-font-color;
}
</style>
