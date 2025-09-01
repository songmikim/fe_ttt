// CSR, SSR 공통 라이브러리

/**
 * 비밀번호 강도 레벨 체크
 *
 * @param password
 */
export function passwordStrengthLevel(password?: string | number) {
  let strength: number = 0
  password = password ?? ''
  password = '' + password
  password = password.trim()
  if (password) {
    // 패스워드 자리수 - 8까지 1단계 증가, 16자리 이상 2단계 증가
    if (password.length >= 8) strength++
    if (password.length >= 16) strength++

    // 비밀번호에 알파벳 소문자 포함 +1
    if (/[a-z]+/.test(password)) strength++

    // 비밀번호에 알파벳 대문자가 포함 +1
    if (/[A-Z]+/.test(password)) strength++

    // 비밀번호에 숫자가 포함된 경우 +1
    if (/\d+/.test(password)) strength++

    // 비밀번호에 특수문자가 포함된 경우 +1
    if (/[^0-9a-zA-Zㄱ-ㅎ가-힣]+/.test(password)) strength++
  }

  return strength
}

/**
 * FormData 형식의 데이터를 일반 자바스크립트 객체로 변환
 * @param formData
 */
export function toPlainObj(formData: FormData) {
  const params: any = {}

  // 필요한 필드와 값만 추출
  for (const [key, value] of formData.entries()) {
    if (key.startsWith('$ACTION_')) continue
    let _value: string | boolean = value.toString()
    if (['true', 'false'].includes(_value)) {
      _value = _value === 'true'
    }

    params[key] = _value
  }

  return params
}

/**
 * 문자열 날짜인 2025-08-28 10:54:40 형식을 Date 객체로 변환
 * @param strDate
 */
export function toDate(strDate) {
  const dateTime = strDate.split(' ')
  const [year, month, day] = dateTime[0].split('-')
  const [hour, min, sec] = dateTime[1].split(':')

  return new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(min),
    Number(sec),
  )
}

/**
 * 줄개행 문자 \n -> <br>
 * @param str
 */
export function nl2br(str: string) {
  return str.replace(/\r/g, '').replace(/\n/g, '<br />')
}

export function toQueryString(search) {
  if (!search) return ''

  const qs: Array<string> = []
  for (const [key, value] of Object.entries(search)) {
    if (Array.isArray(value)) {
      // 같은 key값에 여러 값이 있는 쿼리 스트링
      for (const v of value) {
        qs.push(`${key}=${v}`)
      }
    } else {
      qs.push(`${key}=${value}`)
    }
  }

  const _qs = qs.join('&')
  return _qs ? `?${_qs}` : ''
}
