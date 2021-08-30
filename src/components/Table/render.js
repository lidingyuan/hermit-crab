export function renderHead (h) {
  return (
    <div class="head">
      <div class="crab-table-fixed">
        <TableHead
          headData={this.fixedHeadData}
          {...{
            on: {
              sortData: this.sortData
            }
          }}
        ></TableHead>
      </div>
      {renderScrollBox.call(this, h, false, true, 'default-head', '', <TableHead
        headData={this.defaultHeadData}
        {...{
          on: {
            sortData: this.sortData
          }
        }}
      ></TableHead>)}
    </div>
  )
}
export function renderStickyBody (h) {
  return (
    <div class="sticky-body">
      <div class="crab-table-fixed" style={{ width: this.fixedWidth + 'px' }}>
        {renderBody.call(this, h, {
          dataList: this.stickyDataList,
          dataProp: this.fixedDataProp,
          renderRowHeight: this.renderRowHeight.sticky,
          renderRowKey: 'sticky',
          virtualBoxStyle: {}
        })}
      </div>
      {renderScrollBox.call(this, h, false, true, 'crab-table-default', '', renderBody.call(this, h, {
        dataList: this.stickyDataList,
        dataProp: this.dataProp,
        renderRowHeight: this.renderRowHeight.sticky,
        renderRowKey: 'sticky',
        virtualBoxStyle: { width: this.virtualBoxStyle.width }
      }))}
    </div>
  )
}
export function renderDefaultBody (h) {
  return (
    <div class="body" ref="main">
      {renderScrollBox.call(this, h, true, false, 'crab-table-fixed', { width: this.fixedWidth + 'px' }, renderBody.call(this, h, {
        dataList: this.defaultDataList,
        dataProp: this.fixedDataProp,
        virtualBeginRow: this.virtualBeginRow,
        virtualBoxStyle: { height: this.virtualBoxStyle.height },
        transformY: this.virtualBeginRow !== -1 ? this.scrollTop : 0,
        virtualRowSize: this.virtualRowSize,
        virtualColSize: this.virtualColSize,
        renderRowHeight: this.renderRowHeight.default,
        renderRowKey: 'default'
      }))}
      {renderScrollBox.call(this, h, true, true, 'crab-table-default', '', renderBody.call(this, h, {
        dataList: this.defaultDataList,
        dataProp: this.dataProp,
        virtualBeginCol: this.virtualBeginCol,
        virtualBeginRow: this.virtualBeginRow,
        virtualBoxStyle: this.virtualBoxStyle,
        transformX: this.virtualBeginCol !== -1 ? this.scrollLeft : 0,
        transformY: this.virtualBeginRow !== -1 ? this.scrollTop : 0,
        virtualRowSize: this.virtualRowSize,
        virtualColSize: this.virtualColSize,
        renderRowHeight: this.renderRowHeight.default,
        renderRowKey: 'default'
      }))}
    </div>
  )
}
export function renderScrollBox (h, top, left, clazz, style, slot) {
  return (
    <ScrollBox
      class={clazz}
      type="flex"
      style={style}
      scrollLeft={left ? this.scrollLeft : 0}
      scrollTop={top ? this.scrollTop : 0}
      {...{
        on: {
          scrollChange: (scrollTop, scrollLeft) => { this.scrollChange(top ? scrollTop : undefined, left ? scrollLeft : undefined) }
        }
      }}
    >
      {slot}
    </ScrollBox>
  )
}
export function renderBody (h, prop) {
  return (
    <TableBody
      dataList={prop.dataList}
      dataProp={prop.dataProp}
      renderType={this.renderType}
      virtualBeginCol={prop.virtualBeginCol}
      virtualBeginRow={prop.virtualBeginRow}
      virtualBoxStyle={prop.virtualBoxStyle}
      virtualRowSize={prop.virtualRowSize}
      virtualColSize={prop.virtualColSize}
      baseRowHeight={this.baseRowHeight}
      focusBody={this.focusBody}
      renderRowHeight={prop.renderRowHeight}
      excelMode={this.excelMode}
      {...{
        on: {
          'update:focusBody': (focusBody) => { this.focusBody = focusBody },
          'update:renderRowHeight': (renderRowHeight) => { this.renderRowHeight[prop.renderRowKey] = renderRowHeight }
        }
      }}
      scopedSlots={ getScopedSlots.call(this, Object.keys(prop.dataProp))}
    >
    </TableBody>
  )
}
export function getScopedSlots (keys) {
  const scopedSlots = {}
  keys.forEach(key => {
    if (!this.$scopedSlots[key]) {
      return
    }
    scopedSlots[key] = props => this.$scopedSlots[key]({
      rowIndex: props.rowIndex,
      colIndex: props.colIndex,
      row: props.row,
      propKey: props.propKey,
      dataProp: this.dataProp,
      dataList: this.dataList,
      name: props.propKey
    })
  })
  return scopedSlots
}
