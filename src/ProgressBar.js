import * as React from 'react';


export var ProgressBar =  ({width, percent, color}) => {
  
    const [value, setValue] = React.useState(0);

    React.useEffect(() => {
      setValue(percent * width);
    });
  
    return (
      <div>
        <div className="progress-div" style={{ width: width }}>
            <div style={{ width: `${value}px` }} className={color} />
        </div>
      </div>
    )
}