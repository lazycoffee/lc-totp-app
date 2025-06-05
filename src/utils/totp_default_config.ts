// 各平台官方TOTP默认配置
// 数据来源：常见TOTP验证器标准配置（如Google/Microsoft/GitHub均采用RFC6238默认值）
export const TotpDefaultConfigs = {
  Google: {
    algorithm: 'SHA-1',
    digits: 6,
    period: 30
  },
  Microsoft: {
    algorithm: 'SHA-1',
    digits: 6,
    period: 30
  },
  GitHub: {
    algorithm: 'SHA-1',
    digits: 6,
    period: 30
  }
};