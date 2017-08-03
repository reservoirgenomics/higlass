import React from 'react';
import ReactDOM from 'react-dom';

export class TilesetsList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            lastSelectedIndex: 0,
            selectedIndeces : new Set([0])
        }
    }

    render() {
        //console.log('options:', this.props.options);
        let listElements = this.props.options.map((x,i) =>
                                                      (
              <li
                  style={{
                  "margin-left": "5px",
                  "margin-right": "5px",
                  "background": this.state.selectedIndeces.has(i) ? "lightblue" : "white",
                    "-webkit-touch-callout" : "none",
                    "-webkit-user-select": "none",
                    "-moz-user-select": "none",
                    "-ms-user-select": "none",
                    "user-select" : "none"
                  }} 
                  onClick={(event, value) => {
                    event.stopPropagation();

                    if (event.shiftKey) {
                        let selectedIndeces = new Set();
                        let minIndex = Math.min(this.state.lastSelectedIndex, i);
                        let maxIndex = Math.max(this.state.lastSelectedIndex, i);

                        for (let j = minIndex; j <= maxIndex; j++) 
                            selectedIndeces.add(j);
                            
                        this.setState({
                            selectedIndeces: selectedIndeces
                        });
                    } else if (event.ctrlKey || event.metaKey) {
                        let selectedIndeces = this.state.selectedIndeces;

                        if (selectedIndeces.size > 1 && selectedIndeces.has(i)) {
                            // this item is already selected, so we need to unselect it
                            //
                            console.log('removing:', i);
                            selectedIndeces.delete(i);
                        } else {
                            selectedIndeces.add(i);
                        }

                        this.setState({
                            selectedIndeces: selectedIndeces,
                            lastSelectedIndex: i
                        });
                    } else {
                        this.setState({
                            lastSelectedIndex : i,
                            selectedIndeces: new Set([i])
                        });
                    }
                  }}
              >
                  <div
                      style={{
                        "cursor": "default",
                        "padding-left": "5px",
                        "padding-right": "5px",
                        "padding-top": "2px",
                        "padding-bottom": "2px",
                        "border-bottom": (i == this.props.options.length - 1 ? "0px" : "1px solid gainsboro")
                      }} 
                  >
                      <div
                        style={{
                            marginBottom: "3px",
                            fontWeight: "bold",
                            color: "#555"
                            }}
                      >
                        {x.name}
                    </div>
                    <div 
                        style={{
                        "fontSize": 12,
                        "color": "666"
                        }}
                    >
                        <span
                            className={"coordSystem" + x.coordSystem}
                            style={{
                                paddingLeft: 4,
                                paddingRight: 4,
                                paddingTop: 2,
                                paddingBottom: 2,
                                borderRadius: 3,
                                marginRight: 2,
                                background: "#ccc"
                            }}
                        >
                            {x.coordSystem}
                        </span>
                        {" | " + x.datatype}
                    </div>
                </div>
            </li>
                                                 ));

        return(<div
            style={{ 
                    "height": 150,
                    "overflow-y": "scroll"
                }}
        >
            <ul style={{
                "padding": 0,
                "list-style-type": "none",
                "border": "1px solid black"
                }}>
                {listElements}
            </ul>
        </div>);
    }
}
