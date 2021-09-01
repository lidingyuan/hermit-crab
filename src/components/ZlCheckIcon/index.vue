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
        class={classMap[context.props.type][context.props.check] + ' zl-check-box'}
        aria-hidden="true"
      />
    )
  }
}
</script>

<style lang='scss' scoped>
.zl-check-box{
  margin-right: 8px;
}
</style>
