import { Button } from "@mui/material"
import type { PropsWithChildren } from "react"
import { styled } from "styled-components"
import { Compte } from "../../../Models"


type Props = PropsWithChildren<{
    user?: Compte,
    title?:string,
    choiceUser?:string,
    handleSubmit?: (event:any) => void
}>

const IconLogo = styled.div`
    box-shadow: 0 5px 5px #2c4b62 ;
    background: linear-gradient(195deg, #00d6da, #1a73e8);
`

export default function ContainerForm({title="CONNEXION", choiceUser, handleSubmit, children }: Props) {
    return (
        <div className=' bg-white p-3 rounded-3 shadow-lg' style={{ maxWidth: "400px" }}>
            <div>
                <IconLogo className=' text-center text-white rounded-3 translate-middle-y p-3'>
                    <h2>{title}</h2>
                </IconLogo>
            </div>
            <div className=' d-flex flex-wrap gap-4 ' >
                
                <form className=" d-flex flex-wrap gap-3 justify-content-center px-2" id="formLogin" style={{ marginTop: "-30px", maxHeight: "80vh", overflowY: "auto" }} >

                    <span className=" fw-bold text-center fs-3" >{choiceUser}</span>
                    <div className=" d-flex flex-wrap gap-3 justify-content-center" >
                        {
                            children
                        }
                    </div>
                    
                    <Button variant='contained' color="success" className='fs-5 ' type="submit" onClick={handleSubmit} >Soumettre</Button>
                </form>
            </div>
        </div>
    )
}
