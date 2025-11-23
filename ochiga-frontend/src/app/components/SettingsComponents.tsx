// ochiga-frontend/src/app/components/SettingsComponents.tsx
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
      <h3 className="text-xs uppercase text-gray-400 mb-3 px-1 tracking-wide">
        {title}
      </h3>

      <div className="bg-gray-800 rounded-2xl shadow-sm border border-gray-700 overflow-hidden w-full">
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
    <div className="flex items-center justify-between px-4 py-4 border-b last:border-none border-gray-700 hover:bg-gray-700 cursor-pointer transition w-full">
      <div className="flex items-center gap-3">
        {Icon && <Icon className="text-gray-300 text-lg" />}
        <div className="w-full">
          <p className="text-[15px] text-gray-100">{title}</p>
          {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {value && <p className="text-sm text-gray-400">{value}</p>}
        {showChevron && <FaChevronRight className="text-gray-400" />}
      </div>
    </div>
  );
}
