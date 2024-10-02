import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

const steps = [
    {name : 'Learn', route: '/learn/chat'},
    {name: 'Test', route: '/learn/quiz'},
    {name: 'Code', route: '/learn/code'}
];

export default function StepperComponent({active}) {
  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={active} alternativeLabel>
        {steps.map((item, index) => (
          <Step 
            key={index} 
            onClick={() => {
              if (index <= active) {
                window.location.href = item.route
              }
            }} 
            sx={{cursor: index <= active ? 'pointer' : 'auto'}}
          >
            <StepLabel>{item.name}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}