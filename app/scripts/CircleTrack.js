import {SVGTrack} from './SVGTrack.js';
import {tileProxy} from './TileProxy.js';
import {arc} from 'd3-shape';
import {ribbon} from 'd3-chord';

import {
    colorToHex
} from './utils.js';
import {ChromosomeInfo} from './ChromosomeInfo.js';


export class CircleTrack extends SVGTrack {
    constructor(svgElement, server, uid, handleTilesetInfoReceived, options, animate) {
        super(svgElement, true);

        this.searchField = null;
        this.chromInfo = null;
        this.animate = animate;
        let chromSizesPath = null;

        if (!chromSizesPath) {
            chromSizesPath = server + "/chrom-sizes/?id=" + uid;
        }

        // center the arc
        this.gCenter = this.gMain
            .append('g');

        this.pChord = this.gCenter
        .style('opacity', 0.5)
        .style('stroke-width', '4px')
        .style('stroke', 'green')
        .append('path');

        this.gArc = this.gCenter
        .append('g');

        ChromosomeInfo(chromSizesPath, (newChromInfo) => {
            this.chromInfo = newChromInfo;  

            this.texts = [];
            this.lineGraphics = new PIXI.Graphics();

            for (let i = 0; i < this.chromInfo.cumPositions.length; i++) {
                let thisTexts = [];

                for (let j = 0; j < this.chromInfo.cumPositions.length; j++) {
                    let textStr = this.chromInfo.cumPositions[i].chr + "/" + this.chromInfo.cumPositions[j].chr;
                    let text = new PIXI.Text(textStr, 
                                {fontSize: "14px", fontFamily: "Arial", fill: "red"}
                                );

                    text.anchor.x = 0.5;
                    text.anchor.y = 0.5;
                    text.visible = false;

                    //give each string a random hash so that some get hidden 
                    // when there's overlaps
                    text.hashValue = Math.random();

                    thisTexts.push(text);
                }

                this.texts.push(thisTexts);
            }

            console.log('this.chromInfo:', this.chromInfo);

            this.draw();
            this.animate();
        });


    }

    draw() {
        if (!this.chromInfo)
            return;

        let totalLength = this.chromInfo.totalLength;

        let MARGIN = 5;
        let TEXT_MARGIN = 20;

        let radius = Math.min(this.dimensions[0], this.dimensions[1]) / 2 - MARGIN - TEXT_MARGIN; 

        let viewArc = arc()
            .innerRadius(radius)
            .outerRadius(radius + TEXT_MARGIN);

        console.log('arc');

        let viewRibbon = ribbon()
            .radius(radius);

        let startXDomain = Math.max(this._xScale.domain()[0], 0);
        let endXDomain = Math.min(this._xScale.domain()[1], totalLength);

        let startYDomain = Math.max(this._yScale.domain()[0], 0);
        let endYDomain = Math.min(this._yScale.domain()[1], totalLength);

        console.log('startXDomain', startXDomain, endXDomain);
        console.log('startYDomain', startYDomain, endYDomain);

        let path = viewRibbon({
            source: { 
                startAngle: 2 * Math.PI * (startXDomain / totalLength),
                endAngle: 2 * Math.PI * (endXDomain / totalLength)
            },
            target: { 
                startAngle: 2 * Math.PI * (startYDomain / totalLength),
                endAngle: 2 * Math.PI * (endYDomain / totalLength)
            }
        });

        console.log('this.chromInfo:', totalLength)
        console.log('this.xScale.domain()', this._xScale.domain());
        console.log('path:', path);

        this.pChord
        .attr('d', path);

        super.draw();
    }

    setDimensions(newDimensions) {
        super.setDimensions(newDimensions);

        this.gCenter.attr(
            'transform', 'translate(' + newDimensions[0] / 2 + ',' + newDimensions[1] / 2 + ')');
    }

    zoomed(newXScale, newYScale) {
        this.xScale(newXScale);
        this.yScale(newYScale);

        this.draw();

    }
}
