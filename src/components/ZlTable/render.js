export function renderHead (h) {
  return (
    <div class="head">
      <div class="zl-table-fixed">
        <TableHead
          headData={this.fixedHeadData}
          sortTag={this.sortTag}
          {...{
            on: {
              sortData: this.sortData
            }
          }}
          scopedSlots={ this.headScopedSlots}
        ></TableHead>
      </div>
      {renderScrollBox.call(this, h, false, true, 'default-head', '',
        <TableHead
          headData={this.defaultHeadData}
          sortTag={this.sortTag}
          virtualBeginCol={this.virtualBeginCol}
          virtualColSize={this.virtualColSize}
          virtualBoxStyle= {{ 'min-width': this.virtualBoxStyle['min-width'] }}
          {...{
            on: {
              sortData: this.sortData
            }
          }}
          scopedSlots={ this.headScopedSlots}
        ></TableHead>
      )}
    </div>
  )
}
export function renderStickyBody (h) {
  if (!this.stickyDataList.length) {
    return
  }
  return (
    <div class="sticky-body">
      <div class="zl-table-fixed" style={{ width: this.fixedWidth + 'px' }}>
        {renderBody.call(this, h, {
          dataList: this.stickyDataList,
          dataProp: this.fixedDataProp,
          renderRowHeight: this.renderRowHeight.sticky,
          renderRowKey: 'sticky',
          renderColKey: 'fixed',
          virtualBoxStyle: {}
        })}
      </div>
      {renderScrollBox.call(this, h, false, true, 'zl-table-default', '', renderBody.call(this, h, {
        dataList: this.stickyDataList,
        dataProp: this.dataProp,
        renderRowHeight: this.renderRowHeight.sticky,
        renderRowKey: 'sticky',
        renderColKey: 'default',
        virtualBoxStyle: { 'min-width': this.virtualBoxStyle['min-width'] }
      }))}
    </div>
  )
}
export function renderDefaultBody (h) {
  return (
    <div class="body" ref="main">
      {renderScrollBox.call(this, h, true, false, 'zl-table-fixed', { width: this.fixedWidth + 'px' }, renderBody.call(this, h, {
        dataList: this.defaultDataList,
        dataProp: this.fixedDataProp,
        virtualBeginRow: this.virtualBeginRow,
        virtualBoxStyle: { 'min-height': this.virtualBoxStyle['min-height'] },
        transformY: this.virtualBeginRow !== -1 ? this.scrollTop : 0,
        virtualRowSize: this.virtualRowSize,
        virtualColSize: this.virtualColSize,
        renderRowHeight: this.renderRowHeight.default,
        renderRowKey: 'default',
        renderColKey: 'fixed'
      }))}
      {renderScrollBox.call(this, h, true, true, 'zl-table-default', '', renderBody.call(this, h, {
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
        renderRowKey: 'default',
        renderColKey: 'default'
      }))}
    </div>
  )
}
function renderScrollBox (h, top, left, clazz, style, slot) {
  return (
    <ScrollBox
      class={clazz}
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
      hoverRow={this.hoverRow}
      selectRow={this.selectRow}
      mixRender={this.mixRender.TableBody}
      {...{
        on: {
          'update:focusBody': (focusBody) => { this.focusBody = focusBody },
          'update:renderRowHeight': (renderRowHeight) => { this.renderRowHeight[prop.renderRowKey] = renderRowHeight },
          'update:hoverRow': (hoverRow) => { this.hoverRow = hoverRow },
          'update:selectRow': (selectRow) => { this.selectRow = selectRow }
        }
      }}
      scopedSlots={this.scopedSlots}
    >
    </TableBody>
  )
}
