import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Language = 'zh' | 'en' | 'ja' | 'ko'

export interface Translation {
  // Header
  title: string
  subtitle: string
  
  // Sections
  plainText: string
  plainTextDesc: string
  base64Encoded: string
  base64EncodedDesc: string
  
  // Placeholders
  textPlaceholder: string
  base64Placeholder: string
  
  // Buttons
  convertToBase64: string
  convertToText: string
  clearAll: string
  languageSelector: string
  
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
  
  // Features
  featuresTitle: string
  localProcessing: string
  localProcessingDesc: string
  bidirectionalConversion: string
  bidirectionalConversionDesc: string
  oneClickCopy: string
  oneClickCopyDesc: string
  quickClear: string
  quickClearDesc: string
  
  // Footer
  footerText: string
}

const translations: Record<Language, Translation> = {
  zh: {
    title: 'Base64 转换工具',
    subtitle: '安全的本地 Base64 编码解码工具，支持文本与 Base64 相互转换，数据不会离开您的浏览器',
    
    plainText: '普通文本',
    plainTextDesc: '输入要编码的文本内容',
    base64Encoded: 'Base64 编码',
    base64EncodedDesc: '输入要解码的 Base64 内容',
    
    textPlaceholder: '在此输入要转换为 Base64 的文本...',
    base64Placeholder: '在此输入要解码的 Base64 字符串...',
    
    convertToBase64: '转为 Base64',
    convertToText: '解码为文本',
    clearAll: '清空所有内容',
    languageSelector: '选择语言',
    
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
    
    featuresTitle: '工具特性',
    localProcessing: '本地处理',
    localProcessingDesc: '数据不会上传到服务器',
    bidirectionalConversion: '双向转换',
    bidirectionalConversionDesc: '支持编码和解码操作',
    oneClickCopy: '一键复制',
    oneClickCopyDesc: '快速复制结果到剪贴板',
    quickClear: '快速清空',
    quickClearDesc: '一键清除所有内容',
    
    footerText: '安全可靠的 Base64 转换工具 • 所有处理均在本地进行 • 保护您的数据隐私'
  },
  
  en: {
    title: 'Base64 Converter',
    subtitle: 'Secure local Base64 encoding and decoding tool. Convert between text and Base64 while keeping your data safe in your browser',
    
    plainText: 'Plain Text',
    plainTextDesc: 'Enter text content to encode',
    base64Encoded: 'Base64 Encoded',
    base64EncodedDesc: 'Enter Base64 content to decode',
    
    textPlaceholder: 'Enter text to convert to Base64...',
    base64Placeholder: 'Enter Base64 string to decode...',
    
    convertToBase64: 'Convert to Base64',
    convertToText: 'Decode to Text',
    clearAll: 'Clear All Content',
    languageSelector: 'Select Language',
    
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
    
    featuresTitle: 'Tool Features',
    localProcessing: 'Local Processing',
    localProcessingDesc: 'Data never leaves your browser',
    bidirectionalConversion: 'Bidirectional',
    bidirectionalConversionDesc: 'Supports encoding and decoding',
    oneClickCopy: 'One-Click Copy',
    oneClickCopyDesc: 'Quickly copy results to clipboard',
    quickClear: 'Quick Clear',
    quickClearDesc: 'Clear all content with one click',
    
    footerText: 'Secure and reliable Base64 converter • All processing done locally • Protecting your data privacy'
  },
  
  ja: {
    title: 'Base64 変換ツール',
    subtitle: '安全なローカル Base64 エンコード・デコードツール。テキストと Base64 の相互変換をブラウザ内で安全に行えます',
    
    plainText: 'プレーンテキスト',
    plainTextDesc: 'エンコードするテキストを入力',
    base64Encoded: 'Base64 エンコード',
    base64EncodedDesc: 'デコードする Base64 を入力',
    
    textPlaceholder: 'Base64 に変換するテキストを入力してください...',
    base64Placeholder: 'デコードする Base64 文字列を入力してください...',
    
    convertToBase64: 'Base64 に変換',
    convertToText: 'テキストにデコード',
    clearAll: 'すべてクリア',
    languageSelector: '言語選択',
    
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
    
    featuresTitle: 'ツールの特徴',
    localProcessing: 'ローカル処理',
    localProcessingDesc: 'データはサーバーに送信されません',
    bidirectionalConversion: '双方向変換',
    bidirectionalConversionDesc: 'エンコードとデコードに対応',
    oneClickCopy: 'ワンクリックコピー',
    oneClickCopyDesc: '結果を素早くクリップボードにコピー',
    quickClear: 'クイッククリア',
    quickClearDesc: 'ワンクリックですべてをクリア',
    
    footerText: '安全で信頼性の高い Base64 変換ツール • すべての処理はローカルで実行 • データプライバシーを保護'
  },
  
  ko: {
    title: 'Base64 변환기',
    subtitle: '안전한 로컬 Base64 인코딩 및 디코딩 도구. 브라우저에서 텍스트와 Base64 간 상호 변환을 안전하게 수행합니다',
    
    plainText: '일반 텍스트',
    plainTextDesc: '인코딩할 텍스트 입력',
    base64Encoded: 'Base64 인코딩',
    base64EncodedDesc: '디코딩할 Base64 입력',
    
    textPlaceholder: 'Base64로 변환할 텍스트를 입력하세요...',
    base64Placeholder: '디코딩할 Base64 문자열을 입력하세요...',
    
    convertToBase64: 'Base64로 변환',
    convertToText: '텍스트로 디코딩',
    clearAll: '모두 지우기',
    languageSelector: '언어 선택',
    
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
    
    featuresTitle: '도구 특징',
    localProcessing: '로컬 처리',
    localProcessingDesc: '데이터가 서버로 전송되지 않음',
    bidirectionalConversion: '양방향 변환',
    bidirectionalConversionDesc: '인코딩과 디코딩 지원',
    oneClickCopy: '원클릭 복사',
    oneClickCopyDesc: '결과를 클립보드에 빠르게 복사',
    quickClear: '빠른 지우기',
    quickClearDesc: '원클릭으로 모든 내용 지우기',
    
    footerText: '안전하고 신뢰할 수 있는 Base64 변환기 • 모든 처리는 로컬에서 수행 • 데이터 프라이버시 보호'
  }
}

interface I18nState {
  currentLanguage: Language
  setLanguage: (language: Language) => void
  t: Translation
}

export const useI18nStore = create<I18nState>()(
  persist(
    (set, get) => ({
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
          // Ensure translations are loaded after rehydration
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