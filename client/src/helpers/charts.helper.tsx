
import donation_params from '../helpers/donation_params.json'
import { ResponsivePie } from '@nivo/pie'
import { CircularProgressbarWithChildren } from 'react-circular-progressbar'
//import 'react-circular-progressbar/dist/styles.css'
import '../style/progress_bar.sass'
import hokui_logo from "../img/favicon_hokui.png" 

/**
 * react-circular-progressbar documentation is https://github.com/kevinsqi/react-circular-progressbar.
 * @returns 
 */
const MyProgressBar = () => {
  let per_value = Math.round(donation_params.current_value/donation_params.target_value*1000)/10
  let per_print = per_value.toFixed(1)
  return(
    <CircularProgressbarWithChildren value={per_value} styles={{root:{}}}>
      <img style={{ width: 50, marginTop: -5, marginBottom: 8 }} src={hokui_logo} alt="hokui logo" />
      <div style={{ fontSize: 20, marginTop: -5, textAlign:"center"}}>
        達成率 : <strong>{per_print}%</strong>  <br />
        ¥{donation_params.current_value.toLocaleString()} /¥{donation_params.target_value.toLocaleString()}
      </div>
    </CircularProgressbarWithChildren>
  )

}



/**
 * My Responsive Pie chart.
 * can generate code from https://nivo.rocks/pie/
 * @returns 
 */
const MyResponsivePie = () => {
  let data = [
    {
      "id": "上記1.\nサーバー維持費",
      "label": "上記1.",
      "value": 10000,
      "color": "hsl(173, 70%, 50%)"
    },
    {
      "id": "上記2. 前身サイト分",
      "label": "上記2.",
      "value": 45000,
      "color": "hsl(109, 70%, 50%)"
    },
    {
      "id": "上記3.手数料(15%)",
      "label": "上記3.",
      "value": 16000,
      "color": "hsl(87, 70%, 50%)"
    },
    {
      "id": "上記1. 未来2年分",
      "label": "上記1.未来分",
      "value": 20000,
      "color": "hsl(144, 70%, 50%)"
    }
  ]
  const chartColors = ['#7DC0FB', '#FF8042', '#00C49F', '#FFBB28']
  return (
    <div style={{height:500, fontSize:"120%"}}>
      <ResponsivePie
          colors = {chartColors}
          data={data}
          theme = {{legends:{text:{fontSize:14}}}}
          margin={{ top: 40, right: 80, bottom: 80, left: 40 }}
          arcLabelsRadiusOffset={0.55}
          defs={[
              {
                  id: 'dots',
                  type: 'patternDots',
                  background: 'inherit',
                  color: 'rgba(255, 255, 255, 0.3)',
                  size: 4,
                  padding: 1,
                  stagger: true
              },
              {
                  id: 'lines',
                  type: 'patternLines',
                  background: 'inherit',
                  color: 'rgba(255, 255, 255, 0.3)',
                  rotation: -45,
                  lineWidth: 6,
                  spacing: 10
              }
          ]}     
          legends={[
              {
                  anchor: 'bottom',
                  direction: 'row',
                  justify: false,
                  translateX: 1,
                  translateY: 56,
                  itemsSpacing: 0,
                  itemWidth: 100,
                  itemHeight: 20,
                  itemTextColor: '#999',
                  itemDirection: 'left-to-right',
                  itemOpacity: 1,
                  symbolSize: 27,
                  symbolShape: 'circle',
                  effects: [
                      {
                          on: 'hover',
                          style: {
                              itemTextColor: '#000'
                          }
                      }
                  ]
              }
          ]}
      />
    </div>
)}

export {MyProgressBar, MyResponsivePie}