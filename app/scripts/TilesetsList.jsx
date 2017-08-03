import React from 'react';
import ReactDOM from 'react-dom';

export class TilesetsList extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        console.log('options:', this.props.options);
        let listElements = this.props.options.map((x,i) =>
                                                      (
              <li
                  style={{
                  "margin-left": "5px",
                  "margin-right": "5px"
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
                            marginBottom: "2px",
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
