interface FieldErrors {
  [key: string]: string;
}

const emailPattern = /.+@.+\..+/;

export function validateRequired(value: string | number | boolean, message: string): string {
  if (value === undefined || value === null || value === '' || value === false) {
    return message;
  }
  return '';
}

export function validateEmail(value: string, message: string): string {
  if (!emailPattern.test(value)) {
    return message;
  }
  return '';
}

export function validateNumberRange(
  value: number,
  { min, max, message }: { min?: number; max?: number; message: string }
): string {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return message;
  }
  if (min !== undefined && value < min) {
    return message;
  }
  if (max !== undefined && value > max) {
    return message;
  }
  return '';
}

export function validateConsultantForm(form: Record<string, unknown>): FieldErrors {
  const errors: FieldErrors = {};
  if (validateRequired(form.name as string, '氏名は必須です。')) {
    errors.name = '氏名は必須です。';
  }
  if (
    validateNumberRange(form.preferredUtilization as number, {
      min: 10,
      max: 100,
      message: '希望稼働率は10〜100の数値で入力してください。',
    })
  ) {
    errors.preferredUtilization = '希望稼働率は10〜100の数値で入力してください。';
  }
  if (
    validateNumberRange(form.preferredRateAmount as number, {
      min: 1000,
      message: '希望単価は正しい数値で入力してください。',
    })
  ) {
    errors.preferredRateAmount = '希望単価は正しい数値で入力してください。';
  }
  if (validateRequired(form.baseLocation as string, '拠点は必須です。')) {
    errors.baseLocation = '拠点は必須です。';
  }
  if (!Array.isArray(form.skills) || (form.skills as string[]).length === 0) {
    errors.skills = 'スキルは1つ以上入力してください。';
  }
  if (
    validateNumberRange(form.experienceYears as number, {
      min: 0,
      max: 50,
      message: '経験年数は0〜50の範囲で入力してください。',
    })
  ) {
    errors.experienceYears = '経験年数は0〜50の範囲で入力してください。';
  }
  if (validateRequired(form.availableFrom as string, '稼働開始可能日は必須です。')) {
    errors.availableFrom = '稼働開始可能日は必須です。';
  }
  if (validateRequired(form.bio as string, '自己PRは必須です。')) {
    errors.bio = '自己PRは必須です。';
  }
  if (validateEmail(form.contact as string, '正しいメールアドレスを入力してください。')) {
    errors.contact = '正しいメールアドレスを入力してください。';
  }
  return errors;
}

export function validateProjectForm(form: Record<string, unknown>): FieldErrors {
  const errors: FieldErrors = {};
  if (validateRequired(form.companyName as string, '会社名は必須です。')) {
    errors.companyName = '会社名は必須です。';
  }
  if (validateRequired(form.contactEmail as string, '連絡先は必須です。')) {
    errors.contactEmail = '連絡先は必須です。';
  } else if (validateEmail(form.contactEmail as string, '正しいメールアドレスを入力してください。')) {
    errors.contactEmail = '正しいメールアドレスを入力してください。';
  }
  if (validateRequired(form.title as string, '案件名は必須です。')) {
    errors.title = '案件名は必須です。';
  }
  if (validateRequired(form.description as string, '概要は必須です。')) {
    errors.description = '概要は必須です。';
  }
  if (validateRequired(form.role as string, '役割は必須です。')) {
    errors.role = '役割は必須です。';
  }
  if (!Array.isArray(form.requiredSkills) || (form.requiredSkills as string[]).length === 0) {
    errors.requiredSkills = '必須スキルは1つ以上入力してください。';
  }
  if (
    validateNumberRange(form.utilization as number, {
      min: 10,
      max: 100,
      message: '稼働率目安は10〜100の範囲で入力してください。',
    })
  ) {
    errors.utilization = '稼働率目安は10〜100の範囲で入力してください。';
  }
  if (
    validateNumberRange(form.rateLower as number, {
      min: 100000,
      message: '単価下限は正しい数値で入力してください。',
    })
  ) {
    errors.rateLower = '単価下限は正しい数値で入力してください。';
  }
  if (
    validateNumberRange(form.rateUpper as number, {
      min: form.rateLower as number,
      message: '単価上限は下限以上の数値で入力してください。',
    })
  ) {
    errors.rateUpper = '単価上限は下限以上の数値で入力してください。';
  }
  if (validateRequired(form.workStyle as string, '働き方は必須です。')) {
    errors.workStyle = '働き方は必須です。';
  }
  if (validateRequired(form.location as string, '勤務地は必須です。')) {
    errors.location = '勤務地は必須です。';
  }
  if (validateRequired(form.startDate as string, '開始希望日は必須です。')) {
    errors.startDate = '開始希望日は必須です。';
  }
  return errors;
}
