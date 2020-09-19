import React,{useEffect,useState} from 'react'
import {Line} from "react-chartjs-2";
import numeral from "numeral"
const options={
  
    legend:{
        display:false,
      
        point:{
            radius:0
        },
    },
    

    maintainAspectRatio:false,
    tooltips:{
        mode:"index",
        intersect:false,
        callbacks:{
            label:function(tooltipitem,data){
                return numeral(tooltipitem.value).format("+0,0")
            }
        }
    },
    scales:{
        xAxes:[
        {
            type:"time",
            time:{
                format:"MM/DD/YY",
                tooltipformat:"ll",
            }
        },
    ],
        yAxes:[
            {
                gridLines:{
                    display:false,
                },
                ticks:{
                    callback:function(value,index,values){
                        return numeral(value).format("0a")
                    }
                }
            }
        ]
    }
}
const buildChartData = (data,caseType)=>{
    const chartData = []
    let lastDataPoint ;
   console.log(caseType)
    for (let date in data[caseType]){
        
        if(lastDataPoint){
            const  newDataPoint = {
                x:date,
                y:data[caseType][date]-lastDataPoint
            }
            
            chartData.push(newDataPoint)
        }
        lastDataPoint = data[caseType][date]
        
    }
    return chartData
}
export const LineGraph = (props) => {
    options["title"] = {
        
            display: true,
            text: props.title
        
    }
    const [data,setData] = useState([])
    const bgColor = props.bgColor
    console.log(bgColor)
    const borderColor = props.borderColor
    useEffect(()=>{
        const fetchData = async()=>{
            const url = props.countryCode=="worldwide"
            ?"https://disease.sh/v3/covid-19/historical/all?lastdays=30"
            :`https://disease.sh/v3/covid-19/historical/${props.countryCode}?lastdays=30`
           await fetch(url)
            .then(Response=>Response.json())
            .then((Data)=>{
                let chartData;
                console.log(Data)
               
              
                if(props.countryCode!="worldwide"){
                    if(Data.timeline==undefined){
                        setData({})
                        console.log(Data)
                        return;
                    }
                    const timeline = Data["timeline"]
                     chartData = buildChartData(timeline,props.caseType)
                     console.log(timeline)
                }
                else{
                    
                     chartData = buildChartData(Data,props.caseType)
                }
                
               
                setData(chartData)
                
                
            })
            .catch((e)=>{
                setData([])
            })
        }
        fetchData()
    },[props.countryCode,props.caseType])
   let graph;
   console.log(bgColor)
   if(data.length>0){
       graph = <div style={{height:"250px"}}>
       <Line
       options={options}
       data={{
           datasets:[{
               backgroundColor:bgColor,
               borderColor:borderColor,
               data:data}]
       }}
       />
   
   </div>
   }
   else{
       graph=<div>
           <h3>
               No records available for this country
           </h3>
       </div>
   }
        return (
            <div style={{height:"100%"}}>
            {graph}
            </div>
        
    )
}
