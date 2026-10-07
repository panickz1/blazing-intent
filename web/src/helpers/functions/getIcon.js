export default function IconComponent({ iconName, className }) {
  return <span className={`material-symbols-sharp ${className}`}>{iconName}</span>
}
