import Svg, { Line } from 'react-native-svg'
const BarChart = props => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-bar-chart h-24 w-24 text-primary animate-pulse"
    {...props}
  >
    <Line
      x1={12}
      x2={12}
      y1={20}
      y2={10}
    />
    <Line
      x1={18}
      x2={18}
      y1={20}
      y2={4}
    />
    <Line
      x1={6}
      x2={6}
      y1={20}
      y2={16}
    />
  </Svg>
)
export default BarChart
