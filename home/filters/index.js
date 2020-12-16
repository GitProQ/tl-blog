// import parseTime and set to filter
export { parseTime } from '@/utils'

export function replaceUrlPrefix(url) {
  const isDev = process.env.NODE_ENV === 'development'
  return isDev ? url : '//cdn.timelessq.com' + url
}

/**
 * 计算tag的classname
 * @param {String} tag 标签名称
 * @returns {String}
 * @summary 标签charCodeAt总长度%颜色总数
 */
export function tagClassName(tag) {
  const nameEnum = ['red', 'geekblue', 'orange', 'cyan', 'green', 'blue', 'purple', 'magenta']
  const enumLength = nameEnum.length
  let tagLength = 0
  for (let i = 0; i < tag.length; i++) {
      const charCode = tag.charCodeAt(i)
      tagLength += charCode
  }
  const findName = nameEnum[tagLength % enumLength]
  return findName ? `tl-tag--${findName}` : ''
}
