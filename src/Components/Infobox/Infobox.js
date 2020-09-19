import React from 'react'
import "./Infobox.css"
import {Card,CardContent,Typography} from '@material-ui/core'
export const Infobox = (props) => {
    return (
       <Card 
            onClick={props.onClick}
       className={`infoBox ${props.active&& 'infoBox--selected'} ${props.isRed && 'infoBox--red'}`} >

           <CardContent className={'infobox__card'}>
               <Typography className= "infoBox__title" color="textSecondary">
                   {props.title}
               </Typography>
               <h2 className={`infoBox__cases ${!props.isRed&&"infoBox__cases--green"}`}>
                   {props.cases}
               </h2>
               <Typography className="infoBox__total" color="textSecondary">
                   {props.total} Total
               </Typography>
           </CardContent>
       </Card>
    )
}
