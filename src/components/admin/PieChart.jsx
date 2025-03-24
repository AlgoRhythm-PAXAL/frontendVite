// import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
// import { desktopOS, valueFormatter } from './webUsageStats';
// import { styled } from '@mui/material/styles';
// import { useDrawingArea } from '@mui/x-charts/hooks';

// export default function PieArcLabel() {
//   return (
//     <PieChart
//       series={[{
//           arcLabel: (item) => `${item.value}%`,
//           arcLabelMinAngle: 35,
//           arcLabelRadius: '60%',
//           ...data,
//           innerRadius: 50,
//           outerRadius: 100,
//           paddingAngle: 1,
//           cornerRadius: 5,
//           startAngle: -180,
//           endAngle: 225,
//           cx: 150,
//           cy: 150,
//         },
//       ]}
//       sx={{
//         [`& .${pieArcLabelClasses.root}`]: {
//           fontWeight: 'bold',
//         },
//       }}
//       {...size}
//     >
//       <PieCenterLabel>Full Parcel Count</PieCenterLabel>
//      </PieChart> 
//   );
// }

// const StyledText = styled('text')(({ theme }) => ({
//   fill: theme.palette.text.primary,
//   textAnchor: 'middle',
//   dominantBaseline: 'central',
//   fontSize: 15,
// }));

// function PieCenterLabel({ children }) {
//   const { width, height, left, top } = useDrawingArea();
//   return (
//     <StyledText x={left + width / 2} y={top + height / 2}>
//       {children}
//     </StyledText>
//   );
// }


// const size = {
//   width: 400,
//   height: 350,
// };

// const data = {
//   data: desktopOS,
//   valueFormatter,
// };




import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import { desktopOS, valueFormatter } from './webUsageStats';
import { styled } from '@mui/material/styles';
import { useDrawingArea } from '@mui/x-charts/hooks';
import { Box } from '@mui/material';

export default function PieArcLabel() {
  return (
    <Box
      sx={{
        backgroundColor: '#ffffff', // Light grey background
        padding: 0,
        borderRadius: 3,
        boxShadow: 3,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        
      }}
    >
      <PieChart
        series={[
          {
            arcLabel: (item) => `${item.value}%`,
            arcLabelMinAngle: 35,
            arcLabelRadius: '60%',
            ...data,
            innerRadius: 50,
            outerRadius: 100,
            paddingAngle: 1,
            cornerRadius: 5,
            startAngle: -180,
            endAngle: 225,
            cx: 150,
            cy: 150,
          },
        ]}
        sx={{
          [`& .${pieArcLabelClasses.root}`]: {
            fontWeight: 'bold',
          },
        }}
        {...size}
      >
        <PieCenterLabel>7 Parcels
        </PieCenterLabel>
      </PieChart>
    </Box>
  );
}

const StyledText = styled('text')(({ theme }) => ({
  fill: theme.palette.text.primary,
  textAnchor: 'middle',
  dominantBaseline: 'central',
  fontSize: 15,
  fontWeight:'bold',
}));

function PieCenterLabel({ children }) {
  const { width, height, left, top } = useDrawingArea();
  return (
    <StyledText x={left + width / 2} y={top + height / 2}>
      {children}
    </StyledText>
  );
}

const size = {
  width: 400,
  height: 310,
};

const data = {
  data: desktopOS,
  valueFormatter,
};
