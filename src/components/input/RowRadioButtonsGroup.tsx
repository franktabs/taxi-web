import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { PropsWithChildren, useMemo } from 'react';


type Props = PropsWithChildren<{
    input:Array<{label:string, value:string}>
    title?:string,
    name:string,
}>

export default function RowRadioButtonsGroup({ input, title="", name}:Props) {

    const formControlMemo = useMemo(()=>{
        let myTable = [];
        let check = false
        let key = 0
        for(let value of input){
            myTable.push(<FormControlLabel key={"RowRadioButtonsGroup" + value + key} value={value.value} control={<Radio />} label={value.label} defaultChecked={!check?true:false} />)
            if (!check) check = true;
        }
        // myTable = input.map((value, key)=>{
            
        //     return(
        //         <FormControlLabel key={"RowRadioButtonsGroup"+value+key} value={value.value} control={<Radio />} label={value.label} checked={} />
        //     )
        // })
        return myTable;
    }, [input])
    return (
        <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label"> {title || name} </FormLabel>
            <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name={name }
            >
                {
                    formControlMemo
                }
            </RadioGroup>
        </FormControl>
    );
}