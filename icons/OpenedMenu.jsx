import Svg, { Path } from 'react-native-svg'
const OpenedMenu = props => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    viewBox="0 0 24 24"
    className="icon icon-tabler icons-tabler-outline icon-tabler-menu-4"
    {...props}
  >
    <Path
      stroke="none"
      d="M0 0h24v24H0z"
    />
    <Path d="M7 6h10M4 12h16M7 12h13M7 18h10" />
  </Svg>
)
export default OpenedMenu
