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

export default function StepperComponent() {

  const location = window.location.pathname
  const activeStepIndex = steps.indexOf(steps.filter(value => value.route === location)[0])

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStepIndex} alternativeLabel>
        {steps.map((item, index) => (
          <Step key={index} onClick={() => {window.location.href = item.route}} sx={{cursor: 'pointer'}}>
            <StepLabel>{item.name}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}