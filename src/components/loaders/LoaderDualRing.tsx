import React from "react"
import { keyframes, styled } from "styled-components"


const rotate  = keyframes`
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
`

let Loader = styled.div`
    
  display: inline-block;
  width: 80px;
  height: 80px;


&:after {
  content: " ";
  display: block;
  width: 64px;
  height: 64px;
  margin: 8px;
  border-radius: 50%;
  border: 6px solid #fff;
  border-color: #fff transparent #fff transparent;
  animation: ${rotate} 1.2s linear infinite;
}
`
let ContentLoader = styled.div`
    width: 100vw;
    position: fixed;
    top: 0;
    left: 0;
    min-height: 100vh;
    justify-content: center;
    align-items: center;
    background-color: #00000081;
    z-index: 99;
    display: none;
`


const LoaderDualRing = React.memo(()=>{
    return (
        <ContentLoader className="loaderDualRing" id="loaderDualRing" >
            <Loader />
        </ContentLoader>
    )
})
LoaderDualRing.displayName ="LoaderDualRing"
export default LoaderDualRing