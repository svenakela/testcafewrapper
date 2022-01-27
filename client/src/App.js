import './App.css';
import { useEffect, useState } from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

function App() {
  
  const apiPath = '/specs/v1/';
  const [snackState, setSnackState] = useState({
    open: false,
    output: ''
  });
  const [specifications, setSpecification] = useState([]);
  const [response, setResponse] = useState([]);
  const [stateValues, setValue] = useState({
    specification: {},
    readyToGo: false,
    readyToCopy: false
  });
  
  const fetchJsonFromResponse = async (response) => {
    if (!response.ok) throw Error(response.statusText);
    const json = await response.json();
    if (json.hasOwnProperty('values') && Array.isArray(json.values)) {
      return json;
    } else {
      setSnackState({open:true, output:`Oh no! ${stateValues.specification.spec} failed.`});
      throw Error('Lord No my bradda Geezus!');
    }
  };

  const fetchSpecData = () => {
    setValue({readyToGo: false});
    fetch(apiPath + stateValues.specification.spec, {method: 'POST'})
      .then(fetchJsonFromResponse)
      .then(json => setResponse(json.values))
      .then(() => setValue({readyToCopy: true}))
      .catch(console.log);
  };

  const onSelectChange = (event, result) => {
    const ready = result == null ? false : true;
    setValue({specification: result, readyToGo: ready});
  }

  const copyResult = () => {
    navigator.clipboard.writeText(response.map(row => row.value).join('\n'));
  }

  const alertClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackState({open:false, output:''});
  }

  useEffect(() => {
    fetch(apiPath)
      .then(res => res.json())
      .then(json => setSpecification(json.specs));
  }, []);

  return (
    <>
      <div id='search' className='search'>
        <Autocomplete
          style={{width: '80%'}}
          id='specSelect'
          options={specifications}
          getOptionLabel={(option) => option.spec}
          renderInput={(params) => <TextField {...params} label='Find Job to Execute' variant='outlined' />}
          onChange={onSelectChange}
        />
        <Button
          id='goButton'
          variant='contained' 
          disabled={!stateValues.readyToGo}
          style={{flex: 1}} 
          onClick={() => fetchSpecData()} >
          Let's Go!
        </Button>
        <Button
          id="copyButton"
          variant='contained' 
          disabled={!stateValues.readyToCopy}
          style={{flex: 1}} 
          onClick={() => copyResult()} >
          Copy Result
        </Button>
      </div>
      <Snackbar open={snackState.open} autoHideDuration={10_000} onClose={alertClose}>
        <MuiAlert onClose={alertClose} severity="error">
          {snackState.output}
        </MuiAlert>
      </Snackbar>
      <div className='table'>
        <TableContainer component={Paper}>
          <Table size='small' aria-label='Result'>
            <TableBody>
              {response.map(row => (
                <TableRow key={row.key}>
                  <TableCell>{row.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
}

export default App;

