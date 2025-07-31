import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import {
  faUserPlus, faEnvelope, faLock, faIndustry, faBuilding,
  faImage, faPlus, faXmark, faFilter, faUser
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast } from 'react-toastify';
import { signupUser } from '@/services/authService';
import '@/styles/auth.css';


const RULE_FIELDS = [
  { value: 'Budget', label: 'Budget' },
  { value: 'Region', label: 'Region' },
  { value: 'Company Size', label: 'Company Size' },
  { value: 'Intent', label: 'Intent' },
  { value: 'Source', label: 'Source' },
  { value: 'Industry', label: 'Industry' },
];

const INDUSTRY_OPTIONS = [
  "SaaS",
  "E-commerce",
  "Real Estate",
  "Finance",
  "Healthcare",
  "Education",
  "Agency"
];

const TYPE_OPTIONS = ["OtterLite", "OtterScale", "OtterPrime"];
const STATUS_OPTIONS = ["Healthy", "At Risk", "Poor"];

export default function AddNewClient() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    industry_tag: INDUSTRY_OPTIONS[0],
    type: TYPE_OPTIONS[0],
    logo: '',
    init_status: STATUS_OPTIONS[0],
    status: 'active',
    notes: '',
  });
  const [rules, setRules] = useState([
    { field: RULE_FIELDS[0].value, value: '' },
  ]);
  const [logoPreview, setLogoPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef();

  // Handle form field changes
  const handleChange = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle logo upload
  const handleLogo = async (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/') && file.size <= 2 * 1024 * 1024) {
      const formData = new FormData();
      formData.append('logo', file);

      setLoading(true);
      try {
        const res = await fetch('http://localhost:5000/api/upload/logo', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        setLogoPreview(`http://localhost:5000${data.url}`);
        handleChange('logo', `http://localhost:5000${data.url}`);       
      } catch (err) {
        toast.error('Image upload failed');
      }
      setLoading(false);
    }
  };

  // Handle status pill click
  const handleStatus = (init_status) => {
    handleChange('init_status', init_status);
  };

  // Handle client type click
  const handleType = (type) => {
    handleChange('type', type);
  };

  // Handle rules
  const addRule = () => setRules([...rules, { field: RULE_FIELDS[0].value, value: '' }]);
  const removeRule = idx => setRules(rules.filter((_, i) => i !== idx));
  const updateRule = (idx, key, value) => {
    setRules(rules.map((r, i) => i === idx ? { ...r, [key]: value } : r));
  };

  // Validation function
  const validate = () => {
    const newErrors = {};
    if (!form.username.trim()) newErrors.username = "Please enter your name.";
    if (!form.email.trim()) newErrors.email = "Please enter your email.";
    if (!form.password.trim()) newErrors.password = "Please enter your password.";
    if (!form.industry_tag.trim()) newErrors.industry_tag = "Please select an industry.";
    if (!form.type.trim()) newErrors.type = "Please select a client type.";
    if (!form.status.trim()) newErrors.status = "Please select a status.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }
    setErrors({});

    const ruleFields = {};
    rules.forEach(rule => {
      if (rule.field && rule.value) {
        const key = rule.field
          .toLowerCase()
          .replace(/\s(.)/g, s => s.trim().toUpperCase())
          .replace(/\s/g, '');
        ruleFields[key] = rule.value;
      }
    });

    try {
      await signupUser({ ...form, ...ruleFields, rules });
      toast.success('Client added!');
      router.push('/clients');
    } catch (err) {
      setLoading(false);
      const msg = err.response?.data?.message || 'Failed to add client';
      setErrors({ form: msg });
      toast.error(msg);
    }
    setLoading(false);
  };

const color = 'var(--color-black)';



  return (
    <div className="min-h-screen flex items-center justify-center text-text p-4">
      <div className="w-full max-w-5xl rounded-2xl shadow-soft bg-white flex flex-col relative dark:bg-[#14212e]">
        <div className="flex flex-col md:flex-row">
          {/* Left Column */}
          <div className="flex flex-col flex-shrink-0 w-full md:w-[400px] max-w-[420px] px-8 py-8 gap-6">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2 dark:text-white"
                style={{ color }}>
                  <FontAwesomeIcon icon={faUserPlus} className="text-primary" />
                  Add New Client
                </h2>
                <div className="text-sm text-secondary mt-1 dark:text-gray-400">
                  Create a new client profile for lead management.
                </div>
              </div>
              <button
                className="cursor-pointer text-secondary hover:text-danger text-xl transition rounded-full p-2 -mr-2 -mt-2 dark:text-gray-400 dark:hover:text-red-400"
                onClick={() => router.back()}
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
            <form className="flex flex-col gap-5" autoComplete="off" onSubmit={handleSubmit}>
              {/* Client Name */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold mb-1 dark:text-white" style={{ color }}>
                  Client Name <span className="text-danger">*</span>
                </label>
                <div className="relative">
                  {errors.username && (
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-red-400" style={{ color }}>
                      <FontAwesomeIcon icon={faUser} />
                    </span>
                  )}
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acme Corp"
                    className={`w-full rounded-lg border ${errors.username ? 'pl-10 border-red-400 bg-red-100 text-red-600 placeholder-red-400 dark:bg-red-950 dark:text-red-300' : 'border-gray-200 pl-4 dark:border-gray-700 dark:bg-[#1a2a3a] dark:text-white'} bg-background px-4 py-2 text-base focus:ring-primary focus:outline-none font-medium text-text placeholder-secondary`}
                    value={form.username}
                    onChange={e => handleChange('username', e.target.value)}
                  />
                </div>
                {errors.username && (
                  <div className="text-sm text-red-500 mt-1 dark:text-red-400">{errors.username}</div>
                )}
              </div>
              {/* Email */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold mb-1 dark:text-white" style={{ color }}>Email Address</label>
                <div className="relative">
                  {errors.email && (
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-red-400">
                      <FontAwesomeIcon icon={faEnvelope} />
                    </span>
                  )}
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    className={`w-full rounded-lg border ${errors.email ? 'pl-10 border-red-400 bg-red-100 text-red-600 placeholder-red-400 dark:bg-red-950 dark:text-red-300' : 'border-gray-200 pl-4 dark:border-gray-700 dark:bg-[#1a2a3a] dark:text-white'} bg-background px-4 py-2 text-base focus:ring-primary focus:outline-none text-text placeholder-secondary`}
                    value={form.email}
                    onChange={e => handleChange('email', e.target.value)}
                  />
                </div>
                {errors.email && (
                  <div className="text-sm text-red-500 mt-1 dark:text-red-400">{errors.email}</div>
                )}
              </div>
              {/* Password */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold mb-1 dark:text-white" style={{ color }}>Password</label>
                <div className="relative">
                  {errors.password && (
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-red-400">
                      <FontAwesomeIcon icon={faLock} />
                    </span>
                  )}
                  <input
                    type="password"
                    required
                    placeholder="Set a password"
                    className={`w-full rounded-lg border ${errors.password ? 'pl-10 border-red-400 bg-red-100 text-red-600 placeholder-red-400 dark:bg-red-950 dark:text-red-300' : 'border-gray-200 pl-4 dark:border-gray-700 dark:bg-[#1a2a3a] dark:text-white'} bg-background px-4 py-2 text-base focus:ring-primary focus:outline-none text-text placeholder-secondary`}
                    value={form.password}
                    onChange={e => handleChange('password', e.target.value)}
                  />
                </div>
                {errors.password && (
                  <div className="text-sm text-red-500 mt-1 dark:text-red-400">{errors.password}</div>
                )}
              </div>
              {/* Industry Tag */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold mb-1 dark:text-white" style={{ color }}>Industry Tag</label>
                <div className="relative">
                  {errors.industry_tag && (
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-red-400">
                      <FontAwesomeIcon icon={faIndustry} />
                    </span>
                  )}
                  <select
                    className={`w-full rounded-lg border ${errors.industry_tag ? 'pl-10 border-red-400 bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-300' : 'border-gray-200 pl-4 dark:border-gray-700 dark:bg-[#1a2a3a] dark:text-white'} bg-background px-4 py-2 text-base focus:ring-primary focus:outline-none text-text`}
                    value={form.industry_tag}
                    onChange={e => handleChange('industry_tag', e.target.value)}
                    required
                  >
                    {INDUSTRY_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                {errors.industry_tag && (
                  <div className="text-sm text-red-500 mt-1 dark:text-red-400">{errors.industry_tag}</div>
                )}
              </div>
              {/* Client Type */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold mb-1 dark:text-white" style={{ color }}>Client Type</label>
                <div className="relative">
                  <div className="flex items-center gap-2 bg-background rounded-lg px-2 py-1.5 w-fit dark:bg-[#1a2a3a]">
                    {TYPE_OPTIONS.map(type => (
                      <button
                        type="button"
                        key={type}
                        className={`cursor-pointer client-type-btn px-4 py-1.5 rounded-lg font-semibold text-sm ${form.type === type
                          ? 'text-primary bg-primary/10 ring-2 ring-primary ring-opacity-50'
                          : 'text-secondary hover:bg-primary/10 dark:text-gray-400'
                          } transition`}
                        onClick={() => handleType(type)}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                  {errors.type && (
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 text-red-400">
                      <FontAwesomeIcon icon={faBuilding} />
                    </span>
                  )}
                </div>
                {errors.type && (
                  <div className="text-sm text-red-500 mt-1 dark:text-red-400">{errors.type}</div>
                )}
              </div>
              {/* Logo Upload */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold mb-1 dark:text-white" style={{ color }}>Logo Upload</label>
                <div
                  className="flex items-center justify-center bg-background border-2 border-dashed border-primary/40 rounded-lg px-4 py-6 cursor-pointer hover:bg-primary/10 transition min-h-[88px] relative dark:bg-[#1a2a3a] dark:border-primary/60"
                  onClick={() => fileInputRef.current.click()}
                >
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="w-full absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                    onChange={handleLogo}
                  />
                  {!logoPreview ? (
                    <div className="flex flex-col items-center gap-1 z-10 pointer-events-none">
                      <FontAwesomeIcon icon={faImage} className="text-2xl text-primary mb-1" />
                      <span className="text-secondary text-xs dark:text-gray-400">Drag & drop or click to upload</span>
                      <span className="text-xs text-secondary dark:text-gray-400">PNG, JPG, SVG — max 2 MB</span>
                    </div>
                  ) : (
                    <img src={logoPreview} alt="Logo Preview" className="absolute inset-0 object-contain max-h-20 m-auto rounded-lg bg-white border" />
                  )}
                </div>
              </div>
              {/* Initial Status */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold mb-1 dark:text-white" style={{ color }}>Initial Status</label>
                <div className="relative">
                  <div className="flex gap-2">
                    {STATUS_OPTIONS.map(label => {
                      const color =
                        label === "Healthy"
                          ? "success"
                          : label === "At Risk"
                            ? "warning"
                            : "danger";
                      return (
                        <button
                          type="button"
                          key={label}
                          className={`cursor-pointer status-pill px-4 py-1.5 rounded-full text-sm font-semibold ${form.init_status === label
                            ? `bg-${color}/10 text-${color} ring-2 ring-${color} ring-opacity-50`
                            : `bg-${color}/10 text-${color} hover:bg-${color}/20`
                            }`}
                          onClick={() => handleStatus(label)}
                          style={{ color }}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                  {errors.init_status && (
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 text-red-400">
                      <FontAwesomeIcon icon={faFilter} />
                    </span>
                  )}
                </div>
                {errors.init_status && (
                  <div className="text-sm text-red-500 mt-1 dark:text-red-400">{errors.init_status}</div>
                )}
              </div>
              {/* Locked Radio
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold mb-1 text-text dark:text-white">Locked</label>
                <div>
                  <label>
                    <input
                      type="radio"
                      name="locked"
                      value="true"
                      checked={form.locked === true || form.locked === "true"}
                      onChange={() => handleChange('locked', true)}
                    /> Yes
                  </label>
                  <label className="ml-4">
                    <input
                      type="radio"
                      name="locked"
                      value="false"
                      checked={form.locked === false || form.locked === "false"}
                      onChange={() => handleChange('locked', false)}
                    /> No
                  </label>
                </div>
              </div> */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold mb-1 dark:text-white" style={{ color }}>Client Status</label>
                <div>
                  <label
                  style={{ color }}>
                    <input
                      type="radio"
                      name="status"
                      value="active"
                      checked={form.status === 'active'}
                      onChange={e => handleChange('status', e.target.value)}
                    /> Active
                  </label>
                  <label className="ml-4"
                  style={{ color }}>
                    <input
                      type="radio"
                      name="status"
                      value="inactive"
                      checked={form.status === 'inactive'}
                      onChange={e => handleChange('status', e.target.value)}
                    /> Inactive
                  </label>
                </div>
                {errors.status && (
                  <div className="text-sm text-red-500 mt-1 dark:text-red-400">{errors.status}</div>
                )}
              </div>
              {/* Internal Notes */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold mb-1 dark:text-white" htmlFor="clientNotes" style={{ color }}>
                  Internal Notes
                </label>
                <textarea
                  id="clientNotes"
                  rows={3}
                  placeholder="Optional notes for your team..."
                  className="rounded-lg border border-gray-200 bg-background px-4 py-2 text-base focus:ring-primary focus:outline-none text-text placeholder-secondary resize-none dark:border-gray-700 dark:bg-[#1a2a3a] dark:text-white"
                  value={form.notes}
                  onChange={e => handleChange('notes', e.target.value)}
                />
              </div>
              {/* Error */}
              {errors.form && (
                <div className="text-xs text-danger font-medium dark:text-red-400">{errors.form}</div>
              )}
              {/* Submit */}
              <button
                type="submit"
                className="cursor-pointer w-full bg-primary text-white rounded-lg px-8 py-2 font-semibold shadow-soft text-base flex items-center gap-2 justify-center transition hover:bg-primary/90"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                    </svg>
                    Signing up...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faPlus} />
                    Add Client
                  </>
                )}
              </button>
            </form>
          </div>
          {/* Divider */}
          <div className="hidden md:block h-full w-px bg-divider mx-0 my-8 dark:bg-gray-700" style={{ borderRight: '1px dashed #E6EAF0' }}></div>
          {/* Right Column: Lead Qualification Rules */}
          <div className="flex-1 min-w-0 flex flex-col px-8 py-8 md:pl-10 gap-6">
            <div className="mb-1">
              <h3 className="text-lg font-bold flex items-center gap-2 dark:text-white" style={{ color }}>
                <FontAwesomeIcon icon={faFilter} className="text-primary" />
                Lead Qualification Criteria
              </h3>
              <div className="text-sm text-secondary mt-1 dark:text-gray-400">
                Define custom rules for qualifying leads for this client.
              </div>
            </div>
            <div className="flex flex-col gap-4 max-h-[340px] overflow-y-auto pr-2">
              <div className="flex flex-col gap-3">
                {rules.map((rule, idx) => (
                  <div key={idx} className="flex flex-wrap md:flex-nowrap gap-3 items-center bg-background/90 rounded-lg px-4 py-3 mb-0 max-w-[420px] relative dark:bg-[#1a2a3a]" style={{ minWidth: 0 }}>
                    <select
                      className="rule-field-dropdown flex-shrink-0 min-w-[120px] max-w-[180px] border border-gray-200 rounded-lg px-3 py-2 text-sm  bg-white focus:ring-primary focus:outline-none dark:border-gray-700 dark:bg-[#1a2a3a] dark:text-white"
                      value={rule.field}
                      onChange={e => updateRule(idx, 'field', e.target.value)}
                      style={{ color }}
                    >
                      {RULE_FIELDS.map(opt => (
                        <option key={opt.value} value={opt.value} style={{ color }}>{opt.label}</option>
                      ))}
                    </select>
                    <input
                      className="w-full rule-value-input flex-1 min-w-[100px] max-w-[180px] border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white placeholder-secondary focus:ring-primary focus:outline-none dark:border-gray-700 dark:bg-[#1a2a3a] dark:text-white"
                      placeholder="Enter value..."
                      value={rule.value}
                      style={{ color }}
                      onChange={e => updateRule(idx, 'value', e.target.value)}
                    />
                    <button
                      type="button"
                      className="cursor-pointer remove-rule-btn text-danger hover:bg-danger/10 rounded-full p-2 ml-1"
                      onClick={() => removeRule(idx)}
                    >
                      <FontAwesomeIcon icon={faXmark} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-between mt-2">
              <button
                type="button"
                className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary font-medium hover:bg-primary/20 transition text-sm"
                onClick={addRule}
              >
                <FontAwesomeIcon icon={faPlus} />
                Add Rule
              </button>
              <span className="text-xs text-secondary dark:text-gray-400">Rules are flexible and client-specific</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}