import { FaChevronRight } from "react-icons/fa";

export function SettingsSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="w-full">
      <h3 className="text-xs uppercase text-gray-500 mb-3 px-1 tracking-wide">
        {title}
      </h3>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {children}
      </div>
    </div>
  );
}

export function SettingsItem({
  title,
  subtitle,
  value,
  icon: Icon,
  showChevron = true,
}: {
  title: string;
  subtitle?: string;
  value?: string;
  icon?: any;
  showChevron?: boolean;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-4 border-b last:border-none border-gray-200 hover:bg-gray-50 cursor-pointer transition">
      <div className="flex items-center gap-3">
        {Icon && <Icon className="text-gray-600 text-lg" />}
        <div>
          <p className="text-[15px] text-gray-900">{title}</p>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {value && <p className="text-sm text-gray-500">{value}</p>}
        {showChevron && <FaChevronRight className="text-gray-400" />}
      </div>
    </div>
  );
}
