import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addConsultant } from '../lib/storage';
import { validateConsultantForm } from '../lib/validators';
import { RateType } from '../types';
import { TagInput } from '../components/TagInput';
import { Select } from '../components/Select';
import { Modal } from '../components/Modal';
import { useToast } from '../components/Toast';

const skillSuggestions = ['戦略', '業務改革', 'データ分析', 'PM', 'PMO', 'ITアーキテクチャ'];
const industryOptions = ['製造', '金融', '小売', 'EC', '公共', '保険', '物流', '観光'];
const prefectures = [
  '北海道',
  '青森県',
  '岩手県',
  '宮城県',
  '秋田県',
  '山形県',
  '福島県',
  '茨城県',
  '栃木県',
  '群馬県',
  '埼玉県',
  '千葉県',
  '東京都',
  '神奈川県',
  '新潟県',
  '富山県',
  '石川県',
  '福井県',
  '山梨県',
  '長野県',
  '岐阜県',
  '静岡県',
  '愛知県',
  '三重県',
  '滋賀県',
  '京都府',
  '大阪府',
  '兵庫県',
  '奈良県',
  '和歌山県',
  '鳥取県',
  '島根県',
  '岡山県',
  '広島県',
  '山口県',
  '徳島県',
  '香川県',
  '愛媛県',
  '高知県',
  '福岡県',
  '佐賀県',
  '長崎県',
  '熊本県',
  '大分県',
  '宮崎県',
  '鹿児島県',
  '沖縄県',
];

