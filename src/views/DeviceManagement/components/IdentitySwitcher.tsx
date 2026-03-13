import React from 'react';
import { UserIdentity } from '../../../interfaces/device';
import { useDeviceStore } from '../../../store/useDeviceStore';
import { User, Users } from 'lucide-react';
import { cn } from '../../../utils/cn';

export const IdentitySwitcher: React.FC = () => {
  const { identity, setIdentity } = useDeviceStore();

  return (
    <div className="flex items-center space-x-1 bg-white/60 backdrop-blur-md p-1 rounded-full shadow-sm border border-white/50 w-fit">
      <button
        onClick={() => setIdentity(UserIdentity.SELF)}
        className={cn(
          "flex items-center space-x-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300",
          identity === UserIdentity.SELF 
            ? "bg-indigo-600 text-white shadow-md" 
            : "text-slate-500 hover:text-slate-700"
        )}
      >
        <User size={16} />
        <span>本人</span>
      </button>
      
      <button
        onClick={() => setIdentity(UserIdentity.CAREGIVER)}
        className={cn(
          "flex items-center space-x-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300",
          identity === UserIdentity.CAREGIVER 
            ? "bg-indigo-600 text-white shadow-md" 
            : "text-slate-500 hover:text-slate-700"
        )}
      >
        <Users size={16} />
        <span>家属</span>
      </button>
    </div>
  );
};
