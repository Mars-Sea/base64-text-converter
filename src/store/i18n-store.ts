import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Language = 'zh' | 'en' | 'ja' | 'ko'

export interface Translation {
  // Header
  title: string
  subtitle: string

  // Sections
  plainText: string
  base64Encoded: string

  // Placeholders
  textPlaceholder: string
  base64Placeholder: string

  // Buttons & Utilities
  convertToBase64: string
  convertToText: string
  clearAll: string
  languageSelector: string
  liveConvert: string
  themeLight: string
  themeDark: string
  chars: string
  lines: string
  words: string
  bytes: string
  pasteTooltip: string

  // Status line
  statusReady: string
  statusEncodeFailed: string
  statusDecodeFailedShort: string
  statusEncoded: (textChars: number, b64Chars: number, ms: string) => string
  statusDecoded: (b64Chars: number, textChars: number, ms: string) => string

  // Toast messages
  emptyInput: string
  emptyInputDesc: string
  convertSuccess: string
  convertSuccessDesc: string
  convertFailed: string
  convertFailedDesc: string
  decodeSuccess: string
  decodeSuccessDesc: string
  decodeFailed: string
  decodeFailedDesc: string
  noContentToCopy: string
  noContentToCopyDesc: string
  copySuccess: string
  copySuccessDesc: string
  copyFailed: string
  copyFailedDesc: string
  cleared: string
  clearedDesc: string
  // Copy button states
  copy: string
  copied: string

  // Footer
  footerText: string
}