export function ConsultantNew() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [skills, setSkills] = useState<string[]>([]);
  const [industries, setIndustries] = useState<string[]>([]);
  const [rateType, setRateType] = useState<RateType>('月額');
  const [baseLocation, setBaseLocation] = useState('');
  const [remote, setRemote] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const form = {
      name: formData.get('name') as string,
      preferredUtilization: Number(formData.get('preferredUtilization')),
      preferredRateAmount: Number(formData.get('preferredRateAmount')),
      baseLocation,
      remote,
      experienceYears: Number(formData.get('experienceYears')),
      industries,
      skills,
      availableFrom: formData.get('availableFrom') as string,
      engagementLength: formData.get('engagementLength') as string,
      bio: formData.get('bio') as string,
      contact: formData.get('contact') as string,
    };

    const validationErrors = validateConsultantForm({ ...form, preferredRateType: rateType });
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      showToast('入力内容を確認してください。', 'error');
      return;
    }

    addConsultant({
      id: crypto.randomUUID(),
      name: form.name,
      preferredUtilization: form.preferredUtilization,
      preferredRate: { type: rateType, amount: form.preferredRateAmount },
      baseLocation,
      remote,
      skills,
      industries,
      experienceYears: form.experienceYears,
      availableFrom: form.availableFrom,
      engagementLength: form.engagementLength,
      bio: form.bio,
      contact: form.contact,
      createdAt: new Date().toISOString().slice(0, 10),
    });

    event.currentTarget.reset();
    setSkills([]);
    setIndustries([]);
    setRateType('月額');
    setBaseLocation('');
    setRemote(false);
    setErrors({});
    setShowModal(true);
    showToast('コンサルタント情報を登録しました。', 'success');
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-2xl font-semibold text-primary-700">コンサルタント登録</h1>
      <p className="mt-2 text-sm text-slate-600">必須項目を入力し、登録ボタンを押してください。</p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-8">
        <section className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700" htmlFor="name">
              氏名<span className="ml-1 text-rose-500">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400 ${
                errors.name ? 'border-rose-400' : 'border-slate-200'
              }`}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'name-error' : undefined}
            />
            {errors.name ? (
              <p id="name-error" className="text-xs text-rose-500">
                {errors.name}
              </p>
            ) : null}
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700" htmlFor="experienceYears">
              経験年数<span className="ml-1 text-rose-500">*</span>
            </label>
            <input
              id="experienceYears"
              name="experienceYears"
              type="number"
              inputMode="numeric"
              min={0}
              className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400 ${
                errors.experienceYears ? 'border-rose-400' : 'border-slate-200'
              }`}
              aria-invalid={Boolean(errors.experienceYears)}
              aria-describedby={errors.experienceYears ? 'experienceYears-error' : undefined}
            />
            {errors.experienceYears ? (
              <p id="experienceYears-error" className="text-xs text-rose-500">
                {errors.experienceYears}
              </p>
            ) : null}
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700" htmlFor="preferredUtilization">
              希望稼働率 (%)<span className="ml-1 text-rose-500">*</span>
            </label>
            <input
              id="preferredUtilization"
              name="preferredUtilization"
              type="number"
              inputMode="numeric"
              min={10}
              max={100}
              className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400 ${
                errors.preferredUtilization ? 'border-rose-400' : 'border-slate-200'
              }`}
              aria-invalid={Boolean(errors.preferredUtilization)}
              aria-describedby={errors.preferredUtilization ? 'preferredUtilization-error' : undefined}
            />
            {errors.preferredUtilization ? (
              <p id="preferredUtilization-error" className="text-xs text-rose-500">
                {errors.preferredUtilization}
              </p>
            ) : null}
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700" htmlFor="preferredRateAmount">
              希望単価<span className="ml-1 text-rose-500">*</span>
            </label>
            <div className="flex gap-2">
              <Select
                label=""
                name="rateType"
                value={rateType}
                onChange={(value) => setRateType(value as RateType)}
                options={[
                  { label: '月額', value: '月額' },
                  { label: '日給', value: '日給' },
                  { label: '時給', value: '時給' },
                ]}
              />
              <input
                id="preferredRateAmount"
                name="preferredRateAmount"
                type="number"
                inputMode="numeric"
                className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400 ${
                  errors.preferredRateAmount ? 'border-rose-400' : 'border-slate-200'
                }`}
                aria-invalid={Boolean(errors.preferredRateAmount)}
                aria-describedby={errors.preferredRateAmount ? 'preferredRateAmount-error' : undefined}
              />
            </div>
            {errors.preferredRateAmount ? (
              <p id="preferredRateAmount-error" className="text-xs text-rose-500">
                {errors.preferredRateAmount}
              </p>
            ) : null}
          </div>
          <div className="space-y-1">
            <Select
              label="拠点"
              name="baseLocation"
              value={baseLocation}
              onChange={(value) => setBaseLocation(value as string)}
              options={prefectures.map((pref) => ({ label: pref, value: pref }))}
              placeholder="選択してください"
              required
              error={errors.baseLocation}
            />
          </div>
          <div className="flex items-end gap-2">
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                name="remote"
                checked={remote}
                onChange={(event) => setRemote(event.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
              />
              リモート勤務可
            </label>
          </div>
          <div className="md:col-span-2">
            <TagInput
              label="スキルタグ"
              values={skills}
              onChange={setSkills}
              suggestions={skillSuggestions}
              required
              placeholder="Enterキーで追加"
              error={errors.skills}
            />
          </div>
          <div className="md:col-span-2">
            <TagInput
              label="得意業界"
              values={industries}
              onChange={setIndustries}
              suggestions={industryOptions}
              placeholder="例: 製造"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700" htmlFor="availableFrom">
              稼働開始可能日<span className="ml-1 text-rose-500">*</span>
            </label>
            <input
              id="availableFrom"
              name="availableFrom"
              type="date"
              className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400 ${
                errors.availableFrom ? 'border-rose-400' : 'border-slate-200'
              }`}
            />
            {errors.availableFrom ? (
              <p className="text-xs text-rose-500">{errors.availableFrom}</p>
            ) : null}
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700" htmlFor="engagementLength">
              稼働期間目安
            </label>
            <input
              id="engagementLength"
              name="engagementLength"
              type="text"
              placeholder="例: 6ヶ月"
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
            />
          </div>
          <div className="md:col-span-2 space-y-1">
            <label className="text-sm font-medium text-slate-700" htmlFor="bio">
              自己PR<span className="ml-1 text-rose-500">*</span>
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={5}
              maxLength={400}
              className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400 ${
                errors.bio ? 'border-rose-400' : 'border-slate-200'
              }`}
            />
            {errors.bio ? <p className="text-xs text-rose-500">{errors.bio}</p> : null}
          </div>
          <div className="md:col-span-2 space-y-1">
            <label className="text-sm font-medium text-slate-700" htmlFor="contact">
              連絡先メールアドレス<span className="ml-1 text-rose-500">*</span>
            </label>
            <input
              id="contact"
              name="contact"
              type="email"
              className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400 ${
                errors.contact ? 'border-rose-400' : 'border-slate-200'
              }`}
            />
            {errors.contact ? <p className="text-xs text-rose-500">{errors.contact}</p> : null}
          </div>
        </section>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-600 hover:bg-slate-100"
          >
            戻る
          </button>
          <button
            type="submit"
            className="rounded-md bg-primary-600 px-6 py-2 text-sm font-semibold text-white shadow hover:bg-primary-700"
          >
            登録する
          </button>
        </div>
      </form>
      <Modal
        title="登録が完了しました"
        open={showModal}
        onClose={() => {
          setShowModal(false);
          navigate('/consultants/search');
        }}
      >
        <p className="text-sm text-slate-600">
          登録内容が保存されました。引き続き案件検索をご利用いただけます。
        </p>
      </Modal>
    </main>
  );
}
