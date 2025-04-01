import Svg, { Path, SvgProps } from 'react-native-svg'
const ClosedMenu = (props: SvgProps) => (
  <Svg
    width={100}
    height={98}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    viewBox="0 0 24 24"
    {...props}
  >
    <Path
      stroke="none"
      d="M0 0h24v24H0z"
    />
    <Path d="M4 6h16M4 12h16M4 18h16" />
  </Svg>
)
export default ClosedMenu
