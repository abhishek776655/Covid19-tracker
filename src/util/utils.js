import React from 'react'
import {Circle,Popup} from 'react-leaflet'
import numeral from 'numeral'
import "../Components/Map/Map.css"

const caseTypeColors = {
    cases:{
        hex:"#CC1034",
        
        multiplier:600,
    },
    recovered:{
        hex:"#7dd71d",
      
        multiplier:1000,
    
    },
    deaths:{
        hex:"#fb4443",
       
        multiplier:1600
    }
}
export const prettyPrintStae = (stat)=>(
    stat?`+${numeral(stat).format("0.0a")}`: stat
)

export const showDataOnMap = (data,caseType='cases')=>
    data.map((country)=>(
        <Circle
        center={[country.countryInfo.lat,country.countryInfo.long]}
        fillOpacity={0.4}
        color={caseTypeColors[caseType].hex}
        fillColor={caseTypeColors[caseType].hex}
        radius={
            Math.sqrt(country[caseType])*caseTypeColors[caseType].multiplier
        }
        >
            <Popup>
              <div className="info-container">
                  <div className="info-flag" style={{backgroundImage:`url(${country.countryInfo.flag})`}}/>
<div className="info-name">
    {country.country}
</div>
<div className="info-confirm">
    Cases: {numeral(country.cases).format("0,0")}
</div>
    <div className="info-recovered">Recovered: {numeral(country.recovered).format("0,0")}</div>
    <div className="info-deaths">Deaths: {numeral(country.deaths).format("0,0")}</div>      
                                </div>
            </Popup>

        </Circle>
    ))

export const sortData = (data)=>{
    console.log(data)
    const sortedData = [...data]
    return sortedData.sort((a,b)=>a.cases>b.cases?-1:1)
}
    