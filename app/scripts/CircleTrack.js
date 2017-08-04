import {SVGTrack} from './SVGTrack.js';
import {tileProxy} from './TileProxy.js';
import {select} from 'd3-selection';
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
        .append('path')
        .style('opacity', 0.5)
        .style('stroke-width', '4px')
        .style('stroke', 'green')

        this.gArc = this.gCenter
        .append('g');

        ChromosomeInfo(chromSizesPath, (newChromInfo) => {
            this.chromInfo = newChromInfo;  

            this.texts = [];
            this.lineGraphics = new PIXI.Graphics();

            this.gArc.selectAll('path')
                .data(this.chromInfo.cumPositions)
                .enter()
                .append('path')
                .style('stroke-width', '2')
                .style('stroke', 'grey')
                .style('fill', (d,i) => i % 2 ? 'white' : 'grey')
                .style('opacity', 0.3)

            this.gArc.selectAll('text')
            .data(this.chromInfo.cumPositions)
                .enter()
                .append('text')
                .attr('text-anchor', 'middle')
                .text(d => d.chr);

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

            this.draw();
            this.animate();
        });


    }

    draw() {
        if (!this.chromInfo)
            return;

        let totalLength = this.chromInfo.totalLength;

        let MARGIN = 15;
        let TEXT_MARGIN = 20;

        let radius = Math.min(this.dimensions[0], this.dimensions[1]) / 2 - MARGIN - TEXT_MARGIN; 

        let viewArc = arc()
            .innerRadius(radius)
            .outerRadius(radius + 5);

        let textArc = arc()
            .innerRadius(radius + TEXT_MARGIN)
            .outerRadius(radius + TEXT_MARGIN + MARGIN);

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

        console.log('this.chromInfo:', this.chromInfo)
        console.log('this.xScale.domain()', this._xScale.domain());
        console.log('path:', path);

        this.pChord
        .attr('d', path);

        function chrCentroid(d) {
            let anglePos = {
                startAngle: 2 * Math.PI * d.pos / totalLength,
                endAngle: 2 * Math.PI * (d.pos + +this.chromInfo.chromLengths[d.chr]) / totalLength
            }
            //console.log('anglePos', anglePos);
            let centroid = textArc.centroid(anglePos);

            //console.log('centroid:', centroid);
            return centroid;
        }

        let prevText = null;

        this.gArc.selectAll('text')
        .attr('x', x => chrCentroid.bind(this)(x)[0])
        .attr('y', x => chrCentroid.bind(this)(x)[1] + 7)
        .style('visibility', 'visible')
        .each(function(d) { prevText = this });

        function intersection(bbox1, bbox2) {
            let x1 = Math.max(bbox1.x, bbox2.x);
            let x2 = Math.min(bbox1.x + bbox1.width, bbox2.x + bbox2.width);

            if (x1 <= x2) {
                //x coords intersect
                let y1 = Math.max(bbox1.y, bbox2.y);
                let y2 = Math.min(bbox1.y + bbox1.height, bbox2.y + bbox2.height);

                if (y1 <= y2) {
                    // y coords intersect
                    return true;
                }

            }

            return false;
        }

        let self = this;
        this.gArc.selectAll('text')
        .each(function(d, i) {
            prevText = this;
            let prevBbox = prevText.getBBox();

            self.gArc.selectAll('text')
            .each(function(e,j) {
                if (j >= i)
                    return;

                let bbox = this.getBBox();

                //console.log(select(prevText).text(), select(this).text());
                
                if (select(this).style('visibility') != 'hidden' && select(prevText).style('visibility') != 'hidden' && intersection(prevBbox, bbox)) {
                    //console.log('hiding', select(prevText).text());
                    select(prevText)
                    .style('visibility', 'hidden');
                } else {
                    /*
                    select(this)
                    .style('visible', 'visible');
                    */
                }

            });
        });

        this.gArc.selectAll('path')
        .attr('d', d => viewArc({
            startAngle: 2 * Math.PI * d.pos / totalLength,
            endAngle: 2 * Math.PI * (d.pos + +this.chromInfo.chromLengths[d.chr]) / totalLength
        }));


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
