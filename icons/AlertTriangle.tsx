import Svg, { SvgProps, Path } from 'react-native-svg'
const AlertTriangle = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-triangle-alert h-6 w-6 text-orange-500"
    {...props}
  >
    <Path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
    <Path d="M12 9v4" />
    <Path d="M12 17h.01" />
  </Svg>
)
export default AlertTriangle
