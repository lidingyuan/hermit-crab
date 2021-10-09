<script>
export default {
  name: 'ZlCheckIcon',
  functional: true,
  render (h, context) {
    return (
      <i
        class={`${context.props.type} ${context.props.check ? 'check' : ''} zl-check-icon` }
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
  width: 0.8em;
  height: 0.8em;
  margin-right: 0.5em;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s;
  border: 1px solid #ccc;
  &::after{
    transition: all 0.3s;
    border: 1em solid transparent;
    width: 1em;
    height: 1em;
    position: absolute;
    content: '';
    transform: rotateY(90deg) scale(0.1);
  }
}
.check{
  position: relative;
  background: #3385FF;
  border: 1px solid #3385FF;
  &::after{
    border: 1em solid #fff;
    border-left: 1em solid transparent;
    border-top: 1em solid transparent;
    width: 2em;
    height: 5em;
    margin-top: -0.2em;
    transform: rotate(45deg) scale(0.1);
  }
}
.half{
  position: relative;
  background: #3385FF;
  border: 1px solid #3385FF;
  &::after{
    border-right: 1em solid #fff;
    border-top: 0em solid transparent;
    border-bottom: 0em solid transparent;
    height: 6em;
    width: 0;
    margin-top: -0.1em;
    transform: rotate(90deg) scale(0.1);
  }
}
.circle{
  border-radius: 1em;
}
.square{
  border-radius: 0;
}
</style>
