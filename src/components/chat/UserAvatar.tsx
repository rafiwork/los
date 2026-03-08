interface Props {
  name: string;
  avatarUrl?: string | null;
  size?: number;
  className?: string;
  colorClass?: string;
}

const AVATAR_COLORS = [
  "from-blue-500 to-cyan-400",
  "from-violet-500 to-purple-400",
  "from-rose-500 to-pink-400",
  "from-amber-500 to-orange-400",
  "from-emerald-500 to-teal-400",
  "from-indigo-500 to-blue-400",
  "from-fuchsia-500 to-pink-400",
  "from-sky-500 to-cyan-400",
];

export const getAvatarColor = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

const UserAvatar = ({ name, avatarUrl, size = 48, className = "", colorClass }: Props) => {
  const color = colorClass || getAvatarColor(name);
  const fontSize = size < 32 ? "text-[10px]" : size < 48 ? "text-sm" : size < 64 ? "text-base" : size < 96 ? "text-xl" : "text-3xl";

  return (
    <div
      className={`rounded-full overflow-hidden shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      {avatarUrl ? (
        <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
      ) : (
        <div className={`w-full h-full bg-gradient-to-br ${color} flex items-center justify-center text-white ${fontSize} font-bold shadow-sm`}>
          {name.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
