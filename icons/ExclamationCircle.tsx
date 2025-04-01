import Svg, { Path, SvgProps } from 'react-native-svg'
const ExclamationCircle = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={1.5}
    viewBox="0 0 24 24"
    {...props}
  >
    <Path
      stroke="none"
      d="M0 0h24v24H0z"
    />
    <Path d="M3 12a9 9 0 1 0 18 0 9 9 0 1 0-18 0M12 9v4M12 16v.01" />
  </Svg>
)
export default ExclamationCircle
