import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { PropsWithChildren, useMemo } from 'react';
import { ParamsTextField } from '../../Models';


type Props = PropsWithChildren<{
    input: Array<{ label: string, value: string }>
    title?: string,
    register: ParamsTextField["register"],
    name: string,
}>

export default function RowRadioButtonsGroup({ input, title = "", name, register }: Props) {

    const formControlMemo = useMemo(() => {
        let myTable = [];
        let check = false
        let key = 0
        for (let value of input) {
            myTable.push(
                <div className="form-check">
                    <input className="form-check-input" type="radio" {...register(name as any)} id={value.value} value={value.value} />
                    <label className="form-check-label" htmlFor={value.value} >
                        {value.label}
                    </label>
                </div>
            )
            if (!check) check = true;
        }
        // myTable = input.map((value, key)=>{

        //     return(
        //         <FormControlLabel key={"RowRadioButtonsGroup"+value+key} value={value.value} control={<Radio />} label={value.label} checked={} />
        //     )
        // })
        return myTable;
    }, [input, name, register])
    return (
        // <FormControl>
        //     <FormLabel id="demo-row-radio-buttons-group-label"> {title || name} </FormLabel>
        //     <RadioGroup
        //         row
        //         aria-labelledby="demo-row-radio-buttons-group-label"
        //         {...register(name as any)}
        //     >
        //         {
        //             formControlMemo
        //         }
        //     </RadioGroup>
        // </FormControl>
        <div>
            <FormControl>
                <FormLabel id="demo-row-radio-buttons-group-label"> {title || name} </FormLabel>
                <div className=" d-flex justify-content-between gap-3" >
                    {formControlMemo}
                </div>

            </FormControl>
        </div>
    );
}