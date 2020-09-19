import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { prettyPrintStae } from "../../util/utils";



const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);



const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});

export function Tables({data}) {
  const classes = useStyles();
 
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };


 
  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Country</StyledTableCell>
            <StyledTableCell align="right">Total Cases</StyledTableCell>
            <StyledTableCell align="right">Active</StyledTableCell>
            <StyledTableCell align="right">Recovered</StyledTableCell>
            <StyledTableCell align="right">Deaths</StyledTableCell>
            <StyledTableCell align="right">Cases per million</StyledTableCell>
            <StyledTableCell align="right">Critical</StyledTableCell>
            <StyledTableCell align="right">Test</StyledTableCell>
            <StyledTableCell align="right">Test per million</StyledTableCell>
            <StyledTableCell align="right">Population</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
    
          {(rowsPerPage > 0
            ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : data
          ).map((country) => (
            <StyledTableRow key={country.country}>
              <StyledTableCell component="th" scope="row">
                {country.country}
              </StyledTableCell>
              <StyledTableCell align="right">{prettyPrintStae( country.cases)} ({prettyPrintStae(country.todayCases)})</StyledTableCell>
              <StyledTableCell align="right">{prettyPrintStae(country.active)}</StyledTableCell>
              <StyledTableCell align="right">{prettyPrintStae( country.recovered)} ({prettyPrintStae(country.todayRecovered)})</StyledTableCell>
              <StyledTableCell align="right">{prettyPrintStae(country.deaths)} ({prettyPrintStae(country.todayDeaths)})</StyledTableCell>
              <StyledTableCell align="right">{prettyPrintStae(country.casesPerOneMillion)}</StyledTableCell>
              <StyledTableCell align="right">{prettyPrintStae(country.critical)}</StyledTableCell>
              <StyledTableCell align="right">{prettyPrintStae( country.tests)}</StyledTableCell>
              <StyledTableCell align="right">{prettyPrintStae(country.testsPerOneMillion)}</StyledTableCell>
              <StyledTableCell align="right">{prettyPrintStae( country.population)}</StyledTableCell>
            </StyledTableRow>
          ))}
          
        </TableBody>
      
      </Table> <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
        
    </TableContainer>
  );
}