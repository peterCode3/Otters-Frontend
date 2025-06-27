import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Paragraph from '@/src/components/atoms/Paragraph/Paragraph';
import Heading from '@/src/components/atoms/Heading/Heading';
import '@/styles/auth.css'
import Link from 'next/link';

export default function AuthForm({
  title,
  subtitle,
  fields = [], // Array of input field configs
  loading,
  timer,
  errors = {},
  onSubmit,
  submitText = "Submit",
  links = [], // Array of { text, onClick, className }
  bottomText,
  bottomLinkText,
  onBottomLink,
  pas_sublabel,
  children, // For any extra custom content
}) {
  return (
    <div className="min-h-screen flex items-center justify-center text-text p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl relative shadow-soft boxshadow-soft p-8 md:p-10">
          <div className="flex justify-center mb-6">
            <div className="flex items-center">
              <span className="text-xl font-bold">OTTERS IQ™</span>
            </div>
          </div>
          {title && (
            <Heading className="text-2xl font-bold mb-2 text-center" level='4'>{title}</Heading>
          )}
          {subtitle && (
            <Paragraph className="text-secondary text-sm mb-6 text-center">{subtitle}</Paragraph>
          )}
          <form onSubmit={onSubmit}>
            {fields.map((field, idx) => (
              <div className="mb-5" key={field.name || idx}>
                {field.label && (
                  <label className="block text-sm font-medium mb-2">{field.label}</label>
                )}
                <div className="relative">
                  {field.icon && (
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                      <FontAwesomeIcon icon={field.icon} />
                    </span>
                  )}
                  {field.type === "select" ? (
                    <select
                      value={field.value}
                      onChange={field.onChange}
                      className={`w-full ${field.icon ? 'pl-10' : 'pl-4'} pr-4 py-3 border ${errors[field.name] ? 'border-red-500 bg-red-50' : 'border-gray-200'
                        } rounded-lg focus:ring-2 focus:ring-primary outline-none`}
                      required={field.required}
                      disabled={loading || field.disabled}
                      name={field.name}
                    >
                      {field.options.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  ) : field.type === "file" ? (
                    <input
                      type="file"
                      accept={field.accept}
                      onChange={field.onChange}
                      className={`w-full ${field.icon ? 'pl-10' : 'pl-4'} pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none`}
                      disabled={loading || field.disabled}
                      name={field.name}
                    />
                  ) : field.type === "textarea" ? (
                    <textarea
                      value={field.value}
                      onChange={field.onChange}
                      placeholder={field.placeholder}
                      className={`w-full ${field.icon ? 'pl-10' : 'pl-4'} pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none resize-none`}
                      disabled={loading || field.disabled}
                      name={field.name}
                      rows={3}
                    />
                  ) : (
                    <>
                    <input
                      type={field.type === 'password' && field.showPassword !== undefined
                        ? (field.showPassword ? 'text' : 'password')
                        : field.type}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder={field.placeholder}
                      className={`w-full ${field.icon ? 'pl-10' : 'pl-4'} ${field.hasToggle ? 'pr-10' : 'pr-4'} py-3 border ${errors[field.name] ? 'border-red-500 bg-red-50' : 'border-gray-200'
                        } rounded-lg focus:ring-2 focus:ring-primary outline-none`}
                      required={field.required}
                      disabled={loading || field.disabled}
                      autoComplete={field.autoComplete}
                      name={field.name}
                    />
                    
                    </>
                  )}
                  {field.hasToggle && (
                    <button
                      type="button"
                      tabIndex={-1}
                      className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3 text-gray-400 focus:outline-none"
                      onClick={field.onToggle}
                      aria-label={field.showPassword ? "Hide password" : "Show password"}
                    >
                      <FontAwesomeIcon icon={field.showPassword ? field.toggleIconHide : field.toggleIconShow} />
                    </button>
                  )}
                </div>
                {errors[field.name] && (
                  <>
                  <Paragraph className="text-sm text-red-500 mt-1">{errors[field.name]}</Paragraph>
                  {field.sublabel && (
                    <div className='relative'>
                      <Link className='absolute -top-5 right-0' href={field.sublabellink}>{field.sublabel}</Link>
                    </div>
                  )}
                  </>
                  
                )}
                
              </div>
            ))}

            {links.length > 0 && (
              <div className="flex justify-between items-center mb-4">
                {links.map((link, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={link.className || "text-sm text-primary hover:underline"}
                    style={link.style}
                    onClick={link.onClick}
                  >
                    {link.text}
                  </button>
                ))}
              </div>
            )}

            <button
              type="submit"
              className="submit_button w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 rounded-lg flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loader mr-2"></span>
                  {timer ? `Redirecting in ${timer}s...` : "Loading..."}
                </>
              ) : (
                submitText
              )}
            </button>

            {errors.form && (
              <Paragraph className="text-center text-sm text-red-500 mt-3">
                {errors.form}
              </Paragraph>
            )}
          </form>

          {children}

          {bottomText && (
            <div className="text-center mt-6 text-secondary text-sm">
              {bottomText}{' '}
              {bottomLinkText && (
                <span
                  className="text-primary cursor-pointer hover:underline"
                  style={{ color: '#00A3CF' }}
                  onClick={onBottomLink}
                >
                  {bottomLinkText}
                </span>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}