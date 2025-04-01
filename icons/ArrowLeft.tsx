import Svg, { Path, SvgProps } from 'react-native-svg'
const ArrowLeft = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-left"
    viewBox="0 0 24 24"
    {...props}
  >
    <Path
      stroke="none"
      d="M0 0h24v24H0z"
    />
    <Path d="M5 12h14M5 12l6 6M5 12l6-6" />
  </Svg>
)
export default ArrowLeft
