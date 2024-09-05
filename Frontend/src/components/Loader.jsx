import { Box } from "@mui/material"
import {ReactComponent as Logo} from "../assets/Logo.svg"
import {ReactComponent as InvertedLogo} from "../assets/Logo-rev.svg"

const Loader = ({logoWidth, logoHeight, inverted}) => {
    return (
        <Box sx={{
            "@keyframes spin": {
                "0%": { transform: "rotate(0deg)" },
                "100%": {  transform: "rotate(359deg)" },
            },
            animation: "spin 16s linear infinite;",
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            {
                inverted 
                ? <InvertedLogo width={logoWidth} height={logoHeight} /> 
                : <Logo width={logoWidth} height={logoHeight} />
            }
        </Box>
    )
}

export default Loader;

// Example usage

// <Box sx={{backgroundColor: "#ddd", display: 'flex', alignItems: 'center'}}>
//   <Loader logoHeight="5vh" logoWidth="5vh" logoColor="#000" />
// </Box>