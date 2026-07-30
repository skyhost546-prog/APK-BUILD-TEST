import React, { useState } from 'react';
import { 
  X, 
  Wand2, 
  Check, 
  Smartphone, 
  ShoppingBag, 
  Gamepad2, 
  Globe, 
  Flame, 
  Shield, 
  Heart, 
  Zap, 
  Sparkles, 
  Music, 
  Camera, 
  ShoppingCart, 
  Rocket, 
  Code, 
  CheckSquare, 
  Star, 
  MessageSquare, 
  Briefcase, 
  Plane, 
  Coffee, 
  Car, 
  Lock, 
  Sun, 
  Moon, 
  MapPin, 
  Feather, 
  Compass, 
  Layers 
} from 'lucide-react';
import { AppConfig, AppIconConfig } from '../types';

interface IconGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AppConfig;
  setConfig: React.Dispatch<React.SetStateAction<AppConfig>>;
}

const ICON_LIST = [
  { name: 'Smartphone', icon: Smartphone },
  { name: 'ShoppingBag', icon: ShoppingBag },
  { name: 'Gamepad2', icon: Gamepad2 },
  { name: 'Globe', icon: Globe },
  { name: 'Flame', icon: Flame },
  { name: 'Shield', icon: Shield },
  { name: 'Heart', icon: Heart },
  { name: 'Zap', icon: Zap },
  { name: 'Sparkles', icon: Sparkles },
  { name: 'Music', icon: Music },
  { name: 'Camera', icon: Camera },
  { name: 'ShoppingCart', icon: ShoppingCart },
  { name: 'Rocket', icon: Rocket },
  { name: 'Code', icon: Code },
  { name: 'CheckSquare', icon: CheckSquare },
  { name: 'Star', icon: Star },
  { name: 'MessageSquare', icon: MessageSquare },
  { name: 'Briefcase', icon: Briefcase },
  { name: 'Plane', icon: Plane },
  { name: 'Coffee', icon: Coffee },
  { name: 'Car', icon: Car },
  { name: 'Lock', icon: Lock },
  { name: 'Sun', icon: Sun },
  { name: 'Moon', icon: Moon },
  { name: 'MapPin', icon: MapPin },
  { name: 'Feather', icon: Feather },
  { name: 'Compass', icon: Compass },
  { name: 'Layers', icon: Layers },
];

export const IconGeneratorModal: React.FC<IconGeneratorModalProps> = ({
  isOpen,
  onClose,
  config,
  setConfig,
}) => {
  const [iconConfig, setIconConfig] = useState<AppIconConfig>(config.icon);

  if (!isOpen) return null;

  const handleSave = () => {
    setConfig((prev) => ({ ...prev, icon: iconConfig }));
    onClose();
  };

  const getShapeClass = () => {
    switch (iconConfig.shape) {
      case 'circle':
        return 'rounded-full';
      case 'squircle':
        return 'rounded-[24px]';
      case 'rounded-square':
        return 'rounded-2xl';
      default:
        return 'rounded-2xl';
    }
  };

  const SelectedIconComp = ICON_LIST.find((i) => i.name === iconConfig.iconName)?.icon || Smartphone;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
          <div className="flex items-center space-x-2.5">
            <Wand2 className="w-5 h-5 text-indigo-400" />
            <h3 className="font-extrabold text-base text-white">
              Studio d'Icône Android Native
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Preview Badge */}
        <div className="flex flex-col items-center justify-center bg-slate-950 p-6 rounded-2xl border border-slate-800 mb-5">
          <div
            className={`w-20 h-20 flex items-center justify-center text-white shadow-2xl transition-all duration-300 relative ${getShapeClass()}`}
            style={{
              background: iconConfig.useGradient && iconConfig.gradientSecondary
                ? `linear-gradient(135deg, ${iconConfig.bgColor}, ${iconConfig.gradientSecondary})`
                : iconConfig.bgColor,
            }}
          >
            <SelectedIconComp className="w-10 h-10 drop-shadow-md" />
            {iconConfig.badgeText && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-slate-950">
                {iconConfig.badgeText}
              </span>
            )}
          </div>
          <span className="text-xs text-slate-400 font-semibold mt-3">
            Aperçu Launcher Android
          </span>
        </div>

        {/* Customization Options */}
        <div className="space-y-4 max-h-[280px] overflow-y-auto pr-1 text-xs">
          {/* Shape Selector */}
          <div>
            <label className="block font-medium text-slate-300 mb-1.5">
              Forme de l'Icône (Adaptive Icon)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'squircle', label: 'Squircle (Android)' },
                { id: 'circle', label: 'Rond (Circle)' },
                { id: 'rounded-square', label: 'Carré Arrondi' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setIconConfig((prev) => ({ ...prev, shape: s.id as any }))}
                  className={`py-2 px-3 rounded-xl border font-medium text-xs transition ${
                    iconConfig.shape === s.id
                      ? 'border-indigo-500 bg-indigo-950/50 text-indigo-200'
                      : 'border-slate-800 bg-slate-950 text-slate-400'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Color Settings */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-300 mb-1">Couleur Principale</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={iconConfig.bgColor}
                  onChange={(e) => setIconConfig((prev) => ({ ...prev, bgColor: e.target.value }))}
                  className="w-8 h-8 rounded border border-slate-700 bg-transparent cursor-pointer"
                />
                <span className="font-mono text-slate-300">{iconConfig.bgColor}</span>
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">Dégradé Secondaire</label>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={iconConfig.useGradient}
                  onChange={(e) => setIconConfig((prev) => ({ ...prev, useGradient: e.target.checked }))}
                  className="w-4 h-4 rounded text-indigo-600"
                />
                {iconConfig.useGradient && (
                  <input
                    type="color"
                    value={iconConfig.gradientSecondary || '#10b981'}
                    onChange={(e) => setIconConfig((prev) => ({ ...prev, gradientSecondary: e.target.value }))}
                    className="w-8 h-8 rounded border border-slate-700 bg-transparent cursor-pointer"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Symbol Picker */}
          <div>
            <label className="block font-medium text-slate-300 mb-1.5">Symbole / Icône Lucide</label>
            <div className="grid grid-cols-7 gap-1.5 p-2 bg-slate-950 border border-slate-800 rounded-xl">
              {ICON_LIST.map((item) => {
                const ItemIcon = item.icon;
                const isSelected = iconConfig.iconName === item.name;
                return (
                  <button
                    key={item.name}
                    onClick={() => setIconConfig((prev) => ({ ...prev, iconName: item.name }))}
                    className={`p-2 rounded-lg flex items-center justify-center transition ${
                      isSelected ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <ItemIcon className="w-4 h-4" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleSave}
          className="mt-5 w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center space-x-2 transition"
        >
          <Check className="w-4 h-4" />
          <span>Appliquer cette Icône</span>
        </button>

      </div>
    </div>
  );
};
