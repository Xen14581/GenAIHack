import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

const steps = [
    {name : 'Learn', route: '/learn'},
    {name: 'Test', route: '/learn/quiz'},
    {name: 'Code', route: '/learn/code'}
];

export default function StepperComponent(props) {
  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={props.stage} alternativeLabel>
        {steps.map((item, index) => (
          <Step key={index}>
            <StepLabel>{item.name}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}