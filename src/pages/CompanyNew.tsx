import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addProject } from '../lib/storage';
import { validateProjectForm } from '../lib/validators';
import { TagInput } from '../components/TagInput';
import { Select } from '../components/Select';
import { Modal } from '../components/Modal';
import { useToast } from '../components/Toast';

const roleOptions = ['戦略', '業務改革', 'PM', 'PMO', 'データ', 'ITアーキテクト'];
const skillSuggestions = ['戦略', '業務改革', 'PM', 'PMO', 'データ分析', 'ITアーキテクチャ'];
const workStyles = ['リモート', '出社', 'ハイブリッド'];
const industries = ['製造', '金融', '小売', 'EC', '公共', '保険', '物流', '観光'];

export function CompanyNew() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [requiredSkills, setRequiredSkills] = useState<string[]>([]);
  const [niceToHaveSkills, setNiceToHaveSkills] = useState<string[]>([]);
  const [role, setRole] = useState('');
  const [workStyle, setWorkStyle] = useState('リモート');
  const [industry, setIndustry] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const form = {
      companyName: formData.get('companyName') as string,
      contactEmail: formData.get('contactEmail') as string,
      personName: formData.get('personName') as string,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      requiredSkills,
      niceToHaveSkills,
      role,
      utilization: Number(formData.get('utilization')),
      rateLower: Number(formData.get('rateLower')),
      rateUpper: Number(formData.get('rateUpper')),
      period: formData.get('period') as string,
      startDate: formData.get('startDate') as string,
      workStyle,
      location: formData.get('location') as string,
      industry,
    };

    const validationErrors = validateProjectForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      showToast('入力内容を確認してください。', 'error');
      return;
    }

    addProject({
      id: crypto.randomUUID(),
      title: form.title,
      company: form.companyName,
      maskedCompany: `${form.companyName.slice(0, 1)}社`,
      description: form.description,
      requiredSkills,
      niceToHaveSkills,
      role,
      utilization: form.utilization,
      rateLower: form.rateLower,
      rateUpper: form.rateUpper,
      engagementLength: form.period,
      startDate: form.startDate,
      workStyle: workStyle as 'リモート' | '出社' | 'ハイブリッド',
      location: form.location,
      industry,
      contact: form.contactEmail,
      createdAt: new Date().toISOString().slice(0, 10),
    });

    event.currentTarget.reset();
    setRequiredSkills([]);
    setNiceToHaveSkills([]);
    setRole('');
    setIndustry('');
    setWorkStyle('リモート');
    setErrors({});
    setShowModal(true);
    showToast('案件情報を登録しました。', 'success');
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-2xl font-semibold text-primary-700">企業向け案件登録</h1>
      <p className="mt-2 text-sm text-slate-600">必要な情報を入力し、登録を完了してください。</p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-8">
        <section className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700" htmlFor="companyName">
              会社名<span className="ml-1 text-rose-500">*</span>
            </label>
            <input
              id="companyName"
              name="companyName"
              type="text"
              className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400 ${
                errors.companyName ? 'border-rose-400' : 'border-slate-200'
              }`}
            />
            {errors.companyName ? <p className="text-xs text-rose-500">{errors.companyName}</p> : null}
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700" htmlFor="personName">
              担当者名
            </label>
            <input
              id="personName"
              name="personName"
              type="text"
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
            />
          </div>
          <div className="space-y-1 md:col-span-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="contactEmail">
              連絡先メール<span className="ml-1 text-rose-500">*</span>
            </label>
            <input
              id="contactEmail"
              name="contactEmail"
              type="email"
              className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400 ${
                errors.contactEmail ? 'border-rose-400' : 'border-slate-200'
              }`}
            />
            {errors.contactEmail ? <p className="text-xs text-rose-500">{errors.contactEmail}</p> : null}
          </div>
          <div className="space-y-1 md:col-span-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="title">
              案件名<span className="ml-1 text-rose-500">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400 ${
                errors.title ? 'border-rose-400' : 'border-slate-200'
              }`}
            />
            {errors.title ? <p className="text-xs text-rose-500">{errors.title}</p> : null}
          </div>
          <div className="space-y-1 md:col-span-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="description">
              概要<span className="ml-1 text-rose-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows={5}
              maxLength={400}
              className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400 ${
                errors.description ? 'border-rose-400' : 'border-slate-200'
              }`}
            />
            {errors.description ? <p className="text-xs text-rose-500">{errors.description}</p> : null}
          </div>
          <div className="md:col-span-2">
            <TagInput
              label="必須スキル"
              values={requiredSkills}
              onChange={setRequiredSkills}
              suggestions={skillSuggestions}
              placeholder="Enterキーで追加"
              required
              error={errors.requiredSkills}
            />
          </div>
          <div className="md:col-span-2">
            <TagInput
              label="歓迎スキル (任意)"
              values={niceToHaveSkills}
              onChange={setNiceToHaveSkills}
              suggestions={skillSuggestions}
              placeholder="例: 戦略"
            />
          </div>
          <div className="space-y-1">
            <Select
              label="役割"
              name="role"
              value={role}
              onChange={(value) => setRole(value as string)}
              options={roleOptions.map((option) => ({ label: option, value: option }))}
              placeholder="選択してください"
              required
              error={errors.role}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700" htmlFor="utilization">
              稼働率目安 (%)<span className="ml-1 text-rose-500">*</span>
            </label>
            <input
              id="utilization"
              name="utilization"
              type="number"
              inputMode="numeric"
              min={10}
              max={100}
              className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400 ${
                errors.utilization ? 'border-rose-400' : 'border-slate-200'
              }`}
            />
            {errors.utilization ? <p className="text-xs text-rose-500">{errors.utilization}</p> : null}
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700" htmlFor="rateLower">
              単価下限 (円/月)<span className="ml-1 text-rose-500">*</span>
            </label>
            <input
              id="rateLower"
              name="rateLower"
              type="number"
              inputMode="numeric"
              className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400 ${
                errors.rateLower ? 'border-rose-400' : 'border-slate-200'
              }`}
            />
            {errors.rateLower ? <p className="text-xs text-rose-500">{errors.rateLower}</p> : null}
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700" htmlFor="rateUpper">
              単価上限 (円/月)<span className="ml-1 text-rose-500">*</span>
            </label>
            <input
              id="rateUpper"
              name="rateUpper"
              type="number"
              inputMode="numeric"
              className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400 ${
                errors.rateUpper ? 'border-rose-400' : 'border-slate-200'
              }`}
            />
            {errors.rateUpper ? <p className="text-xs text-rose-500">{errors.rateUpper}</p> : null}
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700" htmlFor="period">
              期間
            </label>
            <input
              id="period"
              name="period"
              type="text"
              placeholder="例: 6ヶ月"
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700" htmlFor="startDate">
              開始希望日<span className="ml-1 text-rose-500">*</span>
            </label>
            <input
              id="startDate"
              name="startDate"
              type="date"
              className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400 ${
                errors.startDate ? 'border-rose-400' : 'border-slate-200'
              }`}
            />
            {errors.startDate ? <p className="text-xs text-rose-500">{errors.startDate}</p> : null}
          </div>
          <div className="space-y-1">
            <Select
              label="働き方"
              name="workStyle"
              value={workStyle}
              onChange={(value) => setWorkStyle(value as string)}
              options={workStyles.map((value) => ({ label: value, value }))}
              required
              error={errors.workStyle}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700" htmlFor="location">
              勤務地<span className="ml-1 text-rose-500">*</span>
            </label>
            <input
              id="location"
              name="location"
              type="text"
              className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400 ${
                errors.location ? 'border-rose-400' : 'border-slate-200'
              }`}
            />
            {errors.location ? <p className="text-xs text-rose-500">{errors.location}</p> : null}
          </div>
          <div className="space-y-1">
            <Select
              label="業界"
              name="industry"
              value={industry}
              onChange={(value) => setIndustry(value as string)}
              options={industries.map((value) => ({ label: value, value }))}
              placeholder="選択してください"
            />
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
          navigate('/projects/search');
        }}
      >
        <p className="text-sm text-slate-600">案件情報が保存されました。求める人材の検索に進めます。</p>
      </Modal>
    </main>
  );
}
