import '../styles/SVGTrack.css';
import {axisTop} from 'd3-axis';
import {SVGTrack} from './SVGTrack.js';

export class TopAxisTrack extends SVGTrack {
    constructor(svgElement) {
        super(svgElement);

        this.axis = axisTop(this._xScale);
        this.gAxis = this.gMain.append('g')
    }

    setDimensions(newDimensions) {
        super.setDimensions(newDimensions);

        // we generally want to be able display ticks for values in the billions
        // which means that we need extra spacing in our ticks
        this.axis.ticks(Math.ceil(this.dimensions[0] / 150));

        this.gAxis.attr('transform', `translate(0,${newDimensions[1]})`);
    }


    draw() {
        this.axis.scale(this._xScale);

        this.gAxis.call(this.axis);

        return this;
    }
}