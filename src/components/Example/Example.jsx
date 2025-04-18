import {
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart
} from 'recharts';
import { data as initialData } from './data.js'
import { calculateZ } from "../../utils/calculateZScore.js";
import { useMemo, useRef } from "react";

const minZScore = 1

const Example = () => {
    const {current: data} = useRef(calculateZ(initialData))

    const getColor = (value) => {
        if (value >= minZScore) return "tomato";
        return "lightgreen";
    }

    const calculateStops = (boundaries, data) => {
        const totalLength = data.length - 1;
        const stops = [];

        stops.push({offset: "0%", color: "lightgreen"});

        boundaries.forEach(([start, end]) => {
            const startOffset = (start / totalLength) * 100;
            const endOffset = (end / totalLength) * 100;

            stops.push({offset: `${startOffset}%`, color: "lightgreen"});
            stops.push({offset: `${startOffset}%`, color: "tomato"});

            stops.push({offset: `${endOffset}%`, color: "tomato"});
            stops.push({offset: `${endOffset}%`, color: "lightgreen"});
        });

        stops.push({offset: "100%", color: "lightgreen"});
        return stops;
    };

    const offsets = useMemo(() => {
        const boundaries = []
        const highZScoreIndices = data
            .map((item, index) => (item.zScore > minZScore ? index : null))
            .filter((index) => index !== null);
        let start = highZScoreIndices[0];

        for (let i = 1; i < highZScoreIndices.length; i++) {
            if (highZScoreIndices[i] !== highZScoreIndices[i - 1] + 1) {
                boundaries.push([start, highZScoreIndices[i - 1]]);
                start = highZScoreIndices[i];
            }
        }
        boundaries.push([start, highZScoreIndices[highZScoreIndices.length - 1]]);

        return calculateStops(boundaries, data)
    }, [])

    const CustomizedDot = (props) => {
        const {cx, cy, payload: {zScore}} = props;
        return (<circle
            cx={cx}
            cy={cy}
            r={3}
            fill={getColor(zScore)}
            strokeWidth={3}
        />);
    };

    return (<ResponsiveContainer width="100%" height="100%">
        <AreaChart
            data={data}
            margin={{
                top: 5, right: 30, left: 20, bottom: 5,
            }}
        >
            <CartesianGrid strokeDasharray="3 3"/>
            <XAxis dataKey="name"/>
            <YAxis/>
            <Tooltip/>
            <Legend/>
            <defs>
                <linearGradient id="splitColor" x1="0" y1="1" x2="1" y2="1">
                    {offsets.map((stop, index) => (<stop
                        key={index}
                        offset={stop.offset}
                        stopColor={stop.color}
                    />))}
                </linearGradient>
            </defs>
            <Area type="monotone"
                  dot={<CustomizedDot/>}
                  dataKey="value"
                  stroke={'transparent'}
                  fill="url(#splitColor)"/>
        </AreaChart>
    </ResponsiveContainer>)
}


export default Example
