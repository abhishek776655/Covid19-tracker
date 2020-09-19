import React,{useState,useEffect} from 'react';
import './App.css';
import {FormControl,Select,MenuItem, CardContent,Card} from '@material-ui/core'
import { Infobox } from './Components/Infobox/Infobox';
import {LineGraph} from './Components/LineGraph/LineGraph'
import Radio from '@material-ui/core/Radio';
import {Map }from './Components/Map/Map'
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import "leaflet/dist/leaflet.css";
import {prettyPrintStae} from './util/utils'
import { Alert} from '@material-ui/lab'
import {Tables} from './Components/Table/Table'
import {sortData} from './util/utils'
function App() {
  const [countries,setCountries] = useState([])
  const [country,setCountry] = useState("worldwide")
  const [countryInfo,setCountryInfo] = useState({})
  const [radio,setradio] = useState("recovered")
  const [mapCenter,setMapCenter] = useState({lat:34,lng:-40})
  const [mapZoom,setMapZoom] = useState(3)
  const [offline,setOffline] = useState(false)
  const [tableData,setTableData] = useState([])
  const [mapCountries,setMapCountries] = useState([])
 const[caseType,setCaseType]  = useState("cases")

  useEffect(()=>{
    fetch("https://disease.sh/v3/covid-19/all")
    .then((response)=>response.json())
    .then(data=>{
      setCountryInfo(data)
    
    })
  },[])
  useEffect(() => {
    const getCountriesData  = async () =>{
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response)=>response.json())
      .then((data)=>{
        console.log(data)
        const countries = data.map((country)=>({
          name:country.country,
          value:country.countryInfo.iso2,
        }));
        const sortedData = sortData(data)
        setTableData(sortedData)
        setCountries(countries)
        setMapCountries(data)
      
      })
    }
    getCountriesData()
  }, [])

  const onCountryChange = async(event)=>{
    const countryCode = event.target.value;
    setOffline(!navigator.onLine)
    setCountry(countryCode)
    const url = countryCode==='worldwide'
    ? "https://disease.sh/v3/covid-19/all"
    : `https://disease.sh/v3/covid-19/countries/${countryCode}`
    await fetch(url)
    .then(response=> response.json())
    .then(data=>{
  
      setCountry(countryCode)
      setCountryInfo(data)
      if(countryCode=="worldwide"){
        setMapCenter([34,-40])
      setMapZoom(3)
      return
      }
      setMapCenter([data.countryInfo.lat,data.countryInfo.long])
      setMapZoom(5)
    }).catch((e)=>{
      

        setCountryInfo({})
        setCountry("")
        setOffline(true)
    })


  }
  const handleRadioChange = (event)=>{
    setradio(event.target.value)
  }
 
  let off = null;
 if(offline){
   off = <Alert severity="error">Error, No Internet Connection!</Alert>
 }
  let recovered=
  <Card className="graph__recovered" >
   
  <CardContent>
  
    <LineGraph caseType="recovered"countryCode={country} bgColor="rgb(50,205,50)" borderColor="rgb(34,139,34)" title="New Recovered"/>
   
  </CardContent>

</Card> 

  if(radio=="deaths"){
    console.log("deaths")
   recovered=( <Card className="graph__deaths" >
   
    <CardContent>
    
      <LineGraph caseType="deaths" countryCode={country} bgColor="rgba(242, 38, 19, 1)" borderColor="rgba(207, 0, 15, 1)" title="New Deaths"/>
     
    </CardContent>
  
  </Card> )
  }
  return (
    <div>
    <div className="app">
  
      <div className="app__left">
        {off}
      <div className="app__header">
   <h1>
     COVID-19 TRACKER
   </h1>
   <FormControl className="app__dropdown">
    <Select
    variant="outlined"
    value={country}
    onChange={onCountryChange}>

      <MenuItem value="worldwide">Worldwide</MenuItem> 
     {
       countries.map(countries=>(
         <MenuItem value={countries.value}>{countries.name}</MenuItem> 
       ))
     }
    </Select>
   </FormControl> 
   </div>
     <div className="app__stats" >
     <Infobox isRed active = {caseType==="cases"}onClick={(e)=>setCaseType("cases")} title="Cases" cases={prettyPrintStae(countryInfo.todayCases)} total={prettyPrintStae(countryInfo.cases)}/>
     <Infobox active = {caseType==="recovered"}onClick={(e)=>setCaseType("recovered")} title="Recovered" cases={prettyPrintStae(countryInfo.todayRecovered)} total={prettyPrintStae(countryInfo.recovered)}/>
     <Infobox isRed active = {caseType==="deaths"}onClick={(e)=>setCaseType("deaths")} title="Deaths" cases={ prettyPrintStae(countryInfo.todayDeaths)} total={ prettyPrintStae(countryInfo.deaths)}/>
     </div>
     <Map  caseType= { caseType}center={mapCenter } zoom={mapZoom} countries={mapCountries}/>
      </div>
      <div className="graph__container">
      <Card className="graph">

   
   <CardContent >
   
     <LineGraph caseType="cases" countryCode={country} bgColor="rgba(204,16,52,0.75)" borderColor="#cc1034" title="New Cases"/>
    
     
   </CardContent>
 
 </Card>   
<FormControl component="fieldset" style={{marginTop:"25px",marginBottom:"15px"}}>

      <RadioGroup row aria-label="position" name="position" defaultValue="recovered" onChange={handleRadioChange}>
        <FormControlLabel
          value="deaths"
          
          control={<Radio color="primary" />}
          label="Deaths"
          labelPlacement="end"
        />
        <FormControlLabel
          value="recovered"
          control={<Radio color="primary" />}
          label="Recovered"
          labelPlacement="end"
        />
       
      </RadioGroup>
    </FormControl>
     {recovered}
      </div>
 
      
    
    </div>
    <div className="container">
    <Tables data={tableData}/>
    </div>
    </div>
  );
}

export default App;
