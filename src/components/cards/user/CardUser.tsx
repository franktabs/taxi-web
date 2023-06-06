import { MouseEvent, PropsWithChildren } from "react";



import { styled } from "styled-components";


export interface PropsDataUser extends PropsWithChildren {
    title: { nom: string, className: string };
    data?: {
        nbr: number, //nombre
        nv: number, //nouveau
        rfs: number //refuser 
    };
    dates?: { date1?: string, date2?: string };
}


interface Props extends PropsDataUser {
    handleClick?: (event: MouseEvent) => void
}

const Container = styled.div`
    height: 150px;
    max-width: 390px;
    cursor: pointer;
    min-width: 380px;
`




export default function CardUser({ title, data, dates, handleClick, children }: Props) {
    return (
        <Container
            className="bg-white  rounded-3 align-content-between d-flex flex-column justify-content-between shadow-lg "
            onClick={handleClick}
        >
            <div className="d-flex justify-content-between p-2 align-items-start">
                {children}
                <div className=' pe-3 text-center' >
                    <span style={{ fontSize: "1.5em" }} className={" fw-bolder " + title.className}>{title.nom}</span> <br />
                    <span
                        style={{ color: "blue", fontWeight: "bolder", fontSize: "1.9em" }}
                    >
                        {data?.nbr}
                    </span>
                </div>
            </div>
            <div>
                <hr style={{ margin: "0px" }} />
                <div className=" d-flex justify-content-between px-1" >
                    <div style={{ margin: "0px", padding: "2px" }} className="d-flex align-items-center"  >
                        <p style={{ fontSize: "1.8em", color: "#00d700", fontWeight: "bold" }}>
                            +{data?.nv}
                        </p>
                        <p style={{ fontSize: ".95em" }} className=' ps-2 fst-italic'> {dates?.date1} </p>{" "}
                    </div>
                    <div style={{ margin: "0px", padding: "2px" }} className="d-flex align-items-center"  >
                        <p style={{ fontSize: "1.8em", color: "red", fontWeight: "bold" }}>
                            {data?.rfs}
                        </p>
                        <p style={{ fontSize: ".95em" }} className=' ps-2 fst-italic'>{dates?.date2}</p>{" "}
                    </div>
                </div>
            </div>
        </Container>
    )
}

