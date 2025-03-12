// frontend/components/LoadingDots.js
import { Box, Typography } from "@mui/material";
import { keyframes } from "@emotion/react";

const dotAnimation = keyframes`
  0% { opacity: 0.2; transform: translateX(0); }
  20% { opacity: 1; transform: translateX(4px); }
  40% { opacity: 0.2; transform: translateX(0); }
  100% { opacity: 0.2; transform: translateX(0); }
`;

export default function LoadingDots() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh", // pełna wysokość widoku, by wycentrować
      }}
    >
      <Typography variant="h6" sx={{ display: "flex", alignItems: "center" }}>
        <Box
          component="span"
          sx={{
            display: "inline-block",
            ml: 1,
            "& span": {
              display: "inline-block",
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: "#ff7f00",
              mr: "4px",
              animation: `${dotAnimation} 1s infinite ease-in-out`,
            },
            "& span:nth-of-type(2)": {
              animationDelay: "0.2s",
            },
            "& span:nth-of-type(3)": {
              animationDelay: "0.4s",
            },
          }}
        >
          <span></span>
          <span></span>
          <span></span>
        </Box>
      </Typography>
    </Box>
  );
}
