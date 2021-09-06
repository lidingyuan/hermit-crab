<script>
export default {
  name: 'ZlCheckIcon',
  functional: true,
  render (h, context) {
    const classMap = {
      circle: {
        true: 'fa fa-check-circle',
        false: 'fa fa-circle-o'
      },
      square: {
        true: 'fa fa-check-square',
        false: 'fa fa-square-o'
      }
    }
    return (
      <i
        class={classMap[context.props.type][context.props.check] + ' zl-check-icon'}
        aria-hidden="true"
        {...{
          on: {
            ...context.listeners
          }
        }}
      />
    )
  }
}
</script>

<style lang='scss' scoped>
.zl-check-icon{
  width: 16px;
  height: 16px;
  margin-right: 8px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
}
</style>
