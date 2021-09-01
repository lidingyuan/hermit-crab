<script>
import ZlInput from '@/components/ZlInput'
import ZlRadio from '@/components/ZlRadio'
import ZlCheckBox from '@/components/ZlCheckBox'
const compMap = {
  input: ZlInput, radio: ZlRadio, checkBox: ZlCheckBox
}
export default {
  name: 'ZlQueryParam',
  functional: true,
  render (h, context) {
    return (
      <div class="zl-query-param">
        <div class="label">
          {context.props.label}：
        </div>
        {
          h(compMap[context.props.type], context.data)
        }
      </div>
    )
  }
}
</script>

<style lang='scss' scoped>
.zl-query-param{
  display: inline-flex;
  align-items: center;
  color: #666666;
  height: 28px;
  padding: 16px;
  .label{
    line-height: 28px;
    cursor: default;
  }
}
</style>
