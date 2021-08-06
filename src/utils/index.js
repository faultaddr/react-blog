import marked from 'marked'
import { COLOR_LIST } from '@/utils/config'
import xss from 'xss'
import { clear, get } from '@/utils/storage'
// import * as React from 'react'
// import * as ReactMarkdown from 'react-markdown'
// import MathJax from '@matejmazur/react-mathjax'
// import * as RemarkMathPlugin from 'remark-math'
// import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
// import {dark} from 'react-syntax-highlighter/dist/esm/styles/prism'

// export const MarkdownRender = props => {
//   const newProps = {
//     ...props,
//     plugins: [
//       RemarkMathPlugin,
//     ],
//     renderers: {
//       ...props.renderers,
//       code: ({language, value}) =>
//         <SyntaxHighlighter style={dark} language={language} children={value} />,
//       math: props =>
//         <MathJax.Node>{props.value}</MathJax.Node>,
//       inlineMath: props =>
//         <MathJax.Node inline>{props.value}</MathJax.Node>,
//     }

//   }
//   return (
//     <MathJax.Context input='tex'>
//       <ReactMarkdown {...newProps} allowDangerousHtml />
//     </MathJax.Context>
//   )
// }

// // 转化 md 语法为 React Node

// export const translateMarkdown = (plainText, isGuardXss = false) => {
//   return (<MarkdownRender source={plainText}/>)
// }

// 转化md 为html
export const translateMarkdown2html = plainText => {
  const marked_render = new marked.Renderer()
  const isGuardXss = false
  marked_render.old_paragraph = marked_render.paragraph
  // 重写`paragraph()`方法
  marked_render.paragraph = function (text) {
    // isTeXInline - 该文本是否有行内公式
    var isTeXInline = /\$(.*)\$/g.test(text)
    // isTeXLine - 该文本是否有行间公式
    var isTeXLine = /^\$\$(\s*.*\s*)\$\$$/.test(text)

    if (!isTeXLine && isTeXInline) {
      // 如果不是行间公式，但是行内公式，则使用<span class="marked_inline_tex">包裹公式内容，消除$定界符
      text = text.replace(/(\$([^\$]*)\$)+/g, function ($1, $2) {
        // 避免和行内代码冲突
        if ($2.indexOf('<code>') >= 0 || $2.indexOf('</code>') >= 0) {
          return $2
        } else {
          return "<span class='marked_inline_tex'>" + $2.replace(/\$/g, '') + '</span>'
        }
      })
    } else {
      // 如果是行间公式，则使用<div class='marked_tex'>包裹公式内容，消除$$定界符
      // 如果不是LaTex公式，则直接返回原文本
      text = isTeXLine ? "<div class='marked_tex'>" + text.replace(/\$/g, '') + '</div>' : text
    }
    // 使用渲染器原有的`paragraph()`方法渲染整段文本
    text = this.old_paragraph(text)
    return text
  }
  // 配置marked.js的渲染器为marked_render，使用highlight.js来自动高亮MarkDown中的代码
  return marked(isGuardXss ? xss(plainText) : plainText, {
    renderer: marked_render,
    pedantic: false,
    gfm: true,
    tables: true,
    breaks: false,
    sanitize: false,
    smartLists: true,
    smartypants: false,
    xhtml: false,
    highlight: function (code) {
      /*eslint no-undef: "off"*/
      return hljs.highlightAuto(code).value
    },
  })
}

// 获取 url query 参数
export const decodeQuery = url => {
  const params = {}
  const paramsStr = url.replace(/\.*\?/, '') // a=1&b=2&c=&d=xxx&e
  paramsStr.split('&').forEach(v => {
    const d = v.split('=')
    if (d[1] && d[0]) params[d[0]] = d[1]
  })
  return params
}

// 计算 评论数
export const calcCommentsCount = commentList => {
  let count = commentList.length
  commentList.forEach(item => {
    count += item.replies.length
  })
  return count
}

// 取数组中的随机数
export const randomIndex = arr => Math.floor(Math.random() * arr.length)

/**
 * 对数组进行分组
 * @param {Array} arr - 分组对象
 * @param {Function} f
 * @returns 数组分组后的新数组
 */
export const groupBy = (arr, f) => {
  const groups = {}
  arr.forEach(item => {
    const group = JSON.stringify(f(item))
    groups[group] = groups[group] || []
    groups[group].push(item)
  })
  var res = Object.keys(groups).sort().reverse()
  return Object.keys(groups).map((group, i) => groups[res[i]])
}

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:|http:)/.test(path)
}

// 获取 token
export function getToken() {
  let token = ''
  const userInfo = get('userInfo')

  if (userInfo && userInfo.token) {
    token = 'Bearer ' + userInfo.token
  }

  return token
}

/**
 * 生成随机 ID
 * @param {Number} len - 长度
 */
export function RandomId(len) {
  return Math.random().toString(36).substr(3, len)
}

/**
 * debounce
 */
export function debounce(func, wait) {
  let timer = null
  return function () {
    const context = this
    const args = arguments
    clearTimeout(timer)
    timer = setTimeout(function () {
      func.apply(context, args)
    }, wait)
  }
}

// 生成 color
export function genertorColor(list = [], colorList = COLOR_LIST) {
  const _list = [...list]
  _list.forEach((l, i) => {
    l.color = colorList[i] || colorList[randomIndex(colorList)]
  })
  return _list
}

export function encryption(data) {
  let strs = []
  for (const i in data) {
    strs.push(i + '=' + data[i])
  }
  strs.sort() // 数组排序
  strs = strs.join('&') // 数组变字符串
  const endData = strs + '&sign=' + CryptoJS.MD5(strs + 'ADfj3kcadc2349akvm1CPFFCD84f').toString() // MD5加密
  const key = CryptoJS.enc.Utf8.parse('0880076B18D7EE81') // 加密秘钥
  const iv = CryptoJS.enc.Utf8.parse('CB3EC842D7C69578') //  矢量
  const encryptResult = CryptoJS.AES.encrypt(endData, key, {
    //  AES加密
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7, // 后台用的是pad.Pkcs5,前台对应为Pkcs7
  })
  return encodeURIComponent(CryptoJS.enc.Base64.stringify(encryptResult.ciphertext)) // Base64加密encode;
}
