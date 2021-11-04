/**
 * 建立索引
 * @param   {[string]|[Object]}  data         数据
 * @param   {string|[string]}    indexs       如果 data 为 [Object]，这里需要建立拼音索引 key
 * @param   {array}              dict         词典数据
 */
class Engine {
  constructor (data, indexs = [], dict = {}, pinyin = {}, prefix = '') {
    this.indexs = []
    this.history = { keyword: '', indexs: [], data: [] }
    this.data = data
    this.dict = dict
    this.pinyin = pinyin
    this.prefix = prefix

    // 建立拼音关键词索引
    indexs = typeof indexs === 'string' ? [indexs] : indexs
    this.asyncParticiple(data, indexs)
    // for (const item of data) {
    //   const keywords = []

    //   if (typeof item === 'string') {
    //     keywords.push(Engine.participle(item, dict, prefix))
    //   } else {
    //     for (const key of indexs) {
    //       const words = item[key]
    //       if (words) {
    //         keywords.push(Engine.participle(words, dict, prefix))
    //       }
    //     }
    //   }

    //   this.indexs.push(keywords)
    // }
  }

  asyncParticiple (data, indexs, i = 0) {
    const keywords = []
    const item = data[i]
    if (typeof item === 'string') {
      keywords.push(Engine.participle(item, this.dict))
    } else {
      for (const key of indexs) {
        const words = item[key]
        if (words) {
          keywords.push(Engine.participle(words, this.dict))
        }
      }
    }

    this.indexs.push(keywords)
    i++
    if (data[i]) {
      if (!(i % 1000)) {
        setTimeout(() => {
          this.asyncParticiple(data, indexs, i)
        }, 0)
      } else {
        this.asyncParticiple(data, indexs, i)
      }
    }
  }

  /**
     * 查询
     * @param   {string}    keyword     拼音或者关键字
     * @return  {[string]|{Object}}
     */
  query (keyword) {
    keyword = keyword.replace(/\s/g, '').toLowerCase()

    if (keyword === '') {
      return [...this.data]
    }
    const keywordList = []
    const pinyinArr = this.keywordMatchPinyin(keyword, 0, [keywordList], keywordList)

    const indexs = this.indexs
    const data = this.data
    const result = []

    for (let index = 0; index < indexs.length; index++) {
      indexs[index].some(item => {
        const b = this.check(keyword, item.charSearchList, item.charIndexList)
        if (b) {
          result.push(data[index])
          return true
        }
        return pinyinArr.some(pinyin => {
          const b = this.check(pinyin, item.charSearchList, item.charIndexList)
          if (b) {
            result.push(data[index])
            return true
          }
        })
      })
    }

    return result
  }

  check (keyword, list, next, index = 0, i = 0) {
    const word = keyword[index]
    i = list.findIndex(w => w === word, i)
    if (i === -1) {
      return false
    }
    index++
    if (index === keyword.length) {
      return true
    } else {
      return this.check(keyword, list, next, index, next[i])
    }
  }

  keywordMatchPinyin (keyword, index = 0, arr = [], keywordList = []) {
    const pinyinArr = this.pinyin[keyword[index]]
    if (!pinyinArr) {
      const list = keywordList
      list.push(keyword[index])
      index++
      arr.push(list)
      if (index < keyword.length) {
        this.keywordMatchPinyin(keyword, index, arr, list)
      }
    } else {
      let count = 0
      const matchArr = []
      pinyinArr.forEach(pinyin => {
        const length = pinyin.length
        if (keyword.substr(index, length) === pinyin) {
          let list = []
          if (count) {
            list = [...keywordList]
            list.pop()
            list.push(pinyin)
            arr.push(list)
          } else {
            list = keywordList
            list.push(pinyin)
          }
          count++
          if ((index + length) < keyword.length) {
            matchArr.push({
              index: index + length,
              list
            })
          }
        }
      })
      matchArr.forEach(match => {
        this.keywordMatchPinyin(keyword, match.index, arr, match.list)
      })
      if (!count) {
        keywordList.push(...keyword.substr(index))
      }
    }
    return arr
  }

  /**
     * 将内容进行分词
     * @param   {string}    words        目标字符串
     * @param   {Object}    dict         字典
     */
  static participle (words, dict) {
    const charSearchList = []
    const charIndexList = []
    for (const char of words) {
      const begin = charSearchList.length
      charIndexList.push(charSearchList.length)
      // 保存原字
      charSearchList.push(char)
      // 查找拼音
      const pinyin = dict[char]
      if (pinyin) {
        charSearchList.push(...pinyin)
        charSearchList.push(...pinyin.filter(p => p.length > 1).map(p => p.charAt(0)))
      }
      const end = charSearchList.length
      for (let index = begin; index < end; index++) {
        charIndexList.push(end)
      }
    }
    return {
      charSearchList,
      charIndexList
    }
  }
};

module.exports = Engine