const translations: Record<Language, Translation> = {
  zh: {
    title: 'Base64 转换工具',
    subtitle: '安全的本地 Base64 编码解码工具 · 数据不会离开您的浏览器',

    plainText: '普通文本',
    base64Encoded: 'Base64 编码',

    textPlaceholder: '在此输入要编码为 Base64 的文本...',
    base64Placeholder: '在此输入要解码的 Base64 字符串...',

    convertToBase64: 'encode',
    convertToText: 'decode',
    clearAll: 'clear-all',
    languageSelector: '选择语言',
    liveConvert: 'live',
    themeLight: '浅色模式',
    themeDark: '深色模式',
    chars: '字符',
    lines: '行',
    words: '字',
    bytes: '字节',
    pasteTooltip: '从剪贴板粘贴',

    statusReady: '就绪 · 等待输入',
    statusEncodeFailed: '编码失败 · 包含无法编码的字符',
    statusDecodeFailedShort: '无效的 Base64 · 已跳过解码',
    statusEncoded: (textChars, b64Chars, ms) =>
      `编码完成 · ${textChars} 字符 → ${b64Chars} 字符 · ${ms}ms`,
    statusDecoded: (b64Chars, textChars, ms) =>
      `解码完成 · ${b64Chars} 字符 → ${textChars} 字符 · ${ms}ms`,

    emptyInput: '输入为空',
    emptyInputDesc: '请输入要转换的文本',
    convertSuccess: '转换成功',
    convertSuccessDesc: '文本已转换为 Base64',
    convertFailed: '转换失败',
    convertFailedDesc: '无法转换该文本，请检查输入内容',
    decodeSuccess: '解码成功',
    decodeSuccessDesc: 'Base64 已转换为文本',
    decodeFailed: '解码失败',
    decodeFailedDesc: '无效的 Base64 格式，请检查输入内容',
    noContentToCopy: '无内容可复制',
    noContentToCopyDesc: '文本区域为空',
    copySuccess: '复制成功',
    copySuccessDesc: '内容已复制到剪贴板',
    copyFailed: '复制失败',
    copyFailedDesc: '无法访问剪贴板',
    cleared: '已清空',
    clearedDesc: '所有内容已清除',
    copy: 'copy',
    copied: 'copied',

    footerText: '所有处理均在本地进行 · 保护您的数据隐私'
  },

  en: {
    title: 'Base64 Converter',
    subtitle: 'Secure local Base64 encode/decode tool · your data never leaves the browser',

    plainText: 'Plain Text',
    base64Encoded: 'Base64 Encoded',

    textPlaceholder: 'Type text to encode as Base64...',
    base64Placeholder: 'Type a Base64 string to decode...',

    convertToBase64: 'encode',
    convertToText: 'decode',
    clearAll: 'clear-all',
    languageSelector: 'Select Language',
    liveConvert: 'live',
    themeLight: 'Light Theme',
    themeDark: 'Dark Theme',
    chars: 'chars',
    lines: 'lines',
    words: 'words',
    bytes: 'bytes',
    pasteTooltip: 'Paste from clipboard',

    statusReady: 'ready · waiting for input',
    statusEncodeFailed: 'encode failed · unencodable characters',
    statusDecodeFailedShort: 'invalid base64 · decode skipped',
    statusEncoded: (textChars, b64Chars, ms) =>
      `encoded · ${textChars} chars → ${b64Chars} chars · ${ms}ms`,
    statusDecoded: (b64Chars, textChars, ms) =>
      `decoded · ${b64Chars} chars → ${textChars} chars · ${ms}ms`,

    emptyInput: 'Empty Input',
    emptyInputDesc: 'Please enter text to convert',
    convertSuccess: 'Conversion Successful',
    convertSuccessDesc: 'Text has been converted to Base64',
    convertFailed: 'Conversion Failed',
    convertFailedDesc: 'Unable to convert this text, please check your input',
    decodeSuccess: 'Decoding Successful',
    decodeSuccessDesc: 'Base64 has been converted to text',
    decodeFailed: 'Decoding Failed',
    decodeFailedDesc: 'Invalid Base64 format, please check your input',
    noContentToCopy: 'No Content to Copy',
    noContentToCopyDesc: 'Text area is empty',
    copySuccess: 'Copy Successful',
    copySuccessDesc: 'Content copied to clipboard',
    copyFailed: 'Copy Failed',
    copyFailedDesc: 'Unable to access clipboard',
    cleared: 'Cleared',
    clearedDesc: 'All content has been cleared',
    copy: 'copy',
    copied: 'copied',

    footerText: 'All processing done locally · your privacy is protected'
  },

  ja: {
    title: 'Base64 変換ツール',
    subtitle: '安全なローカル Base64 エンコード/デコードツール · データはブラウザから出ません',

    plainText: 'プレーンテキスト',
    base64Encoded: 'Base64 エンコード',

    textPlaceholder: 'Base64 にエンコードするテキストを入力...',
    base64Placeholder: 'デコードする Base64 文字列を入力...',

    convertToBase64: 'encode',
    convertToText: 'decode',
    clearAll: 'clear-all',
    languageSelector: '言語選択',
    liveConvert: 'live',
    themeLight: 'ライトモード',
    themeDark: 'ダークモード',
    chars: '文字',
    lines: '行',
    words: '単語',
    bytes: 'バイト',
    pasteTooltip: 'クリップボードから貼り付け',

    statusReady: '待機中 · 入力を待っています',
    statusEncodeFailed: 'エンコード失敗 · エンコードできない文字が含まれています',
    statusDecodeFailedShort: '無効な Base64 · デコードをスキップしました',
    statusEncoded: (textChars, b64Chars, ms) =>
      `エンコード完了 · ${textChars} 文字 → ${b64Chars} 文字 · ${ms}ms`,
    statusDecoded: (b64Chars, textChars, ms) =>
      `デコード完了 · ${b64Chars} 文字 → ${textChars} 文字 · ${ms}ms`,

    emptyInput: '入力が空です',
    emptyInputDesc: '変換するテキストを入力してください',
    convertSuccess: '変換成功',
    convertSuccessDesc: 'テキストが Base64 に変換されました',
    convertFailed: '変換失敗',
    convertFailedDesc: 'このテキストを変換できません。入力内容を確認してください',
    decodeSuccess: 'デコード成功',
    decodeSuccessDesc: 'Base64 がテキストに変換されました',
    decodeFailed: 'デコード失敗',
    decodeFailedDesc: '無効な Base64 形式です。入力内容を確認してください',
    noContentToCopy: 'コピーする内容がありません',
    noContentToCopyDesc: 'テキストエリアが空です',
    copySuccess: 'コピー成功',
    copySuccessDesc: 'クリップボードにコピーされました',
    copyFailed: 'コピー失敗',
    copyFailedDesc: 'クリップボードにアクセスできません',
    cleared: 'クリアされました',
    clearedDesc: 'すべての内容がクリアされました',
    copy: 'copy',
    copied: 'copied',

    footerText: 'すべての処理はローカルで実行 · プライバシーを保護'
  },

  ko: {
    title: 'Base64 변환기',
    subtitle: '안전한 로컬 Base64 인코딩/디코딩 도구 · 데이터는 브라우저를 떠나지 않습니다',

    plainText: '일반 텍스트',
    base64Encoded: 'Base64 인코딩',

    textPlaceholder: 'Base64로 인코딩할 텍스트를 입력하세요...',
    base64Placeholder: '디코딩할 Base64 문자열을 입력하세요...',

    convertToBase64: 'encode',
    convertToText: 'decode',
    clearAll: 'clear-all',
    languageSelector: '언어 선택',
    liveConvert: 'live',
    themeLight: '라이트 모드',
    themeDark: '다크 모드',
    chars: '자',
    lines: '줄',
    words: '단어',
    bytes: '바이트',
    pasteTooltip: '클립보드에서 붙여넣기',

    statusReady: '대기 중 · 입력 대기',
    statusEncodeFailed: '인코딩 실패 · 인코딩할 수 없는 문자 포함',
    statusDecodeFailedShort: '잘못된 Base64 · 디코딩 건어너뜀',
    statusEncoded: (textChars, b64Chars, ms) =>
      `인코딩 완료 · ${textChars}자 → ${b64Chars}자 · ${ms}ms`,
    statusDecoded: (b64Chars, textChars, ms) =>
      `디코딩 완료 · ${b64Chars}자 → ${textChars}자 · ${ms}ms`,

    emptyInput: '입력이 비어있음',
    emptyInputDesc: '변환할 텍스트를 입력해주세요',
    convertSuccess: '변환 성공',
    convertSuccessDesc: '텍스트가 Base64로 변환되었습니다',
    convertFailed: '변환 실패',
    convertFailedDesc: '이 텍스트를 변환할 수 없습니다. 입력 내용을 확인해주세요',
    decodeSuccess: '디코딩 성공',
    decodeSuccessDesc: 'Base64가 텍스트로 변환되었습니다',
    decodeFailed: '디코딩 실패',
    decodeFailedDesc: '잘못된 Base64 형식입니다. 입력 내용을 확인해주세요',
    noContentToCopy: '복사할 내용 없음',
    noContentToCopyDesc: '텍스트 영역이 비어있습니다',
    copySuccess: '복사 성공',
    copySuccessDesc: '클립보드에 복사되었습니다',
    copyFailed: '복사 실패',
    copyFailedDesc: '클립보드에 접근할 수 없습니다',
    cleared: '지워짐',
    clearedDesc: '모든 내용이 지워졌습니다',
    copy: 'copy',
    copied: 'copied',

    footerText: '모든 처리는 로컬에서 수행 · 개인정보 보호'
  }
}

interface I18nState {
  currentLanguage: Language
  setLanguage: (language: Language) => void
  t: Translation
}

export const useI18nStore = create<I18nState>()(
  persist(
    (set) => ({
      currentLanguage: 'zh',
      setLanguage: (language: Language) =>
        set({
          currentLanguage: language,
          t: translations[language]
        }),
      t: translations['zh']
    }),
    {
      name: 'base64-converter-i18n',
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.t = translations[state.currentLanguage]
        }
      }
    }
  )
)

export const languages: Record<Language, { name: string; flag: string }> = {
  zh: { name: '中文', flag: '🇨🇳' },
  en: { name: 'English', flag: '🇺🇸' },
  ja: { name: '日本語', flag: '🇯🇵' },
  ko: { name: '한국어', flag: '🇰🇷' }
}
