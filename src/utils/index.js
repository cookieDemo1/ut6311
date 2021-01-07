import {route} from "preact-router";

//存储
const Storage  = (strategy = 'localStorage') => {
  const set = (key, val, maxAge = 0) => {
    const data = {val, expires: maxAge === 0 ? 0 : Date.now() + maxAge,}
    window[strategy][key.toString()] = JSON.stringify(data)
  }
  const get = (key) => {
    const data = window[strategy][key.toString()]
        && JSON.parse(window[strategy][key.toString()])
    if (data) {
      if (data.expires === 0) {
        return data.val
      }
      if (Date.now() < data.expires) {
        return data.val
      }
      remove(key)
      return null
    }
    return null
  }
  const remove = (key) =>{
    delete window[strategy][key.toString()]
  }
  return {set,get,remove}
}

export const local = Storage('localStorage')
export const session = Storage('sessionStorage')

//input
export function getKey(e) {
  e = e ? e : (window.event ? window.event : "")
  return e.keyCode ? String.fromCharCode(e.keyCode) : String.fromCharCode(e.which)
}

//http请求
export function getQuery(obj) {
  if (typeof obj !== "object"){
    return ''
  }
  return Object.keys(obj).reduce((res,key,index) => { return res + (index === 0?'':'&') + (`${key}=${obj[key]}`) },'')
}


export function request(options){
  return new Promise((resolve,reject) => {
    const {path, method='GET', data = {}, success, fail} = options
    let request = window.XMLHttpRequest?new XMLHttpRequest():new ActiveXObject("Microsoft.XMLHTTP");
    request.onreadystatechange = () => {
      if(request.readyState === 4){
        if(request.status >= 200 && request.status < 300){
          let jsonStart = request.responseText.indexOf("{")
          if (jsonStart === -1){
            resolve(request.responseText)
          }else {
            resolve(JSON.parse(request.responseText.slice(jsonStart)))
          }
        } else if(request.status >= 400){
          if (request.status === 401){
            local.remove('Authorization')
            route('/')
          }
          reject(request)
        }
      }
    }
    request.open(method, path, true)
    request.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
    local.get('Authorization') && request.setRequestHeader('Authorization', local.get('Authorization') );
    request.send(JSON.stringify(data))
  })
}


//form表单验证
export function validate(items,form){
  return new Promise((resolve) => {
    let isOK = true, nextError = {}
    items.forEach((item) => {
      const {rules=[],formKey} = item
      const value = form[formKey]
      rules.every(rule => {
        const {isValid, message} = rule.call(undefined,value)
        if (!isValid){
          isOK = false
          nextError[formKey] = message
        }
        return isValid
      })
    })
    resolve({isOK, nextError})
  })
}

const isRequiredMessage = 'Please enter this field'
const isIPMessage = 'Please enter a valid address range'
const isScopeMessage = 'Please enter a valid numeric range'
const isCharactersMessage = 'Password must be composed of Numbers, letters or underscores'
const isLengthMessage = 'Password must contain at least 4 characters'

export const isRequired = (error= isRequiredMessage) => (value) => {
  let isValid = false, message = ''
  let str = String(value).replace(/(^\s*)|(\s*$)/g, '');//把val首尾的空格去掉。
  if (str.length){
    isValid = true
    message = ''
  }else {
    isValid = false
    message = error
  }
  return {isValid, message }
}

export const isIP = (error = isIPMessage) => (value) => {
  let isValid = false, message = ''
  isValid = !String(value).length || /^((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}$/.test(String(value))
  if (isValid){
    message = ''
  }else {
    message = error
  }
  return {isValid, message }
}



export const isScope = (min,max,error = isScopeMessage) => (value) => {
  let isValid = false, message = ''
  isValid = !String(value).length || (Number(value) >= min && Number(value) <= max)
  if (isValid){
    message = ''
  }else {
    message = error
  }
  return {isValid, message }
}


export const isRemoteIP = () => (value = []) => {
  let isValid = true, message = []
  value.forEach((item,index) => {
    const {ip, port}  = item
    const IPRule = isIP(), scopeRule = isScope(0,65534)
    const {isValid: isValidIP, message: ipError } = IPRule(ip)
    const {isValid: isValidScope, message: portError } = scopeRule(port)
    message.push({ipError,portError})
    if (!isValidIP || !isValidScope){
      isValid = false
    }
  })
  return {isValid, message}
}



export const isCharacters = (error = isCharactersMessage) => (value) => {
  let isValid = false, message = ''
  isValid = /^[A-Za-z0-9-_]+$/.test(value)
  if (isValid){
    message = ''
  }else {
    message = error
  }
  return {isValid, message }
}


export const isLength = (length = 4, error = isLengthMessage) => (value) => {
  let isValid = false, message = ''
  isValid = String(value).length >= length
  if (isValid){
    message = ''
  }else {
    message = error
  }
  return {isValid, message }
}



