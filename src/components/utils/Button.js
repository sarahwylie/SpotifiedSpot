import styled from 'styled-components'

const Button = styled.button`
width: 200px;
height: "50px"
border: 1px solid black;
background: "lightgray";
border-radius: 3px;
color: #black;
font-size: 20px;
&: hover {
    cursor: pointer;
    background: darkgray;
}
`

export default Button;