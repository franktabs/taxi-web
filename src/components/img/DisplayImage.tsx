import { styled } from "styled-components"
import { Administrateur, Chauffeur, Commercial } from "../../Models"
import { UserTableUser } from "../table/TableUser"
import { MdCameraAlt } from "react-icons/md"
import { MouseEvent, useCallback, useRef } from "react"

type Props = {
    user: UserTableUser,
    url: string,
    alt: string,
    name: string,
    title?: string,
    getFile?: boolean,
}

const Image4x4Styled = styled.div<{getFile:boolean}>`
    width: 100px;
    height: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    background-color: #00000039;
        overflow: hidden;


    & .photo-link{
        display: block;
        height: 100%;
        width: 100%;
    }

    & .photo-img{
        height: 100%;
    }
    & input{
        display: none;
    }

    & label{
        position: absolute;
        bottom: 0;
        line-height: 1em;
        display: block;
        height: 0px;
        width: 100%;
        text-align: center;
        background-color: #000000f3;
        transition: heignt .5s;
        overflow: hidden;
        color: white;
    }

    & label:hover{
        cursor: pointer;
        background-color: #ffbf00c9;
    }

    & label span{
        display: block;
        padding-top: 10px;
    }

    &:hover label{
        
        height: 60px;
    }
`

export default function DisplayImage({ user, url, alt, name, title="Voir Photo", getFile=false }: Props) {

    const aRef = useRef<HTMLAnchorElement>(null)

    const handleClick = useCallback((e:MouseEvent)=>{
        if(!getFile){
            e.preventDefault();
        }
        aRef?.current?.click()

    },[getFile])

    return (
        <div>
            <Image4x4Styled getFile={true} >
                <a href={url} ref={aRef} className="photo-link" target="_blank" rel="noreferrer" ><img src={url} alt={alt} className="photo-img" /></a>
                <input type="file" name={name} id={("displayImage" + name)} />
                <label htmlFor={("displayImage" + name)} onClick={handleClick} > <span>{title} <MdCameraAlt className=" fs-4" /> </span></label>
            </Image4x4Styled>
        </div>
    )
}
